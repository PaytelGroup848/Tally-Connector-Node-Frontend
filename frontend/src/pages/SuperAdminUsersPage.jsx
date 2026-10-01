import { useEffect, useMemo, useState } from 'react'
import { Search, X, Eye, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  createSuperAdminUser,
  fetchSuperAdminUserCompanies,
  fetchSuperAdminUsers,
  updateSuperAdminUserCompanyAccess,
  updateSuperAdminUserSuspension,
} from '../services/superAdminApi'

/* =========================================================
   EXTRACT USERS
   ========================================================= */

function extractUsers(response) {
  const candidates = [
    response?.data?.users,
    response?.data?.items,
    response?.data?.results,
    response?.data?.docs,
    response?.users,
    response?.items,
    response?.results,
    response?.data,
  ]

  return candidates.find(Array.isArray) || []
}

function extractCompanies(response) {
  const candidates = [
    response?.data?.companies,
    response?.data?.items,
    response?.data?.results,
    response?.companies,
    response?.items,
    response?.results,
    response?.data,
  ]

  return candidates.find(Array.isArray) || []
}

function getUserId(user) {
  return user?.id ?? user?._id ?? user?.userId ?? user?.user_id
}

function getCompanyId(company) {
  return (
    company?.id ??
    company?._id ??
    company?.companyId ??
    company?.company_id
  )
}

function isCompanyAllowed(company) {
  const allowed =
    company?.allowed ?? company?.isAllowed ?? company?.is_allowed

  return (
    allowed === true ||
    ['true', 'yes', '1'].includes(String(allowed).toLowerCase())
  )
}

function setCompanyAllowed(company, allowed) {
  const field =
    ['allowed', 'isAllowed', 'is_allowed'].find((key) => key in company) ||
    'allowed'

  return { ...company, [field]: allowed }
}

function getOrganizationId(user) {
  const organizationValues = [
    user?.organization,
    user?.organisation,
    ...(Array.isArray(user?.organizations)
      ? user.organizations
      : [user?.organizations]),
    ...(Array.isArray(user?.organisations)
      ? user.organisations
      : [user?.organisations]),
  ]

  const candidates = [
    user?.organizationId,
    user?.organisationId,
    ...organizationValues.flatMap((organization) => [
      organization?.id,
      organization?._id,
      organization?.organizationId,
      organization?.organisationId,
    ]),
  ]

  return candidates.find(
    (value) => value !== undefined && value !== null && value !== '',
  ) ?? null
}

/* =========================================================
   HIDDEN IDENTIFIER FIELDS
   ========================================================= */

function isHiddenIdentifierField(key) {
  return /^(?:_?id|_?organizationId|_?organisationId)$/i.test(
    key,
  )
}

/* =========================================================
   REMOVE IDENTIFIER FIELDS
   ========================================================= */

function removeIdentifierFields(value) {
  if (Array.isArray(value)) {
    return value.map(removeIdentifierFields)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !isHiddenIdentifierField(key))
        .map(([key, nestedValue]) => [
          key,
          removeIdentifierFields(nestedValue),
        ]),
    )
  }

  return value
}

/* =========================================================
   FLATTEN USER
   ========================================================= */

function flattenUser(user, prefix = '', result = {}) {
  Object.entries(user || {}).forEach(([key, value]) => {
    /*
     * Do not show:
     * id
     * _id
     * organizationId
     * organisationId
     * organization
     * organisation
     */
    if (
      isHiddenIdentifierField(key) ||
      /^organizations?$/i.test(key) ||
      /^organisations?$/i.test(key)
    ) {
      return
    }

    const column = prefix ? `${prefix}.${key}` : key

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      flattenUser(value, column, result)
    } else {
      result[column] = Array.isArray(value)
        ? JSON.stringify(removeIdentifierFields(value))
        : value
    }
  })

  return result
}

/* =========================================================
   FIND ORGANISATION DATA
   ========================================================= */

