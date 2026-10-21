import { API_BASE_URL, request } from "./client";

export async function postCompanyCommand(accessToken, companyId, command) {
  if (!accessToken) throw new Error('Access token not found')
  if (!companyId) throw new Error('Company is not selected')

  const response = await fetch(`${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(command),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Unable to create voucher')
  }

  return data
}

export async function fetchCommandStatus(accessToken, commandId) {
  return request(`/commands/${encodeURIComponent(commandId)}`, accessToken)
}

export function extractCommandId(response) {
  const queue = [response]
  const idKeys = new Set(['commandid', 'command_id', 'commandid', 'id'])

  while (queue.length > 0) {
    const value = queue.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9_]/g, '')
      if (idKeys.has(normalizedKey) && child !== null && child !== undefined && String(child).trim()) {
        return String(child).trim()
      }
      if (child && typeof child === 'object') queue.push(child)
    }
  }

  return ''
}

export function extractCommandStatus(response) {
  const queue = [response]

  while (queue.length > 0) {
    const value = queue.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, child] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (['status', 'state', 'commandstatus'].includes(normalizedKey) && child !== null && child !== undefined && String(child).trim()) {
        return String(child).trim()
      }
      if (child && typeof child === 'object') queue.push(child)
    }
  }

  return ''
}
