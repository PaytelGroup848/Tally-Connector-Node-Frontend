import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractVoucherTypes,
  fetchCompanyVoucherTypes,
} from '../services/companiesApi'

function getCompanyId(company) {
  return company?.id || company?._id || company?.companyId || company?.company_id || ''
}

function getVoucherTypeName(value) {
  if (typeof value === 'string') return value.trim()
  return String(
    value?.voucherType ||
    value?.voucher_type ||
    value?.type ||
    value?.name ||
    value?.value ||
    value?.displayName ||
    '',
  ).trim()
}

function ReceiptPage({ companyId: companyIdProp, selectedCompany }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const companyId = companyIdProp || getCompanyId(selectedCompany)
  const [voucherTypes, setVoucherTypes] = useState(['Receipt'])
  const [voucherType, setVoucherType] = useState('Receipt')
  const [voucherTypesLoading, setVoucherTypesLoading] = useState(false)
  const [voucherTypesError, setVoucherTypesError] = useState('')

  useEffect(() => {
    if (!accessToken || !companyId) {
      setVoucherTypes(['Receipt'])
      setVoucherType('Receipt')
      return undefined
    }

    let mounted = true
    setVoucherTypesLoading(true)
    setVoucherTypesError('')

    fetchCompanyVoucherTypes(accessToken, companyId)
      .then((response) => {
        if (!mounted) return

        const apiVoucherTypes = extractVoucherTypes(response)
          .map(getVoucherTypeName)
          .filter(Boolean)
        const nextVoucherTypes = [...new Set(['Receipt', ...apiVoucherTypes])]

        setVoucherTypes(nextVoucherTypes)
        setVoucherType((current) => nextVoucherTypes.includes(current) ? current : 'Receipt')
      })
      .catch((error) => {
        if (!mounted) return
        setVoucherTypes(['Receipt'])
        setVoucherType('Receipt')
        setVoucherTypesError(error?.message || 'Unable to load voucher types.')
      })
      .finally(() => {
        if (mounted) setVoucherTypesLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId])

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]">
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">Create Receipt</div>

        <div className="bg-[#f5f7f4] p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>
              <select
                value={voucherType}
                onChange={(event) => setVoucherType(event.target.value)}
                disabled={voucherTypesLoading}
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              >
                {voucherTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {voucherTypesError && (
                <span className="text-[11px] font-normal text-amber-600">{voucherTypesError}</span>
              )}
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>
              <input value="1" readOnly className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Party Name</span>
              <input placeholder="Select Party" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>
              <div className="relative">
                <input type="date" defaultValue="2026-08-27" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🗓</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Transaction Type</span>
              <select defaultValue="" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100">
                <option value="">Select Transaction Type</option>
                <option>Cash</option>
                <option>Bank</option>
              </select>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Select Ledger</span>
              <div className="relative">
                <input placeholder="Select Ledger" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </div>
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Closing Balance</span>
              <input value="0" readOnly disabled className="min-h-10 w-full rounded-md border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 outline-none" />
            </label>

            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Amount</span>
              <input placeholder="Amount" className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
            </label>
          </div>

          <div className="mt-5">
            <label className="block text-[12px] font-semibold text-slate-700">Narration</label>
            <textarea placeholder="Enter Narration" className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
        </div>

        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">
          <button type="button" className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)]">
            Create Receipt
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceiptPage