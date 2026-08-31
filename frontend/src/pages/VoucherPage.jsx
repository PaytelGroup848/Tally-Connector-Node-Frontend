import { useState } from 'react'

function SearchIcon() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400"
    >
      ⌕
    </span>
  )
}

function CalendarIcon() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-500"
    >
      ▣
    </span>
  )
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  )
}

function VoucherPage({ type = 'Quotation' }) {
  const [rows, setRows] = useState([{ id: 1 }])
  const [openSection, setOpenSection] = useState('Advanced Settings')
  const [activeAdvancedTab, setActiveAdvancedTab] = useState(
    "Buyer's Details",
  )

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      { id: Date.now() },
    ])
  }

  const removeRow = (id) => {
    setRows((currentRows) =>
      currentRows.filter((row) => row.id !== id),
    )
  }

  const isSales = type === 'Sales'

  const labelText = isSales
    ? 'Create Sales Voucher'
    : `Create ${type} Voucher`

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#eaf0f5] text-slate-900">

      {/* =====================================================
          MAIN VOUCHER CONTAINER
      ===================================================== */}
      <div className="min-w-[1080px]">

        {/* ===================================================
            GREEN TITLE BAR
        =================================================== */}
        <div className="flex h-[40px] items-center bg-[#49bd3f] px-4">
          <h1 className="text-[16px] font-bold text-white">
            {labelText}
          </h1>
        </div>

        {/* ===================================================
            FORM AREA
        =================================================== */}
        <div className="px-3 pb-[70px] pt-3">

          {/* =================================================
              TOP FORM FIELDS
          ================================================= */}
          <div className="grid grid-cols-3 gap-2">

            {/* VOUCHER TYPE */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Voucher Type
              </label>

              <div className="relative">
                <input
                  value={
                    isSales
                      ? 'Sales'
                      : 'Select Voucher Type'
                  }
                  readOnly
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none"
                />

                <SearchIcon />
              </div>
            </div>

            {/* PARTY NAME */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Party Name
              </label>

              <div className="relative">
                <input
                  placeholder="Select Party"
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none placeholder:text-slate-500 focus:border-green-500"
                />

                <SearchIcon />
              </div>
            </div>

            {/* LEDGER TYPE */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Ledger Type
              </label>

              <div className="relative">
                <input
                  placeholder="Select Ledger"
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none placeholder:text-slate-500 focus:border-green-500"
                />

                <SearchIcon />
              </div>
            </div>

            {/* VOUCHER NO */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Voucher No
              </label>

              <div className="relative">
                <input
                  value="-"
                  readOnly
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-[12px] text-slate-700 outline-none"
                />

                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-[38px] w-[38px] items-center justify-center border-l border-slate-200 bg-slate-50 text-[16px] text-slate-700"
                >
                  ✎
                </button>
              </div>
            </div>

            {/* DATE */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Date
              </label>

              <div className="relative">
                <CalendarIcon />

                <input
                  type="date"
                  defaultValue="2026-08-31"
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pl-9 text-[12px] text-slate-700 outline-none focus:border-green-500"
                />
              </div>
            </div>

          </div>

          {/* =================================================
              ITEMS TABLE
          ================================================= */}
          <div className="mt-4 overflow-hidden border border-slate-300 bg-white">

            {/* TABLE HEADER */}
            <div className="grid min-w-[1080px] grid-cols-[1.35fr_0.52fr_0.52fr_0.78fr_0.55fr_0.95fr_0.95fr_1.1fr_0.72fr_0.52fr_0.35fr] bg-[#dfe4e8]">

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
                '',
              ].map((heading, index) => (
                <div
                  key={`${heading}-${index}`}
                  className="flex h-[34px] items-center border-r border-slate-300 px-2 text-[11px] font-semibold text-slate-900 last:border-r-0"
                >
                  {heading}

                  {index === 10 && (
                    <button
                      type="button"
                      onClick={addRow}
                      className="ml-auto flex h-5 w-5 items-center justify-center rounded bg-[#4b4f52] text-[14px] font-bold leading-none text-white hover:bg-[#33373a]"
                      aria-label="Add item"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}

            </div>

            {/* TABLE ROWS */}
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid min-w-[1080px] grid-cols-[1.35fr_0.52fr_0.52fr_0.78fr_0.55fr_0.95fr_0.95fr_1.1fr_0.72fr_0.52fr_0.35fr]"
              >

                {/* ITEM */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <div className="relative">
                    <input
                      placeholder="Search Item"
                      className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-8 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <SearchIcon />
                  </div>
                </div>

                {/* QTY */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <input
                    value="0"
                    readOnly
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none"
                  />
                </div>

                {/* RATE */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <input
                    value="0"
                    readOnly
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none"
                  />
                </div>

                {/* UNITS */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <select
                    defaultValue=""
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none"
                  >
                    <option value=""> </option>
                    <option>PCS</option>
                    <option>KG</option>
                    <option>LTR</option>
                  </select>
                </div>

                {/* DISC % */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <input
                    value="0"
                    readOnly
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none"
                  />
                </div>

                {/* HSN */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <div className="relative">
                    <input
                      placeholder="Search HSN"
                      className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-7 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <SearchIcon />
                  </div>
                </div>

                {/* GODOWN */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <div className="relative">
                    <input
                      placeholder="Search Godown"
                      className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-7 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <SearchIcon />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <input
                    placeholder="Enter Notes"
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                  />
                </div>

                {/* AMOUNT */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <input
                    value="0"
                    readOnly
                    className="h-[32px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none"
                  />
                </div>

                {/* TAX INCLUSIVE */}
                <div className="border-r border-t border-slate-300 p-1.5">
                  <label className="flex h-[32px] items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>

                {/* DELETE */}
                <div className="border-t border-slate-300 p-1.5">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="flex h-[32px] w-full items-center justify-center rounded-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete item"
                    title="Delete item"
                  >
                    <TrashIcon />
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* =================================================
              LOWER SECTION
          ================================================= */}
          <div className="mt-3 grid grid-cols-[1.5fr_1fr] gap-3">

            {/* LEFT */}
            <div>

              {/* NARRATION */}
              <div className="overflow-hidden rounded-md border border-slate-200 bg-white">

                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(
                      openSection === 'Narration'
                        ? null
                        : 'Narration',
                    )
                  }
                  className="flex h-[39px] w-full items-center justify-between border-b border-slate-200 px-4 text-left text-[13px] font-semibold text-slate-800"
                >
                  <span>
                    Narration
                  </span>

                  <span className="text-[22px] font-light">
                    {openSection === 'Narration'
                      ? '⌄'
                      : '›'}
                  </span>
                </button>

                {openSection === 'Narration' && (
                  <div className="p-3">
                    <textarea
                      rows={3}
                      placeholder="Enter narration"
                      className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-[12px] outline-none focus:border-green-500"
                    />
                  </div>
                )}

              </div>

              {/* ADVANCED SETTINGS */}
              <div className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-white">

                <button
                  type="button"
                  onClick={() =>
                    setOpenSection(
                      openSection === 'Advanced Settings'
                        ? null
                        : 'Advanced Settings',
                    )
                  }
                  className="flex h-[39px] w-full items-center justify-between px-4 text-left text-[13px] font-semibold text-slate-800"
                >
                  <span>
                    Advanced Settings
                  </span>

                  <span className="text-[20px]">
                    {openSection === 'Advanced Settings'
                      ? '⌄'
                      : '›'}
                  </span>
                </button>

                {openSection === 'Advanced Settings' && (
                  <div className="border-t border-slate-200">

                    {/* TABS */}
                    <div className="flex items-center border-b border-slate-200 px-4">

                      {[
                        "Buyer's Details",
                        'Consignee Details',
                        'Dispatch Details',
                        'Order Details',
                        'e-Way Bills',
                      ].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() =>
                            setActiveAdvancedTab(tab)
                          }
                          className={`relative px-4 py-3 text-[12px] ${
                            activeAdvancedTab === tab
                              ? 'font-medium text-[#0088ff]'
                              : 'text-slate-600'
                          }`}
                        >
                          {tab}

                          {activeAdvancedTab === tab && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#0088ff]" />
                          )}
                        </button>
                      ))}

                    </div>

                    {/* BUYER DETAILS */}
                    {activeAdvancedTab === "Buyer's Details" && (
                      <div className="grid grid-cols-3 gap-3 p-4">

                        {/* BUYER NAME */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Buyer's Name
                          </label>

                          <div className="relative">
                            <input
                              placeholder="Buyer's Name"
                              className="h-[34px] w-full rounded-md border border-slate-300 px-3 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />
                          </div>
                        </div>

                        {/* COUNTRY */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Buyer's Country
                          </label>

                          <div className="relative">
                            <input
                              placeholder="Buyer's Country"
                              className="h-[34px] w-full rounded-md border border-slate-300 px-3 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />
                          </div>
                        </div>

                        {/* STATE */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Buyer's State
                          </label>

                          <div className="relative">
                            <input
                              placeholder="Buyer's State"
                              className="h-[34px] w-full rounded-md border border-slate-300 px-3 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />
                          </div>
                        </div>

                        {/* REGISTRATION */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Registration Type
                          </label>

                          <div className="relative">
                            <input
                              placeholder="Registration Type"
                              className="h-[34px] w-full rounded-md border border-slate-300 px-3 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />
                          </div>
                        </div>

                        {/* POSTAL CODE */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Postal Code
                          </label>

                          <input
                            placeholder="Postal Code"
                            className="h-[34px] w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* GSTIN */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            GSTIN/UIN
                          </label>

                          <input
                            placeholder="GSTIN/UIN"
                            className="h-[34px] w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* PLACE OF SUPPLY */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Place of Supply
                          </label>

                          <div className="relative">
                            <input
                              placeholder="Place of Supply"
                              className="h-[34px] w-full rounded-md border border-slate-300 px-3 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />
                          </div>
                        </div>

                        {/* BILL TO */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Bill to Place
                          </label>

                          <input
                            placeholder="Bill to Place"
                            className="h-[34px] w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* ADDRESS */}
                        <div className="relative">
                          <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] text-slate-600">
                            Address
                          </label>

                          <textarea
                            rows={2}
                            placeholder="Address"
                            className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                      </div>
                    )}

                    {/* OTHER TABS */}
                    {activeAdvancedTab === 'Consignee Details' && (
                      <div className="p-4 text-[12px] text-slate-500">
                        Consignee details
                      </div>
                    )}

                    {activeAdvancedTab === 'Dispatch Details' && (
                      <div className="p-4 text-[12px] text-slate-500">
                        Dispatch details
                      </div>
                    )}

                    {activeAdvancedTab === 'Order Details' && (
                      <div className="p-4 text-[12px] text-slate-500">
                        Order details
                      </div>
                    )}

                    {activeAdvancedTab === 'e-Way Bills' && (
                      <div className="p-4 text-[12px] text-slate-500">
                        e-Way Bill details
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                RIGHT TOTAL PANEL
            ================================================= */}
            <div className="rounded-md border border-slate-200 bg-white">

              <button
                type="button"
                className="flex h-[40px] w-full items-center border-b border-slate-200 px-4 text-left text-[13px] font-semibold text-[#4f94ff]"
              >
                + Add GST And Other Ledgers
              </button>

              <div className="bg-[#eff9eb] px-4 py-3">

                <div className="flex items-center justify-between text-[12px] text-slate-700">
                  <span>
                    Sub Total
                  </span>

                  <b>
                    ₹0
                  </b>
                </div>

                <div className="mt-2 flex items-center justify-between text-[12px] text-slate-700">
                  <span>
                    Taxes
                  </span>

                  <b>
                    ₹0
                  </b>
                </div>

                <div className="mt-3 border-t border-slate-200 pt-3">

                  <div className="flex items-center justify-between text-[17px] font-bold text-slate-900">
                    <span>
                      Grand Total
                    </span>

                    <b>
                      ₹0
                    </b>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

        {/* =====================================================
            FOOTER BUTTON
        ===================================================== */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-end border-t border-slate-200 bg-white px-6 py-2">

          <button
            type="button"
            className="rounded-md bg-[#1d1f22] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_5px_15px_rgba(0,0,0,0.16)] hover:bg-black"
          >
            Create Voucher
          </button>

        </div>

      </div>
    </div>
  )
}

export default VoucherPage