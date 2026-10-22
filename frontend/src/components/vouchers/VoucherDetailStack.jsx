import { X } from "lucide-react";
import {
  formatCellValue,
  formatColumnLabel,
  getDetailEntries,
  isStructuredValue,
} from "./voucherUtils";

function VoucherDetailStack({
  detailStack,
  onOpenDetail,
  onCloseDetail,
  onCloseAllDetails,
}) {
  return (
    <>
      {detailStack.map((detail, index) => {
        const entries = getDetailEntries(detail.value);

        return (
          <div
            key={`${detail.title}-${index}`}
            className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/50 p-4"
            style={{ zIndex: 1000 + index * 100 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {detail.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {entries.length} fields
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCloseDetail}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close details"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-auto p-4">
                {entries.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-[#dfe7f0]">
                    {entries.map(([key, value]) => (
                      <div
                        key={key}
                        className="grid grid-cols-[minmax(160px,220px)_1fr] items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                      >
                        <div className="pr-4 font-semibold text-[#274b78]">
                          {Array.isArray(detail.value)
                            ? `Item ${key}`
                            : formatColumnLabel(key)}
                        </div>

                        <div className="min-w-0 text-[#17355f]">
                          {isStructuredValue(value) ? (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenDetail(
                                  Array.isArray(detail.value)
                                    ? `Item ${key}`
                                    : formatColumnLabel(key),
                                  value,
                                )
                              }
                              className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                            >
                              View
                            </button>
                          ) : (
                            <span className="whitespace-pre-wrap break-words leading-5">
                              {formatCellValue(value)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words rounded-lg border border-dashed border-slate-200 px-4 py-4 text-sm text-[#17355f]">
                    {formatCellValue(detail.value)}
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 px-5 py-3">
                <button
                  type="button"
                  onClick={index === 0 ? onCloseAllDetails : onCloseDetail}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default VoucherDetailStack;
