import { useEffect, useMemo, useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'
import useAuthStore from '../store/authStore'

import {
  extractCustomerPagination,
  extractCustomers,
  extractCustomerTotal,
  extractSuppliers,
  fetchCustomers,
  fetchSuppliers,
} from '../services/customersApi'

import {
  extractSales,
  extractSalesPagination,
  fetchCompanySales,
  extractCreditNotePagination,
  extractCreditNotes,
  fetchCompanyCreditNotes,
  extractReceiptPagination,
  extractReceipts,
  fetchCompanyReceipts,
  extractReceiptNotePagination,
  extractReceiptNotes,
  fetchCompanyReceiptNotes,
  extractSalesOrderPagination,
  extractSalesOrders,
  fetchCompanySalesOrders,
  extractDeliveryNotePagination,
  extractDeliveryNotes,
  fetchCompanyDeliveryNotes,
  extractDebitNotePagination,
  extractDebitNotes,
  fetchCompanyDebitNotes,
  extractPaymentPagination,
  extractPayments,
  fetchCompanyPayments,
  extractPurchaseOrderPagination,
  extractPurchaseOrders,
  fetchCompanyPurchaseOrders,
  extractCash,
  extractCashPagination,
  fetchCompanyCash,
  extractBank,
  extractBankPagination,
  fetchCompanyBank,
} from '../services/companiesApi'

import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircle,
  Search,
} from 'lucide-react'

// ============================================================
// REPORT DATA
// ============================================================

