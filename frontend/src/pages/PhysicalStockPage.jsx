import { useState } from 'react'

function PhysicalStockPage() {
  const [rows] = useState([{ id: 1 }])

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]">
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">Create Physical Stock Voucher</div>

        <div className="bg-[#f5f7f4] p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>
              <div className="relative">
                <input value="Physical Stock" readOnly className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">×</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>
              <input value="1" readOnly className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>
              <div className="relative">
                <input type="date" defaultValue="2026-08-27" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🗓</span>
              </div>
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="grid min-w-[1000px] grid-cols-[1.3fr_0.5fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.4fr] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <b>Items</b>
              <b>Qty</b>
              <b>Godown</b>
              <b>Batch No.</b>
              <b>Mfg. Date</b>
              <b>Exp. Date</b>
              <b>Amount</b>
              <button type="button" className="justify-self-end rounded-md bg-[#dff5e5] px-2 py-1 text-[10px] font-bold uppercase text-green-700">Add Item</button>
            </div>

            {rows.map((row) => (
              <div key={row.id} className="grid min-w-[1000px] grid-cols-[1.3fr_0.5fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.4fr] items-center gap-2 border-t border-slate-200 bg-white p-2">
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Search Item" />
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="0" />
                <select defaultValue="" className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                  <option value="">Select</option>
                  <option>Godown A</option>
                </select>
                <select defaultValue="" className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                  <option value="">Select</option>
                  <option>Batch 1</option>
                </select>
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Mfg.Date" />
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Exp.Date" />
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="0" />
                <button type="button" className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500">✕</button>
              </div>
            ))}

            <button type="button" className="w-full border-t border-slate-200 bg-transparent px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-sky-600">
              Add Godown/Batches
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-[#e8f7ea] px-4 py-3 text-[12px] text-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold">TOTAL</div>
              <div className="flex gap-8 text-right">
                <span>Qty: 0</span>
                <span>Amount: ₹0</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 text-[12px] text-slate-700">
            <span className="font-semibold">Narration:</span>
            <input className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="" />
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

export default PhysicalStockPage