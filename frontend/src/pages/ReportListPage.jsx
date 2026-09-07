import { useEffect, useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'
import useAuthStore from '../store/authStore'
import {
  extractCustomerPagination,
  extractCustomers,
  extractCustomerTotal,
  fetchCustomers,
} from '../services/customersApi'
import {
  ArrowLeft,
  ArrowUp,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
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
    title: 'Payables',
    total: 'Total Payables:',
    mode: 'payables',
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
}) {
  const hasRows = rows.length > 0

  return (
    <div className="overflow-x-auto px-5">
      <div className="min-w-[520px]">

        {/* HEADER */}

        <div className="grid grid-cols-[1fr_140px] bg-[#edf2f6] px-4 py-2.5 text-xs font-medium text-slate-700">
          {columns.map((column) => (
            <b key={column}>
              {column}
            </b>
          ))}
        </div>

        {/* BODY */}

        {hasRows ? (
          rows.map((row, index) => (
            <div
              key={`${row[0] ?? 'row'}-${index}`}
              className="grid grid-cols-[1fr_140px] border-b border-slate-100 px-4 py-3 text-xs text-slate-700"
            >
              {row.map((value, valueIndex) => (
                <span
                  key={`${value}-${valueIndex}`}
                  className={
                    valueIndex === row.length - 1
                      ? 'text-right'
                      : ''
                  }
                >
                  {value}
                </span>
              ))}
            </div>
          ))
        ) : (
          <div className="flex min-h-[120px] items-center justify-center border-t border-slate-100 text-xs text-slate-500">
            No data available
          </div>
        )}

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
  const accessToken = useAuthStore((state) => state.accessToken)
  const [selectedFilter, setSelectedFilter] =
    useState('All')

  const [selectedTab, setSelectedTab] =
    useState('Detailed Summary')

  const [onAccount, setOnAccount] =
    useState(true)

  const [rows, setRows] =
    useState(config.rows ?? [])

  const [sentMessage, setSentMessage] =
    useState('')

  const [currentPage, setCurrentPage] =
    useState(1)

  const [pageSize, setPageSize] = useState(20)

  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOutstanding, setTotalOutstanding] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken || !companyId) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setTotalOutstanding(null)
      setErrorMessage(
        accessToken
          ? 'No company is selected. Load a company before viewing sundry debtors.'
          : 'Your session has expired. Please sign in again.'
      )
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    setErrorMessage('')

    fetchCustomers({
      companyId,
      accessToken,
      page: currentPage,
      limit: pageSize,
      q: query,
    })
      .then((response) => {
        if (!isMounted) return

        const customers = extractCustomers(response)
        setRows(customers.map((customer, index) => {
          const name = customer?.name || customer?.customerName || customer?.partyName || customer?.party_name || customer?.ledgerName || customer?.ledger_name || `Customer ${index + 1}`
          const outstanding = customer?.outstanding ?? customer?.outstandingAmount ?? customer?.outstanding_amount ?? customer?.closingBalance ?? customer?.closing_balance ?? customer?.balance ?? '-'
          const overdue = customer?.overdue ?? customer?.overdueAmount ?? customer?.overdue_amount ?? '-'
          const creditDays = customer?.creditDays ?? customer?.credit_days ?? '-'
          const averagePayDays = customer?.averagePayDays ?? customer?.avgPayDays ?? customer?.average_payment_days ?? customer?.average_pay_days ?? '-'

          return [
            String(((currentPage - 1) * pageSize) + index + 1),
            name,
            outstanding,
            overdue,
            creditDays,
            averagePayDays,
            'Set Reminder',
          ]
        }))

        const responseTotalOutstanding = extractCustomerTotal(response)
        setTotalOutstanding(responseTotalOutstanding)

        const pagination = extractCustomerPagination(response)
        const responseTotal = Number(
          pagination.total ??
          pagination.totalItems ??
          pagination.count ??
          pagination.totalRecords
        )
        const responsePages = Number(
          pagination.totalPages ??
          pagination.pages ??
          pagination.lastPage
        )
        const nextTotal = Number.isFinite(responseTotal) && responseTotal >= 0
          ? responseTotal
          : customers.length
        const nextPages = Number.isFinite(responsePages) && responsePages > 0
          ? responsePages
          : Math.max(1, Math.ceil(nextTotal / pageSize))

        setTotalItems(nextTotal)
        setTotalPages(nextPages)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(error.message || 'Unable to load sundry debtors')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, currentPage, pageSize, query])

  const filterOptions = [
    'All',
    'Due Today',
    'Not Due',
  ]

  const headerTabs = [
    'Detailed Summary',
    'Manage Reminders',
    'SMS Credits',
    'Customize Template',
  ]

  const filteredRows = rows

  const displayedOutstanding = totalOutstanding ?? rows.reduce((total, row) => {
    const amount = Number(String(row[2]).replace(/[^\d.-]/g, ''))
    return Number.isFinite(amount) ? total + amount : total
  }, 0)

  const formattedOutstanding = totalOutstanding === null && displayedOutstanding === 0
    ? '-'
    : typeof displayedOutstanding === 'number'
      ? displayedOutstanding.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
      : displayedOutstanding

  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : currentPage <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : currentPage >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  const paginationDisabled = isLoading || totalPages <= 1

  const handleSearchChange = (event) => {
    setQuery(event.target.value)
    setCurrentPage(1)
  }

  // ==========================================================
  // REMINDER
  // ==========================================================

  const handleReminder = (customer) => {
    setSentMessage(
      `Reminder sent to ${customer}`
    )

    setTimeout(() => {
      setSentMessage('')
    }, 2000)
  }

  // ==========================================================
  // MARK PAID
  // ==========================================================

  const handleMarkPaid = (customer) => {
    setRows((currentRows) =>
      currentRows.filter(
        (row) => row[1] !== customer
      )
    )

    setSentMessage(
      `${customer} marked as paid`
    )

    setTimeout(() => {
      setSentMessage('')
    }, 2000)
  }

  // ==========================================================
  // BULK REMINDER
  // ==========================================================

  const handleBulkReminder = () => {
    setSentMessage(
      'Bulk reminders queued successfully'
    )

    setTimeout(() => {
      setSentMessage('')
    }, 2000)
  }

  // ==========================================================
  // TABLE ROWS
  // ==========================================================

  const displayRows = filteredRows.map(
    (row) => [
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],

      <div
        key={row[1]}
        className="flex items-center gap-2 whitespace-nowrap"
      >

        {/* PHONE / MESSAGE */}

        <button
          type="button"
          onClick={() =>
            handleReminder(row[1])
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

        {/* PDF */}

        <button
          type="button"
          onClick={() =>
            handleReminder(row[1])
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

        {/* REMINDER */}

        <button
          type="button"
          onClick={() =>
            handleReminder(row[1])
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

      </div>,
    ]
  )

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* ====================================================== */}
      {/* TOP NAV */}
      {/* ====================================================== */}

      <div className="flex min-h-[62px] items-end border-b border-slate-200 bg-white px-3">

        <div className="flex items-end gap-1 overflow-x-auto">

          {headerTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() =>
                setSelectedTab(tab)
              }
              className={`
                relative
                whitespace-nowrap
                px-3
                py-4
                text-[13px]
                ${
                  selectedTab === tab
                    ? 'font-semibold text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black'
                    : 'text-slate-700 hover:text-black'
                }
              `}
            >
              {tab}
            </button>
          ))}

        </div>

        {/* ACCOUNT + BULK */}

        <div className="ml-auto hidden items-center gap-3 pb-2 lg:flex">

          {/* ON ACCOUNT */}

          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800">

            <span>
              On Account
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={onAccount}
              onClick={() =>
                setOnAccount((current) => !current)
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

          {/* BULK REMINDER */}

          <button
            type="button"
            onClick={handleBulkReminder}
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

      {/* ====================================================== */}
      {/* MAIN CARD */}
      {/* ====================================================== */}

      <section className="mx-3 mt-2 overflow-hidden rounded-[6px] border border-white bg-white shadow-[0_3px_15px_rgba(24,33,43,0.06)] lg:mx-3">

        {/* ==================================================== */}
        {/* CARD TOP */}
        {/* ==================================================== */}

        <div className="flex flex-wrap items-center gap-3 px-4 py-4">

          {/* TOTAL */}

          <div className="min-w-[145px]">

            <span className="block text-[12px] text-slate-700">
              Total Outstanding
            </span>

            <strong className="mt-1 block text-[16px] font-bold text-[#18202a]">
              {formattedOutstanding}
            </strong>

          </div>

          {/* FILTER ICON */}

          <button
            type="button"
            className="
              flex
              h-[29px]
              w-[32px]
              items-center
              justify-center
              rounded-[5px]
              border
              border-slate-300
              bg-white
              text-slate-600
              hover:bg-slate-50
            "
            title="Filter"
            aria-label="Filter"
          >
            <Filter
              size={15}
              strokeWidth={2}
            />
          </button>

          {/* FILTERS */}

          <div className="flex items-center overflow-hidden rounded-[5px] bg-[#f1f3f5]">

            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelectedFilter(option)
                  setCurrentPage(1)
                }}
                className={`
                  min-h-[32px]
                  whitespace-nowrap
                  px-3
                  text-[12px]
                  ${
                    selectedFilter === option
                      ? 'rounded-[5px] border border-[#151515] bg-white font-medium text-black'
                      : 'text-slate-700 hover:bg-white/60'
                  }
                `}
              >
                {option}
              </button>
            ))}

            <button
              type="button"
              className="
                flex
                min-h-[32px]
                items-center
                gap-1
                px-3
                text-[12px]
                text-slate-700
                hover:bg-white/60
              "
            >
              <span>
                More
              </span>

              <ChevronDown
                size={13}
                strokeWidth={2}
              />
            </button>

          </div>

          {/* SEARCH */}

          <label className="flex h-[32px] items-center gap-2 text-[12px] text-slate-600">
            <span className="whitespace-nowrap">Show</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setCurrentPage(1)
              }}
              className="h-[32px] rounded-[5px] border border-slate-300 bg-white px-2 outline-none focus:border-[#168acb]"
              aria-label="Rows per page"
            >
              {[10, 20, 30, 50].map((limit) => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
            </select>
            <span className="whitespace-nowrap">records</span>
          </label>

          <label className="ml-auto flex h-[32px] w-[180px] items-center gap-2 rounded-[5px] border border-slate-300 bg-white px-3">

            <Search
              size={15}
              strokeWidth={2}
              className="shrink-0 text-slate-400"
            />

            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Search"
              className="
                w-full
                bg-transparent
                text-[12px]
                text-slate-700
                outline-none
                placeholder:text-slate-400
              "
            />

          </label>

          {/* PDF */}

          <button
            type="button"
            className="
              flex
              h-[32px]
              w-[34px]
              items-center
              justify-center
              rounded-[5px]
              border
              border-slate-300
              bg-white
              text-red-500
              hover:bg-red-50
            "
            title="Export PDF"
            aria-label="Export PDF"
          >
            <FileText
              size={15}
              strokeWidth={2}
            />
          </button>

        </div>

        {/* ==================================================== */}
        {/* MESSAGE */}
        {/* ==================================================== */}

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

        {/* ==================================================== */}
        {/* TABLE */}
        {/* ==================================================== */}

        <div className="overflow-x-auto px-3">

          <div className="min-w-[950px]">

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[45px_1.5fr_1.25fr_1.25fr_1fr_1.05fr_220px]
                items-center
                border
                border-[#d7dde3]
                bg-[#eef2f6]
                px-3
                py-2.5
                text-[12px]
                font-semibold
                text-[#18202a]
              "
            >

              <div>
                #
              </div>

              <div>
                Customer Name
              </div>

              <div className="flex items-center justify-end gap-1">
                <ArrowUp
                  size={12}
                  strokeWidth={2}
                />

                <span>
                  Outstanding
                </span>
              </div>

              <div className="text-right">
                Overdue
              </div>

              <div className="text-center">
                Credit Days
              </div>

              <div className="text-center">
                Avg Pay Days
              </div>

              <div className="text-center">
                Action
              </div>

            </div>

            {/* TABLE BODY */}

            {isLoading ? (
              <div className="flex min-h-[120px] items-center justify-center border-x border-b border-[#d9dee3] text-xs text-slate-500">
                Loading sundry debtors...
              </div>
            ) : displayRows.length > 0 ? (

              displayRows.map((row, index) => (

                <div
                  key={index}
                  className="
                    grid
                    grid-cols-[45px_1.5fr_1.25fr_1.25fr_1fr_1.05fr_220px]
                    min-h-[37px]
                    items-center
                    border-x
                    border-b
                    border-[#d9dee3]
                    px-3
                    text-[12px]
                    text-[#18202a]
                    hover:bg-[#fafcfd]
                  "
                >

                  <div>
                    {row[0]}
                  </div>

                  <div className="pr-3 leading-4 text-[#1474c4]">
                    {row[1]}
                  </div>

                  <div className="whitespace-nowrap text-right">
                    {row[2]}
                  </div>

                  <div className="whitespace-nowrap text-right">
                    {row[3]}
                  </div>

                  <div className="text-center">
                    {row[4]}
                  </div>

                  <div className="whitespace-nowrap text-center">
                    {row[5]}
                  </div>

                  <div className="flex justify-center">
                    {row[6]}
                  </div>

                </div>

              ))

            ) : (

              <div className="flex min-h-[150px] items-center justify-center border-x border-b border-[#d9dee3] text-xs text-slate-500">
                No data available
              </div>

            )}

          </div>

        </div>

        {/* ==================================================== */}
        {/* FOOTER */}
        {/* ==================================================== */}

        <div className="flex items-center justify-between px-4 py-4">

          <span className="text-[12px] text-slate-700">
            {totalItems === 0
              ? '0 of 0'
              : `${((currentPage - 1) * pageSize) + 1}-${((currentPage - 1) * pageSize) + displayRows.length} of ${totalItems}`}
          </span>

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={paginationDisabled || currentPage === 1}
              className="
                flex
                h-[30px]
                w-[31px]
                items-center
                justify-center
                rounded
                border
                border-slate-200
                bg-white
                text-slate-400
                shadow-sm
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft
                size={17}
                strokeWidth={2}
              />
            </button>

            {/* PAGE NUMBERS */}

            {pageItems.map((page, index) => page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-[30px] min-w-[31px] items-center justify-center text-[12px] text-slate-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                disabled={paginationDisabled}
                onClick={() => setCurrentPage(page)}
                className={`
                  flex
                  h-[30px]
                  min-w-[31px]
                  items-center
                  justify-center
                  rounded
                  border
                  text-[12px]
                  font-medium
                  shadow-sm
                  ${
                    currentPage === page
                      ? 'border-[#168acb] bg-[#168acb] text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }
                  disabled:cursor-not-allowed disabled:opacity-50
                `}
              >
                {page}
              </button>
            ))}

            {/* LAST PAGE */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(totalPages)
              }
              disabled={paginationDisabled || currentPage === totalPages}
              className={`
                flex
                h-[30px]
                min-w-[31px]
                items-center
                justify-center
                rounded
                border
                text-[12px]
                font-medium
                shadow-sm
                ${
                  currentPage === totalPages
                    ? 'border-[#168acb] bg-[#168acb] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }
                  disabled:cursor-not-allowed disabled:opacity-50
              `}
            >
              {totalPages}
            </button>

            {/* NEXT */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={paginationDisabled || currentPage === totalPages}
              className="
                flex
                h-[30px]
                w-[31px]
                items-center
                justify-center
                rounded
                border
                border-slate-200
                bg-white
                text-slate-700
                shadow-sm
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Next page"
              aria-label="Next page"
            >
              <ChevronRight
                size={17}
                strokeWidth={2}
              />
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

// ============================================================
// ACCOUNTS REPORT
// ============================================================

function AccountsReport({ config }) {
  const [startDate, setStartDate] =
    useState('2026-04-01')

  const [endDate, setEndDate] =
    useState('2027-03-31')

  const [query, setQuery] =
    useState('')

  const [label, amount] =
    config.total.split('₹')

  const filteredRows =
    (config.rows ?? []).filter((row) => {
      const name = String(
        row[0] ?? ''
      ).toLowerCase()

      return name.includes(
        query.toLowerCase()
      )
    })

  return (
    <div className="report-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* HEADER */}

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
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(
              nextStart || startDate
            )

            setEndDate(
              nextEnd || endDate
            )
          }}
        />

      </div>

      {/* CARD */}

      <section className="mx-5 mt-2.5 overflow-hidden rounded-lg bg-white shadow">

        <div className="flex flex-wrap items-center gap-4 px-5 py-3">

          {/* SEARCH */}

          <label className="flex h-9 w-[200px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">

            <Search
              size={15}
              strokeWidth={2}
            />

            <input
              className="w-full bg-transparent text-xs outline-none"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search"
            />

          </label>

          <span className="ml-auto text-xs">
            Rows per page: 10
          </span>

        </div>

        <ReportTable
          columns={config.columns}
          rows={filteredRows}
        />

      </section>

    </div>
  )
}

// ============================================================
// GENERAL REPORT
// ============================================================

function ReportListPage({ path, companyId }) {
  const config =
    reports[path] ||
    reports['/purchaseorder']

  const [query, setQuery] =
    useState('')

  const [startDate, setStartDate] =
    useState('2026-04-01')

  const [endDate, setEndDate] =
    useState('2027-03-31')

  if (config.mode === 'receivables') {
    return (
      <ReceivablesReport
        config={config}
        query={query}
        setQuery={setQuery}
        companyId={companyId}
      />
    )
  }

  if (config.mode === 'accounts') {
    return (
      <AccountsReport
        config={config}
      />
    )
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8]">

      {/* HEADER */}

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
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(
                nextStart || startDate
              )

              setEndDate(
                nextEnd || endDate
              )
            }}
          />

        </div>

      </div>

      {/* CARD */}

      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-3">

          {/* SEARCH */}

          <label className="flex h-9 w-[220px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400">

            <Search
              size={15}
              strokeWidth={2}
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search"
              className="w-full bg-transparent text-xs outline-none"
            />

          </label>

          {/* FILTER BUTTONS */}

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
            <span>More</span>
            <ChevronDown
              size={13}
              strokeWidth={2}
            />
          </button>

          {/* VIEW PDF */}

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
          columns={config.columns}
          rows={config.rows ?? []}
        />

        {/* FOOTER PAGINATION */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-600">

          <span>
            1-0 of 0
          </span>

          <div className="flex items-center gap-1">

            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              ‹
            </button>

            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default ReportListPage