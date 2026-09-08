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

export function fetchCompanies(accessToken) {
  return request('/companies', accessToken)
}

export function fetchCompanyById(accessToken, companyId) {
  return request(`/companies/${encodeURIComponent(companyId)}`, accessToken)
}

export function fetchCompanyLedgers(accessToken, companyId, { page = 1, limit = 20, q = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  return request(`/companies/${encodeURIComponent(companyId)}/ledgers?${params.toString()}`, accessToken)
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

export function extractVoucherPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination

  if (response?.data && typeof response.data === 'object') return response.data
  if (response && typeof response === 'object') return response
  return {}
}