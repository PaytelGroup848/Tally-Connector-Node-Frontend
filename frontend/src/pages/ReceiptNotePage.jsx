import { useState } from 'react'

// ============================================================
// FIELD
// ============================================================

function Field({
  label,
  placeholder,
  value,
  readOnly = false,
  search = false,
  icon = null,
  className = '',
}) {
  return (
    <label className={`relative block min-w-0 ${className}`}>
      <span className="absolute -top-[7px] left-3 z-10 bg-[#eef3f8] px-1.5 text-[12px] leading-none text-[#1f4264]">
        {label}
      </span>

      <div className="relative">
        <input
          defaultValue={value}
          readOnly={readOnly}
          placeholder={placeholder}
          className="
            h-[39px]
            w-full
            rounded-[6px]
            border
            border-[#cbd5df]
            bg-white
            px-3
            pr-9
            text-[13px]
            text-[#1f2937]
            outline-none
            placeholder:text-[#8d98a5]
            focus:border-[#4dbb45]
            focus:ring-1
            focus:ring-[#d8f1d5]
          "
        />

        {search && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-[#98a3af]">
            ⌕
          </span>
        )}

        {icon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-[#111827]">
            {icon}
          </span>
        )}
      </div>
    </label>
  )
}

// ============================================================
// TABLE INPUT
// ============================================================

function TableInput({
  placeholder,
  value,
  readOnly = false,
  search = false,
}) {
  return (
    <div className="relative w-full">
      <input
        defaultValue={value}
        readOnly={readOnly}
        placeholder={placeholder}
        className="
          h-[31px]
          w-full
          rounded-[2px]
          border
          border-[#cbd4dc]
          bg-white
          px-2
          pr-7
          text-[12px]
          text-[#263238]
          outline-none
          placeholder:text-[#94a0ad]
          focus:border-[#55ba4d]
        "
      />

      {search && (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-[#9aa5af]">
          ⌕
        </span>
      )}
    </div>
  )
}

// ============================================================
// ITEMS TABLE
// ============================================================

function ItemsTable() {
  const [rows, setRows] = useState([
    {
      id: 1,
    },
  ])

  const addRow = () => {
    setRows((current) => [
      ...current,
      {
        id: Date.now(),
      },
    ])
  }

  const removeRow = (id) => {
    setRows((current) =>
      current.filter((row) => row.id !== id)
    )
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="min-w-[1080px] overflow-hidden border border-[#d0d7de]">

        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-[1.25fr_0.46fr_0.46fr_0.58fr_0.52fr_0.9fr_0.92fr_1.18fr_0.7fr_0.54fr_0.34fr]
            bg-[#e7eaed]
          "
        >
          {[
            'Items',
            'Qty',
            'Rate',
            'Units',
            'Disc %',
            'HSN Code',
            'Godown',
            'Description',
            'Amount',
            'Tax Incl.',
          ].map((heading) => (
            <div
              key={heading}
              className="
                flex
                h-[31px]
                items-center
                border-r
                border-[#cbd3dc]
                px-2
                text-[12px]
                font-semibold
                text-black
              "
            >
              {heading}
            </div>
          ))}

          <div className="flex h-[31px] items-center justify-center">
            <button
              type="button"
              onClick={addRow}
              className="
                flex
                h-[20px]
                w-[20px]
                items-center
                justify-center
                rounded-[3px]
                bg-[#565656]
                text-[17px]
                font-bold
                leading-none
                text-white
                hover:bg-[#333]
              "
            >
              +
            </button>
          </div>
        </div>

        {/* ROWS */}

        {rows.map((row) => (
          <div
            key={row.id}
            className="
              grid
              grid-cols-[1.25fr_0.46fr_0.46fr_0.58fr_0.52fr_0.9fr_0.92fr_1.18fr_0.7fr_0.54fr_0.34fr]
              min-h-[46px]
              border-t
              border-[#d4dbe2]
              bg-white
            "
          >
            {/* ITEM */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                placeholder="Search Item"
                search
              />
            </div>

            {/* QTY */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* RATE */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* UNITS */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <select
                defaultValue=""
                className="
                  h-[31px]
                  w-full
                  rounded-[2px]
                  border
                  border-[#cbd4dc]
                  bg-white
                  px-2
                  text-[12px]
                  outline-none
                "
              >
                <option value="">-</option>
                <option>PCS</option>
              </select>
            </div>

            {/* DISCOUNT */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* HSN */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                placeholder="Search HSN"
                search
              />
            </div>

            {/* GODOWN */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                placeholder="Search Godown"
                search
              />
            </div>

            {/* DESCRIPTION */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                placeholder="Enter Notes"
              />
            </div>

            {/* AMOUNT */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* TAX */}

            <div className="flex items-center justify-center border-r border-[#d4dbe2]">
              <input
                type="checkbox"
                className="h-[14px] w-[14px]"
              />
            </div>

            {/* DELETE */}

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="
                  flex
                  h-[30px]
                  w-[30px]
                  items-center
                  justify-center
                  text-[16px]
                  text-[#ff6969]
                  hover:text-[#e43e3e]
                "
              >
                ♧
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// ADVANCED TABS
// ============================================================

const advancedTabs = [
  "Supplier's Details",
  'Consignee Details',
  'Dispatch Details',
  'Order Details',
]

// ============================================================
// ADVANCED CONTENT
// ============================================================

function AdvancedContent({ activeTab }) {
  if (activeTab === "Supplier's Details") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Field
          label="Supplier's Name"
          placeholder="Supplier's Name"
          search
        />

        <Field
          label="Supplier's Country"
          placeholder="Supplier's Country"
          search
        />

        <Field
          label="Supplier's State"
          placeholder="Supplier's State"
          search
        />

        <Field
          label="Registration Type"
          placeholder="Registration Type"
          search
        />

        <Field
          label="Postal Code"
          placeholder="Postal Code"
        />

        <Field
          label="GSTIN/UIN"
          placeholder="GSTIN/UIN"
        />

        <Field
          label="Place of Supply"
          placeholder="Place of Supply"
          className="md:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  if (activeTab === 'Consignee Details') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Field
          label="Consignee Name"
          placeholder="Consignee Name"
          search
        />

        <Field
          label="GSTIN/UIN"
          placeholder="GSTIN/UIN"
        />

        <Field
          label="Consignee Country"
          placeholder="Country"
        />

        <Field
          label="Consignee State"
          placeholder="State"
        />

        <Field
          label="Postal Code"
          placeholder="Postal Code"
        />

        <Field
          label="Address"
          placeholder="Address"
          className="md:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  if (activeTab === 'Dispatch Details') {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Field
          label="Dispatch From"
          placeholder="Dispatch From"
          search
        />

        <Field
          label="Dispatch Through"
          placeholder="Dispatch Through"
          search
        />

        <Field
          label="Vehicle Number"
          placeholder="Vehicle Number"
        />

        <Field
          label="Transporter Name"
          placeholder="Transporter Name"
          search
        />

        <Field
          label="Transporter ID"
          placeholder="Transporter ID"
        />

        <Field
          label="Dispatch Date"
          placeholder="Dispatch Date"
          icon="▣"
        />

        <Field
          label="Dispatch Address"
          placeholder="Dispatch Address"
          className="md:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

      <Field
        label="Date"
        placeholder="Order Date"
        icon="▣"
      />

      <Field
        label="Order Number"
        placeholder="Order Number"
      />

      <Field
        label="Mode of Payment"
        placeholder="Mode of Payment"
      />

      <Field
        label="Other Reference"
        placeholder="Other Reference"
        className="md:col-span-2"
      />

      <label className="relative block min-w-0">
        <span className="absolute -top-[7px] left-3 z-10 bg-[#f7f9f8] px-1.5 text-[12px] leading-none text-[#1f4264]">
          Terms of Delivery
        </span>

        <textarea
          placeholder="Terms of Delivery"
          className="
            h-[44px]
            w-full
            resize-none
            rounded-[6px]
            border
            border-[#cbd5df]
            bg-white
            px-3
            py-2
            text-[13px]
            outline-none
            placeholder:text-[#98a1ad]
            focus:border-[#48b83d]
          "
        />
      </label>

    </div>
  )
}

// ============================================================
// RECEIPT NOTE PAGE
// ============================================================

function ReceiptNotePage() {
  const [rows] = useState([{ id: 1 }])

  const [activeTab, setActiveTab] =
    useState("Supplier's Details")

  const [narrationOpen, setNarrationOpen] =
    useState(true)

  const [advancedOpen, setAdvancedOpen] =
    useState(true)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex h-[36px] items-center bg-[#45bd35] px-5">
        <h1 className="text-[16px] font-bold text-white">
          Create Receipt Note Voucher
        </h1>
      </div>

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <div className="p-4">

        {/* ================================================= */}
        {/* TOP FIELDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

          <Field
            label="Voucher Type"
            placeholder="Select Voucher Type"
            search
          />

          <Field
            label="Party Name"
            placeholder="Select Party"
            search
          />

          <Field
            label="Order Type"
            placeholder="Select ref"
            search
          />

          <Field
            label="Order Number"
            placeholder="Order Number"
          />

          <Field
            label="Order Date"
            placeholder="Order Date"
            icon="▣"
          />

          <Field
            label="Voucher No"
            value="-"
            readOnly
            icon="✎"
          />

          <Field
            label="Date"
            value="31 Aug 2026"
            readOnly
            icon="▣"
          />

          <Field
            label="Ledger Type"
            placeholder="Select Ledger"
            search
            className="xl:col-span-3"
          />

        </div>

        {/* ================================================= */}
        {/* ITEMS */}
        {/* ================================================= */}

        <div className="mt-4">
          <ItemsTable />
        </div>

        {/* ================================================= */}
        {/* LOWER SECTION */}
        {/* ================================================= */}

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="min-w-0">

            {/* NARRATION */}

            <div className="overflow-hidden rounded-[4px] bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setNarrationOpen((current) => !current)
                }
                className="
                  flex
                  h-[37px]
                  w-full
                  items-center
                  justify-between
                  px-4
                  text-left
                "
              >
                <span className="text-[13px] font-semibold text-[#111827]">
                  Narration
                </span>

                <span className="text-[21px] leading-none text-[#111]">
                  {narrationOpen ? '⌄' : '›'}
                </span>
              </button>

              {narrationOpen && (
                <div className="border-t border-[#edf0f2] px-4 pb-4 pt-3">

                  <textarea
                    className="
                      min-h-[48px]
                      w-full
                      resize-none
                      rounded-[4px]
                      border
                      border-[#cbd5df]
                      bg-white
                      px-3
                      py-2
                      text-[13px]
                      outline-none
                      focus:border-[#48b83d]
                    "
                  />

                </div>
              )}

            </div>

            {/* ADVANCED SETTINGS */}

            <div className="mt-2 overflow-hidden rounded-[4px] bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setAdvancedOpen((current) => !current)
                }
                className="
                  flex
                  h-[37px]
                  w-full
                  items-center
                  justify-between
                  px-4
                  text-left
                "
              >
                <span className="text-[13px] font-semibold text-[#111827]">
                  Advanced Settings
                </span>

                <span className="text-[21px] leading-none text-[#111]">
                  {advancedOpen ? '⌄' : '›'}
                </span>
              </button>

              {advancedOpen && (
                <div className="border-t border-[#edf0f2] bg-[#f7f9f8] px-4 pb-4">

                  {/* TABS */}

                  <div className="overflow-x-auto">

                    <div className="flex min-w-[610px] border-b border-[#d3dbe2]">

                      {advancedTabs.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`
                            flex-1
                            whitespace-nowrap
                            px-3
                            py-3
                            text-[12px]
                            ${
                              activeTab === tab
                                ? 'font-semibold text-[#079cf0]'
                                : 'text-[#596875]'
                            }
                          `}
                        >
                          {tab}
                        </button>
                      ))}

                    </div>

                  </div>

                  {/* TAB CONTENT */}

                  <div className="pt-4">

                    <AdvancedContent
                      activeTab={activeTab}
                    />

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* TOTAL */}
          {/* ================================================= */}

          <div className="h-fit rounded-[4px] bg-white p-4 shadow-sm">

            <button
              type="button"
              className="
                text-[14px]
                font-semibold
                text-[#4994eb]
              "
            >
              + Add GST And Other Ledgers
            </button>

            <div className="mt-3 bg-[#f1fbef] px-4 py-3">

              <div className="flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  Sub Total
                </span>

                <span className="font-medium text-[#111]">
                  ₹0
                </span>
              </div>

              <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  Taxes
                </span>

                <span className="font-medium text-[#111]">
                  ₹0
                </span>
              </div>

              <div className="mt-3 border-t border-[#d6e4d3] pt-2">

                <div className="flex items-center justify-between text-[16px] font-bold text-[#111]">
                  <span>
                    Grand Total
                  </span>

                  <span>
                    ₹0
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <div className="flex min-h-[58px] items-center justify-end border-t border-[#e0e5ea] bg-white px-5">

        <button
          type="button"
          className="
            rounded-[4px]
            bg-[#171717]
            px-5
            py-2.5
            text-[13px]
            font-bold
            text-white
            shadow-sm
            transition
            hover:bg-[#272727]
            active:scale-[0.98]
          "
        >
          Create Voucher
        </button>

      </div>

    </div>
  )
}

export default ReceiptNotePage