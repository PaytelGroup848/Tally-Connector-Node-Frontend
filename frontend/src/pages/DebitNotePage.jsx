import { useState } from 'react'

// ============================================================
// REUSABLE FIELD
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
      <span className="absolute -top-[7px] left-3 z-10 bg-[#eef3f8] px-1.5 text-[12px] leading-none text-[#1e3a5f]">
        {label}
      </span>

      <div className="relative">
        <input
          defaultValue={value}
          readOnly={readOnly}
          placeholder={placeholder}
          className="
            h-[38px]
            w-full
            rounded-[6px]
            border
            border-[#cbd5df]
            bg-white
            px-3
            pr-9
            text-[13px]
            text-[#172033]
            outline-none
            placeholder:text-[#98a1ad]
            focus:border-[#48b83d]
          "
        />

        {search && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[15px] text-[#97a2ad]">
            ⌕
          </span>
        )}

        {icon && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-[#111827]">
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
          placeholder:text-[#97a2ad]
          focus:border-[#57bd4f]
        "
      />

      {search && (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[13px] text-[#9ba5af]">
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
      <div className="min-w-[1080px] overflow-hidden border border-[#d1d9e0]">

        {/* ================================================= */}
        {/* TABLE HEADER */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-[180px_72px_72px_110px_72px_125px_150px_138px_100px_78px]
            bg-[#e8eaed]
          "
        >
          <div className="flex h-[31px] items-center border-r border-[#cbd3dc] px-2 text-[12px] font-semibold text-black">
            Items
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Qty
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Rate
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Units
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Disc %
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            HSN Code
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Godown
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Description
          </div>

          <div className="flex h-[31px] items-center justify-center border-r border-[#cbd3dc] text-[12px] font-semibold text-black">
            Amount
          </div>

          <div className="flex h-[31px] items-center justify-center text-[12px] font-semibold text-black">
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
                bg-[#555]
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

        {/* ================================================= */}
        {/* TABLE ROWS */}
        {/* ================================================= */}

        {rows.map((row) => (
          <div
            key={row.id}
            className="
              grid
              grid-cols-[180px_72px_72px_110px_72px_125px_150px_138px_100px_78px]
              min-h-[47px]
              border-t
              border-[#d7dde3]
              bg-white
            "
          >

            {/* ITEM */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                placeholder="Search Item"
                search
              />
            </div>

            {/* QTY */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* RATE */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* UNITS */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <select
                className="
                  h-[31px]
                  w-full
                  rounded-[2px]
                  border
                  border-[#cbd4dc]
                  bg-white
                  px-2
                  text-[12px]
                  text-[#263238]
                  outline-none
                  focus:border-[#57bd4f]
                "
              >
                <option>-</option>
                <option>PCS</option>
                <option>KG</option>
                <option>BOX</option>
              </select>
            </div>

            {/* DISCOUNT */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                value="0"
                readOnly
              />
            </div>

            {/* HSN */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                placeholder="Search HSN"
                search
              />
            </div>

            {/* GODOWN */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                placeholder="Search Godown"
                search
              />
            </div>

            {/* DESCRIPTION */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                placeholder="Enter Notes"
              />
            </div>

            {/* AMOUNT */}

            <div className="flex items-center border-r border-[#d7dde3] p-2">
              <TableInput
                value="0"
                readOnly
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
                  text-[15px]
                  text-[#ff6464]
                  transition
                  hover:text-[#e53935]
                "
                aria-label="Remove row"
              >
                🗑
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
  "Buyer's Details",
  'Consignee Details',
  'Dispatch Details',
  'Order Details',
]

// ============================================================
// ADVANCED CONTENT
// ============================================================

function AdvancedContent({ activeTab }) {
  if (activeTab === "Buyer's Details") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Field
          label="Supplier Name"
          placeholder="Supplier Name"
          search
        />

        <Field
          label="GSTIN/UIN"
          placeholder="GSTIN/UIN"
          search
        />

        <Field
          label="Supplier Country"
          placeholder="Country"
          search
        />

        <Field
          label="Supplier State"
          placeholder="State"
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
          label="Place of Supply"
          placeholder="Place of Supply"
          className="sm:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  if (activeTab === 'Consignee Details') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Field
          label="Consignee Name"
          placeholder="Consignee Name"
          search
        />

        <Field
          label="GSTIN/UIN"
          placeholder="GSTIN/UIN"
          search
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
          className="sm:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  if (activeTab === 'Dispatch Details') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

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
          className="sm:col-span-2 lg:col-span-3"
        />

      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

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
        className="sm:col-span-1 lg:col-span-2"
      />

      <label className="relative block min-w-0">
        <span className="absolute -top-[7px] left-3 z-10 bg-[#f7f9f8] px-1.5 text-[12px] leading-none text-[#1e3a5f]">
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
            text-[#172033]
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
// DEBIT NOTE PAGE
// ============================================================

export default function DebitNotePage() {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const [activeTab, setActiveTab] =
    useState('Order Details')

  return (
    <div className="min-h-screen w-full bg-[#eef3f8]">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex h-[34px] items-center bg-[#45bd35] px-4">
        <h1 className="text-[16px] font-bold leading-none text-white">
          Create Debit Note Voucher
        </h1>
      </div>

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <div className="w-full px-1.5 py-4 sm:px-4">

        {/* ================================================= */}
        {/* TOP FIELDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

          {/* VOUCHER TYPE */}

          <Field
            label="Voucher Type"
            placeholder="Debit Note"
            value="Debit Note"
            readOnly
            search
          />

          {/* PARTY NAME */}

          <Field
            label="Party Name"
            placeholder="Select Party"
            search
          />

          {/* LEDGER TYPE */}

          <Field
            label="Ledger Type"
            placeholder="Select Ledger"
            search
          />

          {/* VOUCHER NUMBER */}

          <Field
            label="Voucher No"
            placeholder="1"
            value="1"
            icon="✎"
          />

          {/* DATE */}

          <Field
            label="Date"
            placeholder="31 Aug 2026"
            value="31 Aug 2026"
            icon="▣"
          />

          {/* REASON FOR RETURN */}

          <Field
            label="Reason For Return"
            placeholder="Select Reason for return"
            search
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

        <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_470px]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="min-w-0">

            {/* NARRATION */}

            <div className="flex h-[36px] items-center justify-between rounded-[4px] bg-white px-4 shadow-sm">

              <span className="text-[13px] font-semibold text-[#101820]">
                Narration
              </span>

              <span className="text-[23px] leading-none text-[#111]">
                ›
              </span>

            </div>

            {/* ADVANCED */}

            <div className="mt-2 overflow-hidden rounded-[4px] bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setAdvancedOpen((current) => !current)
                }
                className="
                  flex
                  h-[36px]
                  w-full
                  items-center
                  justify-between
                  px-4
                  text-left
                "
              >
                <span className="text-[13px] font-semibold text-[#101820]">
                  Advanced Settings
                </span>

                <span className="text-[20px] leading-none text-[#111]">
                  {advancedOpen ? '⌄' : '›'}
                </span>
              </button>

              {/* ADVANCED BODY */}

              {advancedOpen && (
                <div className="border-t border-[#edf0f2] bg-[#f7f9f8] px-4 pb-4">

                  {/* TABS */}

                  <div className="overflow-x-auto">
                    <div className="flex min-w-[570px] border-b border-[#d5dce2]">

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
                            transition
                            ${
                              activeTab === tab
                                ? 'font-medium text-[#03a9f4]'
                                : 'text-[#607080]'
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
          {/* RIGHT TOTAL */}
          {/* ================================================= */}

          <div className="h-fit min-w-0 rounded-[4px] bg-white p-4 shadow-sm">

            <button
              type="button"
              className="
                text-[14px]
                font-semibold
                text-[#4698eb]
                hover:text-[#2476c5]
              "
            >
              + Add GST And Other Ledgers
            </button>

            <div className="mt-3 rounded-[2px] bg-[#f1fbef] px-4 py-3">

              {/* SUB TOTAL */}

              <div className="flex items-center justify-between text-[12px] text-[#52606d]">

                <span>
                  Sub Total
                </span>

                <span className="font-medium text-[#111]">
                  ₹0
                </span>

              </div>

              {/* TAXES */}

              <div className="mt-2 flex items-center justify-between text-[12px] text-[#52606d]">

                <span>
                  Taxes
                </span>

                <span className="font-medium text-[#111]">
                  ₹0
                </span>

              </div>

              {/* GRAND TOTAL */}

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

      <div className="mt-2 flex min-h-[62px] items-center justify-end border-t border-[#e3e7eb] bg-white px-4">

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
            transition
            hover:bg-[#2b2b2b]
          "
        >
          Create Voucher
        </button>

      </div>

    </div>
  )
}