import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractStockItems,
  extractCommandId,
  extractCommandStatus,
  extractGodowns,
  extractLedgers,
  extractVouchers,
  extractVoucherTypes,
  fetchCommandStatus,
  fetchCompanyLedgers,
  fetchCompanyGodowns,
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

function SearchableDropdown({
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
        !dropdownRef.current.contains(event.target)
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

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-slate-200 bg-white p-1 shadow-xl">
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
        </div>
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
  const [showSuccessAnimation, setShowSuccessAnimation] =
    useState(false)

  const [customers, setCustomers] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [vouchers, setVouchers] = useState([])
  const [ledgers, setLedgers] = useState([])
  const [godowns, setGodowns] = useState([])
  const [voucherTypes, setVoucherTypes] = useState([])

  const [selectedParty, setSelectedParty] = useState('')
  const [selectedVoucherNumber, setSelectedVoucherNumber] =
    useState('')
  const [selectedVoucherType, setSelectedVoucherType] =
    useState('Sales')

  const [itemRows, setItemRows] = useState([
    createEmptyItemRow(),
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
      setVoucherTypes([])
      setSelectedParty('')
      setSelectedVoucherNumber('')
      setSelectedVoucherType('Sales')
      setItemRows([createEmptyItemRow()])
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

    if (isSalesInvoice) {
      requests.push(
        fetchCompanyVoucherTypes(
          accessToken,
          requestCompanyId,
        ),
      )
    } else {
      requests.push(Promise.resolve(null))
    }

    Promise.allSettled(requests)
      .then(
        ([
          customersResult,
          stockResult,
          vouchersResult,
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
    isSalesInvoice &&
    voucherTypeOptions.length === 0
  ) {
    voucherTypeOptions.push('Sales')
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
    quotationPartyOptions

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

    return Math.max(
      0,
      quantity * rate * discountMultiplier,
    )
  }

  const subtotal = itemRows.reduce(
    (total, row) =>
      total + calculateRowAmount(row),
    0,
  )

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

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    const form =
      event.currentTarget

    setShowSuccessAnimation(false)
    setIsSubmitting(true)
    setSubmitMessage('')

    const values =
      Object.fromEntries(
        new FormData(
          form,
        ).entries(),
      )

    const voucherType =
      values.voucherType ||
      (isSalesInvoice ? 'Sales' : 'Quotation')

    const items = itemRows.map(
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
          values.partyName || '',

        ledgerType:
          values.ledgerType || '',

        date:
          values.date || '',

        voucherNumber:
          values.voucherNumber || '',

        items,

        narration:
          values.narration || '',
      },
    }

    if (!isSalesInvoice) {
      form.reset()
      setSelectedParty('')
      setSelectedVoucherNumber('')
      resetItemRows()
      setSubmitMessage('')
      setIsSubmitting(false)
      return
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

      if (commandId) {
        let latestStatus =
          ''

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

        if (!latestStatus) {
          setSubmitMessage(
            `${voucherType} voucher submitted.`,
          )
        }
      } else {
        setSubmitMessage(
          `${voucherType} voucher submitted, but command status is unavailable.`,
        )
      }

      form.reset()

      setSelectedParty('')
      setSelectedVoucherNumber(
        '',
      )

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
      setSubmitMessage(
        error?.message ||
          'Unable to create sales invoice.',
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
  }

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
                  : 'Loading Sales Invoice...'}
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="relative z-0 mx-auto max-w-[1440px] overflow-visible rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.06)]"
      >
        {/* Header */}
        <div className="flex min-h-14 items-center bg-[#63c45d] px-4 py-3 text-[17px] font-bold text-white sm:px-5 sm:py-4">
          Create {title} Voucher
        </div>

        <div className="bg-[#f5f7f4] p-3 sm:p-5">
          {/* Voucher Details */}
          <div
            className={`grid items-start gap-3 sm:grid-cols-2 ${
              isSalesInvoice
                ? 'xl:grid-cols-3'
                : 'xl:grid-cols-4'
            }`}
          >
            {title !== 'Quotation' && (
              <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
                <span>
                  Voucher Type
                </span>

                {isSalesInvoice ? (
                  <SearchableDropdown
                    name="voucherType"
                    label="voucher types"
                    options={voucherTypeOptions}
                    placeholder="Select Voucher Type"
                    loading={isOptionsLoading}
                    value={selectedVoucherType}
                    resetToken={clearToken}
                    onSelect={setSelectedVoucherType}
                    onClear={() => setSelectedVoucherType('')}
                  />
                ) : (
                  <input
                    name="voucherType"
                    value="Sales"
                    readOnly
                    className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    placeholder="Select Voucher Type"
                  />
                )}
              </label>
            )}

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>
                {title === 'Quotation'
                  ? 'Party Name'
                  : 'Party Ledger'}
              </span>

              <div className="relative">
                {title === 'Quotation' ||
                isSalesInvoice ? (
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
                  defaultValue=""
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Voucher Number"
                />
              )}
            </label>

            {(title === 'Quotation' ||
              isSalesInvoice) && (
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

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🗓
                </span>
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
                          isSalesInvoice ? (
                            <SearchableDropdown
                              name={`item-${row.id}`}
                              label="items"
                              options={
                                isSalesInvoice
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
                            placeholder="Search HSN"
                            className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                          />
                        </div>

                        {/* Godown */}
                        <div className="flex min-w-0 items-center border-r border-slate-200 p-1.5">
                          {title ===
                            'Quotation' ||
                          isSalesInvoice ? (
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

          {/* Sales Invoice Bottom Section */}
          {isSalesInvoice ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
              <div className="space-y-2">
                <details
                  open
                  className="group rounded-md bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
                    Narration

                    <span className="text-lg leading-none transition group-open:rotate-90">
                      ›
                    </span>
                  </summary>

                  <div className="relative p-3">
                    <textarea
                      name="narration"
                      rows="3"
                      className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                      placeholder="sales invoice"
                    />

                    <button
                      type="button"
                      aria-label="Clear narration"
                      onClick={(event) => {
                        event.currentTarget.previousElementSibling.value =
                          ''
                      }}
                      className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </div>
                </details>

                <details className="rounded-md bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-medium text-slate-800">
                    Advanced Settings

                    <span className="text-lg leading-none">
                      ›
                    </span>
                  </summary>
                </details>
              </div>

              <div className="rounded-md bg-white p-3">
                <button
                  type="button"
                  className="mb-3 text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  + Add GST And Other Ledgers
                </button>

                <div className="space-y-2 bg-green-50 p-3 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>
                      Sub Total
                    </span>

                    <span>
                      ₹
                      {subtotal.toFixed(
                        2,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      Taxes
                    </span>

                    <span>
                      ₹0
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between border-t border-green-100 pt-3 text-base font-bold text-slate-900">
                    <span>
                      Grand Total
                    </span>

                    <span>
                      ₹
                      {subtotal.toFixed(
                        2,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <label className="flex flex-col gap-1 text-[12px] font-medium text-slate-700">
                <span>
                  Narration
                </span>

                <div className="relative">
                  <textarea
                    name="narration"
                    rows="3"
                    className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    placeholder="quotation invoice"
                  />

                  <button
                    type="button"
                    aria-label="Clear narration"
                    onClick={(event) => {
                      event.currentTarget.previousElementSibling.value =
                        ''
                    }}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </div>
              </label>
            </div>
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
                'Create Voucher'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}