const reports = {
  '/sales': {
    title: 'Sales',
    total: 'Total Sales:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  '/purchase': {
    title: 'Purchase',
    total: 'Total Purchase:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  '/purchaseorder': {
    title: 'Purchase Order',
    total: 'Total Purchase Order:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  '/payables': {
    title: 'Sundry Creditors',
    total: 'Total Payables:',
    mode: 'receivables',
    resource: 'suppliers',
    columns: [
      'Name',
      'Credit Days',
      'Average Pay Days',
      'Due Amount',
    ],
    rows: [
      [
        'CS Vaibhav Aggarwal',
        '0',
        '0.00 days',
        '₹ 6,000.00',
      ],
      [
        'Rajiv Abhishek & Associates',
        '1 Days',
        '0.00 days',
        '₹ 11,800.00',
      ],
    ],
  },

  '/payments': {
    title: 'Payment',
    total: 'Total Payment:',
    mode: 'payment',
    columns: ['Month', 'Amount'],
  },

  '/debitnote': {
    title: 'Debit Notes',
    total: 'Total Debit Notes:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  '/creditnote': {
    title: 'Credit Note',
    total: 'Total Credit Note:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  // ==========================================================
  // RECEIVABLES
  // ==========================================================

  '/receivables': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: [
      '#',
      'Customer Name',
      'Outstanding',
      'Overdue',
      'Credit Days',
      'Avg Pay Days',
      'Action',
    ],
    rows: [
      [
        '1',
        'ANNAI IRUN STEEL',
        '₹ 4,13,19,191.90',
        '₹ 4,13,19,191.90',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '2',
        'Jd Enterprises',
        '₹ 73,44,372.75',
        '₹ 73,44,372.75',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '3',
        'Margadarsi Chits P Ltd',
        '₹ 53,09,351.00',
        '₹ 53,09,351.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '4',
        'THOMAS IYADURAI INFRASTRUCTURE PVT LTD',
        '₹ 47,05,017.00',
        '₹ 47,05,017.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '5',
        'M K GOPI',
        '₹ 37,35,100.00',
        '₹ 37,35,100.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '6',
        'R A S AGENCIES',
        '₹ 35,29,070.00',
        '₹ 35,29,070.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '7',
        'Sri Ganesh Balaji Traders',
        '₹ 34,13,514.56',
        '₹ 34,13,514.56',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '8',
        'MADHA AGENCY',
        '₹ 25,48,266.00',
        '₹ 25,48,266.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '9',
        'SRIDEV ASSOCIATES',
        '₹ 20,51,865.15',
        '₹ 20,51,865.15',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '10',
        'AVB ENTERPRISES',
        '₹ 12,41,220.30',
        '₹ 12,41,220.30',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
    ],
  },

  '/collect-payments': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: [
      '#',
      'Customer Name',
      'Outstanding',
      'Overdue',
      'Credit Days',
      'Avg Pay Days',
      'Action',
    ],
    rows: [
      [
        '1',
        'ANNAI IRUN STEEL',
        '₹ 4,13,19,191.90',
        '₹ 4,13,19,191.90',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '2',
        'Jd Enterprises',
        '₹ 73,44,372.75',
        '₹ 73,44,372.75',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '3',
        'Margadarsi Chits P Ltd',
        '₹ 53,09,351.00',
        '₹ 53,09,351.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '4',
        'THOMAS IYADURAI INFRASTRUCTURE PVT LTD',
        '₹ 47,05,017.00',
        '₹ 47,05,017.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
    ],
  },

  '/receivablesnew': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: [
      '#',
      'Customer Name',
      'Outstanding',
      'Overdue',
      'Credit Days',
      'Avg Pay Days',
      'Action',
    ],
    rows: [
      [
        '1',
        'ANNAI IRUN STEEL',
        '₹ 4,13,19,191.90',
        '₹ 4,13,19,191.90',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '2',
        'Jd Enterprises',
        '₹ 73,44,372.75',
        '₹ 73,44,372.75',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '3',
        'Margadarsi Chits P Ltd',
        '₹ 53,09,351.00',
        '₹ 53,09,351.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
      [
        '4',
        'THOMAS IYADURAI INFRASTRUCTURE PVT LTD',
        '₹ 47,05,017.00',
        '₹ 47,05,017.00',
        '-',
        '0.00 days',
        'Set Reminder',
      ],
    ],
  },

  '/receipt': {
    title: 'Receipt',
    total: 'Total Receipt:',
    mode: 'payment',
    columns: ['Month', 'Amount'],
  },

  '/receiptnote': {
    title: 'Receipt Note',
    total: 'Total Gross Amount:',
    mode: 'payment',
    columns: ['Month', 'Amount'],
  },

  '/deliverynote': {
    title: 'Delivery Note',
    total: 'Total Gross Amount:',
    mode: 'payment',
    columns: ['Month', 'Amount'],
  },

  '/salesorder': {
    title: 'Sales Order',
    total: 'Total Sales Order:',
    mode: 'gross',
    columns: ['Month', 'Amount'],
  },

  '/cash/voucher-list/cash-in-hand': {
    title: 'Cash',
    total: 'Total Amount: ₹ 3,37,124.68',
    mode: 'accounts',
    columns: ['Name', 'Amount'],
    rows: [
      ['Cash', '₹ 3,37,124.68'],
    ],
  },

  '/cash-bank/cash': {
    title: 'Cash',
    total: 'Total Amount: ₹ 3,37,124.68',
    mode: 'accounts',
    columns: ['Name', 'Amount'],
    rows: [
      ['Cash', '₹ 3,37,124.68'],
    ],
  },

  '/cash-bank/bank': {
    title: 'Bank',
    total: 'Total Amount: ₹ 35,42,442.52',
    mode: 'accounts',
    columns: ['Name', 'Amount'],
    rows: [
      ['HDFC BANK - 9593', '₹ 78825.01'],
      ['HDFC BANK - 5320', '₹ 222683'],
      ['HDFC BANK - 7713', '₹ 3843950.53'],
    ],
  },

  '/bank/voucher-list/bank-accounts': {
    title: 'Bank',
    total: 'Total Amount: ₹ 35,42,442.52',
    mode: 'accounts',
    columns: ['Name', 'Amount'],
    rows: [
      ['HDFC BANK - 9593', '₹ 78825.01'],
      ['HDFC BANK - 5320', '₹ 222683'],
      ['HDFC BANK - 7713', '₹ 3843950.53'],
    ],
  },
}

// ============================================================
// HIDDEN API FIELDS
// These fields remain in the API response but are not displayed.
// ============================================================

const hiddenSalesFields = new Set([
  'id',
  '_id',
  'tallyId',
  'tallyID',
  'tallyExternalId',
  'tallyExternalID',
  'tally_external_id',
  'tally_externalid',
])

const normalizeFieldName = (field) =>
  String(field)
    .replace(/[_-]/g, '')
    .toLowerCase()

const normalizedHiddenSalesFields = new Set(
  [...hiddenSalesFields].map(normalizeFieldName)
)

const isHiddenSalesField = (field) =>
  normalizedHiddenSalesFields.has(
    normalizeFieldName(field)
  )

// ============================================================
// IST DATE FORMATTER
// ============================================================

const formatDateTimeIST = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const date = new Date(value)

  // If the value is not a valid date, show original value.
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ============================================================
// CHECK WHETHER A COLUMN IS DATE/TIME
// ============================================================

const isDateTimeColumn = (column) => {
  const normalizedColumn = String(column)
    .toLowerCase()
    .replace(/[_-\s]/g, '')

  return (
    normalizedColumn.includes('date') ||
    normalizedColumn.includes('time') ||
    normalizedColumn.includes('timestamp') ||
    normalizedColumn.includes('createdat') ||
    normalizedColumn.includes('updatedat') ||
    normalizedColumn.includes('effectiveat') ||
    normalizedColumn.includes('createdon') ||
    normalizedColumn.includes('updatedon')
  )
}

// ============================================================
// DATE RANGE DISPLAY
// ============================================================

function DateRangeDisplay({
  startDate = '2026-04-01',
  endDate = '2027-03-31',
  onChange,
}) {
  return (
    <div className="ml-auto">
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        compact
      />
    </div>
  )
}

// ============================================================
// STANDARD REPORT TABLE
// ============================================================

function ReportTable({
  columns,
  rows = [],
  totalItemsOverride,
  currentPageOverride,
  pageSizeOverride,
  onPageChange,
  onPageSizeChange,
}) {
  const [
    internalCurrentPage,
    setInternalCurrentPage,
  ] = useState(1)

  const [
    internalPageSize,
    setInternalPageSize,
  ] = useState(10)

  const currentPage =
    currentPageOverride ??
    internalCurrentPage

  const pageSize =
    pageSizeOverride ??
    internalPageSize

  const setReportPage = (
    nextPage
  ) => {
    if (onPageChange) {
      onPageChange(nextPage)
    } else {
      setInternalCurrentPage(
        nextPage
      )
    }
  }

  const totalItems =
    totalItemsOverride ??
    rows.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
          pageSize
      )
    )

  useEffect(() => {
    setInternalCurrentPage(
      (page) =>
        Math.min(
          page,
          totalPages
        )
    )
  }, [totalPages])

  const paginatedRows =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        pageSize

      const end =
        start + pageSize

      return rows.slice(
        start,
        end
      )
    }, [
      rows,
      currentPage,
      pageSize,
    ])

  const pageItems =
    totalPages <= 7
      ? Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        )
      : currentPage <= 4
        ? [
            1,
            2,
            3,
            4,
            5,
            '...',
            totalPages,
          ]
        : currentPage >=
            totalPages - 3
          ? [
              1,
              '...',
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [
              1,
              '...',
              currentPage - 1,
              currentPage,
              currentPage + 1,
              '...',
              totalPages,
            ]

  const startItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1

  const endItem =
    Math.min(
      currentPage *
        pageSize,
      totalItems
    )

  const getGridColumns =
    () => {
      return columns
        .map((column) => {
          const normalized =
            String(column)
              .toLowerCase()
              .replace(
                /\s+/g,
                ''
              )

          if (
            normalized.includes(
              'email'
            )
          ) {
            return 'minmax(220px, 1.8fr)'
          }

          if (
            normalized.includes(
              'address'
            )
          ) {
            return 'minmax(240px, 1.8fr)'
          }

          if (
            normalized.includes(
              'name'
            )
          ) {
            return 'minmax(180px, 1.4fr)'
          }

          if (
            normalized.includes(
              'description'
            )
          ) {
            return 'minmax(220px, 1.6fr)'
          }

          if (
            normalized.includes(
              'amount'
            ) ||
            normalized.includes(
              'balance'
            )
          ) {
            return 'minmax(160px, 1fr)'
          }

          if (
            normalized.includes(
              'phone'
            ) ||
            normalized.includes(
              'mobile'
            )
          ) {
            return 'minmax(140px, 1fr)'
          }

          if (
            normalized.includes(
              'gst'
            )
          ) {
            return 'minmax(150px, 1fr)'
          }

          if (
            normalized.includes(
              'date'
            )
          ) {
            return 'minmax(160px, 1fr)'
          }

          if (
            normalized.includes(
              'days'
            )
          ) {
            return 'minmax(130px, 1fr)'
          }

          return 'minmax(140px, 1fr)'
        })
        .join(' ')
    }

  const gridColumns =
    getGridColumns()

  return (
    <div className="px-5">

      <div className="overflow-x-auto">

        <div
          className="
            min-w-[520px]
            overflow-hidden
            rounded-md
            border
            border-slate-200
          "
        >

          <div
            className="
              grid
              items-center
              bg-[#edf2f6]
              px-4
              py-2.5
              text-xs
              font-medium
              text-slate-700
            "
            style={{
              gridTemplateColumns:
                gridColumns,
            }}
          >
            {columns.map(
              (column) => (
                <b
                  key={column}
                  className="
                    min-w-0
                    overflow-hidden
                    text-ellipsis
                    whitespace-nowrap
                    pr-3
                  "
                >
                  {column}
                </b>
              )
            )}
          </div>

          {paginatedRows.length >
          0 ? (
            paginatedRows.map(
              (
                row,
                index
              ) => (
                <div
                  key={`${row[0] ?? 'row'}-${index}`}
                  className="
                    grid
                    items-center
                    border-b
                    border-slate-100
                    px-4
                    py-3
                    text-xs
                    text-slate-700
                  "
                  style={{
                    gridTemplateColumns:
                      gridColumns,
                  }}
                >
                  {row.map(
                    (
                      value,
                      valueIndex
                    ) => (
                      <span
                        key={`${value}-${valueIndex}`}
                        title={String(
                          value ??
                            ''
                        )}
                        className="
                          min-w-0
                          max-w-full
                          break-words
                          [overflow-wrap:anywhere]
                          whitespace-normal
                          pr-3
                          leading-5
                        "
                      >
                        {value}
                      </span>
                    )
                  )}
                </div>
              )
            )
          ) : (
            <div className="flex min-h-[120px] items-center justify-center border-t border-slate-100 text-xs text-slate-500">
              No data available
            </div>
          )}

        </div>

      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-slate-200
          py-4
        "
      >

        <div className="flex flex-wrap items-center gap-4">

          <span className="text-xs text-slate-600">
            {totalItems === 0
              ? '0 of 0'
              : `${startItem}-${endItem} of ${totalItems}`}
          </span>

          <label className="flex items-center gap-2 text-xs text-slate-600">

            <span>
              Rows per page
            </span>

            <select
              value={pageSize}
              onChange={(
                event
              ) => {
                const nextPageSize =
                  Number(
                    event.target
                      .value
                  )

                if (
                  onPageSizeChange
                ) {
                  onPageSizeChange(
                    nextPageSize
                  )
                } else {
                  setInternalPageSize(
                    nextPageSize
                  )

                  setInternalCurrentPage(
                    1
                  )
                }
              }}
              className="
                h-8
                rounded-md
                border
                border-slate-300
                bg-white
                px-2
                text-xs
                outline-none
                focus:border-[#168acb]
              "
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={30}>
                30
              </option>

              <option value={50}>
                50
              </option>
            </select>

          </label>

        </div>

        <div className="flex items-center gap-1">

          <button
            type="button"
            disabled={
              totalPages <= 1 ||
              currentPage === 1
            }
            onClick={() =>
              setReportPage(
                Math.max(
                  1,
                  currentPage - 1
                )
              )
            }
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded
              border
              border-slate-200
              bg-white
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          {pageItems.map(
            (
              page,
              index
            ) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    text-xs
                    text-slate-500
                  "
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  disabled={
                    totalPages <= 1
                  }
                  onClick={() =>
                    setReportPage(
                      page
                    )
                  }
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded
                    border
                    text-xs
                    font-medium
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    ${
                      currentPage ===
                      page
                        ? 'border-[#168acb] bg-[#168acb] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  {page}
                </button>
              )
          )}

          <button
            type="button"
            disabled={
              totalPages <= 1 ||
              currentPage ===
                totalPages
            }
            onClick={() =>
              setReportPage(
                Math.min(
                  totalPages,
                  currentPage + 1
                )
              )
            }
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded
              border
              border-slate-200
              bg-white
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight
              size={16}
            />
          </button>

        </div>

      </div>

    </div>
  )
}

// ============================================================
// RECEIVABLES REPORT
// ============================================================

function ReceivablesReport({
  config,
  query,
  setQuery,
  companyId,
}) {
  const isSupplierReport =
    config.resource ===
    'suppliers'

  const fetchRecords =
    isSupplierReport
      ? fetchSuppliers
      : fetchCustomers

  const extractRecords =
    isSupplierReport
      ? extractSuppliers
      : extractCustomers

  const entityLabel =
    isSupplierReport
      ? 'sundry creditors'
      : 'sundry debtors'

  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken
    )

  const [
    selectedTab,
    setSelectedTab,
  ] = useState(
    'Detailed Summary'
  )

  const [
    onAccount,
    setOnAccount,
  ] = useState(true)

  const [rows, setRows] =
    useState(
      config.rows ?? []
    )

  const [
    customerRecords,
    setCustomerRecords,
  ] = useState([])

  const [
    sentMessage,
    setSentMessage,
  ] = useState('')

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)

  const [
    pageSize,
    setPageSize,
  ] = useState(20)

  const [
    totalItems,
    setTotalItems,
  ] = useState(0)

  const [
    totalPages,
    setTotalPages,
  ] = useState(1)

  const [
    totalOutstanding,
    setTotalOutstanding,
  ] = useState(null)

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

  useEffect(() => {
    if (
      !accessToken ||
      !companyId
    ) {
      setRows([])
      setCustomerRecords([])
      setTotalItems(0)
      setTotalPages(1)
      setTotalOutstanding(null)

      setErrorMessage(
        accessToken
          ? `No company is selected. Load a company before viewing ${entityLabel}.`
          : 'Your session has expired. Please sign in again.'
      )

      return undefined
    }

    let isMounted = true

    setIsLoading(true)
    setErrorMessage('')

    fetchRecords({
      companyId,
      accessToken,
      page: currentPage,
      limit: pageSize,
      q: query,
    })
      .then((response) => {
        if (!isMounted) return

        const customers =
          extractRecords(
            response
          )

        setCustomerRecords(
          customers
        )

        setRows(
          customers.map(
            (
              customer,
              index
            ) => {
              const name =
                customer?.name ||
                customer?.customerName ||
                customer?.supplierName ||
                customer?.supplier_name ||
                customer?.partyName ||
                customer?.party_name ||
                customer?.ledgerName ||
                customer?.ledger_name ||
                `Customer ${
                  index + 1
                }`

              const outstanding =
                customer?.outstanding ??
                customer?.outstandingAmount ??
                customer?.outstanding_amount ??
                customer?.closingBalance ??
                customer?.closing_balance ??
                customer?.balance ??
                '-'

              const overdue =
                customer?.overdue ??
                customer?.overdueAmount ??
                customer?.overdue_amount ??
                '-'

              const creditDays =
                customer?.creditDays ??
                customer?.credit_days ??
                '-'

              const averagePayDays =
                customer?.averagePayDays ??
                customer?.avgPayDays ??
                customer?.average_payment_days ??
                customer?.average_pay_days ??
                '-'

              return [
                String(
                  (currentPage -
                    1) *
                    pageSize +
                    index +
                    1
                ),
                name,
                outstanding,
                overdue,
                creditDays,
                averagePayDays,
                'Set Reminder',
              ]
            }
          )
        )

        const responseTotalOutstanding =
          extractCustomerTotal(
            response
          )

        setTotalOutstanding(
          responseTotalOutstanding
        )

        const pagination =
          extractCustomerPagination(
            response
          )

        const responseTotal =
          Number(
            pagination.total ??
              pagination.totalItems ??
              pagination.count ??
              pagination.totalRecords
          )

        const responsePages =
          Number(
            pagination.totalPages ??
              pagination.pages ??
              pagination.lastPage
          )

        const nextTotal =
          Number.isFinite(
            responseTotal
          ) &&
          responseTotal >= 0
            ? responseTotal
            : customers.length

        const nextPages =
          Number.isFinite(
            responsePages
          ) &&
          responsePages > 0
            ? responsePages
            : Math.max(
                1,
                Math.ceil(
                  nextTotal /
                    pageSize
                )
              )

        setTotalItems(
          nextTotal
        )

        setTotalPages(
          nextPages
        )
      })
      .catch((error) => {
        if (!isMounted) return

        setErrorMessage(
          error.message ||
            `Unable to load ${entityLabel}`
        )
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(
            false
          )
        }
      })

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    companyId,
    currentPage,
    pageSize,
    query,
    fetchRecords,
    extractRecords,
    entityLabel,
  ])

  const headerTabs = [
    'Detailed Summary',
    'Manage Reminders',
    'SMS Credits',
    'Customize Template',
  ]

  const customerColumns = [
    {
      key: 'name',
      label: 'Name',
      aliases: [
        'name',
        'customerName',
        'supplierName',
        'supplier_name',
        'partyName',
        'party_name',
        'ledgerName',
        'ledger_name',
      ],
    },
    {
      key: 'email',
      label: 'Email',
      aliases: [
        'email',
        'emailAddress',
        'email_address',
      ],
    },
    {
      key: 'gstin',
      label: 'GSTIN',
      aliases: [
        'gstin',
        'gstIn',
        'gstNumber',
        'gst_number',
      ],
    },
    {
      key: 'openingBalance',
      label: 'Opening Balance',
      aliases: [
        'openingBalance',
        'opening_balance',
        'openingAmount',
        'opening_amount',
      ],
    },
    {
      key: 'closingBalance',
      label: 'Closing Balance',
      aliases: [
        'closingBalance',
        'closing_balance',
        'closingAmount',
        'closing_amount',
        'balance',
      ],
    },
    {
      key: 'createdAt',
      label: 'Created At',
      aliases: [
        'createdAt',
        'created_at',
        'createdDate',
        'created_date',
      ],
    },
    {
      key: 'updatedAt',
      label: 'Updated At',
      aliases: [
        'updatedAt',
        'updated_at',
        'updatedDate',
        'updated_date',
      ],
    },
    {
      key: 'phone',
      label: 'Phone',
      aliases: [
        'phone',
        'phoneNumber',
        'phone_number',
        'mobile',
        'mobileNumber',
        'mobile_number',
      ],
    },
    {
      key: 'address',
      label: 'Address',
      aliases: [
        'address',
        'billingAddress',
        'billing_address',
        'postalAddress',
        'postal_address',
        'addressLine1',
        'address_line_1',
        'fullAddress',
        'full_address',
        'location',
      ],
    },
  ]

  const getCustomerValue = (
    customer,
    column
  ) => {
    const matchingKey =
      column.aliases.find(
        (alias) =>
          customer?.[
            alias
          ] !== undefined
      )

    if (matchingKey) {
      return customer[
        matchingKey
      ]
    }

    const normalizedAliases =
      column.aliases.map(
        (alias) =>
          alias
            .replace(
              /[_-]+/g,
              ''
            )
            .toLowerCase()
      )

    const caseInsensitiveKey =
      Object.keys(
        customer || {}
      ).find(
        (key) =>
          normalizedAliases.includes(
            key
              .replace(
                /[_-]+/g,
                ''
              )
              .toLowerCase()
          )
      )

    return caseInsensitiveKey
      ? customer[
          caseInsensitiveKey
        ]
      : undefined
  }

  const formatCustomerValue = (
    value,
    columnKey
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return columnKey ===
        'gstin'
        ? '-'
        : '-'
    }

    if (
      typeof value ===
      'object'
    ) {
      return (
        Object.values(value)
          .filter(Boolean)
          .join(', ') || '-'
      )
    }

    if (
      isDateTimeColumn(
        columnKey
      )
    ) {
      return formatDateTimeIST(
        value
      )
    }

    return String(value)
  }

  const displayedOutstanding =
    totalOutstanding ??
    rows.reduce(
      (
        total,
        row
      ) => {
        const amount =
          Number(
            String(
              row[2]
            ).replace(
              /[^\d.-]/g,
              ''
            )
          )

        return Number.isFinite(
          amount
        )
          ? total + amount
          : total
      },
      0
    )

  const formattedOutstanding =
    totalOutstanding ===
      null &&
    displayedOutstanding ===
      0
      ? '-'
      : typeof displayedOutstanding ===
          'number'
        ? displayedOutstanding.toLocaleString(
            'en-IN',
            {
              style:
                'currency',
              currency:
                'INR',
            }
          )
        : displayedOutstanding

  const pageItems =
    totalPages <= 7
      ? Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        )
      : currentPage <= 4
        ? [
            1,
            2,
            3,
            4,
            5,
            '...',
            totalPages,
          ]
        : currentPage >=
            totalPages - 3
          ? [
              1,
              '...',
              totalPages - 4,
              totalPages - 3,
              totalPages - 2,
              totalPages - 1,
              totalPages,
            ]
          : [
              1,
              '...',
              currentPage - 1,
              currentPage,
              currentPage + 1,
              '...',
              totalPages,
            ]

  const paginationDisabled =
    isLoading ||
    totalPages <= 1

  const handleSearchChange = (
    event
  ) => {
    setQuery(
      event.target.value
    )

    setCurrentPage(1)
  }

  const handleReminder = (
    customer
  ) => {
    setSentMessage(
      `Reminder sent to ${customer}`
    )

    setTimeout(() => {
      setSentMessage('')
    }, 2000)
  }

  const handleMarkPaid = (
    customer
  ) => {
    setRows(
      (currentRows) =>
        currentRows.filter(
          (row) =>
            row[1] !==
            customer
        )
    )

    setSentMessage(
      `${customer} marked as paid`
    )

    setTimeout(() => {
      setSentMessage('')
    }, 2000)
  }

  const handleBulkReminder =
    () => {
      setSentMessage(
        'Bulk reminders queued successfully'
      )

      setTimeout(() => {
        setSentMessage('')
      }, 2000)
    }

  const displayRows =
    customerRecords.map(
      (
        customer,
        index
      ) => ({
        customer,

        number:
          (currentPage -
            1) *
            pageSize +
          index +
          1,

        name:
          customer?.name ||
          customer?.customerName ||
          customer?.partyName ||
          customer?.party_name ||
          customer?.ledgerName ||
          customer?.ledger_name ||
          `Customer ${
            index + 1
          }`,

        action: (
          <div
            key={
              customer?.id ||
              customer?._id ||
              index
            }
            className="
              flex
              items-center
              gap-2
              whitespace-nowrap
            "
          >

            <button
              type="button"
              onClick={() =>
                handleReminder(
                  customer?.name ||
                    customer?.customerName ||
                    customer?.partyName ||
                    'Customer'
                )
              }
              className="
                flex
                items-center
                justify-center
                text-[#4385e5]
                transition
                hover:text-blue-700
              "
              title="Send reminder"
              aria-label="Send reminder"
            >
              <MessageCircle
                size={15}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                handleReminder(
                  customer?.name ||
                    customer?.customerName ||
                    customer?.partyName ||
                    'Customer'
                )
              }
              className="
                flex
                items-center
                justify-center
                text-red-500
                transition
                hover:text-red-700
              "
              title="Send PDF"
              aria-label="Send PDF"
            >
              <FileText
                size={15}
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                handleReminder(
                  customer?.name ||
                    customer?.customerName ||
                    customer?.partyName ||
                    'Customer'
                )
              }
              className="
                flex
                h-[23px]
                min-w-[125px]
                items-center
                justify-center
                gap-1
                rounded-[4px]
                border
                border-[#43bd45]
                bg-white
                px-3
                text-[11px]
                font-medium
                text-[#222]
                transition
                hover:bg-[#effaf0]
              "
            >
              <Bell
                size={13}
                strokeWidth={2}
              />

              <span>
                Set Reminder
              </span>
            </button>

          </div>
        ),
      })
    )

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      <div className="flex min-h-[62px] items-end border-b border-slate-200 bg-white px-3">

        <div className="flex items-end gap-1 overflow-x-auto">

          {headerTabs.map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setSelectedTab(
                    tab
                  )
                }
                className={`
                  relative
                  whitespace-nowrap
                  px-3
                  py-4
                  text-[13px]
                  ${
                    selectedTab ===
                    tab
                      ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black'
                      : 'text-slate-700 hover:text-black'
                  }
                `}
              >
                {tab}
              </button>
            )
          )}

        </div>

        <div className="ml-auto hidden items-center gap-3 pb-2 lg:flex">

          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">

            <span>
              On Account
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={
                onAccount
              }
              onClick={() =>
                setOnAccount(
                  (current) =>
                    !current
                )
              }
              className={`
                relative
                h-[25px]
                w-[43px]
                rounded-full
                transition
                ${
                  onAccount
                    ? 'bg-[#42c54a]'
                    : 'bg-slate-300'
                }
              `}
            >
              <span
                className={`
                  absolute
                  top-[3px]
                  h-[19px]
                  w-[19px]
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-all
                  ${
                    onAccount
                      ? 'left-[21px]'
                      : 'left-[3px]'
                  }
                `}
              />
            </button>

          </div>

          <button
            type="button"
            onClick={
              handleBulkReminder
            }
            className="
              flex
              h-[33px]
              items-center
              rounded-t-[4px]
              bg-[#202020]
              px-4
              text-[12px]
              font-bold
              uppercase
              text-white
              hover:bg-[#111]
            "
          >
            <Bell
              size={15}
              strokeWidth={2}
            />

            <span className="ml-2">
              BULK REMINDERS
            </span>
          </button>

        </div>

      </div>

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">

        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">
              <input
                value={query}
                onChange={
                  handleSearchChange
                }
                placeholder="Search name"
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">

              <span className="whitespace-nowrap">
                Show
              </span>

              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(
                    Number(
                      event.target
                        .value
                    )
                  )

                  setCurrentPage(
                    1
                  )
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                aria-label="Rows per page"
              >
                {[10, 20, 30, 50].map(
                  (limit) => (
                    <option
                      key={limit}
                      value={
                        limit
                      }
                    >
                      {
                        limit
                      }
                    </option>
                  )
                )}
              </select>

              <span className="whitespace-nowrap">
                records
              </span>

            </label>

          </div>

          <span className="text-xs text-slate-500">
            Page {currentPage} ·{' '}
            {pageSize} per page
          </span>

        </div>

        {sentMessage && (
          <div className="mx-4 mb-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-[12px] text-green-700">
            {sentMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto px-3 pb-1">

          {isLoading ? (
            <div className="flex min-h-[120px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              Loading {
                entityLabel
              }...
            </div>
          ) : displayRows.length >
            0 ? (
            <table className="min-w-[1650px] w-full text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>

                  {customerColumns.map(
                    (
                      column
                    ) => (
                      <th
                        key={
                          column.key
                        }
                        className="whitespace-nowrap px-5 py-3 font-semibold"
                      >
                        {
                          column.label
                        }
                      </th>
                    )
                  )}

                  <th className="whitespace-nowrap px-5 py-3 text-center font-semibold">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {displayRows.map(
                  (
                    row
                  ) => (
                    <tr
                      key={
                        row.customer?.id ||
                        row.customer?._id ||
                        row.number
                      }
                      className="text-xs text-slate-700 transition-colors hover:bg-slate-50"
                    >

                      {customerColumns.map(
                        (
                          column
                        ) => {
                          const value =
                            formatCustomerValue(
                              getCustomerValue(
                                row.customer,
                                column
                              ),
                              column.key
                            )

                          return (
                            <td
                              key={
                                column.key
                              }
                              title={
                                value
                              }
                              className="max-w-[280px] px-5 py-3 leading-5 [overflow-wrap:anywhere]"
                            >
                              {
                                value
                              }
                            </td>
                          )
                        }
                      )}

                      <td className="whitespace-nowrap px-5 py-3">

                        <div className="flex justify-center">
                          {
                            row.action
                          }
                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>
          ) : (
            <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              No {
                entityLabel
              } data available.
            </div>
          )}

        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">

          {pageItems.map(
            (
              page,
              index
            ) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-sm text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  disabled={
                    paginationDisabled
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                    currentPage ===
                    page
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {page}
                </button>
              )
          )}

        </div>

      </section>

    </div>
  )
}

// ============================================================
// ACCOUNTS REPORT
// ============================================================

function AccountsReport({
  config,
}) {
  const [
    startDate,
    setStartDate,
  ] = useState(
    '2026-04-01'
  )

  const [
    endDate,
    setEndDate,
  ] = useState(
    '2027-03-31'
  )

  const [query, setQuery] =
    useState('')

  const [
    label,
    amount,
  ] = config.total.split(
    '₹'
  )

  const filteredRows =
    (config.rows ?? []).filter(
      (row) => {
        const name =
          String(
            row[0] ?? ''
          ).toLowerCase()

        return name.includes(
          query.toLowerCase()
        )
      }
    )

  return (
    <div className="report-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      <div className="flex min-h-[64px] items-center gap-4 border-b border-slate-200 bg-white px-4">

        <button
          type="button"
          className="flex items-center justify-center text-slate-700 hover:text-black"
          title="Go back"
          aria-label="Go back"
        >
          <ArrowLeft
            size={22}
            strokeWidth={1.8}
          />
        </button>

        <div className="text-[11px] leading-4">

          <b className="block">
            {label.trim()}
          </b>

          <strong className="block text-[18px]">
            ₹{amount}
          </strong>

        </div>

        <DateRangeDisplay
          startDate={
            startDate
          }
          endDate={
            endDate
          }
          onChange={(
            nextStart,
            nextEnd
          ) => {
            setStartDate(
              nextStart ||
                startDate
            )

            setEndDate(
              nextEnd ||
                endDate
            )
          }}
        />

      </div>

      <section className="mx-5 mt-2.5 overflow-hidden rounded-lg bg-white shadow">

        <div className="flex flex-wrap items-center gap-4 px-5 py-3">

          <label className="flex h-9 w-[200px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">

            <Search
              size={15}
              strokeWidth={2}
            />

            <input
              className="w-full min-w-0 bg-transparent text-xs outline-none"
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder="Search"
            />

          </label>

          <span className="ml-auto text-xs">
            Rows are paginated below
          </span>

        </div>

        <ReportTable
          columns={
            config.columns
          }
          rows={
            filteredRows
          }
        />

      </section>

    </div>
  )
}

// ============================================================
// SALES REPORT
// ============================================================

function SalesReport({
  companyId,
}) {
  const accessToken =
    useAuthStore(
      (state) =>
        state.accessToken
    )

  const [query, setQuery] =
    useState('')

  const [
    startDate,
    setStartDate,
  ] = useState(
    '2010-04-01'
  )

  const [
    endDate,
    setEndDate,
  ] = useState(
    '2027-03-31'
  )

  const [rows, setRows] =
    useState([])

  const [
    totalItems,
    setTotalItems,
  ] = useState(0)

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)

  const [
    pageSize,
    setPageSize,
  ] = useState(20)

  const [
    totalAmount,
    setTotalAmount,
  ] = useState(0)

  const [
    isLoading,
    setIsLoading,
  ] = useState(false)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('')

  useEffect(() => {
    if (
      !accessToken ||
      !companyId
    ) {
      setRows([])
      setTotalItems(0)
      setTotalAmount(0)

      setErrorMessage(
        accessToken
          ? 'No company is selected.'
          : 'Your session has expired. Please sign in again.'
      )

      return undefined
    }

    let mounted = true

    setIsLoading(true)
    setErrorMessage('')

    fetchCompanySales(
      accessToken,
      companyId,
      {
        q: query,
        from: startDate,
        to: endDate,
        page: currentPage,
        limit: pageSize,
      }
    )
      .then((response) => {
        if (!mounted) return

        const sales =
          extractSales(
            response
          )

        const getRawValue = (
          entry,
          aliases
        ) => {
          const normalizedAliases =
            aliases.map(
              (alias) =>
                alias
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9]/g,
                    ''
                  )
            )

          const candidate =
            [
              entry,
              entry?.data,
              entry?.payload,
              entry?.voucher,
              entry?.invoice,
            ].find(
              (value) =>
                value &&
                typeof value ===
                  'object' &&
                Object.keys(
                  value
                ).some(
                  (key) =>
                    normalizedAliases.includes(
                      key
                        .toLowerCase()
                        .replace(
                          /[^a-z0-9]/g,
                          ''
                        )
                    )
                )
            )

          if (!candidate) {
            return ''
          }

          const key =
            Object.keys(
              candidate
            ).find(
              (name) =>
                normalizedAliases.includes(
                  name
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]/g,
                      ''
                    )
                )
            )

          return key
            ? candidate[
                key
              ]
            : ''
        }

        const amount = (
          value
        ) =>
          Number(
            String(
              value ?? ''
            ).replace(
              /[^\d.-]/g,
              ''
            )
          ) || 0

        const totalFromRows =
          sales.reduce(
            (
              sum,
              sale
            ) =>
              sum +
              amount(
                getRawValue(
                  sale,
                  [
                    'amount',
                    'total',
                    'totalamount',
                    'grandtotal',
                    'grossamount',
                  ]
                )
              ),
            0
          )

        const pagination =
          extractSalesPagination(
            response
          )

        const responseTotal =
          Number(
            pagination.total ??
              pagination.totalItems ??
              pagination.totalRecords ??
              pagination.count
          )

        setRows(sales)

        setTotalItems(
          Number.isFinite(
            responseTotal
          )
            ? responseTotal
            : sales.length
        )

        setTotalAmount(
          Number(
            pagination.totalAmount ??
              pagination.total_amount ??
              totalFromRows
          ) || 0
        )
      })
      .catch((error) => {
        if (!mounted) return

        setRows([])
        setTotalItems(0)
        setTotalAmount(0)

        setErrorMessage(
          error?.message ||
            'Unable to load sales.'
        )
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(
            false
          )
        }
      })

    return () => {
      mounted = false
    }
  }, [
    accessToken,
    companyId,
    currentPage,
    endDate,
    pageSize,
    query,
    startDate,
  ])

  // ==========================================================
  // SALES TABLE COLUMNS
  // Hide ID / Tally ID fields.
  // ==========================================================

  const salesColumns = (() => {
    const columns = Array.from(
      new Set(
        rows.flatMap((row) => {
          if (!row || typeof row !== 'object' || Array.isArray(row)) return []
          return Object.keys(row).filter((column) => !isHiddenSalesField(column))
        }),
      ),
    )
    const narrationColumns = columns.filter((column) => column.toLowerCase() === 'narration')
    return [
      ...columns.filter((column) => column.toLowerCase() !== 'narration'),
      ...narrationColumns,
    ]
  })()

  // ==========================================================
  // DISPLAY VALUE
  // ==========================================================

  const displayValue = (
    value,
    column
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    if (
      isDateTimeColumn(
        column
      )
    ) {
      return formatDateTimeIST(
        value
      )
    }

    if (
      typeof value ===
      'object'
    ) {
      return JSON.stringify(
        value
      )
    }

    return String(value)
  }

  // ==========================================================
  // COLUMN LABEL
  // ==========================================================

  const columnLabel = (
    column
  ) =>
    column
      .replace(
        /[_-]+/g,
        ' '
      )
      .replace(
        /([a-z])([A-Z])/g,
        '$1 $2'
      )

  const salesTotalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
          pageSize
      )
    )

  const salesPageItems =
    salesTotalPages <= 7
      ? Array.from(
          {
            length:
              salesTotalPages,
          },
          (_, index) =>
            index + 1
        )
      : currentPage <= 4
        ? [
            1,
            2,
            3,
            4,
            5,
            '...',
            salesTotalPages,
          ]
        : currentPage >=
            salesTotalPages - 3
          ? [
              1,
              '...',
              salesTotalPages - 4,
              salesTotalPages - 3,
              salesTotalPages - 2,
              salesTotalPages - 1,
              salesTotalPages,
            ]
          : [
              1,
              '...',
              currentPage - 1,
              currentPage,
              currentPage + 1,
              '...',
              salesTotalPages,
            ]

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">

      {/* HEADER */}

      <div className="bg-white px-5 py-4">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>

            <span className="block text-xs text-slate-600">
              Total Sales:
            </span>

            <strong className="mt-1 block text-xl font-bold text-slate-900">
              ₹{' '}
              {totalAmount.toLocaleString(
                'en-IN',
                {
                  minimumFractionDigits:
                    2,
                }
              )}
            </strong>

          </div>

          <DateRangeDisplay
            startDate={
              startDate
            }
            endDate={
              endDate
            }
            onChange={(
              nextStart,
              nextEnd
            ) => {
              setCurrentPage(1)

              setStartDate(
                nextStart ||
                  startDate
              )

              setEndDate(
                nextEnd ||
                  endDate
              )
            }}
          />

        </div>

      </div>

      {/* CARD */}

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">

        {/* TOOLBAR */}

        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">

            {/* SEARCH */}

            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">

              <Search
                size={15}
                strokeWidth={2}
              />

              <input
                value={query}
                onChange={(
                  event
                ) => {
                  setCurrentPage(
                    1
                  )

                  setQuery(
                    event.target
                      .value
                  )
                }}
                placeholder="Search voucher number"
                className="ml-2 w-full bg-transparent outline-none placeholder:text-slate-400"
              />

            </label>

            {/* SHOW RECORDS */}

            <label className="flex items-center gap-2 text-sm text-slate-600">

              <span className="whitespace-nowrap">
                Show
              </span>

              <select
                value={pageSize}
                onChange={(
                  event
                ) => {
                  setPageSize(
                    Number(
                      event.target
                        .value
                    )
                  )

                  setCurrentPage(
                    1
                  )
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                aria-label="Rows per page"
              >
                {[10, 20, 30, 50].map(
                  (limit) => (
                    <option
                      key={limit}
                      value={
                        limit
                      }
                    >
                      {
                        limit
                      }
                    </option>
                  )
                )}
              </select>

              <span className="whitespace-nowrap">
                records
              </span>

            </label>

          </div>

          <span className="text-xs text-slate-500">
            Page {currentPage} ·{' '}
            {pageSize} per page
          </span>

        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {errorMessage}
          </div>
        )}

        {/* SALES TABLE */}

        <div className="overflow-x-auto px-3 pb-1">

          {isLoading ? (
            <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              Loading sales...
            </div>
          ) : (
            <table className="min-w-[1350px] w-full text-left text-sm">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">

                <tr>

                  {salesColumns.map(
                    (column) => (
                      <th
                        key={column}
                        className="whitespace-nowrap px-5 py-3 font-semibold"
                      >
                        {columnLabel(
                          column
                        )}
                      </th>
                    )
                  )}

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {rows.length >
                0 ? (
                  rows.map(
                    (
                      row,
                      rowIndex
                    ) => (
                      <tr
                        key={
                          row.id ||
                          row._id ||
                          rowIndex
                        }
                        className="text-xs text-slate-700 transition-colors hover:bg-slate-50"
                      >

                        {salesColumns.map(
                          (
                            column
                          ) => {
                            const value =
                              displayValue(
                                row?.[
                                  column
                                ],
                                column
                              )

                            return (
                              <td
                                key={`${rowIndex}-${column}`}
                                title={
                                  value
                                }
                                className="max-w-[280px] px-5 py-3 leading-5 [overflow-wrap:anywhere]"
                              >
                                {
                                  value
                                }
                              </td>
                            )
                          }
                        )}

                      </tr>
                    )
                  )
                ) : (
                  <tr>

                    <td
                      colSpan={Math.max(
                        salesColumns.length,
                        1
                      )}
                      className="h-[150px] text-center text-sm text-slate-500"
                    >
                      No sales data available.
                    </td>

                  </tr>
                )}

              </tbody>

            </table>
          )}

        </div>

        {/* PAGINATION */}

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">

          {/* PREVIOUS */}

          <button
            type="button"
            disabled={
              isLoading ||
              currentPage ===
                1
            }
            onClick={() =>
              setCurrentPage(
                Math.max(
                  1,
                  currentPage - 1
                )
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          {/* PAGE NUMBERS */}

          {salesPageItems.map(
            (
              page,
              index
            ) =>
              page === '...' ? (
                <span
                  key={`sales-ellipsis-${index}`}
                  className="px-1 text-sm text-slate-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  disabled={
                    isLoading
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
                  }
                  className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                    currentPage ===
                    page
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {page}
                </button>
              )
          )}

          {/* NEXT */}

          <button
            type="button"
            disabled={
              isLoading ||
              currentPage ===
                salesTotalPages
            }
            onClick={() =>
              setCurrentPage(
                Math.min(
                  salesTotalPages,
                  currentPage + 1
                )
              )
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-600
              transition
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight
              size={16}
            />
          </button>

        </div>

      </section>

    </div>
  )
}

