const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

function extractAccessToken(payload) {
  return payload?.token || payload?.accessToken || payload?.data?.token || payload?.data?.accessToken || null
}

export async function sendOtp(email) {
  const response = await fetch(buildUrl('/auth/send-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to send OTP')
  }

  return data
}

export async function verifyOtp({ email, otp }) {
  const response = await fetch(buildUrl('/auth/verify-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed')
  }

  return {
    ...data,
    accessToken: extractAccessToken(data),
  }
}

export async function loginUser(email) {
  return sendOtp(email)
}

export async function logoutUser(accessToken) {
  const response = await fetch(buildUrl('/auth/logout'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Logout failed')
  }

  return data
}

export async function verifyToken(accessToken) {
  const response = await fetch(buildUrl('/auth/verify'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Invalid or expired token')
  }

  return response.json()
}