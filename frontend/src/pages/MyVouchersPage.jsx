import { useEffect, useMemo, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractVoucherPagination,
  extractVouchers,
  fetchCompanyVouchers,
} from '../services/companiesApi'

const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'v',
  'createdAt',
  'created_at',
  'tallyExternalId',
  'alter_id',
  'companyId',
  'date',
  'guid',
  'organizationId',
  'raw',
  'source',
])

function getVoucherValue(voucher, ...keys) {
  for (const key of keys) {
    if (voucher?.[key] !== undefined && voucher?.[key] !== null) return voucher[key]
  }
  return ''
}

function formatDate(value) {
  if (!value) return 'NA'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

function formatAmount(value) {
  if (value === '' || value === null || value === undefined) return 'NA'
  return `₹ ${Number(value).toLocaleString('en-IN')}`
}

function formatFieldLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatApiValue(value, key) {
  if (value === null || value === undefined || value === '') return 'NA'
  if (Array.isArray(value) && value.length === 0) return 'NA'
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  if (key.toLowerCase().includes('date') || key.toLowerCase().includes('at')) return formatDate(value)
  if (key.toLowerCase().includes('amount') || key.toLowerCase() === 'total') return formatAmount(value)
  return String(value)
}

function getEntryFields(entries) {
  const keys = new Set()
  entries.forEach((entry) => Object.keys(entry || {}).forEach((key) => {
    if (!hiddenFields.has(key)) keys.add(key)
  }))
  return Array.from(keys)
}

function getEntryType(field) {
  const normalizedField = field.replace(/[_-]+/g, '').toLowerCase()
  if (normalizedField === 'inventoryentries') return 'Inventory Entries'
  if (normalizedField === 'ledgerentries') return 'Ledger Entries'
  return ''
}

function isBillAllocationsField(field) {
  return field.replace(/[_-]+/g, '').toLowerCase() === 'billallocations'
}

function MyVouchersPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [type, setType] = useState('All')
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const [vouchers, setVouchers] = useState([])
  const [knownFields, setKnownFields] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [entryPopup, setEntryPopup] = useState(null)
  const [billAllocationPopup, setBillAllocationPopup] = useState(null)
  const filters = ['All', 'Pending', 'Completed']
  const types = ['All', 'Sales', 'Purchase', 'Receipt', 'Payment', 'Journal']

  useEffect(() => {
    setPage(1)
    setKnownFields([])
  }, [query, startDate, endDate, companyId, pageSize])

  useEffect(() => {
    if (!accessToken || !companyId) {
      setVouchers([])
      setKnownFields([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(accessToken ? 'No company selected.' : 'Session expired. Please sign in.')
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchCompanyVouchers(accessToken, companyId, {
      page,
      limit: pageSize,
      q: query,
      startDate,
      endDate,
    })
      .then((response) => {
        if (!isMounted) return
        const pagination = extractVoucherPagination(response)
        const total = Number(pagination.total || pagination.totalItems || pagination.totalRecords || pagination.count || 0)
        const limit = Number(pagination.limit || pagination.pageSize || pageSize)
        const nextVouchers = extractVouchers(response)
        setVouchers(nextVouchers)
        setKnownFields((currentFields) => {
          const nextFields = new Set(currentFields)
          nextVouchers.forEach((voucher) => Object.keys(voucher || {}).forEach((key) => {
            if (!hiddenFields.has(key)) nextFields.add(key)
          }))
          return Array.from(nextFields)
        })
        setTotalItems(total)
        setTotalPages(Number(pagination.totalPages || pagination.pages || Math.ceil(total / limit) || 1))
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Unable to load vouchers')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => { isMounted = false }
  }, [accessToken, companyId, endDate, page, pageSize, query, startDate])

  const visibleRows = useMemo(() => {
    return vouchers.filter((voucher) => {
      const voucherType = String(getVoucherValue(voucher, 'voucherType', 'voucher_type', 'type'))
      const status = String(getVoucherValue(voucher, 'status', 'voucherStatus', 'voucher_status'))
      const searchableVoucher = JSON.stringify(voucher).toLowerCase()
      const matchesSearch = searchableVoucher.includes(query.trim().toLowerCase())
      const matchesFilter = filter === 'All' || status.toLowerCase() === filter.toLowerCase()
      const matchesType = type === 'All' || voucherType.toLowerCase() === type.toLowerCase()
      const effectiveDate = voucher?.effectiveDate
      const effectiveDateValue = effectiveDate ? new Date(effectiveDate) : null
      const hasValidEffectiveDate = effectiveDateValue && !Number.isNaN(effectiveDateValue.getTime())
      const matchesStartDate = !startDate || (hasValidEffectiveDate && effectiveDateValue >= new Date(`${startDate}T00:00:00`))
      const matchesEndDate = !endDate || (hasValidEffectiveDate && effectiveDateValue <= new Date(`${endDate}T23:59:59.999`))
      return matchesSearch && matchesFilter && matchesType && hasValidEffectiveDate && matchesStartDate && matchesEndDate
    })
  }, [endDate, filter, query, startDate, type, vouchers])

  const fields = knownFields

  const gridTemplate = `repeat(${Math.max(fields.length, 1)}, minmax(190px, 1fr))`

  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : page <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : page >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', page - 1, page, page + 1, '...', totalPages]

  const entryFields = entryPopup ? getEntryFields(entryPopup.entries) : []
  const billAllocationFields = billAllocationPopup ? getEntryFields(billAllocationPopup.entries) : []

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
      {errorMessage && <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage}</div>}

      <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">
        <div className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#e5ebf2] px-8 py-3">
          <label className="flex h-[38px] w-[256px] items-center rounded-lg border border-[#d6e0ec] px-3 text-[#7d8da5] focus-within:border-[#1bb88a]">
            <input className="w-full bg-transparent text-[13px] outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vouchers" />
          </label>
          <span className="text-[13px] text-[#17355f]">Show</span>
          <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))} className="h-[38px] rounded-lg border border-[#10b981] bg-white px-3 text-[13px] text-[#17355f] outline-none">
            {[10, 20, 30, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          <span className="text-[13px] text-[#17355f]">records</span>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="h-[38px] w-[113px] rounded-md border border-[#bfcfe2] bg-white px-2 text-[11px] text-[#17355f] outline-none focus:border-[#10b981]" aria-label="Created from date" />
            <span className="text-[11px] text-[#17355f]">to</span>
            <input type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} className="h-[38px] w-[113px] rounded-md border border-[#bfcfe2] bg-white px-2 text-[11px] text-[#17355f] outline-none focus:border-[#10b981]" aria-label="Created to date" />
          </div>
          <span className="text-[12px] text-[#17355f]">Page {page} · {pageSize} per page</span>
        </div>

        <div className="flex items-center gap-2 px-8 py-2 text-xs">
          {filters.map((option) => (
            <button key={option} type="button" onClick={() => setFilter(option)} className={filter === option ? 'border-b-2 border-[#10b981] px-2 py-1 font-semibold text-[#17355f]' : 'px-2 py-1 text-[#71819a]'}>{option}</button>
          ))}
          <select value={type} onChange={(event) => setType(event.target.value)} className="ml-2 h-8 rounded border border-[#d6e0ec] bg-white px-2 text-xs text-[#17355f] outline-none">
            {types.map((option) => <option key={option} value={option}>{option === 'All' ? 'Voucher Type' : option}</option>)}
          </select>
        </div>

        <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
          <div style={{ gridTemplateColumns: gridTemplate }} className="grid min-w-max items-center border-b border-[#dfe7f0] bg-[#f4f7fb] px-4 py-3 text-[11px] font-semibold uppercase tracking-normal text-[#274b78]">
            {fields.map((field) => <b key={field} className="min-w-0 overflow-hidden pr-4">{formatFieldLabel(field)}</b>)}
          </div>

          {isLoading ? (
            <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">Loading vouchers...</div>
          ) : visibleRows.length > 0 ? (
            visibleRows.map((voucher, index) => {
              const voucherNumber = getVoucherValue(voucher, 'voucherNumber', 'voucher_number') || 'NA'
              return <div key={voucher._id || voucher.id || voucher.guid || `${voucherNumber}-${index}`} style={{ gridTemplateColumns: gridTemplate }} className="grid min-w-max items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] text-[#17355f] odd:bg-white even:bg-[#fbfdff]">
                {fields.map((field) => (
                  <div key={field} className="min-w-0 overflow-hidden pr-4">
                    {Array.isArray(voucher[field]) && voucher[field].length > 0 && getEntryType(field) ? (
                      <button type="button" onClick={() => setEntryPopup({ title: getEntryType(field), entries: voucher[field] })} className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 hover:bg-sky-100">
                        View {voucher[field].length} entries
                      </button>
                    ) : (
                      <pre className="m-0 max-h-28 w-full overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                        {formatApiValue(voucher[field], field)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            })
          ) : (
            <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
              No data available
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs text-[#17355f]">
          <span>{totalItems ? `${((page - 1) * pageSize) + 1}-${Math.min(page * pageSize, totalItems)} of ${totalItems}` : '0-0 of 0'}</span>
          <div className="flex items-center gap-2">
            {pageItems.map((pageNumber, index) => pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className="flex h-9 w-5 items-center justify-center text-[#71819a]">...</span>
            ) : (
              <button key={pageNumber} type="button" disabled={isLoading} onClick={() => setPage(pageNumber)} className={pageNumber === page ? 'h-9 w-9 rounded-md border border-[#059669] bg-[#059669] font-semibold text-white shadow-sm' : 'h-9 w-9 rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878]'}>{pageNumber}</button>
            ))}
          </div>
        </footer>
      </section>

      {entryPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label={entryPopup.title}>
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{entryPopup.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{entryPopup.entries.length} entries</p>
              </div>
              <button type="button" aria-label="Close entries" onClick={() => setEntryPopup(null)} className="rounded-md px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900">×</button>
            </div>
            <div className="overflow-auto px-4 pb-4 pt-0">
              {entryPopup.entries.length > 0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>{entryFields.map((field) => <col key={field} className="w-[220px]" />)}</colgroup>
                  <thead className="sticky top-0 bg-slate-100 text-[11px] uppercase text-slate-600">
                    <tr>{entryFields.map((field) => <th key={field} className="w-[220px] min-w-[220px] max-w-[220px] whitespace-normal border border-slate-200 px-3 py-2 text-left align-top font-semibold">{formatFieldLabel(field)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {entryPopup.entries.map((entry, index) => {
                      return <tr key={entry._id || entry.id || index} className="align-top even:bg-slate-50">
                        {entryFields.map((field) => <td key={field} className="w-[220px] min-w-[220px] max-w-[220px] align-top border border-slate-200 px-3 py-2">
                          {Array.isArray(entry[field]) && entry[field].length > 0 && isBillAllocationsField(field) ? (
                            <button type="button" onClick={() => setBillAllocationPopup({ title: 'Bill Allocations', entries: entry[field] })} className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 hover:bg-sky-100">
                              View {entry[field].length} allocations
                            </button>
                          ) : (
                            <pre className="m-0 max-h-32 overflow-y-auto whitespace-pre-wrap break-words font-sans">{formatApiValue(entry[field], field)}</pre>
                          )}
                        </td>)}
                      </tr>
                    })}
                  </tbody>
                </table>
              ) : <p className="py-8 text-center text-sm text-slate-500">No entries available.</p>}
            </div>
          </div>
        </div>
      )}

      {billAllocationPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label={billAllocationPopup.title}>
          <div className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{billAllocationPopup.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{billAllocationPopup.entries.length} allocations</p>
              </div>
              <button type="button" aria-label="Close bill allocations" onClick={() => setBillAllocationPopup(null)} className="rounded-md px-3 py-1 text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-900">×</button>
            </div>
            <div className="overflow-auto px-4 pb-4 pt-0">
              {billAllocationPopup.entries.length > 0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>{billAllocationFields.map((field) => <col key={field} className="w-[220px]" />)}</colgroup>
                  <thead className="sticky top-0 bg-slate-100 text-[11px] uppercase text-slate-600">
                    <tr>{billAllocationFields.map((field) => <th key={field} className="w-[220px] min-w-[220px] max-w-[220px] whitespace-normal border border-slate-200 px-3 py-2 text-left align-top font-semibold">{formatFieldLabel(field)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {billAllocationPopup.entries.map((allocation, index) => (
                      <tr key={allocation._id || allocation.id || index} className="align-top even:bg-slate-50">
                        {billAllocationFields.map((field) => <td key={field} className="w-[220px] min-w-[220px] max-w-[220px] align-top border border-slate-200 px-3 py-2"><pre className="m-0 max-h-32 overflow-y-auto whitespace-pre-wrap break-words font-sans">{formatApiValue(allocation[field], field)}</pre></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="py-8 text-center text-sm text-slate-500">No bill allocations available.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyVouchersPage