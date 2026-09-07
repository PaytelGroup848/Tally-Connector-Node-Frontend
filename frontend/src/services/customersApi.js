const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

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

export function extractCustomers(response) {
  if (Array.isArray(response)) return response

  const customerKeys = [
    'customers',
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

export function extractCustomerPagination(response) {
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