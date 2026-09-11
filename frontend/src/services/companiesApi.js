const API_BASE_URL = 'https://connector.cloudata.in/api'

async function request(path, accessToken) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || 'Company request failed')
  }

  return data
}

export async function postCompanyCommand(accessToken, companyId, command) {
  if (!accessToken) throw new Error('Access token not found')
  if (!companyId) throw new Error('Company is not selected')

  const response = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(command),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Unable to create voucher')
  }

  return data
}

export async function fetchCommandStatus(accessToken, commandId) {
  return request(`/commands/${encodeURIComponent(commandId)}`, accessToken)
}

export function extractCommandId(response) {
  const queue = [response]
  const idKeys = new Set(['commandid', 'command_id', 'commandid', 'id'])

  while (queue.length > 0) {
    const value = queue.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '')
      if (idKeys.has(normalizedKey) && child !== null && child !== undefined && String(child).trim()) {
        return String(child).trim()
      }
      if (child && typeof child === 'object') queue.push(child)
    }
  }

  return ''
}

export function extractCommandStatus(response) {
  const queue = [response]

  while (queue.length > 0) {
    const value = queue.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (['status', 'state', 'commandstatus'].includes(normalizedKey) && child !== null && child !== undefined && String(child).trim()) {
        return String(child).trim()
      }
      if (child && typeof child === 'object') queue.push(child)
    }
  }

  return ''
}

export function fetchCompanies(accessToken) {
  return request('/companies', accessToken)
}

export function fetchConnectorsStatus(accessToken) {
  return request('/connectors/status', accessToken)
}

export function extractLastSyncMeta(response) {
  const candidates = []

  if (Array.isArray(response?.lastSync)) candidates.push(...response.lastSync)
  if (Array.isArray(response?.data?.lastSync)) candidates.push(...response.data.lastSync)
  if (Array.isArray(response?.syncHistory)) candidates.push(...response.syncHistory)
  if (Array.isArray(response?.data?.syncHistory)) candidates.push(...response.data.syncHistory)

  const direct = response?.lastSync && typeof response.lastSync === 'object' ? response.lastSync : null
  const dataDirect = response?.data?.lastSync && typeof response.data.lastSync === 'object' ? response.data.lastSync : null
  const fallback = response?.data || response

  const allCandidates = [
    ...candidates,
    direct,
    dataDirect,
    fallback?.lastSync,
    fallback?.data?.lastSync,
    fallback?.syncHistory?.[0],
    fallback?.data?.syncHistory?.[0],
  ].filter(Boolean)

  for (const candidate of allCandidates) {
    if (candidate && typeof candidate === 'object' && candidate.completedAt) return candidate
  }

  for (const candidate of allCandidates) {
    if (candidate && typeof candidate === 'object') return candidate
  }

  return null
}

export function extractConnectorsStatusRows(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.connectors)) return response.connectors
  if (Array.isArray(response?.status)) return response.status
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response?.records)) return response.records
  if (Array.isArray(response?.results)) return response.results

  const pending = [response]
  const rowKeys = ['connectors', 'connectorStatus', 'status', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

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

export function fetchCompanyById(accessToken, companyId) {
  return request(`/companies/${encodeURIComponent(companyId)}`, accessToken)
}

export function fetchCompanyLedgers(accessToken, companyId, { page = 1, limit = 20, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/ledgers?${params.toString()}`, accessToken)
}

export function fetchCompanyGodowns(accessToken, companyId, { page = 1, limit = 100, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/godowns?${params.toString()}`, accessToken)
}

export function extractCompany(response) {
  return response?.data?.company || response?.company || response?.data || response
}

export function extractCompanies(response) {
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.companies)) return response.data.companies
  if (Array.isArray(response?.data?.data)) return response.data.data
  if (Array.isArray(response?.companies)) return response.companies
  if (Array.isArray(response)) return response
  return []
}

export function normalizeCompany(company, index) {
  return {
    ...company,
    id: company?.id || company?._id || company?.companyId || company?.company_id,
    name: company?.tallyCompanyName || company?.name || company?.companyName || company?.company_name || company?.businessName || company?.displayName || company?.company?.name || `Company ${index + 1}`,
    meta: company?.meta || company?.city || company?.address || '',
    isCurrent: false,
  }
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

export function fetchCompanyVouchers(
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

  if (q.trim()) params.set('q', q.trim())
  if (startDate) params.set('startDate', startDate)
  if (endDate) params.set('endDate', endDate)

  return request(
    `/companies/${encodeURIComponent(companyId)}/vouchers?${params}`,
    accessToken,
  )
}

export function extractVouchers(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const voucherKeys = ['vouchers', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of voucherKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function fetchCompanyReceipts(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    from: String(from),
    to: String(to),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/receipts?${params}`,
    accessToken,
  )
}

export function extractReceipts(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const receiptKeys = ['receipts', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of receiptKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractReceiptPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyCreditNotes(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    from: String(from),
    to: String(to),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/credit-notes?${params}`,
    accessToken,
  )
}

export function extractCreditNotes(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const creditNoteKeys = ['creditNotes', 'creditnotes', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of creditNoteKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractCreditNotePagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanySalesOrders(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    from: String(from),
    to: String(to),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/sales-orders?${params}`,
    accessToken,
  )
}

export function extractSalesOrders(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const salesOrderKeys = ['salesOrders', 'salesorders', 'orders', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of salesOrderKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractSalesOrderPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyDeliveryNotes(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 20 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    from: String(from),
    to: String(to),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/delivery-notes?${params}`,
    accessToken,
  )
}

export function extractDeliveryNotes(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const deliveryNoteKeys = ['deliveryNotes', 'deliverynotes', 'notes', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of deliveryNoteKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractDeliveryNotePagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanySales(
  accessToken,
  companyId,
  { q = '', from = '', to = '', page = 1, limit = 10 } = {},
) {
  const params = new URLSearchParams({
    q: String(q),
    from: String(from),
    to: String(to),
    page: String(page),
    limit: String(limit),
  })

  return request(
    `/companies/${encodeURIComponent(companyId)}/sales?${params}`,
    accessToken,
  )
}

export function extractSales(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const salesKeys = ['sales', 'invoices', 'vouchers', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of salesKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractSalesPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyVoucherTypes(accessToken, companyId) {
  return request(
    `/companies/${encodeURIComponent(companyId)}/voucher-types`,
    accessToken,
  )
}

export function extractVoucherTypes(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const typeKeys = ['voucherTypes', 'voucher_types', 'types', 'items', 'records', 'results', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of typeKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractVoucherPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination

  if (response?.data && typeof response.data === 'object') return response.data
  if (response && typeof response === 'object') return response
  return {}
}

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