const API_BASE_URL = "https://connector.cloudata.in";

export async function fetchParties({
  accessToken,
  companyId,
  page = 1,
  limit = 20,
  q = '',
  partyType = 'CUSTOMER',
}) {
  if (!accessToken) {
    throw new Error('Access token is required.')
  }

  if (!companyId) {
    throw new Error('Company ID is required.')
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    q: q || '',
  })
  const partiesPath =
    partyType === 'SUPPLIER' ? 'parties/supplier' : 'parties'

  const response = await fetch(
    `${API_BASE_URL}/api/companies/${encodeURIComponent(
      companyId,
    )}/${partiesPath}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  const data =
    await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Failed to fetch parties (${response.status})`,
    )
  }

  return data
}

export function extractParties(response) {
  if (Array.isArray(response)) return response

  const pending = [response]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const key of [
      'parties',
      'records',
      'results',
      'docs',
      'rows',
      'items',
      'content',
      'data',
    ]) {
      if (Array.isArray(value[key])) return value[key]
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return []
}
