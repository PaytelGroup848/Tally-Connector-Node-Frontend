const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

export class ProfileApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ProfileApiError'
    this.status = status
  }
}

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
    throw new ProfileApiError(
      result?.message ||
        result?.error ||
        `Failed to fetch profile (${response.status})`,
      response.status,
    )
  }

  if (result?.success === false) {
    throw new Error(
      result?.message || 'Failed to fetch profile',
    )
  }

  return result
}

export async function fetchMySubscription(accessToken) {
  if (!accessToken) {
    throw new Error('Access token is missing')
  }

  const response = await fetch(buildUrl('/subscriptions/me'), {
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
    throw new Error('Invalid subscription response from server')
  }

  if (!response.ok) {
    throw new ProfileApiError(
      result?.message ||
        result?.error ||
        `Failed to fetch subscription (${response.status})`,
      response.status,
    )
  }

  if (result?.success === false) {
    throw new Error(result?.message || 'Failed to fetch subscription')
  }

  return result
}

export function extractMySubscription(response) {
  const data = response?.data || response || {}
  return data?.subscription || data?.data || data
}

export function extractTotalUsers(response) {
  const data = response?.data || response || {}
  const subscription = data?.subscription || data?.data || data
  const candidates = [
    subscription?.extraSeats,
    data?.extraSeats,
    subscription?.totalUsers,
    subscription?.userCount,
    subscription?.usersCount,
    subscription?.membersCount,
    data?.totalUsers,
    data?.userCount,
    data?.usersCount,
    data?.membersCount,
  ]

  const count = candidates.find(
    (value) => typeof value === 'number' || (typeof value === 'string' && value.trim() !== ''),
  )

  if (count !== undefined) return count
  if (Array.isArray(subscription?.users)) return subscription.users.length
  if (Array.isArray(subscription?.members)) return subscription.members.length

  return null
}

export function extractOrganizationProfile(response) {
  const data = response?.data || response || {}

  return data?.data || data
}

export function extractOrganizationContext(response) {
  const profile = extractOrganizationProfile(response)
  const organization = profile?.organization || null
  const subscription =
    profile?.subscription ||
    organization?.subscription ||
    null

  return {
    profile,
    organization,
    owner:
      profile?.owner ||
      organization?.owner ||
      profile?.organizationOwner ||
      null,
    subscription,
    role: profile?.role || profile?.member?.role || null,
    permissions: Array.isArray(profile?.permissions)
      ? profile.permissions
      : [],
    isMember: Boolean(
      profile?.isMember === true ||
      profile?.member ||
      profile?.role && profile.role !== 'OWNER',
    ),
    plan:
      subscription?.plan ||
      profile?.plan ||
      organization?.plan ||
      null,
    organizationId:
      profile?.organizationId ||
      organization?.id ||
      organization?._id ||
      null,
  }
}