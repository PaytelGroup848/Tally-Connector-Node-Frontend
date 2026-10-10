import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../store/authStore'
import { Eye } from 'lucide-react'
import {
  extractLedgers,
  extractVoucherTypes,
  fetchCompanyLedgers,
  fetchCompanyVoucherTypes,
  postCompanyCommand,
} from '../services/companiesApi'
import { extractCustomers } from '../services/customersApi'
import { fetchParties } from '../services/partiesApi'
import {
  advancedVoucherFieldNames,
  AdvancedVoucherSettings,
  GstLedgerPanel,
  SearchableDropdown,
} from './DocumentVoucherPage'

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

function getBalanceValue(entry) {
  const balanceKeys = new Set([
    'closingbalance',
    'currentbalance',
    'balance',
  ])
  const pending = [entry]

  while (pending.length > 0) {
    const value = pending.shift()
    if (!value || typeof value !== 'object') continue

    for (const [key, candidate] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (
        balanceKeys.has(normalizedKey) &&
        candidate !== null &&
        candidate !== undefined &&
        String(candidate).trim() !== '' &&
        Number.isFinite(Number(candidate))
      ) {
        return String(candidate)
      }
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === 'object') pending.push(child)
    }
  }

  return null
}

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

const LEDGER_PAGE_SIZE = 20

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
  const [ledgerPage, setLedgerPage] = useState({
    nextPage: 1,
    hasMore: false,
    loading: false,
    error: '',
  })
  const ledgerPageRef = useRef(ledgerPage)
  const [closingBalance, setClosingBalance] = useState('')
  const [closingBalanceLoading, setClosingBalanceLoading] = useState(false)
  const [closingBalanceError, setClosingBalanceError] = useState('')
  const closingBalanceRequestRef = useRef(0)
  const closingBalanceEditedRef = useRef(false)

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

  const updateLedgerPage = (pageState) => {
    ledgerPageRef.current = pageState
    setLedgerPage(pageState)
  }

  const loadMoreLedgers = async () => {
    const currentPage = ledgerPageRef.current
    if (!currentPage.hasMore || currentPage.loading) return

    updateLedgerPage({ ...currentPage, loading: true, error: '' })

    try {
      const response = await fetchCompanyLedgers(accessToken, companyId, {
        page: currentPage.nextPage,
        limit: LEDGER_PAGE_SIZE,
      })
      const ledgers = extractLedgers(response).filter((ledger) =>
        getDisplayName(ledger, [
          'ledgerName',
          'name',
          'displayName',
          'partyName',
        ]),
      )
      setLedgerOptions((existingLedgers) => [...existingLedgers, ...ledgers])
      updateLedgerPage({
        nextPage: currentPage.nextPage + 1,
        hasMore: ledgers.length >= LEDGER_PAGE_SIZE,
        loading: false,
        error: '',
      })
    } catch (error) {
      updateLedgerPage({
        ...currentPage,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unable to load more ledgers.',
      })
    }
  }

  const resetClosingBalance = () => {
    closingBalanceRequestRef.current += 1
    closingBalanceEditedRef.current = false
    setClosingBalance('')
    setClosingBalanceLoading(false)
    setClosingBalanceError('')
  }

  const fetchClosingBalance = async (partyName) => {
    const requestId = ++closingBalanceRequestRef.current
    closingBalanceEditedRef.current = false
    setClosingBalance('')
    setClosingBalanceError('')

    if (!partyName || !companyId || !accessToken) {
      setClosingBalanceLoading(false)
      return
    }

    setClosingBalanceLoading(true)
    const [partiesResult, ledgersResult] = await Promise.allSettled([
      fetchParties({
        companyId,
        accessToken,
        page: 1,
        limit: LEDGER_PAGE_SIZE,
        q: partyName,
      }),
      fetchCompanyLedgers(accessToken, companyId, {
        page: 1,
        limit: LEDGER_PAGE_SIZE,
        q: partyName,
      }),
    ])

    if (requestId !== closingBalanceRequestRef.current) return

    const matchingEntries = [
      ...(partiesResult.status === 'fulfilled'
        ? extractCustomers(partiesResult.value)
        : []),
      ...(ledgersResult.status === 'fulfilled'
        ? extractLedgers(ledgersResult.value)
        : []),
    ].filter((entry) => {
      const name = getDisplayName(entry, [
        'partyName',
        'name',
        'customerName',
        'ledgerName',
        'displayName',
      ])
      return name.toLowerCase().trim() === partyName.toLowerCase().trim()
    })
    const balance = matchingEntries
      .map(getBalanceValue)
      .find((value) => value !== null)

    if (balance !== undefined) {
      if (!closingBalanceEditedRef.current) setClosingBalance(balance)
      setClosingBalanceError('')
    } else if (
      partiesResult.status === 'rejected' &&
      ledgersResult.status === 'rejected'
    ) {
      setClosingBalanceError(
        partiesResult.reason?.message ||
          ledgersResult.reason?.message ||
          'Unable to load the selected party closing balance.',
      )
    } else {
      setClosingBalanceError(
        'Closing balance is unavailable for the selected party.',
      )
    }

    setClosingBalanceLoading(false)
  }

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

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const resetForm = () => {
    resetClosingBalance()
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

    const formValues = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    )
    const advancedSettings = Object.fromEntries(
      advancedVoucherFieldNames.map((fieldName) => [
        fieldName,
        formValues[fieldName] || '',
      ]),
    )

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
      !form.ledger ||
      !form.date ||
      !form.transactionType
    ) {
      setSubmitError(
        'Select a party, date and transaction type before submitting.',
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
          advancedSettings,
          ...advancedSettings,

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
   */
/*
 * Load ledgers only
 */
useEffect(() => {
  if (!accessToken || !companyId) {
    setLedgerOptions([])
    updateLedgerPage({
      nextPage: 1,
      hasMore: false,
      loading: false,
      error: '',
    })
    return undefined
  }

  let mounted = true

  setOptionsLoading(true)
  setOptionsError('')
  updateLedgerPage({
    nextPage: 1,
    hasMore: false,
    loading: false,
    error: '',
  })

  fetchCompanyLedgers(accessToken, companyId, {
    page: 1,
    limit: LEDGER_PAGE_SIZE,
  })
    .then((response) => {
      if (!mounted) return

      const firstPage = extractLedgers(response).filter((ledger) =>
          getDisplayName(ledger, [
            'ledgerName',
            'name',
            'displayName',
            'partyName',
          ]),
        )
      setLedgerOptions(firstPage)
      updateLedgerPage({
        nextPage: 2,
        hasMore: firstPage.length >= LEDGER_PAGE_SIZE,
        loading: false,
        error: '',
      })
    })
    .catch((error) => {
      if (!mounted) return

      setLedgerOptions([])
      updateLedgerPage({
        nextPage: 1,
        hasMore: false,
        loading: false,
        error: '',
      })
      setOptionsError(
        error?.message || 'Unable to load ledger options.',
      )
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
                className={`h-10 w-10 animate-spin rounded-full border-4 border-slate-200 ${showSuccessAnimation
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
        className="mx-auto max-w-[1280px] overflow-hidden border border-slate-200 bg-white shadow-[0_10px_30px_rgba(24,33,43,0.05)]"
      >

        {/* Header */}
        <div className="bg-emerald-700 px-5 py-4 text-[17px] font-bold text-white flex justify-center">
          Create {documentType}
          <div className="ml-auto">
            <div className="ml-auto">
              <button
                type="button"
                className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
                onClick={() => {
                  let path = "/";

                  if (documentType === "Receipt") {
                    path = "/my-receipts";
                  } else if (documentType === "Payment") {
                    path = "/my-payments";
                  }
                   window.history.pushState({}, "", path);
                window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                View status
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#f5f7f4] p-5">

          <div className="grid gap-3 md:grid-cols-2">

            {/* Voucher Type */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher Type</span>

              <input
                name="voucherType"
                value={documentType}
                readOnly
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
              />
            </label>

            {/* Voucher Number */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Voucher No (optional)</span>

              <input
                value={form.voucherNumber}
                type="text"
                min="0"
                step="1"
                required
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
            {/* <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Party Name</span>

              <SearchableDropdown
                name="partyName"
                label="parties"
                options={partyOptions.map((party) =>
                  getDisplayName(party, [
                    'partyName',
                    'name',
                    'customerName',
                    'ledgerName',
                    'displayName',
                  ]),
                )}
                placeholder="Select Party"
                value={form.partyName}
                onSelect={(value) => updateField('partyName', value)}
                onClear={() => updateField('partyName', '')}
                disabled={optionsLoading}
              />
            </label> */}

            {/* Date */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Date</span>

              <div className="relative">
                <input
                  type="date"
                  value={form.date}
                  required
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

              <SearchableDropdown
                name="transactionType"
                label="transaction types"
                options={['Cash', 'Bank']}
                placeholder="Select Transaction Type"
                value={form.transactionType}
                onSelect={(value) => updateField('transactionType', value)}
                onClear={() => updateField('transactionType', '')}
              />
            </label>

            {/* Ledger */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Party Name</span>

              <SearchableDropdown
                name="ledger"
                label="ledgers"
                options={ledgerOptions.map((ledger) =>
                  getDisplayName(ledger, [
                    'ledgerName',
                    'name',
                    'displayName',
                    'partyName',
                  ]),
                )}
                infiniteScroll
                hasMoreOptions={ledgerPage.hasMore}
                loadingMore={ledgerPage.loading}
                loadMoreError={ledgerPage.error}
                onLoadMore={loadMoreLedgers}
                placeholder="Select Party"
                value={form.ledger}
                onSelect={(value) => updateField('ledger', value)}
                onOptionSelect={fetchClosingBalance}
                onClear={() => {
                  updateField('ledger', '')
                  resetClosingBalance()
                }}
                disabled={optionsLoading}
              />
            </label>

            {/* Closing Balance */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Closing Balance</span>

              <input
                type="number"
                step="any"
                value={closingBalance}
                onChange={(event) => {
                  closingBalanceEditedRef.current = true
                  setClosingBalance(event.target.value)
                }}
                aria-describedby={
                  closingBalanceError ? 'closing-balance-error' : undefined
                }
                placeholder={
                  closingBalanceLoading ? 'Loading...' : 'Closing Balance'
                }
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              {closingBalanceError && (
                <span
                  id="closing-balance-error"
                  className="text-xs text-red-600"
                  role="status"
                >
                  {closingBalanceError}
                </span>
              )}
            </label>

            {/* Amount */}
            <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
              <span>Amount</span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                required
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

          <div className="mt-5 grid items-start gap-3 lg:grid-cols-[1.35fr_.9fr]">
            <div className="space-y-2">
              <details open className="group rounded-md bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
                  Narration
                  <span className="text-lg leading-none transition group-open:rotate-90">›</span>
                </summary>

                <div className="relative p-3">
                  <textarea
                    value={form.narration}
                    required
                    onChange={(event) =>
                      updateField(
                        'narration',
                        event.target.value,
                      )
                    }
                    placeholder="Enter narration"
                    className="min-h-[78px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>
              </details>

              <AdvancedVoucherSettings />
            </div>

            {/* <div className="rounded-md bg-white p-3">
              <GstLedgerPanel subtotal={Number(form.amount || 0)} ledgerOptions={ledgerOptions} />

              <div className="space-y-2 bg-green-50 p-3 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span>₹{Number(form.amount || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>₹0</span>
                </div>

                <div className="mt-3 flex justify-between border-t border-green-100 pt-3 text-base font-bold text-slate-900">
                  <span>Grand Total</span>
                  <span>₹{Number(form.amount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Error / Success */}
          {(submitMessage || submitError) && (
            <p
              className={`mt-3 text-sm ${submitError
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
            className="rounded-lg bg-[#1a1f24] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(24,33,43,0.2)] disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-700"
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