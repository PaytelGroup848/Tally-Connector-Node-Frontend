import { useState } from 'react'

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

function PurchaseOrderPage() {

  const [advancedOpen, setAdvancedOpen] = useState(true)

  const [activeTab, setActiveTab] =
    useState('Supplier’s Details')

  const fields = tabs[activeTab]

  return (
    <div className="min-h-screen bg-[#eef3f8] p-5">

      <div className="mx-auto max-w-[1280px] rounded-lg bg-white shadow">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="rounded-t-lg bg-[#63c45d] px-5 py-4 text-lg font-bold text-white">
          Create Purchase Order Voucher
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="bg-[#f5f7f4] p-5">

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

export default PurchaseOrderPage