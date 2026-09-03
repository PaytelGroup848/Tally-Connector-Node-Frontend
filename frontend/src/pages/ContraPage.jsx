import { useState } from 'react'

function ContraPage() {
  const [rows, setRows] = useState([{ id: 1 }])

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]">
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">Create Contra</div>

        <div className="bg-[#f5f7f4] p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>
              <div className="relative">
                <input value="Contra" readOnly className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none" />
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

          <div className="mt-5 overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-600">Add Particulars</span>
              <button type="button" onClick={() => setRows((currentRows) => [...currentRows, { id: Date.now() }])} className="rounded-md bg-[#dff4e4] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                +
              </button>
            </div>

            <div className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <b>Type</b>
              <b>Party Name</b>
              <b>Amount</b>
              <span />
            </div>

            {rows.map((row) => (
              <div key={row.id} className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 border-t border-slate-200 bg-white p-2">
                <select defaultValue="" className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                  <option value="">Please select type</option>
                  <option>By</option>
                  <option>To</option>
                </select>
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Select Party Name" />
                <input className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" placeholder="Amount" />
                <button type="button" className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500" disabled>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label className="block text-[12px] font-semibold text-slate-700">Narration</label>
            <textarea placeholder="Enter Narration" className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
        </div>

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">
          <button type="button" className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)]">
            Create Contra
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContraPage