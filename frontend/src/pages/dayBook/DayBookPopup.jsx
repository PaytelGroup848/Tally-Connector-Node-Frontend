import { useEffect } from 'react'
import { X } from 'lucide-react'
import { formatLabel, formatValue } from './utils'

function NestedValue({ value, depth = 0 }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-500">NA</span>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-slate-500">No entries found.</span>
    }

    return (
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-xs text-slate-700">
            <tbody>
              {value.map((item, index) => (
                <tr
                  key={`nested-row-${depth}-${index}`}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="border-r border-slate-200 bg-slate-50 px-3 py-2 align-top font-semibold text-slate-600">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 align-top">
                    {typeof item === 'object' && item !== null ? (
                      <NestedValue value={item} depth={depth + 1} />
                    ) : (
                      <span className="whitespace-pre-wrap break-words">
                        {formatValue(item)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value)

    if (entries.length === 0) {
      return <span className="text-slate-500">Empty object</span>
    }

    return (
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-xs text-slate-700">
            <tbody>
              {entries.map(([key, itemValue]) => (
                <tr
                  key={`${depth}-${key}`}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="w-[180px] border-r border-slate-200 bg-slate-50 px-3 py-2 align-top font-semibold text-slate-600">
                    {formatLabel(key)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    {typeof itemValue === 'object' && itemValue !== null ? (
                      <NestedValue value={itemValue} depth={depth + 1} />
                    ) : (
                      <span className="whitespace-pre-wrap break-words">
                        {formatValue(itemValue, key)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <span className="whitespace-pre-wrap break-words">
      {String(value)}
    </span>
  )
}

export default function DayBookPopup({ popup, onClose }) {
  useEffect(() => {
    if (!popup) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [popup, onClose])

  if (!popup) return null

  const hasValue =
    popup.value !== null &&
    popup.value !== undefined &&
    popup.value !== ''

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {popup.label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label="Close popup"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5">
          {hasValue ? (
            <div className="w-full">
              <NestedValue value={popup.value} />
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
              No data available.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 bg-white px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
