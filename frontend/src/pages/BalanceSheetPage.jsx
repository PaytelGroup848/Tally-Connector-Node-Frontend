import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  extractBalanceSheetPagination,
  extractBalanceSheetRows,
  fetchBalanceSheet,
} from '../services/companiesApi'

const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'companyId',
  'organizationId',
  'raw',
  'source',
  'tallyExternalId',
  'tallyExternalID',
  'tally_external_id',
  'effectiveDate',
  'effective_date',
  'guid',
  'GUID',
  'alterId',
  'alterID',
  'alter_id',
  'voucherId',
  'voucherID',
  'voucher_id',
])

function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'NA'
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN')
  }

  return String(value)
}

function isHiddenField(field) {
  const normalizedKey = String(field).trim().toLowerCase()
  return Array.from(hiddenFields).some(
    (hiddenField) => String(hiddenField).trim().toLowerCase() === normalizedKey,
  )
}

function BalanceSheetPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)

  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [ledgerType, setLedgerType] = useState('liability')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setPage(1)
  }, [companyId, pageSize, query, ledgerType])

  useEffect(() => {
    if (!accessToken) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage('Session expired. Please sign in.')
      return undefined
    }

    if (!companyId) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage('No company selected.')
      return undefined
    }

    let isMounted = true

    async function loadBalanceSheet() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await fetchBalanceSheet(accessToken, companyId, {
          page,
          limit: pageSize,
          q: query,
          ledgerType,
        })

        if (!isMounted) return

        const nextRows = extractBalanceSheetRows(response)
        const pagination = extractBalanceSheetPagination(response)

        const totalCandidates = [
          pagination?.total,
          pagination?.totalItems,
          pagination?.totalRecords,
          pagination?.count,
        ]

        const totalFromApi = totalCandidates.find(
          (value) => value !== undefined && value !== null && Number.isFinite(Number(value)),
        )

        const safeTotal = totalFromApi !== undefined ? Number(totalFromApi) : nextRows.length

        const apiLimit = Number(pagination?.limit ?? pagination?.pageSize ?? pageSize)
        const safeLimit = Number.isFinite(apiLimit) && apiLimit > 0 ? apiLimit : pageSize

        const calculatedTotalPages = Math.max(1, Math.ceil(safeTotal / safeLimit))
        const apiTotalPages = Number(pagination?.totalPages ?? pagination?.pages ?? calculatedTotalPages)

        setRows(nextRows)
        setTotalItems(safeTotal)
        setTotalPages(Number.isFinite(apiTotalPages) && apiTotalPages > 0 ? apiTotalPages : calculatedTotalPages)
      } catch (error) {
        if (!isMounted) return

        setRows([])
        setTotalItems(0)
        setTotalPages(1)
        setErrorMessage(error?.message || 'Unable to load Balance Sheet')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadBalanceSheet()

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, page, pageSize, query, ledgerType])

  const fields = useMemo(() => {
    const keys = new Set()

    rows.forEach((row) => {
      if (!row || typeof row !== 'object') return
      Object.keys(row).forEach((key) => {
        if (!isHiddenField(key)) keys.add(key)
      })
    })

    return Array.from(keys)
  }, [rows])

  const gridTemplateColumns = useMemo(() => {
    if (!fields.length) return 'minmax(240px, 1fr)'
    return fields.map(() => 'minmax(180px, 1fr)').join(' ')
  }, [fields])

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }, [page, totalPages])

  const recordStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const recordEnd = totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0

  const tableCellClass = 'flex h-[52px] min-w-0 items-center border-r border-slate-100 px-3 last:border-r-0'
  const tableTextClass = 'w-full truncate text-left text-xs leading-5 text-slate-700'

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5">
        <div>
          <span className="block text-xs text-slate-500">Reports</span>
          <h1 className="text-xl font-bold text-slate-900">Balance Sheet</h1>
        </div>
        <span className="text-xs text-slate-500">
          {totalItems > 0 ? `${totalItems} records` : 'NA records'}
        </span>
      </div>

      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>Ledger Type</span>
            <select
              value={ledgerType}
              onChange={(event) => setLedgerType(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="liability">Liability</option>
              <option value="asset">Asset</option>
             
            </select>
          </label>

          <label className="flex h-9 w-[260px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400 transition focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <Search size={15} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search account or ledger"
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
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>records</span>
          </label>
        </div>

        {errorMessage && (
          <div className="mx-5 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mx-5 my-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <div className="min-w-[1100px]">
            {fields.length > 0 && (
              <div
                className="grid items-center border-b border-slate-200 bg-slate-100 px-4"
                style={{ gridTemplateColumns, minHeight: '52px' }}
              >
                {fields.map((field) => (
                  <div
                    key={field}
                    className="flex h-[52px] min-w-0 items-center border-r border-slate-200 px-3 last:border-r-0"
                    title={formatLabel(field)}
                  >
                    <span className="w-full truncate text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      {formatLabel(field)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
                  <span>Loading Balance Sheet...</span>
                </div>
              </div>
            )}

            {!isLoading && rows.length > 0 && (
              <div>
                {rows.map((row, index) => (
                  <div
                    key={row?._id || row?.id || `balance-sheet-row-${index}`}
                    className="grid items-center border-b border-slate-100 px-4 last:border-b-0 odd:bg-white even:bg-slate-50 hover:bg-slate-50"
                    style={{ gridTemplateColumns, minHeight: '52px' }}
                  >
                    {fields.map((field) => (
                      <div key={field} className={tableCellClass}>
                        <div className={tableTextClass} title={typeof row?.[field] === 'object' ? formatValue(row?.[field]) : String(row?.[field] ?? '')}>
                          {formatValue(row?.[field])}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && rows.length === 0 && (
              <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                <div className="text-sm font-medium text-slate-500">NA</div>
              </div>
            )}
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">
          <span className="text-xs text-slate-600">
            {totalItems > 0 ? `${recordStart}-${recordEnd} of ${totalItems}` : 'NA-NA of NA'}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isLoading || page <= 1}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {pageItems.map((pageNumber, index) =>
              pageNumber === '...' ? (
                <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400">...</span>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setPage(pageNumber)}
                  className={
                    pageNumber === page
                      ? 'h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white'
                      : 'h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50'
                  }
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={isLoading || page >= totalPages}
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default BalanceSheetPage
