import { useEffect, useRef, useState } from 'react'
import { GstLedgerPanel, SearchableDropdown } from './DocumentVoucherPage'
import useAuthStore from '../store/authStore'
import {
  extractGodowns,
  extractLedgers,
  extractStockItems,
  extractVouchers,
  postCompanyCommand,
  fetchCompanyGodowns,
  fetchCompanyLedgers,
  fetchCompanyStock,
  fetchCompanyVouchers,
} from '../services/companiesApi'
import { extractCustomers, fetchCustomers } from '../services/customersApi'

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

const getStockField = (entry, keys) => {
  const candidates = [
    entry,
    entry?.data,
    entry?.payload,
    entry?.item,
  ]

  const normalizedKeys = keys.map((key) =>
    key.toLowerCase().replace(/[^a-z0-9]/g, '')
  )

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue

    const matchingKey = Object.keys(candidate).find((key) =>
      normalizedKeys.includes(
        key.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    )

    if (
      matchingKey &&
      candidate[matchingKey] !== null &&
      candidate[matchingKey] !== undefined
    ) {
      return String(candidate[matchingKey]).trim()
    }
  }

  return ''
}

/* ============================================================
   AMOUNT / DISCOUNT / GST CALCULATION
============================================================ */

const calculateRow = (row) => {
  const quantity = Number(row.quantity) || 0
  const rate = Number(row.rate) || 0

  // Keep discount between 0 and 100
  const discount = Math.min(
    Math.max(Number(row.discount) || 0, 0),
    100
  )

  // Original amount before discount
  const grossAmount = quantity * rate

  // Discount amount
  const discountAmount = grossAmount * (discount / 100)

  // Amount after discount
  const taxableAmount = grossAmount - discountAmount

  // Add 18% only when Tax Incl. checkbox is checked
  const gstRate = row.taxInclusive ? 18 : 0

  const gstAmount = taxableAmount * (gstRate / 100)

  // Final amount after GST
  const totalAmount = taxableAmount + gstAmount

  return {
    quantity,
    rate,
    discount,
    grossAmount,
    discountAmount,
    taxableAmount,
    gstRate,
    gstAmount,
    totalAmount,
  }
}

const amountFor = (row) => {
  return calculateRow(row).totalAmount
}

/* ============================================================
   ITEM ROW
============================================================ */

