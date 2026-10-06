import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, Search, X } from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
	fetchSuperAdminOrganization,
	fetchSuperAdminOrganizations,
} from '../services/superAdminApi'

const PAGE_SIZE = 20

function extractOrganizations(response) {
	const candidates = [
		response?.data?.organizations,
		response?.data?.organisations,
		response?.data?.items,
		response?.data?.results,
		response?.organizations,
		response?.organisations,
		response?.items,
		response?.results,
		response?.data,
	]

	return candidates.find(Array.isArray) || []
}

function getOrganizationId(organization) {
	return (
		organization?.id ??
		organization?._id ??
		organization?.organizationId ??
		organization?.organisationId
	)
}

function formatDetailValue(value) {
	if (value === null || value === undefined || value === '') return '-'
	if (typeof value === 'object') return JSON.stringify(value)
	return formatCellValue(value)
}

function isHiddenField(key) {
  const normalizedKey = String(key).toLowerCase().replace(/[^a-z0-9]/g, '')

  return (
    String(key).toLowerCase() === '__v' ||
    ['refreshtokenhash', 'createdat', 'updatedat', 'deviceinfo'].includes(normalizedKey) ||
    HIDDEN_FIELDS.some(
      (field) => field.toLowerCase() === String(key).toLowerCase()
    ) ||
    /(?:^|[_-])id$/i.test(String(key)) ||
    /(?:Id|ID)$/.test(String(key))
  )
}

function removeHiddenFields(value) {
  if (Array.isArray(value)) {
    return value.map(removeHiddenFields)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !isHiddenField(key))
        .map(([key, child]) => [key, removeHiddenFields(child)])
    )
  }

  return value
}

/* =========================================================
   RECURSIVE TABLE FOR JSON DATA
========================================================= */

