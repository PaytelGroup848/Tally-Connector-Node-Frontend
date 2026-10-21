export function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    ''
  );
}

export function getVoucherTypeName(value) {
  if (typeof value === 'string') return value.trim();

  return String(
    value?.voucherType ||
    value?.voucher_type ||
    value?.type ||
    value?.name ||
    value?.value ||
    value?.displayName ||
    '',
  ).trim();
}

export function getDisplayName(value, keys) {
  if (typeof value === 'string') return value.trim();

  for (const key of keys) {
    const candidate = value?.[key];

    if (
      candidate !== undefined &&
      candidate !== null &&
      String(candidate).trim()
    ) {
      return String(candidate).trim();
    }
  }

  return '';
}

export function getBalanceValue(entry) {
  const balanceKeys = new Set(['closingbalance', 'currentbalance', 'balance']);
  const pending = [entry];

  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== 'object') continue;

    for (const [key, candidate] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (
        balanceKeys.has(normalizedKey) &&
        candidate !== null &&
        candidate !== undefined &&
        String(candidate).trim() !== '' &&
        Number.isFinite(Number(candidate))
      ) {
        return String(candidate);
      }
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child);
    }
  }

  return null;
}

export function getToday() {
  return new Date().toLocaleDateString('en-CA');
}

export const LEDGER_PAGE_SIZE = 20;
