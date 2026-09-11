import { useEffect, useMemo, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractVoucherPagination,
  extractVouchers,
  fetchCompanyVouchers,
} from '../services/companiesApi'

const MODAL_LAYER = {
  entry: 1000,
  billAllocation: 1100,
  field: 1200,
  detail: 1300,
}

const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'v',

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

function formatIstDate(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'NA'
  }

  const rawValue = String(value).trim()

  if (!rawValue) {
    return 'NA'
  }

  const dateValue =
    rawValue.match(/^\d{4}-\d{2}-\d{2}$/)
      ? new Date(
          Number(rawValue.slice(0, 4)),
          Number(rawValue.slice(5, 7)) - 1,
          Number(rawValue.slice(8, 10)),
        )
      : new Date(rawValue)

  if (Number.isNaN(dateValue.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
  }).format(dateValue)
}

function isJsonString(value) {
  if (typeof value !== 'string') {
    return false
  }

  const trimmed = value.trim()

  if (
    !trimmed ||
    !(
      trimmed.startsWith('{') ||
      trimmed.startsWith('[')
    )
  ) {
    return false
  }

  try {
    JSON.parse(trimmed)
    return true
  } catch {
    return false
  }
}

function normalizeStructuredValue(value) {
  if (
    typeof value === 'string' &&
    isJsonString(value)
  ) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  return value
}

function isStructuredValue(value) {
  const normalized =
    normalizeStructuredValue(value)

  return (
    normalized !== null &&
    normalized !== undefined &&
    typeof normalized === 'object'
  )
}

function formatValue(value, key = '') {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const normalizedValue =
    normalizeStructuredValue(value)

  if (
    typeof normalizedValue === 'object'
  ) {
    try {
      return JSON.stringify(
        normalizedValue,
        null,
        2,
      )
    } catch {
      return String(value)
    }
  }

  const normalizedKey =
    String(key || '').toLowerCase()

  if (
    normalizedKey.includes('date') ||
    normalizedKey.includes('at') ||
    normalizedKey.includes('time')
  ) {
    return formatIstDate(value)
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN')
  }

  return String(value)
}

function isHiddenField(field) {
  const normalizedKey =
    String(field).trim().toLowerCase()

  return Array.from(hiddenFields).some(
    (hiddenField) =>
      String(hiddenField)
        .trim()
        .toLowerCase() === normalizedKey,
  )
}

