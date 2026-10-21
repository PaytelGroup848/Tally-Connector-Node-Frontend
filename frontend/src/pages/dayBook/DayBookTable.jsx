import { formatLabel, formatValue, isPopupField } from './utils'

export default function DayBookTable({
  fields,
  rows,
  isLoading,
  onOpenPopup,
}) {
  return (
    <div className="mx-5 my-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[1100px] border-collapse table-fixed">
        {fields.length > 0 && (
          <colgroup>
            {fields.map((field) => (
              <col key={field} style={{ width: '180px' }} />
            ))}
          </colgroup>
        )}

        {fields.length > 0 && (
          <thead>
            <tr className="h-[52px] border-b border-slate-200 bg-slate-100">
              {fields.map((field) => (
                <th
                  key={field}
                  className="h-[52px] border-r border-slate-200 px-3 text-left align-middle last:border-r-0"
                  title={formatLabel(field)}
                >
                  <span className="block w-full truncate text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {formatLabel(field)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
        )}

        {isLoading && (
          <tbody>
            <tr>
              <td colSpan={fields.length || 1} className="h-[220px] align-middle">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
                    <span>Loading day book...</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}

        {!isLoading && rows.length > 0 && (
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row?._id || row?.id || `day-book-row-${index}`}
                className="h-[52px] border-b border-slate-100 last:border-b-0 odd:bg-white even:bg-slate-50 hover:bg-slate-50"
              >
                {fields.map((field) => {
                  const value = row?.[field]
                  const clickable = isPopupField(field)
                  const cellClass =
                    'h-[52px] overflow-hidden border-r border-slate-100 px-3 align-middle last:border-r-0'

                  if (clickable) {
                    return (
                      <td key={field} className={cellClass}>
                        <button
                          type="button"
                          onClick={() => onOpenPopup(field, value)}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                        >
                          View
                        </button>
                      </td>
                    )
                  }

                  return (
                    <td key={field} className={cellClass}>
                      <div
                        className="w-full overflow-hidden truncate whitespace-nowrap text-left leading-5 text-slate-700"
                        title={
                          typeof value === 'object'
                            ? formatValue(value, field)
                            : String(value ?? '')
                        }
                      >
                        {formatValue(value, field)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        )}

        {!isLoading && rows.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={fields.length || 1} className="h-[220px] align-middle">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-medium text-slate-500">NA</div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  )
}
