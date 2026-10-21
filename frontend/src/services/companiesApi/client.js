export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  "https://connector.cloudata.in/api"
).replace(/\/$/, "");

export async function request(path, accessToken) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || 'Company request failed')
  }

  return data
}
