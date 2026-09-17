import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import useAuthStore from '../store/authStore'
import {
  extractStockItems,
  extractCommandId,
  extractCommandStatus,
  extractGodowns,
  extractBatches,
  extractLedgers,
  extractVouchers,
  extractVoucherTypes,
  fetchCommandStatus,
  fetchCompanyLedgers,
  fetchCompanyGodowns,
  fetchCompanyBatches,
  fetchCompanyCommands,
  fetchCompanyStock,
  fetchCompanyVouchers,
  fetchCompanyVoucherTypes,
  postCompanyCommand,
} from '../services/companiesApi'
import {
  extractCustomers,
  fetchCustomers,
} from '../services/customersApi'

const QUOTATION_COMPANY_ID = '6aa0f659f858467a84d08d57'

let nextItemRowId = 1

function createEmptyItemRow() {
  return {
    id: nextItemRowId++,
    item: '',
    quantity: '0',
    rate: '',
    units: '',
    discount: '0',
    hsnCode: '',
    godown: '',
    description: '',
    taxInclusive: false,
  }
}

function createJournalRow(id = Date.now()) {
  return {
    id,
    type: '',
    partyName: '',
    amount: '',
  }
}

function JournalVoucherContent({
  voucherType,
  rows,
  partyOptions,
  optionsLoading,
  onAddRow,
  onRemoveRow,
  onRowChange,
}) {
  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher Type</span>
          <input
            name="voucherType"
            value={voucherType}
            readOnly
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher No</span>
          <input
            name="voucherNumber"
            type="number"
            min="0"
            step="1"
            defaultValue="1"
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Date</span>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toLocaleDateString('en-CA')}
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700 md:col-span-2">
          <span>Reference Number</span>
          <input
            name="referenceNumber"
            placeholder="Enter Reference Number"
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Reference Date</span>
          <input
            name="referenceDate"
            type="date"
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Add Particulars
          </span>
          <button
            type="button"
            onClick={onAddRow}
            className="rounded-md bg-[#dff4e4] px-2 py-1 text-sm font-bold text-green-700"
            aria-label="Add particular"
          >
            +
          </button>
        </div>

        <div className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          <span>Type</span>
          <span>Party Name</span>
          <span>Amount</span>
          <span />
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 border-t border-slate-200 bg-white p-2"
          >
            <select
              name={`journalType-${row.id}`}
              value={row.type}
              onChange={(event) => onRowChange(row.id, 'type', event.target.value)}
              className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="">Please select type</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
            <SearchableDropdown
              name={`journalPartyName-${row.id}`}
              label="parties"
              options={partyOptions}
              loading={optionsLoading}
              value={row.partyName}
              onSelect={(value) => onRowChange(row.id, 'partyName', value)}
              onClear={() => onRowChange(row.id, 'partyName', '')}
              placeholder="Select Party Name"
            />
            <input
              name={`journalAmount-${row.id}`}
              type="number"
              min="0"
              step="0.01"
              value={row.amount}
              onChange={(event) => onRowChange(row.id, 'amount', event.target.value)}
              className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Amount"
            />
            <button
              type="button"
              onClick={() => onRemoveRow(row.id)}
              disabled={rows.length === 1}
              className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Remove particular"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <label className="mt-5 block text-xs font-semibold text-slate-700">
        <span>Narration</span>
        <textarea
          name="narration"
          rows="3"
          placeholder="Enter Narration"
          className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </label>
    </>
  )
}

const advancedVoucherTabs = [
  "Supplier's Details",
  'Consignee Details',
  'Dispatch Details',
  'Order Details',
]

function VoucherField({ label, placeholder, name, search = false, className = '' }) {
  return (
    <label className={`relative block min-w-0 ${className}`}>
      <span className="absolute -top-[7px] left-3 z-10 bg-white px-1.5 text-[11px] leading-none text-slate-600">
        {label}
      </span>
      <div className="relative">
        <input
          name={name}
          placeholder={placeholder}
          className="h-9 w-full rounded-md border border-slate-300 bg-white px-2.5 pr-9 text-xs text-slate-700 outline-none placeholder:text-slate-500 focus:border-green-600 focus:ring-1 focus:ring-green-100"
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

function AdvancedVoucherContent({ activeTab }) {
  if (activeTab === "Supplier's Details") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <VoucherField name="supplierName" label="Supplier's Name" placeholder="Supplier's Name" search />
        <VoucherField name="supplierCountry" label="Supplier's Country" placeholder="Supplier's Country" search />
        <VoucherField name="supplierState" label="Supplier's State" placeholder="Supplier's State" search />
        <VoucherField name="registrationType" label="Registration Type" placeholder="Registration Type" search />
        <VoucherField name="postalCode" label="Postal Code" placeholder="Postal Code" />
        <VoucherField name="gstinUin" label="GSTIN/UIN" placeholder="GSTIN/UIN" />
        <VoucherField name="placeOfSupply" label="Place of Supply" placeholder="Place of Supply" />
        <VoucherField name="address" label="Address" placeholder="Address" className="md:col-span-2 xl:col-span-2" />
      </div>
    )
  }

  const fields = {
    'Consignee Details': [
      ['consigneeName', 'Consignee Name', 'Consignee Name', true],
      ['consigneeCountry', 'Consignee Country', 'Country', false],
      ['consigneeState', 'Consignee State', 'State', false],
      ['consigneePostalCode', 'Postal Code', 'Postal Code', false],
      ['consigneeGstinUin', 'GSTIN/UIN', 'GSTIN/UIN', false],
      ['consigneeAddress', 'Address', 'Address', false],
    ],
    'Dispatch Details': [
      ['dispatchFrom', 'Dispatch From', 'Dispatch From', true],
      ['dispatchThrough', 'Dispatch Through', 'Dispatch Through', false],
      ['dispatchDocNo', 'Dispatch Document No', 'Document No', false],
      ['dispatchDate', 'Dispatch Date', 'Dispatch Date', false],
    ],
    'Order Details': [
      ['orderNo', 'Order No', 'Order No', false],
      ['orderDate', 'Order Date', 'Order Date', false],
      ['termsOfDelivery', 'Terms Of Delivery', 'Terms Of Delivery', false],
    ],
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {fields[activeTab].map(([name, label, placeholder, search]) => (
        <VoucherField
          key={name}
          name={name}
          label={label}
          placeholder={placeholder}
          search={search}
          className={name.includes('Address') || name === 'termsOfDelivery' ? 'md:col-span-2 xl:col-span-3' : ''}
        />
      ))}
    </div>
  )
}