function normalizeFieldKey(field) {
  return String(field ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function getUniqueFields(fields = []) {
  const seenFields = new Set()
  const uniqueFields = []

  fields.forEach((field) => {
    if (
      typeof field !== 'string' ||
      !field.trim() ||
      isHiddenField(field)
    ) {
      return
    }

    const normalizedField =
      normalizeFieldKey(field)

    if (
      normalizedField &&
      !seenFields.has(normalizedField)
    ) {
      seenFields.add(normalizedField)
      uniqueFields.push(field)
    }
  })

  return uniqueFields
}

function getEntryFields(entries) {
  const keys = []

  entries.forEach((entry) => {
    keys.push(
      ...Object.keys(entry || {}),
    )
  })

  return getUniqueFields(keys)
}

function getEntryType(field) {
  const normalizedField = field
    .replace(/[_-]+/g, '')
    .toLowerCase()

  if (
    normalizedField ===
    'inventoryentries'
  ) {
    return 'Inventory Entries'
  }

  if (
    normalizedField ===
    'ledgerentries'
  ) {
    return 'Ledger Entries'
  }

  return ''
}

function isBillAllocationsField(field) {
  return (
    field
      .replace(/[_-]+/g, '')
      .toLowerCase() === 'billallocations'
  )
}

function getNextLayer(parentLayer) {
  return (parentLayer ?? MODAL_LAYER.entry) + 100
}

function VoucherLinesPage({
  companyId,
  companyName = '',
  voucherId: propVoucherId = '',
}) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const routeVoucherId = useMemo(() => {
    if (typeof window === 'undefined') {
      return propVoucherId
    }

    const params = new URLSearchParams(
      window.location.search,
    )

    const queryVoucherId =
      params.get('voucherId') ||
      params.get('VoucherId') ||
      params.get('voucher_id') ||
      ''

    return queryVoucherId || propVoucherId
  }, [propVoucherId])

  const [rows, setRows] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const [totalItems, setTotalItems] =
    useState(0)

  const [totalPages, setTotalPages] =
    useState(1)

  const [isLoading, setIsLoading] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')

  const [entryPopup, setEntryPopup] =
    useState(null)

  const [
    billAllocationPopup,
    setBillAllocationPopup,
  ] = useState(null)

  const [detailPopup, setDetailPopup] =
    useState(null)

  const [fieldPopup, setFieldPopup] =
    useState(null)

  useEffect(() => {
    setPage(1)
  }, [
    companyId,
    pageSize,
    routeVoucherId,
    searchQuery,
  ])

  const activeVoucherId =
    (routeVoucherId || '').trim()

  const normalizedSearchQuery =
    searchQuery.trim().toLowerCase()

  const normalizedCompanyName =
    companyName.trim().toLowerCase()

  const isExactCompanySearch =
    normalizedSearchQuery !== '' &&
    normalizedSearchQuery === normalizedCompanyName

  const activeSearchQuery =
    isExactCompanySearch
      ? activeVoucherId
      : searchQuery.trim() || activeVoucherId

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

    async function loadVoucherLines() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response =
          await fetchCompanyVouchers(
            accessToken,
            companyId,
            {
              page,
              limit: pageSize,
              q: activeSearchQuery,
            },
          )

        if (!isMounted) return

        const nextRows =
          extractVouchers(response)

        const pagination =
          extractVoucherPagination(
            response,
          )

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

        setRows(nextRows)
        setTotalItems(safeTotal)

        setTotalPages(
          Number.isFinite(apiTotalPages) &&
            apiTotalPages > 0
            ? apiTotalPages
            : calculatedTotalPages,
        )
      } catch (error) {
        if (!isMounted) return

        setRows([])
        setTotalItems(0)
        setTotalPages(1)

        setErrorMessage(
          error?.message ||
            'Unable to load vouchers',
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadVoucherLines()

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    companyId,
    activeSearchQuery,
    page,
    pageSize,
  ])

  const fields = useMemo(() => {
    const keys = []

    rows.forEach((row) => {
      if (
        !row ||
        typeof row !== 'object'
      ) {
        return
      }

      keys.push(...Object.keys(row))
    })

    return getUniqueFields(keys)
  }, [rows])

  const COLUMN_WIDTH = 220
  const ACTION_WIDTH = 100

  const gridTemplateColumns =
    fields.length > 0
      ? `${fields
          .map(
            () =>
              `${COLUMN_WIDTH}px`,
          )
          .join(' ')} ${ACTION_WIDTH}px`
      : `${ACTION_WIDTH}px`

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
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
      page >= totalPages - 3
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

  const entryFields = entryPopup
    ? getEntryFields(
        entryPopup.entries,
      )
    : []

  const billAllocationFields =
    billAllocationPopup
      ? getEntryFields(
          billAllocationPopup.entries,
        )
      : []

  const detailFields = detailPopup
    ? getUniqueFields(
        Object.keys(
          detailPopup.row || {},
        ),
      )
    : []

  const fieldEntries = fieldPopup
    ? (
        Array.isArray(
          normalizeStructuredValue(
            fieldPopup.value,
          ),
        )
          ? normalizeStructuredValue(
              fieldPopup.value,
            )
          : [
              normalizeStructuredValue(
                fieldPopup.value,
              ),
            ]
      ).filter(
        (item) =>
          item &&
          typeof item === 'object',
      )
    : []

  const fieldPopupFields =
    fieldEntries.length > 0
      ? getEntryFields(fieldEntries)
      : []

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

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
      {errorMessage && (
        <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">
        {/* TOP BAR */}
        <div className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#e5ebf2] px-8 py-3">
          <span className="text-[13px] text-[#17355f]">
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
            className="h-[38px] rounded-lg border border-[#10b981] bg-white px-3 text-[13px] text-[#17355f] outline-none"
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

          <span className="text-[13px] text-[#17355f]">
            records
          </span>

         

          <span className="ml-auto text-[12px] text-[#17355f]">
            Page {page} · {pageSize}{' '}
            per page
          </span>
        </div>

        {/* TABLE */}
        <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
          {/* TABLE HEADER */}
          <div
            style={{
              gridTemplateColumns,
            }}
            className="grid min-w-max border-b border-[#dfe7f0] bg-[#f4f7fb] px-4 py-3 text-[11px] font-semibold uppercase tracking-normal text-[#274b78]"
          >
            {fields.length > 0 ? (
              <>
                {fields.map((field) => (
                  <div
                    key={field}
                    className="box-border w-[220px] min-w-[220px] max-w-[220px] overflow-hidden pr-4"
                  >
                    <span className="block whitespace-normal break-words">
                      {formatLabel(field)}
                    </span>
                  </div>
                ))}

                <div className="box-border w-[100px] min-w-[100px] max-w-[100px]">
                  <span className="block">
                    VOUCHER LINES
                  </span>
                </div>
              </>
            ) : (
              <div className="w-[100px]">
                VOUCHER LINES
              </div>
            )}
          </div>

          {/* TABLE BODY */}
          {isLoading ? (
            <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
              Loading voucher lines...
            </div>
          ) : rows.length > 0 ? (
            rows.map(
              (row, index) => {
                const rowKey =
                  row?._id ||
                  row?.id ||
                  `voucher-lines-row-${index}`

                return (
                  <div
                    key={rowKey}
                    style={{
                      gridTemplateColumns,
                    }}
                    className="grid min-w-max items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] text-[#17355f] last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                  >
                    {fields.map(
                      (field) => {
                        const cellValue =
                          normalizeStructuredValue(
                            row?.[field],
                          )

                        const isStructuredCell =
                          isStructuredValue(
                            row?.[field],
                          )

                        const entryCount =
                          Array.isArray(
                            cellValue,
                          )
                            ? cellValue.length
                            : 0

                        return (
                          <div
                            key={field}
                            className="box-border w-[220px] min-w-[220px] max-w-[220px] overflow-hidden pr-4"
                          >
                            {Array.isArray(
                              cellValue,
                            ) &&
                            entryCount > 0 &&
                            getEntryType(
                              field,
                            ) ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setEntryPopup(
                                    {
                                      title:
                                        getEntryType(
                                          field,
                                        ),
                                      entries:
                                        cellValue,
                                      layer:
                                        getNextLayer(
                                          detailPopup?.layer ??
                                            entryPopup?.layer ??
                                            billAllocationPopup?.layer ??
                                            MODAL_LAYER.entry,
                                        ),
                                    },
                                  )
                                }
                                className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                              >
                                View{' '}
                                {
                                  entryCount
                                }{' '}
                                entries
                              </button>
                            ) : isStructuredCell ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldPopup(
                                    {
                                      title:
                                        formatLabel(
                                          field,
                                        ),
                                      value:
                                        cellValue,
                                      layer:
                                        getNextLayer(
                                          detailPopup?.layer ??
                                            entryPopup?.layer ??
                                            billAllocationPopup?.layer ??
                                            MODAL_LAYER.entry,
                                        ),
                                    },
                                  )
                                }
                                className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                              >
                                View
                              </button>
                            ) : (
                              <pre className="m-0 max-h-28 w-full overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                                {formatValue(
                                  row?.[
                                    field
                                  ],
                                  field,
                                )}
                              </pre>
                            )}
                          </div>
                        )
                      },
                    )}

                    {/* ACTION / VIEW BUTTON */}
                    <div className="flex w-[100px] min-w-[100px] max-w-[100px] items-start justify-start">
                      <button
                        type="button"
                        onClick={() =>
                          setDetailPopup(
                            {
                              title:
                                'Voucher Detail',
                              row,
                              layer:
                                getNextLayer(
                                  fieldPopup?.layer ??
                                    entryPopup?.layer ??
                                    billAllocationPopup?.layer ??
                                    MODAL_LAYER.entry,
                                ),
                            },
                          )
                        }
                        className="inline-flex h-8 items-center justify-center rounded-md border border-sky-200 bg-sky-50 px-3 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        View
                      </button>
                    </div>
                  </div>
                )
              },
            )
          ) : (
            <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
              No data available
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs text-[#17355f]">
          <span>
            {totalItems
              ? `${recordStart}-${recordEnd} of ${totalItems}`
              : '0-0 of 0'}
          </span>

          <div className="flex items-center gap-2">
            {pageItems.map(
              (
                pageNumber,
                index,
              ) =>
                pageNumber ===
                '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-9 w-5 items-center justify-center text-[#71819a]"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
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
                      pageNumber === page
                        ? 'h-9 w-9 rounded-md border border-[#059669] bg-[#059669] font-semibold text-white shadow-sm'
                        : 'h-9 w-9 rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878]'
                    }
                  >
                    {pageNumber}
                  </button>
                ),
            )}
          </div>
        </footer>
      </section>

      {/* ENTRY POPUP */}
      {entryPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/50 p-4"
          style={{ zIndex: entryPopup?.layer ?? MODAL_LAYER.entry }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {entryPopup.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    entryPopup
                      .entries.length
                  }{' '}
                  entries
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEntryPopup(
                    null,
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="overflow-auto p-4">
              {entryPopup.entries
                .length > 0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>
                    {entryFields.map(
                      (field) => (
                        <col
                          key={field}
                          style={{
                            width:
                              COLUMN_WIDTH,
                          }}
                        />
                      ),
                    )}
                  </colgroup>

                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      {entryFields.map(
                        (field) => (
                          <th
                            key={field}
                            style={{
                              width:
                                COLUMN_WIDTH,
                              minWidth:
                                COLUMN_WIDTH,
                              maxWidth:
                                COLUMN_WIDTH,
                            }}
                            className="border border-slate-200 px-3 py-2 text-left align-top text-[11px] font-semibold uppercase text-slate-600"
                          >
                            {formatLabel(
                              field,
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {entryPopup.entries.map(
                      (
                        entry,
                        index,
                      ) => (
                        <tr
                          key={
                            entry?._id ||
                            entry?.id ||
                            index
                          }
                          className="align-top even:bg-slate-50"
                        >
                          {entryFields.map(
                            (
                              field,
                            ) => (
                              <td
                                key={field}
                                style={{
                                  width:
                                    COLUMN_WIDTH,
                                  minWidth:
                                    COLUMN_WIDTH,
                                  maxWidth:
                                    COLUMN_WIDTH,
                                }}
                                className="align-top border border-slate-200 px-3 py-2"
                              >
                                {Array.isArray(
                                  entry?.[
                                    field
                                  ],
                                ) &&
                                entry[
                                  field
                                ].length >
                                  0 &&
                                isBillAllocationsField(
                                  field,
                                ) ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setBillAllocationPopup(
                                        {
                                          title:
                                            'Bill Allocations',
                                          entries:
                                            entry[
                                              field
                                            ],
                                          layer:
                                            getNextLayer(
                                              entryPopup?.layer ??
                                                MODAL_LAYER.entry,
                                            ),
                                        },
                                      )
                                    }
                                    className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                  >
                                    View{' '}
                                    {
                                      entry[
                                        field
                                      ].length
                                    }{' '}
                                    allocations
                                  </button>
                                ) : (
                                  <pre className="m-0 max-h-28 overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                                    {formatValue(
                                      entry?.[
                                        field
                                      ],
                                      field,
                                    )}
                                  </pre>
                                )}
                              </td>
                            ),
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                  No data
                </div>
              )}
            </div>

            {/* POPUP FOOTER CLOSE */}
            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setEntryPopup(
                    null,
                  )
                }
                className="rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BILL ALLOCATION POPUP */}
      {billAllocationPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/50 p-4"
          style={{ zIndex: billAllocationPopup?.layer ?? MODAL_LAYER.billAllocation }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {
                    billAllocationPopup.title
                  }
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    billAllocationPopup
                      .entries.length
                  }{' '}
                  allocations
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setBillAllocationPopup(
                    null,
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="overflow-auto p-4">
              {billAllocationPopup
                .entries.length >
              0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>
                    {billAllocationFields.map(
                      (field) => (
                        <col
                          key={field}
                          style={{
                            width:
                              COLUMN_WIDTH,
                          }}
                        />
                      ),
                    )}
                  </colgroup>

                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      {billAllocationFields.map(
                        (field) => (
                          <th
                            key={field}
                            style={{
                              width:
                                COLUMN_WIDTH,
                              minWidth:
                                COLUMN_WIDTH,
                              maxWidth:
                                COLUMN_WIDTH,
                            }}
                            className="border border-slate-200 px-3 py-2 text-left align-top text-[11px] font-semibold uppercase text-slate-600"
                          >
                            {formatLabel(
                              field,
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {billAllocationPopup.entries.map(
                      (
                        entry,
                        index,
                      ) => (
                        <tr
                          key={
                            entry?._id ||
                            entry?.id ||
                            index
                          }
                          className="align-top even:bg-slate-50"
                        >
                          {billAllocationFields.map(
                            (
                              field,
                            ) => (
                              <td
                                key={field}
                                style={{
                                  width:
                                    COLUMN_WIDTH,
                                  minWidth:
                                    COLUMN_WIDTH,
                                  maxWidth:
                                    COLUMN_WIDTH,
                                }}
                                className="align-top border border-slate-200 px-3 py-2"
                              >
                                <pre className="m-0 max-h-28 overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                                  {formatValue(
                                    entry?.[
                                      field
                                    ],
                                    field,
                                  )}
                                </pre>
                              </td>
                            ),
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                  No data
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setBillAllocationPopup(
                    null,
                  )
                }
                className="rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STRUCTURED FIELD POPUP */}
      {fieldPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/50 p-4"
          style={{ zIndex: fieldPopup?.layer ?? MODAL_LAYER.field }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {fieldPopup.title}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Structured data
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFieldPopup(
                    null,
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="overflow-auto p-4">
              {fieldPopupFields.length >
              0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>
                    {fieldPopupFields.map(
                      (field) => (
                        <col
                          key={field}
                          style={{
                            width:
                              COLUMN_WIDTH,
                          }}
                        />
                      ),
                    )}
                  </colgroup>

                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      {fieldPopupFields.map(
                        (field) => (
                          <th
                            key={field}
                            style={{
                              width:
                                COLUMN_WIDTH,
                              minWidth:
                                COLUMN_WIDTH,
                              maxWidth:
                                COLUMN_WIDTH,
                            }}
                            className="border border-slate-200 px-3 py-2 text-left text-[11px] font-semibold uppercase text-slate-600"
                          >
                            {formatLabel(
                              field,
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {fieldEntries.map(
                      (
                        entry,
                        index,
                      ) => (
                        <tr
                          key={
                            entry?._id ||
                            entry?.id ||
                            index
                          }
                          className="align-top even:bg-slate-50"
                        >
                          {fieldPopupFields.map(
                            (
                              field,
                            ) => (
                              <td
                                key={field}
                                style={{
                                  width:
                                    COLUMN_WIDTH,
                                  minWidth:
                                    COLUMN_WIDTH,
                                  maxWidth:
                                    COLUMN_WIDTH,
                                }}
                                className="align-top border border-slate-200 px-3 py-2"
                              >
                                <pre className="m-0 max-h-28 overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                                  {formatValue(
                                    entry?.[
                                      field
                                    ],
                                    field,
                                  )}
                                </pre>
                              </td>
                            ),
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                  No data
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setFieldPopup(
                    null,
                  )
                }
                className="rounded-md bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEW DETAILS POPUP */}
      {detailPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-slate-950/50 p-4"
          style={{ zIndex: detailPopup?.layer ?? MODAL_LAYER.detail }}
          role="dialog"
          aria-modal="true"
          aria-label="Voucher Detail"
        >
          <div className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* POPUP HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Voucher Detail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Complete voucher line
                  details
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setDetailPopup(
                    null,
                  )
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close voucher detail"
              >
                ×
              </button>
            </div>

            {/* DETAIL TABLE */}
            <div className="overflow-auto p-4">
              {detailFields.length >
              0 ? (
                <table className="min-w-max table-fixed border-collapse text-left text-xs">
                  <colgroup>
                    {detailFields.map(
                      (field) => (
                        <col
                          key={field}
                          style={{
                            width:
                              COLUMN_WIDTH,
                          }}
                        />
                      ),
                    )}
                  </colgroup>

                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr>
                      {detailFields.map(
                        (field) => (
                          <th
                            key={field}
                            style={{
                              width:
                                COLUMN_WIDTH,
                              minWidth:
                                COLUMN_WIDTH,
                              maxWidth:
                                COLUMN_WIDTH,
                            }}
                            className="border border-slate-200 px-3 py-2 text-left align-top text-[11px] font-semibold uppercase text-slate-600"
                          >
                            {formatLabel(
                              field,
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="align-top">
                      {detailFields.map(
                        (field) => {
                          const value =
                            detailPopup
                              .row?.[
                              field
                            ]

                          const structured =
                            isStructuredValue(
                              value,
                            )

                          return (
                            <td
                              key={field}
                              style={{
                                width:
                                  COLUMN_WIDTH,
                                minWidth:
                                  COLUMN_WIDTH,
                                maxWidth:
                                  COLUMN_WIDTH,
                              }}
                              className="align-top border border-slate-200 px-3 py-2"
                            >
                              {structured ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldPopup(
                                      {
                                        title:
                                          formatLabel(
                                            field,
                                          ),
                                        value:
                                          normalizeStructuredValue(
                                            value,
                                          ),
                                      },
                                    )
                                  }
                                  className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                >
                                  View
                                </button>
                              ) : (
                                <pre className="m-0 max-h-32 w-full overflow-y-auto whitespace-pre-wrap break-words font-sans text-[12px] leading-5">
                                  {formatValue(
                                    value,
                                    field,
                                  )}
                                </pre>
                              )}
                            </td>
                          )
                        },
                      )}
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                  No data available
                </div>
              )}
            </div>

            {/* CLOSE BUTTON */}
            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setDetailPopup(
                    null,
                  )
                }
                className="rounded-md bg-slate-800 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
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

export default VoucherLinesPage