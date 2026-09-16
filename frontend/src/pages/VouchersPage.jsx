import { useEffect, useMemo, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react'

import useAuthStore from '../store/authStore'
import {
    extractVouchers,
    extractVoucherTypes,
    fetchCompanyVouchers,
    fetchCompanyVoucherTypes,
} from '../services/companiesApi'

function formatValue(value) {
    if (value === null || value === undefined || value === '') {
        return 'NA'
    }

    if (typeof value === 'number') {
        return value.toLocaleString('en-IN')
    }

    return String(value)
}

function formatIstDate(value) {
    if (value === null || value === undefined || value === '') {
        return 'NA'
    }

    const rawValue = String(value).trim()
    const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
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

function formatCellValue(value, column = '') {
    if (value === null || value === undefined || value === '') {
        return 'NA'
    }

    const normalizedColumn = normalizeColumnKey(column)

    if (
        normalizedColumn.includes('date') ||
        normalizedColumn.includes('time') ||
        normalizedColumn.endsWith('at')
    ) {
        return formatIstDate(value)
    }

    return formatValue(value)
}

function isStructuredValue(value) {
    return value !== null && typeof value === 'object'
}

function isViewableField(key, value) {
    const normalizedKey = normalizeColumnKey(key)

    return (
        isStructuredValue(value) ||
        normalizedKey.includes('error') ||
        normalizedKey.includes('message')
    )
}

function getDetailEntries(value) {
    if (Array.isArray(value)) {
        return value.map((item, index) => [String(index + 1), item])
    }

    if (value && typeof value === 'object') {
        return Object.entries(value)
    }

    return []
}

function formatColumnLabel(key) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/^./, (character) => character.toUpperCase())
}

