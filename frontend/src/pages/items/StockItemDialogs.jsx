import { X } from 'lucide-react'
import { formatLabel } from './utils'

function DetailValue({ value, depth = 0 }) {
  if (value !== null && typeof value === 'object') {
    if (Array.isArray(value)) {
      return (
        <div className="max-w-xl overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full border-collapse text-left text-xs">
            <tbody className="divide-y divide-slate-100">
              {value.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <th className="w-16 bg-slate-50 px-3 py-2 font-semibold text-slate-600">
                    {index + 1}
                  </th>
                  <td className="px-3 py-2 text-slate-700">
                    {typeof item === 'object' && item !== null ? (
                      <pre className="whitespace-pre-wrap break-words font-mono text-[11px]">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    ) : (
                      String(item ?? '—')
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="max-w-xl overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full border-collapse text-left text-xs">
          <tbody className="divide-y divide-slate-100">
            {Object.entries(value).map(([key, nestedValue]) => (
              <tr key={`${depth}-${key}`} className="hover:bg-slate-50">
                <th className="w-1/3 bg-slate-50 px-3 py-2 font-semibold text-slate-600">
                  {formatLabel(key)}
                </th>
                <td className="px-3 py-2 text-slate-700">
                  <DetailValue value={nestedValue} depth={depth + 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <>{String(value ?? '—')}</>
}

export default function StockItemDialogs({
  detailDialog,
  onCloseDetails,
  showSuccessDialog,
  onCloseSuccess,
  onViewStatus,
}) {
  return (
    <>
      {detailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">
                {detailDialog.title}
              </h2>
              <button
                type="button"
                aria-label="Close details"
                onClick={onCloseDetails}
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-auto p-4">
              {detailDialog.value &&
              typeof detailDialog.value === 'object' &&
              !Array.isArray(detailDialog.value) ? (
                <table className="w-full border-collapse text-left text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(detailDialog.value)
                      .filter(
                        ([key]) =>
                          key.replace(/[\s_-]/g, '').toLowerCase() !==
                          'tallyexternalid',
                      )
                      .map(([key, value]) => (
                        <tr key={key} className="hover:bg-slate-50">
                          <th className="w-1/3 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
                            {formatLabel(key)}
                          </th>
                          <td className="px-4 py-3 text-slate-700">
                            <DetailValue value={value} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : Array.isArray(detailDialog.value) ? (
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-600">
                        #
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-600">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detailDialog.value.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <DetailValue value={item} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="whitespace-pre-wrap break-words px-4 py-3 text-slate-700">
                  {String(detailDialog.value ?? '—')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <span className="text-3xl font-bold text-emerald-600">✓</span>
            </div>
            <h2
              id="success-dialog-title"
              className="text-xl font-semibold text-slate-800"
            >
              Item updated successfully
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              You can check the updated item status in My Stock Items.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <button
                type="button"
                onClick={onCloseSuccess}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={onViewStatus}
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View Status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
