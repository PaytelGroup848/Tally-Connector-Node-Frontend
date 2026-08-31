import { useMemo, useState } from 'react'

const createRow = (id) => ({
  id,
  item: '',
  qty: '',
  rate: '',
  godown: '',
  batch: '',
})

function StockSide({ title, rows, onAddRow, onRemoveRow, onRowChange }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-[#f5f7f4]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#f5f7f4] px-4 py-3 text-sm font-semibold text-slate-800">
        <span>{title}</span>
        <button type="button" onClick={onAddRow} className="rounded-md bg-[#e7f7ea] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700 transition hover:bg-[#d9f1df]">
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[minmax(180px,1.6fr)_minmax(70px,0.55fr)_minmax(80px,0.6fr)_minmax(110px,0.8fr)_minmax(120px,0.9fr)_minmax(100px,0.7fr)_48px] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            <b>Items</b>
            <b>Qty</b>
            <b>Rate</b>
            <b>Godown</b>
            <b>Batch Name</b>
            <b>Amount</b>
            <b className="text-center"> </b>
          </div>

          {rows.map((row) => {
            const qty = Number(row.qty) || 0
            const rate = Number(row.rate) || 0
            const amount = qty * rate

            return (
              <div key={row.id} className="grid min-w-[780px] grid-cols-[minmax(180px,1.6fr)_minmax(70px,0.55fr)_minmax(80px,0.6fr)_minmax(110px,0.8fr)_minmax(120px,0.9fr)_minmax(100px,0.7fr)_48px] gap-2 border-t border-slate-200 bg-white p-2">
                <input
                  value={row.item}
                  onChange={(event) => onRowChange(row.id, 'item', event.target.value)}
                  className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Search Item"
                />
                <input
                  type="number"
                  min="0"
                  value={row.qty}
                  onChange={(event) => onRowChange(row.id, 'qty', event.target.value)}
                  className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="0"
                />
                <input
                  type="number"
                  min="0"
                  value={row.rate}
                  onChange={(event) => onRowChange(row.id, 'rate', event.target.value)}
                  className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="0"
                />
                <select
                  value={row.godown}
                  onChange={(event) => onRowChange(row.id, 'godown', event.target.value)}
                  className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select</option>
                  <option value="Godown A">Godown A</option>
                  <option value="Godown B">Godown B</option>
                </select>
                <select
                  value={row.batch}
                  onChange={(event) => onRowChange(row.id, 'batch', event.target.value)}
                  className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option value="">Select</option>
                  <option value="Batch 1">Batch 1</option>
                  <option value="Batch 2">Batch 2</option>
                </select>
                <input
                  readOnly
                  value={amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  className="min-h-9 rounded-md border border-slate-300 bg-slate-50 px-2 text-xs text-slate-700 outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove row ${row.id}`}
                  onClick={() => onRemoveRow(row.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-slate-500 transition hover:border-red-200 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <button type="button" className="w-full border-t border-slate-200 bg-transparent px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-sky-600 transition hover:bg-slate-100">
        Add Godown/Batches
      </button>
    </div>
  )
}

function StockJournalPage() {
  const [voucherType, setVoucherType] = useState('Stock Journal')
  const [voucherNo, setVoucherNo] = useState('1')
  const [date, setDate] = useState('2026-08-27')
  const [narration, setNarration] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sourceRows, setSourceRows] = useState([createRow(1)])
  const [destinationRows, setDestinationRows] = useState([createRow(2)])

  const updateRowValue = (setter, id, field, value) => {
    setter((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const addRow = (setter) => {
    setter((current) => [...current, createRow(Date.now() + Math.random())])
  }

  const removeRow = (setter, id) => {
    setter((current) => {
      if (current.length === 1) return current
      return current.filter((row) => row.id !== id)
    })
  }

  const totalSourceQty = useMemo(() => sourceRows.reduce((sum, row) => sum + (Number(row.qty) || 0), 0), [sourceRows])
  const totalDestinationQty = useMemo(() => destinationRows.reduce((sum, row) => sum + (Number(row.qty) || 0), 0), [destinationRows])
  const totalAmount = useMemo(
    () =>
      [...sourceRows, ...destinationRows].reduce(
        (sum, row) => sum + (Number(row.qty) || 0) * (Number(row.rate) || 0),
        0,
      ),
    [sourceRows, destinationRows],
  )

  const handleCreateVoucher = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 1800)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]">
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">Create Stock Journal Voucher</div>

        <div className="bg-[#f5f7f4] p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>
              <select value={voucherType} onChange={(event) => setVoucherType(event.target.value)} className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                <option>Stock Journal</option>
                <option>Stock Transfer</option>
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>
              <input value={voucherNo} onChange={(event) => setVoucherNo(event.target.value)} className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>
              <div className="relative">
                <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🗓</span>
              </div>
            </label>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <StockSide
              title="Source (Consumption)"
              rows={sourceRows}
              onAddRow={() => addRow(setSourceRows)}
              onRemoveRow={(id) => removeRow(setSourceRows, id)}
              onRowChange={(id, field, value) => updateRowValue(setSourceRows, id, field, value)}
            />
            <StockSide
              title="Destination (Production)"
              rows={destinationRows}
              onAddRow={() => addRow(setDestinationRows)}
              onRemoveRow={(id) => removeRow(setDestinationRows, id)}
              onRowChange={(id, field, value) => updateRowValue(setDestinationRows, id, field, value)}
            />
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-[#e8f7ea] px-4 py-3 text-[12px] text-slate-700">
            <div className="flex items-center justify-between gap-4">
              <div className="font-semibold">TOTAL</div>
              <div className="flex flex-wrap items-center justify-end gap-6 text-right">
                <span>Qty {totalSourceQty + totalDestinationQty}</span>
                <span>Amount ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 text-[12px] text-slate-700">
            <span className="font-semibold">Narration:</span>
            <input
              value={narration}
              onChange={(event) => setNarration(event.target.value)}
              className="h-10 flex-1 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Enter narration"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 bg-[#f5f7f4] px-5 pb-5 pt-0">
          {submitted && <span className="text-sm font-medium text-green-700">Voucher created</span>}
          <button type="button" onClick={handleCreateVoucher} className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] transition hover:bg-[#111827]">
            Create Voucher
          </button>
        </div>
      </div>
    </div>
  )
}

export default StockJournalPage