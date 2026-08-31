import { useEffect, useState } from 'react'

const summaryMetrics = [
  { label: 'CASH', value: '₹3,09,591', href: '/cash-bank/cash' },
  { label: 'BANK', value: '₹8,406', href: '/cash-bank/bank' },
  { label: 'INVENTORY AMOUNT', value: '₹ 0', href: '/items' },
  { label: 'PAYABLES', value: '₹17,800', href: '/payables' },
]

const attentionItems = [
  { label: 'INACTIVE CUSTOMERS', value: '20', href: '/inactive-customers' },
  { label: 'INACTIVE STOCKS', value: '0', href: '/inactive-stocks' },
  { label: 'PAYMENT REMINDERS', value: '0 Mobile Missing | 0 Email Missing', href: '/manage-reminders' },
]

const monthLabels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const agingBreakdown = [
  ['0 - 45 Days', '#57e3b0'],
  ['45 - 90 Days', '#ff8b8b'],
  ['90 - 135 Days', '#ffbd98'],
  ['135 - 180 Days', '#f8d77d'],
  ['180 - 225 Days', '#a9a0e9'],
  ['> 225 Days', '#70c1df'],
]

function Arrow() {
  return (
    <span className="absolute right-3 top-[25px] text-[18px]" aria-hidden="true">
      ›
    </span>
  )
}

function Panel({ title, action, children, className = '' }) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-[#e1e5e7] bg-white shadow-[0_8px_30px_rgba(24,33,43,0.04)] ${className}`}
    >
      <header className="flex min-h-[35px] items-center border-b border-[#edf0f1] px-[13px] text-[13px]">
        <strong className="flex items-center gap-[7px]">{title}</strong>
        {action ?? <span className="ml-auto text-[18px]">⌄</span>}
      </header>

      {children}
    </section>
  )
}