function CashReport({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken || !companyId) {
      setRows([])
      setTotalItems(0)
      setErrorMessage(accessToken ? 'No company is selected.' : 'Your session has expired. Please sign in again.')
      return undefined
    }

    let mounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchCompanyCash(accessToken, companyId, {
      q: query,
      page: currentPage,
      limit: pageSize,
    })
      .then((response) => {
        if (!mounted) return

        const cashRows = extractCash(response)
        const pagination = extractCashPagination(response)
        const responseTotal = Number(
          pagination.total ?? pagination.totalItems ?? pagination.totalRecords ?? pagination.count,
        )

        setRows(cashRows)
        setTotalItems(Number.isFinite(responseTotal) ? responseTotal : cashRows.length)
      })
      .catch((error) => {
        if (!mounted) return

        setRows([])
        setTotalItems(0)
        setErrorMessage(error?.message || 'Unable to load cash data.')
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId, currentPage, pageSize, query])

  const columns = Array.from(
    new Set(
      rows.flatMap((row) => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) return []
        return Object.keys(row).filter((column) => !isHiddenSalesField(column))
      }),
    ),
  )

  const narrationColumns = columns.filter((column) => column.toLowerCase() === 'narration')
  const orderedColumns = [
    ...columns.filter((column) => column.toLowerCase() !== 'narration'),
    ...narrationColumns,
  ]

  const formatValue = (value, column) => {
    if (isDateTimeColumn(column)) return formatDateTimeIST(value)

    return value === null || value === undefined || value === ''
      ? '-'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
  }

  const label = (column) =>
    column
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">
      <div className="bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-xs text-slate-600">Cash Data</span>
            <strong className="mt-1 block text-xl font-bold text-slate-900">{totalItems} records</strong>
          </div>
        </div>
      </div>

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">
              <Search size={15} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => {
                  setCurrentPage(1)
                  setQuery(event.target.value)
                }}
                placeholder="Search voucher number"
                className="ml-2 w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap">Show</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                aria-label="Rows per page"
              >
                {[10, 20, 30, 50].map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
              <span className="whitespace-nowrap">records</span>
            </label>
          </div>

          <span className="text-xs text-slate-500">
            Page {currentPage} · {pageSize} per page
          </span>
        </div>

        {errorMessage && (
          <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto px-3 pb-1">
          {isLoading ? (
            <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              Loading cash data...
            </div>
          ) : (
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {orderedColumns.map((column) => (
                    <th key={column} className="whitespace-nowrap px-5 py-3 font-semibold">
                      {label(column)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.length > 0 ? (
                  rows.map((row, rowIndex) => (
                    <tr
                      key={row.id || row._id || rowIndex}
                      className="text-xs text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {orderedColumns.map((column) => {
                        const value = formatValue(row?.[column], column)

                        return (
                          <td
                            key={`${rowIndex}-${column}`}
                            title={value}
                            className="max-w-[280px] px-5 py-3 leading-5 [overflow-wrap:anywhere]"
                          >
                            {value}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Math.max(orderedColumns.length, 1)}
                      className="h-[150px] text-center text-sm text-slate-500"
                    >
                      No cash data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            disabled={isLoading || currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              disabled={isLoading}
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                currentPage === page
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={isLoading || currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

function BankReport({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken || !companyId) {
      setRows([])
      setTotalItems(0)
      setErrorMessage(accessToken ? 'No company is selected.' : 'Your session has expired. Please sign in again.')
      return undefined
    }

    let mounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchCompanyBank(accessToken, companyId, {
      q: query,
      page: currentPage,
      limit: pageSize,
    })
      .then((response) => {
        if (!mounted) return

        const bankRows = extractBank(response)
        const pagination = extractBankPagination(response)
        const responseTotal = Number(
          pagination.total ?? pagination.totalItems ?? pagination.totalRecords ?? pagination.count,
        )

        setRows(bankRows)
        setTotalItems(Number.isFinite(responseTotal) ? responseTotal : bankRows.length)
      })
      .catch((error) => {
        if (!mounted) return

        setRows([])
        setTotalItems(0)
        setErrorMessage(error?.message || 'Unable to load bank data.')
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => { mounted = false }
  }, [accessToken, companyId, currentPage, pageSize, query])

  const columns = Array.from(
    new Set(
      rows.flatMap((row) => {
        if (!row || typeof row !== 'object' || Array.isArray(row)) return []
        return Object.keys(row).filter((column) => !isHiddenSalesField(column))
      }),
    ),
  )

  const narrationColumns = columns.filter((column) => column.toLowerCase() === 'narration')
  const orderedColumns = [
    ...columns.filter((column) => column.toLowerCase() !== 'narration'),
    ...narrationColumns,
  ]

  const formatValue = (value, column) => {
    if (isDateTimeColumn(column)) return formatDateTimeIST(value)

    return value === null || value === undefined || value === ''
      ? '-'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
  }

  const label = (column) =>
    column
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">
      <div className="bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-xs text-slate-600">Bank Data</span>
            <strong className="mt-1 block text-xl font-bold text-slate-900">{totalItems} records</strong>
          </div>
        </div>
      </div>

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">
              <Search size={15} strokeWidth={2} />
              <input
                value={query}
                onChange={(event) => {
                  setCurrentPage(1)
                  setQuery(event.target.value)
                }}
                placeholder="Search account or bank"
                className="ml-2 w-full bg-transparent outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="whitespace-nowrap">Show</span>
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                aria-label="Rows per page"
              >
                {[10, 20, 30, 50].map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
              <span className="whitespace-nowrap">records</span>
            </label>
          </div>

          <span className="text-xs text-slate-500">
            Page {currentPage} · {pageSize} per page
          </span>
        </div>

        {errorMessage && (
          <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto px-3 pb-1">
          {isLoading ? (
            <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">
              Loading bank data...
            </div>
          ) : (
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {orderedColumns.map((column) => (
                    <th key={column} className="whitespace-nowrap px-5 py-3 font-semibold">
                      {label(column)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.length > 0 ? (
                  rows.map((row, rowIndex) => (
                    <tr
                      key={row.id || row._id || rowIndex}
                      className="text-xs text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {orderedColumns.map((column) => {
                        const value = formatValue(row?.[column], column)

                        return (
                          <td
                            key={`${rowIndex}-${column}`}
                            title={value}
                            className="max-w-[280px] px-5 py-3 leading-5 [overflow-wrap:anywhere]"
                          >
                            {value}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={Math.max(orderedColumns.length, 1)}
                      className="h-[150px] text-center text-sm text-slate-500"
                    >
                      No bank data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            disabled={isLoading || currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Previous page"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              disabled={isLoading}
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                currentPage === page
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={isLoading || currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Next page"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}

function CreditNoteReport({ companyId, reportType = 'creditnote' }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const isReceiptReport = reportType === 'receipt'
  const isReceiptNoteReport = reportType === 'receiptnote'
  const isSalesOrderReport = reportType === 'salesorder'
  const isDeliveryNoteReport = reportType === 'deliverynote'
  const isDebitNoteReport = reportType === 'debitnote'
  const isPaymentReport = reportType === 'payment'
  const isPurchaseOrderReport = reportType === 'purchaseorder'
  const effectiveCompanyId = companyId || (isReceiptReport ? '6aa0f66df858467a84d08d58' : isSalesOrderReport ? '' : '6aa38f546cd43af3d64fbc0d')
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('2010-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const [rows, setRows] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken || !effectiveCompanyId) {
      setRows([])
      setTotalItems(0)
      setErrorMessage(accessToken ? 'No company is selected.' : 'Your session has expired. Please sign in again.')
      return undefined
    }

    let mounted = true
    setIsLoading(true)
    setErrorMessage('')

    const fetchRecords = isReceiptReport
      ? fetchCompanyReceipts
      : isReceiptNoteReport
        ? fetchCompanyReceiptNotes
        : isSalesOrderReport
          ? fetchCompanySalesOrders
          : isDeliveryNoteReport
            ? fetchCompanyDeliveryNotes
            : isDebitNoteReport
              ? fetchCompanyDebitNotes
              : isPaymentReport
                ? fetchCompanyPayments
                : isPurchaseOrderReport
                  ? fetchCompanyPurchaseOrders
                  : fetchCompanyCreditNotes
    const extractRecords = isReceiptReport
      ? extractReceipts
      : isReceiptNoteReport
        ? extractReceiptNotes
        : isSalesOrderReport
          ? extractSalesOrders
          : isDeliveryNoteReport
            ? extractDeliveryNotes
            : isDebitNoteReport
              ? extractDebitNotes
              : isPaymentReport
                ? extractPayments
                : isPurchaseOrderReport
                  ? extractPurchaseOrders
                  : extractCreditNotes
    const extractPagination = isReceiptReport
      ? extractReceiptPagination
      : isReceiptNoteReport
        ? extractReceiptNotePagination
        : isSalesOrderReport
          ? extractSalesOrderPagination
          : isDeliveryNoteReport
            ? extractDeliveryNotePagination
            : isDebitNoteReport
              ? extractDebitNotePagination
              : isPaymentReport
                ? extractPaymentPagination
                : isPurchaseOrderReport
                  ? extractPurchaseOrderPagination
                  : extractCreditNotePagination

    fetchRecords(accessToken, effectiveCompanyId, {
      q: query,
      from: startDate,
      to: endDate,
      page: currentPage,
      limit: pageSize,
    })
      .then((response) => {
        if (!mounted) return
        const creditNotes = extractRecords(response)
        const pagination = extractPagination(response)
        const responseTotal = Number(pagination.total ?? pagination.totalItems ?? pagination.totalRecords ?? pagination.count)
        setRows(creditNotes)
        setTotalItems(Number.isFinite(responseTotal) ? responseTotal : creditNotes.length)
      })
      .catch((error) => {
        if (!mounted) return
        setRows([])
        setTotalItems(0)
        setErrorMessage(error?.message || `Unable to load ${isReceiptReport ? 'receipt' : isReceiptNoteReport ? 'receipt note' : isSalesOrderReport ? 'sales order' : isDeliveryNoteReport ? 'delivery note' : isDebitNoteReport ? 'debit note' : isPaymentReport ? 'payment' : isPurchaseOrderReport ? 'purchase order' : 'credit note'} data.`)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => { mounted = false }
  }, [accessToken, effectiveCompanyId, currentPage, endDate, isDeliveryNoteReport, isDebitNoteReport, isPaymentReport, isPurchaseOrderReport, isReceiptReport, isSalesOrderReport, pageSize, query, startDate])

  const columns = Array.from(new Set(rows.flatMap((row) => (
    row && typeof row === 'object' && !Array.isArray(row) ? Object.keys(row) : []
  )))).filter((column) => !isHiddenSalesField(column))
  const narrationColumns = columns.filter((column) => column.toLowerCase() === 'narration')
  const orderedColumns = [
    ...columns.filter((column) => column.toLowerCase() !== 'narration'),
    ...narrationColumns,
  ]
  const formatValue = (value, column) => {
    if (isDateTimeColumn(column)) return formatDateTimeIST(value)
    return value === null || value === undefined || value === ''
      ? '-'
      : typeof value === 'object' ? JSON.stringify(value) : String(value)
  }
  const label = (column) => column.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2')
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">
      <div className="bg-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="block text-xs text-slate-600">{isReceiptReport ? 'Receipt Data' : isReceiptNoteReport ? 'Receipt Note Data' : isSalesOrderReport ? 'Sales Order Data' : isDeliveryNoteReport ? 'Delivery Note Data' : isDebitNoteReport ? 'Debit Note Data' : isPaymentReport ? 'Payment Data' : isPurchaseOrderReport ? 'Purchase Order Data' : 'Credit Note Data'}</span>
            <strong className="mt-1 block text-xl font-bold text-slate-900">{totalItems} records</strong>
          </div>
          <DateRangeDisplay startDate={startDate} endDate={endDate} onChange={(from, to) => { setCurrentPage(1); setStartDate(from || startDate); setEndDate(to || endDate) }} />
        </div>
      </div>
      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <label className="flex h-9 w-full items-center rounded-lg border border-slate-200 px-3 text-sm text-slate-500 sm:w-64">
              <input value={query} onChange={(event) => { setCurrentPage(1); setQuery(event.target.value) }} placeholder="Search party ledger or voucher no." className="w-full bg-transparent outline-none placeholder:text-slate-400" />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600"><span>Show</span><select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none" aria-label="Rows per page">{[10, 20, 30, 50].map((limit) => <option key={limit} value={limit}>{limit}</option>)}</select><span>records</span></label>
          </div>
          <span className="text-xs text-slate-500">Page {currentPage} · {pageSize} per page</span>
        </div>
        {errorMessage && <div className="mx-4 mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{errorMessage}</div>}
        <div className="overflow-x-auto px-3 pb-1">
          {isLoading ? <div className="flex min-h-[150px] items-center justify-center border-y border-slate-100 text-sm text-slate-500">Loading {isReceiptReport ? 'receipt' : isReceiptNoteReport ? 'receipt note' : isSalesOrderReport ? 'sales order' : isDeliveryNoteReport ? 'delivery note' : isDebitNoteReport ? 'debit note' : isPaymentReport ? 'payment' : isPurchaseOrderReport ? 'purchase order' : 'credit note'} data...</div> : (
            <table className="min-w-[1200px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{orderedColumns.map((column) => <th key={column} className="whitespace-nowrap px-5 py-3 font-semibold">{label(column)}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-100">{rows.length > 0 ? rows.map((row, rowIndex) => <tr key={row.id || row._id || rowIndex} className="text-xs text-slate-700 hover:bg-slate-50">{orderedColumns.map((column) => { const value = formatValue(row[column], column); return <td key={`${rowIndex}-${column}`} title={value} className="max-w-[280px] px-5 py-3 leading-5 [overflow-wrap:anywhere]">{value}</td> })}</tr>) : <tr><td colSpan={Math.max(orderedColumns.length, 1)} className="h-[150px] text-center text-sm text-slate-500">No {isReceiptReport ? 'receipt' : isSalesOrderReport ? 'sales order' : isDeliveryNoteReport ? 'delivery note' : isDebitNoteReport ? 'debit note' : isPaymentReport ? 'payment' : isPurchaseOrderReport ? 'purchase order' : 'credit note'} data available.</td></tr>}</tbody>
            </table>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4">{Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 7).map((page) => <button key={page} type="button" disabled={isLoading} onClick={() => setCurrentPage(page)} className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium ${currentPage === page ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'} disabled:opacity-50`}>{page}</button>)}</div>
      </section>
    </div>
  )
}

// ============================================================
// GENERAL REPORT
// ============================================================

function ReportListPage({
  path,
  companyId,
}) {
  const config =
    reports[path] ||
    reports[
      '/purchaseorder'
    ]

  const [query, setQuery] =
    useState('')

  const [
    startDate,
    setStartDate,
  ] = useState(
    '2026-04-01'
  )

  const [
    endDate,
    setEndDate,
  ] = useState(
    '2027-03-31'
  )

  // ==========================================================
  // SALES
  // ==========================================================

  if (path === '/sales') {
    return (
      <SalesReport
        companyId={
          companyId
        }
      />
    )
  }

  if (path === '/cash-bank/cash') {
    return (
      <CashReport
        companyId={companyId}
      />
    )
  }

  if (path === '/cash-bank/bank') {
    return (
      <BankReport
        companyId={companyId}
      />
    )
  }

  if (path === '/creditnote') {
    return (
      <CreditNoteReport
        companyId={
          companyId
        }
      />
    )
  }

  if (path === '/purchaseorder') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="purchaseorder"
      />
    )
  }

  if (path === '/payments') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="payment"
      />
    )
  }

  if (path === '/debitnote') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="debitnote"
      />
    )
  }

  if (path === '/receipt') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="receipt"
      />
    )
  }

  if (path === '/receiptnote') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="receiptnote"
      />
    )
  }

  if (path === '/salesorder') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="salesorder"
      />
    )
  }

  if (path === '/deliverynote') {
    return (
      <CreditNoteReport
        companyId={companyId}
        reportType="deliverynote"
      />
    )
  }

  // ==========================================================
  // RECEIVABLES
  // ==========================================================

  if (
    config.mode ===
    'receivables'
  ) {
    return (
      <ReceivablesReport
        config={config}
        query={query}
        setQuery={setQuery}
        companyId={
          companyId
        }
      />
    )
  }

  // ==========================================================
  // ACCOUNTS
  // ==========================================================

  if (
    config.mode ===
    'accounts'
  ) {
    return (
      <AccountsReport
        config={config}
      />
    )
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">

      <div className="bg-white px-5 py-4">

        <div className="flex items-center justify-between">

          <div>

            <span className="block text-xs text-slate-600">
              {config.total}
            </span>

            <strong className="mt-1 block text-xl font-bold text-slate-900">
              ₹ 0.00
            </strong>

          </div>

          <DateRangeDisplay
            startDate={
              startDate
            }
            endDate={
              endDate
            }
            onChange={(
              nextStart,
              nextEnd
            ) => {
              setStartDate(
                nextStart ||
                  startDate
              )

              setEndDate(
                nextEnd ||
                  endDate
              )
            }}
          />

        </div>

      </div>

      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">

          <label className="flex h-9 w-[220px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400">

            <Search
              size={15}
              strokeWidth={2}
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(
                  event.target
                    .value
                )
              }
              placeholder="Search"
              className="w-full min-w-0 bg-transparent text-xs outline-none"
            />

          </label>

          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Gross
          </button>

          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Net
          </button>

          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Month
          </button>

          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Bill
          </button>

          <button
            type="button"
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Ledger
          </button>

          <button
            type="button"
            className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <span>
              More
            </span>

            <ChevronDown
              size={13}
              strokeWidth={2}
            />
          </button>

          <button
            type="button"
            className="ml-auto flex items-center gap-2 rounded border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            <FileText
              size={14}
              strokeWidth={2}
            />

            <span>
              View PDF
            </span>
          </button>

        </div>

        <ReportTable
          columns={
            config.columns
          }
          rows={
            config.rows ?? []
          }
        />

      </section>

    </div>
  )
}

export default ReportListPage