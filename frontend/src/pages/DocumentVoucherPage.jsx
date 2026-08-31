import { useState } from 'react'

export function DocumentVoucherPage({ title, extraField, date = '2026-08-27' }) {
  const [openSection, setOpenSection] = useState(null)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.06)]">
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">
          Create {title} Voucher
        </div>

        <div className="bg-[#f5f7f4] p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>
              <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Select Voucher Type" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Party Name</span>
              <div className="relative">
                <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Select Party" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Order Type</span>
              <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Select ref" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Order Number</span>
              <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Order Number" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>
              <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" value="-" readOnly />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>
              <div className="relative">
                <input type="date" defaultValue={date} className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🗓</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Order Date</span>
              <div className="relative">
                <input type="date" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🗓</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Ledger Type</span>
              <div className="relative">
                <input className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Select Ledger" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </div>
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="grid min-w-[1000px] grid-cols-[1.2fr_0.45fr_0.45fr_0.5fr_0.5fr_0.9fr_0.8fr_1.3fr_0.7fr_0.5fr_0.35fr] gap-2 bg-slate-100 p-2 text-[12px] font-semibold uppercase tracking-wide text-slate-600">
              <b>Items</b>
              <b>Qty</b>
              <b>Rate</b>
              <b>Units</b>
              <b>Disc %</b>
              <b>HSN Code</b>
              <b>Godown</b>
              <b>Description</b>
              <b>Amount</b>
              <b>Tax Incl.</b>
              <b>+</b>
            </div>

            <div className="grid min-w-[1000px] grid-cols-[1.2fr_0.45fr_0.45fr_0.5fr_0.5fr_0.9fr_0.8fr_1.3fr_0.7fr_0.5fr_0.35fr] gap-2 border-t border-slate-200 p-2">
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Search Item" />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" value="0" readOnly />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" value="0" readOnly />
              <select defaultValue="" className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                <option value="">-</option>
                <option>PCS</option>
              </select>
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" value="0" readOnly />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Search HSN" />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Search Godown" />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Enter Notes" />
              <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" value="0" readOnly />
              <label className="flex items-center justify-center">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500" />
              </label>
              <button type="button" className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500">✕</button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 xl:flex-row">
            <div className="flex-1">
              {['Narration', 'Advanced Settings'].map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => setOpenSection(openSection === section ? null : section)}
                  className="mb-2 flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-left text-[14px] font-medium text-slate-700"
                >
                  <span>{section}</span>
                  <span>{openSection === section ? '⌄' : '›'}</span>
                </button>
              ))}
            </div>

            <div className="w-full rounded-lg border border-slate-200 bg-[#f1f8ef] xl:max-w-[330px]">
              <button type="button" className="w-full border-b border-slate-200 bg-transparent px-4 py-3 text-left text-[12px] font-semibold text-slate-700">
                + Add GST And Other Ledgers
              </button>

              <div className="space-y-2 px-4 py-3 text-[12px] text-slate-700">
                <div className="flex items-center justify-between">
                  <span>Sub Total</span>
                  <b>₹0</b>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span>Taxes</span>
                  <b>₹0</b>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-[14px] font-bold text-slate-900">
                  <span>Grand Total</span>
                  <b>₹0</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">
          <button type="button" className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)]">
            Create Voucher
          </button>
        </div>
      </div>
    </div>
  )
}