export function AdvancedVoucherSettings() {
  const [activeTab, setActiveTab] = useState(advancedVoucherTabs[0])

  return (
    <details open className="group rounded-md bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
        Advanced Settings
        <span className="text-lg leading-none transition group-open:rotate-90">›</span>
      </summary>
      <div className="p-3">
        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2 border-b border-slate-200 px-2">
          {advancedVoucherTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-2 text-xs transition ${activeTab === tab ? 'border-sky-500 font-semibold text-sky-500' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <AdvancedVoucherContent activeTab={activeTab} />
      </div>
    </details>
  )
}

function VoucherBottomSection({ subtotal }) {
  return (
    <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
      <div className="space-y-2">
        <details open className="group rounded-md bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
            Narration
            <span className="text-lg leading-none transition group-open:rotate-90">›</span>
          </summary>
          <div className="relative p-3">
            <textarea
              name="narration"
              rows="3"
              className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Enter narration"
            />
          </div>
        </details>

        <AdvancedVoucherSettings />
      </div>

      <div className="rounded-md bg-white p-3">
        <button type="button" className="mb-3 text-sm font-semibold text-green-600 hover:text-green-700">
          + Add GST And Other Ledgers
        </button>
        <div className="space-y-2 bg-green-50 p-3 text-sm text-slate-700">
          <div className="flex justify-between"><span>Sub Total</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Taxes</span><span>₹0</span></div>
          <div className="mt-3 flex justify-between border-t border-green-100 pt-3 text-base font-bold text-slate-900">
            <span>Grand Total</span><span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SearchableDropdown({
  name,
  label,
  options,
  placeholder,
  loading = false,
  defaultValue = '',
  value,
  onSelect,
  onClear,
  resetToken = 0,
  disabled = false,
}) {
  const [query, setQuery] = useState(value ?? defaultValue)
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  // Reference to the complete dropdown wrapper
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState(null)

  const updateMenuPosition = () => {
    const input = dropdownRef.current?.querySelector('input')
    if (!input) return

    const rect = input.getBoundingClientRect()
    setMenuPosition({
      left: rect.left,
      top: rect.bottom + 4,
      width: rect.width,
    })
  }

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value)
    }
  }, [value])

  useEffect(() => {
    setQuery(value ?? defaultValue ?? '')
    setOpen(false)
    setShowAll(false)
  }, [resetToken])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false)
        setShowAll(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setMenuPosition(null)
      return undefined
    }

    updateMenuPosition()
    const handleViewportChange = () => updateMenuPosition()
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [open])

  const filteredOptions = options.filter((option) =>
    option
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  const visibleOptions = showAll
    ? filteredOptions
    : filteredOptions.slice(0, 10)

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
    >
      <input
        name={name}
        value={query}
        autoComplete="off"
        readOnly={disabled}
        onFocus={() => {
          if (!disabled) {
            setOpen(true)
          }
        }}
        onChange={(event) => {
          if (disabled) return

          setQuery(event.target.value)

          onSelect?.(event.target.value)

          setOpen(true)
          setShowAll(false)
        }}
        placeholder={
          loading
            ? `Loading ${label.toLowerCase()}...`
            : placeholder
        }
        className={`min-h-9 w-full rounded-md border border-slate-300 px-2.5 pr-14 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 ${
          disabled
            ? 'cursor-not-allowed bg-slate-100'
            : 'bg-white'
        }`}
      />

      {query && !disabled && (
        <button
          type="button"
          aria-label={`Clear ${label}`}
          onClick={() => {
            setQuery('')
            onSelect?.('')
            onClear?.()
          }}
          className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          ×
        </button>
      )}

      {!disabled && (
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          ⌄
        </span>
      )}

      {open && !disabled && menuPosition && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[1200] max-h-72 overflow-y-auto rounded-md border border-slate-200 bg-white p-1 shadow-xl"
          style={menuPosition}
        >
          <div>
            {visibleOptions.length > 0 ? (
              visibleOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() => {
                    setQuery(option)
                    onSelect?.(option)
                    setOpen(false)
                    setShowAll(false)
                  }}
                  className="block w-full rounded px-3 py-2 text-left text-xs text-slate-700 transition hover:bg-green-50"
                >
                  {option}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-slate-500">
                No matching options.
              </p>
            )}

            {!showAll &&
              filteredOptions.length > 10 && (
                <button
                  type="button"
                  onMouseDown={(event) =>
                    event.preventDefault()
                  }
                  onClick={() => setShowAll(true)}
                  className="mt-1 w-full border-t border-slate-100 px-3 py-2 text-center text-[11px] font-semibold text-green-700 hover:bg-green-50"
                >
                  Show more (
                  {filteredOptions.length - 10})
                </button>
              )}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

export function DocumentVoucherPage({
  title,
  companyId,
  extraField,
  date = new Date().toLocaleDateString('en-CA'),
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [showSuccessAnimation, setShowSuccessAnimation] =
    useState(false)

  const [customers, setCustomers] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [ledgers, setLedgers] = useState([])
  const [godowns, setGodowns] = useState([])
  const [batches, setBatches] = useState([])
  const [voucherTypes, setVoucherTypes] = useState([])

  const [selectedParty, setSelectedParty] = useState('')
  const [selectedVoucherNumber, setSelectedVoucherNumber] =
    useState('')
  const [selectedVoucherType, setSelectedVoucherType] =
    useState(title === 'Sales Order' ? 'Sales Order' : 'Sales')

  const [itemRows, setItemRows] = useState([
    createEmptyItemRow(),
  ])
  const [journalRows, setJournalRows] = useState([
    createJournalRow(1),
  ])
  const [sourceRows, setSourceRows] = useState([
    createStockJournalRow(1),
  ])
  const [destinationRows, setDestinationRows] = useState([
    createStockJournalRow(2),
  ])

  const [clearToken, setClearToken] = useState(0)

  const [isOptionsLoading, setIsOptionsLoading] =
    useState(false)

  const [stockError, setStockError] = useState('')

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )
  const successTimerRef = useRef(null)

  const isSalesInvoice = title === 'Sales'
  const isSalesOrder = title === 'Sales Order'
  const isJournal = title === 'Journal'
  const isContra = title === 'Contra'
  const isJournalStyleVoucher = isJournal || isContra
  const isCreditNote = title === 'Credit Note'
  const isDebitNote = title === 'Debit Note'
  const isNoteVoucher = isCreditNote || isDebitNote
  const isStockJournal = title === 'Stock Journal'
  const defaultVoucherType = title === 'Quotation' ? 'Quotation' : title
  const showPageLoader =
    isOptionsLoading || isSubmitting || showSuccessAnimation

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const defaultDate =
    title === 'Quotation'
      ? new Date().toLocaleDateString('en-CA')
      : date

  const requestCompanyId =
    title === 'Quotation'
      ? companyId || QUOTATION_COMPANY_ID
      : companyId

  useEffect(() => {
    if (!requestCompanyId || !accessToken) {
      setCustomers([])
      setStockItems([])
      setVouchers([])
      setLedgers([])
      setGodowns([])
      setBatches([])
      setVoucherTypes([])
      setSelectedParty('')
      setSelectedVoucherNumber('')
      setSelectedVoucherType('Sales')
      setItemRows([createEmptyItemRow()])
      setJournalRows([createJournalRow(1)])
      setSourceRows([createStockJournalRow(1)])
      setDestinationRows([createStockJournalRow(2)])
      setStockError('')
      return undefined
    }

    let mounted = true

    setIsOptionsLoading(true)
    setStockError('')

    const requests = [
      fetchCustomers({
        companyId: requestCompanyId,
        accessToken,
        page: 1,
        limit: 100,
      }),

      fetchCompanyStock(
        accessToken,
        requestCompanyId,
        {
          page: 1,
          limit: 100,
        },
      ),
    ]

    if (
      title === 'Quotation' ||
      isSalesInvoice
    ) {
      requests.push(
        fetchCompanyVouchers(
          accessToken,
          requestCompanyId,
          {
            page: 1,
            limit: 100,
          },
        ),
      )

    } else {
      requests.push(Promise.resolve(null))
    }

    requests.push(
      fetchCompanyBatches(
        accessToken,
        requestCompanyId,
        {
          page: 1,
          limit: 100,
        },
      ),
    )

    requests.push(
      fetchCompanyLedgers(
        accessToken,
        requestCompanyId,
        {
          page: 1,
          limit: 100,
        },
      ),
    )

    requests.push(
      fetchCompanyGodowns(
        accessToken,
        requestCompanyId,
        {
          page: 1,
          limit: 100,
        },
      ),
    )

    if (isSalesInvoice || isSalesOrder) {
      requests.push(
        fetchCompanyVoucherTypes(
          accessToken,
          requestCompanyId,
        ),
      )
    } else {
      requests.push(Promise.resolve(null))
    }

    if (isSalesOrder) {
      requests.push(
        fetchCompanyCommands(
          accessToken,
          requestCompanyId,
          {
            type: 'CREATE_VOUCHER',
            voucherType: 'Sales Order',
            page: 1,
            limit: 20,
            q: '',
          },
        ),
      )
    }

    Promise.allSettled(requests)
      .then(
        ([
          customersResult,
          stockResult,
          vouchersResult,
          batchesResult,
          ledgersResult,
          godownsResult,
          voucherTypesResult,
        ]) => {
          if (!mounted) return

          if (
            customersResult.status ===
            'fulfilled'
          ) {
            setCustomers(
              extractCustomers(
                customersResult.value,
              ),
            )
          }

          if (
            stockResult.status ===
            'fulfilled'
          ) {
            setStockItems(
              extractStockItems(
                stockResult.value,
              ),
            )
          } else {
            setStockItems([])

            setStockError(
              stockResult.reason?.message ||
                'Unable to load stock items.',
            )
          }

          if (batchesResult?.status === 'fulfilled') {
            setBatches(extractBatches(batchesResult.value))
          }

          if (
            vouchersResult?.status ===
            'fulfilled'
          ) {
            setVouchers(
              extractVouchers(
                vouchersResult.value,
              ),
            )
          }

          if (
            ledgersResult?.status ===
            'fulfilled'
          ) {
            setLedgers(
              extractLedgers(
                ledgersResult.value,
              ),
            )
          }

          if (
            godownsResult?.status ===
            'fulfilled'
          ) {
            setGodowns(
              extractGodowns(
                godownsResult.value,
              ),
            )
          }

          if (
            voucherTypesResult?.status ===
            'fulfilled'
          ) {
            setVoucherTypes(
              extractVoucherTypes(
                voucherTypesResult.value,
              ),
            )
          }
        },
      )
      .finally(() => {
        if (mounted) {
          setIsOptionsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [
    accessToken,
    requestCompanyId,
    title,
  ])

  const getDisplayValue = (
    entry,
    keys,
  ) => {
    for (const key of keys) {
      if (
        entry?.[key] !== undefined &&
        entry[key] !== null &&
        String(entry[key]).trim()
      ) {
        return String(entry[key])
      }
    }

    return ''
  }

  const getStockValue = (
    item,
    keys,
  ) => {
    const normalizedKeys = keys.map(
      (key) =>
        key
          .replace(/[^a-z0-9]/gi, '')
          .toLowerCase(),
    )

    const candidates = [
      item,
      item?.data,
      item?.payload,
      item?.item,
    ]

    for (const candidate of candidates) {
      if (
        !candidate ||
        typeof candidate !== 'object'
      ) {
        continue
      }

      const matchingKey = Object.keys(
        candidate,
      ).find((key) =>
        normalizedKeys.includes(
          key
            .replace(/[^a-z0-9]/gi, '')
            .toLowerCase(),
        ),
      )

      if (
        matchingKey &&
        candidate[matchingKey] !== null &&
        candidate[matchingKey] !== undefined &&
        String(candidate[matchingKey]).trim()
      ) {
        return String(
          candidate[matchingKey],
        ).trim()
      }
    }

    return ''
  }

  const normalizeItemName = (
    value,
  ) =>
    String(value ?? '')
      .trim()
      .toLowerCase()

  const findStockItem = (
    itemName,
  ) => {
    const normalizedItemName =
      normalizeItemName(itemName)

    if (!normalizedItemName) {
      return null
    }

    return (
      stockItems.find(
        (item) =>
          normalizeItemName(
            getStockValue(item, [
              'itemName',
              'item_name',
              'stockName',
              'stock_name',
              'stockItemName',
              'stock_item_name',
              'item',
              'name',
              'displayName',
            ]),
          ) === normalizedItemName,
      ) || null
    )
  }

  const customerOptions = customers
    .map((customer) =>
      getDisplayValue(customer, [
        'name',
        'customerName',
        'partyName',
        'ledgerName',
        'displayName',
      ]),
    )
    .filter(Boolean)
    .filter(
      (name, index, names) =>
        names.indexOf(name) === index,
    )

  const itemOptions = stockItems
    .map((item) =>
      getStockValue(item, [
        'itemName',
        'item_name',
        'stockName',
        'stock_name',
        'stockItemName',
        'stock_item_name',
        'item',
        'name',
        'displayName',
      ]),
    )
    .filter(Boolean)
    .filter(
      (name, index, names) =>
        names.indexOf(name) === index,
    )

  const getVoucherValue = (
    voucher,
    keys,
  ) => {
    const normalizedKeys = keys.map(
      (key) =>
        key
          .toLowerCase()
          .replace(/[^a-z0-9]/g, ''),
    )

    const findNormalizedValue = (
      entry,
    ) => {
      if (
        !entry ||
        typeof entry !== 'object'
      ) {
        return ''
      }

      const matchingKey = Object.keys(
        entry,
      ).find((key) =>
        normalizedKeys.includes(
          key
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''),
        ),
      )

      if (!matchingKey) {
        return ''
      }

      const value =
        entry[matchingKey]

      if (
        value &&
        typeof value === 'object'
      ) {
        return getDisplayValue(value, [
          'name',
          'partyName',
          'partyLedger',
          'ledgerName',
          'displayName',
          'value',
        ])
      }

      return String(
        value ?? '',
      ).trim()
    }

    const candidates = [
      voucher,
      voucher?.payload,
      voucher?.data,
      voucher?.voucher,
      voucher?.payload?.data,
      voucher?.payload?.voucher,
    ]

    return (
      candidates
        .map(findNormalizedValue)
        .find(Boolean) || ''
    )
  }

  const voucherPartyOptions =
    vouchers
      .map((voucher) =>
        getVoucherValue(voucher, [
          'partyLedger',
          'party ledger',
          'partyName',
          'ledgerName',
          'party',
          'customerName',
        ]),
      )
      .filter(Boolean)
      .filter(
        (value, index, values) =>
          values.indexOf(value) === index,
      )

  const voucherNumberOptions =
    vouchers
      .map((voucher) =>
        getVoucherValue(voucher, [
          'voucherNumber',
          'voucherNo',
          'voucher no',
          'voucher_no',
          'number',
        ]),
      )
      .filter(Boolean)
      .filter(
        (value, index, values) =>
          values.indexOf(value) === index,
      )

  const ledgerTypeOptions =
    ledgers
      .map((ledger) =>
        getDisplayValue(ledger, [
          'ledgerType',
          'ledger_type',
          'type',
          'ledgerName',
          'name',
          'displayName',
        ]),
      )
      .filter(Boolean)
      .filter(
        (value, index, values) =>
          values.indexOf(value) === index,
      )

  const partyLedgerOptions = [
    ...customerOptions,
    ...ledgers
      .map((ledger) =>
        getDisplayValue(ledger, [
          'ledgerName',
          'name',
          'displayName',
          'partyName',
        ]),
      )
      .filter(Boolean),
  ].filter(
    (value, index, values) =>
      values.indexOf(value) === index,
  )

  const voucherTypeOptions = voucherTypes
    .map((voucherType) =>
      typeof voucherType === 'string'
        ? voucherType
        : getDisplayValue(voucherType, [
            'voucherType',
            'voucher_type',
            'type',
            'name',
            'value',
            'displayName',
          ]),
    )
    .filter(Boolean)
    .filter(
      (value, index, values) =>
        values.indexOf(value) === index,
    )

  if (
    (isSalesInvoice || isSalesOrder) &&
    voucherTypeOptions.length === 0
  ) {
    voucherTypeOptions.push(isSalesOrder ? 'Sales Order' : 'Sales')
  }

  const godownOptions =
    godowns
      .map((godownEntry) =>
        getDisplayValue(
          godownEntry,
          [
            'godownName',
            'godown_name',
            'name',
            'warehouse',
            'location',
            'displayName',
          ],
        ),
      )
      .filter(Boolean)
      .filter(
        (value, index, values) =>
          values.indexOf(value) === index,
      )

  const quotationItemOptions = itemOptions

  const quotationPartyOptions =
    voucherPartyOptions

  const partyOptions =
    title === 'Sales Order'
      ? partyLedgerOptions
      : quotationPartyOptions

  const calculateRowAmount = (
    row,
  ) => {
    const quantity =
      Number(row.quantity) || 0
    const rate =
      Number(row.rate) || 0
    const discountPercent =
      Math.max(
        0,
        Math.min(
          Number(row.discount) || 0,
          100,
        ),
      )

    const discountMultiplier =
      1 - discountPercent / 100

    const taxMultiplier = row.taxInclusive ? 1.18 : 1

    return Math.max(
      0,
      quantity * rate * discountMultiplier * taxMultiplier,
    )
  }

  const subtotal = itemRows.reduce(
    (total, row) =>
      total + calculateRowAmount(row),
    0,
  )

  const updateJournalRow = (rowId, field, value) => {
    setJournalRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    )
  }

  const addJournalRow = () => {
    setJournalRows((currentRows) => [
      ...currentRows,
      createJournalRow(Date.now()),
    ])
  }

  const removeJournalRow = (rowId) => {
    setJournalRows((currentRows) => {
      if (currentRows.length === 1) return currentRows
      return currentRows.filter((row) => row.id !== rowId)
    })
  }

  const updateStockRow = (setter, rowId, field, value) => {
    setter((currentRows) => currentRows.map((row) => row.id === rowId ? { ...row, [field]: value } : row))
  }

  const addStockRow = (setter) => {
    setter((currentRows) => [...currentRows, createStockJournalRow(Date.now() + Math.random())])
  }

  const removeStockRow = (setter, rowId) => {
    setter((currentRows) => currentRows.length === 1 ? currentRows : currentRows.filter((row) => row.id !== rowId))
  }

  const findStockRate = (
    itemName,
  ) => {
    const matchingItem =
      findStockItem(itemName)

    return matchingItem
      ? getStockValue(
          matchingItem,
          [
            'rate',
            'salesRate',
            'sellingRate',
            'price',
            'mrp',
            'avgPurRate',
            'purchaseRate',
          ],
        )
      : ''
  }

  const findStockUnits = (
    itemName,
  ) => {
    const matchingItem =
      findStockItem(itemName)

    return matchingItem
      ? getStockValue(
          matchingItem,
          [
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
          ],
        )
      : ''
  }

  const findStockHsnCode = (
    itemName,
  ) => {
    const matchingItem =
      findStockItem(itemName)

    return matchingItem
      ? getStockValue(
          matchingItem,
          [
            'hsnCode',
            'hsn_code',
            'hsn',
            'hsnCodeValue',
            'hsn_code_value',
            'itemHsn',
            'item_hsn',
          ],
        )
      : ''
  }

  const findVoucherNumberForParty = (
    party,
  ) => {
    const normalizeParty = (
      value,
    ) =>
      String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()

    const selectedPartyValue =
      normalizeParty(party)

    const matchingVoucher =
      vouchers.find(
        (voucher) =>
          normalizeParty(
            getVoucherValue(
              voucher,
              [
                'partyLedger',
                'party ledger',
                'partyName',
                'ledgerName',
                'party',
                'customerName',
              ],
            ),
          ) === selectedPartyValue,
      )

    return matchingVoucher
      ? getVoucherValue(
          matchingVoucher,
          [
            'voucherNumber',
            'voucherNo',
            'voucher no',
            'voucher_no',
            'number',
          ],
        )
      : ''
  }

  const updateItemRow = (
    rowId,
    field,
    value,
  ) => {
    setItemRows(
      (currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: value,
              }
            : row,
        ),
    )
  }

  const updateItemRowValues = (
    rowId,
    changes,
  ) => {
    setItemRows(
      (currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                ...changes,
              }
            : row,
        ),
    )
  }

  const handleItemSelect = (
    rowId,
    itemName,
  ) => {
    const matchingRate =
      findStockRate(itemName)

    updateItemRowValues(
      rowId,
      {
        item: itemName,
        rate: matchingRate,
        units: findStockUnits(
          itemName,
        ),
        hsnCode: findStockHsnCode(
          itemName,
        ),
      },
    )
  }

  const addItemRow = () => {
    setItemRows(
      (currentRows) => [
        ...currentRows,
        createEmptyItemRow(),
      ],
    )
  }

  const clearItemRow = (
    rowId,
  ) => {
    setItemRows(
      (currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                item: '',
                quantity: '0',
                rate: '',
                units: '',
                discount: '0',
                hsnCode: '',
                godown: '',
                description: '',
                taxInclusive: false,
              }
            : row,
        ),
    )
  }

  const deleteItemRow = (
    rowId,
  ) => {
    setItemRows(
      (currentRows) => {
        if (
          currentRows.length === 1
        ) {
          return [
            {
              ...currentRows[0],
              item: '',
              quantity: '0',
              rate: '',
              units: '',
              discount: '0',
              hsnCode: '',
              godown: '',
              description: '',
              taxInclusive: false,
            },
          ]
        }

        return currentRows.filter(
          (row) =>
            row.id !== rowId,
        )
      },
    )
  }

  const resetItemRows = () => {
    setItemRows([
      createEmptyItemRow(),
    ])

    setClearToken(
      (token) => token + 1,
    )
  }

  const normalizeCommandKey = (
    value,
  ) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

  const findFirstMeaningfulValue = (
    source,
    candidateKeys,
  ) => {
    const normalizedKeys = new Set(
      candidateKeys.map(
        (key) =>
          normalizeCommandKey(key),
      ),
    )

    const queue = [source]

    while (queue.length > 0) {
      const currentValue =
        queue.shift()

      if (
        !currentValue ||
        typeof currentValue !==
          'object'
      ) {
        continue
      }

      for (const [key, value] of Object.entries(
        currentValue,
      )) {
        const normalizedKey =
          normalizeCommandKey(key)

        if (
          normalizedKeys.has(
            normalizedKey,
          ) &&
          value !== null &&
          value !== undefined &&
          String(value).trim()
        ) {
          return String(value).trim()
        }

        if (
          value &&
          typeof value ===
            'object'
        ) {
          queue.push(value)
        }
      }
    }

    return ''
  }

  const getCommandFailureDetails = (
    response,
    fallbackMessage,
  ) => {
    const commandRoot =
      response?.data?.command ??
      response?.command ??
      response?.data ??
      response ??
      {}

    const resultRoot =
      commandRoot?.result ??
      response?.result ??
      {}

    const title =
      findFirstMeaningfulValue(commandRoot, [
        'title',
        'heading',
        'errorTitle',
      ]) ||
      'Tally Voucher Creation Failed'

    const message =
      findFirstMeaningfulValue(commandRoot, [
        'errorMessage',
        'message',
        'error',
        'description',
      ]) ||
      fallbackMessage

    const reason =
      findFirstMeaningfulValue(resultRoot, [
        'reason',
        'rejectionReason',
        'whyRejected',
        'rejectedReason',
      ]) ||
      message

    const action =
      findFirstMeaningfulValue(resultRoot, [
        'action',
        'recommendedAction',
        'fix',
        'nextAction',
        'whatToDo',
      ]) ||
      'Please review the voucher details and try again.'

    const technicalDetails =
      findFirstMeaningfulValue(commandRoot, [
        'technicalDetails',
        'technical_details',
        'exceptions',
        'exception',
        'errors',
      ]) ||
      'Tally reported an exception during voucher creation.'

    const voucherDetails =
      resultRoot?.voucherDetails ||
      commandRoot?.voucherDetails ||
      {}

    const exceptionCount =
      Array.isArray(response?.exceptions)
        ? response.exceptions.length
        : Array.isArray(response?.data?.exceptions)
          ? response.data.exceptions.length
          : Array.isArray(commandRoot?.exceptions)
            ? commandRoot.exceptions.length
            : 0

    return {
      title,
      message,
      reason,
      action,
      voucherDetails,
      technicalDetails:
        exceptionCount > 0
          ? `Tally reported ${exceptionCount} exception(s) during voucher creation.`
          : technicalDetails,
    }
  }

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    const form =
      event.currentTarget

    setSubmitError(null)
    setShowSuccessAnimation(false)
    setSubmitMessage('')

    const values =
      Object.fromEntries(
        new FormData(
          form,
        ).entries(),
      )

    const journalPartyName = journalRows.find(
      (row) => row.partyName.trim(),
    )?.partyName || ''

    const submittedPartyName = isJournalStyleVoucher
      ? journalPartyName
      : values.partyName

    const voucherType =
      values.voucherType ||
      (isSalesInvoice ? 'Sales' : defaultVoucherType)

    const validationError = (message) => ({
      title: 'Check Voucher Details',
      message,
      reason: message,
      action: 'Complete the highlighted voucher fields and try again.',
      voucherDetails: {
        voucherType,
        voucherNumber: values.voucherNumber || '',
        party: submittedPartyName || '',
        date: values.date || '',
        company: requestCompanyId || '',
      },
      technicalDetails: 'The voucher was not submitted because required fields are missing or invalid.',
    })

    if (!accessToken) {
      setSubmitError(validationError('Your session has expired. Please sign in again.'))
      return
    }

    if (!requestCompanyId) {
      setSubmitError(validationError('Please select a company before creating a voucher.'))
      return
    }

    if (!voucherType || voucherType === 'Select Voucher Type') {
      setSubmitError(validationError('Select a voucher type.'))
      return
    }

    if (!isStockJournal && !submittedPartyName?.trim()) {
      setSubmitError(validationError('Select a party ledger.'))
      return
    }

    if (!values.date) {
      setSubmitError(validationError('Select a voucher date.'))
      return
    }

    if (Number.isNaN(Date.parse(values.date))) {
      setSubmitError(validationError('Enter a valid voucher date.'))
      return
    }

    if (!values.voucherNumber?.trim()) {
      setSubmitError(validationError('Enter a voucher number.'))
      return
    }

    if ((isSalesInvoice || isSalesOrder || title === 'Quotation' || title === 'Purchase' || title === 'Purchase Order' || isNoteVoucher) && !values.ledgerType?.trim()) {
      setSubmitError(validationError('Select a ledger type.'))
      return
    }

    if (isJournalStyleVoucher) {
      const invalidJournalRow = journalRows.find((row) => {
        const amount = Number(row.amount)
        return !row.type || !row.partyName.trim() || !Number.isFinite(amount) || amount <= 0
      })

      if (invalidJournalRow) {
        setSubmitError(validationError('Complete each journal row with a type, party, and amount greater than 0.'))
        return
      }
    }

    if (isStockJournal) {
      const stockRows = [...sourceRows, ...destinationRows]
      const invalidStockRow = stockRows.find((row) => {
        const quantity = Number(row.qty)
        const rate = Number(row.rate || 0)
        return !row.item?.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(rate) || rate < 0
      })

      if (invalidStockRow) {
        setSubmitError(validationError('Complete each stock row with an item, quantity greater than 0, and a valid rate.'))
        return
      }
    }

    const itemBasedVoucher = [
      'Sales',
      'Sales Order',
      'Quotation',
      'Purchase',
      'Purchase Order',
      'Delivery Note',
      'Receipt Note',
      'Credit Note',
      'Debit Note',
    ].includes(title)

    if (itemBasedVoucher) {
      const invalidRow = itemRows.find((row) => {
        const quantity = Number(row.quantity)
        const rate = Number(row.rate || 0)
        const discount = Number(row.discount || 0)
        return !row.item?.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(rate) || rate < 0 || !Number.isFinite(discount) || discount < 0 || discount > 100
      })

      if (invalidRow) {
        setSubmitError(validationError('Complete each item with a quantity greater than 0, a valid rate, and a discount between 0 and 100.'))
        return
      }
    }

    setIsSubmitting(true)

    const items = isStockJournal
      ? {
          source: sourceRows.map((row) => ({ ...row, quantity: Number(row.qty) || 0, amount: (Number(row.qty) || 0) * (Number(row.rate) || 0) })),
          destination: destinationRows.map((row) => ({ ...row, quantity: Number(row.qty) || 0, amount: (Number(row.qty) || 0) * (Number(row.rate) || 0) })),
        }
      : isJournalStyleVoucher
      ? journalRows.map((row) => ({
          type: row.type,
          partyName: row.partyName,
          amount: Number(row.amount) || 0,
        }))
      : itemRows.map(
      (row) => ({
        itemName:
          row.item || '',
        quantity:
          Number(row.quantity) ||
          0,
        rate:
          Number(row.rate) || 0,
        units:
          row.units || '',
        discount:
          Number(row.discount) ||
          0,
        hsnCode:
          row.hsnCode || '',
        godown:
          row.godown || '',
        description:
          row.description || '',
        amount:
          calculateRowAmount(
            row,
          ),
        taxInclusive:
          Boolean(
            row.taxInclusive,
          ),
      }),
    )

    const command = {
      type: 'CREATE_VOUCHER',

      payload: {
        voucherType,

        partyLedger:
          submittedPartyName || '',

        ledgerType:
          values.ledgerType || '',

        date:
          values.date || '',

        voucherNumber:
          values.voucherNumber || '',

        items,

        narration:
          values.narration || '',

        referenceNumber:
          values.referenceNumber || '',

        referenceDate:
          values.referenceDate || '',

        orderType:
          values.orderType || '',

        orderNumber:
          values.orderNumber || '',

        orderDate:
          values.orderDate || '',

        reasonForReturn:
          values.reasonForReturn || '',
      },
    }

    try {
      const commandResponse =
        await postCompanyCommand(
          accessToken,
          requestCompanyId,
          command,
        )

      const commandId =
        extractCommandId(
          commandResponse,
        )

      let latestStatus = ''
      let latestStatusResponse = null

      if (commandId) {
        for (
          let attempt = 0;
          attempt < 10;
          attempt += 1
        ) {
          if (attempt > 0) {
            await new Promise(
              (resolve) =>
                window.setTimeout(
                  resolve,
                  1000,
                ),
            )
          }

          const statusResponse =
            await fetchCommandStatus(
              accessToken,
              commandId,
            )

          latestStatusResponse =
            statusResponse
          latestStatus =
            extractCommandStatus(
              statusResponse,
            )

          const normalizedStatus =
            latestStatus.toLowerCase()

          if (
            [
              'completed',
              'complete',
              'success',
              'succeeded',
              'failed',
              'failure',
              'error',
              'cancelled',
            ].includes(
              normalizedStatus,
            )
          ) {
            break
          }
        }
      }

      const normalizedLatestStatus =
        latestStatus.toLowerCase()

      if (
        [
          'failed',
          'failure',
          'error',
          'cancelled',
        ].includes(
          normalizedLatestStatus,
        )
      ) {
        setSubmitError(
          getCommandFailureDetails(
            latestStatusResponse,
            `${voucherType} voucher submission failed.`,
          ),
        )
        return
      }

      if (!latestStatus) {
        setSubmitMessage(
          `${voucherType} voucher submitted.`,
        )
      }

      form.reset()

      setSelectedParty('')
      setSelectedVoucherNumber(
        '',
      )
      setJournalRows([createJournalRow(1)])
      setSourceRows([createStockJournalRow(1)])
      setDestinationRows([createStockJournalRow(2)])

      resetItemRows()

      setShowSuccessAnimation(true)

      if (successTimerRef.current) {
        window.clearTimeout(
          successTimerRef.current,
        )
      }

      successTimerRef.current =
        window.setTimeout(() => {
          setShowSuccessAnimation(false)
        }, 1600)
    } catch (error) {
      setSubmitError(
        getCommandFailureDetails(
          error,
          error?.message ||
            'Unable to create sales invoice.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClear = (
    event,
  ) => {
    const form =
      event.currentTarget.form

    form?.reset()

    setSelectedParty('')
    setSelectedVoucherNumber(
      '',
    )

    resetItemRows()

    setSubmitMessage('')
    setSubmitError(null)
  }

  const failedVoucherDetails =
    submitError?.voucherDetails || {}

  const failedVoucherType =
    failedVoucherDetails.voucherType ||
    selectedVoucherType ||
    'Sales'

  const failedVoucherNumber =
    failedVoucherDetails.voucherNumber ||
    selectedVoucherNumber

  const failedParty =
    failedVoucherDetails.party ||
    selectedParty ||
    'Cash'

  const failedAmount =
    failedVoucherDetails.amount ??
    subtotal

  const failedCompany =
    failedVoucherDetails.company ||
    requestCompanyId ||
    'Company'

  const failedDate =
    failedVoucherDetails.date ||
    defaultDate

  return (
    <div className="voucher-page-animate relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-3 text-slate-900 sm:p-5">
      {showPageLoader && (
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
              {isSubmitting
                ? 'Creating voucher...'
                : showSuccessAnimation
                  ? 'Voucher created successfully!'
                  : 'Loading ...'}
            </span>
          </div>
        </div>
      )}

      {submitError && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-[1100px] overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between bg-[#f44336] px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/15 text-lg font-bold">
                  !
                </div>

                <span className="text-[15px] font-bold">
                  {submitError.title}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSubmitError(null)
                }
                className="text-lg font-bold text-white/90 transition hover:text-white"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-4">
              <div className="rounded-lg border border-red-200 bg-red-100/50 px-4 py-3 text-sm text-red-800">
                {submitError.message}
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Voucher
                  </div>

                  <div className="font-medium text-slate-800">
                    {failedVoucherType}{' '}
                    {failedVoucherNumber
                      ? `#${failedVoucherNumber}`
                      : ''}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Party/Customer
                  </div>

                  <div className="font-medium text-slate-800">
                    {failedParty}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Amount
                  </div>

                  <div className="font-medium text-slate-800">
                    ₹{Number(failedAmount || 0).toFixed(2)}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Company
                  </div>

                  <div className="font-medium text-slate-800">
                    {failedCompany}
                  </div>
                </div>

                <div className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs text-slate-700">
                  <div className="mb-1 font-semibold text-slate-500">
                    Date
                  </div>

                  <div className="font-medium text-slate-800">
                    {failedDate}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-white p-4">
                <h3 className="mb-2 text-base font-bold text-red-700">
                  Why Tally Rejected This Entry:
                </h3>

                <p className="text-sm leading-6 text-slate-700">
                  {submitError.reason}
                </p>
              </div>

              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="mb-2 text-base font-bold text-sky-700">
                  What You Need To Do Fix It:
                </h3>

                <p className="text-sm leading-6 text-slate-700">
                  {submitError.action}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-100/50 px-4 py-3 text-xs text-red-700">
                <span>
                  Technical Details: {submitError.technicalDetails}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSubmitError(null)
                  }
                  className="rounded-lg bg-[#1a1f24] px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative z-0 mx-auto max-w-[1440px] overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.06)]"
      >
        {/* Header */}
        <div className="flex min-h-14 items-center bg-[#63c45d] px-4 py-3 text-[17px] font-bold text-white sm:px-5 sm:py-4">
          {isJournalStyleVoucher ? `Create ${title}` : `Create ${title} Voucher`}
        </div>

        <div className="bg-[#f5f7f4] p-3 sm:p-5">
          {isStockJournal ? (
            <StockJournalVoucherContent
              sourceRows={sourceRows}
              destinationRows={destinationRows}
              stockItems={stockItems}
              batches={batches}
              itemOptions={itemOptions}
              godownOptions={godownOptions}
              optionsLoading={isOptionsLoading}
              onAddSource={() => addStockRow(setSourceRows)}
              onAddDestination={() => addStockRow(setDestinationRows)}
              onRemoveSource={(rowId) => removeStockRow(setSourceRows, rowId)}
              onRemoveDestination={(rowId) => removeStockRow(setDestinationRows, rowId)}
              onSourceChange={(rowId, field, value) => updateStockRow(setSourceRows, rowId, field, value)}
              onDestinationChange={(rowId, field, value) => updateStockRow(setDestinationRows, rowId, field, value)}
            />
          ) : isJournalStyleVoucher ? (
            <JournalVoucherContent
              voucherType={title}
              rows={journalRows}
              partyOptions={partyLedgerOptions}
              optionsLoading={isOptionsLoading}
              onAddRow={addJournalRow}
              onRemoveRow={removeJournalRow}
              onRowChange={updateJournalRow}
            />
          ) : (
            <>
          {/* Voucher Details */}
          <div
            className={`grid items-start gap-3 sm:grid-cols-2 ${
              isSalesInvoice ||
              isSalesOrder ||
              title === 'Purchase'
                ? 'xl:grid-cols-3'
                : title === 'Receipt Note' || title === 'Delivery Note'
                  ? 'xl:grid-cols-5'
                : 'xl:grid-cols-4'
            }`}
          >
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>
                Voucher Type
              </span>

              <input
                name="voucherType"
                value={defaultVoucherType}
                readOnly
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                placeholder="Select Voucher Type"
              />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>
                Party Name
              </span>

              <div className="relative">
                {title === 'Quotation' ||
                isSalesInvoice ||
                isSalesOrder ? (
                  <SearchableDropdown
                    name="partyName"
                    label="parties"
                    options={
                      partyOptions
                    }
                    placeholder="Select Party"
                    loading={
                      isOptionsLoading
                    }
                    value={
                      selectedParty
                    }
                    resetToken={
                      clearToken
                    }
                    onSelect={(
                      party,
                    ) => {
                      setSelectedParty(
                        party,
                      )

                      setSelectedVoucherNumber(
                        findVoucherNumberForParty(
                          party,
                        ),
                      )
                    }}
                    onClear={() => {
                      setSelectedParty(
                        '',
                      )

                      setSelectedVoucherNumber(
                        '',
                      )
                    }}
                  />
                ) : (
                  <select
                    name="partyName"
                    defaultValue=""
                    className="min-h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">
                      {isOptionsLoading
                        ? 'Loading parties...'
                        : 'Select Party'}
                    </option>

                    {customerOptions.map(
                      (name) => (
                        <option
                          key={name}
                          value={
                            name
                          }
                        >
                          {name}
                        </option>
                      ),
                    )}
                  </select>
                )}
              </div>
            </label>

            {(title === 'Receipt Note' || title === 'Delivery Note') && (
              <>
                <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                  <span>Order Type</span>
                  <SearchableDropdown name="orderType" label="order types" options={voucherTypeOptions} placeholder="Select ref" loading={isOptionsLoading} resetToken={clearToken} />
                </label>
                <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                  <span>Order Number</span>
                  <input name="orderNumber" type="text" placeholder="Order Number" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </label>
                <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                  <span>Order Date</span>
                  <input name="orderDate" type="date" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                </label>
              </>
            )}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>
                Voucher No
              </span>

              {title === 'Quotation' ||
              isSalesInvoice ? (
                <SearchableDropdown
                  name="voucherNumber"
                  label="voucher numbers"
                  options={
                    voucherNumberOptions
                  }
                  placeholder="Voucher number"
                  loading={
                    isOptionsLoading
                  }
                  value={
                    selectedVoucherNumber
                  }
                  resetToken={
                    clearToken
                  }
                  disabled
                />
              ) : (
                <input
                  name="voucherNumber"
                  type="text"
                  defaultValue=""
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Voucher Number"
                />
              )}
            </label>

            {(title === 'Quotation' ||
              isSalesInvoice ||
              isSalesOrder ||
              title === 'Purchase' ||
              title === 'Purchase Order' ||
              isNoteVoucher) && (
              <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                <span>
                  Ledger Type
                </span>

                <SearchableDropdown
                  name="ledgerType"
                  label="ledger types"
                  options={
                    ledgerTypeOptions
                  }
                  placeholder="Select Ledger"
                  loading={
                    isOptionsLoading
                  }
                  resetToken={
                    clearToken
                  }
                />
              </label>
            )}

            {isNoteVoucher && (
              <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                <span>Reason For Return</span>
                <SearchableDropdown
                  name="reasonForReturn"
                  label="return reasons"
                  options={[
                    'Sales Return',
                    'Damaged Goods',
                    'Wrong Item',
                    'Other',
                  ]}
                  placeholder="Select Reason for return"
                  loading={isOptionsLoading}
                  resetToken={clearToken}
                />
              </label>
            )}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>

              <div className="relative">
                <input
                  name="date"
                  type="date"
                  defaultValue={
                    defaultDate
                  }
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🗓
                </span>

                {title === 'Quotation' && (
                  <button
                    type="button"
                    aria-label="Clear date"
                    onClick={(
                      event,
                    ) => {
                      event.currentTarget.previousElementSibling.value =
                        ''
                    }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                )}

               
              </div>
            </label>
          </div>

          {/* Items Table */}
          <div className="relative z-10 mt-5 overflow-visible rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto lg:overflow-visible">
              <div className="min-w-[1280px] lg:min-w-0">
                {/* Table Header */}
                <div className="grid grid-cols-[1.45fr_.55fr_.7fr_.7fr_.65fr_.9fr_1fr_1.4fr_.9fr_.6fr_.5fr] border-b border-slate-200 bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  <div className="border-r border-slate-200 px-2.5 py-3">
                    Items
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Qty
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Rate
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Units
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Disc %
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    HSN Code
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Godown
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Description
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Amount
                  </div>

                  <div className="border-r border-slate-200 px-2 py-3 text-center">
                    Tax Incl.
                  </div>

                  <button
                    type="button"
                    title="Add new item row"
                    aria-label="Add new item row"
                    onClick={
                      addItemRow
                    }
                    className="flex min-h-full items-center justify-center bg-slate-700 px-2 py-3 text-base font-bold text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    +
                  </button>
                </div>

                {/* Dynamic Rows */}
                {itemRows.map(
                  (row, index) => {
                    const amount =
                      calculateRowAmount(
                        row,
                      )

                    return (
                      <div
                        key={
                          row.id
                        }
                        className={`grid grid-cols-[1.45fr_.55fr_.7fr_.7fr_.65fr_.9fr_1fr_1.4fr_.9fr_.6fr_.5fr] items-stretch border-b border-slate-200 bg-white last:border-b-0 ${
                          index %
                            2 ===
                          1
                            ? 'bg-slate-[25]'
                            : 'bg-white'
                        }`}
                      >
                        {/* Item */}
                        <div className="flex min-w-0 items-center border-r border-slate-200 p-1.5">
                          {title ===
                            'Quotation' ||
                          isSalesInvoice ||
                          isSalesOrder ||
                          title === 'Purchase Order' ||
                          isCreditNote ||
                          isDebitNote ? (
                            <SearchableDropdown
                              name={`item-${row.id}`}
                              label="items"
                              options={
                                isSalesInvoice || isSalesOrder
                                  ? itemOptions
                                  : quotationItemOptions
                              }
                              placeholder={
                                stockError ||
                                'Search item'
                              }
                              loading={
                                isOptionsLoading
                              }
                              value={
                                row.item
                              }
                              onSelect={(
                                itemName,
                              ) =>
                                handleItemSelect(
                                  row.id,
                                  itemName,
                                )
                              }
                              onClear={() =>
                                updateItemRowValues(
                                  row.id,
                                  {
                                    item: '',
                                    rate: '',
                                  },
                                )
                              }
                            />
                          ) : (
                            <select
                              name={`item-${row.id}`}
                              value={
                                row.item
                              }
                              onChange={(
                                event,
                              ) =>
                                handleItemSelect(
                                  row.id,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            >
                              <option value="">
                                {isOptionsLoading
                                  ? 'Loading items...'
                                  : 'Select Item'}
                              </option>

                              {itemOptions.map(
                                (
                                  name,
                                ) => (
                                  <option
                                    key={
                                      name
                                    }
                                    value={
                                      name
                                    }
                                  >
                                    {
                                      name
                                    }
                                  </option>
                                ),
                              )}
                            </select>
                          )}
                        </div>

                        {/* Quantity */}
                        <div className="relative flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`quantity-${row.id}`}
                            type="number"
                            min="0"
                            step="any"
                            value={
                              row.quantity
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'quantity',
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />

                          {row.quantity && (
                            <button
                              type="button"
                              aria-label="Clear quantity"
                              onClick={() =>
                                updateItemRow(
                                  row.id,
                                  'quantity',
                                  '',
                                )
                              }
                              className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Rate */}
                        <div className="relative flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`rate-${row.id}`}
                            type="number"
                            min="0"
                            step="any"
                            value={
                              row.rate
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'rate',
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="0"
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />

                          {row.rate && (
                            <button
                              type="button"
                              aria-label="Clear rate"
                              onClick={() =>
                                updateItemRow(
                                  row.id,
                                  'rate',
                                  '',
                                )
                              }
                              className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Units - Simple Text Input */}
                        <div className="relative flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`units-${row.id}`}
                            type="text"
                            value={
                              row.units
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'units',
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="Units"
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 pr-7 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />

                          {row.units && (
                            <button
                              type="button"
                              aria-label="Clear units"
                              onClick={() =>
                                updateItemRow(
                                  row.id,
                                  'units',
                                  '',
                                )
                              }
                              className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {/* Discount */}
                        <div className="flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`discount-${row.id}`}
                            type="number"
                            min="0"
                            step="any"
                            value={
                              row.discount
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'discount',
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* HSN */}
                        <div className="flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`hsnCode-${row.id}`}
                            value={
                              row.hsnCode
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'hsnCode',
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder=""
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* Godown */}
                        <div className="flex min-w-0 items-center border-r border-slate-200 p-1.5">
                          {title ===
                            'Quotation' ||
                          isSalesInvoice ||
                          isSalesOrder ||
                          title === 'Purchase Order' ||
                          title === 'Receipt Note' ||
                          title === 'Delivery Note' ||
                          isCreditNote ||
                          isDebitNote ? (
                            <SearchableDropdown
                              name={`godown-${row.id}`}
                              label="godowns"
                              options={
                                godownOptions
                              }
                              placeholder="Search Godown"
                              loading={
                                isOptionsLoading
                              }
                              value={
                                row.godown
                              }
                              onSelect={(
                                value,
                              ) =>
                                updateItemRow(
                                  row.id,
                                  'godown',
                                  value,
                                )
                              }
                              onClear={() =>
                                updateItemRow(
                                  row.id,
                                  'godown',
                                  '',
                                )
                              }
                            />
                          ) : (
                            <input
                              name={`godown-${row.id}`}
                              value={
                                row.godown
                              }
                              onChange={(
                                event,
                              ) =>
                                updateItemRow(
                                  row.id,
                                  'godown',
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder="Search Godown"
                              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                          )}
                        </div>

                        {/* Description */}
                        <div className="flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`description-${row.id}`}
                            value={
                              row.description
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'description',
                                event
                                  .target
                                  .value,
                              )
                            }
                            placeholder="Enter Notes"
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* Amount */}
                        <div className="relative flex items-center border-r border-slate-200 p-1.5">
                          <input
                            name={`amount-${row.id}`}
                            type="number"
                            value={
                              amount
                            }
                            readOnly
                            className="h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-medium text-slate-700 outline-none"
                          />

                          <button
                            type="button"
                            aria-label="Clear amount"
                            onClick={() =>
                              updateItemRowValues(
                                row.id,
                                {
                                  quantity:
                                    '',
                                  rate: '',
                                },
                              )
                            }
                            className="absolute right-2 text-sm text-slate-400 hover:text-slate-700"
                          >
                            ×
                          </button>
                        </div>

                        {/* Tax Inclusive */}
                        <div className="flex items-center justify-center border-r border-slate-200 p-1.5">
                          <input
                            name={`taxInclusive-${row.id}`}
                            type="checkbox"
                            title="Add 18% GST"
                            checked={
                              row.taxInclusive
                            }
                            onChange={(
                              event,
                            ) =>
                              updateItemRow(
                                row.id,
                                'taxInclusive',
                                event
                                  .target
                                  .checked,
                              )
                            }
                            className="h-4 w-4 cursor-pointer accent-green-600"
                          />
                        </div>

                        {/* Delete */}
                        <div className="flex items-center justify-center p-1.5">
                          <button
                            type="button"
                            aria-label={`Delete item row ${
                              index + 1
                            }`}
                            title="Delete row"
                            onClick={() =>
                              deleteItemRow(
                                row.id,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </div>

            {/* Add Row Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2">
              <span className="text-xs text-slate-500">
                {itemRows.length}{' '}
                {itemRows.length === 1
                  ? 'item row'
                  : 'item rows'}
              </span>

              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <span className="text-sm leading-none">
                  +
                </span>
                Add Item
              </button>
            </div>
          </div>

          <VoucherBottomSection subtotal={subtotal} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 bg-[#f5f7f4] px-3 pb-4 pt-0 sm:flex-row sm:items-center sm:justify-end sm:px-5 sm:pb-5">
          {submitMessage && (
            <p className="text-center text-sm text-slate-600 sm:text-right">
              {submitMessage}
            </p>
          )}

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {title === 'Quotation' && (
              <button
                type="button"
                onClick={
                  handleClear
                }
                disabled={
                  isSubmitting
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" aria-hidden="true" />
                  Creating...
                </span>
              ) : (
                isJournalStyleVoucher ? `Create ${title}` : 'Create Voucher'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function createStockJournalRow(id = Date.now()) {
  return {
    id,
    item: '',
    qty: '',
    rate: '',
    godown: '',
    batch: '',
  }
}

function getStockFieldValue(entry, keys) {
  const candidates = [entry, entry?.data, entry?.payload, entry?.item]
  const normalizedKeys = keys.map((key) => key.toLowerCase().replace(/[^a-z0-9]/g, ''))

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue
    const matchingKey = Object.keys(candidate).find((key) => normalizedKeys.includes(key.toLowerCase().replace(/[^a-z0-9]/g, '')))
    if (matchingKey && candidate[matchingKey] !== null && candidate[matchingKey] !== undefined) return String(candidate[matchingKey]).trim()
  }

  return ''
}

function StockJournalSide({
  title,
  rows,
  stockItems,
  batches,
  itemOptions,
  godownOptions,
  optionsLoading,
  onAddRow,
  onRemoveRow,
  onRowChange,
}) {
  const batchOptionsFor = (itemName) => batches
    .filter((batch) => {
      const batchItem = getStockFieldValue(batch, ['itemName', 'item_name', 'stockName', 'stock_name', 'stockItemName', 'stock_item_name', 'item'])
      return !batchItem || batchItem.toLowerCase() === String(itemName || '').toLowerCase()
    })
    .map((batch) => getStockFieldValue(batch, ['batchName', 'batch_name', 'batchNo', 'batch_no', 'batch', 'batchNumber', 'batch_number', 'name', 'displayName']))
    .concat(stockItems
      .filter((item) => getStockFieldValue(item, ['itemName', 'item_name', 'stockName', 'stock_name', 'stockItemName', 'stock_item_name', 'item']).toLowerCase() === String(itemName || '').toLowerCase())
      .map((item) => getStockFieldValue(item, ['batchName', 'batch_name', 'batchNo', 'batch_no', 'batch', 'batchNumber', 'batch_number'])))
    .filter((value, index, values) => value && values.indexOf(value) === index)

  return (
    <div className="flex min-h-[360px] flex-col overflow-hidden border border-slate-200 bg-[#f5f7f4]">
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 px-3 text-xs font-semibold text-slate-800">
        <span>{title}</span>
        <button type="button" onClick={onAddRow} className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300">
          <span className="text-sm leading-none">+</span>
          Add Item
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto">
        <div className="min-w-[760px] xl:min-w-0">
          <div className="grid grid-cols-[minmax(115px,1.15fr)_minmax(48px,.55fr)_minmax(52px,.6fr)_minmax(78px,.8fr)_minmax(88px,.9fr)_minmax(70px,.7fr)_28px] gap-1 bg-slate-100 p-1.5 text-[10px] font-semibold text-slate-700">
            <span>Items</span><span>Qty</span><span>Rate</span><span>Godown</span><span>Batch Name</span><span>Amount</span><span />
          </div>
          {rows.map((row) => {
            const amount = (Number(row.qty) || 0) * (Number(row.rate) || 0)
            return (
              <div key={row.id} className="grid grid-cols-[minmax(115px,1.15fr)_minmax(48px,.55fr)_minmax(52px,.6fr)_minmax(78px,.8fr)_minmax(88px,.9fr)_minmax(70px,.7fr)_28px] gap-1 border-t border-slate-200 bg-white p-1.5">
                <SearchableDropdown name={`stockItem-${row.id}`} label="items" options={itemOptions} loading={optionsLoading} value={row.item} onSelect={(value) => onRowChange(row.id, 'item', value)} onClear={() => onRowChange(row.id, 'item', '')} placeholder="Search Item" />
                <input type="number" min="0" value={row.qty} onChange={(event) => onRowChange(row.id, 'qty', event.target.value)} className="min-h-9 rounded border border-slate-300 px-2 text-xs outline-none" placeholder="0" />
                <input type="number" min="0" value={row.rate} onChange={(event) => onRowChange(row.id, 'rate', event.target.value)} className="min-h-9 rounded border border-slate-300 px-2 text-xs outline-none" placeholder="0" />
                <SearchableDropdown name={`stockGodown-${row.id}`} label="godowns" options={godownOptions} loading={optionsLoading} value={row.godown} onSelect={(value) => onRowChange(row.id, 'godown', value)} onClear={() => onRowChange(row.id, 'godown', '')} placeholder="Select" />
                <SearchableDropdown name={`stockBatch-${row.id}`} label="batches" options={batchOptionsFor(row.item)} loading={optionsLoading} value={row.batch} onSelect={(value) => onRowChange(row.id, 'batch', value)} onClear={() => onRowChange(row.id, 'batch', '')} placeholder="Select" />
                <input readOnly value={amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} className="min-h-9 rounded border border-slate-300 bg-slate-50 px-2 text-xs outline-none" />
                <button type="button" onClick={() => onRemoveRow(row.id)} disabled={rows.length === 1} className="text-red-500 disabled:opacity-40" aria-label="Remove row">×</button>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

function StockJournalVoucherContent({
  sourceRows,
  destinationRows,
  stockItems,
  batches,
  itemOptions,
  godownOptions,
  optionsLoading,
  onAddSource,
  onAddDestination,
  onRemoveSource,
  onRemoveDestination,
  onSourceChange,
  onDestinationChange,
}) {
  const totalQuantity = [...sourceRows, ...destinationRows].reduce((sum, row) => sum + (Number(row.qty) || 0), 0)
  const totalAmount = [...sourceRows, ...destinationRows].reduce((sum, row) => sum + ((Number(row.qty) || 0) * (Number(row.rate) || 0)), 0)

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700"><span>Voucher Type</span><input name="voucherType" value="Stock Journal" readOnly className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs" /></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700"><span>Voucher No</span><input name="voucherNumber" defaultValue="1" className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs" /></label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700"><span>Date</span><input name="date" type="date" defaultValue={new Date().toLocaleDateString('en-CA')} className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs" /></label>
      </div>

      <div className="mt-4 grid items-stretch gap-2 xl:grid-cols-2">
        <StockJournalSide title="Source (Consumption)" rows={sourceRows} stockItems={stockItems} batches={batches} itemOptions={itemOptions} godownOptions={godownOptions} optionsLoading={optionsLoading} onAddRow={onAddSource} onRemoveRow={onRemoveSource} onRowChange={onSourceChange} />
        <StockJournalSide title="Destination (Production)" rows={destinationRows} stockItems={stockItems} batches={batches} itemOptions={itemOptions} godownOptions={godownOptions} optionsLoading={optionsLoading} onAddRow={onAddDestination} onRemoveRow={onRemoveDestination} onRowChange={onDestinationChange} />
      </div>

      <div className="mt-3 flex justify-between bg-[#e8f7ea] px-3 py-2 text-[11px] font-semibold text-slate-700"><span>TOTAL</span><span>Qty {totalQuantity}</span><span>Amount ₹{totalAmount.toFixed(2)}</span></div>
      <label className="mt-4 flex flex-col gap-1 text-xs font-medium text-slate-700"><span>Narration</span><textarea name="narration" rows="2" placeholder="Enter narration" className="rounded border border-slate-300 bg-white px-2 py-2 text-xs outline-none" /></label>
    </>
  )
}