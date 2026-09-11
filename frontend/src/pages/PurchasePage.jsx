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

  return (
    <div className="min-h-screen bg-[#eef3f8] p-5">

      <div className="mx-auto max-w-[1280px] rounded-lg bg-white shadow">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="rounded-t-lg bg-[#63c45d] px-5 py-4 text-lg font-bold text-white">
          Create Purchase Voucher
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="bg-[#f5f7f4] p-5">
          {errorMessage && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Purchases
              </h2>

              <span className="text-[11px] text-slate-500">
                {pagination?.total ?? purchases.length} records
              </span>
            </div>

            {isLoading ? (
              <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                Loading purchases...
              </div>
            ) : purchases.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        Voucher No
                      </th>

                      <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        Date
                      </th>

                      <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        Party
                      </th>

                      <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        Amount
                      </th>

                      <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {purchases.map((purchase, index) => {
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

                      const partyName = getPurchaseValue(
                        purchase,
                        [
                          'partyName',
                          'party_name',
                          'party',
                          'supplierName',
                          'supplier_name',
                          'partyLedger',
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

                      const status =
                        getPurchaseValue(
                          purchase,
                          ['status', 'voucherStatus', 'voucher_status', 'state'],
                        )

                      return (
                        <tr
                          key={
                            purchase?._id ||
                            purchase?.id ||
                            `${voucherNumber}-${index}`
                          }
                          className="odd:bg-white even:bg-slate-50"
                        >
                          <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                            {voucherNumber}
                          </td>

                          <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                            {formatDate(
                              purchase?.date || purchase?.voucherDate || purchase?.createdAt,
                            )}
                          </td>

                          <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                            {partyName}
                          </td>

                          <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                            {formatCurrency(amount)}
                          </td>

                          <td className="border-b border-slate-200 px-3 py-2 text-slate-700">
                            {status}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-500">
                No purchases found
              </div>
            )}
          </div>

          {/* TOP FIELDS */}

          <div className="grid gap-3 md:grid-cols-3">

            <InputField
              label="Voucher Type"
              placeholder="Select Voucher Type"
              search
            />

            <InputField
              label="Party Name"
              placeholder="Select Party"
              search
            />

            <InputField
              label="Ledger Type"
              placeholder="Select Ledger"
              search
            />

            <InputField
              label="Voucher No"
              placeholder="-"
            />

            <InputField
              label="Date"
              placeholder="Date"
            />

          </div>

          {/* ================================================= */}
          {/* ITEMS */}
          {/* ================================================= */}

          <ItemsTable />

          {/* ================================================= */}
          {/* LOWER SECTION */}
          {/* ================================================= */}

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_330px]">

            {/* LEFT */}

            <div className="rounded-lg border bg-white">

              {/* Narration */}

              <div className="flex justify-between border-b px-4 py-3 text-sm">
                <span>Narration</span>
                <span>›</span>
              </div>

              {/* Advanced */}

              <button
                onClick={() =>
                  setAdvancedOpen(!advancedOpen)
                }
                className="flex w-full justify-between border-b px-4 py-3 text-sm"
              >
                <span>Advanced Settings</span>

                <span>
                  {advancedOpen ? '⌄' : '›'}
                </span>
              </button>

              {/* ADVANCED CONTENT */}

              {advancedOpen && (

                <div className="bg-[#f7f9f8] p-4">

                  {/* TABS */}

                  <div className="mb-4 grid grid-cols-4 border-b">

                    {Object.keys(tabs).map((tab) => (

                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`border-b-2 px-3 py-3 text-xs ${
                          activeTab === tab
                            ? 'border-green-600 bg-white font-semibold text-green-700'
                            : 'border-transparent text-slate-600'
                        }`}
                      >
                        {tab}
                      </button>

                    ))}

                  </div>

                  {/* FIELDS */}

                  <div className="grid gap-3 md:grid-cols-2">

                    {fields.map(([label, placeholder]) => (

                      <InputField
                        key={label}
                        label={label}
                        placeholder={placeholder}
                        search
                      />

                    ))}

                    <label className="md:col-span-2">

                      <span className="text-xs font-medium">
                        {activeTab === 'Dispatch Details'
                          ? 'Dispatch Address'
                          : activeTab === 'Order Details'
                          ? 'Order Notes'
                          : 'Address'}
                      </span>

                      <textarea
                        className="mt-1 min-h-[80px] w-full rounded-md border border-slate-300 p-3 outline-none focus:border-green-600"
                        placeholder="Enter details"
                      />

                    </label>

                  </div>

                </div>

              )}

            </div>

            {/* RIGHT TOTAL */}

            <div className="rounded-lg border bg-[#f1f8ef]">

              <button className="w-full border-b p-3 text-left text-sm font-semibold">
                + Add GST And Other Ledgers
              </button>

              <div className="space-y-3 p-4 text-sm">

                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <b>₹0</b>
                </div>

                <div className="flex justify-between border-t pt-2">
                  <span>Taxes</span>
                  <b>₹0</b>
                </div>

                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Grand Total</span>
                  <b>₹0</b>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* BUTTON */}
        {/* ================================================= */}

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5">

          <button className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white">
            Create Voucher
          </button>

        </div>

      </div>
    </div>
  )
}

export default PurchasePage