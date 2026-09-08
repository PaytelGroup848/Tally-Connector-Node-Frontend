const API_BASE_URL = 'https://connector.cloudata.in/api'

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export async function fetchCustomers({
  companyId,
  page = 1,
  limit = 20,
  q = '',
  accessToken,
}) {
  if (!companyId) {
    throw new Error('Company ID is required')
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) {
    params.set('q', q.trim())
  }

  const response = await fetch(
    buildUrl(
      `/companies/${encodeURIComponent(companyId)}/customers?${params.toString()}`
    ),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message || 'Unable to load customers'
    )
  }

  return data
}

export async function fetchSuppliers({
  companyId,
  page = 1,
  limit = 20,
  q = '',
  accessToken,
}) {
  if (!companyId) {
    throw new Error('Company ID is required')
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) {
    params.set('q', q.trim())
  }

  const response = await fetch(
    buildUrl(
      `/companies/${encodeURIComponent(companyId)}/suppliers?${params.toString()}`
    ),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    }
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message || 'Unable to load suppliers'
    )
  }

  return data
}

export function extractCustomers(response) {
  if (Array.isArray(response)) return response

  const customerKeys = [
    'customers',
    'suppliers',
    'sundryCreditors',
    'creditors',
    'sundryDebtors',
    'debtors',
    'customerList',
    'records',
    'results',
    'docs',
    'rows',
    'items',
    'content',
    'data',
  ]
  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of customerKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractSuppliers(response) {
  if (Array.isArray(response)) return response

  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of ['suppliers', 'sundryCreditors', 'creditors', 'records', 'results', 'docs', 'rows', 'items', 'content', 'data']) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractCustomerPagination(response) {
  const paginationKeys = [
    'total',
    'totalItems',
    'count',
    'totalRecords',
    'totalPages',
    'pages',
    'lastPage',
  ]
  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    if (value.pagination && typeof value.pagination === 'object') {
      return value.pagination
    }

    if (value.meta && typeof value.meta === 'object') {
      return value.meta
    }

    if (paginationKeys.some((key) => value[key] !== undefined)) {
      return value
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return {}
}

export function extractCustomerTotal(response) {
  const totalKeys = [
    'totalOutstanding',
    'outstandingTotal',
    'totalReceivables',
    'receivablesTotal',
    'totalPayables',
    'payablesTotal',
    'totalCreditors',
    'creditorsTotal',
  ]
  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of totalKeys) {
      if (value[key] !== undefined && value[key] !== null) {
        return value[key]
      }
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return null
}