const createItemRow = (id) => ({
  id,
  item: '',
  quantity: '0',
  rate: '0',
  units: '',
  discount: '0',
  hsnCode: '',
  godown: '',
  description: '',
  amount: '0',
  taxInclusive: false,
})

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  placeholder,
  value,
  type = 'text',
  readOnly = false,
  search = false,
  icon = null,
  className = '',
  onChange,
}) {
  return (
    <label className={`relative block min-w-0 ${className}`}>
      <span className="absolute -top-[7px] left-3 z-10 bg-[#eef3f8] px-1.5 text-[12px] leading-none text-[#1f4264]">
        {label}
      </span>

      <div className="relative">
        <input
          type={type}
          value={value ?? ''}
          readOnly={readOnly}
          required={!readOnly}
          onChange={onChange}
          placeholder={placeholder}
          className="
            h-[39px]
            w-full
            rounded-[6px]
            border
            border-[#cbd5df]
            bg-white
            px-3
            ${type === 'date' ? 'pr-10' : 'pr-9'}
            text-[13px]
            text-[#1f2937]
            outline-none
            placeholder:text-[#8d98a5]
            focus:border-[#4dbb45]
            focus:ring-1
            focus:ring-[#d8f1d5]
          "
        />
      </div>
    </label>
  )
}

/* ============================================================
   TABLE INPUT
============================================================ */

function TableInput({
  placeholder,
  value,
  readOnly = false,
  search = false,
  onChange,
}) {
  return (
    <div className="relative w-full">
      <input
        value={value ?? ''}
        readOnly={readOnly}
          required={!readOnly}
        onChange={onChange}
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
    </div>
  )
}

/* ============================================================
   ITEMS TABLE
============================================================ */

function ItemsTable({
  rows,
  setRows,
  stockItems,
  itemOptions,
  godownOptions,
  optionsLoading,
}) {
  const addRow = () => {
    setRows((current) => [
      ...current,
      createItemRow(Date.now()),
    ])
  }

  const removeRow = (id) => {
    setRows((current) =>
      current.filter((row) => row.id !== id)
    )
  }

  const updateRow = (id, field, value) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    )
  }

  const selectItem = (rowId, itemName) => {
    const matchingItem = stockItems.find(
      (item) =>
        getStockField(item, [
          'itemName',
          'item_name',
          'stockName',
          'stock_name',
          'stockItemName',
          'stock_item_name',
          'item',
          'name',
          'displayName',
        ]).toLowerCase() === itemName.toLowerCase()
    )

    setRows((current) =>
      current.map((row) =>
        row.id === rowId
          ? {
              ...row,
              item: itemName,

              rate: getStockField(matchingItem, [
                'rate',
                'salesRate',
                'sellingRate',
                'price',
                'mrp',
                'avgPurRate',
                'purchaseRate',
              ]),

              units: getStockField(matchingItem, [
                'units',
                'unit',
                'unitName',
                'unit_name',
                'uom',
                'stockUnit',
                'stock_unit',
                'itemUnit',
                'item_unit',
                'measure',
              ]),

              hsnCode: getStockField(matchingItem, [
                'hsnCode',
                'hsn_code',
                'hsn',
                'hsnCodeValue',
                'hsn_code_value',
                'itemHsn',
                'item_hsn',
              ]),
            }
          : row
      )
    )
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <div className="min-w-[1080px] overflow-hidden border border-[#d0d7de]">

        {/* ==================================================
            HEADER
        ================================================== */}

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

        {/* ==================================================
            ROWS
        ================================================== */}

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
              <SearchableDropdown
                name={`receiptNoteItem-${row.id}`}
                label="items"
                options={itemOptions}
                loading={optionsLoading}
                value={row.item}
                onSelect={(value) =>
                  selectItem(row.id, value)
                }
                onClear={() =>
                  updateRow(row.id, 'item', '')
                }
                placeholder="Search Item"
              />
            </div>

            {/* QTY */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={row.quantity}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'quantity',
                    event.target.value
                  )
                }
              />
            </div>

            {/* RATE */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={row.rate}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'rate',
                    event.target.value
                  )
                }
              />
            </div>

            {/* UNITS */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <input
                value={row.units}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'units',
                    event.target.value
                  )
                }
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
                  focus:border-[#55ba4d]
                "
              />
            </div>

            {/* DISCOUNT */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={row.discount}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'discount',
                    event.target.value
                  )
                }
              />
            </div>

            {/* HSN */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={row.hsnCode}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'hsnCode',
                    event.target.value
                  )
                }
                placeholder=""
                search
              />
            </div>

            {/* GODOWN */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <SearchableDropdown
                name={`receiptNoteGodown-${row.id}`}
                label="godowns"
                options={godownOptions}
                loading={optionsLoading}
                value={row.godown}
                onSelect={(value) =>
                  updateRow(
                    row.id,
                    'godown',
                    value
                  )
                }
                onClear={() =>
                  updateRow(
                    row.id,
                    'godown',
                    ''
                  )
                }
                placeholder="Search Godown"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={row.description}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'description',
                    event.target.value
                  )
                }
                placeholder="Enter Notes"
              />
            </div>

            {/* AMOUNT */}

            <div className="flex items-center border-r border-[#d4dbe2] p-2">
              <TableInput
                value={amountFor(row).toFixed(2)}
                readOnly
              />
            </div>

            {/* TAX INCLUSION */}

            <div className="flex items-center justify-center border-r border-[#d4dbe2]">
              <input
                type="checkbox"
                checked={row.taxInclusive}
                onChange={(event) =>
                  updateRow(
                    row.id,
                    'taxInclusive',
                    event.target.checked
                  )
                }
                title="Add 18% GST to the discounted amount"
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