function JsonValueTable({ value }) {
  if (value === null || value === undefined || value === '') {
    return (
      <span className="text-slate-500">
        -
      </span>
    )
  }

  /* ---------- ARRAY ---------- */

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span className="text-slate-500">
          No records.
        </span>
      )
    }

    const objectRows = value.filter(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        !Array.isArray(item)
    )

    /* Array of objects -> table */
    if (objectRows.length > 0) {
      const columns = [
        ...new Set(
          value.flatMap((item) =>
            item &&
            typeof item === 'object' &&
            !Array.isArray(item)
              ? Object.keys(item).filter(
                  (key) => !isHiddenField(key)
                )
              : []
          )
        ),
      ]

      return (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-semibold"
                  >
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {value.map((row, rowIndex) => (
                <tr
                  key={String(
                    row?.id ??
                      row?._id ??
                      rowIndex
                  )}
                  className="hover:bg-slate-50/60"
                >
                  {columns.map((column) => (
                    <td
                      key={column}
                      className="max-w-[360px] px-3 py-2 align-top break-words"
                    >
                      {typeof row?.[column] === 'object' &&
                      row?.[column] !== null ? (
                        <JsonValueTable value={row[column]} />
                      ) : (
                        formatCellValue(row?.[column])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    /* Array of primitive values */
    return (
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => (
          <span
            key={index}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700"
          >
            {formatCellValue(item)}
          </span>
        ))}
      </div>
    )
  }

  /* ---------- OBJECT ---------- */

  if (typeof value === 'object') {
    const entries = Object.entries(value).filter(
      ([key]) => !isHiddenField(key)
    )

    if (entries.length === 0) {
      return (
        <span className="text-slate-500">
          -
        </span>
      )
    }

    return (
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <table className="w-full border-collapse text-left text-xs">
          <tbody className="divide-y divide-slate-100">
            {entries.map(([key, fieldValue]) => (
              <tr key={key}>
                <th className="w-[5.5%] bg-slate-50 px-3 py-2 text-left font-semibold text-slate-600">
                  {formatColumnName(key)}
                </th>

                <td className="px-3 py-2 align-top text-slate-700">
                  {typeof fieldValue === 'object' &&
                  fieldValue !== null ? (
                    <JsonValueTable value={fieldValue} />
                  ) : (
                    formatCellValue(fieldValue)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  /* ---------- PRIMITIVE ---------- */

  return (
    <span className="text-slate-700">
      {formatCellValue(value)}
    </span>
  )
}


/* =========================================================
   ORGANIZATION RESPONSE TABLE
========================================================= */

function OrganizationResponseTables({ data }) {
  if (!data || typeof data !== 'object') {
    return (
      <div className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-500">
        No details available.
      </div>
    )
  }

  const sections = Object.entries(data).filter(
    ([sectionName]) => !isHiddenField(sectionName)
  )

  return (
    <div className="space-y-5">
      {sections.map(([sectionName, value]) => (
        <section key={sectionName}>
          <h3 className="mb-2 text-sm font-semibold text-[#17355f]">
            {formatColumnName(sectionName)}
          </h3>

          <JsonValueTable value={value} />
        </section>
      ))}
    </div>
  )
}

/* =========================================================
   FLATTEN ORGANIZATION
   Removes all ID fields from table columns
   ========================================================= */
const HIDDEN_FIELDS = [
  'id',
  'extraSeats',
  '_id',
  'organizationId',
  'organisationId',
  'ownerId',
  'userId',
  'memberId',
  'subscriptionId',
  'connectorId',
  'companyId',
]
function flattenOrganization(organization, prefix = '', result = {}) {
	Object.entries(organization || {}).forEach(([key, value]) => {
		// Hide selected fields
		if (isHiddenField(key)) {
			return
		}

		const column = prefix ? `${prefix}.${key}` : key

		if (value && typeof value === 'object' && !Array.isArray(value)) {
			flattenOrganization(value, column, result)
		} else {
			result[column] = Array.isArray(value)
				? JSON.stringify(removeHiddenFields(value))
				: value
		}
	})

	return result
}

function formatColumnName(column) {
	return column
		.replaceAll('.', ' ')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatCellValue(value) {
	if (value === null || value === undefined || value === '') {
		return '-'
	}

	if (typeof value === 'boolean') {
		return value ? 'Yes' : 'No'
	}

	// Convert date/time values to IST and show date only
	if (typeof value === 'string') {
		const looksLikeDate =
			/^\d{4}-\d{2}-\d{2}(?:T|\s)/.test(value) ||
			/^\d{4}-\d{2}-\d{2}$/.test(value)

		if (looksLikeDate) {
			const date = new Date(value)

			if (!Number.isNaN(date.getTime())) {
				return new Intl.DateTimeFormat('en-IN', {
					timeZone: 'Asia/Kolkata',
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
				}).format(date)
			}
		}
	}

	return String(value)
}

function getPagination(response) {
	const metadata = [
		response?.data?.pagination,
		response?.pagination,
		response?.data?.meta,
		response?.meta,
		response?.data,
		response,
	].find(
		(value) => value && typeof value === 'object'
	) || {}

	const totalPages = Number(
		metadata.totalPages ??
		metadata.total_pages ??
		metadata.pages,
	)

	const totalItems = Number(
		metadata.total ??
		metadata.totalItems ??
		metadata.total_items ??
		metadata.count,
	)

	return {
		totalPages:
			Number.isFinite(totalPages) && totalPages > 0
				? totalPages
				: null,

		totalItems:
			Number.isFinite(totalItems) && totalItems >= 0
				? totalItems
				: null,

		hasNextPage:
			metadata.hasNextPage ??
			metadata.has_next_page ??
			metadata.hasMore,
	}
}

const AllOrganisationsPage = () => {
	const accessToken = useAuthStore((state) => state.accessToken)

	const [query, setQuery] = useState('')
	const [appliedQuery, setAppliedQuery] = useState('')
	const [organizations, setOrganizations] = useState([])
	const [currentPage, setCurrentPage] = useState(1)

	const [pagination, setPagination] = useState({
		totalPages: null,
		totalItems: null,
		hasNextPage: null,
	})

	const [refreshKey, setRefreshKey] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [organizationDetail, setOrganizationDetail] = useState(null)

	useEffect(() => {
		const controller = new AbortController()
		let active = true

		const loadOrganizations = async () => {
			if (!accessToken) {
				setOrganizations([])
				setError('Access token not found')
				setLoading(false)
				return
			}

			setLoading(true)
			setError('')

			try {
				const response = await fetchSuperAdminOrganizations({
					accessToken,
					page: currentPage,
					limit: PAGE_SIZE,
					q: appliedQuery,
					signal: controller.signal,
				})

				if (active) {
					setOrganizations(
						extractOrganizations(response)
					)

					setPagination(
						getPagination(response)
					)
				}
			} catch (loadError) {
				if (
					active &&
					loadError.name !== 'AbortError'
				) {
					setError(
						loadError.message ||
						'Failed to fetch organizations'
					)

					setOrganizations([])
				}
			} finally {
				if (active) {
					setLoading(false)
				}
			}
		}

		loadOrganizations()

		return () => {
			active = false
			controller.abort()
		}
	}, [
		accessToken,
		appliedQuery,
		currentPage,
		refreshKey,
	])

	const flattenedOrganizations = useMemo(
		() =>
			organizations.map((organization) =>
				flattenOrganization(organization)
			),
		[organizations]
	)

	const columns = useMemo(
		() => [
			...new Set([
				...flattenedOrganizations.flatMap(
					(organization) => Object.keys(organization)
				).filter((column) => column.toLowerCase() !== 'subscription'),
				'Details',
			]),
		],
		[flattenedOrganizations]
	)

	const hasNextPage =
		pagination.totalPages !== null
			? currentPage < pagination.totalPages
			: pagination.hasNextPage !== null
				? Boolean(pagination.hasNextPage)
				: organizations.length === PAGE_SIZE

	const handleSearch = (event) => {
		event.preventDefault()

		setCurrentPage(1)
		setAppliedQuery(query.trim())
	}

	const handleViewDetails = async (organization) => {
		const organizationId = getOrganizationId(organization)

		if (!organizationId) {
			setError('Organization ID not found; unable to load its details.')
			return
		}

		const detailId = String(organizationId)
		setOrganizationDetail({
			id: detailId,
			name: organization?.name || organization?.organizationName || 'Organization details',
			loading: true,
			error: '',
			data: null,
		})

		try {
			const response = await fetchSuperAdminOrganization({
				accessToken,
				organizationId: detailId,
			})
			const data = response?.data ?? response

			setOrganizationDetail((current) =>
				current?.id === detailId
					? { ...current, loading: false, data }
					: current
			)
		} catch (loadError) {
			setOrganizationDetail((current) =>
				current?.id === detailId
					? {
						...current,
						loading: false,
						error: loadError?.message || 'Failed to fetch organization details',
					}
					: current
			)
		}
	}

	return (
		<section className="space-y-5">

			{/* =====================================================
			    HEADER
			    ===================================================== */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

				<div>
					<h2 className="text-xl font-bold text-[#17355f]">
						All Organisations / Invoices
					</h2>

					<p className="mt-1 text-sm text-slate-500">
						Browse and search registered organisations.
					</p>
				</div>

				<div className="flex items-center gap-2">

					{/* Search */}
					<form
						onSubmit={handleSearch}
						className="flex min-w-0 flex-1 sm:w-[340px] sm:flex-none"
					>
						<label
							className="sr-only"
							htmlFor="organization-search"
						>
							Search organisations
						</label>

						<input
							id="organization-search"
							type="search"
							value={query}
							onChange={(event) =>
								setQuery(event.target.value)
							}
							placeholder="Search organisations"
							className="h-10 min-w-0 flex-1 rounded-l-md border border-r-0 border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600"
						/>

						<button
							type="submit"
							aria-label="Search"
							className="flex h-10 w-11 items-center justify-center rounded-r-md bg-emerald-700 text-white hover:bg-emerald-800"
						>
							<Search size={17} />
						</button>
					</form>

					{/* Refresh */}
					{/* <button
						type="button"
						onClick={() =>
							setRefreshKey((key) => key + 1)
						}
						disabled={loading}
						aria-label="Refresh organisations"
						title="Refresh"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
					>
						<RefreshCw
							size={16}
							className={
								loading
									? 'animate-spin'
									: ''
							}
						/>
					</button> */}

				</div>
			</div>

			{/* =====================================================
			    ERROR
			    ===================================================== */}
			{error && (
				<div
					role="alert"
					className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
				>
					{error}
				</div>
			)}

			{/* =====================================================
			    TABLE
			    ===================================================== */}
			<div className="overflow-hidden border border-slate-200 bg-white">

				<div className="overflow-x-auto">

					<table className="w-full min-w-[720px] border-collapse text-left text-sm">

						<thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
							<tr>

								{columns.map((column) => (
									<th
										key={column}
										className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold"
									>
										{formatColumnName(column)}
									</th>
								))}

							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100 text-slate-700">

							{/* Loading */}
							{loading ? (
								<tr>
									<td
										colSpan={Math.max(
											columns.length,
											1
										)}
										className="px-4 py-12 text-center text-slate-500"
									>
										Loading organisations...
									</td>
								</tr>

							) : organizations.length === 0 ? (

								/* Empty */
								<tr>
									<td
										colSpan={Math.max(
											columns.length,
											1
										)}
										className="px-4 py-12 text-center text-slate-500"
									>
										{error
											? 'Organisations could not be loaded.'
											: 'No organisations found.'
										}
									</td>
								</tr>

							) : (

								/* Data */
								flattenedOrganizations.map(
									(organization, index) => (

										<tr
											key={
												String(
													organizations[index]?.id ??
													organizations[index]?._id ??
													`${currentPage}-${index}`
												)
											}
											className="hover:bg-slate-50/70"
										>

											{columns.map((column) => (
												<td
													key={column}
													className="max-w-[320px] truncate whitespace-nowrap px-4 py-3"
												>
													{column === 'Details' ? (
														<button
															type="button"
															onClick={() => handleViewDetails(organizations[index])}
															disabled={organizationDetail?.id === String(getOrganizationId(organizations[index])) && organizationDetail.loading}
															className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-60"
														>
															{organizationDetail?.id === String(getOrganizationId(organizations[index])) && organizationDetail.loading
																? 'Loading...'
																: 'View details'}
														</button>
													) : (
														formatCellValue(organization[column])
													)}
												</td>
											))}

										</tr>
									)
								)
							)}

						</tbody>
					</table>

				</div>

				{/* =================================================
				    PAGINATION
				    ================================================= */}
				<footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

					<span>
						{pagination.totalItems === null
							? `Page ${currentPage}`
							: `${pagination.totalItems} organisations`
						}
					</span>

					<div className="flex items-center justify-end gap-2">

						<button
							type="button"
							onClick={() =>
								setCurrentPage(
									(page) =>
										Math.max(
											1,
											page - 1
										)
								)
							}
							disabled={
								currentPage === 1 ||
								loading
							}
							className="flex h-8 items-center gap-1 border border-slate-300 px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<ChevronLeft size={15} />
							Previous
						</button>

						<span className="min-w-16 text-center">
							Page {currentPage}
							{pagination.totalPages
								? ` of ${pagination.totalPages}`
								: ''
							}
						</span>

						<button
							type="button"
							onClick={() =>
								setCurrentPage(
									(page) =>
										page + 1
								)
							}
							disabled={
								!hasNextPage ||
								loading
							}
							className="flex h-8 items-center gap-1 border border-slate-300 px-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
						>
							Next
							<ChevronRight size={15} />
						</button>

					</div>
				</footer>

			</div>

			{organizationDetail && (
				<div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4">
					<section
						role="dialog"
						aria-modal="true"
						aria-labelledby="organization-detail-title"
						className="flex max-h-[85vh] w-full max-w-8xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
					>
						<header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
							<h2 id="organization-detail-title" className="text-base font-semibold text-[#17355f]">
								{organizationDetail.name}
							</h2>
							<button
								type="button"
								aria-label="Close organization details"
								onClick={() => setOrganizationDetail(null)}
								className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
							>
								<X size={18} />
							</button>
						</header>
						<div className="overflow-auto p-5">
							{organizationDetail.loading ? (
								<p className="text-sm text-slate-500">Loading organization details...</p>
							) : organizationDetail.error ? (
								<p role="alert" className="text-sm text-red-700">{organizationDetail.error}</p>
							) : (
								<OrganizationResponseTables data={organizationDetail.data} />
							)}
						</div>
					</section>
				</div>
			)}
		</section>
	)
}

export default AllOrganisationsPage