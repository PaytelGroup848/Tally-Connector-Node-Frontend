import { request } from "./client";

export function fetchTrialBalance(accessToken, companyId, { page = 1, limit = 20, q = '', group = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) params.set('q', q.trim())
  if (group && String(group).trim()) params.set('group', String(group).trim())

  return request(
    `/companies/${encodeURIComponent(companyId)}/reports/trial-balance?${params.toString()}`,
    accessToken,
  )
}

export function extractTrialBalanceRows(response) {
  if (Array.isArray(response)) return response
  const pending = [response]
  const rowKeys = [
    'trialBalance',
    'trial_balance',
    'trialBalanceData',
    'trial_balance_data',
    'accounts',
    'ledgers',
    'balances',
    'ledgerBalances',
    'items',
    'records',
    'results',
    'docs',
    'rows',
    'content',
    'data',
  ]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue
    for (const key of rowKeys) {
      if (Array.isArray(value[key])) return value[key]
    }
    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  const candidate = response?.data || response
  if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
    const objectRows = Object.values(candidate).filter(
      (value) => value && typeof value === 'object' && !Array.isArray(value),
    )
    if (objectRows.length > 0) return objectRows
  }

  return []
}

export function extractTrialBalancePagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchDayBook(accessToken, companyId, { from = '', to = '', page = 1, limit = 20, q = '' } = {}) {
  const params = [
    `page=${encodeURIComponent(page)}`,
    `limit=${encodeURIComponent(limit)}`,
  ]

  if (from) params.push(`from=${encodeURIComponent(from)}`)
  if (to) params.push(`to=${encodeURIComponent(to)}`)
  if (q.trim()) params.push(`q=${encodeURIComponent(q.trim())}`)

  return request(
    `/companies/${encodeURIComponent(companyId)}/reports/day-book?${params.join('&')}`,
    accessToken,
  )
}

export function extractDayBookRows(response) {
  const normalizeDayBookRow = (item) => {
    if (!item || typeof item !== 'object') return item

    const nestedItems = Array.isArray(item.items)
      ? item.items.filter((entry) => entry && typeof entry === 'object')
      : []

    const firstNestedItem = nestedItems[0] || null
    const mergedItem = firstNestedItem ? { ...item, ...firstNestedItem } : { ...item }

    if (!mergedItem.date && item.date) {
      mergedItem.date = item.date
    }

    if (!mergedItem.date && firstNestedItem?.date) {
      mergedItem.date = firstNestedItem.date
    }

    return mergedItem
  }

  if (Array.isArray(response)) return response.map(normalizeDayBookRow)

  if (Array.isArray(response?.items)) {
    return response.items.map(normalizeDayBookRow)
  }

  const pending = [response]
  const rowKeys = [
    'dayBook',
    'day_book',
    'dayBookData',
    'day_book_data',
    'entries',
    'vouchers',
    'items',
    'records',
    'results',
    'docs',
    'rows',
    'content',
    'data',
  ]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of rowKeys) {
      if (Array.isArray(value[key])) {
        return value[key].map(normalizeDayBookRow)
      }
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractDayBookPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchProfitLoss(accessToken, companyId, { page = 1, limit = 20, q = '', ledgerType = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) params.set('q', q.trim())
  if (ledgerType && String(ledgerType).trim()) params.set('ledgerType', String(ledgerType).trim())

  return request(
    `/companies/${encodeURIComponent(companyId)}/reports/pnl?${params.toString()}`,
    accessToken,
  )
}

export function extractProfitLossRows(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const rowKeys = [
    'pnl',
    'p&l',
    'profitLoss',
    'profit_loss',
    'profitAndLoss',
    'profit_and_loss',
    'accounts',
    'items',
    'records',
    'results',
    'docs',
    'rows',
    'content',
    'data',
  ]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of rowKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractProfitLossPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchBalanceSheet(accessToken, companyId, { page = 1, limit = 20, q = '', ledgerType = '' } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) params.set('q', q.trim())
  if (ledgerType && String(ledgerType).trim()) params.set('ledgerType', String(ledgerType).trim())

  return request(
    `/companies/${encodeURIComponent(companyId)}/reports/balance-sheet?${params.toString()}`,
    accessToken,
  )
}

export function extractBalanceSheetRows(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const rowKeys = [
    'balanceSheet',
    'balance_sheet',
    'balanceSheetData',
    'balance_sheet_data',
    'accounts',
    'items',
    'records',
    'results',
    'docs',
    'rows',
    'content',
    'data',
  ]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of rowKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractBalanceSheetPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchVoucherLines(accessToken, companyId, { voucherId = '', page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (voucherId && String(voucherId).trim()) params.set('voucherId', String(voucherId).trim())

  return request(
    `/companies/${encodeURIComponent(companyId)}/reports/voucher-lines?${params.toString()}`,
    accessToken,
  )
}

export function extractVoucherLinesRows(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const rowKeys = [
    'voucherLines',
    'voucher_lines',
    'voucherLine',
    'voucher_line',
    'lines',
    'entries',
    'items',
    'records',
    'results',
    'docs',
    'rows',
    'content',
    'data',
  ]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of rowKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    if (Array.isArray(value?.data?.data)) return value.data.data
    if (Array.isArray(value?.data?.items)) return value.data.items
    if (Array.isArray(value?.items)) return value.items

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractVoucherLinesPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}
