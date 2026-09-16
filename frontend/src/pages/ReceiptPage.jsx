import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  extractLedgers,
  extractVoucherTypes,
  fetchCompanyLedgers,
  fetchCompanyVoucherTypes,
  postCompanyCommand,
} from '../services/companiesApi'
import { extractCustomers } from '../services/customersApi'
import { fetchParties } from '../services/partiesApi'

function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    ''
  )
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

function getDisplayName(value, keys) {
  if (typeof value === 'string') return value.trim()

  for (const key of keys) {
    const candidate = value?.[key]

    if (
      candidate !== undefined &&
      candidate !== null &&
      String(candidate).trim()
    ) {
      return String(candidate).trim()
    }
  }

  return ''
}

function getNumericValue(value, keys) {
  for (const key of keys) {
    const candidate = value?.[key]

    if (
      candidate !== undefined &&
      candidate !== null &&
      String(candidate).trim() !== ''
    ) {
      const numericValue = Number(candidate)

      if (Number.isFinite(numericValue)) {
        return numericValue
      }
    }
  }

  return 0
}

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function ReceiptPage({
  companyId: companyIdProp,
  selectedCompany,
  documentType = 'Receipt',
}) {
  const accessToken = useAuthStore((state) => state.accessToken)

  const companyId =
    companyIdProp || getCompanyId(selectedCompany)

  const [voucherTypes, setVoucherTypes] = useState([documentType])
  const [voucherType, setVoucherType] = useState(documentType)

  const [voucherTypesLoading, setVoucherTypesLoading] = useState(false)
  const [voucherTypesError, setVoucherTypesError] = useState('')

  const [partyOptions, setPartyOptions] = useState([])
  const [ledgerOptions, setLedgerOptions] = useState([])

  const [optionsLoading, setOptionsLoading] = useState(false)
  const [optionsError, setOptionsError] = useState('')

  const [form, setForm] = useState({
    voucherNumber: '',
    partyName: '',
    date: getToday(),
    transactionType: '',
    ledger: '',
    amount: '',
    narration: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const successTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }
    }
  }, [])

  const selectedParty = partyOptions.find(
    (party) =>
      getDisplayName(party, [
        'partyName',
        'name',
        'customerName',
        'ledgerName',
        'displayName',
      ]) === form.partyName,
  )

  const selectedLedger = ledgerOptions.find(
    (ledger) =>
      getDisplayName(ledger, [
        'ledgerName',
        'name',
        'displayName',
        'partyName',
      ]) === form.ledger,
  )

  const closingBalance = getNumericValue(selectedParty, [
    'closingBalance',
    'ClosingBalance',
    'closing_balance',
    'balance',
    'currentBalance',
    'current_balance',
  ])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    setForm({
      voucherNumber: '',
      partyName: '',
      date: getToday(),
      transactionType: '',
      ledger: '',
      amount: '',
      narration: '',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitMessage('')
    setSubmitError('')
    setShowSuccessAnimation(false)

    if (!accessToken || !companyId) {
      setSubmitError(
        `Please select a company before creating a ${documentType.toLowerCase()}.`,
      )
      return
    }

    const amount = Number(form.amount)

    if (
      !form.partyName ||
      !form.date ||
      !form.transactionType ||
      !form.ledger
    ) {
      setSubmitError(
        'Select a party, date, transaction type, and ledger before submitting.',
      )
      return
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setSubmitError('Amount must be greater than 0.')
      return
    }

    try {
      setIsSubmitting(true)

      await postCompanyCommand(accessToken, companyId, {
        type: 'CREATE_VOUCHER',

        payload: {
          voucherType,

          voucherNumber: form.voucherNumber,

          partyLedger:
            getDisplayName(selectedParty, [
              'ledgerName',
              'partyLedger',
              'partyName',
              'name',
              'displayName',
            ]) || form.partyName,

          ledgerType: getDisplayName(selectedParty, [
            'ledgerType',
            'ledger_type',
            'type',
          ]),

          date: form.date,

          transactionType: form.transactionType,

          ledger: form.ledger,

          amount,

          narration: form.narration,
        },
      })

      /*
       * IMPORTANT:
       * Reset the form ONLY after the API call succeeds.
       * This means if Tally/API rejects the voucher,
       * the entered data remains in the form.
       */
      resetForm()

      setSubmitMessage(`${documentType} created successfully.`)
      setShowSuccessAnimation(true)

      if (successTimerRef.current) {
        window.clearTimeout(successTimerRef.current)
      }

      successTimerRef.current = window.setTimeout(() => {
        setShowSuccessAnimation(false)
        setSubmitMessage('')
      }, 1600)
    } catch (error) {
      console.error(`${documentType} creation failed:`, error)

      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          `Unable to create ${documentType.toLowerCase()}.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /*
   * Load voucher types
   */
  useEffect(() => {
    if (!accessToken || !companyId) {
      setVoucherTypes([documentType])
      setVoucherType(documentType)
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

        const nextVoucherTypes = [
          ...new Set([documentType, ...apiVoucherTypes]),
        ]

        setVoucherTypes(nextVoucherTypes)

        setVoucherType((current) =>
          nextVoucherTypes.includes(current)
            ? current
            : documentType,
        )
      })
      .catch((error) => {
        if (!mounted) return

        setVoucherTypes([documentType])
        setVoucherType(documentType)

        setVoucherTypesError(
          error?.message ||
            'Unable to load voucher types.',
        )
      })
      .finally(() => {
        if (mounted) {
          setVoucherTypesLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId, documentType])

  /*
   * Load parties and ledgers
   */
  useEffect(() => {
    if (!accessToken || !companyId) {
      setPartyOptions([])
      setLedgerOptions([])
      return undefined
    }

    let mounted = true

    setOptionsLoading(true)
    setOptionsError('')

    Promise.allSettled([
      fetchParties({
        companyId,
        accessToken,
        page: 1,
        limit: 100,
      }),

      fetchCompanyLedgers(
        accessToken,
        companyId,
        {
          page: 1,
          limit: 100,
        },
      ),
    ])
      .then(([customersResult, ledgersResult]) => {
        if (!mounted) return

        /*
         * Parties
         */
        if (customersResult.status === 'fulfilled') {
          const partyResponseItems =
            customersResult.value?.data?.items

          const parties = Array.isArray(partyResponseItems)
            ? partyResponseItems
            : extractCustomers(customersResult.value)

          setPartyOptions(
            parties.filter((customer) =>
              getDisplayName(customer, [
                'partyName',
                'name',
                'customerName',
                'ledgerName',
                'displayName',
              ]),
            ),
          )
        } else {
          setPartyOptions([])
        }

        /*
         * Ledgers
         */
        if (ledgersResult.status === 'fulfilled') {
          setLedgerOptions(
            extractLedgers(ledgersResult.value).filter(
              (ledger) =>
                getDisplayName(ledger, [
                  'ledgerName',
                  'name',
                  'displayName',
                  'partyName',
                ]),
            ),
          )
        } else {
          setLedgerOptions([])
        }

        const failures = [
          customersResult,
          ledgersResult,
        ].filter(
          (result) => result.status === 'rejected',
        )

        if (failures.length > 0) {
          setOptionsError(
            failures[0].reason?.message ||
              'Unable to load party or ledger options.',
          )
        }
      })
      .finally(() => {
        if (mounted) {
          setOptionsLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken, companyId])

  return (
    <div className="relative min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">

      {/* Loading / Success Overlay */}
      {(optionsLoading ||
        isSubmitting ||
        showSuccessAnimation) && (
        <div className="absolute inset-x-0 bottom-0 top-0 z-50 flex items-center justify-center bg-slate-950/15 backdrop-blur-[1px]">
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white/90 px-6 py-5 shadow-xl">

            <div
              className={`h-10 w-10 animate-spin rounded-full border-4 border-slate-200 ${
                showSuccessAnimation
                  ? 'border-t-green-600'
                  : 'border-t-[#1a1f24]'
              }`}
              aria-hidden="true"
            />

            <span className="mt-3 text-sm font-semibold text-slate-700">
              {isSubmitting
                ? 'Creating voucher...'
                : showSuccessAnimation
                  ? 'Voucher created successfully!'
                  : 'Loading ...'}
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-[1280px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]"
      >

        {/* Header */}
        <div className="bg-[#63c45d] px-5 py-4 text-[17px] font-bold text-white">
          Create {documentType}
        </div>

        <div className="bg-[#f5f7f4] p-5">

          <div className="grid gap-3 md:grid-cols-2">

            {/* Voucher Type */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>

              <select
                value={voucherType}
                onChange={(event) =>
                  setVoucherType(event.target.value)
                }
                disabled={voucherTypesLoading}
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              >
                {voucherTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {voucherTypesError && (
                <span className="text-[11px] font-normal text-amber-600">
                  {voucherTypesError}
                </span>
              )}
            </label>

            {/* Voucher Number */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No</span>

              <input
                value={form.voucherNumber}
                onChange={(event) =>
                  updateField(
                    'voucherNumber',
                    event.target.value,
                  )
                }
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                placeholder="Voucher No"
              />
            </label>

            {/* Party Name */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Party Name</span>

              <select
                value={form.partyName}
                onChange={(event) =>
                  updateField(
                    'partyName',
                    event.target.value,
                  )
                }
                disabled={optionsLoading}
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              >
                <option value="">
                  {optionsLoading
                    ? 'Loading parties...'
                    : 'Select Party'}
                </option>

                {partyOptions.map((party) => {
                  const name = getDisplayName(party, [
                    'partyName',
                    'name',
                    'customerName',
                    'ledgerName',
                    'displayName',
                  ])

                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </label>

            {/* Date */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>

              <div className="relative">
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    updateField(
                      'date',
                      event.target.value,
                    )
                  }
                  className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🗓
                </span>
              </div>
            </label>

            {/* Transaction Type */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Transaction Type</span>

              <select
                value={form.transactionType}
                onChange={(event) =>
                  updateField(
                    'transactionType',
                    event.target.value,
                  )
                }
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="">
                  Select Transaction Type
                </option>

                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
              </select>
            </label>

            {/* Ledger */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Select Ledger</span>

              <select
                value={form.ledger}
                onChange={(event) =>
                  updateField(
                    'ledger',
                    event.target.value,
                  )
                }
                disabled={optionsLoading}
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
              >
                <option value="">
                  {optionsLoading
                    ? 'Loading ledgers...'
                    : 'Select Ledger'}
                </option>

                {ledgerOptions.map((ledger) => {
                  const name = getDisplayName(ledger, [
                    'ledgerName',
                    'name',
                    'displayName',
                    'partyName',
                  ])

                  return (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </label>

            {/* Closing Balance */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Closing Balance</span>

              <input
                value={
                  optionsLoading
                    ? 'Loading...'
                    : closingBalance.toLocaleString(
                        'en-IN',
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )
                }
                readOnly
                disabled
                className="min-h-10 w-full rounded-md border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 outline-none"
              />
            </label>

            {/* Amount */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Amount</span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(event) =>
                  updateField(
                    'amount',
                    event.target.value,
                  )
                }
                placeholder="Amount"
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </label>
          </div>

          {/* Narration */}
          <div className="mt-5">
            <label className="block text-[12px] font-semibold text-slate-700">
              Narration
            </label>

            <textarea
              value={form.narration}
              onChange={(event) =>
                updateField(
                  'narration',
                  event.target.value,
                )
              }
              placeholder="Enter Narration"
              className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Error / Success */}
          {(submitMessage || submitError) && (
            <p
              className={`mt-3 text-sm ${
                submitError
                  ? 'text-red-600'
                  : 'text-emerald-600'
              }`}
            >
              {submitError || submitMessage}
            </p>
          )}

          {optionsError && (
            <p className="mt-2 text-sm text-amber-600">
              {optionsError}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end bg-[#f5f7f4] px-5 pb-5 pt-0">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Creating...'
              : `Create ${documentType}`}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReceiptPage