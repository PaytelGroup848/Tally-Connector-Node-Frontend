import { request } from "./client";
const API_BASE_URL = 'https://connector.cloudata.in/api'
export function fetchCompanyVouchers(
  accessToken,
  companyId,
  {
    page = 1,
    limit = 20,
    q = '',
    voucherType = '',
    startDate = '',
    endDate = '',
    from = '',
    to = '',
  } = {},
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  const effectiveFrom = from || startDate
  const effectiveTo = to || endDate

  if (q.trim()) params.set('q', q.trim())
  if (voucherType && String(voucherType).trim()) {
    params.set('voucherType', String(voucherType).trim())
  }
  if (effectiveFrom) params.set('from', effectiveFrom)
  if (effectiveTo) params.set('to', effectiveTo)
  if (startDate && !from) params.set('startDate', startDate)
  if (endDate && !to) params.set('endDate', endDate)

  return request(
    `/companies/${encodeURIComponent(companyId)}/vouchers?${params}`,
    accessToken,
  )
}

export function fetchCompanyCommands(
  accessToken,
  companyId,
  {
    type = '',
    voucherType = '',
    status = '',
    page = 1,
    limit = 20,
    q = '',
    from = '',
    to = '',
  } = {},
) {
  const params = new URLSearchParams({
    type: String(type),
    page: String(page),
    limit: String(limit),
    q: String(q),
  })

  if (voucherType && String(voucherType).trim()) {
    params.set('voucherType', String(voucherType).trim())
  }

  const normalizedStatus = String(status).trim().toUpperCase()
  if (normalizedStatus && normalizedStatus !== 'ALL STATUSES') {
    params.set('status', normalizedStatus)
  }
  if (from) params.set('from', String(from))
  if (to) params.set('to', String(to))

  return request(
    `/companies/${encodeURIComponent(companyId)}/commands?${params}`,
    accessToken,
  )
}

export async function deleteCompanyCommand(
  accessToken,
  companyId,
  commandId,
) {
  if (!accessToken) throw new Error('Access token not found')
  if (!companyId) throw new Error('Company is not selected')
  if (!commandId) throw new Error('Command ID not found')

  const response = await fetch(
    `${'https://connector.cloudata.in/api'}/companies/${encodeURIComponent(companyId)}/commands/${encodeURIComponent(commandId)}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Unable to delete command')
  }

  return data
}

export function extractCommands(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const commandKeys = [
    'commands',
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

    for (const key of commandKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractVouchers(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data?.items)) return response.data.items

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

export function fetchCompanyReceiptNotes(
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
    `/companies/${encodeURIComponent(companyId)}/receipt-notes?${params}`,
    accessToken,
  )
}

export function extractReceiptNotes(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const receiptNoteKeys = ['receiptNotes', 'receiptnotes', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of receiptNoteKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractReceiptNotePagination(response) {
  const pagination = response?.pagination || response?.data?.pagination || response?.meta || response?.data?.meta
  if (pagination && typeof pagination === 'object') return pagination
  if (response?.data && typeof response.data === 'object') return response.data
  return response && typeof response === 'object' ? response : {}
}

export function fetchCompanyPayments(
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
    `/companies/${encodeURIComponent(companyId)}/payments?${params}`,
    accessToken,
  )
}

export function extractPayments(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const paymentKeys = ['payments', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of paymentKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractPaymentPagination(response) {
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

export function fetchCompanyDebitNotes(
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
    `/companies/${encodeURIComponent(companyId)}/debit-notes?${params}`,
    accessToken,
  )
}

export function extractDebitNotes(response) {
  if (Array.isArray(response)) return response

  const pending = [response]
  const debitNoteKeys = ['debitNotes', 'debitnotes', 'items', 'records', 'results', 'docs', 'rows', 'content', 'data']

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of debitNoteKeys) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}

export function extractDebitNotePagination(response) {
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
