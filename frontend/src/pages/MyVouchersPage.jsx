import { useEffect, useMemo, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  deleteCompanyCommand,
  extractCommands,
  fetchCompanyCommands,
} from '../services/companiesApi'

function normalizeKey(key) {
  return String(key).trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

function formatLabel(key) {
  if (normalizeKey(key) === 'payload') return 'Details'

  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDate(value) {
  if (!value) return 'NA'

  const rawValue = String(value).trim()
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
    ? new Date(
        Number(rawValue.slice(0, 4)),
        Number(rawValue.slice(5, 7)) - 1,
        Number(rawValue.slice(8, 10)),
      )
    : new Date(rawValue)

  if (Number.isNaN(dateValue.getTime())) return String(value)

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
  }).format(dateValue)
}

function isStructured(value) {
  return value !== null && typeof value === 'object'
}

function isViewableField(key, value) {
  const normalizedKey = normalizeKey(key)

  const hasMessageValue =
    value !== null &&
    value !== undefined &&
    String(value).trim().toLowerCase() !== '' &&
    String(value).trim().toLowerCase() !== 'na'

  return (
    isStructured(value) ||
    ((normalizedKey.includes('error') ||
      normalizedKey.includes('message')) &&
      hasMessageValue)
  )
}

function getViewLabel(key) {
  const normalizedKey = normalizeKey(key)

  if (normalizedKey === 'payload') return 'View details'

  return normalizedKey.includes('error') || normalizedKey.includes('message')
    ? 'View error'
    : 'View result'
}

function getStatusClasses(key, value) {
  const normalizedKey = normalizeKey(key)
  const isStatusField =
    normalizedKey === 'status' ||
    normalizedKey === 'state' ||
    normalizedKey === 'commandstatus'

  if (!isStatusField) return ''

  const status = String(value ?? '').trim().toLowerCase()

  if (status === 'pending') return 'font-semibold text-amber-600'
  if (status === 'sent') return 'font-semibold text-blue-600'
  if (status === 'done') return 'font-semibold text-emerald-600'
  if (status === 'failed') return 'font-semibold text-red-600'

  return 'font-semibold text-slate-600'
}

function getDetailEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index + 1), item])
  }

  return value && typeof value === 'object'
    ? Object.entries(value)
    : []
}

function formatValue(value, key = '') {
  if (value === null || value === undefined || value === '') return '-'

  const normalizedKey = normalizeKey(key)
  if (
    normalizedKey.includes('date') ||
    normalizedKey.includes('time') ||
    normalizedKey.endsWith('at')
  ) {
    return formatDate(value)
  }

  if (typeof value === 'number') return value.toLocaleString('en-IN')
  return String(value)
}

function getColumns(rows) {
  const columns = []
  const seen = new Set()

  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => {
      const normalizedKey = normalizeKey(key)
      const hidden =
        normalizedKey === 'id' ||
        normalizedKey.endsWith('id') ||
        normalizedKey.endsWith('guid') ||
          normalizedKey === 'vouchernumber' ||
          normalizedKey === 'type' ||
          normalizedKey === 'vouchertype' ||
          normalizedKey === 'completedat'

      if (!hidden && normalizedKey && !seen.has(normalizedKey)) {
        seen.add(normalizedKey)
        columns.push(key)
      }
    })
  })

  return columns
}

function getDetailTableColumns(value) {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isStructured)) {
    return []
  }

  return getColumns(value)
}