function DashboardPage({
  activeTab,
  setActiveTab,
  selectedPeriod,
  setSelectedPeriod,
  dayBookDate,
  setDayBookDate,
  openCustomDatePicker,
  customDateInput,
}) {
  const [receivableProgress, setReceivableProgress] = useState(0)

  useEffect(() => {
    let animationFrame

    const startTime = performance.now()
    const duration = 1500

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      setReceivableProgress(Math.round(progress * 100))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-2 bg-[#f0f3f5] p-2 md:grid-cols-2 md:gap-x-3">
      <Panel
        title="Summary"
        action={
          <select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            className="ml-auto border-0 bg-white text-[11px] outline-none"
          >
            <option>This Year (1st Apr ’26 - 31st Mar ’27)</option>
            <option>This Month</option>
          </select>
        }
      >
        <div className="grid grid-cols-2">
          {summaryMetrics.map(({ label, value, href }, index) => (
            <a
              key={label}
              href={href}
              className={`relative flex min-h-[51px] flex-col gap-1 border-b border-[#f0f1f2] px-[13px] py-[8px] text-left ${
                index % 2 === 0 ? 'border-r border-[#f0f1f2]' : ''
              }`}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <span className="text-[10px] font-semibold text-[#8a8d8f]">{label}</span>
              <b className="text-[12px]">{value}</b>
              <Arrow />
            </a>
          ))}
        </div>
      </Panel>

      <Panel
        title={
          <>
            <span>Need Attention</span>
            <i className="inline-grid h-[13px] w-[13px] place-items-center rounded-full bg-[#ec5671] text-[9px] font-normal text-white">
              !
            </i>
          </>
        }
        className="min-h-[142px]"
      >
        <div className="grid grid-cols-2">
          {attentionItems.map(({ label, value, href }, index) => (
            <a
              key={label}
              href={href}
              className={`relative flex min-h-[51px] flex-col gap-1 border-b border-[#f0f1f2] px-[13px] py-[8px] text-left ${
                index % 2 === 0 ? 'border-r border-[#f0f1f2]' : ''
              }`}
              style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              <span className="text-[10px] font-semibold text-[#8a8d8f]">{label}</span>
              <b className="text-[12px]">{value}</b>
              <Arrow />
            </a>
          ))}
          <div className="relative flex min-h-[51px] flex-col gap-1 border-b border-[#f0f1f2] px-[13px] py-[8px] text-left">
            <span className="text-[10px] font-semibold text-[#8a8d8f]">SMS CREDITS</span>
            <b className="text-[12px]">10</b>
          </div>
        </div>
      </Panel>

      <Panel
        title="Sales & Receipt"
        action={
          <select defaultValue="year" className="ml-auto border-0 bg-white text-[11px] outline-none">
            <option value="year">This Year (1st Apr ’26 - 31st Mar ’27)</option>
          </select>
        }
        className="min-h-[314px]"
      >
        <div className="flex gap-2 px-[13px] py-2">
          <div className="flex-1 bg-[#fafafa] p-[7px] text-[11px]">
            <span className="flex items-center justify-between gap-2">
              <span>Total Sales</span>
              <b>₹ 0</b>
            </span>
          </div>
          <div className="flex-1 bg-[#fafafa] p-[7px] text-[11px]">
            <span className="flex items-center justify-between gap-2">
              <span>Total Receipt</span>
              <b>₹ 0</b>
            </span>
          </div>
        </div>

        <div className="text-center text-[10px] text-[#8b8e90]">
          <i className="ml-[12px] mr-[5px] inline-block h-[10px] w-[35px] align-middle bg-[#11be65]" />
          Sales
          <i className="ml-[12px] mr-[5px] inline-block h-[10px] w-[35px] align-middle bg-[#caffce]" />
          Receipt
        </div>

        <div className="flex h-[164px] px-[14px] pt-[8px]">
          <div className="flex flex-col justify-between pb-[18px] text-[9px] text-[#929597]">
            <span>1.0</span>
            <span>0.8</span>
            <span>0.6</span>
            <span>0.4</span>
            <span>0.2</span>
            <span>0</span>
          </div>

          <div className="relative ml-2 flex flex-1 items-end justify-between pb-[5px] text-[9px] text-[#8a8d8f]">
            <div
              className="absolute inset-x-0 top-[4px] bottom-[20px]"
              style={{
                background:
                  'repeating-linear-gradient(to bottom, #edf0f1 0, #edf0f1 1px, transparent 1px, transparent 20%)',
              }}
            />
            {monthLabels.map((month) => (
              <span key={month} className="relative z-10">
                {month}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-[#eceeef] text-center">
          <div className="flex flex-col gap-1 p-2">
            <b className="text-[10px]">SALES THIS MONTH</b>
            <strong className="text-[12px]">₹ 0</strong>
            <span className="text-[12px] font-bold text-[#5c9b48]">
              0% <small className="text-[10px] font-normal text-[#6f7274]">↗ vs Last Month</small>
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-[#eceeef] p-2">
            <b className="text-[10px]">RECEIPT THIS MONTH</b>
            <strong className="text-[12px]">₹ 0</strong>
            <span className="text-[12px] font-bold text-[#5c9b48]">
              0% <small className="text-[10px] font-normal text-[#6f7274]">↗ vs Last Month</small>
            </span>
          </div>
        </div>
      </Panel>

      <Panel
        title="Receivables"
        action={<a href="#all" className="ml-auto text-[11px] text-slate-600">View All</a>}
        className="min-h-[314px]"
      >
        <div className="flex min-h-[194px] gap-3 px-[13px] pb-[7px] pt-[11px]">
          <div className="h-[22px] flex-1 bg-[#fafafa] p-[7px] text-[11px]">
            <span className="flex items-center justify-between gap-2">
              <span>Total Receivables</span>
              <b>₹ 10,42,23,145</b>
            </span>
          </div>

          <div className="flex w-full items-center justify-center py-2" style={{ minHeight: '220px' }}>
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: '200px',
                height: '200px',
                background: `conic-gradient(#63b6ee ${receivableProgress}%, #e5e7eb ${receivableProgress}% 100%)`,
                transition: 'background 0.05s linear',
              }}
            >
              <div className="rounded-full bg-white" style={{ width: '138px', height: '138px' }} />
            </div>
          </div>

          <div className="flex w-[47%] flex-col gap-[7px] pl-[20px] pt-[8px]">
            {agingBreakdown.map(([label, color]) => (
              <div key={label} className="flex items-center gap-2">
                <i className="h-2 w-[35px]" style={{ background: color }} />
                <span className="flex flex-1 items-center justify-between gap-2 text-right text-[10px]">
                  <span>{label}</span>
                  <b className="block text-[11px]">₹ 0</b>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-[#eceeef] text-center">
          {[
            ['TOTAL OVERDUE AMOUNT', '₹ 0'],
            ['PROJECTIONS IN 15 DAYS', '₹ 0'],
            ['PROJECTIONS IN 60 DAYS', '₹ 0'],
          ].map(([label, value], index) => (
            <span
              key={label}
              className={`px-1 py-[10px] text-[9px] font-bold ${index > 0 ? 'border-l border-[#eceeef]' : ''}`}
            >
              {label}
              <b className="mt-[5px] block text-[11px]">{value}</b>
            </span>
          ))}
        </div>
      </Panel>

      <Panel title="Top 10" className="table-panel">
        <div className="flex min-h-[41px] items-center gap-3 overflow-x-auto border-b border-[#eceeef] px-[9px]">
          {['Customers', 'Suppliers', 'Items Sold By Quantity', 'Items Sold By Value', 'Item'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`whitespace-nowrap border-0 bg-transparent p-2 text-[11px] text-[#777b7e] ${
                activeTab === tab ? 'rounded-[3px] border border-[#aeb2b4] font-bold text-[#303234]' : ''
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5 text-center text-[#aaa]">No data available</div>
      </Panel>

      <Panel
        title="Day Book"
        action={
          <div className="ml-auto flex items-center">
            <button
              type="button"
              className={`border-0 bg-transparent p-2 text-[11px] text-[#777b7e] ${!dayBookDate ? 'rounded-[3px] border border-[#aeb2b4] font-bold text-[#303234]' : ''}`}
              onClick={() => setDayBookDate('')}
            >
              Today
            </button>
            <button
              type="button"
              className={`border-0 bg-transparent p-2 text-[11px] text-[#777b7e] ${dayBookDate === 'yesterday' ? 'rounded-[3px] border border-[#aeb2b4] font-bold text-[#303234]' : ''}`}
              onClick={() => setDayBookDate('yesterday')}
            >
              Yesterday
            </button>
            <label
              className={`relative inline-flex ${
                dayBookDate && dayBookDate !== 'yesterday' ? 'rounded-[3px] border border-[#aeb2b4] font-bold text-[#303234]' : ''
              }`}
            >
              <button type="button" className="relative z-10 border-0 bg-transparent p-2 text-[11px] text-[#777b7e]" onClick={openCustomDatePicker}>
                Custom Date
              </button>
              <input
                ref={customDateInput}
                type="date"
                value={dayBookDate !== 'yesterday' ? dayBookDate : ''}
                onChange={(event) => setDayBookDate(event.target.value)}
                aria-label="Select custom date"
                className="absolute inset-0 z-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
        }
        className="table-panel"
      >
        <div className="grid grid-cols-4 border-b border-[#eceeef] p-3 text-[12px] font-semibold text-slate-700">
          <b>Voucher</b>
          <b>Particulars</b>
          <b>Type</b>
          <b>Amount</b>
        </div>

        <div className="p-5 text-center text-[#aaa]">
          {dayBookDate === 'yesterday'
            ? 'No vouchers for yesterday'
            : dayBookDate
              ? `No vouchers for ${dayBookDate}`
              : 'No vouchers for today'}
        </div>
      </Panel>
    </div>
  )
}

export default DashboardPage
