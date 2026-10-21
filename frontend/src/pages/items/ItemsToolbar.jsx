import DateRangePicker from '../../components/DateRangePicker'

export default function ItemsToolbar({
  query,
  setQuery,
  pageSize,
  setPageSize,
  myStockItems,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setCurrentPage,
}) {
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="p-2 mb-4 flex flex-wrap items-center gap-4 bg-white">
      <div className="relative">
        <input
          className="h-9 w-[min(100%,240px)] rounded-lg border border-slate-300 px-3 text-xs outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search item name"
        />
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-600">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value))
            setCurrentPage(1)
          }}
          className="h-9 rounded-lg border border-slate-300 bg-white px-2 outline-none focus:border-green-500"
          aria-label="Rows per page"
        >
          {[10, 20, 30, 50].map((limit) => (
            <option key={limit} value={limit}>
              {limit}
            </option>
          ))}
        </select>
        <span>records</span>
      </label>

      {!myStockItems && (
        <DateRangePicker
          className="ml-auto flex justify-end border-0"
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(nextStart || startDate)
            setEndDate(nextEnd || endDate)
            setCurrentPage(1)
          }}
          compact
        />
      )}

      {!myStockItems && (
        <>
          <button
            className="max-sm:ml-auto inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
            type="button"
            onClick={() => navigate('/items/add-new')}
          >
            <span className="text-sm">+</span>
            Add New Item
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
            onClick={() => navigate('/my-stock-items')}
          >
            View status
          </button>
        </>
      )}
    </div>
  )
}