function extractOrganisationData(user) {
  if (!user || typeof user !== 'object') {
    return null
  }

  const possibleKeys = [
    'organizations',
    'organisations',
    'organization',
    'organisation',
    'organizationData',
    'organisationData',
    'organizationDetails',
    'organisationDetails',
  ]

  for (const key of possibleKeys) {
    const value = user?.[key]

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return removeIdentifierFields(value)
    }

    if (Array.isArray(value)) {
      return removeIdentifierFields(value)
    }
  }

  /*
   * Handle organisation fields directly inside
   * the user object.
   */
  const organisationFields = {}

  Object.entries(user).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase()

    if (
      normalizedKey.includes('organization') ||
      normalizedKey.includes('organisation')
    ) {
      if (!isHiddenIdentifierField(key)) {
        organisationFields[key] = value
      }
    }
  })

  if (Object.keys(organisationFields).length > 0) {
    return removeIdentifierFields(organisationFields)
  }

  return null
}

/* =========================================================
   FLATTEN ORGANISATION FOR POPUP
   ========================================================= */

function flattenOrganisation(
  value,
  prefix = '',
  result = {},
) {
  if (value === null || value === undefined) {
    return result
  }

  if (
    typeof value !== 'object' ||
    value instanceof Date
  ) {
    result[prefix || 'Organisation'] = value
    return result
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const arrayPrefix = prefix
        ? `${prefix}.${index + 1}`
        : index === 0
          ? ''
          : `${index + 1}`

      if (
        item &&
        typeof item === 'object' &&
        !Array.isArray(item)
      ) {
        flattenOrganisation(
          item,
          arrayPrefix,
          result,
        )
      } else {
        result[arrayPrefix] = item
      }
    })

    return result
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    if (isHiddenIdentifierField(key)) {
      return
    }

    const column = prefix
      ? `${prefix}.${key}`
      : key

    if (
      nestedValue &&
      typeof nestedValue === 'object'
    ) {
      flattenOrganisation(
        nestedValue,
        column,
        result,
      )
    } else {
      result[column] = nestedValue
    }
  })

  return result
}

/* =========================================================
   FORMAT DATE
   Created At will show DATE ONLY
   ========================================================= */