function normalizeColumnKey(key) {
    return String(key).trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isIdentifierColumn(key) {
    const normalizedKey = normalizeColumnKey(key)

    return (
        normalizedKey === 'id' ||
        normalizedKey.endsWith('id') ||
        normalizedKey.endsWith('guid')
    )
}

function isHiddenColumn(key) {
    const normalizedKey = normalizeColumnKey(key)

    return (
        isIdentifierColumn(key) ||
        normalizedKey === 'vouchernumber' ||
        normalizedKey === 'raw' ||
        normalizedKey === 'source'
    )
}

function getVoucherTypeValue(value) {
    if (typeof value === 'string') return value

    if (value && typeof value === 'object') {
        return String(
            value.voucherType ||
                value.voucher_type ||
                value.name ||
                value.type ||
                '',
        )
    }

    return ''
}

function VouchersPage({ companyId }) {
    const accessToken = useAuthStore((state) => state.accessToken)

    const [vouchers, setVouchers] = useState([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const [fromDate, setFromDate] = useState('2010-09-01')
    const [toDate, setToDate] = useState('2026-09-03')

    const [voucherType, setVoucherType] = useState('')
    const [voucherTypes, setVoucherTypes] = useState([])

    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [detailStack, setDetailStack] = useState([])

    const openDetail = (title, value) => {
        setDetailStack((currentStack) => [
            ...currentStack,
            { title, value },
        ])
    }

    const closeDetail = () => {
        setDetailStack((currentStack) =>
            currentStack.slice(0, -1),
        )
    }

    const closeAllDetails = () => setDetailStack([])

    // ---------------------------------------------------------
    // RESET PAGE WHEN FILTERS CHANGE
    // ---------------------------------------------------------

    useEffect(() => {
        setPage(1)
    }, [companyId, fromDate, toDate, pageSize, voucherType])

    useEffect(() => {
        if (!accessToken || !companyId) {
            setVoucherTypes([])
            return undefined
        }

        let isMounted = true

        fetchCompanyVoucherTypes(accessToken, companyId)
            .then((response) => {
                if (!isMounted) return

                const nextTypes = extractVoucherTypes(response)
                    .map(getVoucherTypeValue)
                    .filter(Boolean)

                setVoucherTypes([...new Set(nextTypes)])
            })
            .catch(() => {
                if (isMounted) setVoucherTypes([])
            })

        return () => {
            isMounted = false
        }
    }, [accessToken, companyId])

    // ---------------------------------------------------------
    // LOAD VOUCHERS
    // ---------------------------------------------------------

    useEffect(() => {
        if (!accessToken) {
            setVouchers([])
            setTotalItems(0)
            setTotalPages(1)
            setErrorMessage('Session expired. Please sign in.')
            return undefined
        }

        if (!companyId) {
            setVouchers([])
            setTotalItems(0)
            setTotalPages(1)
            setErrorMessage('No company selected.')
            return undefined
        }

        if (fromDate && toDate && fromDate > toDate) {
            setVouchers([])
            setTotalItems(0)
            setTotalPages(1)
            setErrorMessage('From date cannot be greater than To date.')
            return undefined
        }

        let isMounted = true

        const loadVouchers = async () => {
            try {
                setIsLoading(true)
                setErrorMessage('')

                const response = await fetchCompanyVouchers(
                    accessToken,
                    companyId,
                    {
                        page,
                        limit: pageSize,
                        from: fromDate,
                        to: toDate,
                        voucherType,
                    },
                )

                if (!isMounted) return

                const nextVouchers = extractVouchers(response)

                const totalCandidates = [
                    response?.total,
                    response?.count,
                    response?.totalItems,
                    response?.pagination?.total,
                    response?.pagination?.totalItems,
                    response?.data?.total,
                    response?.data?.count,
                ]

                const parsedTotal = totalCandidates.find(
                    (value) =>
                        value !== undefined &&
                        value !== null &&
                        Number.isFinite(Number(value)),
                )

                const safeTotal =
                    parsedTotal !== undefined
                        ? Number(parsedTotal)
                        : nextVouchers.length

                const apiLimit = Number(
                    response?.pagination?.limit ??
                        response?.limit ??
                        response?.data?.limit ??
                        pageSize,
                )

                const safeLimit =
                    Number.isFinite(apiLimit) && apiLimit > 0
                        ? apiLimit
                        : pageSize

                const calculatedTotalPages = Math.max(
                    1,
                    Math.ceil(safeTotal / safeLimit),
                )

                const apiTotalPages = Number(
                    response?.pagination?.totalPages ??
                        response?.totalPages ??
                        response?.data?.totalPages ??
                        calculatedTotalPages,
                )

                const safeTotalPages =
                    Number.isFinite(apiTotalPages) && apiTotalPages > 0
                        ? apiTotalPages
                        : calculatedTotalPages

                setVouchers(nextVouchers)
                setTotalItems(safeTotal)
                setTotalPages(safeTotalPages)
            } catch (error) {
                if (!isMounted) return

                setVouchers([])
                setTotalItems(0)
                setTotalPages(1)

                setErrorMessage(
                    error?.message || 'Unable to load vouchers',
                )
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }

        loadVouchers()

        return () => {
            isMounted = false
        }
    }, [
        accessToken,
        companyId,
        page,
        pageSize,
        fromDate,
        toDate,
        voucherType,
    ])

    // ---------------------------------------------------------
    // PAGINATION
    // ---------------------------------------------------------

    const pageItems = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1,
            )
        }

        if (page <= 4) {
            return [1, 2, 3, 4, 5, '...', totalPages]
        }

        if (page >= totalPages - 3) {
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

    // ---------------------------------------------------------
    // TABLE COLUMNS
    // ---------------------------------------------------------

    const responseColumns = useMemo(() => {
        const preferredColumns = [
            'voucherNumber',
            'voucher_number',
            'voucherType',
            'voucher_type',
            'partyLedger',
            'party_ledger',
            'amount',
            'date',
        ]

        const columns = []
        const seenColumnKeys = new Set()

        vouchers.forEach((voucher) => {
            Object.keys(voucher || {}).forEach((key) => {
                const normalizedKey = normalizeColumnKey(key)

                if (
                    !isHiddenColumn(key) &&
                    normalizedKey &&
                    !seenColumnKeys.has(normalizedKey)
                ) {
                    seenColumnKeys.add(normalizedKey)
                    columns.push(key)
                }
            })
        })
        return [
            ...preferredColumns.filter(
                (key) => columns.includes(key),
            ),
            ...columns.filter(
                (key) => !preferredColumns.includes(key),
            ),
        ]
    }, [vouchers])

    /*
     * Keep exactly the same grid definition for header and rows.
     * This prevents column shifting.
     */
    const tableGridColumns = useMemo(() => {
        const dataColumnCount = Math.max(responseColumns.length, 1)

        return `repeat(${dataColumnCount}, 220px)`
    }, [responseColumns.length])

    const recordStart =
        totalItems > 0 ? (page - 1) * pageSize + 1 : 0

    const recordEnd =
        totalItems > 0
            ? Math.min(page * pageSize, totalItems)
            : 0

    return (
        <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
            {/* =====================================================
                MAIN
            ===================================================== */}

            <div className="px-3 py-3 sm:px-5 sm:py-4">
                <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">

                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <div className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#e5ebf2] px-4 py-3 sm:px-8">
                        <div className="flex w-full flex-wrap items-center gap-3">

                            {/* VOUCHER TYPE */}

                            <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px] text-[#17355f]">
                                <span>Voucher type</span>

                                <select
                                    value={voucherType}
                                    onChange={(event) =>
                                        setVoucherType(event.target.value)
                                    }
                                    className="h-[38px] min-w-[180px] cursor-pointer rounded-lg border border-[#10b981] bg-white px-3 text-[12px] text-slate-700 outline-none transition focus:border-[#17355f] focus:ring-1 focus:ring-[#17355f]/20"
                                >
                                    <option value="">Select voucher type</option>
                                    {voucherTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* SHOW RECORDS */}

                            <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px] text-[#17355f]">
                                <span>Show</span>

                                <select
                                    value={pageSize}
                                    onChange={(event) =>
                                        setPageSize(
                                            Number(event.target.value),
                                        )
                                    }
                                    className="
                                        h-[38px]
                                        w-[64px]
                                        cursor-pointer
                                        rounded-lg
                                        border
                                        border-[#10b981]
                                        bg-white
                                        px-2
                                        text-[12px]
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                                >
                                    {[10, 20, 30, 50].map((size) => (
                                        <option
                                            key={size}
                                            value={size}
                                        >
                                            {size}
                                        </option>
                                    ))}
                                </select>

                                <span>records</span>
                            </label>

                            {/* FLEX SPACER */}

                            <div className="hidden min-w-0 flex-1 lg:block" />

                            <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">

                            {/* FROM */}

                            <div className="flex h-[36px] items-center gap-2 whitespace-nowrap">
                                <span className="text-[12px] text-[#17355f]">
                                    From
                                </span>

                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(event) =>
                                        setFromDate(event.target.value)
                                    }
                                    className="
                                        h-[30px]
                                        rounded-md
                                        border
                                        border-slate-300
                                        bg-white
                                        px-2
                                        text-[11px]
                                        text-slate-700
                                        outline-none
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                                />
                            </div>

                            {/* TO */}

                            <div className="flex h-[36px] items-center gap-2 whitespace-nowrap">
                                <span className="text-[12px] text-[#17355f]">
                                    To
                                </span>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(event) =>
                                        setToDate(event.target.value)
                                    }
                                    className="
                                        h-[30px]
                                        rounded-md
                                        border
                                        border-slate-300
                                        bg-white
                                        px-2
                                        text-[11px]
                                        text-slate-700
                                        outline-none
                                        focus:border-[#17355f]
                                        focus:ring-1
                                        focus:ring-[#17355f]/20
                                    "
                                />
                            </div>

                            {/* PAGE INFO */}

                            <div className="whitespace-nowrap text-[12px] text-[#17355f]">
                                Page {page} · {pageSize} per page
                            </div>

                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {errorMessage && (
                        <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    {/* =================================================
                        TABLE
                    ================================================= */}

                    <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
                        <div className="min-w-max">

                            {/* HEADER */}

                            <div
                                className="grid min-w-max items-center border-b border-[#dfe7f0] bg-[#f4f7fb] px-4 py-3 text-[11px] font-semibold uppercase text-[#274b78]"
                                style={{
                                    gridTemplateColumns:
                                        tableGridColumns,
                                    minHeight: '48px',
                                }}
                            >
                                {responseColumns.map((column) => (
                                    <div
                                        key={column}
                                        className="box-border flex h-full w-[220px] min-w-[220px] max-w-[220px] items-center overflow-hidden border-l border-[#dfe7f0] pr-4"
                                    >
                                        <span className="block whitespace-normal break-words">
                                            {formatColumnLabel(column)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* LOADING */}

                            {isLoading ? (
                                <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                                        Loading vouchers...
                                    </div>
                                </div>
                            ) : vouchers.length > 0 ? (
                                <div>
                                    {vouchers.map(
                                        (voucher, index) => (
                                            <div
                                                key={
                                                    voucher?._id ||
                                                    voucher?.id ||
                                                    index
                                                }
                                                className="grid min-w-max items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] text-[#17355f] last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                                                style={{
                                                    gridTemplateColumns:
                                                        tableGridColumns,
                                                    minHeight: '50px',
                                                }}
                                            >
                                                {/* CELLS */}

                                                {responseColumns.map(
                                                    (column) => {
                                                        const cellValue =
                                                            formatCellValue(
                                                                voucher?.[
                                                                    column
                                                                ],
                                                                    column,
                                                            )

                                                        return (
                                                            <div
                                                                key={
                                                                    column
                                                                }
                                                                className="box-border w-[220px] min-w-[220px] max-w-[220px] overflow-hidden border-l border-[#e5ebf2] pr-4"
                                                                title={
                                                                    isViewableField(
                                                                        column,
                                                                        voucher?.[
                                                                            column
                                                                        ],
                                                                    )
                                                                        ? 'View details'
                                                                        : cellValue
                                                                }
                                                            >
                                                                {isViewableField(
                                                                    column,
                                                                    voucher?.[
                                                                        column
                                                                    ],
                                                                ) ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            openDetail(
                                                                                formatColumnLabel(
                                                                                    column,
                                                                                ),
                                                                                voucher?.[
                                                                                    column
                                                                                ],
                                                                            )
                                                                        }
                                                                        className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                                                                    >
                                                                        View
                                                                    </button>
                                                                ) : (
                                                                    <div className="max-w-full whitespace-pre-wrap break-words leading-5">
                                                                        {cellValue}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    },
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="flex min-h-[120px] min-w-[1120px] items-center justify-center border-b border-[#e5ebf2] px-4 py-3 text-center text-xs text-slate-500">
                                    <div className="text-sm text-slate-400">
                                        No data available
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div
                        className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs text-[#17355f]"
                    >
                        {/* RECORD COUNT */}

                        <div
                            className="text-center"
                        >
                            {totalItems > 0
                                ? `${recordStart}-${recordEnd} of ${totalItems}`
                                : '0-0 of 0'}
                        </div>

                        {/* PAGINATION */}

                        <div className="flex items-center gap-2">
                            {/* PREVIOUS */}

                            <button
                                type="button"
                                disabled={isLoading || page <= 1}
                                onClick={() =>
                                    setPage((currentPage) =>
                                        Math.max(
                                            1,
                                            currentPage - 1,
                                        ),
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                            </button>

                            {/* PAGE NUMBERS */}

                            {pageItems.map((pageNumber, index) =>
                                pageNumber === '...' ? (
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
                                        disabled={isLoading}
                                        onClick={() =>
                                            setPage(pageNumber)
                                        }
                                        className={
                                            pageNumber === page
                                                ? 'h-9 w-9 rounded-md border border-[#059669] bg-[#059669] font-semibold text-white shadow-sm'
                                                : 'h-9 w-9 rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-50'
                                        }
                                    >
                                        {pageNumber}
                                    </button>
                                ),
                            )}

                            {/* NEXT */}

                            <button
                                type="button"
                                disabled={
                                    isLoading ||
                                    page >= totalPages
                                }
                                onClick={() =>
                                    setPage((currentPage) =>
                                        Math.min(
                                            totalPages,
                                            currentPage + 1,
                                        ),
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {detailStack.map((detail, index) => {
                const entries = getDetailEntries(detail.value)

                return (
                    <div
                        key={`${detail.title}-${index}`}
                        className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/50 p-4"
                        style={{ zIndex: 1000 + index * 100 }}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">
                                        {detail.title}
                                    </h2>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {entries.length} fields
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeDetail}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                    aria-label="Close details"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="overflow-auto p-4">
                                {entries.length > 0 ? (
                                    <div className="overflow-hidden rounded-lg border border-[#dfe7f0]">
                                        {entries.map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="grid grid-cols-[minmax(160px,220px)_1fr] items-start border-b border-[#e5ebf2] px-4 py-3 text-[12px] last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                                            >
                                                <div className="pr-4 font-semibold text-[#274b78]">
                                                    {Array.isArray(detail.value)
                                                        ? `Item ${key}`
                                                        : formatColumnLabel(key)}
                                                </div>

                                                <div className="min-w-0 text-[#17355f]">
                                                    {isStructuredValue(value) ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDetail(
                                                                    Array.isArray(detail.value)
                                                                        ? `Item ${key}`
                                                                        : formatColumnLabel(key),
                                                                    value,
                                                                )
                                                            }
                                                            className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold leading-tight text-sky-700 transition hover:bg-sky-100"
                                                        >
                                                            View
                                                        </button>
                                                    ) : (
                                                        <span className="whitespace-pre-wrap break-words leading-5">
                                                            {formatCellValue(value)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap break-words rounded-lg border border-dashed border-slate-200 px-4 py-4 text-sm text-[#17355f]">
                                        {formatCellValue(detail.value)}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
                                <button
                                    type="button"
                                    onClick={
                                        index === 0
                                            ? closeAllDetails
                                            : closeDetail
                                    }
                                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VouchersPage