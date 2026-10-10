const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

export function getCompanyLogoUrl(response) {
  const pending = [response]
  const logoKeys = new Set([
    'logo',
    'logourl',
    'companylogo',
    'companylogourl',
    'logopath',
    'logofile',
  ])
  const urlKeys = new Set(['url', 'src', 'path', 'href'])

  const findLogoUrl = (logo) => {
    if (typeof logo === 'string') return logo
    if (!logo || typeof logo !== 'object') return ''

    const nested = [logo]
    while (nested.length > 0) {
      const current = nested.shift()
      for (const [key, child] of Object.entries(current)) {
        if (
          urlKeys.has(key.toLowerCase()) &&
          typeof child === 'string' &&
          child.trim()
        ) {
          return child
        }
        if (child && typeof child === 'object') nested.push(child)
      }
    }

    return ''
  }

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (logoKeys.has(normalizedKey)) {
        const logoValue = findLogoUrl(child)

        if (typeof logoValue === 'string' && logoValue.trim()) {
          return normalizeLogoUrl(logoValue.trim())
        }
      }

      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return ''
}

function normalizeLogoUrl(logoUrl) {
  if (/^(https?:|data:|blob:)/i.test(logoUrl)) return logoUrl
  try {
    return new URL(logoUrl, `${API_BASE_URL}/`).toString()
  } catch {
    return logoUrl
  }
}

export async function fetchCompanySettings(accessToken, companyId) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }

  if (!companyId) {
    throw new Error('Company ID is required')
  }

  const response = await fetch(
    `${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/settings`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || 'Unable to load company settings.')
  }

  return data
}

async function sendCompanySettingsRequest(
  accessToken,
  companyId,
  method,
  body,
  suffix = '',
) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }
  if (!companyId) {
    throw new Error('Company ID is required')
  }

  const isFormData = body instanceof FormData
  const response = await fetch(
    `${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/settings${suffix}`,
    {
      method,
      headers: {
        ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${accessToken}`,
      },
      ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    },
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Company settings request failed.')
  }

  return data
}

export function updateCompanySettings(accessToken, companyId, settings) {
  return sendCompanySettingsRequest(accessToken, companyId, 'PUT', settings)
}

export function uploadCompanyLogo(accessToken, companyId, logoFile) {
  if (!logoFile) {
    throw new Error('Select a logo file')
  }

  const formData = new FormData()
  formData.set('logo', logoFile, logoFile.name || 'logo')

  if (!formData.has('logo')) {
    throw new Error('The logo file could not be added to the upload request')
  }

  return sendCompanySettingsRequest(
    accessToken,
    companyId,
    'POST',
    formData,
    '/logo',
  )
}

export function deleteCompanyLogo(accessToken, companyId) {
  return sendCompanySettingsRequest(
    accessToken,
    companyId,
    'DELETE',
    undefined,
    '/logo',
  )
}

async function sendCompanyBanksRequest(
  accessToken,
  companyId,
  method,
  bank,
  bankId,
  suffix = '',
) {
  if (!accessToken) {
    throw new Error('Access token not found')
  }
  if (!companyId) {
    throw new Error('Company ID is required')
  }

  const response = await fetch(
    `${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/banks${
      bankId ? `/${encodeURIComponent(bankId)}` : ''
    }${suffix}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(bank ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(bank ? { body: JSON.stringify(bank) } : {}),
    },
  )
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Company banks request failed.')
  }

  return data
}

export function fetchCompanyBanks(accessToken, companyId) {
  return sendCompanyBanksRequest(accessToken, companyId, 'GET')
}

export function createCompanyBank(accessToken, companyId, bank) {
  return sendCompanyBanksRequest(accessToken, companyId, 'POST', bank)
}

export function updateCompanyBank(accessToken, companyId, bankId, updates) {
  if (!bankId) throw new Error('Bank ID is required')
  return sendCompanyBanksRequest(
    accessToken,
    companyId,
    'PATCH',
    updates,
    bankId,
  )
}

export function setDefaultCompanyBank(accessToken, companyId, bankId) {
  if (!bankId) throw new Error('Bank ID is required')
  return sendCompanyBanksRequest(
    accessToken,
    companyId,
    'PATCH',
    undefined,
    bankId,
    '/default',
  )
}

export function deleteCompanyBank(accessToken, companyId, bankId) {
  if (!bankId) throw new Error('Bank ID is required')
  return sendCompanyBanksRequest(
    accessToken,
    companyId,
    'DELETE',
    undefined,
    bankId,
  )
}