import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { extractTrialBalanceRows, extractTrialBalancePagination, fetchTrialBalance } from '../services/companiesApi'

const hiddenFields = new Set(['_id', '_v', 'V', 'companyId', 'organizationId', 'raw', 'source'])

function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') return 'NA'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  if (typeof value === 'number') return value.toLocaleString('en-IN')
  return String(value)
}

function TrialBalancePage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setPage(1)
  }, [companyId, pageSize, query])

  useEffect(() => {
    if (!accessToken || !companyId) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(accessToken ? 'No company selected.' : 'Session expired. Please sign in.')
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchTrialBalance(accessToken, companyId, { page, limit: pageSize, q: query })
      .then((response) => {
        if (!isMounted) return
        const nextRows = extractTrialBalanceRows(response)
        const pagination = extractTrialBalancePagination(response)
        const total = Number(pagination.total ?? pagination.totalItems ?? pagination.totalRecords ?? pagination.count ?? nextRows.length)
        const limit = Number(pagination.limit ?? pagination.pageSize ?? pageSize)
        setRows(nextRows)
        setTotalItems(Number.isFinite(total) ? total : nextRows.length)
        setTotalPages(Number(pagination.totalPages ?? pagination.pages ?? Math.max(1, Math.ceil(total / limit))))
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Unable to load trial balance')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => { isMounted = false }
  }, [accessToken, companyId, page, pageSize, query])

  const fields = useMemo(() => {
    const keys = new Set()
    rows.forEach((row) => Object.keys(row || {}).forEach((key) => {
      if (!hiddenFields.has(key)) keys.add(key)
    }))
    return Array.from(keys)
  }, [rows])

  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : page <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : page >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', page - 1, page, page + 1, '...', totalPages]

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5">
        <div>
          <span className="block text-xs text-slate-500">Reports</span>
          <h1 className="text-xl font-bold">Trial Balance</h1>
        </div>
        <span className="text-xs text-slate-500">{totalItems} records</span>
      </div>

      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
          <label className="flex h-9 w-[220px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ledger" className="w-full bg-transparent text-xs outline-none" />
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>Show</span>
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-9 rounded-md border border-slate-300 bg-white px-2 outline-none">
              {[10, 20, 30, 50].map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
            <span>records</span>
          </label>
          <span className="ml-auto text-xs text-slate-500">Page {page} · {pageSize} per page</span>
        </div>

        {errorMessage && <div className="mx-5 mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage}</div>}

        <div className="mx-5 my-3 overflow-x-auto rounded-md border border-slate-200">
          <div className="grid min-w-max border-b border-slate-200 bg-[#edf2f6] px-4 py-3 text-xs font-semibold uppercase text-slate-600" style={{ gridTemplateColumns: `repeat(${Math.max(fields.length, 1)}, minmax(180px, 1fr))` }}>
            {fields.map((field) => <b key={field} className="pr-4">{formatLabel(field)}</b>)}
          </div>
          {isLoading ? (
            <div className="flex min-h-[120px] min-w-[900px] items-center justify-center text-xs text-slate-500">Loading trial balance...</div>
          ) : rows.length > 0 ? rows.map((row, index) => (
            <div key={row._id || row.id || index} className="grid min-w-max items-start border-b border-slate-100 px-4 py-3 text-xs text-slate-700 last:border-b-0 odd:bg-white even:bg-slate-50" style={{ gridTemplateColumns: `repeat(${Math.max(fields.length, 1)}, minmax(180px, 1fr))` }}>
              {fields.map((field) => <pre key={field} className="m-0 max-h-24 overflow-y-auto whitespace-pre-wrap break-words pr-4 font-sans leading-5">{formatValue(row[field])}</pre>)}
            </div>
          )) : (
            <div className="flex min-h-[120px] min-w-[900px] items-center justify-center text-xs text-slate-500">No trial balance data available.</div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">
          <span className="text-xs text-slate-600">{totalItems ? `${((page - 1) * pageSize) + 1}-${Math.min(page * pageSize, totalItems)} of ${totalItems}` : '0-0 of 0'}</span>
          <div className="flex items-center gap-2">
            {pageItems.map((pageNumber, index) => pageNumber === '...' ? <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400">...</span> : <button key={pageNumber} type="button" disabled={isLoading} onClick={() => setPage(pageNumber)} className={pageNumber === page ? 'h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white' : 'h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'}>{pageNumber}</button>)}
          </div>
        </footer>
      </section>
    </div>
  )
}

export default TrialBalancePage
