const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function getAuthHeaders() {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    throw new Error('Access token not found')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || 'Member request failed')
  }

  return data
}

export function fetchMembers() {
  return request('/members', { method: 'GET' })
}

export function updateMemberRole({ id, role }) {
  return request(`/members/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

export function inviteMember({ email, role }) {
  return request('/members/invite', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  })
}

export function normalizeMember(member, index) {
  return {
    id: member?.id || member?._id || `member-${index}`,
    email: member?.email || '-',
    role: member?.role || member?.type || '',
    status: member?.status || '-',
    createdAt: member?.createdAt || member?.created_at || null,
  }
}

export function extractMembers(response) {
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.members)) return response.data.members
  if (Array.isArray(response?.members)) return response.members
  if (Array.isArray(response)) return response
  return []
}
