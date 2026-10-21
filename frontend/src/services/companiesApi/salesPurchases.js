import { request } from "./client";

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

export function fetchCompanyPurchases(
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
    `/companies/${encodeURIComponent(companyId)}/purchases?${params}`,
    accessToken,
  )
}

export function fetchCompanyPurchaseOrders(
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
    `/companies/${encodeURIComponent(companyId)}/purchase-orders?${params}`,
    accessToken,
  )
}

export function extractPurchases(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const purchaseKeys = ['purchases', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of purchaseKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractPurchasePagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function extractPurchaseOrders(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const purchaseOrderKeys = ['purchaseOrders', 'purchaseorders', 'orders', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of purchaseOrderKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractPurchaseOrderPagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
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
