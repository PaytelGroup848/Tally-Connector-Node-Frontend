const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL

export async function fetchParties({
  accessToken,
  companyId,
  page = 1,
  limit = 50,
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
    `${API_BASE_URL}/companies/${companyId}/parties?${params.toString()}`,
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
        `Failed to fetch parties (${response.status})`,
    )
  }

  return data
}