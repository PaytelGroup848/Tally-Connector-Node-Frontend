import { useState } from 'react'

function CreateItemPage() {
  const [stockName, setStockName] = useState('')
  const [parent, setParent] = useState('')
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [narration, setNarration] = useState('')
  const [gstApplicable, setGstApplicable] = useState(false)

  const handleSubmit = () => {
    alert('Item created successfully')
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="flex items-center gap-3 bg-[#5ecb5d] px-5 py-4 text-[22px] font-bold text-white">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/30 bg-white/10 text-lg text-white transition hover:bg-white/20"
            aria-label="Go back"
          >
            ‹
          </button>
          <span>Create Item</span>
        </div>

        <div className="bg-[#f5f6f5] p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>
                Stock Name <span className="text-red-500">*</span>
              </span>
              <input
                value={stockName}
                onChange={(event) => setStockName(event.target.value)}
                placeholder="Stock Name"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Parent</span>
              <div className="relative">
                <input
                  value={parent}
                  onChange={(event) => setParent(event.target.value)}
                  placeholder="Search..."
                  className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 pr-11 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Unit</span>
              <select
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select Unit</option>
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Box">Box</option>
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Description</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <div className="mt-5">
            <label className="flex min-w-0 flex-col gap-2 text-[14px] font-medium text-slate-700">
              <span>Narration</span>
              <input
                value={narration}
                onChange={(event) => setNarration(event.target.value)}
                placeholder="Narration"
                className="h-12 rounded-md border border-slate-300 bg-white px-3 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          <div className="mt-6 flex items-center">
            <label className="flex cursor-pointer items-center gap-3 text-[15px] font-medium text-slate-700">
              <input
                type="checkbox"
                checked={gstApplicable}
                onChange={(event) => setGstApplicable(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
              />
              <span>GST Applicable</span>
            </label>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-lg bg-[#111827] px-7 py-3 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(17,24,39,0.2)] transition hover:bg-[#0b1220]"
            >
              Create Item
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateItemPage
