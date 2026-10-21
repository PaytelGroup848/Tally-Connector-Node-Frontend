export function VoucherPageStatus({
  showSuccessAnimation,
  submitError,
  failedVoucherType,
  failedVoucherNumber,
  failedParty,
  failedAmount,
  failedCompany,
  failedDate,
  setSubmitError,
}) {
  return (
    <>
      {showSuccessAnimation && (
        <div className="fixed right-4 top-20 z-[300] w-[calc(100%-2rem)] max-w-sm">
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-4 py-3 shadow-xl"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                ✓
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-green-700">
                Voucher created successfully, check view status
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed error popup */}
      {submitError && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-[1100px] overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between bg-[#f44336] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15 text-lg font-bold">
                  !
                </div>

                <span className="text-[15px] font-bold">
                  {submitError.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSubmitError(null)}
                className="text-lg font-bold text-white/90 transition hover:text-white"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-lg border border-red-200 bg-red-100/50 px-4 py-3 text-sm text-red-800">
                {submitError.message}
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Voucher
                  </div>
                  <div className="font-medium text-slate-800">
                    {failedVoucherType}{" "}
                    {failedVoucherNumber ? `#${failedVoucherNumber}` : ""}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Party/Customer
                  </div>
                  <div className="font-medium text-slate-800">
                    {failedParty}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Amount
                  </div>
                  <div className="font-medium text-slate-800">
                    ₹{Number(failedAmount || 0).toFixed(2)}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Company
                  </div>
                  <div className="font-medium text-slate-800">
                    {failedCompany}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Date
                  </div>
                  <div className="font-medium text-slate-800">
                    {failedDate}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-white p-4">
                <h3 className="mb-2 text-base font-bold text-red-700">
                  Why Tally Rejected This Entry:
                </h3>
                <p className="text-sm leading-6 text-slate-700">
                  {submitError.reason}
                </p>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="mb-2 text-base font-bold text-sky-700">
                  What You Need To Do Fix It:
                </h3>
                <p className="text-sm leading-6 text-slate-700">
                  {submitError.action}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-100/50 px-4 py-3 text-xs text-red-700">
                <span className="min-w-0 break-words">
                  Technical Details: {submitError.technicalDetails}
                </span>

                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="shrink-0 rounded-lg bg-[#1a1f24] px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}