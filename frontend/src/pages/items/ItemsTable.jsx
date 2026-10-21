import { Pencil } from 'lucide-react'
import {
  formatItemValue,
  formatStockCommandValue,
  getItemValue,
  getStockCommandValue,
} from './utils'

export default function ItemsTable({
  columns,
  myStockItems,
  isLoading,
  stockItems,
  deletingCommandId,
  onDeleteCommand,
  onEdit,
  onViewDetails,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-xs text-slate-500"
              >
                Loading stock items...
              </td>
            </tr>
          ) : stockItems.length > 0 ? (
            stockItems.map((item, index) => (
              <tr
                key={item?._id || item?.id || index}
                className="text-xs text-slate-700 transition hover:bg-slate-50"
              >
                {columns.map((column) => {
                  if (myStockItems && column.key === 'action') {
                    const status = String(
                      getStockCommandValue(item, 'status') || '',
                    ).toLowerCase()
                    const commandId =
                      item?._id ||
                      item?.commandId ||
                      item?.command_id ||
                      item?.id

                    return (
                      <td key={column.key} className="px-4 py-3">
                        {status === 'pending' && commandId ? (
                          <button
                            type="button"
                            disabled={
                              deletingCommandId === String(commandId)
                            }
                            onClick={() => onDeleteCommand(item)}
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingCommandId === String(commandId)
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        ) : null}
                      </td>
                    )
                  }

                  if (myStockItems) {
                    const value = getStockCommandValue(item, column.key)
                    const isViewable =
                      value !== null &&
                      value !== undefined &&
                      value !== '' &&
                      (typeof value === 'object' ||
                        column.key === 'errorMessage')
                    const status = String(value || '').toLowerCase()

                    return (
                      <td key={column.key} className="px-4 py-3">
                        {column.key === 'status' ? (
                          <span
                            className={`font-semibold ${
                              status === 'pending'
                                ? 'text-amber-600'
                                : status === 'failed'
                                  ? 'text-red-600'
                                  : status === 'done'
                                    ? 'text-emerald-600'
                                    : 'text-slate-600'
                            }`}
                          >
                            {formatStockCommandValue(value)}
                          </span>
                        ) : column.key === 'createdAt' ? (
                          formatItemValue(value, 'createdAt')
                        ) : isViewable ? (
                          <button
                            type="button"
                            onClick={() =>
                              onViewDetails({
                                title: column.label,
                                value,
                              })
                            }
                            className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700"
                          >
                            {column.key === 'payload'
                              ? 'View details'
                              : column.key === 'errorMessage'
                                ? 'View error'
                                : 'View result'}
                          </button>
                        ) : (
                          <span className="whitespace-pre-wrap break-words">
                            {formatStockCommandValue(value)}
                          </span>
                        )}
                      </td>
                    )
                  }

                  if (column.key === 'action') {
                    return (
                      <td key={column.key} className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          title="Edit"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    )
                  }

                  return (
                    <td key={column.key} className="px-4 py-3">
                      {formatItemValue(getItemValue(item, column.key), column.key)}
                    </td>
                  )
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-xs text-slate-500"
              >
                {myStockItems
                  ? 'No stock item commands found.'
                  : 'No stock data available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
