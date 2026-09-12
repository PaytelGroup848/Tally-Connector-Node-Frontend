import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronDown,
  CreditCard,
  FileText,
  Landmark,
  ReceiptText,
  TrendingUp,
  Users,
} from 'lucide-react'

const summaryMetrics = [
  { label: 'Cash & Bank', value: '₹ 3,18, -', href: '/cash-bank/cash', icon: Landmark },
  { label: 'Inventory Amount', value: '₹ 0', href: '/items', icon: Building2 },
  { label: 'Payables', value: '₹ 17,800', href: '/payables', icon: CreditCard },
  { label: 'Outstanding', value: '₹ 2,65,430', href: '/receivables', icon: ReceiptText },
]

const chartData = [
  { day: '1 Apr', sales: 25, receipt: 22 },
  { day: '2 Apr', sales: 32, receipt: 28 },
  { day: '3 Apr', sales: 40, receipt: 36 },
  { day: '4 Apr', sales: 28, receipt: 33 },
  { day: '5 Apr', sales: 43, receipt: 37 },
  { day: '6 Apr', sales: 36, receipt: 32 },
  { day: '7 Apr', sales: 40, receipt: 31 },
  { day: '8 Apr', sales: 44, receipt: 36 },
  { day: '9 Apr', sales: 51, receipt: 39 },
  { day: '10 Apr', sales: 68, receipt: 55 },
]

const agingData = [
  ['Current (0–30)', '₹ 1,32,500', '49.9%', 'bg-emerald-500'],
  ['31–60 Days', '₹ 48,200', '18.2%', 'bg-amber-400'],
  ['61–90 Days', '₹ 36,800', '13.9%', 'bg-orange-500'],
  ['91–120 Days', '₹ 24,750', '9.3%', 'bg-orange-400'],
  ['> 120 Days', '₹ 23,180', '8.7%', 'bg-blue-400'],
]

function Panel({ title, action, children, className = '' }) {
  return (
    <section
      className={`
        cloud-card overflow-hidden
        ${className}
      `}
    >
      <header className="flex min-h-12 items-center border-b border-app-border-light px-4 sm:px-5">
        <h2 className="text-sm font-bold text-app-text">
          {title}
        </h2>

        {action ?? (
          <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
        )}
      </header>

      {children}
    </section>
  )
}

