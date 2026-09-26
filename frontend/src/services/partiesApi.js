const API_BASE_URL = "http://localhost:5000";

export async function fetchParties({
  accessToken,
  companyId,
  page = 1,
  limit = 20,
  q = '',
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

  const response = await fetch(
    `${API_BASE_URL}/api/companies/${encodeURIComponent(
      companyId,
    )}/parties?${params.toString()}`,
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