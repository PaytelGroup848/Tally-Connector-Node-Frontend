import { request } from "./client";

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

export function fetchCompanyDashboard(
  accessToken,
  companyId,
  { from = '', to = '' } = {},
) {
  let path = `/companies/${encodeURIComponent(companyId)}/dashboard?from=2000-01-01&to`

  // Only add query parameters when both dates are actually selected
  if (from && to) {
    const params = new URLSearchParams({
      from: String(from),
      to: String(to),
    })

    path += `?${params.toString()}`
  }

  return request(path, accessToken)
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