function formatDateOnly(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* =========================================================
   FORMAT CELL
   ========================================================= */

function formatCellValue(value, column = '') {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  /*
   * Created At -> date only
   */
  const lastKey = column
    .split('.')
    .pop()
    ?.toLowerCase()

  if (lastKey === 'createdat') {
    return formatDateOnly(value)
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

/* =========================================================
   FORMAT COLUMN NAME
   ========================================================= */

function formatColumnName(column) {
  return column
    .replaceAll('.', ' / ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

/* =========================================================
   CREATE USER MODAL
   ========================================================= */

function CreateSuperAdminUserModal({
  accessToken,
  onClose,
  onCreated,
}) {
  const [email, setEmail] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      await createSuperAdminUser({
        accessToken,
        email: email.trim(),
        organizationName: organizationName.trim(),
      })

      onCreated()
    } catch (createError) {
      setError(createError.message || 'Failed to create user.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Create User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a user and their organization.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close create user dialog"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting}
              autoComplete="email"
              placeholder="name@example.com"
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Organization Name

            <input
              type="text"
              value={organizationName}
              onChange={(event) =>
                setOrganizationName(event.target.value)
              }
              required
              disabled={submitting}
              placeholder="Organization name"
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
            />
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =========================================================
   COMPONENT
   ========================================================= */

const SuperAdminUsersPage = () => {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )
  const authenticatedUser = useAuthStore(
    (state) => state.user,
  )

  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [actionError, setActionError] = useState('')
  const [suspendingUserId, setSuspendingUserId] = useState(null)

  /* =========================================================
     PAGINATION STATE
     ========================================================= */

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  /* Selected user for organisation popup */
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCompaniesUser, setSelectedCompaniesUser] =
    useState(null)
  const [userCompanies, setUserCompanies] = useState([])
  const [companiesLoading, setCompaniesLoading] = useState(false)
  const [companiesError, setCompaniesError] = useState('')
  const [companyActionError, setCompanyActionError] = useState('')
  const [updatingCompanyId, setUpdatingCompanyId] = useState(null)

  /* =========================================================
     FETCH USERS
     ========================================================= */

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const loadUsers = async () => {
      if (!accessToken) {
        setUsers([])
        setError('Access token not found')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await fetchSuperAdminUsers({
          accessToken,
          page: 1,
          limit: 500,
          q: appliedQuery,
          signal: controller.signal,
        })

        if (active) {
          setUsers(extractUsers(response))
          setCurrentPage(1)
        }
      } catch (loadError) {
        if (
          active &&
          loadError.name !== 'AbortError'
        ) {
          setError(
            loadError.message ||
              'Failed to fetch users',
          )

          setUsers([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      active = false
      controller.abort()
    }
  }, [accessToken, appliedQuery, refreshKey])

  useEffect(() => {
    if (!selectedCompaniesUser) return undefined

    const controller = new AbortController()
    const userId = getUserId(selectedCompaniesUser)
    const organizationId =
      getOrganizationId(selectedCompaniesUser) ??
      getOrganizationId(authenticatedUser)

    if (userId === undefined || userId === null || userId === '') {
      return () => controller.abort()
    }

    if (
      organizationId === undefined ||
      organizationId === null ||
      organizationId === ''
    ) {
      return () => controller.abort()
    }

    const loadCompanies = async () => {
      setCompaniesLoading(true)

      try {
        const response = await fetchSuperAdminUserCompanies({
          accessToken,
          userId,
          organizationId,
          signal: controller.signal,
        })

        setUserCompanies(extractCompanies(response))
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setCompaniesError(
            loadError.message || 'Failed to fetch user companies.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setCompaniesLoading(false)
        }
      }
    }

    loadCompanies()

    return () => controller.abort()
  }, [accessToken, authenticatedUser, selectedCompaniesUser])

  /* =========================================================
     SEARCH
     ========================================================= */

  const handleSearch = (event) => {
    event.preventDefault()

    setCurrentPage(1)
    setAppliedQuery(query.trim())
  }

  const handleOpenUserCompanies = (user) => {
    const userId = getUserId(user)
    const organizationId =
      getOrganizationId(user) ?? getOrganizationId(authenticatedUser)

    setUserCompanies([])
    setCompaniesLoading(false)
    setCompaniesError('')
    setCompanyActionError('')

    if (userId === undefined || userId === null || userId === '') {
      setCompaniesError('This user has no ID.')
    } else if (
      organizationId === undefined ||
      organizationId === null ||
      organizationId === ''
    ) {
      setCompaniesError('Organization ID is not available for this user.')
    }

    setSelectedCompaniesUser(user)
  }

  /* =========================================================
     PAGE SIZE
     ========================================================= */

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value)

    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  /* =========================================================
     SUSPEND / REACTIVATE
     ========================================================= */

  const handleToggleSuspension = async (user) => {
    const userId =
      user.id ??
      user._id ??
      user.userId ??
      user.user_id

    if (
      userId === undefined ||
      userId === null ||
      userId === ''
    ) {
      setActionError(
        'This user has no ID and cannot be updated.',
      )

      return
    }

    const isSuspended =
      user.isSuspended === true ||
      user.isSuspended === 'true'

    const nextSuspendedState = !isSuspended

    try {
      setSuspendingUserId(String(userId))
      setActionError('')

      await updateSuperAdminUserSuspension({
        accessToken,
        id: userId,
        isSuspended: nextSuspendedState,
      })

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => {
          const currentUserId =
            currentUser.id ??
            currentUser._id ??
            currentUser.userId ??
            currentUser.user_id

          return String(currentUserId) ===
            String(userId)
            ? {
                ...currentUser,
                isSuspended:
                  nextSuspendedState,
              }
            : currentUser
        }),
      )
    } catch (suspensionError) {
      setActionError(
        suspensionError.message ||
          'Failed to update user suspension.',
      )
    } finally {
      setSuspendingUserId(null)
    }
  }

  /* =========================================================
     FLATTEN USERS
     ========================================================= */

  const flattenedUsers = useMemo(
    () =>
      users.map((user) =>
        flattenUser(user),
      ),
    [users],
  )

  /* =========================================================
     TABLE COLUMNS
     ========================================================= */

  const columns = useMemo(
    () => [
      ...new Set(
        flattenedUsers.flatMap((user) =>
          Object.keys(user),
        ),
      ),
    ],
    [flattenedUsers],
  )

  /* =========================================================
     PAGINATION CALCULATIONS
     ========================================================= */

  const totalUsers = users.length

  const totalPages = Math.max(
    Math.ceil(totalUsers / pageSize),
    1,
  )

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  )

  const startIndex =
    (safeCurrentPage - 1) * pageSize

  const endIndex = Math.min(
    startIndex + pageSize,
    totalUsers,
  )

  const paginatedUsers = users.slice(
    startIndex,
    endIndex,
  )

  const paginatedFlattenedUsers =
    flattenedUsers.slice(
      startIndex,
      endIndex,
    )

  /* =========================================================
     KEEP PAGE VALID
     ========================================================= */

  useEffect(() => {
    if (
      currentPage > totalPages &&
      totalPages > 0
    ) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  /* =========================================================
     PAGINATION NAVIGATION
     ========================================================= */

  const goToPreviousPage = () => {
    setCurrentPage((page) =>
      Math.max(page - 1, 1),
    )
  }

  const goToNextPage = () => {
    setCurrentPage((page) =>
      Math.min(page + 1, totalPages),
    )
  }

  const goToPage = (page) => {
    setCurrentPage(
      Math.min(
        Math.max(page, 1),
        totalPages,
      ),
    )
  }

  const handleToggleCompanyAccess = async (company) => {
    const userId = getUserId(selectedCompaniesUser)
    const companyId = getCompanyId(company)
    const organizationId =
      getOrganizationId(selectedCompaniesUser) ??
      getOrganizationId(authenticatedUser)

    if (companyId === undefined || companyId === null || companyId === '') {
      setCompanyActionError('This company has no ID and cannot be updated.')
      return
    }

    if (!organizationId) {
      setCompanyActionError('Organization ID is not available for this user.')
      return
    }

    const allowed = !isCompanyAllowed(company)
    const allowedCompanies = userCompanies
      .filter((userCompany) => {
        if (String(getCompanyId(userCompany)) === String(companyId)) {
          return allowed
        }

        return isCompanyAllowed(userCompany)
      })
      .map(getCompanyId)
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map(String)

    try {
      setUpdatingCompanyId(String(companyId))
      setCompanyActionError('')

      await updateSuperAdminUserCompanyAccess({
        accessToken,
        userId,
        organizationId,
        allowedCompanies,
      })

      setUserCompanies((currentCompanies) =>
        currentCompanies.map((currentCompany) =>
          String(getCompanyId(currentCompany)) === String(companyId)
            ? setCompanyAllowed(currentCompany, allowed)
            : currentCompany,
        ),
      )
    } catch (updateError) {
      setCompanyActionError(
        updateError.message || 'Failed to update company access.',
      )
    } finally {
      setUpdatingCompanyId(null)
    }
  }

  /* =========================================================
     PAGE NUMBERS
     ========================================================= */

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1,
      )
    }

    if (safeCurrentPage <= 3) {
      return [1, 2, 3, 4, 5]
    }

    if (safeCurrentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ]
    }

    return [
      safeCurrentPage - 2,
      safeCurrentPage - 1,
      safeCurrentPage,
      safeCurrentPage + 1,
      safeCurrentPage + 2,
    ]
  }, [safeCurrentPage, totalPages])

  /* =========================================================
     SELECTED ORGANISATION DATA
     ========================================================= */

  const selectedOrganisation = selectedUser
    ? extractOrganisationData(selectedUser)
    : null

  const organisationTable =
    selectedOrganisation
      ? flattenOrganisation(
          selectedOrganisation,
        )
      : {}

  const organisationColumns = Object.keys(
    organisationTable,
  )

  const flattenedCompanies = useMemo(
    () => userCompanies.map((company) => flattenUser(company)),
    [userCompanies],
  )

  const companyColumns = useMemo(
    () => [
      ...new Set(
        flattenedCompanies.flatMap((company) =>
          Object.keys(company),
        ),
      ),
    ],
    [flattenedCompanies],
  )

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <section className="mx-auto max-w-[1450px]">
        {/* PAGE HEADER */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-emerald-600">
              User Management
            </p>

            <h2 className="text-2xl font-bold text-slate-800">
            Users
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Loading users...'
                : `${totalUsers} users found`}
            </p>
          </div>
          
           {/* PAGE SIZE */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="pageSize"
                  className="text-sm text-slate-500"
                >
                  Show
                </label>

                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={
                    handlePageSizeChange
                  }
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value={10}>
                    10
                  </option>
                  <option value={20}>
                    20
                  </option>
                  <option value={30}>
                    30
                  </option>
                  <option value={50}>
                    50
                  </option>
                </select>

                <span className="text-sm text-slate-500">
                  users
                </span>
              </div>
              
          {/* SEARCH + CREATE */}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <form
              onSubmit={handleSearch}
              className="flex w-full gap-2 sm:w-auto"
            >
              <label className="relative min-w-0 flex-1 sm:w-[280px]">
                <span className="sr-only">
                  Search users
                </span>

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search users..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Search
              </button>
            </form>

            <button
              type="button"
              onClick={() =>
                setShowCreateUser(true)
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Create User
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </div>
        )}

        {/* =====================================================
            USERS TABLE
            ===================================================== */}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[850px] border-collapse text-left">
            {/* TABLE HEAD */}
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-5 py-3 font-semibold"
                  >
                    {formatColumnName(column)}
                  </th>
                ))}

                {/* ORGANISATION COLUMN */}
                <th className="whitespace-nowrap px-5 py-3 text-center font-semibold">
                  Organisation
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-center font-semibold">
                  User companies
                </th>

                {/* ACTION COLUMN */}
                <th className="whitespace-nowrap px-5 py-3 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={Math.max(
                      columns.length + 3,
                      2,
                    )}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map(
                  (user, index) => {
                    const actualIndex =
                      startIndex + index

                    return (
                      <tr
                        key={
                          user.id ||
                          user._id ||
                          index
                        }
                        className="transition hover:bg-slate-50"
                      >
                        {/* NORMAL USER COLUMNS */}
                        {columns.map(
                          (column) => (
                            <td
                              key={column}
                              className="max-w-[320px] break-words px-5 py-4 align-top"
                            >
                              {formatCellValue(
                                paginatedFlattenedUsers[
                                  index
                                ]?.[column],
                                column,
                              )}
                            </td>
                          ),
                        )}

                        {/* ORGANISATION COLUMN */}
                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(
                                users[
                                  actualIndex
                                ],
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                          >
                            <Eye
                              size={14}
                              strokeWidth={2}
                            />

                            View
                          </button>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                                handleOpenUserCompanies(user)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                          >
                            <Eye size={14} strokeWidth={2} />
                            View
                          </button>
                        </td>

                        {/* ACTION COLUMN */}
                        <td className="px-5 py-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleSuspension(
                                user,
                              )
                            }
                            disabled={
                              suspendingUserId !==
                              null
                            }
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                              user.isSuspended ===
                                true ||
                              user.isSuspended ===
                                'true'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                            }`}
                          >
                            {suspendingUserId ===
                            String(
                              user.id ??
                                user._id ??
                                user.userId ??
                                user.user_id,
                            )
                              ? 'Updating...'
                              : user.isSuspended ===
                                    true ||
                                  user.isSuspended ===
                                    'true'
                                ? 'Reactivate'
                                : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    )
                  },
                )
              ) : (
                <tr>
                  <td
                    colSpan={Math.max(
                      columns.length + 3,
                      2,
                    )}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* =====================================================
            PAGINATION FOOTER
            ===================================================== */}

        {!loading && totalUsers > 0 && (
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT SIDE */}
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700">
                  {startIndex + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-700">
                  {endIndex}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700">
                  {totalUsers}
                </span>{' '}
                users
              </p>

             
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* PREVIOUS */}
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={safeCurrentPage === 1}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {/* PAGE NUMBERS */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      goToPage(page)
                    }
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-semibold transition ${
                      safeCurrentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* NEXT */}
              <button
                type="button"
                onClick={goToNextPage}
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =======================================================
          CREATE USER MODAL
          ======================================================= */}

      {showCreateUser && (
        <CreateSuperAdminUserModal
          accessToken={accessToken}
          onClose={() =>
            setShowCreateUser(false)
          }
          onCreated={() => {
            setShowCreateUser(false)
            setCurrentPage(1)
            setRefreshKey(
              (current) => current + 1,
            )
          }}
        />
      )}

      {/* =======================================================
          ORGANISATION MODAL
          ======================================================= */}

      {selectedUser && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() =>
            setSelectedUser(null)
          }
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                  Organisation Details
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {selectedUser.name ||
                    selectedUser.fullName ||
                    selectedUser.email ||
                    'User'}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Organisation information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="max-h-[65vh] overflow-y-auto p-5">
              {organisationColumns.length >
              0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full border-collapse text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="w-[40%] border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Field
                        </th>

                        <th className="border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                          Value
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {organisationColumns.map(
                        (column) => (
                          <tr
                            key={column}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 text-sm font-semibold text-slate-600">
                              {formatColumnName(
                                column,
                              )}
                            </td>

                            <td className="break-words px-4 py-3 text-sm text-slate-700">
                              {formatCellValue(
                                organisationTable[
                                  column
                                ],
                                column,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    No organisation data available
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    No organisation information was found for this user.
                  </p>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCompaniesUser && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => setSelectedCompaniesUser(null)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                  User companies
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {selectedCompaniesUser.name ||
                    selectedCompaniesUser.fullName ||
                    selectedCompaniesUser.email ||
                    'User'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCompaniesUser(null)}
                aria-label="Close user companies dialog"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto p-5">
              {companiesLoading ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  Loading companies...
                </p>
              ) : companiesError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {companiesError}
                </div>
              ) : companyColumns.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-max border-collapse text-left">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        {companyColumns.map((column) => (
                          <th
                            key={column}
                            className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold"
                          >
                            {formatColumnName(column)}
                          </th>
                        ))}
                        <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-center font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                      {flattenedCompanies.map((company, index) => (
                        <tr
                          key={
                            userCompanies[index]?.id ??
                            userCompanies[index]?._id ??
                            userCompanies[index]?.companyId ??
                            index
                          }
                        >
                          {companyColumns.map((column) => (
                            <td
                              key={column}
                              className="max-w-[320px] break-words px-4 py-3"
                            >
                              {formatCellValue(company[column], column)}
                            </td>
                          ))}
                          <td className="whitespace-nowrap px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleCompanyAccess(userCompanies[index])
                              }
                              disabled={updatingCompanyId !== null}
                              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                isCompanyAllowed(userCompanies[index])
                                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {updatingCompanyId ===
                              String(getCompanyId(userCompanies[index]))
                                ? 'Updating...'
                                : isCompanyAllowed(userCompanies[index])
                                  ? 'Revoke'
                                  : 'Allow'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  No companies found for this user.
                </p>
              )}
              {companyActionError && (
                <div
                  role="alert"
                  className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {companyActionError}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedCompaniesUser(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SuperAdminUsersPage