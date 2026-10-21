import { request } from "./client";

export function fetchCompanyCash(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    page: String(page),
    limit: String(limit),
  })

  if (from) params.set('from', String(from))
  if (to) params.set('to', String(to))

  return request(
    `/companies/${encodeURIComponent(companyId)}/cash?${params}`,
    accessToken,
  )
}

export function extractCash(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const cashKeys = ['cash', 'cashTransactions', 'transactions', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of cashKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractCashPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyBank(
  accessToken,
  companyId,
  { q = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/bank?${params}`,
    accessToken,
  )
}

export function extractBank(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const bankKeys = ['bank', 'bankAccounts', 'accounts', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of bankKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractBankPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyLedgers(accessToken, companyId, { page = 1, limit = 20, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/ledgers?${params.toString()}`, accessToken)
}

export function fetchCompanyGodowns(accessToken, companyId, { page = 1, limit = 20, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/godowns?${params.toString()}`, accessToken)
}

export function fetchCompanyBatches(accessToken, companyId, { page = 1, limit = 20, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/batches?${params.toString()}`, accessToken)
}

export function extractBatches(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const batchKeys = ['batches', 'batch', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of batchKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractLedgers(response) {
  if (Array.isArray(response)) return response

  const ledgerKeys = ['ledgers', 'ledger', 'items', 'records', 'results', 'docs', 'rows', 'content']
  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of ledgerKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractGodowns(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const godownKeys = ['godowns', 'godown', 'warehouses', 'locations', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of godownKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractLedgerPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination

  const paginationKeys = [
    'total',
    'totalItems',
    'totalRecords',
    'count',
    'totalPages',
    'total_pages',
    'pages',
    'lastPage',
  ]

  if (
    response &&
    typeof response === 'object' &&
    paginationKeys.some((key) => response[key] !== undefined)
  ) {
    return response
  }

  if (
    response?.data &&
    typeof response.data === 'object' &&
    paginationKeys.some((key) => response.data[key] !== undefined)
  ) {
    return response.data
  }

  return {}
}

export function fetchCompanyStock(
  accessToken,
  companyId,
  {
    page = 1,
    limit = 10,
    q = '',
    startDate = '',
    endDate = '',
  } = {},
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) {
    params.set('q', q.trim())
  }

  if (startDate) {
    params.set('startDate', startDate)
  }

  if (endDate) {
    params.set('endDate', endDate)
  }

  return request(
    `/companies/${encodeURIComponent(companyId)}/stock?${params}`,
    accessToken,
  )
}

export function extractStockItems(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const stockKeys = ['stock', 'stockItems', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of stockKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}
