const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export async function fetchProfile(accessToken) {
  if (!accessToken) {
    throw new Error('Access token is missing')
  }

  const response = await fetch(buildUrl('/organizations/me'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  let result = null

  try {
    result = await response.json()
  } catch {
    throw new Error('Invalid response from server')
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
        result?.error ||
        `Failed to fetch profile (${response.status})`,
    )
  }

  if (result?.success === false) {
    throw new Error(
      result?.message || 'Failed to fetch profile',
    )
  }

  return result
}