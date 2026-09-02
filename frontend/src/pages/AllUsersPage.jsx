import { useState } from 'react'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl
).replace(/\/$/, '')

const initialUsers = [
  {
    id: '1',
    name: 'MAIN',
    type: 'MAIN',
    mobile: '7011022899',
    status: 'Admin',
    action: 'edit',
  },
]

/*
 * Invite member API
 *
 * POST {{BaseUrl}}/members/invite
 *
 * Request body:
 * {
 *   email: "user@example.com",
 *   role: "ACCOUNTANT"
 * }
 */
async function inviteMember({ email, role }) {
  const token = localStorage.getItem('accessToken')

  if (!token) {
    throw new Error('Access token not found')
  }

  const response = await fetch(
    `${API_BASE_URL}/members/invite`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        role,
      }),
    },
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Failed to invite user',
    )
  }

  return data
}

/*
 * Users Table
 *
 * Only Type / Role is editable.
 *
 * Name        → Read only
 * Type        → Editable
 * Mobile      → Read only
 * Status      → Read only
 */
function UsersTable({
  users,
  setUsers,
}) {
  const [editingUser, setEditingUser] =
    useState(null)

  const handleSave = () => {
    if (!editingUser) return

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              type: editingUser.type,
            }
          : user,
      ),
    )

    setEditingUser(null)
  }

  return (
    <div className="overflow-x-auto rounded-[12px] border border-slate-200 bg-slate-100">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#eef1f3] text-left text-[15px] font-semibold text-slate-700">
          <tr>
            <th className="whitespace-nowrap px-4 py-3">
              Name
            </th>

            <th className="whitespace-nowrap px-4 py-3">
              Type
            </th>

            <th className="whitespace-nowrap px-4 py-3">
              Mobile Number
            </th>

            <th className="whitespace-nowrap px-4 py-3">
              Status
            </th>

            <th className="whitespace-nowrap px-4 py-3 text-right">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-[#f5f5f5] text-[14px] text-slate-700">
          {users.map((user) => {
            const isEditing =
              editingUser?.id === user.id

            return (
              <tr
                key={user.id}
                className="border-t border-slate-200"
              >
                {/* Name - READ ONLY */}
                <td className="px-4 py-4 font-medium text-slate-800">
                  {user.name}
                </td>

                {/* Type / Role - EDITABLE */}
                <td className="px-4 py-4 text-slate-700">
                  {isEditing ? (
                    <select
                      value={editingUser.type}
                      onChange={(event) =>
                        setEditingUser(
                          (current) => ({
                            ...current,
                            type: event.target.value,
                          }),
                        )
                      }
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 outline-none focus:border-slate-500"
                    >
                      <option value="MAIN">
                        MAIN
                      </option>

                      <option value="ACCOUNTANT">
                        ACCOUNTANT
                      </option>

                      <option value="STAFF">
                        STAFF
                      </option>

                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>
                  ) : (
                    user.type
                  )}
                </td>

                {/* Mobile - READ ONLY */}
                <td className="px-4 py-4 text-slate-700">
                  {user.mobile}
                </td>

                {/* Status - READ ONLY */}
                <td className="px-4 py-4 text-slate-700">
                  {user.status}
                </td>

                {/* Action */}
                <td className="px-4 py-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleSave}
                        className="rounded bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingUser(null)
                        }
                        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Edit role"
                      title="Edit role"
                      onClick={() =>
                        setEditingUser({
                          ...user,
                        })
                      }
                      className="text-[20px] text-slate-600 transition hover:text-slate-900"
                    >
                      ✎
                    </button>
                  )}
                </td>
              </tr>
            )
          })}

          {users.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-slate-500"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

/*
 * Add User Modal
 */
function AddUserModal({
  onClose,
  onSuccess,
}) {
  const [email, setEmail] =
    useState('')

  const [role, setRole] =
    useState('ACCOUNTANT')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    const trimmedEmail =
      email.trim()

    if (!trimmedEmail) {
      setError(
        'Please enter an email address.',
      )
      return
    }

    try {
      setLoading(true)

      const response =
        await inviteMember({
          email: trimmedEmail,
          role,
        })

      console.log(
        'INVITE USER RESPONSE:',
        response,
      )

      setSuccess(
        'User invitation sent successfully.',
      )

      /*
       * Add invited user to the table.
       *
       * The current invite API request only
       * provides email + role, so these are
       * the fields we can safely display.
       */
      onSuccess({
        id: `user-${Date.now()}`,
        name: trimmedEmail,
        type: role,
        mobile: '-',
        status: 'Invited',
        action: 'edit',
        email: trimmedEmail,
        role,
      })

      setEmail('')
      setRole('ACCOUNTANT')
    } catch (err) {
      console.error(
        'INVITE USER ERROR:',
        err,
      )

      setError(
        err.message ||
          'Failed to invite user.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* Modal Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Add User
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Invite a user to your organization
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 transition hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="user@example.com"
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 disabled:bg-slate-100"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Role
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-500 disabled:bg-slate-100"
            >
              <option value="ACCOUNTANT">
                ACCOUNTANT
              </option>

              <option value="STAFF">
                STAFF
              </option>

              <option value="ADMIN">
                ADMIN
              </option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-[10px] bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Inviting...'
                : 'Invite User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/*
 * Main All Users Page
 */
function AllUsersPage() {
  const [users, setUsers] =
    useState(initialUsers)

  const [showAddUser, setShowAddUser] =
    useState(false)

  const handleAddUser = (newUser) => {
    setUsers((currentUsers) => [
      ...currentUsers,
      newUser,
    ])

    setShowAddUser(false)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">

      <div className="rounded-[14px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">

        {/* Page Header */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h1 className="text-[26px] font-bold tracking-tight text-slate-800">
            All Users
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* User Count */}
            <div className="text-[14px] text-slate-600">
              <span>
                Total Purchased-
              </span>

              <strong className="ml-1 font-bold text-slate-800">
                3 Users
              </strong>

              <span className="mx-2">
                •
              </span>

              <span>
                In Use-{users.length} Users
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowAddUser(true)
                }
                className="rounded-[10px] border border-slate-800 bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                + Add User
              </button>

              <button
                type="button"
                className="rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-[14px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100"
              >
                + Purchase User
              </button>

            </div>
          </div>
        </div>

        {/* Users Table */}
        <UsersTable
          users={users}
          setUsers={setUsers}
        />

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-end gap-3">

          <div className="text-[14px] text-slate-500">
            1-{users.length} of {users.length}
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-slate-600 shadow-sm transition hover:bg-slate-100"
            >
              ‹
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1f2937] text-[15px] font-semibold text-white shadow-sm"
            >
              1
            </button>

            <button
              type="button"
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-slate-600 shadow-sm transition hover:bg-slate-100"
            >
              ›
            </button>

          </div>
        </div>

      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserModal
          onClose={() =>
            setShowAddUser(false)
          }
          onSuccess={handleAddUser}
        />
      )}

    </div>
  )
}

export default AllUsersPage