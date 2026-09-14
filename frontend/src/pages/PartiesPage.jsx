import { useEffect, useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'

import useAuthStore from '../store/authStore'
import { fetchParties } from '../services/partiesApi'

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatAmount(value) {
  const amount = Number(value)

  if (!Number.isFinite(amount)) {
    return '0.00'
  }

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    null
  )
}

function PartiesPage({
  selectedCompany,
}) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const [parties, setParties] =
    useState([])

  const [page, setPage] =
    useState(1)

  const [limit] =
    useState(50)

  const [total, setTotal] =
    useState(0)

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const companyId =
    getCompanyId(selectedCompany)

  useEffect(() => {
    if (!accessToken || !companyId) {
      setParties([])
      setTotal(0)
      return
    }

    let mounted = true

    const loadParties = async () => {
      try {
        setLoading(true)
        setError('')

        const response =
          await fetchParties({
            accessToken,
            companyId,
            page,
            limit,
            q: search,
          })

        if (!mounted) {
          return
        }

        const items =
          response?.data?.items

        const totalCount =
          response?.data?.total

        setParties(
          Array.isArray(items)
            ? items
            : [],
        )

        setTotal(
          Number.isFinite(
            Number(totalCount),
          )
            ? Number(totalCount)
            : 0,
        )
      } catch (requestError) {
        if (!mounted) {
          return
        }

        setParties([])
        setTotal(0)

        setError(
          requestError?.message ||
            'Failed to load parties.',
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadParties()

    return () => {
      mounted = false
    }
  }, [
    accessToken,
    companyId,
    page,
    limit,
    search,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit),
  )

  const startItem =
    total === 0
      ? 0
      : (page - 1) * limit + 1

  const endItem =
    Math.min(
      page * limit,
      total,
    )

  const handleSearchChange = (
    event,
  ) => {
    setPage(1)
    setSearch(event.target.value)
  }

  const handlePrevious = () => {
    setPage((current) =>
      Math.max(1, current - 1),
    )
  }

  const handleNext = () => {
    setPage((current) =>
      Math.min(
        totalPages,
        current + 1,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-[#eef1f1] p-4 md:p-5">
      <div className="rounded-[14px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-slate-800">
              Parties
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {selectedCompany?.name ||
                selectedCompany?.companyName ||
                'Selected company'}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="text-sm text-slate-600">
              Total Parties

              <strong className="ml-1 font-bold text-slate-800">
                {total}
              </strong>
            </div>

            {/* SEARCH */}

            <div className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:w-[320px]">
              <Search
                size={17}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={
                  handleSearchChange
                }
                placeholder="Search parties..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-sm
                  text-slate-800
                  outline-none
                  placeholder:text-slate-400
                "
              />
            </div>
          </div>
        </div>

        {/* ==================================================
            NO COMPANY
        ================================================== */}

        {!companyId && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-700">
            Please select a company to
            view parties.
          </div>
        )}

        {/* ==================================================
            ERROR
        ================================================== */}

        {companyId && error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {companyId && loading && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Loading parties...
          </div>
        )}

        {/* ==================================================
            TABLE
        ================================================== */}

        {companyId &&
          !loading &&
          !error && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full border-collapse">

                  <thead className="bg-[#eef1f3]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Party
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        GSTIN
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Phone
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Address
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Closing Balance
                      </th>

                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Credit Limit
                      </th>

                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Credit Days
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Last Sold
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {parties.map(
                      (party) => {
                        const balance =
                          Number(
                            party?.closingBalance,
                          ) || 0

                        const isNegative =
                          balance < 0

                        return (
                          <tr
                            key={
                              party?._id ||
                              party?.tallyExternalId
                            }
                            className="
                              border-t
                              border-slate-200
                              transition
                              hover:bg-slate-50
                            "
                          >
                            {/* PARTY */}

                            <td className="px-4 py-4">
                              <div className="min-w-[220px]">
                                <p className="font-semibold text-slate-800">
                                  {party?.partyName ||
                                    '-'}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-400">
                                  {party?.tallyExternalId ||
                                    '-'}
                                </p>
                              </div>
                            </td>

                            {/* GSTIN */}

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {party?.gstin ||
                                '-'}
                            </td>

                            {/* PHONE */}

                            <td className="px-4 py-4">
                              {party?.phone ? (
                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                  <Phone
                                    size={13}
                                    className="text-slate-400"
                                  />

                                  <span>
                                    {
                                      party.phone
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  -
                                </span>
                              )}
                            </td>

                            {/* EMAIL */}

                            <td className="px-4 py-4">
                              {party?.email ? (
                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                  <Mail
                                    size={13}
                                    className="text-slate-400"
                                  />

                                  <span className="max-w-[220px] truncate">
                                    {
                                      party.email
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  -
                                </span>
                              )}
                            </td>

                            {/* ADDRESS */}

                            <td className="px-4 py-4">
                              {party?.address ? (
                                <div className="flex max-w-[260px] items-start gap-1.5 text-sm text-slate-600">
                                  <MapPin
                                    size={13}
                                    className="mt-0.5 shrink-0 text-slate-400"
                                  />

                                  <span className="line-clamp-2">
                                    {
                                      party.address
                                    }
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  -
                                </span>
                              )}
                            </td>

                            {/* CLOSING BALANCE */}

                            <td className="px-4 py-4 text-right">
                              <span
                                className={`font-semibold ${
                                  isNegative
                                    ? 'text-red-600'
                                    : balance > 0
                                      ? 'text-emerald-700'
                                      : 'text-slate-600'
                                }`}
                              >
                                ₹
                                {formatAmount(
                                  Math.abs(
                                    balance,
                                  ),
                                )}

                                {isNegative
                                  ? ' Dr'
                                  : balance >
                                      0
                                    ? ' Cr'
                                    : ''}
                              </span>
                            </td>

                            {/* CREDIT LIMIT */}

                            <td className="px-4 py-4 text-right text-sm text-slate-600">
                              {party?.creditLimit ===
                              null
                                ? '-'
                                : `₹${formatAmount(
                                    party.creditLimit,
                                  )}`}
                            </td>

                            {/* CREDIT DAYS */}

                            <td className="px-4 py-4 text-center text-sm text-slate-600">
                              {party?.creditDays ===
                              null
                                ? '-'
                                : party.creditDays}
                            </td>

                            {/* LAST SOLD */}

                            <td className="px-4 py-4 text-sm text-slate-600">
                              {formatDate(
                                party?.lastSoldDate,
                              )}
                            </td>
                          </tr>
                        )
                      },
                    )}

                    {parties.length ===
                      0 && (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          {search
                            ? `No parties found for "${search}".`
                            : 'No parties found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-500">
                  Showing{' '}
                  <span className="font-semibold text-slate-700">
                    {startItem}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold text-slate-700">
                    {endItem}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-slate-700">
                    {total}
                  </span>{' '}
                  parties
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      handlePrevious
                    }
                    disabled={
                      page <= 1 ||
                      loading
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <ChevronLeft
                      size={15}
                    />

                    Previous
                  </button>

                  <span className="min-w-[80px] text-center text-xs font-semibold text-slate-600">
                    Page {page} of{' '}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      page >=
                        totalPages ||
                      loading
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-lg
                      border
                      border-slate-300
                      bg-white
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-slate-700
                      transition
                      hover:bg-slate-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Next

                    <ChevronRight
                      size={15}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default PartiesPage