/* ============================================================
   ADVANCED TABS
============================================================ */

const advancedTabs = [
  "Supplier's Details",
  'Consignee Details',
  'Dispatch Details',
  'Order Details',
]

/* ============================================================
   ADVANCED CONTENT
============================================================ */

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
        type="date"
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

/* ============================================================
   RECEIPT NOTE PAGE
============================================================ */

function ReceiptNotePage({ companyId }) {
  const [rows, setRows] = useState([
    createItemRow(1),
  ])

  const [activeTab, setActiveTab] =
    useState("Supplier's Details")

  const [narrationOpen, setNarrationOpen] =
    useState(true)

  const [advancedOpen, setAdvancedOpen] =
    useState(true)

  const [partyName, setPartyName] = useState('')
  const [ledgerType, setLedgerType] = useState('')
  const [voucherType, setVoucherType] =
    useState('Receipt Note')
  const [voucherNumber, setVoucherNumber] =
    useState('-')
  const [voucherDate, setVoucherDate] =
    useState('2026-08-27')

  const [orderType, setOrderType] = useState('')
  const [orderNumber, setOrderNumber] =
    useState('')
  const [orderDate, setOrderDate] =
    useState('')

  const [narration, setNarration] =
    useState('')

  const [stockItems, setStockItems] =
    useState([])

  const [godowns, setGodowns] =
    useState([])

  const [customers, setCustomers] =
    useState([])

  const [ledgers, setLedgers] =
    useState([])

  const [vouchers, setVouchers] =
    useState([])

  const [optionsLoading, setOptionsLoading] =
    useState(false)

  const [optionsError, setOptionsError] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const successTimerRef =
    useRef(null)

  const accessToken =
    useAuthStore((state) => state.accessToken)

  /* ============================================================
     CLEANUP
  ============================================================ */

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(
          successTimerRef.current
        )
      }
    }
  }, [])

  /* ============================================================
     LOAD OPTIONS
  ============================================================ */

  useEffect(() => {
    if (!companyId || !accessToken) {
      return undefined
    }

    let mounted = true

    setOptionsLoading(true)
    setOptionsError('')

    Promise.allSettled([
      fetchCustomers({
        companyId,
        accessToken,
        page: 1,
        limit: 100,
      }),

      fetchCompanyStock(
        accessToken,
        companyId,
        {
          page: 1,
          limit: 100,
        }
      ),

      fetchCompanyVouchers(
        accessToken,
        companyId,
        {
          page: 1,
          limit: 100,
        }
      ),

      fetchCompanyGodowns(
        accessToken,
        companyId,
        {
          page: 1,
          limit: 100,
        }
      ),

      fetchCompanyLedgers(
        accessToken,
        companyId,
        {
          page: 1,
          limit: 100,
        }
      ),
    ])

      .then(
        ([
          customersResult,
          stockResult,
          vouchersResult,
          godownsResult,
          ledgersResult,
        ]) => {
          if (!mounted) return

          if (
            customersResult.status ===
            'fulfilled'
          ) {
            setCustomers(
              extractCustomers(
                customersResult.value
              )
            )
          }

          if (
            stockResult.status ===
            'fulfilled'
          ) {
            setStockItems(
              extractStockItems(
                stockResult.value
              )
            )
          }

          if (
            vouchersResult.status ===
            'fulfilled'
          ) {
            setVouchers(
              extractVouchers(
                vouchersResult.value
              )
            )
          }

          if (
            godownsResult.status ===
            'fulfilled'
          ) {
            setGodowns(
              extractGodowns(
                godownsResult.value
              )
            )
          }

          if (
            ledgersResult.status ===
            'fulfilled'
          ) {
            setLedgers(
              extractLedgers(
                ledgersResult.value
              )
            )
          }

          const failed = [
            customersResult,
            stockResult,
            vouchersResult,
            godownsResult,
            ledgersResult,
          ].find(
            (result) =>
              result.status === 'rejected'
          )

          if (failed) {
            setOptionsError(
              failed.reason?.message ||
                'Unable to load voucher options.'
            )
          }
        }
      )
      .finally(() => {
        if (mounted) {
          setOptionsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId])

  /* ============================================================
     DROPDOWN OPTIONS
  ============================================================ */

  const itemOptions = stockItems
    .map((item) =>
      getDisplayValue(item, [
        'itemName',
        'item_name',
        'stockName',
        'stock_name',
        'item',
        'name',
        'displayName',
      ])
    )
    .filter(
      (value, index, values) =>
        value &&
        values.indexOf(value) === index
    )

  const godownOptions = godowns
    .map((item) =>
      getDisplayValue(item, [
        'godownName',
        'godown_name',
        'name',
        'warehouse',
        'location',
        'displayName',
      ])
    )
    .filter(
      (value, index, values) =>
        value &&
        values.indexOf(value) === index
    )

  const partyOptions = customers
    .map((item) =>
      getDisplayValue(item, [
        'name',
        'customerName',
        'partyName',
        'ledgerName',
        'displayName',
      ])
    )
    .filter(
      (value, index, values) =>
        value &&
        values.indexOf(value) === index
    )

  const ledgerOptions = ledgers
    .map((item) =>
      getDisplayValue(item, [
        'ledgerName',
        'name',
        'displayName',
        'partyName',
      ])
    )
    .filter(
      (value, index, values) =>
        value &&
        values.indexOf(value) === index
    )

  const voucherPartyOptions = vouchers
    .map((item) =>
      getDisplayValue(item, [
        'partyLedger',
        'partyName',
        'ledgerName',
        'party',
        'customerName',
      ])
    )
    .filter(
      (value, index, values) =>
        value &&
        values.indexOf(value) === index
    )

  /* ============================================================
     TOTALS
  ============================================================ */

  const totals = rows.reduce(
    (summary, row) => {
      const calculated = calculateRow(row)

      return {
        grossAmount:
          summary.grossAmount +
          calculated.grossAmount,

        discountAmount:
          summary.discountAmount +
          calculated.discountAmount,

        taxableAmount:
          summary.taxableAmount +
          calculated.taxableAmount,

        gstAmount:
          summary.gstAmount +
          calculated.gstAmount,

        grandTotal:
          summary.grandTotal +
          calculated.totalAmount,
      }
    },
    {
      grossAmount: 0,
      discountAmount: 0,
      taxableAmount: 0,
      gstAmount: 0,
      grandTotal: 0,
    }
  )

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`

  /* ============================================================
     CREATE VOUCHER
  ============================================================ */

  const createVoucher = async () => {
    if (!companyId || !accessToken) {
      setOptionsError(
        'Select a company and sign in before creating a voucher.'
      )
      return
    }

    if (!partyName.trim() || !ledgerType.trim() || !orderType.trim() || !orderNumber.trim() || !orderDate || !voucherNumber.trim() || !voucherDate || !narration.trim()) {
      setOptionsError('Complete all receipt note fields before creating the voucher.')
      return
    }

    const invalidRow = rows.find((row) => {
      const quantity = Number(row.quantity)
      const rate = Number(row.rate)
      const discount = Number(row.discount)
      return !row.item.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(rate) || rate < 0 || !row.units.trim() || !Number.isFinite(discount) || discount < 0 || discount > 100 || !row.hsnCode.trim() || !row.godown.trim() || !row.description.trim()
    })

    if (invalidRow) {
      setOptionsError('Complete every receipt note item with all required values.')
      return
    }

    setIsSubmitting(true)
    setOptionsError('')

    try {
      await postCompanyCommand(
        accessToken,
        companyId,
        {
          type: 'CREATE_VOUCHER',

          payload: {
            voucherType,
            partyLedger: partyName,
            ledgerType,
            date: voucherDate,
            voucherNumber,
            orderType,
            orderNumber,
            orderDate,

            items: rows.map((row) => {
              const calculated =
                calculateRow(row)

              return {
                itemName: row.item,

                quantity:
                  Number(row.quantity) || 0,

                rate:
                  Number(row.rate) || 0,

                units: row.units,

                discount:
                  Number(row.discount) || 0,

                hsnCode: row.hsnCode,

                godown: row.godown,

                description:
                  row.description,

                /*
                  Amount AFTER discount.
                  GST is reflected separately through taxInclusive
                  and the UI calculation.
                */
                amount:
                  calculated.taxableAmount,

                taxInclusive:
                  row.taxInclusive,
              }
            }),

            narration,
          },
        }
      )

      setMessage(
        'Receipt Note Voucher created successfully.'
      )

      successTimerRef.current =
        window.setTimeout(() => {
          setMessage('')
        }, 3000)
    } catch (error) {
      setOptionsError(
        error?.message ||
          'Unable to create Receipt Note Voucher.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ============================================================
     UI
  ============================================================ */

  return (
    <div className="voucher-page-animate relative min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* ========================================================
          LOADING
      ======================================================== */}

      {(optionsLoading || isSubmitting) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/15 backdrop-blur-[1px]">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white/90 px-6 py-5 shadow-xl">

            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-slate-200
                border-t-[#1a1f24]
              "
              aria-hidden="true"
            />

            <span className="mt-3 text-sm font-semibold text-slate-700">
              {optionsLoading
                ? 'Loading ...'
                : 'Creating voucher...'}
            </span>

          </div>
        </div>
      )}

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex h-[36px] items-center bg-[#45bd35] px-5">
        <h1 className="text-[16px] font-bold leading-none text-white">
          Create Receipt Note Voucher
        </h1>
      </div>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <div className="p-4">

        {/* ======================================================
            TOP FIELDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

          <Field
            label="Voucher Type"
            placeholder="Select Voucher Type"
            search
            value={voucherType}
            onChange={(event) =>
              setVoucherType(
                event.target.value
              )
            }
          />

          <label className="relative block min-w-0">
            <span className="absolute -top-[7px] left-3 z-10 bg-[#eef3f8] px-1.5 text-[12px] leading-none text-[#1f4264]">
              Party Name
            </span>

            <SearchableDropdown
              name="receiptNoteParty"
              label="parties"
              options={[
                ...new Set([
                  ...partyOptions,
                  ...voucherPartyOptions,
                ]),
              ]}
              loading={optionsLoading}
              value={partyName}
              onSelect={setPartyName}
              onClear={() =>
                setPartyName('')
              }
              placeholder="Select Party"
            />
          </label>

          <Field
            label="Order Type"
            placeholder="Select ref"
            search
            value={orderType}
            onChange={(event) =>
              setOrderType(
                event.target.value
              )
            }
          />

          <Field
            label="Order Number"
            placeholder="Order Number"
            value={orderNumber}
            onChange={(event) =>
              setOrderNumber(
                event.target.value
              )
            }
          />

          <Field
            label="Order Date"
            placeholder="Order Date"
            icon="▣"
            type="date"
            value={orderDate}
            onChange={(event) =>
              setOrderDate(
                event.target.value
              )
            }
          />

          <Field
            label="Voucher No"
            value={voucherNumber}
            onChange={(event) =>
              setVoucherNumber(
                event.target.value
              )
            }
            icon="✎"
          />

          <Field
            label="Date"
            type="date"
            value={voucherDate}
            onChange={(event) =>
              setVoucherDate(
                event.target.value
              )
            }
            icon="▣"
          />

          <label className="relative block min-w-0 xl:col-span-3">
            <span className="absolute -top-[7px] left-3 z-10 bg-[#eef3f8] px-1.5 text-[12px] leading-none text-[#1f4264]">
              Ledger Type
            </span>

            <SearchableDropdown
              name="receiptNoteLedger"
              label="ledgers"
              options={ledgerOptions}
              loading={optionsLoading}
              value={ledgerType}
              onSelect={setLedgerType}
              onClear={() =>
                setLedgerType('')
              }
              placeholder="Select Ledger"
            />
          </label>

        </div>

        {/* ======================================================
            ITEMS
        ====================================================== */}

        <div className="mt-4">

          <ItemsTable
            rows={rows}
            setRows={setRows}
            stockItems={stockItems}
            itemOptions={itemOptions}
            godownOptions={godownOptions}
            optionsLoading={optionsLoading}
          />

          <div className="mt-2 text-[11px] text-[#64748b]">
            Tax Incl. checked = 18% GST is added
            to the amount after discount.
            Unchecked = no GST is added.
          </div>

        </div>

        {/* ======================================================
            LOWER SECTION
        ====================================================== */}

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)]">

          {/* ====================================================
              LEFT
          ==================================================== */}

          <div className="min-w-0">

            {/* ==================================================
                NARRATION
            ================================================== */}

            <div className="overflow-hidden rounded-[4px] bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setNarrationOpen(
                    (current) => !current
                  )
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
                  {narrationOpen
                    ? '⌄'
                    : '›'}
                </span>
              </button>

              {narrationOpen && (
                <div className="border-t border-[#edf0f2] px-4 pb-4 pt-3">

                  <textarea
                    value={narration}
                    onChange={(event) =>
                      setNarration(
                        event.target.value
                      )
                    }
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

            {/* ==================================================
                ADVANCED SETTINGS
            ================================================== */}

            <div className="mt-2 overflow-hidden rounded-[4px] bg-white shadow-sm">

              <button
                type="button"
                onClick={() =>
                  setAdvancedOpen(
                    (current) => !current
                  )
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
                  {advancedOpen
                    ? '⌄'
                    : '›'}
                </span>
              </button>

              {advancedOpen && (
                <div className="border-t border-[#edf0f2] bg-[#f7f9f8] px-4 pb-4">

                  {/* TABS */}

                  <div className="overflow-x-auto">

                    <div className="flex min-w-[610px] border-b border-[#d3dbe2]">

                      {advancedTabs.map(
                        (tab) => (
                          <button
                            key={tab}
                            type="button"
                            onClick={() =>
                              setActiveTab(tab)
                            }
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
                        )
                      )}

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

          {/* ====================================================
              TOTAL
          ==================================================== */}

          <div className="h-fit rounded-[4px] bg-white p-4 shadow-sm">

            <GstLedgerPanel />

            <div className="mt-3 bg-[#f1fbef] px-4 py-3">

              {/* SUB TOTAL */}

              <div className="flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  Sub Total
                </span>

                <span className="font-medium text-[#111]">
                  {money(
                    totals.grossAmount
                  )}
                </span>
              </div>

              {/* DISCOUNT */}

              <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  Discount
                </span>

                <span className="font-medium text-[#111]">
                  -
                  {money(
                    totals.discountAmount
                  )}
                </span>
              </div>

              {/* TAXABLE */}

              <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  Taxable Amount
                </span>

                <span className="font-medium text-[#111]">
                  {money(
                    totals.taxableAmount
                  )}
                </span>
              </div>

              {/* GST */}

              <div className="mt-1.5 flex items-center justify-between text-[12px] text-[#54616d]">
                <span>
                  GST (18%)
                </span>

                <span className="font-medium text-[#111]">
                  {money(
                    totals.gstAmount
                  )}
                </span>
              </div>

              {/* GRAND TOTAL */}

              <div className="mt-3 border-t border-[#d6e4d3] pt-2">

                <div className="flex items-center justify-between text-[16px] font-bold text-[#111]">

                  <span>
                    Grand Total
                  </span>

                  <span>
                    {money(
                      totals.grandTotal
                    )}
                  </span>

                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {optionsError && (
        <p className="px-4 py-2 text-xs text-red-600">
          {optionsError}
        </p>
      )}

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="flex min-h-[58px] items-center justify-end border-t border-[#e0e5ea] bg-white px-5">

        <button
          type="button"
          onClick={createVoucher}
          disabled={isSubmitting}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting
            ? 'Creating...'
            : 'Create Voucher'}
        </button>

      </div>

      {/* ========================================================
          SUCCESS MESSAGE
      ======================================================== */}

      {message && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {message}
        </div>
      )}

    </div>
  )
}

export default ReceiptNotePage