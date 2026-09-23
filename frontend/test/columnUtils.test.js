import test from 'node:test'
import assert from 'node:assert/strict'

import { getUniqueFields } from '../src/utils/columnUtils.js'

test('deduplicates columns that differ only by casing, separators, or suffix variants', () => {
  const columns = [
    'voucherId',
    'voucher_id',
    'Voucher ID',
    'companyId',
    'company_id',
    'particulars',
    'Particulars',
    'raw',
  ]

  const unique = getUniqueFields(columns, {
    ignoreKeywords: ['raw'],
  })

  assert.deepEqual(unique, ['voucherId', 'companyId', 'particulars'])
})

test('suppresses GUID and alter ID metadata columns while keeping valid IDs', () => {
  const columns = [
    'Ledger Name',
    'Guid',
    'GUID',
    'alterId',
    'Alter ID',
    'ledger_id',
    'companyId',
  ]

  const unique = getUniqueFields(columns)

  assert.deepEqual(unique, ['Ledger Name', 'ledger_id', 'companyId'])
})
