import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CreditCard,
  FileText,
  Landmark,
  TrendingUp,
  Users,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { fetchCompanyDashboard } from '../services/companiesApi'

const formatAmount = (value, fallback) => {
  const normalizedValue = value && typeof value === 'object' && 'value' in value
    ? value.value
    : value

  if (normalizedValue === undefined || normalizedValue === null || typeof normalizedValue === 'object') {
    return fallback
  }

  const text = String(normalizedValue).trim()
  if (!text) return fallback
  if (text.includes('₹')) return text

  const numericValue = Number(text.replace(/,/g, ''))
  if (!Number.isFinite(numericValue)) return text

  const sign = numericValue < 0 ? '-₹ ' : '₹ '
  const absoluteValue = Math.abs(numericValue)
  const compactValue = absoluteValue >= 10000000
    ? `${(absoluteValue / 10000000).toFixed(2)}Cr`
    : absoluteValue >= 100000
      ? `${(absoluteValue / 100000).toFixed(2)}L`
      : absoluteValue >= 1000
        ? `${(absoluteValue / 1000).toFixed(2)}K`
        : new Intl.NumberFormat('en-IN').format(absoluteValue)

  return `${sign}${compactValue}`
}

const formatPercent = (value, fallback) => {
  const normalizedValue = value && typeof value === 'object' && 'changePercent' in value
    ? value.changePercent
    : value

  if (normalizedValue === undefined || normalizedValue === null || typeof normalizedValue === 'object') {
    return fallback
  }

  const text = String(normalizedValue).trim()
  return text.endsWith('%') ? text : `${text}%`
}

const formatDateRange = (range) => {
  if (!range?.from || !range?.to) return 'Select date range'

  const formatDate = formatDisplayDate

  return `${formatDate(range.from)} – ${formatDate(range.to)}`
}

