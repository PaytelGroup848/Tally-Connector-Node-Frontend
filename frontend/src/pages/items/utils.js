export const columns = [
  { key: 'itemName', label: 'Item Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'rate', label: 'Rate' },
  { key: 'value', label: 'Value' },
  { key: 'hsnCode', label: 'HSNCode' },
  { key: 'godown', label: 'Godown' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'action', label: 'Action' },
]

export const stockCommandColumns = [
  { key: 'status', label: 'Status' },
  { key: 'payload', label: 'Details' },
  { key: 'result', label: 'Result' },
  { key: 'errorMessage', label: 'Error Message' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'action', label: 'Action' },
]

export function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const itemAliases = {
  itemName: ['itemName', 'name', 'stockName'],
  itemTallyExternalId: [
    'itemTallyExternalId',
    'tallyExternalId',
    'externalId',
  ],
  quantity: ['quantity', 'qty', 'closingStock'],
  rate: ['rate', 'avgPurRate', 'purchaseRate'],
  value: ['value', 'amount', 'stockValue'],
  hsnCode: ['hsnCode', 'hsn', 'productHsn'],
  godown: ['godown', 'warehouse', 'location'],
  createdAt: ['createdAt', 'created_at', 'dateCreated'],
  updatedAt: ['updatedAt', 'updated_at', 'dateUpdated'],
}

export function formatDateToIST(utcDate) {
  if (!utcDate) return 'NA'

  try {
    const date = new Date(utcDate)
    if (Number.isNaN(date.getTime())) return 'NA'

    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return 'NA'
  }
}

export function getItemValue(item, key) {
  const matchingKey = itemAliases[key]?.find(
    (alias) =>
      item?.[alias] !== undefined &&
      item?.[alias] !== null &&
      item?.[alias] !== '',
  )
  if (matchingKey) return item[matchingKey]

  if (item?.raw && typeof item.raw === 'object') {
    const rawKey = itemAliases[key]?.find(
      (alias) =>
        item.raw?.[alias] !== undefined &&
        item.raw?.[alias] !== null &&
        item.raw?.[alias] !== '',
    )
    if (rawKey) return item.raw[rawKey]
  }

  return 'NA'
}

export function formatItemValue(value, key) {
  if (value === null || value === undefined || value === '' || value === '-') {
    return 'NA'
  }

  if (key === 'createdAt' || key === 'updatedAt') {
    return formatDateToIST(value)
  }

  if (typeof value === 'object') {
    return Object.values(value).filter(Boolean).join(', ') || 'NA'
  }

  return String(value)
}

const stockCommandAliases = {
  status: ['status', 'state', 'commandStatus', 'command_status'],
  payload: ['payload', 'data'],
  result: ['result', 'response'],
  errorMessage: ['errorMessage', 'error_message', 'error', 'message'],
  createdAt: ['createdAt', 'created_at', 'submittedAt', 'submitted_at'],
}

export function getStockCommandValue(command, key) {
  const matchingKey = stockCommandAliases[key]?.find(
    (alias) => command?.[alias] !== undefined && command?.[alias] !== null,
  )

  return matchingKey ? command[matchingKey] : null
}

export function formatStockCommandValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function extractHsnResults(response) {
  const candidates = [
    response,
    response?.data,
    response?.results,
    response?.result,
    response?.hsn,
    response?.hsnList,
    response?.data?.data,
    response?.data?.results,
    response?.data?.result,
    response?.data?.hsnList,
  ]
  const rows = candidates.find(Array.isArray) || []

  return rows
    .map((item) => ({
      code: String(
        item?.c ?? item?.code ?? item?.hsnCode ?? item?.hsn ?? '',
      ),
      name: String(
        item?.n ?? item?.name ?? item?.description ?? item?.desc ?? '',
      ),
    }))
    .filter((item) => item.code.trim() !== '')
}

export function isCreatedAtInRange(item, startDate, endDate) {
  const createdAt = getItemValue(item, 'createdAt')
  if (createdAt === 'NA') return false

  const createdDate = new Date(createdAt)
  if (Number.isNaN(createdDate.getTime())) return false

  const rangeStart = new Date(`${startDate}T00:00:00`)
  const rangeEnd = new Date(`${endDate}T23:59:59.999`)

  return createdDate >= rangeStart && createdDate <= rangeEnd
}
