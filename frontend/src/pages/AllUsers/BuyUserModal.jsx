import { CreditCard, UsersRound, ReceiptText, CheckCircle2, Loader2, X } from "lucide-react";
import useSeatPurchase from "./useSeatPurchase";
import SeatPurchaseStepIndicator from "./SeatPurchaseStepIndicator";

function BuyUserModal({ accessToken, user, onClose, onPaymentSuccess }) {
  const {
    step, seatsToAdd, setSeatsToAdd, loading, paymentLoading, orderData, paymentSuccess, error,
    seatRate, gstPercent, subtotal, gstAmount, estimatedTotal, formatCurrency, createOrder, changeSeats, openRazorpay,
    data, backendSeatCount, backendPerSeatRate, backendSubtotal, backendGstPercent, backendGstAmount, backendTotalAmount,
  } = useSeatPurchase({ accessToken, user, onPaymentSuccess });
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !paymentLoading
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between px-5 py-4 md:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UsersRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Buy Additional Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {step === "select"
                  ? "Choose how many additional user seats you want to add."
                  : "Review your seat order before payment."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={paymentLoading}
            aria-label="Close buy user modal"
            className="ml-3 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SeatPurchaseStepIndicator step={step} />

        <div className="space-y-5 p-5 md:p-6">
          {/* =====================================================
              STEP 1: SELECT SEATS
              ===================================================== */}
          {step === "select" && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-800">
                  Number of additional users
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  These seats will be added to your current
                  subscription.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSeatsToAdd((value) =>
                        Math.max(1, value - 1),
                      )
                    }
                    disabled={
                      loading ||
                      paymentLoading ||
                      seatsToAdd <= 1
                    }
                    aria-label="Decrease seats"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <div className="flex h-14 min-w-[112px] items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-5 text-2xl font-bold text-slate-800">
                    {seatsToAdd}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSeatsToAdd((value) => value + 1)
                    }
                    disabled={loading || paymentLoading}
                    aria-label="Increase seats"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                  {seatsToAdd} additional{" "}
                  {seatsToAdd === 1 ? "seat" : "seats"} selected
                </p>
              </div>

              {/* ESTIMATE */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-emerald-600" />

                  <p className="text-sm font-semibold text-emerald-800">
                    Estimated amount
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700">
                      {formatCurrency(seatRate)} ×{" "}
                      {seatsToAdd}{" "}
                      {seatsToAdd === 1 ? "seat" : "seats"}
                    </span>

                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700">
                      GST ({gstPercent}%)
                    </span>

                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(gstAmount)}
                    </span>
                  </div>

                  <div className="border-t border-emerald-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-900">
                        Estimated total
                      </span>

                      <span className="text-xl font-bold text-emerald-700">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">
                    Unable to create seat order
                  </p>

                  <p className="mt-1 break-words text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createOrder}
                  disabled={loading || seatsToAdd < 1}
                  className="rounded-[10px] bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Order..." : "Continue"}
                </button>
              </div>
            </>
          )}

          {/* =====================================================
              STEP 2: ORDER DETAILS
              ===================================================== */}
          {step === "details" && orderData && (
            <>
              <div
                className={`rounded-xl border p-4 ${paymentSuccess
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-emerald-100 bg-emerald-50"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {paymentSuccess ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      {paymentSuccess
                        ? "Payment successful"
                        : "Seat order created successfully"}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      {paymentSuccess
                        ? "Your additional user seats have been added."
                        : "Review the order details below before payment."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-1 divide-y divide-slate-200 text-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-800">
                      {data?.orderId || "-"}
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Currency
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {data?.currency || "INR"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ReceiptText className="h-4 w-4 text-emerald-600" />
                    Payment summary
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Price per user
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendPerSeatRate,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Users to add
                      </span>

                      <span className="font-semibold text-slate-800">
                        {backendSeatCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendSubtotal,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        GST ({backendGstPercent}%)
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendGstAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-800">
                        Total amount
                      </span>

                      <span className="text-xl font-bold text-emerald-700">
                        {formatCurrency(
                          backendTotalAmount,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={changeSeats}
                  disabled={
                    paymentLoading ||
                    paymentSuccess
                  }
                  className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Change seats
                </button>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={paymentLoading}
                    className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paymentSuccess
                      ? "Done"
                      : "Close"}
                  </button>

                  {!paymentSuccess && (
                    <button
                      type="button"
                      onClick={openRazorpay}
                      disabled={
                        paymentLoading ||
                        !data?.orderId ||
                        !data?.keyId
                      }
                      className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-[10px] bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay{" "}
                          {formatCurrency(
                            backendTotalAmount,
                          )}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuyUserModal;
