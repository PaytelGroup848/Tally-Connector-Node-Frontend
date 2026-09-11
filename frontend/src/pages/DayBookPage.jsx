
import { useEffect, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  extractDayBookPagination,
  extractDayBookRows,
  fetchDayBook,
} from '../services/companiesApi'

/*
 * =========================================================
 * HIDDEN FIELDS
 * =========================================================
 */
const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'companyId',
  'organizationId',
  'raw',
  'source',

  // Tally External ID
  'tallyExternalId',
  'tallyExternalID',
  'tally_external_id',
  'tally external id',

  // Effective Date
  'effectiveDate',
  'effective_date',
  'effective date',

  // GUID
  'guid',
  'GUID',

  // Alter ID
  'alterId',
  'alterID',
  'alter_id',
  'alter id',

  // Voucher ID
  'voucherId',
  'voucherID',
  'voucher_id',
  'voucher id',
])

/*
 * =========================================================
 * POPUP FIELDS
 * =========================================================
 */
const popupFields = new Set([
  'inventory entries',
  'ledger entries',
])

/*
 * =========================================================
 * FORMAT LABEL
 * =========================================================
 */
function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

/*
 * =========================================================
 * FORMAT VALUE
 * =========================================================
 */
function isDateField(field) {
  const normalizedField = String(field || '')
    .replace(/[_-\s]/g, '')
    .toLowerCase()

  return (
    normalizedField.includes('date') ||
    normalizedField.includes('time') ||
    normalizedField.includes('timestamp') ||
    normalizedField.includes('createdat') ||
    normalizedField.includes('updatedat')
  )
}

function formatIstDate(value) {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
}

function formatValue(value, field = '') {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'NA'
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  if (isDateField(field)) {
    return formatIstDate(value)
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN')
  }

  return String(value)
}

/*
 * =========================================================
 * NORMALIZE FIELD NAME
 * =========================================================
 */
