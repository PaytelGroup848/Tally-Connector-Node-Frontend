import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractPurchasePagination,
  extractPurchases,
  fetchCompanyPurchases,
} from '../services/companiesApi'

// ============================================================
// FIELD DATA
// ============================================================

const supplierFields = [
  ['Supplier’s Name', 'Supplier’s Name'],
  ['Supplier’s Country', 'Supplier’s Country'],
  ['Supplier’s State', 'Supplier’s State'],
  ['Registration Type', 'Registration Type'],
  ['Postal Code', 'Postal Code'],
  ['GSTIN/UIN', 'GSTIN/UIN'],
  ['Place of Supply', 'Place of Supply'],
]

const consigneeFields = [
  ['Consignee Name', 'Consignee Name'],
  ['GSTIN/UIN', 'GSTIN/UIN'],
  ['Consignee Country', 'Country'],
  ['Consignee State', 'State'],
  ['Postal Code', 'Postal Code'],
]

const dispatchFields = [
  ['Dispatch From', 'Dispatch From'],
  ['Dispatch Through', 'Dispatch Through'],
  ['Vehicle Number', 'Vehicle Number'],
  ['Transporter Name', 'Transporter Name'],
  ['Transporter ID', 'Transporter ID'],
  ['Dispatch Date', 'Dispatch Date'],
]

const orderFields = [
  ['Order No', 'Order No'],
  ['Order Date', 'Order Date'],
  ['Reference No', 'Reference No'],
  ['Buyer Order No', 'Buyer Order No'],
  ['Terms of Delivery', 'Terms of Delivery'],
  ['Other Reference', 'Other Reference'],
]

const tabs = {
  'Supplier’s Details': supplierFields,
  'Consignee Details': consigneeFields,
  'Dispatch Details': dispatchFields,
  'Order Details': orderFields,
}

// ============================================================
// REUSABLE INPUT
// ============================================================

function InputField({ label, placeholder, search = false }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

        {search && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
        )}
      </div>
    </label>
  )
}

// ============================================================
// ITEMS TABLE
// ============================================================

