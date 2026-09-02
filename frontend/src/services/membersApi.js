const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function getAuthHeaders(accessToken) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  }
}

async function request(path, accessToken, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(accessToken),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || 'Member request failed')
  }

  return data
}

export function fetchMembers(accessToken) {
  return request('/members', accessToken, { method: 'GET' })
}

export function updateMemberRole({ accessToken, id, role }) {
  return request(`/members/${id}/role`, accessToken, {
    method: 'PUT',
    body: JSON.stringify({ role }),
  })
}

export function deleteMember(accessToken, id) {
  return request(`/members/${id}`, accessToken, {
    method: 'DELETE',
  })
}

export function inviteMember({ accessToken, email, role }) {
  return request('/members/invite', accessToken, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  })
}

export function normalizeMember(member, index) {
  const id =
    member?.id ||
    member?._id ||
    member?.memberId ||
    member?.member_id ||
    member?.userId ||
    member?.user_id ||
    member?.member?.id ||
    member?.member?._id ||
    member?.user?.id ||
    member?.user?._id ||
    `member-${index}`

  return {
    id,
    hasPersistedId: !String(id).startsWith('member-'),
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