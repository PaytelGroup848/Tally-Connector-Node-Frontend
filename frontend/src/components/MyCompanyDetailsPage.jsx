
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Building2,
  BookOpen,
  Copy,
  Check,
  Hash,
  Link2,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  extractCompany,
  extractLedgerPagination,
  extractLedgers,
  fetchCompanyById,
  fetchCompanyLedgers,
} from '../services/companiesApi'

const MyCompanyDetailsPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken)

  const [company, setCompany] = useState(null)
  const [ledgers, setLedgers] = useState([])
  const [ledgerError, setLedgerError] = useState('')
  const [ledgerPage, setLedgerPage] = useState(1)
  const [ledgerLimit, setLedgerLimit] = useState(20)
  const [ledgerSearch, setLedgerSearch] = useState('')
  const [ledgerQuery, setLedgerQuery] = useState('')
  const [ledgerPagination, setLedgerPagination] = useState({})
  const [isLedgersLoading, setIsLedgersLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState('')

  const companyId = decodeURIComponent(
    window.location.pathname.split('/').pop() || '',
  )

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setLedgerQuery(ledgerSearch)
      setLedgerPage(1)
    }, 400)

    return () => clearTimeout(debounceTimer)
  }, [ledgerSearch])

  useEffect(() => {
    if (!accessToken || !companyId) return undefined

    let isMounted = true

    fetchCompanyById(accessToken, companyId)
      .then((response) => {
        if (isMounted) {
          setCompany(extractCompany(response))
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError?.message ||
              'Unable to load company details',
          )
        }
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId])

  useEffect(() => {
    if (!accessToken || !companyId) return undefined

    let isMounted = true

    setIsLedgersLoading(true)
    setLedgerError('')

    fetchCompanyLedgers(accessToken, companyId, {
      page: ledgerPage,
      limit: ledgerLimit,
      q: ledgerQuery,
    })
      .then((response) => {
        if (isMounted) {
          setLedgers(extractLedgers(response))
          setLedgerPagination(extractLedgerPagination(response))
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setLedgerError(requestError?.message || 'Unable to load ledger data')
        }
      })
      .finally(() => {
        if (isMounted) setIsLedgersLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, ledgerPage, ledgerLimit, ledgerQuery])

  const handleCopy = async (value, key) => {
    if (!value || value === '-') return

    try {
      await navigator.clipboard.writeText(String(value))
      setCopiedField(key)

      setTimeout(() => {
        setCopiedField('')
      }, 1500)
    } catch {
      // Ignore clipboard errors
    }
  }

  const fields = [
    {
      label: 'Company ID',
      key: 'id',
      icon: Hash,
      description: 'Unique identifier',
    },
    {
      label: 'Tally Company Name',
      key: 'tallyCompanyName',
      icon: Building2,
      description: 'Registered Tally company',
    },
    {
      label: 'Tally Company GUID',
      key: 'tallyCompanyGuid',
      icon: Hash,
      description: 'Tally unique identifier',
    },
    {
      label: 'Linked Connector ID',
      key: 'linkedByConnectorId',
      icon: Link2,
      description: 'Connected through',
    },
  ]

  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (error) {
    return (
      <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back
          </button>

          <div className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Building2 size={22} />
                </div>

                <div>
                  <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                    Unable to Load Company
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    We could not retrieve the company information.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
                <p className="text-sm leading-6 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (!company) {
    return (
      <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back
          </button>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 animate-pulse items-center justify-center rounded-xl bg-slate-100">
                  <Building2
                    size={22}
                    className="text-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded-md bg-slate-100" />
                  <div className="h-3 w-56 animate-pulse rounded-md bg-slate-100" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-5"
                >
                  <div className="space-y-3">
                    <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  const companyName =
    company?.tallyCompanyName || 'Tally Company'

  const ledgerColumns = Array.from(
  new Set(ledgers.flatMap((ledger) => Object.keys(ledger || {}))),
).filter(
  (column) =>
    ![
      'source',
      'raw',
      'version',
      'v',
      '__v',
      'id',
      '_id',
      'ledgerid',
      'companyid',
      'organisationid',
      'organizationid',
      'tallyexternalid',
    ].includes(column.toLowerCase().replace(/[_-]/g, '')),
)

  const formatLedgerValue = (value, column) => {
    if (value === null || value === undefined || value === '') return 'NA'

    const normalizedColumn = column.toLowerCase().replace(/[_-]/g, '')
    if (normalizedColumn === 'createdat' || normalizedColumn === 'updatedat') {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Kolkata',
        }).format(date)
      }
    }

    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const formatLedgerLabel = (column) => column
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim()

  const reportedPageCount = Number(
    ledgerPagination.totalPages ||
      ledgerPagination.total_pages ||
      ledgerPagination.pages ||
      0,
  )
  const ledgerPageCount = reportedPageCount > 0 ? reportedPageCount : 30

  const ledgerPageItems = ledgerPage <= 4
    ? [1, 2, 3, 4, 5, '...', ledgerPageCount]
    : ledgerPage >= ledgerPageCount - 3
      ? [1, '...', ledgerPageCount - 4, ledgerPageCount - 3, ledgerPageCount - 2, ledgerPageCount - 1, ledgerPageCount]
      : [1, '...', ledgerPage - 1, ledgerPage, ledgerPage + 1, '...', ledgerPageCount]

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => window.history.back()}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft
            size={17}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          Back
        </button>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">

          {/* =================================================
              COMPANY HEADER
          ================================================= */}

          <div className="border-b border-slate-100 px-6 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              {/* Company identity */}

              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <Building2 size={27} strokeWidth={2} />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Company Information
                  </p>

                  <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {companyName}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Company details connected through Tally
                  </p>
                </div>
              </div>

              {/* Status */}

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-emerald-700">
                  Connected
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              DETAILS CONTENT
          ================================================= */}

          <div className="px-6 py-6 sm:px-8 sm:py-8 lg:px-10">

            <div className="mb-5">
              

            
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map(
                ({
                  label,
                  key,
                  icon: Icon,
                  description,
                }) => {
                  const value = company?.[key] || '-'
                  const isCopied = copiedField === key

                  return (
                    <div
                      key={key}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-4">

                        {/* Icon */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition-colors duration-200 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                          <Icon size={18} strokeWidth={2} />
                        </div>

                        {/* Content */}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {label}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {description}
                              </p>
                            </div>

                            {value !== '-' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(value, key)
                                }
                                title={
                                  isCopied
                                    ? 'Copied'
                                    : 'Copy value'
                                }
                                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              >
                                {isCopied ? (
                                  <Check
                                    size={15}
                                    className="text-emerald-600"
                                  />
                                ) : (
                                  <Copy size={15} />
                                )}
                              </button>
                            )}
                          </div>

                          <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5">
                            <p
                              className={`break-all text-sm font-semibold leading-5 ${
                                value === '-'
                                  ? 'text-slate-400'
                                  : 'text-slate-800'
                              }`}
                            >
                              {value}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 sm:px-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ledgers</h2>
              <p className="mt-1 text-sm text-slate-500">Ledger data connected through Tally</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="search"
                value={ledgerSearch}
                onChange={(event) => {
                  setLedgerSearch(event.target.value)
                }}
                placeholder="Search ledgers"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 sm:w-64"
              />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="whitespace-nowrap">Show</span>
                <select
                  value={ledgerLimit}
                  onChange={(event) => {
                    setLedgerLimit(Number(event.target.value))
                    setLedgerPage(1)
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-emerald-500"
                >
                  {[10, 20, 30, 50].map((limit) => (
                    <option key={limit} value={limit}>{limit}</option>
                  ))}
                </select>
                <span className="whitespace-nowrap">records</span>
              </label>
            </div>
            <span className="text-xs text-slate-500">Page {ledgerPage} · {ledgerLimit} per page</span>
          </div>

          {ledgerError ? (
            <p className="px-6 py-5 text-sm text-red-600 sm:px-8">{ledgerError}</p>
          ) : isLedgersLoading ? (
            <p className="px-6 py-5 text-sm text-slate-500 sm:px-8">Loading ledger data...</p>
          ) : ledgers.length === 0 ? (
            <p className="px-6 py-5 text-sm text-slate-500 sm:px-8">No ledger data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    {ledgerColumns.map((column) => (
                      <th key={column} className="whitespace-nowrap px-5 py-3 font-semibold">{formatLedgerLabel(column)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgers.map((ledger, index) => (
                    <tr key={ledger?.id || ledger?._id || index} className="hover:bg-slate-50">
                      {ledgerColumns.map((column) => (
                        <td key={column} className="whitespace-nowrap px-5 py-3 text-slate-700">
                          {formatLedgerValue(ledger?.[column], column)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 px-6 py-4 sm:px-8">
            {ledgerPageItems.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400">...</span>
              ) : (
                <button
                  key={page}
                  type="button"
                  disabled={isLedgersLoading}
                  onClick={() => setLedgerPage(page)}
                  className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                    ledgerPage === page
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {page}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyCompanyDetailsPage

