const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export async function fetchPlans(accessToken) {
  const response = await fetch(buildUrl('/plans'), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message || 'Unable to load plans',
    )
  }

  // API returns direct array
  if (Array.isArray(data)) {
    return data
  }

  // Common response structures
  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(data?.data?.plans)) {
    return data.data.plans
  }

  if (Array.isArray(data?.data?.data)) {
    return data.data.data
  }

  if (Array.isArray(data?.data?.result)) {
    return data.data.result
  }

  if (Array.isArray(data?.plans)) {
    return data.plans
  }

  if (Array.isArray(data?.result)) {
    return data.result
  }

  return []
}