function ItemsTable() {
  const [rows, setRows] = useState([1])

  const addRow = () => {
    setRows([...rows, rows.length + 1])
  }

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white">

      <div className="min-w-[1100px]">

        {/* HEADER */}
        <div className="grid grid-cols-[220px_70px_90px_80px_80px_110px_120px_200px_100px_70px_45px] gap-2 bg-slate-100 p-2 text-xs font-semibold text-slate-600">

          <div>Items</div>
          <div>Qty</div>
          <div>Rate</div>
          <div>Units</div>
          <div>Disc %</div>
          <div>HSN Code</div>
          <div>Godown</div>
          <div>Description</div>
          <div>Amount</div>
          <div>Tax</div>

          <button
            onClick={addRow}
            className="rounded bg-green-100 text-green-700"
          >
            +
          </button>

        </div>

        {/* ROWS */}
        {rows.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[220px_70px_90px_80px_80px_110px_120px_200px_100px_70px_45px] gap-2 border-t p-2"
          >

            <input
              placeholder="Search Item"
              className="input"
            />

            <input
              value="0"
              readOnly
              className="input"
            />

            <input
              value="0"
              readOnly
              className="input"
            />

            <select className="input">
              <option>-</option>
              <option>PCS</option>
              <option>KG</option>
              <option>BOX</option>
            </select>

            <input
              value="0"
              readOnly
              className="input"
            />

            <input
              placeholder="Search HSN"
              className="input"
            />

            <input
              placeholder="Search Godown"
              className="input"
            />

            <input
              placeholder="Enter Notes"
              className="input"
            />

            <input
              value="0"
              readOnly
              className="input"
            />

            <div className="flex items-center justify-center">
              <input type="checkbox" />
            </div>

            <button
              onClick={() => removeRow(index)}
              className="rounded bg-slate-100 text-lg text-slate-500"
            >
              ×
            </button>

          </div>
        ))}

      </div>
    </div>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function PurchasePage({ companyId }) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const [advancedOpen, setAdvancedOpen] = useState(true)

  const [activeTab, setActiveTab] =
    useState('Supplier’s Details')

  const [purchases, setPurchases] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [pagination, setPagination] = useState({})
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const fields = tabs[activeTab]

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

  const getPurchaseValue = (
    purchase,
    keys,
  ) => {
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

  const formatCurrency = (value) => {
    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) {
      return '-'
    }

    return `₹ ${numericValue.toLocaleString('en-IN')}`
  }

  const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
  }

  const filteredPurchases = purchases.filter((purchase) => {
    const searchableText = [
      purchase?.voucherNumber,
      purchase?.voucherNo,
      purchase?.voucher_no,
      purchase?.partyLedger,
      purchase?.partyName,
      purchase?.party_name,
      purchase?.narration,
      purchase?.voucherType,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(query.toLowerCase())
  })

  const totalPages = Math.max(1, Math.ceil(filteredPurchases.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedPurchases = filteredPurchases.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  )

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">
      <div className="bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-xs text-slate-600">
              Purchase Data
            </span>
            <strong className="mt-1 block text-xl font-bold text-slate-900">
              {filteredPurchases.length} records
            </strong>
          </div>

          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Purchases
          </div>
        </div>
      </div>

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">
              <span className="mr-2 text-slate-400">⌕</span>
              <input
                value={query}
                onChange={(event) => {
                  setCurrentPage(1)
                  setQuery(event.target.value)
                }}
                placeholder="Search party ledger or voucher no."
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none"
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
          </div>

          <span className="text-xs text-slate-500">
            Page {safeCurrentPage} · {pageSize} per page
          </span>
        </div>

        {errorMessage && (
          <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto px-3 pb-1">
          {isLoading ? (
            <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              Loading purchases...
            </div>
          ) : (
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Voucher No
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Party Ledger
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Narration
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold">
                    Voucher Type
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedPurchases.length > 0 ? (
                  paginatedPurchases.map((purchase, index) => {
                    const voucherNumber = getPurchaseValue(
                      purchase,
                      [
                        'voucherNumber',
                        'voucherNo',
                        'voucher_no',
                        'invoiceNo',
                        'invoice_no',
                        'number',
                      ],
                    )

                    const partyLedger = getPurchaseValue(
                      purchase,
                      [
                        'partyLedger',
                        'partyName',
                        'party_name',
                        'party',
                        'supplierName',
                        'supplier_name',
                        'customerName',
                        'ledgerName',
                        'name',
                      ],
                    )

                    const amount =
                      purchase?.amount ??
                      purchase?.total ??
                      purchase?.grandTotal ??
                      purchase?.totalAmount ??
                      0

                    const narration = getPurchaseValue(
                      purchase,
                      ['narration', 'description', 'notes'],
                    )

                    const voucherType = getPurchaseValue(
                      purchase,
                      ['voucherType', 'voucher_type', 'type'],
                    )

                    return (
                      <tr
                        key={
                          purchase?._id ||
                          purchase?.id ||
                          `${voucherNumber}-${index}`
                        }
                        className="text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <td className="max-w-[240px] px-5 py-3 leading-5 [overflow-wrap:anywhere]">
                          {voucherNumber}
                        </td>
                        <td className="px-5 py-3 leading-5 text-slate-700">
                          {formatDate(
                            purchase?.date || purchase?.voucherDate || purchase?.createdAt,
                          )}
                        </td>
                        <td className="max-w-[240px] px-5 py-3 leading-5 [overflow-wrap:anywhere]">
                          {partyLedger}
                        </td>
                        <td className="px-5 py-3 leading-5 text-slate-700">
                          {formatCurrency(amount)}
                        </td>
                        <td className="max-w-[320px] px-5 py-3 leading-5 [overflow-wrap:anywhere]">
                          {narration}
                        </td>
                        <td className="px-5 py-3 leading-5 text-slate-700">
                          {voucherType}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-[150px] text-center text-sm text-slate-500"
                    >
                      No purchase data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              disabled={isLoading || totalPages <= 1}
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium ${
                safeCurrentPage === page
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
              } disabled:opacity-50`}
            >
              {page}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default PurchasePage