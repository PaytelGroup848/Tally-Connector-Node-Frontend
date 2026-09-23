import { useEffect, useState } from 'react'
import {
  Search,
  Plus,
  X,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'

import useAuthStore from '../store/authStore'
import { fetchParties } from '../services/partiesApi'
import { postCompanyCommand } from '../services/companiesApi'

const initialPartyForm = {
  partyName: '',
  partyType: '',
  contactNumber: '',
  gstNumber: '',
  ledgerGroup: '',
  ledgerName: '',
  openingBalance: '',
  openingBalanceType: 'Credit',
  country: 'India',
  state: '',
  postalAddress: '',
  postalCode: '',
  gstRegistrationType: '',
  ledgerMobile: '',
  email: '',
  narration: '',
}

/* =========================================================
   DATE
========================================================= */

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

/* =========================================================
   AMOUNT
========================================================= */

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

/* =========================================================
   COMPANY ID
========================================================= */

function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    null
  )
}

/* =========================================================
   PAGE
========================================================= */

function PartiesPage({
  selectedCompany: selectedCompanyProp,
}) {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const storedSelectedCompany = useAuthStore(
    (state) => state.selectedCompany,
  )

  const selectedCompany =
    selectedCompanyProp || storedSelectedCompany

  const companyId =
    getCompanyId(selectedCompany)

  const [parties, setParties] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [partyForm, setPartyForm] = useState(initialPartyForm)

  /* =======================================================
     FETCH
  ======================================================= */

  useEffect(() => {
    if (!accessToken || !companyId) {
      setParties([])
      setTotal(0)
      setLoading(false)
      return
    }

    let mounted = true

    async function loadParties() {
      try {
        setLoading(true)
        setError('')

        const response = await fetchParties({
          accessToken,
          companyId,
          page,
          limit,
          q: search,
        })

        if (!mounted) return

        const items = response?.data?.items
        const totalCount = response?.data?.total

        setParties(
          Array.isArray(items)
            ? items
            : [],
        )

        setTotal(
          Number.isFinite(Number(totalCount))
            ? Number(totalCount)
            : 0,
        )
      } catch (requestError) {
        if (!mounted) return

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
    refreshKey,
  ])

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit),
  )

  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : page <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : page >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', page - 1, page, page + 1, '...', totalPages]

  function handleSearchChange(event) {
    setSearch(event.target.value)
    setPage(1)
  }

  function handleLimitChange(event) {
    setLimit(Number(event.target.value))
    setPage(1)
  }

  function updatePartyField(field, value) {
    setPartyForm((current) => ({ ...current, [field]: value }))
  }

  function closeCreateParty() {
    if (isCreating) return
    setIsCreateOpen(false)
    setCreateError('')
    setCreateMessage('')
    setPartyForm(initialPartyForm)
  }

  async function handleCreateParty(event) {
    event.preventDefault()
    if (!accessToken || !companyId) {
      setCreateError('Please select a company before creating a party.')
      return
    }

    try {
      setIsCreating(true)
      setCreateError('')
      setCreateMessage('')

      await postCompanyCommand(accessToken, companyId, {
        type: 'CREATE_PARTY',
        payload: {
          ...partyForm,
          openingBalance: Number(partyForm.openingBalance) || 0,
        },
      })

      setIsCreateOpen(false)
      setPartyForm(initialPartyForm)
      setPage(1)
      setRefreshKey((current) => current + 1)
      setCreateMessage('Party created successfully.')
    } catch (requestError) {
      setCreateError(requestError?.message || 'Unable to create party.')
    } finally {
      setIsCreating(false)
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        background: '#ffffff',
      }}
    >

      {/* ===================================================
          TOP TOOLBAR
      =================================================== */}

      <div
        className="toolbar-shell"
        style={{
          height: '62px',
          minHeight: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '0 13px',
          borderBottom: '1px solid #e7edf2',
          background: '#ffffff',
        }}
      >

        {/* LEFT */}

        <div
          className="toolbar-left"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
          }}
        >

          {/* SEARCH */}

          <div
            className="toolbar-search"
            style={{
              width: '256px',
              flexShrink: 0,
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #d8e1ea',
              borderRadius: '7px',
              background: '#ffffff',
            }}
          >
            <Search
              size={15}
              style={{
                marginLeft: '11px',
                marginRight: '8px',
                color: '#647b94',
                flexShrink: 0,
              }}
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search party name"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '0 10px 0 0',
                fontSize: '12px',
                color: '#334155',
              }}
            />
          </div>

          {/* SHOW */}

          <div
            className="toolbar-show"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#26364a',
            }}
          >
            <span>
              Show
            </span>

            <select
              className="toolbar-select"
              value={limit}
              onChange={handleLimitChange}
              style={{
                width: '62px',
                height: '38px',
                padding: '0 8px',
                border: '1px solid #d8e1ea',
                borderRadius: '7px',
                background: '#ffffff',
                color: '#334155',
                fontSize: '12px',
                outline: 'none',
              }}
            >
              <option value={10}>
                10
              </option>
              <option value={20}>
                20
              </option>

              <option value={50}>
                30
              </option>

              <option value={100}>
                50
              </option>
            </select>

            <span>
              records
            </span>
          </div>
        </div>

        {/* RIGHT */}

        <div className="toolbar-right flex items-center gap-3">
          <span
            className="page-meta"
            style={{
              fontSize: '11px',
              color: '#536d8a',
              whiteSpace: 'nowrap',
            }}
          >
            Page {page} · {limit} per page
          </span>
          <button
            type="button"
            disabled={!companyId}
            onClick={() => {
              setCreateError('')
              setCreateMessage('')
              setIsCreateOpen(true)
            }}
            className="add-party-btn flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={14} />
            Add New Party
          </button>
        </div>
      </div>

      {/* ===================================================
          NO COMPANY
      =================================================== */}

      {!companyId && (
        <div
          style={{
            margin: '16px',
            padding: '18px',
            textAlign: 'center',
            border: '1px solid #fde68a',
            borderRadius: '7px',
            background: '#fffbeb',
            color: '#b45309',
            fontSize: '13px',
          }}
        >
          Please select a company to view parties.
        </div>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {companyId && error && (
        <div
          style={{
            margin: '12px 14px',
            padding: '10px 14px',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            background: '#fef2f2',
            color: '#dc2626',
            fontSize: '12px',
          }}
        >
          {error}
        </div>
      )}

      {/* ===================================================
          TABLE
      =================================================== */}

      {companyId && (
        <div
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
            }}
          >
            <table
              style={{
                width: '100%',
                minWidth: '1250px',
                borderCollapse: 'collapse',
                tableLayout: 'auto',
              }}
            >

              {/* ================= HEADER ================= */}

              <thead>
                <tr
                  style={{
                    height: '41px',
                    background: '#f5f8fa',
                  }}
                >

                  <th className="party-th">
                    PARTY NAME
                  </th>

                  <th className="party-th">
                    GSTIN
                  </th>

                  <th className="party-th">
                    PHONE
                  </th>

                  <th className="party-th">
                    EMAIL
                  </th>


                  <th className="party-th party-right">
                    CLOSING BALANCE
                  </th>

                  <th className="party-th party-right">
                    CREDIT LIMIT
                  </th>

                  <th className="party-th party-center">
                    CREDIT DAYS
                  </th>

                  <th className="party-th">
                    LAST SOLD DATE
                  </th>
                  <th className="party-th">
                    ADDRESS
                  </th>

                  <th className="party-th">
                    CREATED AT
                  </th>

                  <th className="party-th">
                    UPDATED AT
                  </th>

                </tr>
              </thead>

              {/* ================= BODY ================= */}

              <tbody>

                {loading && (
                  <tr>
                    <td
                      colSpan={11}
                      style={{
                        height: '130px',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '12px',
                      }}
                    >
                      Loading parties...
                    </td>
                  </tr>
                )}

                {!loading &&
                  parties.map((party) => {
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
                        className="party-row"
                      >

                        {/* PARTY */}

                        <td className="party-td">
                          <div
                            style={{
                              minWidth: '220px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: '#1e3a5f',
                              }}
                            >
                              {party?.partyName ||
                                '-'}
                            </div>

                            <div
                              style={{
                                marginTop: '3px',
                                fontSize: '9px',
                                color: '#94a3b8',
                              }}
                            >

                            </div>
                          </div>
                        </td>

                        {/* GSTIN */}

                        <td className="party-td">
                          {party?.gstin || '-'}
                        </td>

                        {/* PHONE */}

                        <td className="party-td">
                          {party?.phone ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >


                              <span>
                                {party.phone}
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>

                        {/* EMAIL */}

                        <td className="party-td">
                          {party?.email ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                maxWidth: '220px',
                              }}
                            >


                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {party.email}
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>



                        {/* BALANCE */}

                        <td
                          className="party-td party-right"
                        >
                          <span
                            style={{
                              fontWeight: 500,
                              color: isNegative
                                ? '#475569'
                                : balance > 0
                                  ? '#475569'
                                  : '#475569',
                            }}
                          >

                            {formatAmount(
                              Math.abs(balance),
                            )}

                            {isNegative
                              ? ' Dr'
                              : balance > 0
                                ? ' Cr'
                                : ''}
                          </span>
                        </td>

                        {/* CREDIT LIMIT */}

                        <td
                          className="party-td party-right"
                        >
                          {`${formatAmount(
                            party?.creditLimit ??
                            party?.credit_limit,
                          )}`}
                        </td>

                        {/* CREDIT DAYS */}

                        <td
                          className="party-td party-center"
                        >
                          {party?.creditDays ??
                            party?.credit_days ??
                            0}
                        </td>

                        {/* LAST SOLD */}

                        <td
                          className="party-td"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(
                            party?.lastSoldDate ??
                            party?.last_sold_date,
                          )}
                        </td>
                        {/* ADDRESS */}

                        <td
                          className="party-td"
                          style={{
                            minWidth: '360px',
                            maxWidth: '500px',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            verticalAlign: 'top',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                          }}
                        >
                          {party?.address ? (
                            <div
                              style={{
                                width: '100%',
                                fontSize: '12px',
                                lineHeight: '1.5',
                                color: '#1c426b',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {party.address}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        {/* CREATED AT */}

                        <td
                          className="party-td"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(
                            party?.createdAt ??
                            party?.created_at,
                          )}
                        </td>

                        {/* UPDATED AT */}

                        <td
                          className="party-td"
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(
                            party?.updatedAt ??
                            party?.updated_at,
                          )}
                        </td>
                      </tr>
                    )
                  })}

                {!loading &&
                  parties.length === 0 && (
                    <tr>
                      <td
                        colSpan={11}
                        style={{
                          height: '130px',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '12px',
                        }}
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

          {/* =================================================
              BOTTOM PAGINATION
          ================================================= */}

          <div className="flex min-h-[50px] items-center justify-center border-t border-slate-100 bg-[#f5f8fa] px-3 py-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {pageItems.map((item, index) =>
                item === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 min-w-8 items-center justify-center px-1 text-xs text-slate-500"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    type="button"
                    disabled={totalPages <= 1 || loading}
                    onClick={() => setPage(item)}
                    className={`flex h-8 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${page === item
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeCreateParty()
          }}
        >
          <form
            onSubmit={handleCreateParty}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Party
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a customer or supplier for the selected company.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateParty}
                disabled={isCreating}
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close add party form"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form fields */}
            <div className="grid gap-4 p-5">

              {/* Party Name */}
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
                <span>
                  Party Name
                  <span className="text-red-500"> *</span>
                </span>

                <input
                  type="text"
                  required
                  value={partyForm.partyName}
                  onChange={(event) =>
                    updatePartyField('partyName', event.target.value)
                  }
                  placeholder="Enter party name"
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Party Type */}
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
                <span>
                  Party Type
                  <span className="text-red-500"> *</span>
                </span>

                <select
                  required
                  value={partyForm.partyType}
                  onChange={(event) =>
                    updatePartyField('partyType', event.target.value)
                  }
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Select Party Type</option>
                  <option value="CUSTOMER">Customer (Sundry Debtors)</option>
                  <option value="SUPPLIER">Supplier (Sundry Creditors)</option>
                </select>
              </label>

              {/* Contact Number */}
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
                <span>Phone Number</span>

                <input
                  type="tel"
                  value={partyForm.contactNumber}
                  onChange={(event) =>
                    updatePartyField(
                      'contactNumber',
                      event.target.value,
                    )
                  }
                  placeholder="9953792488"
                  maxLength={15}
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Email */}
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
                <span>Email</span>

                <input
                  type="email"
                  value={partyForm.email}
                  onChange={(event) =>
                    updatePartyField('email', event.target.value)
                  }
                  placeholder="example@gmail.com"
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Opening Balance */}
              <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
                <span>Opening Balance</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={partyForm.openingBalance}
                  onChange={(event) =>
                    updatePartyField(
                      'openingBalance',
                      event.target.value,
                    )
                  }
                  placeholder="0"
                  className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              {/* Error */}
              {createError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {createError}
                </p>
              )}

              {createMessage && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                  {createMessage}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={closeCreateParty}
                disabled={isCreating}
                className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isCreating}
                className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? 'Creating...' : 'Create Party'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          PAGE SPECIFIC CSS
      ===================================================== */}

      <style>
        {`
          .party-th {
            height: 41px;
            padding: 0 20px;
            border-bottom: 1px solid #e7edf2;
            text-align: left;
            white-space: nowrap;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.02em;
            color: #4f6985;
          }

          .party-td {
            height: 45px;
            padding: 0 20px;
            border-bottom: 1px solid #edf2f6;
            font-size: 12px;
            color: #1c426b;
            vertical-align: middle;
          }

          .party-right {
            text-align: right;
          }

          .party-center {
            text-align: center;
          }

          .party-row {
            background: #ffffff;
            transition: background 0.15s ease;
          }

          .party-row:hover {
            background: #f8fafc;
          }

          @media (max-width: 767px) {
            .toolbar-shell {
              height: auto !important;
              min-height: auto !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 8px !important;
              padding: 8px 10px !important;
            }

            .toolbar-left,
            .toolbar-right {
              width: 100% !important;
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              min-width: 0 !important;
            }

            .toolbar-left {
              gap: 6px !important;
            }

            .toolbar-search {
              width: 100% !important;
              min-width: 0 !important;
              flex: 1 1 auto !important;
            }

            .toolbar-show {
              flex-shrink: 0 !important;
              justify-content: flex-start !important;
              gap: 4px !important;
            }

            .toolbar-select {
              width: 56px !important;
              min-width: 56px !important;
              flex: 0 0 auto !important;
            }

            .toolbar-right {
              justify-content: space-between !important;
              gap: 6px !important;
            }

            .page-meta {
              white-space: nowrap !important;
              line-height: 1.2;
              font-size: 10px !important;
            }

            .add-party-btn {
              width: auto !important;
              justify-content: center !important;
              flex: 0 0 auto !important;
              padding-left: 10px !important;
              padding-right: 10px !important;
              white-space: nowrap !important;
            }

            .party-th {
              padding: 0 14px;
            }

            .party-td {
              padding: 0 14px;
            }
          }
        `}
      </style>
    </div>
  )
}

export default PartiesPage