const formatDisplayDate = (value) => {
  const text = String(value || '')
  const dateOnlyMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (dateOnlyMatch) {
    return `${dateOnlyMatch[3]}-${dateOnlyMatch[2]}-${dateOnlyMatch[1].slice(-2)}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return text

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(date).replaceAll('/', '-')
}

const formatResponseDate = (value) => {
  if (!value) return ''

  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return formatDisplayDate(text)
  if (!/[Tt]|Z|[+-]\d{2}:?\d{2}$/.test(text)) return text
  return formatDisplayDate(value)
}

const toInputDate = (value) => {
  const text = String(value || '')
  if (!text) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return text.slice(0, 10)

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getDefaultDashboardRange = () => {
  const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const today = new Date()
  const defaultStart = new Date(today)
  defaultStart.setDate(defaultStart.getDate() - 30)

  const toDate = formatLocalDate(today)
  const fromDate = formatLocalDate(defaultStart)

  return { fromDate, toDate }
}

const readField = (value, keys, fallback) => {
  if (!value || typeof value !== 'object') return fallback

  for (const key of keys) {
    if (value[key] !== undefined && value[key] !== null) return value[key]
  }

  return fallback
}

const readArray = (value, keys) => {
  if (!value || typeof value !== 'object') return []

  for (const key of keys) {
    if (Array.isArray(value[key])) return value[key]
  }

  return []
}

const normalizeDashboardData = (response, fallbackRange) => {
  const root = response?.data && typeof response.data === 'object'
    ? response.data
    : response || {}
  const responseRange = root.range || root.dateRange || {
    from: root.from || root.startDate || root.start_date,
    to: root.to || root.endDate || root.end_date,
  }
  const receivables = root.receivables || root.receivable || {}
  const summary = root.summary || root.metrics || root
  const rawChart = readArray(root, [
    'salesReceipts',
    'salesAndReceipts',
    'salesReceiptTrend',
    'chartData',
    'chart',
    'trends',
  ])
  const rawBuckets = Array.isArray(receivables.buckets)
    ? receivables.buckets
    : Object.entries(receivables.buckets || {}).map(([label, value]) => ({
        label,
        ...(typeof value === 'object' ? value : { amount: value }),
      }))
  const rawCustomers = readArray(root, [
    'topCustomers',
    'customers',
    'topParties',
  ])
  const rawDayBook = readArray(root, [
    'dayBook',
    'daybook',
    'recentTransactions',
    'transactions',
  ])

  return {
    totalSales: formatAmount(readField(summary, ['totalSales', 'salesTotal', 'sales']), '₹ 0'),
    totalReceipts: formatAmount(readField(summary, ['totalReceipts', 'receiptsTotal', 'receipts']), '₹ 0'),
    totalPayments: formatAmount(readField(summary, ['totalPayments', 'paymentsTotal', 'payments']), '₹ 0'),
    cashBankBalance: formatAmount(readField(summary, ['cashBankBalance', 'cashAndBankBalance', 'cashBank']), '₹ 0'),
    salesChange: formatPercent(readField(summary, ['totalSales']), '0%'),
    receiptsChange: formatPercent(readField(summary, ['totalReceipts']), '0%'),
    paymentsChange: formatPercent(readField(summary, ['totalPayments']), '0%'),
    cashBankChange: formatPercent(readField(summary, ['cashBankBalance']), '—'),
    rangeLabel: formatDateRange(
      responseRange?.from && responseRange?.to
        ? responseRange
        : fallbackRange,
    ),
    hasChart: Array.isArray(root.chart) || rawChart.length > 0,
    hasDayBook: Array.isArray(root.dayBook) || rawDayBook.length > 0,
    totalOutstanding: formatAmount(
      readField(receivables, ['totalOutstanding', 'outstanding']),
      '₹ 0',
    ),
    chartData: rawChart.map((item) => ({
      day: formatResponseDate(readField(item, ['day', 'date', 'label', 'period'], '')),
      sales: Number(readField(item, ['sales', 'totalSales', 'salesAmount'], 0)) || 0,
      receipt: Number(readField(item, ['receipt', 'receipts', 'totalReceipts', 'receiptAmount'], 0)) || 0,
    })).filter((item) => item.day),
    agingData: rawBuckets.map((item, index) => {
      const fallback = ['', '₹ 0', '0%', 'bg-slate-400']
      return [
        readField(item, ['label', 'name', 'bucket', 'range'], fallback[0]),
        formatAmount(readField(item, ['amount', 'value', 'total', 'outstanding']), fallback[1]),
        formatPercent(readField(item, ['percentage', 'percent', 'share']), fallback[2]),
        fallback[3],
      ]
    }),
    topCustomers: rawCustomers.map((item) => [
      readField(item, ['name', 'customerName', 'partyName'], ''),
      formatAmount(readField(item, ['sales', 'totalSales', 'salesAmount']), '₹ 0'),
      formatAmount(readField(item, ['receipts', 'totalReceipts', 'receiptAmount']), '₹ 0'),
      formatAmount(readField(item, ['outstanding', 'amountOutstanding']), '₹ 0'),
      readField(item, ['days', 'overdueDays', 'ageingDays'], 0),
    ]).filter((item) => item[0]),
    dayBook: rawDayBook.map((item) => [
      formatResponseDate(readField(item, ['date', 'voucherDate', 'createdAt'], '')),
      readField(item, ['particulars', 'partyName', 'name', 'description'], ''),
      readField(item, ['type', 'voucherType', 'transactionType'], ''),
      formatAmount(readField(item, ['amount', 'total', 'value']), '₹ 0'),
      readField(item, ['status', 'state'], 'Posted'),
    ]).filter((item) => item[0] && item[1]),
    customerCounts: [
      ['Total Customers', readField(receivables, ['totalCustomers', 'customersCount'], 0)],
      ['Active Customers', readField(receivables, ['activeCustomers', 'activeCount'], 0)],
      ['Overdue Customers', readField(receivables, ['overdueCustomers', 'overdueCount'], 0)],
    ],
  }
}

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

        {/* {action ?? (
          <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
        )} */}
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

          
        </div>
      </div>
    </button>
  )
}

function DashboardPage({
  companyId,
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
  const accessToken = useAuthStore((state) => state.accessToken)
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardRange, setDashboardRange] = useState(null)
  const defaultDashboardRange = getDefaultDashboardRange()
  const [fromDate, setFromDate] = useState(defaultDashboardRange.fromDate)
  const [toDate, setToDate] = useState(defaultDashboardRange.toDate)
  const [draftFromDate, setDraftFromDate] = useState(defaultDashboardRange.fromDate)
  const [draftToDate, setDraftToDate] = useState(defaultDashboardRange.toDate)
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const dashboardRequestRef = useRef(0)
  const chartScrollRef = useRef(null)
  const chartTrackRef = useRef(null)
  const chartDragRef = useRef(null)
  const [chartScrollbar, setChartScrollbar] = useState({ left: 0, width: 100 })

  const updateChartScrollbar = () => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return

    const maxScroll = chartScroll.scrollWidth - chartScroll.clientWidth
    if (maxScroll <= 0) {
      setChartScrollbar({ left: 0, width: 100 })
      return
    }

    const width = Math.max((chartScroll.clientWidth / chartScroll.scrollWidth) * 100, 12)
    setChartScrollbar({
      left: (chartScroll.scrollLeft / maxScroll) * (100 - width),
      width,
    })
  }

  const handleChartTrackClick = (event) => {
    const chartScroll = chartScrollRef.current
    const chartTrack = chartTrackRef.current
    if (!chartScroll || !chartTrack || event.target !== chartTrack) return

    const bounds = chartTrack.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    chartScroll.scrollTo({
      left: ratio * (chartScroll.scrollWidth - chartScroll.clientWidth),
      behavior: 'smooth',
    })
  }

  const handleChartThumbPointerDown = (event) => {
    event.preventDefault()
    chartDragRef.current = {
      startX: event.clientX,
      startScrollLeft: chartScrollRef.current?.scrollLeft || 0,
    }
  }

  const scrollChart = (direction) => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return

    chartScroll.scrollBy({
      left: direction * Math.max(chartScroll.clientWidth * 0.8, 180),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = chartDragRef.current
      const chartScroll = chartScrollRef.current
      const chartTrack = chartTrackRef.current
      if (!drag || !chartScroll || !chartTrack) return

      const maxScroll = chartScroll.scrollWidth - chartScroll.clientWidth
      const thumbWidth = chartScrollbar.width / 100 * chartTrack.clientWidth
      const trackWidth = Math.max(chartTrack.clientWidth - thumbWidth, 1)
      const delta = event.clientX - drag.startX
      chartScroll.scrollLeft = drag.startScrollLeft + (delta / trackWidth) * maxScroll
    }

    const stopDragging = () => {
      chartDragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
    }
  }, [chartScrollbar.width])

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

  useEffect(() => {
    if (!accessToken || !companyId || !fromDate || !toDate) {
      setDashboardData(null)
      setDashboardRange(null)
      return undefined
    }

    let isMounted = true
    const requestId = ++dashboardRequestRef.current

    fetchCompanyDashboard(accessToken, companyId, {
      from: fromDate,
      to: toDate,
    })
      .then((response) => {
        if (isMounted && requestId === dashboardRequestRef.current) {
          const responseData = response?.data || response
          const responseRange = responseData?.range
          const responseFrom = toInputDate(responseRange?.from)
          const responseTo = toInputDate(responseRange?.to)

          setDashboardData(responseData)
          setDashboardRange(
            responseFrom && responseTo
              ? { from: responseFrom, to: responseTo }
              : null,
          )

          if (responseFrom && responseTo) {
            if (responseFrom !== fromDate) setFromDate(responseFrom)
            if (responseTo !== toDate) setToDate(responseTo)
            setDraftFromDate(responseFrom)
            setDraftToDate(responseTo)
          }
        }
      })
      .catch((error) => {
        if (isMounted && requestId === dashboardRequestRef.current) {
          setDashboardData(null)
          setDashboardRange(null)
          console.warn('Dashboard API failed, using dashboard defaults:', error)
        }
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, fromDate, toDate])

  const applyDateFilter = (event) => {
    event.preventDefault()
    if (!draftFromDate || !draftToDate || draftFromDate > draftToDate) return

    setFromDate(draftFromDate)
    setToDate(draftToDate)
    setDashboardRange(null)
    setIsDateFilterOpen(false)
  }

  const dashboardValues = normalizeDashboardData(dashboardData, {
    from: fromDate,
    to: toDate,
  })
  const {
    totalSales,
    totalReceipts,
    totalPayments,
    cashBankBalance,
    totalOutstanding,
  } = dashboardValues
  const displayedChartData = dashboardValues.chartData
  const displayedAgingData = dashboardValues.agingData
  const displayedCustomers = dashboardValues.topCustomers
  const displayedDayBook = dashboardValues.dayBook
  const displayedCustomerCounts = dashboardValues.customerCounts

  const chartMax = Math.max(
    ...displayedChartData.flatMap((item) => [item.sales, item.receipt]),
    1,
  )
  const chartAxisLabels = [1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio) => {
    const value = chartMax * ratio
    return value >= 1000 ? formatAmount(value, '₹ 0') : new Intl.NumberFormat('en-IN').format(Math.round(value))
  })

  useEffect(() => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return undefined

    updateChartScrollbar()
    chartScroll.addEventListener('scroll', updateChartScrollbar)
    window.addEventListener('resize', updateChartScrollbar)

    return () => {
      chartScroll.removeEventListener('scroll', updateChartScrollbar)
      window.removeEventListener('resize', updateChartScrollbar)
    }
  }, [displayedChartData.length])

  return (
    <div className="min-h-[calc(100vh-64px)] w-full min-w-0 overflow-x-hidden bg-app-bg p-4 sm:p-5 lg:p-6">
      <div className="mx-auto w-full max-w-[1500px] min-w-0">
        {/* PAGE HEADER */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="cloud-page-title">
            Dashboard
          </h1>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setDraftFromDate(fromDate)
                setDraftToDate(toDate)
                setIsDateFilterOpen((open) => !open)
              }}
              className="
                inline-flex h-10 items-center gap-2
                rounded-lg border border-app-border
                bg-white px-3 text-[11px]
                font-semibold text-app-text-secondary
                shadow-sm
              "
            >
              <CalendarDays className="h-4 w-4" />
              {dashboardValues.rangeLabel}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {isDateFilterOpen && (
              <form
                onSubmit={applyDateFilter}
                className="absolute right-0 z-20 mt-2 grid w-64 gap-3 rounded-lg border border-app-border bg-white p-4 shadow-lg"
              >
                <label className="grid gap-1 text-[11px] font-semibold text-app-text-secondary">
                  From
                  <input
                    type="date"
                    value={draftFromDate}
                    onChange={(event) => setDraftFromDate(event.target.value)}
                    className="h-9 rounded-md border border-app-border px-2 text-xs text-app-text"
                  />
                </label>

                <label className="grid gap-1 text-[11px] font-semibold text-app-text-secondary">
                  To
                  <input
                    type="date"
                    value={draftToDate}
                    min={draftFromDate}
                    onChange={(event) => setDraftToDate(event.target.value)}
                    className="h-9 rounded-md border border-app-border px-2 text-xs text-app-text"
                  />
                </label>

                <button
                  type="submit"
                  className="h-9 rounded-md bg-app-primary px-3 text-xs font-semibold text-white"
                >
                  Apply Filter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* KPI ROW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={TrendingUp}
            label="Total Sales"
            value={totalSales}
            change={dashboardValues.salesChange}
          />

          <MetricCard
            icon={FileText}
            label="Total Receipts"
            value={totalReceipts}
            change={dashboardValues.receiptsChange}
          />

          <MetricCard
            icon={CreditCard}
            label="Total Payments"
            value={totalPayments}
            change={dashboardValues.paymentsChange}
          />

          <MetricCard
            icon={Landmark}
            label="Cash & Bank Balance"
            value={cashBankBalance}
            change={dashboardValues.cashBankChange}
          />
        </div>

        {/* CHART + RECEIVABLES */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Panel
            title="Sales & Receipts"
            // action={
              // <div className="ml-auto flex items-center gap-1 rounded-lg bg-slate-50 p-1">
              //   {['7D', '30D', '3M', '1Y'].map((item) => (
              //     <button
              //       key={item}
              //       type="button"
              //       className={`
              //         rounded-md px-3 py-1.5
              //         text-[10px] font-semibold transition
              //         ${
              //           item === '30D'
              //             ? 'bg-app-primary text-white'
              //             : 'text-slate-500 hover:bg-white'
              //         }
              //       `}
              //     >
              //       {item}
                  // </button>
                // ))}
              // </div>
            // }
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

              <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-2">
                <div className="flex h-[268px] flex-col justify-between pb-10 text-[10px] text-slate-400">
                  {chartAxisLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
                </div>

                <div
                  ref={chartScrollRef}
                  className="dashboard-chart-scroll min-w-0 overflow-x-scroll overflow-y-hidden pb-2 touch-pan-x"
                >
                  <div
                    className="relative h-[268px] min-w-full"
                    style={{ minWidth: `${Math.max(displayedChartData.length * 72, 420)}px` }}
                  >
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#edf2f7_0,#edf2f7_1px,transparent_1px,transparent_20%)]" />

                    <div className="relative flex h-full items-end gap-2 pb-12">
                      {displayedChartData.map((item) => (
                        <div
                          key={item.day}
                          className="relative flex h-full min-w-[50px] flex-1 items-end justify-center gap-1"
                        >
                          <div
                            className="w-2.5 rounded-t-sm bg-app-primary"
                            style={{
                              height: `${Math.max((item.sales / chartMax) * 200, item.sales ? 4 : 0)}px`,
                            }}
                          />

                          <div
                            className="w-2.5 rounded-t-sm bg-emerald-200"
                            style={{
                              height: `${Math.max((item.receipt / chartMax) * 200, item.receipt ? 4 : 0)}px`,
                            }}
                          />

                          <span className="absolute -bottom-4 left-1/2 w-[54px] -translate-x-1/2 truncate text-center text-[9px] text-slate-400">
                            {item.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Scroll chart left"
                  title="Scroll chart left"
                  onClick={() => scrollChart(-1)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200"
                >
                  <span aria-hidden="true" className="text-xl leading-none">‹</span>
                </button>

                <div
                  ref={chartTrackRef}
                  onClick={handleChartTrackClick}
                  className="relative h-1 flex-1 cursor-pointer rounded-full bg-slate-100"
                  role="scrollbar"
                  aria-label="Chart horizontal scroll"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={Math.round(chartScrollbar.left)}
                >
                  <div
                    onPointerDown={handleChartThumbPointerDown}
                    className="absolute top-0 h-full cursor-grab rounded-full bg-slate-400 active:cursor-grabbing"
                    style={{
                      left: `${chartScrollbar.left}%`,
                      width: `${chartScrollbar.width}%`,
                    }}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Scroll chart right"
                  title="Scroll chart right"
                  onClick={() => scrollChart(1)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200"
                >
                  <span aria-hidden="true" className="text-xl leading-none">›</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-50">
                <div className="border-r border-app-border-light p-3">
                  <p className="text-[10px] font-semibold uppercase text-app-text-secondary">
                    Total Sales
                  </p>
                  <p className="mt-1 text-base font-bold text-app-text">
                    {totalSales}
                  </p>
                  
                </div>

                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase text-app-text-secondary">
                    Total Receipts
                  </p>
                  <p className="mt-1 text-base font-bold text-app-text">
                    {totalReceipts}
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
                    {totalOutstanding}
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
                            {totalOutstanding}
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
                  {displayedAgingData.map(([label, amount, percentage, dot]) => (
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

                     
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 border-t border-app-border-light pt-4 text-center">
                {displayedCustomerCounts.map(([label, value], index) => (
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
            className="h-full"
            action={
              <button
                type="button"
                className="ml-auto text-[11px] font-semibold text-blue-700"
              >
                View All
              </button>
            }
          >
            <div className="min-h-[280px] overflow-x-auto">
              <table className="cloud-table table-fixed min-w-[640px]">
                <colgroup>
                  <col className="w-[7%]" />
                  <col className="w-[31%]" />
                  <col className="w-[15%]" />
                  <col className="w-[16%]" />
                  <col className="w-[21%]" />
                  <col className="w-[10%]" />
                </colgroup>
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
                  {displayedCustomers.length > 0 ? displayedCustomers.map((row, index) => (
                    <tr key={row[0]}>
                      <td>{index + 1}</td>
                      <td className="break-words font-semibold text-app-text">{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                      <td>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                          {row[4]}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-xs text-app-text-secondary">
                        No customer data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel
            title="Day Book"
            className="h-full"
            action={
              <button
                type="button"
                className="ml-auto text-[11px] font-semibold text-blue-700"
              >
                View All
              </button>
            }
          >
            <div className="min-h-[280px] overflow-x-auto">
              <table className="cloud-table table-fixed min-w-[620px]">
                <colgroup>
                  <col className="w-[19%]" />
                  <col className="w-[31%]" />
                  <col className="w-[20%]" />
                  <col className="w-[17%]" />
                  <col className="w-[13%]" />
                </colgroup>
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
                  {displayedDayBook.length > 0 ? displayedDayBook.map((row) => (
                    <tr key={`${row[0]}-${row[1]}`}>
                      <td className="whitespace-nowrap">{row[0]}</td>
                      <td className="break-words font-medium text-app-text">{row[1]}</td>
                      <td>{row[2]}</td>
                      <td className="text-right font-semibold text-app-text">{row[3]}</td>
                      <td>
                        <span className={`status-badge ${row[4] === 'Paid' ? 'status-paid' : 'status-posted'}`}>
                          {row[4]}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-xs text-app-text-secondary">
                        No day book data available
                      </td>
                    </tr>
                  )}
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
