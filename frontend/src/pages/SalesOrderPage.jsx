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
    <div className="min-h-screen bg-[#eef3f8] p-5">

      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-5 rounded-t-lg bg-green-600 px-5 py-4">
          <h1 className="text-lg font-bold text-white">
            Create Sales Order Voucher
          </h1>
        </div>

        {/* =====================================================
            BODY
        ===================================================== */}
        <div className="rounded-b-lg bg-white shadow-sm p-5">

          {/* =================================================
              TOP FORM
          ================================================= */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">

            {/* VOUCHER TYPE */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700">Voucher Type</span>
              <select
                value={voucherType}
                onChange={(event) => setVoucherType(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="Select Voucher Type">Select Voucher Type</option>
                <option value="Sales">Sales</option>
                <option value="Sales Order">Sales Order</option>
                <option value="Quotation">Quotation</option>
              </select>
            </label>

            {/* PARTY NAME */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700">Party Name</span>
              <div className="relative">
                <input
                  list="party-list"
                  value={partyName}
                  onChange={(event) => setPartyName(event.target.value)}
                  placeholder="Select Party"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
            </label>

            {/* LEDGER TYPE */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700">Ledger Type</span>
              <select
                value={ledgerType}
                onChange={(event) => setLedgerType(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Select Ledger</option>
                <option value="Sales Account">Sales Account</option>
                <option value="Sales Order">Sales Order</option>
                <option value="Service Income">Service Income</option>
              </select>
            </label>

            {/* VOUCHER NO */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700">Voucher No</span>
              <div className="relative">
                <input
                  value={voucherNo}
                  onChange={(event) => setVoucherNo(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
                <button
                  type="button"
                  title="Edit reference details"
                  onClick={openReferencePopup}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  ✎
                </button>
              </div>
            </label>

            {/* DATE */}
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-700">Date</span>
              <div className="relative">
                <CalendarIcon />
                <input
                  type="date"
                  value={voucherDate}
                  onChange={(event) => setVoucherDate(event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pl-9 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </label>

          </div>

          {/* =================================================
              REFERENCE POPUP
          ================================================= */}
          {showReferencePopup && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-5">

                <h2 className="mb-4 text-sm font-semibold text-slate-900">Reference Details</h2>

                {/* FIELDS */}
                <div className="space-y-3 mb-4">

                  {/* REFERENCE NUMBER */}
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-700">Reference Number</span>
                    <input
                      type="text"
                      value={tempReferenceNumber}
                      onChange={(event) => setTempReferenceNumber(event.target.value)}
                      placeholder="Reference Number"
                      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  {/* REFERENCE DATE */}
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-700">Reference Date</span>
                    <div className="relative">
                      <input
                        type="date"
                        value={tempReferenceDate}
                        onChange={(event) => setTempReferenceDate(event.target.value)}
                        className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </label>

                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={cancelReference}
                    className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveReference}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
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
          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-12 gap-1 bg-slate-100 p-2 text-xs font-semibold text-slate-600">
              <div className="col-span-2">Items</div>
              <div>Qty</div>
              <div>Rate</div>
              <div>Units</div>
              <div>Disc %</div>
              <div>HSN</div>
              <div>Godown</div>
              <div className="col-span-2">Description</div>
              <div>Amount</div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <button
                  type="button"
                  onClick={addRow}
                  title="Add item"
                  className="ml-auto flex h-6 w-6 items-center justify-center rounded bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* TABLE ROWS */}
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-1 border-t border-slate-200 p-2 hover:bg-slate-50"
              >

                {/* ITEM */}
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      list={`item-list-${row.id}`}
                      value={row.item}
                      onChange={(event) => updateRow(row.id, 'item', event.target.value)}
                      placeholder="Search Item"
                      className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                    />
                    <datalist id={`item-list-${row.id}`}>
                      <option value="PVC 1 inch Pipe" />
                      <option value="PVC 3/4 inch Pipe" />
                      <option value="Water Tap" />
                      <option value="Paint Primer" />
                    </datalist>
                  </div>
                </div>

                {/* QTY */}
                <div>
                  <input
                    type="number"
                    value={row.qty}
                    onChange={(event) => updateRow(row.id, 'qty', event.target.value)}
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                </div>

                {/* RATE */}
                <div>
                  <input
                    type="number"
                    value={row.rate}
                    onChange={(event) => updateRow(row.id, 'rate', event.target.value)}
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                </div>

                {/* UNITS */}
                <div>
                  <select
                    value={row.units}
                    onChange={(event) => updateRow(row.id, 'units', event.target.value)}
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  >
                    <option value="">-</option>
                    <option value="PCS">PCS</option>
                    <option value="KG">KG</option>
                    <option value="LTR">LTR</option>
                    <option value="BOX">BOX</option>
                    <option value="MTR">MTR</option>
                  </select>
                </div>

                {/* DISCOUNT */}
                <div>
                  <input
                    type="number"
                    value={row.discount}
                    onChange={(event) => updateRow(row.id, 'discount', event.target.value)}
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                </div>

                {/* HSN */}
                <div>
                  <input
                    list={`hsn-list-${row.id}`}
                    value={row.hsn}
                    onChange={(event) => updateRow(row.id, 'hsn', event.target.value)}
                    placeholder="HSN"
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                  <datalist id={`hsn-list-${row.id}`}>
                    <option value="3917" />
                    <option value="3926" />
                    <option value="7307" />
                  </datalist>
                </div>

                {/* GODOWN */}
                <div>
                  <input
                    list={`godown-list-${row.id}`}
                    value={row.godown}
                    onChange={(event) => updateRow(row.id, 'godown', event.target.value)}
                    placeholder="Godown"
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                  <datalist id={`godown-list-${row.id}`}>
                    <option value="Main Godown" />
                    <option value="Delhi Godown" />
                    <option value="Warehouse 1" />
                  </datalist>
                </div>

                {/* DESCRIPTION */}
                <div className="col-span-2">
                  <input
                    value={row.description}
                    onChange={(event) => updateRow(row.id, 'description', event.target.value)}
                    placeholder="Notes"
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                </div>

                {/* AMOUNT */}
                <div>
                  <input
                    value={row.amount}
                    onChange={(event) => updateRow(row.id, 'amount', event.target.value)}
                    className="h-8 w-full rounded border border-slate-300 bg-white px-2 text-xs outline-none focus:border-green-600"
                  />
                </div>

                {/* TAX + DELETE */}
                <div className="flex items-center justify-between gap-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={row.taxInclusive}
                      onChange={(event) => updateRow(row.id, 'taxInclusive', event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-green-600"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    title="Delete item"
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* =================================================
              LOWER CONTENT
          ================================================= */}
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_300px]">

            {/* =================================================
                LEFT
            ================================================= */}
            <div>

              {/* NARRATION */}
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'Narration' ? null : 'Narration')}
                  className="flex h-12 w-full items-center justify-between px-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <span>Narration</span>
                  <span>{openSection === 'Narration' ? '⌄' : '›'}</span>
                </button>

                {openSection === 'Narration' && (
                  <div className="border-t border-slate-200 p-4">
                    <textarea
                      rows={3}
                      placeholder="Enter narration"
                      className="w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                )}

              </div>

              {/* ADVANCED SETTINGS */}
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">

                <button
                  type="button"
                  onClick={() => setOpenSection(openSection === 'Advanced Settings' ? null : 'Advanced Settings')}
                  className="flex h-12 w-full items-center justify-between px-4 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  <span>Advanced Settings</span>
                  <span>{openSection === 'Advanced Settings' ? '⌄' : '›'}</span>
                </button>

                {openSection === 'Advanced Settings' && (
                  <div className="border-t border-slate-200">

                    {/* TABS */}
                    <div className="flex items-center overflow-x-auto border-b border-slate-200">

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
                          onClick={() => setActiveAdvancedTab(tab)}
                          className={`relative whitespace-nowrap px-4 py-3 text-xs ${
                            activeAdvancedTab === tab
                              ? 'font-medium text-green-600 border-b-2 border-green-600'
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}

                    </div>

                    {/* TAB CONTENT */}
                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3">

                      {activeAdvancedTab === "Buyer's Details" && (
                        <>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">Buyer's Name</span>
                            <input placeholder="Buyer's Name" className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">Country</span>
                            <input placeholder="Country" className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">State</span>
                            <input placeholder="State" className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">Registration Type</span>
                            <select className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600">
                              <option value="">Select</option>
                              <option value="Regular">Regular</option>
                              <option value="Composition">Composition</option>
                              <option value="Unregistered">Unregistered</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">Postal Code</span>
                            <input placeholder="Postal Code" className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-slate-700">GSTIN/UIN</span>
                            <input placeholder="GSTIN/UIN" className="h-9 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          </label>
                        </>
                      )}

                      {activeAdvancedTab === 'Consignee Details' && (
                        <>
                          <input placeholder="Consignee Name" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Consignee Address" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Consignee GSTIN" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                        </>
                      )}

                      {activeAdvancedTab === 'Dispatch Details' && (
                        <>
                          <input placeholder="Dispatch From" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Dispatch Address" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Transporter" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                        </>
                      )}

                      {activeAdvancedTab === 'Order Details' && (
                        <>
                          <input placeholder="Order No" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input type="date" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Terms of Delivery" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                        </>
                      )}

                      {activeAdvancedTab === 'e-Way Bills' && (
                        <>
                          <input placeholder="Transport Mode" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Vehicle Number" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                          <input placeholder="Distance (KM)" className="h-9 rounded border border-slate-300 px-3 text-sm outline-none focus:border-green-600" />
                        </>
                      )}

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                RIGHT TOTAL PANEL
            ================================================= */}
            <div className="h-fit overflow-hidden rounded-lg border border-slate-200 bg-white">

              {/* ADD GST */}
              <button
                type="button"
                onClick={() => alert('GST and other ledger panel opened')}
                className="flex h-12 w-full items-center border-b border-slate-200 px-4 text-left text-sm font-semibold text-green-600 hover:bg-slate-50"
              >
                + Add GST And Other Ledgers
              </button>

              {/* TOTALS */}
              <div className="space-y-3 bg-green-50 px-4 py-4 text-sm">

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Sub Total</span>
                  <b className="text-slate-900">₹0</b>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-700">Taxes</span>
                  <b className="text-slate-900">₹0</b>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-900 font-bold">Grand Total</span>
                  <b className="text-lg text-green-600">₹0</b>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            BOTTOM CREATE BUTTON
        ===================================================== */}
        <button
          type="button"
          onClick={handleCreateVoucher}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-green-700 md:bottom-6 md:right-6"
        >
          ✓ Create Sales Order
        </button>

      </div>
    </div>
  )
}

export default SalesOrderPage