import { useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'

const reports = {
  '/sales': { title: 'Sales', total: 'Total Sales:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/purchase': { title: 'Purchase', total: 'Total Purchase:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/purchaseorder': { title: 'Purchase Order', total: 'Total Purchase Order:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/payables': {
    title: 'Payables',
    total: 'Total Payables:',
    mode: 'payables',
    columns: ['Name', 'Credit Days', 'Average Pay Days', 'Due Amount'],
    rows: [
      ['CS Vaibhav Aggarwal', '0', '0.00 days', '₹ 6,000.00'],
      ['Rajiv Abhishek & Associates', '1 Days', '0.00 days', '₹ 11,800.00'],
    ],
  },
  '/payments': { title: 'Payment', total: 'Total Payment:', mode: 'payment', columns: ['Month', 'Amount'] },
  '/debitnote': { title: 'Debit Notes', total: 'Total Debit Notes:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/creditnote': { title: 'Credit Note', total: 'Total Credit Note:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/receivables': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: ['#', 'Customer Name', 'Outstanding', 'Overdue', 'Credit Days', 'Avg Pay Days', 'Action'],
    rows: [
      ['1', 'Amit Traders', '₹ 18,500', 'Due Today', '15 Days', '12 Days', 'Send reminder'],
      ['2', 'Bharat Metals', '₹ 24,000', 'Past Due', '30 Days', '22 Days', 'Send reminder'],
      ['3', 'Classic Garments', '₹ 12,750', 'Not Due', '5 Days', '8 Days', 'Send reminder'],
      ['4', 'Delhi Packaging', '₹ 31,200', 'Past Due', '45 Days', '26 Days', 'Send reminder'],
    ],
  },
  '/collect-payments': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: ['#', 'Customer Name', 'Outstanding', 'Overdue', 'Credit Days', 'Avg Pay Days', 'Action'],
    rows: [
      ['1', 'Amit Traders', '₹ 18,500', 'Due Today', '15 Days', '12 Days', 'Send reminder'],
      ['2', 'Bharat Metals', '₹ 24,000', 'Past Due', '30 Days', '22 Days', 'Send reminder'],
      ['3', 'Classic Garments', '₹ 12,750', 'Not Due', '5 Days', '8 Days', 'Send reminder'],
      ['4', 'Delhi Packaging', '₹ 31,200', 'Past Due', '45 Days', '26 Days', 'Send reminder'],
      ['5', 'Fortune Foods', '₹ 9,850', 'Not Due', '7 Days', '10 Days', 'Send reminder'],
    ],
  },
  '/receivablesnew': {
    title: 'Receivables',
    total: 'Total Outstanding',
    mode: 'receivables',
    columns: ['#', 'Customer Name', 'Outstanding', 'Overdue', 'Credit Days', 'Avg Pay Days', 'Action'],
    rows: [
      ['1', 'Amit Traders', '₹ 18,500', 'Due Today', '15 Days', '12 Days', 'Send reminder'],
      ['2', 'Bharat Metals', '₹ 24,000', 'Past Due', '30 Days', '22 Days', 'Send reminder'],
      ['3', 'Classic Garments', '₹ 12,750', 'Not Due', '5 Days', '8 Days', 'Send reminder'],
      ['4', 'Delhi Packaging', '₹ 31,200', 'Past Due', '45 Days', '26 Days', 'Send reminder'],
    ],
  },
  '/receipt': { title: 'Receipt', total: 'Total Receipt:', mode: 'payment', columns: ['Month', 'Amount'] },
  '/receiptnote': { title: 'Receipt Note', total: 'Total Gross Amount:', mode: 'payment', columns: ['Month', 'Amount'] },
  '/deliverynote': { title: 'Delivery Note', total: 'Total Gross Amount:', mode: 'payment', columns: ['Month', 'Amount'] },
  '/salesorder': { title: 'Sales Order', total: 'Total Sales Order:', mode: 'gross', columns: ['Month', 'Amount'] },
  '/cash/voucher-list/cash-in-hand': { title: 'Cash', total: 'Total Amount: ₹ 3,09,591.00', mode: 'accounts', columns: ['Name', 'Balance'], rows: [['Cash', '₹ 3,09,591.00 Dr']] },
  '/cash-bank/cash': { title: 'Cash', total: 'Total Amount: ₹ 3,09,591.00', mode: 'accounts', columns: ['Name', 'Balance'], rows: [['Cash', '₹ 3,09,591.00 Dr']] },
  '/cash-bank/bank': { title: 'Bank', total: 'Total Amount: ₹ 8,405.71', mode: 'accounts', columns: ['Name', 'Balance'], rows: [['Allahabad Bank OD A/c No. 50278830873', '₹ 37,676.27 Dr'], ['ICICI Bank-630005010396', '₹ 17,681.51 Dr'], ['Sbi Bank-5456', '₹ 46,952.07 Cr']] },
  '/bank/voucher-list/bank-accounts': { title: 'Bank', total: 'Total Amount: ₹ 8,405.71', mode: 'accounts', columns: ['Name', 'Balance'], rows: [['Allahabad Bank OD A/c No. 50278830873', '₹ 37,676.27 Dr'], ['ICICI Bank-630005010396', '₹ 17,681.51 Dr'], ['Sbi Bank-5456', '₹ 46,952.07 Cr']] },
}

const DateRangeDisplay = ({ startDate = '2026-04-01', endDate = '2027-03-31', onChange }) => (
  <div className="ml-auto">
    <DateRangePicker startDate={startDate} endDate={endDate} onChange={onChange} compact />
  </div>
)

function ReportTable({ columns, rows = [], columnsClass = 'grid-cols-[1fr_140px]', minWidth = '520px' }) {
  const hasRows = rows.length > 0

  return (
    <>
      <div className="report-table overflow-x-auto px-5">
        <div className={`report-header grid min-w-[${minWidth}] ${columnsClass} bg-[#edf2f6] px-4 py-2.5 text-xs font-medium text-slate-700`}>
          {columns.map((column) => (
            <b key={column}>
              {column}
              {column === 'Month' && ' ↓'}
              {column === 'Outstanding' && ' ↑'}
            </b>
          ))}
        </div>

        {hasRows ? (
          rows.map((row, index) => (
            <div key={`${row[0] ?? 'row'}-${index}`} className={`report-row grid min-w-[${minWidth}] ${columnsClass} border-b border-slate-100 px-4 py-3 text-xs text-slate-700`}>
              {row.map((value, valueIndex) => (
                <span key={`${value}-${valueIndex}`} className={valueIndex === row.length - 1 ? 'text-right' : ''}>
                  {value}
                </span>
              ))}
            </div>
          ))
        ) : (
          <div className={`report-empty flex min-h-[120px] min-w-[${minWidth}] items-center justify-center border-t border-slate-100 px-4 py-3 text-center text-xs text-slate-500`}>
            No data available
          </div>
        )}
      </div>

      <footer className="report-footer flex justify-between px-5 py-4 text-xs text-slate-700">
        <span>{hasRows ? `1-${rows.length} of ${rows.length}` : '1-0 of 0'}</span>
        <span>
          ‹　<b>1</b>　›
        </span>
      </footer>
    </>
  )
}

function ReceivablesReport({ config, query, setQuery }) {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [selectedTab, setSelectedTab] = useState('Detailed Summary')
  const [rows, setRows] = useState(config.rows ?? [])
  const [sentMessage, setSentMessage] = useState('')

  const filterOptions = ['All', 'Due Today', 'Not Due', 'Past Due']
  const headerTabs = ['Detailed Summary', 'Manage Reminders', 'SMS Credits', 'Customize Template']

  const filteredRows = rows.filter((row) => {
    const customerName = String(row[1] ?? '').toLowerCase()
    const matchesQuery = customerName.includes(String(query ?? '').toLowerCase())
    const overdue = String(row[3] ?? '')
    const matchesFilter = selectedFilter === 'All' || overdue === selectedFilter
    return matchesQuery && matchesFilter
  })

  const handleReminder = (customer) => {
    setSentMessage(`Reminder sent to ${customer}`)
    setTimeout(() => setSentMessage(''), 1800)
  }

  const handleMarkPaid = (customer) => {
    setRows((currentRows) => currentRows.filter((row) => row[1] !== customer))
    setSentMessage(`${customer} marked as paid`)
    setTimeout(() => setSentMessage(''), 1800)
  }

  const displayRows = filteredRows.map((row) => [
    row[0],
    row[1],
    row[2],
    row[3],
    row[4],
    row[5],
    <div key={row[1]} className="flex gap-1.5">
      <button type="button" onClick={() => handleReminder(row[1])} className="rounded border border-slate-300 bg-white px-1.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-slate-400">
        Reminder
      </button>
      <button type="button" onClick={() => handleMarkPaid(row[1])} className="rounded bg-green-600 px-1.5 py-1 text-[10px] font-semibold text-white hover:bg-green-700">
        Paid
      </button>
    </div>,
  ])

  return (
    <div className="report-page receivables-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="report-tabs flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-700">
        {headerTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedTab(tab)}
            className={selectedTab === tab
              ? 'rounded-lg bg-[#1f2d3d] px-4 py-2.5 font-medium text-white shadow-sm'
              : 'rounded-lg bg-[#eef2f6] px-4 py-2.5 text-slate-700 hover:bg-slate-200'}
          >
            {tab}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            On Account
            <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-green-500 px-1">
              <span className="inline-block h-3.5 w-3.5 rounded-full bg-white translate-x-4 transition-transform" />
            </span>
          </label>
          <button type="button" onClick={() => setSentMessage('Bulk reminders queued')} className="rounded-md bg-slate-900 px-3 py-2 text-[10px] font-bold text-white uppercase">
            Bulk Reminders
          </button>
        </div>
      </div>

      <section className="report-card mx-5 mt-2.5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="receivables-toolbar flex flex-wrap items-center gap-4 px-5 py-4">
          <div className="mr-auto text-xs text-slate-800">
            <span className="block">Total Outstanding</span>
            <b className="mt-1 block text-sm">₹ 0.00</b>
          </div>
          <button className="filter-icon rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" type="button">
            ≡
          </button>
          <div className="report-filters flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedFilter(option)}
                className={selectedFilter === option ? 'filter-active rounded-md border border-slate-900 bg-white px-3 py-2 text-slate-800' : 'rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700'}
              >
                {option}
              </button>
            ))}
          </div>
          <label className="report-search flex h-8 w-[180px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">
            <span>⌕</span>
            <input className="w-full bg-transparent text-xs outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
          <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-red-500" type="button">
            ▣
          </button>
        </div>

        {sentMessage && <div className="mx-5 mt-0 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{sentMessage}</div>}

        <ReportTable
          columns={['#', 'Customer Name', 'Outstanding', 'Overdue', 'Credit Days', 'Avg Pay Days', 'Action']}
          rows={displayRows}
          columnsClass="grid-cols-[55px_1.3fr_1fr_1fr_1fr_1fr_120px]"
          minWidth="760px"
        />
      </section>
    </div>
  )
}

function AccountsReport({ config }) {
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const [label, amount] = config.total.split('₹')

  return (
    <div className="report-page accounts-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="report-summary flex min-h-[59px] items-center gap-4 border-b border-slate-200 bg-white px-4">
        <span className="back-arrow text-3xl font-light leading-none text-slate-900" aria-hidden="true">←</span>
        <div className="text-[11px] leading-4 text-slate-700">
          <b className="block font-medium">{label.trim()}</b>
          <strong className="block text-sm text-slate-900">₹{amount}</strong>
        </div>
        <div className="ml-auto">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart || startDate)
              setEndDate(nextEnd || endDate)
            }}
            compact
          />
        </div>
      </div>

      <section className="report-card mx-5 mt-2.5 min-h-[183px] overflow-hidden rounded-lg border border-white bg-white p-5 shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="accounts-toolbar pb-5 text-xs text-slate-700">Rows per page:　10　⌄</div>
        <ReportTable columns={config.columns} rows={config.rows ?? []} />
      </section>
    </div>
  )
}

