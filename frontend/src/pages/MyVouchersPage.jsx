import { useMemo, useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'

const voucherData = [
  ['Cash Sales', 'CS-2026-001', 'Sales', '01/04/2026', '02/04/2026', '₹ 18,500', 'Completed', 'View'],
  ['Purchase Invoice', 'PI-2026-014', 'Purchase', '03/04/2026', '04/04/2026', '₹ 22,400', 'Pending', 'View'],
  ['Bank Receipt', 'BR-2026-019', 'Receipt', '05/04/2026', '06/04/2026', '₹ 12,750', 'Completed', 'View'],
  ['Payment Entry', 'PE-2026-028', 'Payment', '09/04/2026', '10/04/2026', '₹ 8,300', 'Pending', 'View'],
  ['Journal Entry', 'JE-2026-033', 'Journal', '11/04/2026', '11/04/2026', '₹ 5,600', 'Completed', 'View'],
  ['Sales Order', 'SO-2026-041', 'Sales Order', '12/04/2026', '13/04/2026', '₹ 27,900', 'Pending', 'View'],
]

function MyVouchersPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [type, setType] = useState('All')
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const filters = ['All', 'Pending', 'Completed']
  const types = ['All', 'Sales', 'Purchase', 'Receipt', 'Payment', 'Journal']

  const visibleRows = useMemo(() => {
    return voucherData.filter(([name, , voucherType, , , , status]) => {
      const matchesSearch = name.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' || status === filter
      const matchesType = type === 'All' || voucherType === type
      return matchesSearch && matchesFilter && matchesType
    })
  }, [query, filter, type])

  return (
    <div className="report-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="report-tabs flex flex-wrap items-center gap-8 border-b border-slate-200 bg-white px-4 text-xs text-slate-700">
        <b className="border-b-2 border-slate-900 pb-3 pt-4 text-slate-900">Detailed Summary</b>
        <span className="py-4">Manage Vouchers</span>
        <span className="py-4">Recent Activity</span>
        <div className="ml-auto flex items-center gap-3 pr-2">
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={(nextStart, nextEnd) => { setStartDate(nextStart || startDate); setEndDate(nextEnd || endDate) }} compact />
        </div>
      </div>

      <section className="report-card mx-5 mt-2.5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="receivables-toolbar flex flex-wrap items-center gap-4 px-5 py-4">
          <div className="mr-auto text-xs text-slate-800">
            <span className="block">Total Vouchers</span>
            <b className="mt-1 block text-sm">{visibleRows.length}</b>
          </div>

          <div className="report-filters flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={filter === option ? 'filter-active rounded-md border border-slate-900 bg-white px-3 py-2 text-slate-800' : 'rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700'}
              >
                {option}
              </button>
            ))}
          </div>

          <label className="report-search flex h-8 w-[180px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">
            <span>⌕</span>
            <input className="w-full bg-transparent text-xs outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>

          <select value={type} onChange={(event) => setType(event.target.value)} className="h-8 rounded-md border border-slate-300 bg-white px-3 text-xs text-slate-700 outline-none">
            {types.map((option) => (
              <option key={option} value={option}>{option === 'All' ? 'Voucher Type' : option}</option>
            ))}
          </select>
        </div>

        <div className="report-table overflow-x-auto px-5">
          <div className="report-header grid min-w-[1040px] grid-cols-[1.4fr_1.3fr_1fr_1fr_1.2fr_1fr_0.8fr_0.6fr] bg-[#edf2f6] px-4 py-2.5 text-xs font-medium text-slate-700">
            <b>Name</b>
            <b>Voucher Number</b>
            <b>Voucher Type</b>
            <b>Voucher Date</b>
            <b>Modified Date</b>
            <b>Amount</b>
            <b>Status</b>
            <b>Action</b>
          </div>

          {visibleRows.length > 0 ? (
            visibleRows.map(([name, voucherNumber, voucherType, voucherDate, modifiedDate, amount, status, action]) => (
              <div key={voucherNumber} className="report-row grid min-w-[1040px] grid-cols-[1.4fr_1.3fr_1fr_1fr_1.2fr_1fr_0.8fr_0.6fr] border-b border-slate-100 px-4 py-3 text-xs text-slate-700">
                <span className="font-medium text-slate-900">{name}</span>
                <span>{voucherNumber}</span>
                <span>{voucherType}</span>
                <span>{voucherDate}</span>
                <span>{modifiedDate}</span>
                <span className="font-semibold text-slate-900">{amount}</span>
                <span className={status === 'Completed' ? 'inline-flex w-fit rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700' : 'inline-flex w-fit rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700'}>{status}</span>
                <button type="button" className="text-left font-medium text-sky-700 hover:text-sky-800">{action}</button>
              </div>
            ))
          ) : (
            <div className="report-empty flex min-h-[120px] min-w-[1040px] items-center justify-center border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-500">
              No data available
            </div>
          )}
        </div>

        <footer className="report-footer flex justify-between px-5 py-4 text-xs text-slate-700">
          <span>{visibleRows.length ? `1-${visibleRows.length} of ${visibleRows.length}` : '1-0 of 0'}</span>
          <span>‹　<b>1</b>　›</span>
        </footer>
      </section>
    </div>
  )
}

export default MyVouchersPage