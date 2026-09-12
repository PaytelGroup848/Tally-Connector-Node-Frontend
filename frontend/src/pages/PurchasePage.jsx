import { useEffect, useMemo, useState } from 'react'
import { Download, Filter, MoreHorizontal, Plus, Search, SlidersHorizontal } from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  extractPurchasePagination,
  extractPurchases,
  fetchCompanyPurchases,
} from '../services/companiesApi'

const formatCurrency = (value) => {
  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) return '₹ 0'

  return `₹ ${numericValue.toLocaleString('en-IN')}`
}

const formatDate = (value) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getPurchaseValue = (purchase, keys) => {
  for (const key of keys) {
    const value = purchase?.[key]

    if (
      value !== null &&
      value !== undefined &&
      String(value).trim()
    ) {
      return String(value).trim()
    }
  }

  return '-'
}

const getAmount = (purchase) =>
  Number(
    purchase?.amount ??
      purchase?.total ??
      purchase?.grandTotal ??
      purchase?.totalAmount ??
      0,
  ) || 0

function PurchasePage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)

  const [purchases, setPurchases] = useState([])
  const [pagination, setPagination] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (!accessToken || !companyId) {
      setPurchases([])
      setPagination({})
      setErrorMessage(
        accessToken
          ? 'No company selected.'
          : 'Session expired. Please sign in.',
      )
      return undefined
    }

    let isMounted = true

    setIsLoading(true)
    setErrorMessage('')

    fetchCompanyPurchases(accessToken, companyId, {
      q: '',
      from: '2010-04-01',
      to: '2027-03-31',
      page: 1,
      limit: 20,
    })
      .then((response) => {
        if (!isMounted) return

        setPurchases(extractPurchases(response))
        setPagination(extractPurchasePagination(response))
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error?.message || 'Unable to load purchases',
          )
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId])

  const filteredPurchases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = purchases.filter((purchase) => {
      if (!normalizedQuery) return true

      const searchableText = [
        purchase?.voucherNumber,
        purchase?.voucherNo,
        purchase?.voucher_no,
        purchase?.partyLedger,
        purchase?.partyName,
        purchase?.party_name,
        purchase?.narration,
        purchase?.voucherType,
        purchase?.voucher_type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })

    return [...filtered].sort((a, b) => {
      const dateA = new Date(
        a?.date || a?.voucherDate || a?.createdAt || 0,
      ).getTime()

      const dateB = new Date(
        b?.date || b?.voucherDate || b?.createdAt || 0,
      ).getTime()

      return sortOrder === 'oldest'
        ? dateA - dateB
        : dateB - dateA
    })
  }, [purchases, query, sortOrder])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPurchases.length / pageSize),
  )

  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedPurchases = filteredPurchases.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  const stats = useMemo(() => {
    const totalAmount = filteredPurchases.reduce(
      (sum, purchase) => sum + getAmount(purchase),
      0,
    )

    const parties = new Set(
      filteredPurchases
        .map((purchase) =>
          getPurchaseValue(purchase, [
            'partyLedger',
            'partyName',
            'party_name',
            'supplierName',
            'supplier_name',
            'party',
          ]),
        )
        .filter((value) => value !== '-'),
    )

    const average =
      filteredPurchases.length > 0
        ? totalAmount / filteredPurchases.length
        : 0

    return {
      totalVouchers: filteredPurchases.length,
      totalAmount,
      totalParties: parties.size,
      average,
    }
  }, [filteredPurchases])

  const handleExport = () => {
    const header = [
      'Voucher No',
      'Date',
      'Party Ledger',
      'Voucher Type',
      'Narration',
      'Amount',
    ]

    const rows = filteredPurchases.map((purchase) => [
      getPurchaseValue(purchase, [
        'voucherNumber',
        'voucherNo',
        'voucher_no',
        'invoiceNo',
        'invoice_no',
        'number',
      ]),
      formatDate(
        purchase?.date ||
          purchase?.voucherDate ||
          purchase?.createdAt,
      ),
      getPurchaseValue(purchase, [
        'partyLedger',
        'partyName',
        'party_name',
        'supplierName',
        'supplier_name',
        'party',
      ]),
      getPurchaseValue(purchase, [
        'voucherType',
        'voucher_type',
        'type',
      ]),
      getPurchaseValue(purchase, [
        'narration',
        'description',
        'notes',
      ]),
      getAmount(purchase),
    ])

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'purchase-vouchers.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  const openNewPurchase = () => {
    window.history.pushState(
      {},
      '',
      '/create-voucher/PurchaseInvoice',
    )
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-app-bg p-4 sm:p-5 lg:p-6">
      <div className="mx-auto max-w-[1500px]">
        {/* PAGE HEADER */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Purchase</span>
              <span className="text-slate-300">›</span>
              <span className="font-medium text-app-text-secondary">
                Purchase
              </span>
            </div>

            <h1 className="cloud-page-title">
              Purchase
            </h1>
          </div>

          <button
            type="button"
            className="
              inline-flex h-10 items-center gap-2
              rounded-lg border border-app-border
              bg-white px-3 text-[11px]
              font-semibold text-app-text-secondary
              shadow-sm transition
              hover:bg-slate-50 hover:text-app-text
            "
          >
            <span className="text-base">▣</span>
            01 Apr 2025 – 10 Apr 2025
            <span className="text-slate-400">⌄</span>
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="cloud-card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <label
            className="
              flex h-10 w-full items-center gap-2
              rounded-lg border border-app-border
              bg-white px-3 text-slate-400
              transition
              focus-within:border-app-primary
              focus-within:ring-2 focus-within:ring-emerald-100
              sm:max-w-[390px]
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              value={query}
              onChange={(event) => {
                setCurrentPage(1)
                setQuery(event.target.value)
              }}
              placeholder="Search by voucher no, party name, ledger, etc..."
              className="
                w-full bg-transparent
                text-[12px] text-app-text
                outline-none placeholder:text-slate-400
              "
            />
          </label>

          <label className="flex items-center gap-2 text-[11px] font-medium text-app-text-secondary">
            <span>Show</span>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setCurrentPage(1)
              }}
              className="
                h-10 rounded-lg border border-app-border
                bg-white px-3 text-[12px]
                font-medium text-app-text
                outline-none
                focus:border-app-primary
                focus:ring-2 focus:ring-emerald-100
              "
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

          <label className="ml-auto flex items-center gap-2 text-[11px] font-medium text-app-text-secondary">
            <span>Sort by</span>

            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="
                h-10 rounded-lg border border-app-border
                bg-white px-3 text-[12px]
                font-medium text-app-text
                outline-none
                focus:border-app-primary
                focus:ring-2 focus:ring-emerald-100
              "
            >
              <option value="newest">Date (Newest First)</option>
              <option value="oldest">Date (Oldest First)</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className="
              inline-flex h-10 items-center justify-center gap-2
              rounded-lg border border-app-border
              bg-white px-3 text-[11px]
              font-semibold text-app-text-secondary
              transition hover:bg-slate-50
            "
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="cloud-card mb-4 flex flex-wrap items-center gap-3 p-4">
            <div className="flex items-center gap-2 text-[11px] text-app-text-secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Showing filtered purchase results
            </div>

            <div className="ml-auto text-[11px] font-semibold text-app-text">
              {filteredPurchases.length} matching records
            </div>
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="cloud-metric-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-app-primary">
                ▤
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-app-text-secondary">
                  Total Vouchers
                </p>

                <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
                  {stats.totalVouchers}
                </p>

                <div className="mt-2 text-[11px] font-semibold text-app-success">
                  ↑ 20%
                  <span className="ml-2 font-normal text-slate-400">
                    vs. last period
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cloud-metric-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                ₹
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-app-text-secondary">
                  Total Purchase Amount
                </p>

                <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
                  {formatCurrency(stats.totalAmount)}
                </p>

                <div className="mt-2 text-[11px] font-semibold text-app-success">
                  ↑ 12.5%
                  <span className="ml-2 font-normal text-slate-400">
                    vs. last period
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cloud-metric-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
                ◎
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-app-text-secondary">
                  Total Parties
                </p>

                <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
                  {stats.totalParties}
                </p>

                <div className="mt-2 text-[11px] font-semibold text-app-success">
                  ↑ 14.3%
                  <span className="ml-2 font-normal text-slate-400">
                    vs. last period
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cloud-metric-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                ▣
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-app-text-secondary">
                  Average Voucher Value
                </p>

                <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
                  {formatCurrency(stats.average)}
                </p>

                <div className="mt-2 text-[11px] font-semibold text-app-success">
                  ↑ 8.7%
                  <span className="ml-2 font-normal text-slate-400">
                    vs. last period
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PURCHASE TABLE */}
        <section className="cloud-card mt-4 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-app-text">
                Purchase Vouchers ({stats.totalVouchers})
              </h2>

              <p className="mt-1 text-[11px] text-app-text-secondary">
                Showing {filteredPurchases.length} matching records
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openNewPurchase}
                className="cloud-primary-btn"
              >
                <Plus className="h-4 w-4" />
                New Purchase
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="cloud-secondary-btn"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mx-4 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="overflow-x-auto px-3 pb-1">
            {isLoading ? (
              <div className="flex min-h-[220px] items-center justify-center border-y border-app-border-light text-sm text-slate-500">
                Loading purchases...
              </div>
            ) : (
              <table className="cloud-table min-w-[1120px]">
                <thead>
                  <tr>
                    <th className="w-12">#</th>
                    <th>Voucher No.</th>
                    <th>Date</th>
                    <th>Party Ledger</th>
                    <th>Party Type</th>
                    <th>Voucher Type</th>
                    <th>Narration</th>
                    <th className="text-right">Amount (₹)</th>
                    <th className="w-14 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedPurchases.length > 0 ? (
                    paginatedPurchases.map((purchase, index) => {
                      const voucherNumber = getPurchaseValue(purchase, [
                        'voucherNumber',
                        'voucherNo',
                        'voucher_no',
                        'invoiceNo',
                        'invoice_no',
                        'number',
                      ])

                      const partyLedger = getPurchaseValue(purchase, [
                        'partyLedger',
                        'partyName',
                        'party_name',
                        'supplierName',
                        'supplier_name',
                        'party',
                        'ledgerName',
                        'name',
                      ])

                      const partyType = getPurchaseValue(purchase, [
                        'partyType',
                        'party_type',
                      ])

                      const voucherType = getPurchaseValue(purchase, [
                        'voucherType',
                        'voucher_type',
                        'type',
                      ])

                      const narration = getPurchaseValue(purchase, [
                        'narration',
                        'description',
                        'notes',
                      ])

                      const amount = getAmount(purchase)

                      return (
                        <tr
                          key={
                            purchase?._id ||
                            purchase?.id ||
                            `${voucherNumber}-${index}`
                          }
                        >
                          <td className="font-medium text-slate-400">
                            {(safeCurrentPage - 1) * pageSize + index + 1}
                          </td>

                          <td className="font-semibold text-app-text">
                            {voucherNumber}
                          </td>

                          <td className="whitespace-nowrap">
                            {formatDate(
                              purchase?.date ||
                                purchase?.voucherDate ||
                                purchase?.createdAt,
                            )}
                          </td>

                          <td className="max-w-[220px] [overflow-wrap:anywhere]">
                            {partyLedger}
                          </td>

                          <td>
                            {partyType === '-' ? 'Supplier' : partyType}
                          </td>

                          <td>
                            {voucherType}
                          </td>

                          <td className="max-w-[250px] [overflow-wrap:anywhere]">
                            {narration}
                          </td>

                          <td className="text-right font-semibold text-app-text">
                            {formatCurrency(amount)}
                          </td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="
                                grid h-8 w-8 place-items-center
                                rounded-lg text-slate-400
                                transition hover:bg-slate-50
                                hover:text-app-text
                              "
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="h-[220px] text-center text-sm text-slate-500"
                      >
                        No purchase data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-app-border-light px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-app-text-secondary">
              Showing{' '}
              {filteredPurchases.length === 0
                ? 0
                : (safeCurrentPage - 1) * pageSize + 1}{' '}
              to{' '}
              {Math.min(
                safeCurrentPage * pageSize,
                filteredPurchases.length,
              )}{' '}
              of {filteredPurchases.length} records
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safeCurrentPage <= 1 || isLoading}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="
                  grid h-9 w-9 place-items-center
                  rounded-lg border border-app-border
                  bg-white text-slate-500
                  transition hover:bg-slate-50
                  disabled:opacity-40
                "
                aria-label="Previous page"
              >
                ‹
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1,
              )
                .slice(0, 7)
                .map((page) => (
                  <button
                    key={page}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      grid h-9 min-w-9 place-items-center
                      rounded-lg border px-2
                      text-[12px] font-semibold transition
                      ${
                        safeCurrentPage === page
                          ? 'border-app-primary bg-app-primary text-white'
                          : 'border-app-border bg-white text-app-text-secondary hover:bg-slate-50'
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

              <button
                type="button"
                disabled={safeCurrentPage >= totalPages || isLoading}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1),
                  )
                }
                className="
                  grid h-9 w-9 place-items-center
                  rounded-lg border border-app-border
                  bg-white text-slate-500
                  transition hover:bg-slate-50
                  disabled:opacity-40
                "
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* Keep this so current API pagination can still be inspected in dev tools */}
        <span className="sr-only">
          API total: {pagination?.total ?? filteredPurchases.length}
        </span>
      </div>
    </div>
  )
}

export default PurchasePage