function normalizeFieldName(field) {
  return String(field)
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/*
 * =========================================================
 * IS POPUP FIELD
 * =========================================================
 */
function isPopupField(field) {
  return popupFields.has(
    normalizeFieldName(field),
  )
}

/*
 * =========================================================
 * IS HIDDEN FIELD
 * =========================================================
 */
function isHiddenField(field) {
  const normalizedKey = String(field)
    .trim()
    .toLowerCase()

  return Array.from(hiddenFields).some(
    (hiddenField) =>
      String(hiddenField)
        .trim()
        .toLowerCase() === normalizedKey,
  )
}

/*
 * =========================================================
 * DAY BOOK PAGE
 * =========================================================
 */
function DayBookPage({ companyId }) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  /*
   * =======================================================
   * STATE
   * =======================================================
   */
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')

  const getTodayDate = () => new Date().toISOString().slice(0, 10)

  const [fromDate, setFromDate] =
    useState('2010-09-01')

  const [toDate, setToDate] =
    useState('2026-09-08')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [isLoading, setIsLoading] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  /*
   * Selected popup information.
   */
  const [selectedPopup, setSelectedPopup] =
    useState(null)

  /*
   * =======================================================
   * RESET PAGE WHEN FILTER CHANGES
   * =======================================================
   */
  useEffect(() => {
    setPage(1)
  }, [
    companyId,
    fromDate,
    toDate,
    pageSize,
    query,
  ])

  /*
   * =======================================================
   * CLOSE POPUP WITH ESCAPE
   * =======================================================
   */
  useEffect(() => {
    if (!selectedPopup) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedPopup(null)
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [selectedPopup])

  /*
   * =======================================================
   * LOAD DAY BOOK
   * =======================================================
   */
  useEffect(() => {
    if (!accessToken) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(
        'Session expired. Please sign in.',
      )

      return undefined
    }

    if (!companyId) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(
        'No company selected.',
      )

      return undefined
    }

    let isMounted = true

    async function loadDayBook() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await fetchDayBook(
          accessToken,
          companyId,
          {
            from: fromDate,
            to: toDate,
            page,
            limit: pageSize,
            q: query,
          },
        )

        if (!isMounted) {
          return
        }

        console.log(
          'DAY BOOK API RESPONSE:',
          response,
        )

        const nextRows =
          extractDayBookRows(response)

        const pagination =
          extractDayBookPagination(response)

        console.log(
          'DAY BOOK ROWS:',
          nextRows,
        )

        console.log(
          'DAY BOOK PAGINATION:',
          pagination,
        )

        /*
         * =================================================
         * TOTAL RECORDS
         * =================================================
         */
        const totalCandidates = [
          pagination?.total,
          pagination?.totalItems,
          pagination?.totalRecords,
          pagination?.count,
        ]

        const totalFromApi =
          totalCandidates.find(
            (value) =>
              value !== undefined &&
              value !== null &&
              Number.isFinite(
                Number(value),
              ),
          )

        const safeTotal =
          totalFromApi !== undefined
            ? Number(totalFromApi)
            : nextRows.length

        /*
         * =================================================
         * PAGE SIZE
         * =================================================
         */
        const apiLimit = Number(
          pagination?.limit ??
            pagination?.pageSize ??
            pageSize,
        )

        const safeLimit =
          Number.isFinite(apiLimit) &&
          apiLimit > 0
            ? apiLimit
            : pageSize

        /*
         * =================================================
         * TOTAL PAGES
         * =================================================
         */
        const calculatedTotalPages =
          Math.max(
            1,
            Math.ceil(
              safeTotal / safeLimit,
            ),
          )

        const apiTotalPages = Number(
          pagination?.totalPages ??
            pagination?.pages ??
            calculatedTotalPages,
        )

        const safeTotalPages =
          Number.isFinite(apiTotalPages) &&
          apiTotalPages > 0
            ? apiTotalPages
            : calculatedTotalPages

        setRows(nextRows)
        setTotalItems(safeTotal)
        setTotalPages(safeTotalPages)
      } catch (error) {
        if (!isMounted) {
          return
        }

        console.error(
          'DAY BOOK API ERROR:',
          error,
        )

        setRows([])
        setTotalItems(0)
        setTotalPages(1)

        setErrorMessage(
          error?.message ||
            'Unable to load day book',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDayBook()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    companyId,
    fromDate,
    toDate,
    page,
    pageSize,
    query,
  ])

  /*
   * =======================================================
   * TABLE FIELDS
   * =======================================================
   */
  const fields = useMemo(() => {
    const keys = new Set()

    rows.forEach((row) => {
      if (
        !row ||
        typeof row !== 'object'
      ) {
        return
      }

      Object.keys(row).forEach((key) => {
        if (!isHiddenField(key)) {
          keys.add(key)
        }
      })
    })

    return Array.from(keys)
  }, [rows])

  /*
   * =======================================================
   * GRID TEMPLATE
   *
   * Every column gets the same width.
   * min-width prevents the columns from collapsing.
   * =======================================================
   */
  const gridTemplateColumns = useMemo(() => {
    if (!fields.length) {
      return 'minmax(240px, 1fr)'
    }

    return fields
      .map(
        () => 'minmax(180px, 1fr)',
      )
      .join(' ')
  }, [fields])

  /*
   * =======================================================
   * PAGINATION
   * =======================================================
   */
  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      )
    }

    if (page <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        '...',
        totalPages,
      ]
    }

    if (
      page >=
      totalPages - 3
    ) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      1,
      '...',
      page - 1,
      page,
      page + 1,
      '...',
      totalPages,
    ]
  }, [page, totalPages])

  /*
   * =======================================================
   * RECORD RANGE
   * =======================================================
   */
  const recordStart =
    totalItems > 0
      ? (page - 1) * pageSize + 1
      : 0

  const recordEnd =
    totalItems > 0
      ? Math.min(
          page * pageSize,
          totalItems,
        )
      : 0

  const tableCellClass =
    'flex h-[52px] min-w-0 items-center border-r border-slate-100 px-3 last:border-r-0'

  const tableTextClass =
    'w-full truncate text-left text-xs leading-5 text-slate-700'

  /*
   * =======================================================
   * OPEN POPUP
   * =======================================================
   */
  const openPopup = (
    field,
    value,
  ) => {
    setSelectedPopup({
      field,
      label: formatLabel(field),
      value,
    })
  }

  /*
   * =======================================================
   * RENDER POPUP VALUE
   * =======================================================
   */
  const renderNestedTable = (
    value,
    depth = 0,
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return (
        <span className="text-slate-500">
          NA
        </span>
      )
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <span className="text-slate-500">
            No entries found.
          </span>
        )
      }

      return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-xs text-slate-700">
              <tbody>
                {value.map((item, index) => (
                  <tr
                    key={`nested-row-${depth}-${index}`}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="border-r border-slate-200 bg-slate-50 px-3 py-2 align-top font-semibold text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {typeof item === 'object' && item !== null ? (
                        renderNestedTable(item, depth + 1)
                      ) : (
                        <span className="whitespace-pre-wrap break-words">
                          {formatValue(item)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value)

      if (entries.length === 0) {
        return (
          <span className="text-slate-500">
            Empty object
          </span>
        )
      }

      return (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-xs text-slate-700">
              <tbody>
                {entries.map(([key, itemValue]) => (
                  <tr
                    key={`${depth}-${key}`}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="w-[180px] border-r border-slate-200 bg-slate-50 px-3 py-2 align-top font-semibold text-slate-600">
                      {formatLabel(key)}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {typeof itemValue === 'object' && itemValue !== null ? (
                        renderNestedTable(itemValue, depth + 1)
                      ) : (
                        <span className="whitespace-pre-wrap break-words">
                          {formatValue(itemValue, key)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    return (
      <span className="whitespace-pre-wrap break-words">
        {String(value)}
      </span>
    )
  }

  const renderPopupValue = (
    value,
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500">
          No data available.
        </div>
      )
    }

    return (
      <div className="w-full">
        {renderNestedTable(value)}
      </div>
    )
  }

  /*
   * =======================================================
   * RENDER PAGE
   * =======================================================
   */
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* ==================================================
          HEADER
          ================================================== */}
      <div className="flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5">
        <div>
          <span className="block text-xs text-slate-500">
            Reports
          </span>

          <h1 className="text-xl font-bold text-slate-900">
            Day Book
          </h1>
        </div>

        <span className="text-xs text-slate-500">
          {totalItems > 0
            ? `${totalItems} records`
            : 'NA records'}
        </span>
      </div>

      {/* ==================================================
          CONTENT
          ================================================== */}
      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">

        {/* =================================================
            FILTER BAR
            ================================================= */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">

          {/* FROM DATE */}
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              From
            </span>

            <input
              type="date"
              value={fromDate}
              onChange={(event) =>
                setFromDate(
                  event.target.value,
                )
              }
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </label>

          {/* TO DATE */}
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              To
            </span>

            <input
              type="date"
              value={toDate}
              onChange={(event) =>
                setToDate(
                  event.target.value,
                )
              }
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </label>

          {/* SEARCH */}
          <label className="flex h-9 w-[260px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400 transition focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
            <Search size={15} />

            <input
              type="text"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target.value,
                )
              }
              placeholder="Search voucher or ledger"
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          {/* PAGE SIZE */}
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-600">
            <span>
              Show
            </span>

            <select
              value={pageSize}
              onChange={(event) =>
                setPageSize(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              {[10, 20, 30, 50].map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>
                ),
              )}
            </select>

            <span>
              records
            </span>
          </label>
        </div>

        {/* =================================================
            ERROR
            ================================================= */}
        {errorMessage && (
          <div className="mx-5 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        {/* =================================================
            TABLE
            ================================================= */}
        <div className="mx-5 my-3 overflow-x-auto rounded-lg border border-slate-200 bg-white">

          {/* Force consistent width across all columns */}
          <div className="min-w-[1100px]">

            {/* =================================================
                TABLE HEADER
                ================================================= */}
            {fields.length > 0 && (
              <div
                className="grid items-center border-b border-slate-200 bg-slate-100 px-4"
                style={{
                  gridTemplateColumns,
                  minHeight: '52px',
                }}
              >
                {fields.map(
                  (field) => (
                    <div
                      key={field}
                      className="flex h-[52px] min-w-0 items-center border-r border-slate-200 px-3 last:border-r-0"
                      title={formatLabel(
                        field,
                      )}
                    >
                      <span className="w-full truncate text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {formatLabel(
                          field,
                        )}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}

            {/* =================================================
                LOADING
                ================================================= */}
            {isLoading && (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />

                  <span>
                    Loading day book...
                  </span>
                </div>
              </div>
            )}

            {/* =================================================
                DATA
                ================================================= */}
            {!isLoading &&
              rows.length > 0 && (
                <div>
                  {rows.map(
                    (
                      row,
                      index,
                    ) => (
                      <div
                        key={
                          row?._id ||
                          row?.id ||
                          `day-book-row-${index}`
                        }
                        className="grid items-center border-b border-slate-100 px-4 last:border-b-0 odd:bg-white even:bg-slate-50 hover:bg-slate-50"
                        style={{
                          gridTemplateColumns,
                          minHeight: '52px',
                        }}
                      >
                        {fields.map(
                          (
                            field,
                          ) => {
                            const value =
                              row?.[
                                field
                              ]

                            const clickable =
                              isPopupField(
                                field,
                              )

                            /*
                             * =================================================
                             * INVENTORY ENTRIES / LEDGER ENTRIES
                             *
                             * ONLY SHOW VIEW BUTTON
                             * =================================================
                             */
                            if (
                              clickable
                            ) {
                              return (
                                <div
                                  key={
                                    field
                                  }
                                  className={
                                    tableCellClass
                                  }
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openPopup(
                                        field,
                                        value,
                                      )
                                    }
                                    className="inline-flex h-8 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-medium text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                                  >
                                    View
                                  </button>
                                </div>
                              )
                            }

                            /*
                             * =================================================
                             * NORMAL COLUMNS
                             * =================================================
                             */
                            return (
                              <div
                                key={
                                  field
                                }
                                className={
                                  tableCellClass
                                }
                              >
                                <div
                                  className={
                                    tableTextClass
                                  }
                                  title={
                                    typeof value ===
                                    'object'
                                      ? formatValue(
                                          value,
                                          field,
                                        )
                                      : String(
                                          value ??
                                            '',
                                        )
                                  }
                                >
                                  {formatValue(
                                    value,
                                    field,
                                  )}
                                </div>
                              </div>
                            )
                          },
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

            {/* =================================================
                EMPTY
                ================================================= */}
            {!isLoading &&
              rows.length === 0 && (
                <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                  <div className="text-sm font-medium text-slate-500">
                    NA
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* =================================================
            PAGINATION FOOTER
            ================================================= */}
        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">

          {/* RECORD COUNT */}
          <span className="text-xs text-slate-600">
            {totalItems > 0
              ? `${recordStart}-${recordEnd} of ${totalItems}`
              : 'NA-NA of NA'}
          </span>

          {/* PAGINATION BUTTONS */}
          <div className="flex items-center gap-2">

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={
                isLoading ||
                page <= 1
              }
              onClick={() =>
                setPage(
                  (currentPage) =>
                    Math.max(
                      1,
                      currentPage - 1,
                    ),
                )
              }
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}
            {pageItems.map(
              (
                pageNumber,
                index,
              ) =>
                pageNumber ===
                '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={
                      pageNumber
                    }
                    type="button"
                    disabled={
                      isLoading
                    }
                    onClick={() =>
                      setPage(
                        pageNumber,
                      )
                    }
                    className={
                      pageNumber ===
                      page
                        ? 'h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white'
                        : 'h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50'
                    }
                  >
                    {
                      pageNumber
                    }
                  </button>
                ),
            )}

            {/* NEXT */}
            <button
              type="button"
              disabled={
                isLoading ||
                page >=
                  totalPages
              }
              onClick={() =>
                setPage(
                  (currentPage) =>
                    Math.min(
                      totalPages,
                      currentPage + 1,
                    ),
                )
              }
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      </section>

      {/* ==================================================
          INTERNAL DATA MODAL
          ================================================== */}
      {selectedPopup && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(
            event,
          ) => {
            /*
             * Close when clicking the backdrop.
             */
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedPopup(
                null,
              )
            }
          }}
        >
          {/* MODAL */}
          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

            {/* =================================================
                MODAL HEADER
                ================================================= */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {
                    selectedPopup.label
                  }
                </h2>
              </div>

              {/* X BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setSelectedPopup(
                    null,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                aria-label="Close popup"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* =================================================
                MODAL BODY
                ================================================= */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5">
              {renderPopupValue(
                selectedPopup.value,
              )}
            </div>

            {/* =================================================
                MODAL FOOTER
                ================================================= */}
            <div className="flex items-center justify-end border-t border-slate-200 bg-white px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setSelectedPopup(
                    null,
                  )
                }
                className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DayBookPage

