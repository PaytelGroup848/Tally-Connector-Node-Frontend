import { useEffect, useRef, useState } from 'react'
import { SearchableDropdown } from './DocumentVoucherPage'
import useAuthStore from '../store/authStore'
import {
  extractGodowns,
  extractStockItems,
  postCompanyCommand,
  fetchCompanyGodowns,
  fetchCompanyStock,
} from '../services/companiesApi'

const getDisplayValue = (entry, keys) => {
  if (typeof entry === 'string') return entry

  for (const key of keys) {
    if (entry?.[key] !== undefined && entry?.[key] !== null) {
      const value = String(entry[key]).trim()
      if (value) return value
    }
  }

  return ''
}

const getRow = (id) => ({
  id,
  item: '',
  qty: '',
  godown: '',
  batch: '',
  mfgDate: '',
  expDate: '',
  amount: '',
})

function PhysicalStockPage({ companyId }) {
  const [rows, setRows] = useState([
    getRow(1),
  ])

  const [message, setMessage] = useState('')
  const [stockItems, setStockItems] = useState([])
  const [godowns, setGodowns] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [optionsError, setOptionsError] = useState('')
  const [voucherNumber, setVoucherNumber] = useState('')
  const [voucherDate, setVoucherDate] = useState('2026-08-27')
  const [narration, setNarration] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const successTimerRef = useRef(null)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => () => {
    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!companyId || !accessToken) {
      setStockItems([])
      setGodowns([])
      return undefined
    }

    let mounted = true
    setOptionsLoading(true)
    setOptionsError('')

    Promise.allSettled([
      fetchCompanyStock(accessToken, companyId, { page: 1, limit: 100 }),
      fetchCompanyGodowns(accessToken, companyId, { page: 1, limit: 100 }),
    ])
      .then(([stockResult, godownsResult]) => {
        if (!mounted) return

        if (stockResult.status === 'fulfilled') {
          setStockItems(extractStockItems(stockResult.value))
        } else {
          setStockItems([])
          setOptionsError(stockResult.reason?.message || 'Unable to load stock items.')
        }

        if (godownsResult.status === 'fulfilled') {
          setGodowns(extractGodowns(godownsResult.value))
        } else {
          setGodowns([])
          setOptionsError((current) => current || godownsResult.reason?.message || 'Unable to load godowns.')
        }
      })
      .finally(() => {
        if (mounted) setOptionsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId])

  const itemOptions = stockItems
    .map((item) => getDisplayValue(item, [
      'itemName',
      'item_name',
      'stockName',
      'stock_name',
      'stockItemName',
      'stock_item_name',
      'item',
      'name',
      'displayName',
    ]))
    .filter((value, index, values) => value && values.indexOf(value) === index)

  const godownOptions = godowns
    .map((godown) => getDisplayValue(godown, [
      'godownName',
      'godown_name',
      'name',
      'warehouse',
      'location',
      'displayName',
    ]))
    .filter((value, index, values) => value && values.indexOf(value) === index)

  // ============================================================
  // ADD ITEM
  // ============================================================

  const addItem = () => {
    setRows((current) => [
      ...current,
      getRow(Date.now()),
    ])
  }

  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeItem = (id) => {
    setRows((current) =>
      current.filter((row) => row.id !== id)
    )
  }

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (
      row.id === id ? { ...row, [field]: value } : row
    )))
  }

  // ============================================================
  // CREATE VOUCHER
  // ============================================================

  const createVoucher = async () => {
    if (!companyId || !accessToken) {
      setOptionsError('Select a company and sign in before creating a voucher.')
      return
    }

    if (!voucherNumber.trim()) {
      setOptionsError('Enter a voucher number.')
      return
    }

    if (!voucherDate || Number.isNaN(Date.parse(voucherDate))) {
      setOptionsError('Enter a valid voucher date.')
      return
    }

    const invalidRow = rows.find((row) => {
      const quantity = Number(row.qty)
      const amount = Number(row.amount || 0)
      return !row.item.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(amount) || amount < 0
    })

    if (invalidRow) {
      setOptionsError('Complete each item with an item name, quantity greater than 0, and a valid amount.')
      return
    }

    const command = {
      type: 'CREATE_VOUCHER',
      payload: {
        voucherType: 'Physical Stock',
        voucherNumber,
        date: voucherDate,
        items: rows.map((row) => ({
          itemName: row.item || '',
          quantity: Number(row.qty) || 0,
          godown: row.godown || '',
          batchNo: row.batch || '',
          manufacturingDate: row.mfgDate || '',
          expiryDate: row.expDate || '',
          amount: Number(row.amount) || 0,
        })),
        narration,
      },
    }

    setIsSubmitting(true)
    setOptionsError('')
    setShowSuccessAnimation(false)

    try {
      await postCompanyCommand(accessToken, companyId, command)
      setMessage('Physical Stock Voucher created successfully.')
      setTimeout(() => setMessage(''), 3000)
      setShowSuccessAnimation(true)
      successTimerRef.current = window.setTimeout(() => {
        setShowSuccessAnimation(false)
      }, 1600)
    } catch (error) {
      setOptionsError(error?.message || 'Unable to create Physical Stock Voucher.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="voucher-page-animate relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      {(optionsLoading || isSubmitting || showSuccessAnimation) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/15 backdrop-blur-[1px]">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white/90 px-6 py-5 shadow-xl">
            <div
              className={`h-10 w-10 rounded-full border-4 border-slate-200 ${
                showSuccessAnimation
                  ? 'border-t-green-600 animate-spin'
                  : 'border-t-[#1a1f24] animate-spin'
              }`}
              aria-hidden="true"
            />
            <span className="mt-3 text-sm font-semibold text-slate-700">
              {optionsLoading
                ? 'Loading ...'
                : isSubmitting
                  ? 'Creating voucher...'
                  : 'Voucher created successfully!'}
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">
          <h1 className="leading-none">
            Create Physical Stock Voucher
          </h1>
        </div>

        {/* ================================================== */}
        {/* CONTENT */}
        {/* ================================================== */}

        <div className="bg-[#f5f7f4] p-5">

          {/* ================================================= */}
          {/* TOP FIELDS */}
          {/* ================================================= */}

          <div className="grid gap-3 md:grid-cols-3">

            {/* VOUCHER TYPE */}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>

              <div className="relative">
                <input
                  value="Physical Stock"
                  readOnly
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  ×
                </span>
              </div>
            </label>

            {/* VOUCHER NUMBER */}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>

              <input
                value={voucherNumber}
                required
                onChange={(event) => setVoucherNumber(event.target.value)}
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
              />
            </label>

            {/* DATE */}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>

              <div className="relative">
                <input
                  type="date"
                  value={voucherDate}
                  required
                  onChange={(event) => setVoucherDate(event.target.value)}
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none"
                />

               
              </div>
            </label>

          </div>

          {/* ================================================= */}
          {/* ITEMS TABLE */}
          {/* ================================================= */}

          <div className="mt-5 overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-white">

            {/* TABLE HEADER */}

            <div className="grid min-w-[1000px] grid-cols-[1.3fr_0.5fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.4fr] gap-1 bg-slate-100 p-1.5 text-[10px] font-semibold text-slate-700">

              <span>Items</span>

              <span>Qty</span>

              <span>Godown</span>

              <span>Batch No.</span>

              <span>Mfg. Date</span>

              <span>Exp. Date</span>

              <span>Amount</span>

              <button
                type="button"
                onClick={addItem}
                className="
                  inline-flex
                  items-center
                  gap-1
                  justify-self-end
                  rounded-md
                  bg-green-600
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                "
              >
                <span className="text-sm leading-none">+</span>
                Add Item
              </button>

            </div>

            {/* ================================================= */}
            {/* TABLE ROWS */}
            {/* ================================================= */}

            {rows.map((row) => (
              <div
                key={row.id}
                className="
                  grid
                  min-w-[1000px]
                  grid-cols-[1.3fr_0.5fr_0.8fr_0.8fr_0.7fr_0.7fr_0.7fr_0.4fr]
                  items-center
                  gap-1
                  border-t
                  border-slate-200
                  bg-white
                  p-1.5
                "
              >

                {/* ITEM */}

                <SearchableDropdown
                  name={`physicalStockItem-${row.id}`}
                  label="items"
                  options={itemOptions}
                  loading={optionsLoading}
                  value={row.item}
                  onSelect={(value) => updateRow(row.id, 'item', value)}
                  onClear={() => updateRow(row.id, 'item', '')}
                  placeholder="Search Item"
                />

                {/* QTY */}

                <input
                  type="number"
                  min="0"
                  value={row.qty}
                  onChange={(event) => updateRow(row.id, 'qty', event.target.value)}
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-300
                    bg-white
                    px-2
                    text-xs
                    text-slate-700
                    outline-none
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                  "
                  placeholder="0"
                />

                {/* GODOWN */}

                <SearchableDropdown
                  name={`physicalStockGodown-${row.id}`}
                  label="godowns"
                  options={godownOptions}
                  loading={optionsLoading}
                  value={row.godown}
                  onSelect={(value) => updateRow(row.id, 'godown', value)}
                  onClear={() => updateRow(row.id, 'godown', '')}
                  placeholder="Select"
                />

                {/* BATCH */}

                <input
                  value={row.batch}
                  onChange={(event) => updateRow(row.id, 'batch', event.target.value)}
                  placeholder="0"
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-300
                    bg-white
                    px-2
                    text-xs
                    text-slate-700
                    outline-none
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                {/* MFG DATE */}

                <input
                  type="date"
                  value={row.mfgDate}
                  onChange={(event) => updateRow(row.id, 'mfgDate', event.target.value)}
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-300
                    bg-white
                    px-2
                    text-xs
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                  "
                  placeholder="Mfg.Date"
                />

                {/* EXP DATE */}

                <input
                  type="date"
                  value={row.expDate}
                  onChange={(event) => updateRow(row.id, 'expDate', event.target.value)}
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-300
                    bg-white
                    px-2
                    text-xs
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                  "
                  placeholder="Exp.Date"
                />

                {/* AMOUNT */}

                <input
                  value={row.amount}
                  onChange={(event) => updateRow(row.id, 'amount', event.target.value)}
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-300
                    bg-white
                    px-2
                    text-xs
                    text-slate-700
                    outline-none
                    placeholder:text-slate-400
                    focus:border-green-600
                    focus:ring-2
                    focus:ring-green-100
                  "
                  placeholder="0"
                />

                {/* DELETE */}

                <button
                  type="button"
                  onClick={() => removeItem(row.id)}
                  className="
                    min-h-9
                    rounded-md
                    border
                    border-slate-200
                    bg-slate-100
                    text-lg
                    text-slate-500
                    transition
                    hover:bg-red-50
                    hover:text-red-500
                  "
                  aria-label="Remove item"
                >
                  ✕
                </button>

              </div>
            ))}

          </div>

          {/* ================================================= */}
          {/* TOTAL */}
          {/* ================================================= */}

          {optionsError && (
            <p className="mt-2 text-xs text-red-600">{optionsError}</p>
          )}

          <div className="mt-5 rounded-lg border border-slate-200 bg-[#e8f7ea] px-4 py-3 text-[12px] text-slate-700">

            <div className="flex items-center justify-between gap-4">

              <div className="font-semibold">
                TOTAL
              </div>

              <div className="flex gap-8 text-right">
                <span>
                  Qty: 0
                </span>

                <span>
                  Amount: ₹0
                </span>
              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* NARRATION */}
          {/* ================================================= */}

          <div className="mt-5 flex items-center gap-3 text-[12px] text-slate-700">

            <span className="font-semibold">
              Narration:
            </span>

            <input
              value={narration}
              onChange={(event) => setNarration(event.target.value)}
              className="
                h-10
                flex-1
                rounded-md
                border
                border-slate-300
                bg-white
                px-3
                text-sm
                text-slate-700
                outline-none
                focus:border-green-600
                focus:ring-2
                focus:ring-green-100
              "
              placeholder=""
            />

          </div>

        </div>

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">

          <button
            type="button"
            onClick={createVoucher}
            disabled={isSubmitting}
            className="
              rounded-lg
              bg-[#1a1f24]
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-[0_10px_20px_rgba(24,33,43,0.2)]
              transition
              hover:bg-[#2a3036]
              active:scale-[0.98]
            "
          >
            {isSubmitting ? 'Creating...' : 'Create Voucher'}
          </button>

        </div>

      </div>

      {/* ================================================== */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================== */}

      {/* {message && (
        <div
          className="
            fixed
            bottom-5
            right-5
            z-50
            rounded-lg
            bg-green-600
            px-5
            py-3
            text-sm
            font-medium
            text-white
            shadow-lg
          "
        >
          {message}
        </div>
      )} */}

    </div>
  )
}

export default PhysicalStockPage