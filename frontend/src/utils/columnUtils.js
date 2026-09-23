export function normalizeColumnKey(key) {
  return String(key ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export function getUniqueFields(fields = [], options = {}) {
  const {
    isHidden = () => false,
    ignoreKeywords = [],
  } = options

  const seen = new Set()
  const uniqueFields = []

  fields.forEach((field) => {
    if (typeof field !== 'string') return

    const trimmedField = field.trim()
    if (!trimmedField) return

    const normalizedField = normalizeColumnKey(trimmedField)
    if (!normalizedField) return

    if (
      ignoreKeywords.some(
        (keyword) => normalizeColumnKey(keyword) === normalizedField,
      )
    ) {
      return
    }

    if (isHidden(trimmedField, normalizedField)) {
      return
    }

    if (!seen.has(normalizedField)) {
      seen.add(normalizedField)
      uniqueFields.push(trimmedField)
    }
  })

  return uniqueFields
}
