import {
  ArrowRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react'
import { useState } from 'react'

import {
  createPaymentOrder,
  verifyPayment,
} from '../services/paymentApi'

const RAZORPAY_SCRIPT_URL =
  'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpay() {
  if (window.Razorpay) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    )

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        resolve,
        { once: true },
      )

      existingScript.addEventListener(
        'error',
        reject,
        { once: true },
      )

      return
    }

    const script = document.createElement('script')

    script.src = RAZORPAY_SCRIPT_URL
    script.async = true

    script.onload = resolve

    script.onerror = () =>
      reject(
        new Error(
          'Unable to load Razorpay checkout',
        ),
      )

    document.body.appendChild(script)
  })
}

const CheckoutPage = ({
  selectedPlanData,
  selectedDurationData,
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
  const [
    isCreatingOrder,
    setIsCreatingOrder,
  ] = useState(false)

  const [
    orderMessage,
    setOrderMessage,
  ] = useState('')

  /* =====================================================
     CREATE PAYMENT ORDER
  ===================================================== */

  const handleCreateOrder = async () => {
    const safeAddonPrice =
      Number(addonPricePerSeat) || 0

    const safeExtraSeats =
      Number(extraSeats) || 0

    const billableExtraSeats =
      Math.max(0, safeExtraSeats - 1)

    const safeTotalAmount =
      Number(totalAmount) || 0

    if (safeTotalAmount <= 0) {
      setOrderMessage(
        'Invalid payment amount.',
      )
      return
    }

    if (safeAddonPrice < 0) {
      setOrderMessage(
        'Invalid additional seat price.',
      )
      return
    }

    setIsCreatingOrder(true)
    setOrderMessage('')

    try {
      const response =
        await createPaymentOrder({
          accessToken,

          planId:
            selectedPlanData?.id,

          durationMonths:
            selectedDurationData?.months,

          extraSeats:
            billableExtraSeats,

          totalSeats:
            safeExtraSeats,

          totalSeats:
            safeExtraSeats,

          addonPricePerSeat:
            safeAddonPrice,

          totalAmount:
            safeTotalAmount,
        })

      const order =
        response?.data?.order ||
        response?.data ||
        response?.order ||
        response

      const orderId =
        order?.id ||
        order?.orderId ||
        order?.razorpay_order_id ||
        response?.razorpay_order_id ||
        response?.razorpayOrderId

      const razorpayKey =
        order?.key ||
        order?.keyId ||
        order?.key_id ||
        order?.razorpayKeyId ||
        response?.key ||
        response?.keyId ||
        response?.key_id ||
        response?.razorpayKeyId ||
        import.meta.env.VITE_RAZORPAY_KEY_ID

      const amount = Math.round(
        safeTotalAmount * 100,
      )

      const currency =
        order?.currency ||
        response?.currency ||
        'INR'

      if (
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        throw new Error(
          'Invalid payment amount.',
        )
      }

      if (
        !orderId ||
        !razorpayKey
      ) {
        throw new Error(
          'Payment order response is missing Razorpay order details.',
        )
      }

      await loadRazorpay()

      const razorpay =
        new window.Razorpay({
          key: razorpayKey,

          amount,

          currency,

          name: 'LiveKeeping',

          description: `${
            selectedPlanData?.name ||
            'Plan'
          } subscription`,

          order_id: orderId,

          handler: async (payment) => {
            setIsCreatingOrder(true)

            setOrderMessage(
              'Verifying payment...',
            )

            try {
              const verification =
                await verifyPayment({
                  accessToken,

                  razorpay_order_id:
                    payment.razorpay_order_id,

                  razorpay_payment_id:
                    payment.razorpay_payment_id,

                  razorpay_signature:
                    payment.razorpay_signature,
                })

              setOrderMessage(
                verification?.message ||
                  'Payment verified successfully.',
              )
            } catch (error) {
              setOrderMessage(
                error?.message ||
                  'Payment verification failed.',
              )
            } finally {
              setIsCreatingOrder(false)
            }
          },

          modal: {
            ondismiss: () => {
              setIsCreatingOrder(false)

              setOrderMessage(
                'Payment window closed.',
              )
            },
          },
        })

      razorpay.on(
        'payment.failed',
        (payment) => {
          setIsCreatingOrder(false)

          setOrderMessage(
            payment?.error?.description ||
              'Payment failed. Please try again.',
          )
        },
      )

      razorpay.open()
    } catch (error) {
      setOrderMessage(
        error?.message ||
          'Unable to create payment order.',
      )

      setIsCreatingOrder(false)
    } finally {
      if (!window.Razorpay) {
        setIsCreatingOrder(false)
      }
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#F0FDF4] via-[#F7FAF8] to-white px-4 py-4 sm:px-5 lg:px-6">

      <div className="mx-auto flex h-full max-w-6xl flex-col">

        {/* =================================================
            BACK BUTTON
        ================================================= */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowRight
              className="h-3.5 w-3.5 rotate-180"
            />

            Back to plans
          </button>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.12fr_0.88fr]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_15px_40px_rgba(15,23,42,0.07)]">

            {/* =================================================
                LEFT HEADER
            ================================================= */}
            <div className="shrink-0 px-5 pb-3 pt-4 sm:px-6">

              <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-green-700">
                Checkout
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Review your plan and adjust
                extra seats before confirming.
              </p>

            </div>

            {/* =================================================
                LEFT CONTENT
                NOT SCROLLABLE
            ================================================= */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5 sm:px-6">

              {/* =================================================
                  SELECTED PLAN
              ================================================= */}
              <div className="shrink-0 rounded-xl border border-green-100 bg-green-50 p-4">

                <div className="flex items-center justify-between gap-3">

                  <div className="min-w-0">

                    <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-green-700">
                      Selected Plan
                    </div>

                    <div className="mt-1 text-xl font-bold text-[#143D2A]">
                      {selectedPlanData?.name}
                    </div>

                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">

                    <PlanIcon
                      planName={
                        selectedPlanData?.name
                      }
                    />

                  </div>

                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">

                  {/* DURATION */}
                  <div className="rounded-lg bg-white p-2.5">

                    <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
                      Duration
                    </div>

                    <div className="mt-0.5 text-sm font-bold text-slate-800">
                      {
                        selectedDurationData?.fullLabel
                      }
                    </div>

                  </div>

                  {/* BASE PRICE */}
                  <div className="rounded-lg bg-white p-2.5">

                    <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400">
                      Base price
                    </div>

                    <div className="mt-0.5 text-sm font-bold text-slate-800">
                      ₹
                      {formatPrice(
                        basePlanPrice,
                      )}
                    </div>

                  </div>

                </div>
              </div>

              {/* =================================================
                  ADDITIONAL SEATS
              ================================================= */}
              <div className="mt-3 shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      Total seats
                    </div>

                    <div className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-green-600">
                      Additional seat price
                    </div>

                    <div className="mt-0.5 text-sm font-semibold text-slate-600">
                      ₹
                      {formatPrice(
                        addonPricePerSeat,
                      )}{' '}
                      per seat
                    </div>

                  </div>

                  {/* COUNTER */}
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">

                    <button
                      type="button"
                      onClick={() =>
                        setExtraSeats(
                          (count) =>
                            Math.max(
                              1,
                              Number(count) - 1,
                            ),
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                      aria-label="Decrease extra seats"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[24px] text-center text-base font-bold text-slate-900">
                      {extraSeats}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExtraSeats(
                          (count) =>
                            Number(count) + 1,
                        )
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700 transition hover:bg-green-200"
                      aria-label="Increase extra seats"
                    >
                      <Plus size={14} />
                    </button>

                  </div>
                </div>

                {/* EXTRA SEAT TOTAL */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">

                  <span className="text-xs font-medium text-slate-500">
                    Additional seat total
                  </span>

                  <span className="text-sm font-bold text-[#143D2A]">
                    ₹
                    {formatPrice(
                      extraSeatTotal,
                    )}
                  </span>

                </div>
              </div>

              {/* =================================================
                  INCLUDED FEATURES
              ================================================= */}
              <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4">

                {/* FEATURES HEADER - FIXED */}
                <div className="flex shrink-0 items-center justify-between">

                  <div className="text-xs font-bold text-slate-700">
                    Included features
                  </div>

                  <div className="text-[9px] uppercase tracking-[0.12em] text-slate-400">
                    {selectedPlanData?.name}
                  </div>

                </div>

                {/* =================================================
                    ONLY THIS SECTION SCROLLS
                ================================================= */}
                <div className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2">

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                    {(
                      selectedPlanData?.features ||
                      []
                    ).map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-2"
                        >

                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">

                            <Check
                              size={9}
                              strokeWidth={3}
                            />

                          </div>

                          <span className="text-[10px] leading-4 text-slate-600">
                            {
                              featureLabels?.[
                                feature
                              ] || feature
                            }
                          </span>

                        </div>
                      ),
                    )}

                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-green-200 bg-[#143D2A] p-5 text-white shadow-[0_15px_40px_rgba(20,61,42,0.18)] sm:p-6">

            {/* =================================================
                SUMMARY HEADER
            ================================================= */}
            <div className="shrink-0">

              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-200">
                Order summary
              </div>

              <h2 className="mt-1 text-xl font-bold">
                Your order
              </h2>

            </div>

            {/* =================================================
                ORDER DETAILS
            ================================================= */}
            <div className="mt-5 shrink-0 space-y-3">

              {/* PLAN */}
              <div className="flex items-center justify-between gap-3 text-xs text-green-100">

                <span>
                  {selectedPlanData?.name}{' '}
                  plan
                </span>

                <span>
                  ₹
                  {formatPrice(
                    basePlanPrice,
                  )}
                </span>

              </div>

              {/* EXTRA SEATS */}
              <div className="flex items-center justify-between gap-3 text-xs text-green-100">

                <span>
                  Extra seats
                </span>

                <span>
                  {Math.max(0, Number(extraSeats) - 1)} × ₹
                  {formatPrice(
                    addonPricePerSeat,
                  )}
                </span>

              </div>

              {/* DURATION */}
              <div className="flex items-center justify-between gap-3 text-xs text-green-100">

                <span>
                  Duration
                </span>

                <span>
                  {
                    selectedDurationData?.label
                  }
                </span>

              </div>

              {/* SUBTOTAL */}
              <div className="border-t border-white/15 pt-3">

                <div className="flex items-center justify-between text-green-100">

                  <span className="text-xs">
                    Subtotal
                  </span>

                  <span className="text-xs">
                    ₹
                    {formatPrice(
                      basePlanPrice +
                        extraSeatTotal,
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                ADDITIONAL SEAT SUMMARY
            ================================================= */}
            <div className="mt-4 shrink-0 rounded-xl bg-white/10 p-3">

              <div className="text-[9px] uppercase tracking-[0.15em] text-green-200">
                Additional seat
              </div>

              <div className="mt-1 flex items-end justify-between gap-2">

                <div>

                  <div className="text-xs text-green-100">
                    {Math.max(0, Number(extraSeats) - 1)}{' '}
                    billable{' '}
                    {Math.max(0, Number(extraSeats) - 1) === 1
                      ? 'seat'
                      : 'seats'}
                  </div>

                  <div className="mt-0.5 text-[10px] text-green-100/70">
                    ₹
                    {formatPrice(
                      addonPricePerSeat,
                    )}{' '}
                    each
                  </div>

                </div>

                <div className="text-lg font-bold">
                  ₹
                  {formatPrice(
                    extraSeatTotal,
                  )}
                </div>

              </div>

            </div>

            {/* =================================================
                TOTAL
            ================================================= */}
            <div className="mt-4 shrink-0 rounded-xl bg-white/10 p-4">

              <div className="text-[9px] uppercase tracking-[0.16em] text-green-100">
                Total payable
              </div>

              <div className="mt-1 text-3xl font-extrabold">
                ₹
                {formatPrice(
                  totalAmount,
                )}
              </div>

              <div className="mt-1 text-[10px] text-green-100/70">
                Base plan + additional seats
              </div>

            </div>

            {/* =================================================
                PAYMENT MESSAGE
            ================================================= */}
            {orderMessage && (
              <div className="mt-3 shrink-0 rounded-lg bg-white/10 px-3 py-2 text-center text-[10px] leading-4 text-green-100">
                {orderMessage}
              </div>
            )}

            {/* =================================================
                PAY BUTTON
            ================================================= */}
            <div className="mt-auto shrink-0 pt-5">

              <button
                type="button"
                onClick={
                  handleCreateOrder
                }
                disabled={
                  isCreatingOrder ||
                  !accessToken ||
                  !selectedPlanData?.id
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#143D2A] shadow-lg transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreatingOrder
                  ? 'Processing...'
                  : 'Confirm & Pay'}

                <ArrowRight size={16} />
              </button>

              <p className="mt-2 text-center text-[9px] text-green-100/70">
                Secure billing • No hidden fees
              </p>

            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage