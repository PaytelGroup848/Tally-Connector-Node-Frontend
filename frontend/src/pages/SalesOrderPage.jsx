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
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-600"
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

function SalesOrderPage() {
  const [rows, setRows] = useState([
    {
      id: 1,
      item: '',
      qty: '0',
      rate: '0',
      units: '',
      discount: '0',
      hsn: '',
      godown: '',
      description: '',
      amount: '0',
      taxInclusive: false,
    },
  ])

  const [openSection, setOpenSection] = useState(null)

  const [activeAdvancedTab, setActiveAdvancedTab] =
    useState("Buyer's Details")

  const [voucherType, setVoucherType] =
    useState('Select Voucher Type')

  const [partyName, setPartyName] =
    useState('')

  const [ledgerType, setLedgerType] =
    useState('')

  const [voucherNo, setVoucherNo] =
    useState('1')

  const [voucherDate, setVoucherDate] =
    useState('2026-08-31')

  /* =========================================================
     REFERENCE POPUP
  ========================================================= */

  const [showReferencePopup, setShowReferencePopup] =
    useState(false)

  const [referenceNumber, setReferenceNumber] =
    useState('')

  const [referenceDate, setReferenceDate] =
    useState('')

  /* Temporary values used while popup is open */
  const [tempReferenceNumber, setTempReferenceNumber] =
    useState('')

  const [tempReferenceDate, setTempReferenceDate] =
    useState('')

  /* =========================================================
     ADD ROW
  ========================================================= */

  const addRow = () => {
    setRows((currentRows) => [
      ...currentRows,
      {
        id: Date.now(),
        item: '',
        qty: '0',
        rate: '0',
        units: '',
        discount: '0',
        hsn: '',
        godown: '',
        description: '',
        amount: '0',
        taxInclusive: false,
      },
    ])
  }

  /* =========================================================
     DELETE ROW
  ========================================================= */

  const removeRow = (id) => {
    setRows((currentRows) => {
      if (currentRows.length === 1) {
        return currentRows
      }

      return currentRows.filter(
        (row) => row.id !== id,
      )
    })
  }

  /* =========================================================
     UPDATE ROW
  ========================================================= */

  const updateRow = (id, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    )
  }

  /* =========================================================
     OPEN REFERENCE POPUP
  ========================================================= */

  const openReferencePopup = () => {
    setTempReferenceNumber(referenceNumber)
    setTempReferenceDate(referenceDate)
    setShowReferencePopup(true)
  }

  /* =========================================================
     SAVE REFERENCE
  ========================================================= */

  const saveReference = () => {
    setReferenceNumber(tempReferenceNumber)
    setReferenceDate(tempReferenceDate)
    setShowReferencePopup(false)
  }

  /* =========================================================
     CANCEL REFERENCE
  ========================================================= */

  const cancelReference = () => {
    setTempReferenceNumber(referenceNumber)
    setTempReferenceDate(referenceDate)
    setShowReferencePopup(false)
  }

  /* =========================================================
     CREATE BUTTONS
  ========================================================= */

  const handleCreateVoucher = () => {
    alert('Sales Order Voucher created')
  }

  const handleCreateEway = () => {
    alert('e-Way creation started')
  }

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#eaf0f5] text-slate-900">

      <div className="min-w-[1080px]">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="flex h-[28px] items-center bg-[#48bd3c] px-2">
          <h1 className="text-[16px] font-bold text-white">
            Create Sales Order Voucher
          </h1>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}
        <div className="relative p-2">

          {/* =================================================
              TOP FORM
          ================================================= */}
          <div className="grid grid-cols-3 gap-2">

            {/* VOUCHER TYPE */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Voucher Type
              </label>

              <select
                value={voucherType}
                onChange={(event) =>
                  setVoucherType(event.target.value)
                }
                className="h-[38px] w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none focus:border-green-500"
              >
                <option value="Select Voucher Type">
                  Select Voucher Type
                </option>

                <option value="Sales">
                  Sales
                </option>

                <option value="Sales Order">
                  Sales Order
                </option>

                <option value="Quotation">
                  Quotation
                </option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                ⌄
              </span>
            </div>

            {/* PARTY NAME */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Party Name
              </label>

              <div className="relative">
                <input
                  list="party-list"
                  value={partyName}
                  onChange={(event) =>
                    setPartyName(event.target.value)
                  }
                  placeholder="Select Party"
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none placeholder:text-slate-500 focus:border-green-500"
                />

                <datalist id="party-list">
                  <option value="Amit Traders" />
                  <option value="Bharat Metals" />
                  <option value="Classic Garments" />
                  <option value="Delhi Packaging" />
                  <option value="Fortune Foods" />
                </datalist>

                <SearchIcon />
              </div>
            </div>

            {/* LEDGER TYPE */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Ledger Type
              </label>

              <select
                value={ledgerType}
                onChange={(event) =>
                  setLedgerType(event.target.value)
                }
                className="h-[38px] w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-[12px] text-slate-700 outline-none focus:border-green-500"
              >
                <option value="">
                  Select Ledger
                </option>

                <option value="Sales Account">
                  Sales Account
                </option>

                <option value="Sales Order">
                  Sales Order
                </option>

                <option value="Service Income">
                  Service Income
                </option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
                ⌄
              </span>
            </div>

            {/* VOUCHER NO */}
            <div className="relative">
              <label className="absolute left-3 top-[-7px] z-10 bg-[#eaf0f5] px-1 text-[12px] font-medium text-slate-700">
                Voucher No
              </label>

              <div className="relative">
                <input
                  value={voucherNo}
                  onChange={(event) =>
                    setVoucherNo(event.target.value)
                  }
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-[12px] text-slate-700 outline-none"
                />

                {/* PENCIL */}
                <button
                  type="button"
                  title="Edit reference details"
                  onClick={openReferencePopup}
                  className="absolute right-0 top-0 flex h-[38px] w-[38px] items-center justify-center border-l border-slate-200 bg-slate-50 text-[15px] text-slate-700 transition hover:bg-slate-100"
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
                  value={voucherDate}
                  onChange={(event) =>
                    setVoucherDate(
                      event.target.value,
                    )
                  }
                  className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 pl-9 text-[12px] text-slate-700 outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* EMPTY */}
            <div />

          </div>

          {/* =================================================
              REFERENCE POPUP
          ================================================= */}
          {showReferencePopup && (
            <div className="absolute left-0 top-[47px] z-50 w-[480px] rounded-md border border-slate-300 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)]">

              {/* POINTER */}
              <div className="absolute -top-[9px] left-[28px] h-0 w-0 border-l-[9px] border-r-[9px] border-b-[9px] border-l-transparent border-r-transparent border-b-slate-300" />

              <div className="absolute -top-[8px] left-[29px] h-0 w-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />

              {/* CONTENT */}
              <div className="p-3">

                {/* FIELDS */}
                <div className="grid grid-cols-2 gap-3">

                  {/* REFERENCE NUMBER */}
                  <div className="relative">
                    <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] font-medium text-slate-700">
                      Reference Number
                    </label>

                    <input
                      type="text"
                      value={tempReferenceNumber}
                      onChange={(event) =>
                        setTempReferenceNumber(
                          event.target.value,
                        )
                      }
                      placeholder="Reference Number"
                      className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 text-[12px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-500"
                    />
                  </div>

                  {/* REFERENCE DATE */}
                  <div className="relative">
                    <label className="absolute left-3 top-[-7px] z-10 bg-white px-1 text-[11px] font-medium text-slate-700">
                      Reference Date
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        value={tempReferenceDate}
                        onChange={(event) =>
                          setTempReferenceDate(
                            event.target.value,
                          )
                        }
                        placeholder="Reference Date"
                        className="h-[38px] w-full rounded-md border border-slate-300 bg-white px-3 text-[12px] text-slate-700 outline-none focus:border-slate-500"
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-500">
                        ▣
                      </span>
                    </div>
                  </div>

                </div>

                {/* DIVIDER */}
                <div className="my-4 border-t border-slate-200" />

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={cancelReference}
                    className="rounded-md border border-slate-800 bg-white px-5 py-1.5 text-[13px] font-medium text-slate-900 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveReference}
                    className="rounded-md bg-[#050505] px-5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save
                  </button>

                </div>

              </div>
            </div>
          )}

          {/* =================================================
              ITEMS TABLE
          ================================================= */}
          <div className="mt-4 overflow-hidden border border-slate-300 bg-white">

            {/* TABLE HEADER */}
            <div className="grid min-w-[1080px] grid-cols-[1.4fr_0.55fr_0.55fr_0.7fr_0.55fr_0.95fr_0.95fr_1.1fr_0.7fr_0.55fr_0.32fr]">

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
                  className="flex h-[34px] items-center border-r border-slate-300 bg-[#dfe3e6] px-2 text-[11px] font-semibold text-slate-900 last:border-r-0"
                >
                  {heading}

                  {index === 10 && (
                    <button
                      type="button"
                      onClick={addRow}
                      title="Add item"
                      className="ml-auto flex h-[20px] w-[20px] items-center justify-center rounded bg-[#494d50] text-[16px] font-bold leading-none text-white transition hover:bg-black"
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
                className="grid min-w-[1080px] grid-cols-[1.4fr_0.55fr_0.55fr_0.7fr_0.55fr_0.95fr_0.95fr_1.1fr_0.7fr_0.55fr_0.32fr]"
              >

                {/* ITEM */}
                <div className="border-r border-t border-slate-300 p-1">
                  <div className="relative">
                    <input
                      list={`item-list-${row.id}`}
                      value={row.item}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'item',
                          event.target.value,
                        )
                      }
                      placeholder="Search Item"
                      className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-8 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <datalist id={`item-list-${row.id}`}>
                      <option value="PVC 1 inch Pipe" />
                      <option value="PVC 3/4 inch Pipe" />
                      <option value="Water Tap" />
                      <option value="Paint Primer" />
                    </datalist>

                    <SearchIcon />
                  </div>
                </div>

                {/* QTY */}
                <div className="border-r border-t border-slate-300 p-1">
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'qty',
                        event.target.value,
                      )
                    }
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
                  />
                </div>

                {/* RATE */}
                <div className="border-r border-t border-slate-300 p-1">
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'rate',
                        event.target.value,
                      )
                    }
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
                  />
                </div>

                {/* UNITS */}
                <div className="border-r border-t border-slate-300 p-1">
                  <select
                    value={row.units}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'units',
                        event.target.value,
                      )
                    }
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
                  >
                    <option value="">
                      -
                    </option>

                    <option value="PCS">
                      PCS
                    </option>

                    <option value="KG">
                      KG
                    </option>

                    <option value="LTR">
                      LTR
                    </option>

                    <option value="BOX">
                      BOX
                    </option>

                    <option value="MTR">
                      MTR
                    </option>
                  </select>
                </div>

                {/* DISCOUNT */}
                <div className="border-r border-t border-slate-300 p-1">
                  <input
                    type="number"
                    value={row.discount}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'discount',
                        event.target.value,
                      )
                    }
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
                  />
                </div>

                {/* HSN */}
                <div className="border-r border-t border-slate-300 p-1">
                  <div className="relative">

                    <input
                      list={`hsn-list-${row.id}`}
                      value={row.hsn}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'hsn',
                          event.target.value,
                        )
                      }
                      placeholder="Search HSN"
                      className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-7 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <datalist id={`hsn-list-${row.id}`}>
                      <option value="3917" />
                      <option value="3926" />
                      <option value="7307" />
                      <option value="PVC001" />
                    </datalist>

                    <SearchIcon />

                  </div>
                </div>

                {/* GODOWN */}
                <div className="border-r border-t border-slate-300 p-1">
                  <div className="relative">

                    <input
                      list={`godown-list-${row.id}`}
                      value={row.godown}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'godown',
                          event.target.value,
                        )
                      }
                      placeholder="Search Godown"
                      className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 pr-7 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                    />

                    <datalist id={`godown-list-${row.id}`}>
                      <option value="Main Godown" />
                      <option value="Delhi Godown" />
                      <option value="Warehouse 1" />
                    </datalist>

                    <SearchIcon />

                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="border-r border-t border-slate-300 p-1">
                  <input
                    value={row.description}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'description',
                        event.target.value,
                      )
                    }
                    placeholder="Enter Notes"
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                  />
                </div>

                {/* AMOUNT */}
                <div className="border-r border-t border-slate-300 p-1">
                  <input
                    value={row.amount}
                    onChange={(event) =>
                      updateRow(
                        row.id,
                        'amount',
                        event.target.value,
                      )
                    }
                    className="h-[31px] w-full rounded-sm border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
                  />
                </div>

                {/* TAX INCLUSIVE */}
                <div className="border-r border-t border-slate-300 p-1">
                  <label className="flex h-[31px] items-center justify-center">
                    <input
                      type="checkbox"
                      checked={row.taxInclusive}
                      onChange={(event) =>
                        updateRow(
                          row.id,
                          'taxInclusive',
                          event.target.checked,
                        )
                      }
                      className="h-3.5 w-3.5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                  </label>
                </div>

                {/* DELETE */}
                <div className="border-t border-slate-300 p-1">
                  <button
                    type="button"
                    onClick={() =>
                      removeRow(row.id)
                    }
                    title="Delete item"
                    className="flex h-[31px] w-full items-center justify-center rounded-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* =================================================
              LOWER CONTENT
          ================================================= */}
          <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-2">

            {/* =================================================
                LEFT
            ================================================= */}
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
                  className="flex h-[42px] w-full items-center justify-between px-4 text-left text-[13px] font-semibold text-slate-800"
                >
                  <span>
                    Narration
                  </span>

                  <span className="text-[20px]">
                    {openSection === 'Narration'
                      ? '⌄'
                      : '›'}
                  </span>
                </button>

                {openSection === 'Narration' && (
                  <div className="border-t border-slate-200 p-3">
                    <textarea
                      rows={3}
                      placeholder="Enter narration"
                      className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-[11px] outline-none focus:border-green-500"
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
                  className="flex h-[42px] w-full items-center justify-between px-4 text-left text-[13px] font-semibold text-slate-800"
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
                    <div className="flex items-center overflow-x-auto border-b border-slate-200 px-3">

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
                          className={`relative whitespace-nowrap px-4 py-3 text-[11px] ${
                            activeAdvancedTab === tab
                              ? 'font-medium text-[#008cff]'
                              : 'text-slate-600'
                          }`}
                        >
                          {tab}

                          {activeAdvancedTab === tab && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#008cff]" />
                          )}
                        </button>
                      ))}

                    </div>

                    {/* BUYER DETAILS */}
                    {activeAdvancedTab === "Buyer's Details" && (
                      <div className="grid grid-cols-3 gap-2 p-3">

                        {/* BUYER NAME */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Buyer's Name
                          </label>

                          <div className="relative">

                            <input
                              placeholder="Buyer's Name"
                              className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />

                          </div>
                        </div>

                        {/* COUNTRY */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Buyer's Country
                          </label>

                          <div className="relative">

                            <input
                              placeholder="Buyer's Country"
                              className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />

                          </div>
                        </div>

                        {/* STATE */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Buyer's State
                          </label>

                          <div className="relative">

                            <input
                              placeholder="Buyer's State"
                              className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />

                          </div>
                        </div>

                        {/* REGISTRATION */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Registration Type
                          </label>

                          <select
                            defaultValue=""
                            className="h-[35px] w-full rounded-md border border-slate-300 bg-white px-2.5 text-[11px] outline-none focus:border-green-500"
                          >
                            <option value="">
                              Registration Type
                            </option>

                            <option value="Regular">
                              Regular
                            </option>

                            <option value="Composition">
                              Composition
                            </option>

                            <option value="Unregistered">
                              Unregistered
                            </option>
                          </select>
                        </div>

                        {/* POSTAL CODE */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Postal Code
                          </label>

                          <input
                            placeholder="Postal Code"
                            className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* GSTIN */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            GSTIN/UIN
                          </label>

                          <input
                            placeholder="GSTIN/UIN"
                            className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* PLACE OF SUPPLY */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Place of Supply
                          </label>

                          <div className="relative">

                            <input
                              placeholder="Place of Supply"
                              className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 pr-8 text-[11px] outline-none focus:border-green-500"
                            />

                            <SearchIcon />

                          </div>
                        </div>

                        {/* BILL TO */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Bill to Place
                          </label>

                          <input
                            placeholder="Bill to Place"
                            className="h-[35px] w-full rounded-md border border-slate-300 px-2.5 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                        {/* ADDRESS */}
                        <div className="relative">
                          <label className="absolute left-2.5 top-[-7px] z-10 bg-white px-1 text-[10px] text-slate-600">
                            Address
                          </label>

                          <textarea
                            rows={2}
                            placeholder="Address"
                            className="w-full resize-none rounded-md border border-slate-300 px-2.5 py-2 text-[11px] outline-none focus:border-green-500"
                          />
                        </div>

                      </div>
                    )}

                    {/* CONSIGNEE */}
                    {activeAdvancedTab === 'Consignee Details' && (
                      <div className="grid grid-cols-3 gap-2 p-3">

                        <input
                          placeholder="Consignee Name"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Consignee Address"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Consignee GSTIN"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                      </div>
                    )}

                    {/* DISPATCH */}
                    {activeAdvancedTab === 'Dispatch Details' && (
                      <div className="grid grid-cols-3 gap-2 p-3">

                        <input
                          placeholder="Dispatch From"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Dispatch Address"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Transporter"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                      </div>
                    )}

                    {/* ORDER */}
                    {activeAdvancedTab === 'Order Details' && (
                      <div className="grid grid-cols-3 gap-2 p-3">

                        <input
                          placeholder="Order No"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          type="date"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Terms of Delivery"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                      </div>
                    )}

                    {/* E-WAY */}
                    {activeAdvancedTab === 'e-Way Bills' && (
                      <div className="grid grid-cols-3 gap-2 p-3">

                        <input
                          placeholder="Transport Mode"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Vehicle Number"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                        <input
                          placeholder="Distance (KM)"
                          className="h-[35px] rounded-md border border-slate-300 px-3 text-[11px] outline-none"
                        />

                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                RIGHT TOTAL PANEL
            ================================================= */}
            <div className="self-start overflow-hidden rounded-md border border-slate-200 bg-white">

              {/* ADD GST */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    'GST and other ledger panel opened',
                  )
                }
                className="flex h-[45px] w-full items-center border-b border-slate-200 px-4 text-left text-[13px] font-semibold text-[#4f94ff] hover:bg-slate-50"
              >
                + Add GST And Other Ledgers
              </button>

              {/* TOTALS */}
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

                  <div className="flex items-center justify-between text-[16px] font-bold text-slate-900">

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
            BOTTOM BUTTONS
        ===================================================== */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-2">

          

          <button
            type="button"
            onClick={handleCreateVoucher}
            className="rounded-md bg-[#171a1d] px-5 py-2.5 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:bg-black"
          >
            Create Voucher
          </button>

        </div>

      </div>
    </div>
  )
}

export default SalesOrderPage