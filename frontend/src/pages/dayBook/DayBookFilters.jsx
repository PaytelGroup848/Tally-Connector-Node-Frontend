import { Search } from 'lucide-react'

export default function DayBookFilters({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  query,
  setQuery,
  pageSize,
  setPageSize,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
      <label className="flex items-center gap-2 text-xs text-slate-600">
        <span>From</span>
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-slate-600">
        <span>To</span>
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </label>

      <label className="flex h-9 w-[260px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400 transition focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        <Search size={15} />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search voucher number or party ledger"
          className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
        />
      </label>

      <label className="ml-auto flex items-center gap-2 text-xs text-slate-600">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>records</span>
      </label>
    </div>
  )
}
