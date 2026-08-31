import { useMemo, useState } from 'react'

const initialRows = [
  ['Amit Traders', '₹ 18,500', 'Due Today', '15 Days', '₹ 18,500', 'Active'],
  ['Bharat Metals', '₹ 24,000', 'Past Due', '30 Days', '₹ 24,000', 'Active'],
  ['Classic Garments', '₹ 12,750', 'Not Due', '5 Days', '₹ 12,750', 'Active'],
  ['Delhi Packaging', '₹ 31,200', 'Past Due', '45 Days', '₹ 31,200', 'Active'],
  ['Fortune Foods', '₹ 9,850', 'Not Due', '7 Days', '₹ 9,850', 'Active'],
  ['Green Leaf Agro', '₹ 7,200', 'Due Today', '10 Days', '₹ 7,200', 'Active'],
  ['Himalaya Retail', '₹ 14,600', 'Not Due', '12 Days', '₹ 14,600', 'Active'],
  ['India Steel Works', '₹ 42,900', 'Past Due', '60 Days', '₹ 42,900', 'Active'],
  ['Jain Furnitures', '₹ 8,150', 'Due Today', '8 Days', '₹ 8,150', 'Active'],
  ['Krishna Enterprises', '₹ 11,400', 'Past Due', '24 Days', '₹ 11,400', 'Active'],
]

function PartiesPage() {
  const [rows, setRows] = useState(initialRows)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [statusMessage, setStatusMessage] = useState('')

  const filterOptions = ['All', 'Due Today', 'Not Due', 'Past Due']

  const visibleRows = useMemo(() => rows.filter((row) => {
    const matchesQuery = row[0].toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || row[2] === filter
    return matchesQuery && matchesFilter
  }), [rows, query, filter])

  const handleFavourite = (partyName) => {
    setStatusMessage(`${partyName} added to favourites`)
    setTimeout(() => setStatusMessage(''), 1800)
  }

  const handleRemove = (partyName) => {
    setRows((currentRows) => currentRows.filter(([name]) => name !== partyName))
    setStatusMessage(`${partyName} removed from list`)
    setTimeout(() => setStatusMessage(''), 1800)
  }

  const handleAddNew = () => {
    window.history.pushState({}, '', '/parties/add-new')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-center gap-3 rounded-t-lg border border-slate-200 bg-white px-4 py-4 shadow-[0_8px_24px_rgba(24,33,43,0.04)]">
          <div className="min-w-[120px] text-[11px] text-slate-700">
            <span className="block">Receivables</span>
            <strong className="text-sm text-slate-900">₹ 0</strong>
          </div>
          <div className="min-w-[120px] text-[11px] text-slate-700">
            <span className="block">Payables</span>
            <strong className="text-sm text-slate-900">₹ 17,800</strong>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={filter === option ? 'rounded-md border border-slate-900 bg-white px-3 py-2 text-[11px] font-medium text-slate-800' : 'rounded-md border border-transparent bg-transparent px-3 py-2 text-[11px] text-slate-700'}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <section className="overflow-hidden rounded-b-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(24,33,43,0.04)]">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
            <label className="flex h-9 min-w-[210px] flex-1 items-center gap-2 rounded-md border border-slate-300 bg-slate-50 px-3 text-slate-400">
              <span>⌕</span>
              <input className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" placeholder="Search party" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <span className="text-xs text-slate-700">Rows per page: 10 ⌄</span>
            <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              ☆ Favourite
            </button>
            <button type="button" onClick={handleAddNew} className="rounded-md bg-[#1a1f24] px-3 py-2 text-xs font-semibold text-white">
              ⊕ Add New
            </button>
            <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
              ▣ View PDF
            </button>
          </div>

          {statusMessage && <div className="border-b border-green-200 bg-green-50 px-5 py-2 text-xs text-green-700">{statusMessage}</div>}

          <div className="overflow-x-auto">
            <div className="grid min-w-[900px] grid-cols-[2.2fr_1fr_1fr_1fr_1.2fr_1fr] gap-3 bg-[#edf2f6] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
              <b>Party Name</b>
              <b>Last Sold Date</b>
              <b>Credit Limit</b>
              <b>Credit Days</b>
              <b>Closing Balance</b>
              <b>Action</b>
            </div>

            {visibleRows.length > 0 ? (
              visibleRows.map(([name, lastSold, creditLimit, creditDays, balance, status]) => (
                <div key={name} className="grid min-w-[900px] grid-cols-[2.2fr_1fr_1fr_1fr_1.2fr_1fr] gap-3 border-t border-slate-200 px-5 py-3 text-xs text-slate-700">
                  <span className="font-medium text-slate-900">{name}</span>
                  <span>-</span>
                  <span>{creditLimit}</span>
                  <span>{creditDays}</span>
                  <span className={balance.includes('Dr') ? 'text-red-600' : 'text-emerald-600'}>{balance}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleFavourite(name)} className="rounded border border-slate-300 bg-white px-2 py-1 font-medium text-slate-700 hover:border-slate-400">
                      Star
                    </button>
                    <button type="button" onClick={() => handleRemove(name)} className="rounded border border-slate-300 bg-white px-2 py-1 font-medium text-slate-700 hover:border-slate-400">
                      Remove
                    </button>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">{status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[120px] items-center justify-center px-5 py-6 text-sm text-slate-500">No matching parties found</div>
            )}
          </div>

          <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-700">
            <span>{visibleRows.length ? `1-${visibleRows.length} of ${rows.length}` : '0 of 0'}</span>
            <span>‹ <b>1</b> ›</span>
          </footer>
        </section>
      </div>
    </div>
  )
}

export default PartiesPage