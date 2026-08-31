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
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[12px] font-medium leading-4 text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          placeholder={placeholder}
          className="
            h-10
            w-full
            min-w-0
            rounded-md
            border
            border-slate-300
            bg-white
            px-3
            pr-9
            text-sm
            text-slate-700
            placeholder:text-slate-400
            outline-none
            transition
            focus:border-green-500
            focus:ring-2
            focus:ring-green-100
          "
        />

        {search && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
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
    <div className="mt-5 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[1150px]">

          {/* HEADER */}
          <div
            className="
              grid
              grid-cols-[220px_70px_90px_80px_80px_110px_120px_200px_100px_70px_45px]
              items-center
              gap-2
              border-b
              border-slate-200
              bg-slate-100
              px-2.5
              py-2.5
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-600
            "
          >
            <div>Items</div>
            <div>Qty</div>
            <div>Rate</div>
            <div>Units</div>
            <div>Disc %</div>
            <div>HSN Code</div>
            <div>Godown</div>
            <div>Description</div>
            <div>Amount</div>
            <div className="text-center">Tax</div>

            <button
              type="button"
              onClick={addRow}
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-md
                border
                border-green-200
                bg-green-50
                text-lg
                font-medium
                leading-none
                text-green-700
                transition
                hover:bg-green-100
              "
            >
              +
            </button>
          </div>

          {/* ROWS */}
          {rows.map((_, index) => (
            <div
              key={index}
              className="
                grid
                grid-cols-[220px_70px_90px_80px_80px_110px_120px_200px_100px_70px_45px]
                items-center
                gap-2
                border-b
                border-slate-100
                px-2.5
                py-2
                last:border-b-0
              "
            >
              <input
                placeholder="Search Item"
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-3
                  text-xs
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <input
                value="0"
                readOnly
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-slate-50
                  px-2
                  text-center
                  text-xs
                  text-slate-600
                  outline-none
                "
              />

              <input
                value="0"
                readOnly
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-slate-50
                  px-2
                  text-center
                  text-xs
                  text-slate-600
                  outline-none
                "
              />

              <select
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-2
                  text-xs
                  text-slate-700
                  outline-none
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              >
                <option>-</option>
                <option>PCS</option>
                <option>KG</option>
                <option>BOX</option>
              </select>

              <input
                value="0"
                readOnly
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-slate-50
                  px-2
                  text-center
                  text-xs
                  text-slate-600
                  outline-none
                "
              />

              <input
                placeholder="Search HSN"
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-2.5
                  text-xs
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <input
                placeholder="Search Godown"
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-2.5
                  text-xs
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <input
                placeholder="Enter Notes"
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-white
                  px-2.5
                  text-xs
                  text-slate-700
                  placeholder:text-slate-400
                  outline-none
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <input
                value="0"
                readOnly
                className="
                  h-9
                  w-full
                  rounded-md
                  border
                  border-slate-300
                  bg-slate-50
                  px-2
                  text-center
                  text-xs
                  text-slate-600
                  outline-none
                "
              />

              <div className="flex h-9 items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-green-600"
                />
              </div>

              <button
                type="button"
                onClick={() => removeRow(index)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  justify-self-center
                  rounded-md
                  border
                  border-slate-200
                  bg-slate-50
                  text-lg
                  leading-none
                  text-slate-500
                  transition
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-500
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>
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
    <div className="min-h-screen w-full bg-[#eef3f8] p-3 sm:p-4 lg:p-5">

      <div className="mx-auto w-full max-w-[1320px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex min-h-[58px] items-center rounded-t-xl bg-[#63c45d] px-4 py-3 sm:px-5">
          <h1 className="text-base font-bold text-white sm:text-lg">
            Create Purchase Order Voucher
          </h1>
        </div>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="bg-[#f5f7f4] p-3 sm:p-4 lg:p-5">

          {/* ================================================= */}
          {/* TOP FIELDS */}
          {/* ================================================= */}

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

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
          </div>

          {/* ================================================= */}
          {/* ITEMS */}
          {/* ================================================= */}

          <ItemsTable />

          {/* ================================================= */}
          {/* LOWER SECTION */}
          {/* ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">

            {/* LEFT */}
            <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

              {/* Narration */}

              <div className="flex min-h-[48px] items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Narration
                </span>

                <span className="text-lg leading-none text-slate-500">
                  ›
                </span>
              </div>

              {/* Advanced */}

              <button
                type="button"
                onClick={() =>
                  setAdvancedOpen(!advancedOpen)
                }
                className="
                  flex
                  min-h-[48px]
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-slate-200
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-50
                "
              >
                <span>Advanced Settings</span>

                <span className="text-lg leading-none text-slate-500">
                  {advancedOpen ? '⌄' : '›'}
                </span>
              </button>

              {/* ADVANCED CONTENT */}

              {advancedOpen && (
                <div className="bg-[#f7f9f8] p-3 sm:p-4">

                  {/* TABS */}

                  <div className="mb-4 overflow-x-auto border-b border-slate-200">
                    <div className="grid min-w-[620px] grid-cols-4">

                      {Object.keys(tabs).map((tab) => (
                        <button
                          type="button"
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`
                            min-h-[46px]
                            border-b-2
                            px-3
                            py-3
                            text-xs
                            transition
                            sm:text-sm
                            ${
                              activeTab === tab
                                ? 'border-green-600 bg-white font-semibold text-green-700'
                                : 'border-transparent text-slate-600 hover:bg-white/70'
                            }
                          `}
                        >
                          {tab}
                        </button>
                      ))}

                    </div>
                  </div>

                  {/* FIELDS */}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {fields.map(([label, placeholder]) => (
                      <InputField
                        key={label}
                        label={label}
                        placeholder={placeholder}
                        search
                      />
                    ))}

                    <label className="flex min-w-0 flex-col md:col-span-2">

                      <span className="text-[12px] font-medium leading-4 text-slate-700">
                        {activeTab === 'Dispatch Details'
                          ? 'Dispatch Address'
                          : activeTab === 'Order Details'
                          ? 'Order Notes'
                          : 'Address'}
                      </span>

                      <textarea
                        className="
                          mt-1.5
                          min-h-[90px]
                          w-full
                          resize-y
                          rounded-md
                          border
                          border-slate-300
                          bg-white
                          p-3
                          text-sm
                          text-slate-700
                          placeholder:text-slate-400
                          outline-none
                          transition
                          focus:border-green-500
                          focus:ring-2
                          focus:ring-green-100
                        "
                        placeholder="Enter details"
                      />

                    </label>

                  </div>
                </div>
              )}

            </div>

            {/* RIGHT TOTAL */}

            <div className="h-fit overflow-hidden rounded-lg border border-slate-200 bg-[#f1f8ef] shadow-sm">

              <button
                type="button"
                className="
                  min-h-[48px]
                  w-full
                  border-b
                  border-slate-200
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:bg-[#eaf5e8]
                "
              >
                + Add GST And Other Ledgers
              </button>

              <div className="space-y-4 p-4 text-sm">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">
                    Sub Total
                  </span>

                  <b className="font-semibold text-slate-800">
                    ₹0
                  </b>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
                  <span className="text-slate-600">
                    Taxes
                  </span>

                  <b className="font-semibold text-slate-800">
                    ₹0
                  </b>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3 text-base font-bold">
                  <span className="text-slate-800">
                    Grand Total
                  </span>

                  <b className="text-slate-900">
                    ₹0
                  </b>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ================================================= */}
        {/* BUTTON */}
        {/* ================================================= */}

        <div className="flex justify-end bg-[#f5f7f4] px-3 pb-4 sm:px-5 sm:pb-5">

          <button
            type="button"
            className="
              min-h-[44px]
              rounded-lg
              bg-[#1a1f24]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#252b31]
              focus:outline-none
              focus:ring-2
              focus:ring-slate-400
              focus:ring-offset-2
            "
          >
            Create Voucher
          </button>

        </div>

      </div>
    </div>
  )
}

export default PurchaseOrderPage