function ReportListPage({ path }) {
  const [query, setQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Gross')
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const config = reports[path] || reports['/purchaseorder']

  if (config.mode === 'receivables') {
    return <ReceivablesReport config={config} query={query} setQuery={setQuery} />
  }

  if (config.mode === 'accounts') {
    return <AccountsReport config={config} />
  }

  const isPayment = config.mode === 'payment'
  const isPayables = config.mode === 'payables'
  const filterButtons = isPayables
    ? ['All', 'All Due', 'Due Today', 'Not Due']
    : isPayment
      ? ['Month', 'Bill', 'Voucher Type', 'More⌄']
      : ['Gross', 'Net', 'Month', 'Bill', 'Ledger', 'More⌄']

  return (
    <div className="report-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="report-summary flex min-h-[64px] flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-4 py-2.5 lg:flex-nowrap">
        <span className="back-arrow text-3xl font-light leading-none text-slate-900" aria-hidden="true">←</span>
        <div className="min-w-[130px] text-[11px] leading-4 text-slate-700">
          <b className="block font-medium">{config.total}</b>
          {!config.total.includes('₹') && <strong className="block text-sm text-slate-900">₹ 0.00</strong>}
        </div>

        <div className="report-filters flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
          {filterButtons.map((button) => (
            <button
              key={button}
              type="button"
              onClick={() => setSelectedFilter(button)}
              className={selectedFilter === button ? 'filter-active rounded-md border border-slate-900 bg-white px-3 py-2 text-slate-800' : 'rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700'}
            >
              {button}
            </button>
          ))}
        </div>

        {isPayables ? (
          <div className="date-filter ml-auto flex min-h-8 items-center rounded-md border border-slate-300 bg-white px-3 text-xs font-medium whitespace-nowrap text-slate-700">
            All Payables⌄
          </div>
        ) : (
          <DateRangeDisplay
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart || startDate)
              setEndDate(nextEnd || endDate)
            }}
          />
        )}
      </div>

      <section className="report-card mx-5 mt-2.5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="report-toolbar flex flex-wrap items-center gap-4 px-5 py-3">
          <label className="report-search flex h-9 w-[200px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">
            <span>⌕</span>
            <input className="w-full bg-transparent text-xs outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
          <span className="text-xs text-slate-700">Rows per page:　10　⌄</span>
          <button className="pdf-button ml-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700" type="button">
            ▣　View PDF
          </button>
        </div>

        <ReportTable columns={config.columns} rows={config.rows ?? []} />
      </section>
    </div>
  )
}

import '../css/pages/reports-pages.css'

export default ReportListPage
