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
