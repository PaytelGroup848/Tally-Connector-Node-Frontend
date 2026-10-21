const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'companyId',
  'organizationId',
  'raw',
  'source',
  'partyLedger',
  'voucherNumber',
  '__v',
  'voucherType',
  'tallyExternalId',
  'tallyExternalID',
  'tally_external_id',
  'tally external id',
  'effectiveDate',
  'effective_date',
  'effective date',
  'date',
  'guid',
  'GUID',
  'alterId',
  'alterID',
  'alter_id',
  'alter id',
  'voucherId',
  'voucherID',
  'voucher_id',
  'voucher id',
])

const popupFields = new Set([
  'inventory entries',
  'ledger entries',
  'bill allocations',
  'lines',
])

export function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function isDateField(field) {
  const normalizedField = String(field || '')
    .replace(/[_-\s]/g, '')
    .toLowerCase()

  return (
    normalizedField.includes('date') ||
    normalizedField.includes('time') ||
    normalizedField.includes('timestamp') ||
    normalizedField.includes('createdat') ||
    normalizedField.includes('updatedat')
  )
}

function formatIstDate(value) {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
}

export function formatValue(value, field = '') {
  if (value === null || value === undefined || value === '') {
    return 'NA'
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  if (isDateField(field)) {
    return formatIstDate(value)
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN')
  }

  return String(value)
}

function normalizeFieldName(field) {
  return String(field)
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export function isPopupField(field) {
  return popupFields.has(normalizeFieldName(field))
}

export function isHiddenField(field) {
  const normalizedKey = String(field).trim().toLowerCase()

  return Array.from(hiddenFields).some(
    (hiddenField) =>
      String(hiddenField).trim().toLowerCase() === normalizedKey,
  )
}
