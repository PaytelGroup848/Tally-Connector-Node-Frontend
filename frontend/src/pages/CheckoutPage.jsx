import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  CreditCard,
  Clock,
  Users,
  Sparkles,
  Receipt,
  Lock,
  ChevronLeft,
  BadgeCheck,
  Building2,
  Layers,
} from "lucide-react";
import { useMemo, useState } from "react";

import { createPaymentOrder, verifyPayment } from "../services/paymentApi";
import useAuthStore from "../store/authStore";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

/* =========================================================
   LOAD RAZORPAY
========================================================= */

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

const CheckoutPage = ({
  selectedPlanData,
  selectedDurationData,
  setSelectedDuration,
  accessToken,
  extraSeats,
  setExtraSeats,
  basePlanPrice,
  addonPricePerSeat,
  extraSeatTotal,
  totalAmount,
  onBack,
  PlanIcon,
  featureLabels,
  formatPrice,
}) => {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  /* =======================================================
     GST
  ======================================================= */

  const GST_PERCENT = 18;

  const estimatedSubtotal = Number(totalAmount) || 0;
  const estimatedGstAmount =
    Math.round(estimatedSubtotal * (GST_PERCENT / 100) * 100) / 100;
  const estimatedGrandTotal = estimatedSubtotal + estimatedGstAmount;

  const billableExtraSeats = Math.max(0, Number(extraSeats) - 1);

  /* =======================================================
     FEATURES
  ======================================================= */

  const features = useMemo(() => {
    if (!Array.isArray(selectedPlanData?.features)) return [];

    return [
      ...new Set(
        selectedPlanData.features
          .filter(Boolean)
          .map((feature) => String(feature).trim())
          .filter(Boolean),
      ),
    ];
  }, [selectedPlanData]);

  const featureGridClass =
    features.length >= 13
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : features.length >= 9
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2";

  /* =======================================================
     CREATE ORDER
  ======================================================= */

  const handleCreateOrder = async () => {
    const safeAddonPrice = Number(addonPricePerSeat) || 0;
    const safeExtraSeats = Number(extraSeats) || 0;
    const billableExtra = Math.max(0, safeExtraSeats - 1);
    const safeTotalAmount = Number(totalAmount) || 0;

    if (safeTotalAmount <= 0) {
      setOrderMessage("Invalid payment amount.");
      return;
    }

    if (safeAddonPrice < 0) {
      setOrderMessage("Invalid additional user price.");
      return;
    }

    if (!selectedPlanData?.id) {
      setOrderMessage("Invalid plan selected.");
      return;
    }

    if (!selectedDurationData?.months) {
      setOrderMessage("Invalid plan duration.");
      return;
    }

    if (!accessToken) {
      setOrderMessage("Please login before making a payment.");
      return;
    }

    setIsCreatingOrder(true);
    setOrderMessage("");

    try {
      const response = await createPaymentOrder({
        accessToken,
        planId: selectedPlanData?.id,
        durationMonths: selectedDurationData?.months,
        extraSeats: billableExtra,
        totalSeats: safeExtraSeats,
        addonPricePerSeat: safeAddonPrice,
        totalAmount: safeTotalAmount,
      });

      const order =
        response?.data?.order || response?.data || response?.order || response;

      const orderId =
        order?.id ||
        order?.orderId ||
        order?.razorpay_order_id ||
        response?.razorpay_order_id ||
        response?.razorpayOrderId;

      const razorpayKey =
        order?.key ||
        order?.keyId ||
        order?.key_id ||
        order?.razorpayKeyId ||
        response?.key ||
        response?.keyId ||
        response?.key_id ||
        response?.razorpayKeyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      const amount =
        Number(order?.amount) > 0
          ? Number(order.amount)
          : Math.round(safeTotalAmount * 100);

      const currency = order?.currency || response?.currency || "INR";

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid payment amount.");
      }

      if (!orderId || !razorpayKey) {
        throw new Error(
          "Payment order response is missing Razorpay order details.",
        );
      }

      await loadRazorpay();

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount,
        currency,
        name: "CtrlBooks",
        description: `${selectedPlanData?.name || "Plan"} subscription`,
        order_id: orderId,

        handler: async (payment) => {
          setIsCreatingOrder(true);
          setOrderMessage("Verifying payment...");

          try {
            const verification = await verifyPayment({
              accessToken,
              razorpay_order_id: payment?.razorpay_order_id,
              razorpay_payment_id: payment?.razorpay_payment_id,
              razorpay_signature: payment?.razorpay_signature,
            });

            if (verification?.success === false) {
              throw new Error(
                verification?.message || "Payment verification failed.",
              );
            }

            const authStore = useAuthStore.getState();

            const verifiedUser =
              verification?.user ||
              verification?.data?.user ||
              verification?.data ||
              {};

            if (authStore?.accessToken) {
              const isActive =
                verifiedUser?.activeSubscription === true ||
                verifiedUser?.subscriptionActive === true ||
                verifiedUser?.isActiveSubscription === true ||
                verifiedUser?.isSubscribed === true ||
                verifiedUser?.subscription?.active === true ||
                verifiedUser?.plan?.active === true ||
                ["active", "paid", "success"].includes(
                  String(
                    verifiedUser?.subscriptionStatus ||
                      verifiedUser?.status ||
                      verifiedUser?.subscription?.status ||
                      verifiedUser?.plan?.status ||
                      "",
                  ).toLowerCase(),
                );

              const normalizedUser = {
                ...(authStore.user || {}),
                ...(verifiedUser || {}),
                activeSubscription: isActive,
                subscriptionActive: isActive,
                subscriptionStatus:
                  verifiedUser?.subscriptionStatus ||
                  verifiedUser?.status ||
                  verifiedUser?.subscription?.status ||
                  verifiedUser?.plan?.status ||
                  "active",
                status:
                  verifiedUser?.status ||
                  verifiedUser?.subscriptionStatus ||
                  verifiedUser?.subscription?.status ||
                  verifiedUser?.plan?.status ||
                  "active",
                paymentVerified: true,
              };

              authStore.setAuth({
                accessToken: authStore.accessToken,
                user: normalizedUser,
              });
            }

            window.history.replaceState({}, "", "/dashboard");
            window.dispatchEvent(new PopStateEvent("popstate"));
          } catch (error) {
            setOrderMessage(error?.message || "Payment verification failed.");
            setIsCreatingOrder(false);
          }
        },

        modal: {
          ondismiss: () => {
            setIsCreatingOrder(false);
            setOrderMessage("Payment window closed.");
          },
        },
      });

      razorpay.on("payment.failed", (payment) => {
        setIsCreatingOrder(false);
        setOrderMessage(
          payment?.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      setOrderMessage(error?.message || "Unable to create payment order.");
      setIsCreatingOrder(false);
    } finally {
      if (!window.Razorpay) {
        setIsCreatingOrder(false);
      }
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={onBack}
          className="group mb-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:text-xs"
        >
          <ChevronLeft
            size={13}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back
        </button>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr]">
            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="border-b border-slate-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
              {/* =============================================
                  HEADER WITH ICON
              ============================================= */}

              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-[#0284C7] text-white shadow-sm">
                  <Layers size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Configure {selectedPlanData?.name || "Plan"} plan
                  </h1>
                  <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
                    Customize your plan specifications
                  </p>
                </div>
              </div>

              {/* =============================================
                  PLAN SPECIFICATIONS
              ============================================= */}

              <div className="mb-6">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Plan Specifications
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* USERS */}

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Users size={15} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Users
                      </span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-slate-900">
                      {extraSeats} {extraSeats === 1 ? "User" : "Users"}
                    </div>
                  </div>

                  {/* DURATION */}

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <div className="flex items-center gap-2 text-green-600">
                      <Clock size={15} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Duration
                      </span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-slate-900">
                      {selectedDurationData?.fullLabel || "—"}
                    </div>
                  </div>

                  {/* BASE SEATS */}

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <div className="flex items-center gap-2 text-blue-600">
                      <ShieldCheck size={15} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Admin + 1 User (Default)
                      </span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-slate-900">
                      {selectedPlanData?.seatLimit || 1}
                    </div>
                  </div>

                  {/* ADDON PRICE */}

                  <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                    <div className="flex items-center gap-2 text-green-600">
                      <Sparkles size={15} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Per Extra User
                      </span>
                    </div>
                    <div className="mt-1.5 text-base font-bold text-slate-900">
                      ₹{formatPrice(addonPricePerSeat)}
                    </div>
                  </div>
                </div>
              </div>

              {/* =============================================
                  TOTAL USERS COUNTER
              ============================================= */}

              <div className="mb-6">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Total Users
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      Additional users
                    </div>
                    <div className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
                      ₹{formatPrice(addonPricePerSeat)} per user
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setExtraSeats((c) => Math.max(1, Number(c) - 1))
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-95"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[28px] text-center text-base font-bold text-slate-900">
                      {extraSeats}
                    </span>

                    <button
                      type="button"
                      onClick={() => setExtraSeats((c) => Number(c) + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700 transition hover:bg-green-100 active:scale-95"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* =============================================
                  INCLUDED FEATURES
              ============================================= */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    Included Features
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-green-700">
                    <BadgeCheck size={12} />
                    {selectedPlanData?.name}
                  </div>
                </div>

                <div
                  className={`grid ${featureGridClass} content-start gap-x-4 gap-y-2`}
                >
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex min-w-0 items-start gap-1.5"
                    >
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={9} strokeWidth={3} />
                      </div>
                      <span className="min-w-0 break-words text-[10px] leading-4 text-slate-600">
                        {featureLabels?.[feature] || feature}
                      </span>
                    </div>
                  ))}

                  {features.length === 0 && (
                    <div className="col-span-full py-3 text-center text-[10px] text-slate-400">
                      No features available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="bg-slate-50/60 p-5 sm:p-6">
              {/* =============================================
                  BILLING TENURE
              ============================================= */}

              {/* =============================================
    BILLING TENURE
============================================= */}

              <div className="mb-6">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Billing Tenure
                </div>

                <div className="space-y-2">
                  {selectedPlanData?.pricingOptions?.map((pricing) => {
                    const months = Number(pricing.durationMonths);
                    const isSelected =
                      Number(selectedDurationData?.months) === months;

                    const label =
                      months === 6
                        ? "6 Months"
                        : months === 12
                          ? "1 Year"
                          : months === 24
                            ? "2 Years"
                            : `${months} Months`;

                    return (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setSelectedDuration?.(months)}
                        className={`flex w-full items-center justify-between rounded-xl border bg-white p-3 text-left transition-all ${
                          isSelected
                            ? "border-green-500 ring-1 ring-green-500/30 shadow-sm"
                            : "border-slate-200 hover:border-green-300 hover:bg-green-50/40"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {label}
                          </div>
                          {pricing.discountPercent > 0 && (
                            <div className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-semibold text-green-700">
                              Save {pricing.discountPercent}%
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">
                            ₹{formatPrice(pricing.price)}
                          </span>

                          {isSelected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                              <Check size={11} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =============================================
                  ORDER SUMMARY
              ============================================= */}

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Order Summary
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">
                      ₹{formatPrice(estimatedSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">GST (18%)</span>
                    <span className="font-semibold text-slate-900">
                      ₹{formatPrice(estimatedGstAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                    <span className="text-sm font-bold text-slate-900">
                      Total Due
                    </span>
                    <span className="text-base font-extrabold text-[#16A34A]">
                      ₹{formatPrice(estimatedGrandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* =============================================
                  MESSAGE
              ============================================= */}

              {orderMessage && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-[10px] leading-4 text-amber-800 sm:text-[11px]">
                  {orderMessage}
                </div>
              )}

              {/* =============================================
                  PAY NOW BUTTON
              ============================================= */}

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={
                  isCreatingOrder ||
                  !accessToken ||
                  !selectedPlanData?.id ||
                  !selectedDurationData?.months
                }
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#15803D] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingOrder ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard size={15} />
                    PAY NOW
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <Lock size={11} />
                SECURED BY RAZORPAY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
