import { X } from 'lucide-react'

const inputClass =
  'h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

export default function EditStockItemModal({
  editForm,
  setEditForm,
  onClose,
  onSubmit,
  hsnOptions,
  isHsnLoading,
  isHsnDropdownOpen,
  setIsHsnDropdownOpen,
  hsnLookupError,
  setHsnOptions,
  setHsnLookupError,
}) {
  const updateField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }))
  }

  const selectHsn = (code) => {
    updateField('hsnCode', code)
    setHsnOptions([])
    setIsHsnDropdownOpen(false)
    setHsnLookupError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="mt-2 flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Edit Stock Item
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Update stock item details
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close edit item"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Item Name
            </span>
            <input
              type="text"
              value={editForm.itemName}
              onChange={(event) => updateField('itemName', event.target.value)}
              className={inputClass}
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Quantity
            </span>
            <input
              type="number"
              value={editForm.quantity}
              onChange={(event) => {
                const quantity = event.target.value
                setEditForm((current) => ({
                  ...current,
                  quantity,
                  value: Number(quantity || 0) * Number(current.rate || 0),
                }))
              }}
              className={inputClass}
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Rate
            </span>
            <input
              type="number"
              value={editForm.rate}
              onChange={(event) => {
                const rate = event.target.value
                setEditForm((current) => ({
                  ...current,
                  rate,
                  value: Number(current.quantity || 0) * Number(rate || 0),
                }))
              }}
              className={inputClass}
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Value
            </span>
            <input
              type="number"
              value={editForm.value}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-700`}
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Unit
            </span>
            <input
              type="text"
              value={editForm.unit}
              onChange={(event) => updateField('unit', event.target.value)}
              className={inputClass}
            />
          </label>

          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              HSN Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={editForm.hsnCode}
              onChange={(event) => {
                updateField('hsnCode', event.target.value)
                setIsHsnDropdownOpen(true)
                setHsnLookupError('')
              }}
              onFocus={() => {
                if (editForm.hsnCode.trim().length >= 3) {
                  setIsHsnDropdownOpen(true)
                }
              }}
              placeholder="Enter HSN code"
              className={inputClass}
            />
            {isHsnDropdownOpen && editForm.hsnCode.trim().length >= 3 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="sticky top-0 bg-slate-100 text-slate-700">
                    <tr>
                      <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                        HSN Code
                      </th>
                      <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isHsnLoading ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-4 text-center text-slate-500">
                          Searching HSN codes...
                        </td>
                      </tr>
                    ) : hsnLookupError ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-4 text-center text-red-600">
                          {hsnLookupError}
                        </td>
                      </tr>
                    ) : hsnOptions.length > 0 ? (
                      hsnOptions.map((option, index) => (
                        <tr
                          key={`${option.code}-${index}`}
                          className="cursor-pointer hover:bg-emerald-50"
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-700">
                            <button
                              type="button"
                              className="w-full text-left"
                              onClick={() => selectHsn(option.code)}
                            >
                              {option.code}
                            </button>
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            <button
                              type="button"
                              className="w-full text-left"
                              onClick={() => selectHsn(option.code)}
                            >
                              {option.name || 'No description available'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-3 py-4 text-center text-slate-500">
                          No matching HSN codes found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Godown
            </span>
            <input
              type="text"
              value={editForm.godown}
              onChange={(event) => updateField('godown', event.target.value)}
              className={inputClass}
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium text-slate-600">
              Batch
            </span>
            <input
              type="text"
              value={editForm.batch}
              onChange={(event) => updateField('batch', event.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  )
}
