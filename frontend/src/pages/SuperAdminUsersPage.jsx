import { useEffect, useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import useAuthStore from '../store/authStore'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function extractUsers(response) {
  const data = response?.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.users)) return data.users
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(response?.users)) return response.users
  if (Array.isArray(response?.items)) return response.items
  if (Array.isArray(response)) return response

  return []
}

function getUserName(user) {
  return user?.name || user?.fullName || user?.full_name || user?.user?.name || '-'
}

function getCompanyName(user) {
  const company = user?.company
  return typeof company === 'string'
    ? company
    : company?.name || user?.companyName || user?.company_name || '-'
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
}

const SuperAdminUsersPage = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    if (!accessToken) {
      setUsers([])
      setError('Access token not found. Please sign in again.')
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    const params = new URLSearchParams({
      page: '1',
      limit: '100',
      q: submittedQuery,
    })

    setLoading(true)
    setError('')

    fetch(`${API_BASE_URL}/super-admin/users?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(body?.message || 'Failed to load users.')
        }
        return body
      })
      .then((response) => {
        if (mounted) setUsers(extractUsers(response))
      })
      .catch((loadError) => {
        if (mounted) setError(loadError?.message || 'Failed to load users.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [accessToken, submittedQuery, reloadKey])

  const submitSearch = (event) => {
    event.preventDefault()
    setSubmittedQuery(query.trim())
  }

  return (
    <main className="min-h-[calc(100vh-60px)] bg-slate-50 p-4 text-slate-800 md:p-6">
      <section className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold">Users</h1>
            <p className="mt-1 text-sm text-slate-500">
              {loading ? 'Loading users...' : `${users.length} users`}
            </p>
          </div>

          <form onSubmit={submitSearch} className="flex w-full gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search users"
                aria-label="Search users"
                className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </header>

        {error && (
          <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="inline-flex shrink-0 items-center gap-1 font-semibold hover:text-red-900"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user, index) => (
                  <tr key={user?.id || user?._id || user?.userId || index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{getUserName(user)}</td>
                    <td className="px-4 py-3 text-slate-600">{user?.email || user?.user?.email || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{getCompanyName(user)}</td>
                    <td className="px-4 py-3 text-slate-600">{user?.role || user?.userType || user?.user_type || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{user?.status || (user?.isActive === false ? 'Inactive' : '-')}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(user?.createdAt || user?.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default SuperAdminUsersPage