function MetricCard({ icon: Icon, label, value, change, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        cloud-metric-card w-full text-left
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            grid h-10 w-10 shrink-0 place-items-center
            rounded-xl bg-emerald-50 text-app-primary
          "
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-app-text-secondary">
            {label}
          </p>

          <p className="mt-1 text-xl font-bold tracking-tight text-app-text">
            {value}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-app-success">
              ↑ {change}
            </span>

            <span className="text-slate-400">
              vs. last period
            </span>
          </div>
        </div>
      </div>
    </button>
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
    const duration = 1000

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1,
      )

      setReceivableProgress(Math.round(progress * 100))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className="min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-hidden bg-app-bg p-4 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1500px] min-w-0">
        {/* PAGE HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="cloud-page-title">
            Dashboard
          </h1>

          <button
            type="button"
            className="
              inline-flex h-10 items-center gap-2
              rounded-lg border border-app-border
              bg-white px-3 text-[11px]
              font-semibold text-app-text-secondary
              shadow-sm
            "
          >
            <CalendarDays className="h-4 w-4" />
            01 Apr 2025 – 10 Apr 2025
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={TrendingUp}
            label="Total Sales"
            value="₹ 4,28,750"
            change="12.5%"
          />

          <MetricCard
            icon={FileText}
            label="Total Receipts"
            value="₹ 1,77,800"
            change="8.2%"
          />

          <MetricCard
            icon={CreditCard}
            label="Total Payments"
            value="₹ 1,24,560"
            change="6.7%"
          />

          <MetricCard
            icon={Landmark}
            label="Cash & Bank Balance"
            value="₹ 3,12,450"
            change="15.3%"
          />
        </div>

        {/* CHART + RECEIVABLES */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Panel
            title="Sales & Receipts"
            action={
              <div className="ml-auto flex items-center gap-1 rounded-lg bg-slate-50 p-1">
                {['7D', '30D', '3M', '1Y'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`
                      rounded-md px-3 py-1.5
                      text-[10px] font-semibold transition
                      ${
                        item === '30D'
                          ? 'bg-app-primary text-white'
                          : 'text-slate-500 hover:bg-white'
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            }
          >
            <div className="p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 text-[11px] text-app-text-secondary">
                  <span className="h-2.5 w-2.5 rounded-full bg-app-primary" />
                  Sales
                </span>

                <span className="inline-flex items-center gap-2 text-[11px] text-app-text-secondary">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
                  Receipts
                </span>
              </div>

              <div className="grid grid-cols-[35px_1fr] gap-2">
                <div className="flex h-[220px] flex-col justify-between pb-6 text-[10px] text-slate-400">
                  <span>1L</span>
                  <span>80K</span>
                  <span>60K</span>
                  <span>40K</span>
                  <span>20K</span>
                  <span>0</span>
                </div>

                <div className="relative h-[220px]">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#edf2f7_0,#edf2f7_1px,transparent_1px,transparent_20%)]" />

                  <div className="relative flex h-full items-end justify-between gap-2 pb-6">
                    {chartData.map((item) => (
                      <div
                        key={item.day}
                        className="flex h-full flex-1 items-end justify-center gap-1"
                      >
                        <div
                          className="w-2.5 rounded-t-sm bg-app-primary"
                          style={{
                            height: `${item.sales * 2.35}px`,
                          }}
                        />

                        <div
                          className="w-2.5 rounded-t-sm bg-emerald-200"
                          style={{
                            height: `${item.receipt * 2.35}px`,
                          }}
                        />

                        <span className="absolute bottom-0 text-[9px] text-slate-400">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-50">
                <div className="border-r border-app-border-light p-3">
                  <p className="text-[10px] font-semibold uppercase text-app-text-secondary">
                    Total Sales
                  </p>
                  <p className="mt-1 text-base font-bold text-app-text">
                    ₹ 4,28,750
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-app-success">
                    ↑ 12.5%
                  </p>
                </div>

                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase text-app-text-secondary">
                    Total Receipts
                  </p>
                  <p className="mt-1 text-base font-bold text-app-text">
                    ₹ 1,77,800
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-app-success">
                    ↑ 8.2%
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            title="Receivables"
            action={
              <button
                type="button"
                className="ml-auto text-[11px] font-semibold text-blue-700"
              >
                View All
              </button>
            }
          >
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[155px_1fr]">
                <div>
                  <p className="text-xs font-semibold text-app-text-secondary">
                    Total Outstanding
                  </p>

                  <p className="mt-1 text-xl font-bold text-app-text">
                    ₹ 2,65,430
                  </p>

                  <div className="mt-6 flex justify-center">
                    <div
                      className="relative grid h-40 w-40 place-items-center rounded-full"
                      style={{
                        background: `conic-gradient(#10a66f ${receivableProgress}%, #e5edf3 ${receivableProgress}% 100%)`,
                      }}
                    >
                      <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
                        <div>
                          <div className="text-sm font-bold text-app-text">
                            ₹ 2,65,430
                          </div>
                          <div className="mt-1 text-[10px] text-slate-500">
                            Total Outstanding
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {agingData.map(([label, amount, percentage, dot]) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 border-b border-app-border-light pb-3"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />

                      <span className="flex-1 text-[11px] text-app-text-secondary">
                        {label}
                      </span>

                      <span className="text-[11px] font-semibold text-app-text">
                        {amount}
                      </span>

                      <span className="w-10 text-right text-[10px] text-slate-400">
                        {percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 border-t border-app-border-light pt-4 text-center">
                {[
                  ['Total Customers', '12'],
                  ['Active Customers', '9'],
                  ['Overdue Customers', '3'],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={`px-2 ${
                      index > 0 ? 'border-l border-app-border-light' : ''
                    }`}
                  >
                    <p className="text-[10px] font-semibold text-app-text-secondary">
                      {label}
                    </p>
                    <p
                      className={`mt-1 text-lg font-bold ${
                        label === 'Overdue Customers'
                          ? 'text-red-500'
                          : 'text-app-text'
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Panel
            title="Top Customers"
            action={
              <button
                type="button"
                className="ml-auto text-[11px] font-semibold text-blue-700"
              >
                View All
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="cloud-table min-w-[650px]">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Sales (₹)</th>
                    <th>Receipts (₹)</th>
                    <th>Outstanding (₹)</th>
                    <th>Days</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ['Rajesh Traders', '98,450', '78,200', '20,250', '12'],
                    ['Metro Suppliers', '76,320', '45,600', '30,720', '18'],
                    ['Global Enterprises', '62,180', '62,180', '0', '0'],
                    ['Shree Distributors', '48,900', '32,400', '16,500', '25'],
                    ['Sunrise Traders', '41,750', '20,200', '21,550', '32'],
                  ].map((row, index) => (
                    <tr key={row[0]}>
                      <td>{index + 1}</td>
                      <td className="font-semibold text-app-text">
                        {row[0]}
                      </td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                      <td>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          {row[4]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Day Book"
            action={
              <button
                type="button"
                className="ml-auto text-[11px] font-semibold text-blue-700"
              >
                View All
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="cloud-table min-w-[650px]">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Particulars</th>
                    <th>Type</th>
                    <th className="text-right">Amount (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {[
                    ['10 Apr 2025', 'Ramesh Kumar', 'Receipt', '25,000', 'Received'],
                    ['10 Apr 2025', 'ABC Traders', 'Payment', '12,500', 'Paid'],
                    ['10 Apr 2025', 'Sales Invoice #SI-0045', 'Sales', '48,750', 'Posted'],
                    ['09 Apr 2025', 'Ganesh Suppliers', 'Payment', '18,200', 'Paid'],
                    ['09 Apr 2025', 'Purchase Invoice #PI-0078', 'Purchase', '32,400', 'Posted'],
                  ].map((row) => (
                    <tr key={`${row[0]}-${row[1]}`}>
                      <td className="whitespace-nowrap">{row[0]}</td>
                      <td className="font-medium text-app-text">{row[1]}</td>
                      <td>{row[2]}</td>
                      <td className="text-right font-semibold text-app-text">
                        {row[3]}
                      </td>
                      <td>
                        <span
                          className={`
                            status-badge
                            ${
                              row[4] === 'Paid'
                                ? 'status-paid'
                                : row[4] === 'Received'
                                  ? 'status-posted'
                                  : 'status-posted'
                            }
                          `}
                        >
                          {row[4]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* PRESERVE EXISTING DASHBOARD STATE/PROPS */}
        <div className="sr-only">
          <select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            aria-label="Dashboard period"
          >
            <option>This Year</option>
          </select>

          <span>{activeTab}</span>
          <span>{dayBookDate}</span>

          <button type="button" onClick={openCustomDatePicker}>
            Custom Date
          </button>

          <input
            ref={customDateInput}
            type="date"
            value={dayBookDate || ''}
            onChange={(event) => setDayBookDate(event.target.value)}
          />

          <Users />
          <ArrowUpRight />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
