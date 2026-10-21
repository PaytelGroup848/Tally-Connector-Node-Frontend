export const formatAmount = (value, fallback) => {
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

export const formatPercent = (value, fallback) => {
  const normalizedValue = value && typeof value === 'object' && 'changePercent' in value
    ? value.changePercent
    : value

  if (normalizedValue === undefined || normalizedValue === null || typeof normalizedValue === 'object') {
    return fallback
  }

  const text = String(normalizedValue).trim()
  return text.endsWith('%') ? text : `${text}%`
}

export const formatDateRange = (range) => {
  if (!range?.from || !range?.to) return 'Select date range'

  return `${formatDisplayDate(range.from)} – ${formatDisplayDate(range.to)}`
}

export const formatDisplayDate = (value) => {
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

export const formatResponseDate = (value) => {
  if (!value) return ''

  const text = String(value)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return formatDisplayDate(text)
  if (!/[Tt]|Z|[+-]\d{2}:?\d{2}$/.test(text)) return text
  return formatDisplayDate(value)
}

export const toInputDate = (value) => {
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

export const getDefaultDashboardRange = () => {
  const formatLocalDate = (date) => {
    const year = date.getFullYear(  )
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

export const readField = (value, keys, fallback) => {
  if (!value || typeof value !== 'object') return fallback

  for (const key of keys) {
    if (value[key] !== undefined && value[key] !== null) return value[key]
  }

  return fallback
}

export const readArray = (value, keys) => {
  if (!value || typeof value !== 'object') return []

  for (const key of keys) {
    if (Array.isArray(value[key])) return value[key]
  }

  return []
}

export const normalizeDashboardData = (response, fallbackRange) => {
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
    agingData: rawBuckets.map((item) => {
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