function MyVouchersPage({ companyId, title = 'My Vouchers', voucherType = '', commandType = '' }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isQuotationPage = voucherType === 'Quotation'
  const isReceiptOrPaymentPage = voucherType === 'Receipt' || voucherType === 'Payment'
  const isSimpleCommandPage = commandType === 'CREATE_PARTY' || commandType === 'CREATE_STOCK_ITEM'
  const isCommandEntryPage = isQuotationPage || isReceiptOrPaymentPage || voucherType === 'Invoice' || isSimpleCommandPage
  const [commands, setCommands] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(isCommandEntryPage ? '' : 'PENDING')
  const [fromDate, setFromDate] = useState(isReceiptOrPaymentPage ? '' : '2010-09-01')
  const [toDate, setToDate] = useState(isReceiptOrPaymentPage ? '' : '2026-09-15')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingCommandId, setDeletingCommandId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [detailStack, setDetailStack] = useState([])

  const openDetail = (title, value) => {
    setDetailStack((currentStack) => [
      ...currentStack,
      { title, value },
    ])
  }

  const closeDetail = () => {
    setDetailStack((currentStack) => currentStack.slice(0, -1))
  }

  useEffect(() => {
    setPage(1)
  }, [companyId, status, query, fromDate, toDate, pageSize])

  useEffect(() => {
    if (!accessToken || !companyId) {
      setCommands([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(accessToken ? 'No company selected.' : 'Session expired. Please sign in.')
      return undefined
    }

    if (!isSimpleCommandPage && fromDate && toDate && fromDate >= toDate) {
      setCommands([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage('From date cannot be greater than To date.')
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchCompanyCommands(accessToken, companyId, {
      type: commandType,
      voucherType,
      status: isSimpleCommandPage ? '' : status.trim().toUpperCase(),
      page,
      limit: pageSize,
      q: query.trim(),
      ...(isSimpleCommandPage
        ? {}
        : {
            ...(fromDate ? { from: fromDate } : {}),
            ...(toDate ? { to: toDate } : {}),
          }),
    })
      .then((response) => {
        if (!isMounted) return

        const nextCommands = extractCommands(response)
        const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data || response
        const total = Number(
          pagination?.total ??
            pagination?.totalItems ??
            pagination?.totalRecords ??
            response?.total ??
            nextCommands.length,
        )
        const pages = Number(
          pagination?.totalPages ??
            pagination?.pages ??
            Math.ceil(total / pageSize),
        )

        setCommands(nextCommands)
        setTotalItems(Number.isFinite(total) ? total : nextCommands.length)
        setTotalPages(Number.isFinite(pages) && pages > 0 ? pages : 1)
      })
      .catch((error) => {
        if (!isMounted) return
        setCommands([])
        setTotalItems(0)
        setTotalPages(1)
        setErrorMessage(error?.message || 'Unable to load vouchers')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, commandType, isQuotationPage, isReceiptOrPaymentPage, voucherType, status, query, fromDate, toDate, page, pageSize])

  const columns = useMemo(() => getColumns(commands), [commands])
  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [1, '...', page - 1, page, page + 1, '...', totalPages]

  const getCommandId = (command) =>
    command?._id ||
    command?.commandId ||
    command?.command_id ||
    command?.id ||
    ''

  const isPendingCommand = (command) => {
    const status = String(
      command?.status ||
        command?.state ||
        command?.commandStatus ||
        command?.command_status ||
        '',
    ).toLowerCase()

    return status === 'pending'
  }

  const handleDelete = async (command) => {
    const commandId = getCommandId(command)
    if (!commandId || deletingCommandId) return

    if (!window.confirm('Delete this pending command?')) return

    try {
      setDeletingCommandId(String(commandId))
      setErrorMessage('')
      await deleteCompanyCommand(accessToken, companyId, commandId)
      setCommands((currentCommands) =>
        currentCommands.filter(
          (item) => String(getCommandId(item)) !== String(commandId),
        ),
      )
      setTotalItems((currentTotal) => Math.max(0, currentTotal - 1))
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to delete command')
    } finally {
      setDeletingCommandId('')
    }
  }

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">
          <div className="flex min-h-[70px] min-w-max flex-nowrap items-center gap-3 border-b border-[#e5ebf2] px-4 py-3 sm:px-8">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search party ledger or voucher number"
              className="h-[38px] w-[280px] shrink-0 rounded-lg border border-[#d9e2ed] bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-[#17355f] focus:ring-1 focus:ring-[#17355f]/20"
            />

            <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px]">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(event) =>
                  setPageSize(Number(event.target.value))
                }
                className="h-[38px] w-[64px] cursor-pointer rounded-lg border border-[#10b981] bg-white px-2 text-[12px] text-slate-700 outline-none"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>rows</span>
            </label>

            {!isSimpleCommandPage && <label className="mx-10 flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px]">
              <span>Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="h-[38px] min-w-[150px] cursor-pointer rounded-lg border border-[#10b981] bg-white px-3 text-[12px] text-slate-700 outline-none"
              >
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SENT">Sent</option>
                <option value="DONE">Done</option>
                <option value="FAILED">Failed</option>
              </select>
            </label>}

            <div className="hidden min-w-0 flex-1 lg:block" />

            {!isSimpleCommandPage && <label className="flex items-center gap-2 text-[12px]">
              From
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="h-[30px] rounded-md border border-slate-300 px-2 text-[11px]" />
            </label>}
            {!isSimpleCommandPage && <label className="flex items-center gap-2 text-[12px]">
              To
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="h-[30px] rounded-md border border-slate-300 px-2 text-[11px]" />
            </label>}
            <span className="text-[12px]">Page {page} · {pageSize} per page</span>
          </div>

          {errorMessage && <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage}</div>}

          <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
            <div className="min-w-max">
              <div className="grid border-b border-[#dfe7f0] bg-[#f4f7fb] px-4 py-3 text-[11px] font-semibold uppercase text-[#274b78]" style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, 180px) 120px` }}>
                {columns.map((column) => <div key={column} className="w-[180px] min-w-[180px] max-w-[180px] border-l border-[#dfe7f0] pr-3">{formatLabel(column)}</div>)}
                <div className="w-[120px] min-w-[120px] max-w-[120px] border-l border-[#dfe7f0]">Action</div>
              </div>

              {isLoading ? (
                <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center text-xs text-slate-500">Loading vouchers...</div>
              ) : commands.length > 0 ? commands.map((command, index) => (
                <div key={getCommandId(command) || index} className="grid min-w-max items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] last:border-b-0 odd:bg-white even:bg-[#fbfdff]" style={{ gridTemplateColumns: `repeat(${Math.max(columns.length, 1)}, 180px) 120px` }}>
                  {columns.map((column) => {
                    const value = command?.[column]
                    return <div key={column} className="w-[180px] min-w-[180px] max-w-[180px] border-l border-[#e5ebf2] pr-3">
                      {isViewableField(column, value) ? <button type="button" onClick={() => openDetail(formatLabel(column), value)} className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">{getViewLabel(column)}</button> : <span className={getStatusClasses(column, value)}>{formatValue(value, column)}</span>}
                    </div>
                  })}
                  <div className="w-[120px] min-w-[120px] max-w-[120px] border-l border-[#e5ebf2]">
                    {isPendingCommand(command) && getCommandId(command) ? (
                      <button
                        type="button"
                        disabled={deletingCommandId === String(getCommandId(command))}
                        onClick={() => handleDelete(command)}
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingCommandId === String(getCommandId(command)) ? 'Deleting...' : 'Delete'}
                      </button>
                    ) : null}
                  </div>
                </div>
              )) : <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center text-xs text-slate-500">No vouchers found.</div>}
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs">
            <span>{totalItems ? `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalItems)} of ${totalItems}` : '0-0 of 0'}</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={isLoading || page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="h-9 w-9 rounded-md border border-[#d9e2ed] disabled:opacity-40">&lt;</button>
              {pageItems.map((pageNumber, index) => pageNumber === '...' ? <span key={`ellipsis-${index}`}>...</span> : <button key={pageNumber} type="button" disabled={isLoading} onClick={() => setPage(pageNumber)} className={pageNumber === page ? 'h-9 w-9 rounded-md border border-[#059669] bg-[#059669] text-white' : 'h-9 w-9 rounded-md border border-[#d9e2ed]'}>{pageNumber}</button>)}
              <button type="button" disabled={isLoading || page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="h-9 w-9 rounded-md border border-[#d9e2ed] disabled:opacity-40">&gt;</button>
            </div>
          </footer>
        </section>
      </div>

      {detailStack.map((detail, index) => (
        <div key={`${detail.title}-${index}`} className="fixed inset-x-0 bottom-0 top-16 flex items-center justify-center bg-slate-950/50 p-4" style={{ zIndex: 1000 + index * 100 }}>
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#dfe7f0] px-5 py-4">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900">{detail.title}</h2>
                <p className="mt-1 text-[11px] text-slate-500">{Array.isArray(detail.value) ? `${detail.value.length} entries` : 'Details'}</p>
              </div>
              <button type="button" aria-label="Close details" onClick={closeDetail} className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e2ed] text-lg leading-none text-slate-500 transition hover:bg-slate-50">x</button>
            </div>
            <div className="min-h-0 overflow-auto p-4">
              {getDetailTableColumns(detail.value).length > 0 ? (
                <div className="min-w-max overflow-x-auto border border-[#dfe7f0]">
                  <table className="w-full min-w-[900px] border-collapse text-[12px] text-[#17355f]">
                    <thead className="bg-[#f1f5f9] text-left text-[10px] font-semibold uppercase tracking-wide text-[#52657d]">
                      <tr>
                        {getDetailTableColumns(detail.value).map((column) => <th key={column} className="border-b border-r border-[#dfe7f0] px-3 py-2.5 font-semibold last:border-r-0">{formatLabel(column)}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.value.map((row, rowIndex) => <tr key={rowIndex} className="odd:bg-white even:bg-[#fbfdff]">
                        {getDetailTableColumns(detail.value).map((column) => {
                          const value = row?.[column]
                          return <td key={column} className="border-b border-r border-[#dfe7f0] px-3 py-2.5 last:border-r-0">{isStructured(value) ? <button type="button" onClick={() => openDetail(formatLabel(column), value)} className="rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">View</button> : formatValue(value, column)}</td>
                        })}
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              ) : getDetailEntries(detail.value).length > 0 ? getDetailEntries(detail.value).map(([key, value]) => <div key={key} className="grid grid-cols-[180px_1fr] items-start border-b border-[#dfe7f0] px-2 py-3 text-xs"><strong>{Array.isArray(detail.value) ? `Item ${key}` : formatLabel(key)}</strong>{isStructured(value) ? <button type="button" onClick={() => openDetail(Array.isArray(detail.value) ? `Item ${key}` : formatLabel(key), value)} className="w-fit rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">View</button> : <span className="whitespace-pre-wrap break-words">{formatValue(value, key)}</span>}</div>) : <div className="whitespace-pre-wrap break-words px-2 py-3 text-sm text-[#17355f]">{formatValue(detail.value)}</div>}
            </div>
            <div className="flex justify-end border-t border-[#dfe7f0] px-5 py-3">
              <button type="button" onClick={closeDetail} className="rounded-md bg-[#172a46] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#203b61]">Close</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyVouchersPage
