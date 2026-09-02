import { useEffect, useState } from 'react'
import {
  deleteMember,
  extractMembers,
  fetchMembers,
  inviteMember,
  normalizeMember,
  updateMemberRole,
} from '../services/membersApi'
import useAuthStore from '../store/authStore'

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('en-GB')
}

function UsersTable({
  users,
  accessToken,
  onRoleChange,
  onDelete,
}) {
  const [editingId, setEditingId] =
    useState(null)

  const [editingRole, setEditingRole] =
    useState('')

  const [savingId, setSavingId] =
    useState(null)

  const [deletingId, setDeletingId] =
    useState(null)

  const [error, setError] =
    useState('')

  const removeUser = async (user) => {
    if (!user.hasPersistedId) {
      setError('This member has no database ID and cannot be removed.')
      return
    }

    if (
      !window.confirm(
        `Remove ${user.email}?`,
      )
    ) {
      return
    }

    try {
      setDeletingId(user.id)
      setError('')

      await deleteMember(accessToken, user.id)

      onDelete(user.id)
    } catch (deleteError) {
      setError(
        deleteError?.message ||
          'Failed to delete user.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingRole('')
    setError('')
  }

  const startEdit = (user) => {
    setEditingId(user.id)
    setEditingRole(user.role)
    setError('')
  }

  const saveRole = async (user) => {
    if (!user.hasPersistedId) {
      setError('This member has no database ID and cannot be updated.')
      return
    }

    const role = editingRole.trim()

    if (!role) {
      setError('Role cannot be empty.')
      return
    }

    if (role === user.role) {
      cancelEdit()
      return
    }

    try {
      setSavingId(user.id)
      setError('')

      await updateMemberRole({
        accessToken,
        id: user.id,
        role,
      })

      onRoleChange(
        user.id,
        role,
      )

      cancelEdit()
    } catch (saveError) {
      setError(
        saveError?.message ||
          'Failed to update role.',
      )
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-[12px] border border-slate-200 bg-slate-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#eef1f3] text-left text-[15px] font-semibold text-slate-700">
            <tr>
              <th className="whitespace-nowrap px-4 py-3">
                Email
              </th>

              <th className="whitespace-nowrap px-4 py-3">
                Role
              </th>

              <th className="whitespace-nowrap px-4 py-3">
                Status
              </th>

              <th className="whitespace-nowrap px-4 py-3">
                Created At
              </th>

              <th className="w-[140px] whitespace-nowrap px-4 pr-8 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-[#f5f5f5] text-[14px] text-slate-700">
            {users.map((user) => {
              const isEditing =
                editingId === user.id

              const isSaving =
                savingId === user.id

              const isDeleting =
                deletingId === user.id

              return (
                <tr
                  key={user.id}
                  className="border-t border-slate-200"
                >
                  {/* EMAIL */}
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <input
                        value={editingRole}
                        onChange={(
                          event,
                        ) =>
                          setEditingRole(
                            event.target
                              .value,
                          )
                        }
                        disabled={isSaving}
                        autoFocus
                        className="w-full max-w-[220px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500"
                      />
                    ) : (
                      user.role || '-'
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    {user.status}
                  </td>

                  {/* CREATED AT */}
                  <td className="px-4 py-4">
                    {formatDate(
                      user.createdAt,
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="w-[140px] px-4 py-4">
                    <div className="flex min-h-[32px] items-center justify-end gap-3">
                      {isEditing ? (
                        <>
                          {/* SAVE */}
                          <button
                            type="button"
                            onClick={() =>
                              saveRole(
                                user,
                              )
                            }
                            disabled={
                              isSaving
                            }
                            className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isSaving
                              ? 'Saving...'
                              : 'Save'}
                          </button>

                          {/* CANCEL */}
                          <button
                            type="button"
                            onClick={
                              cancelEdit
                            }
                            disabled={
                              isSaving
                            }
                            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* EDIT */}
                          <button
                            type="button"
                            onClick={() =>
                              startEdit(
                                user,
                              )
                            }
                            title="Edit role"
                            aria-label="Edit role"
                            className="flex h-8 w-8 items-center justify-center text-[19px] text-slate-600 transition hover:text-slate-900"
                          >
                            ✎
                          </button>

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() =>
                              removeUser(
                                user,
                              )
                            }
                            disabled={
                              isDeleting
                            }
                            title="Delete user"
                            aria-label="Delete user"
                            className="flex h-8 w-8 items-center justify-center text-[18px] text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting
                              ? '…'
                              : '🗑'}
                          </button>
                        </>
                      )}
                    </div>
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
    </div>
  )
}

function AddUserModal({
  accessToken,
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

  const handleSubmit = async (
    event,
  ) => {
    event.preventDefault()

    const trimmedEmail =
      email.trim()

    const trimmedRole =
      role.trim()

    if (
      !trimmedEmail ||
      !trimmedRole
    ) {
      setError(
        'Email and role are required.',
      )
      return
    }

    try {
      setLoading(true)
      setError('')

      const response =
        await inviteMember({
          accessToken,
          email: trimmedEmail,
          role: trimmedRole,
        })

      const invitedUser =
        response?.data ||
        response

      onSuccess(
        normalizeMember(
          {
            ...invitedUser,

            email:
              invitedUser?.email ||
              trimmedEmail,

            role:
              invitedUser?.role ||
              trimmedRole,

            status:
              invitedUser?.status ||
              'Invited',

            createdAt:
              invitedUser?.createdAt ||
              new Date().toISOString(),
          },
          Date.now(),
        ),
      )

      onClose()
    } catch (submitError) {
      setError(
        submitError?.message ||
          'Failed to invite user.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* HEADER */}
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
            aria-label="Close"
            className="text-2xl leading-none text-slate-400 transition hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}
          <label className="block text-sm font-semibold text-slate-700">
            Email Address

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target
                    .value,
                )
              }
              disabled={loading}
              placeholder="user@example.com"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-slate-500 disabled:bg-slate-100"
            />
          </label>

          {/* TYPE */}
          <label className="block text-sm font-semibold text-slate-700">
            Type

            <input
              value={role}
              onChange={(event) =>
                setRole(
                  event.target
                    .value,
                )
              }
              disabled={loading}
              placeholder="ACCOUNTANT"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-slate-500 disabled:bg-slate-100"
            />
          </label>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-[10px] bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
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

function AllUsersPage() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const [users, setUsers] =
    useState([])

  const [usersToken, setUsersToken] =
    useState(null)

  const [showAddUser, setShowAddUser] =
    useState(false)

  const [loading, setLoading] =
    useState(() => Boolean(accessToken))

  const [error, setError] =
    useState('')

  useEffect(() => {
    let mounted = true

    if (!accessToken) {
      return () => {
        mounted = false
      }
    }

    fetchMembers(accessToken)
      .then((response) => {
        if (!mounted) return

        setUsers(
          extractMembers(
            response,
          ).map(
            normalizeMember,
          ),
        )
        setUsersToken(accessToken)
      })
      .catch((loadError) => {
        if (!mounted) return

        setUsersToken(accessToken)
        setError(
          loadError?.message ||
            'Failed to load users.',
        )
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [accessToken])

  const updateRole = (
    id,
    role,
  ) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              role,
            }
          : user,
      ),
    )
  }

  const removeUserFromList = (
    id,
  ) => {
    setUsers((current) =>
      current.filter(
        (user) => user.id !== id,
      ),
    )
  }

  const visibleUsers =
    usersToken === accessToken
      ? users
      : []

  const visibleError =
    usersToken === accessToken
      ? error
      : ''

  const isLoadingUsers =
    loading ||
    Boolean(accessToken && usersToken !== accessToken)

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">

      <div className="rounded-[14px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">

        {/* PAGE HEADER */}
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h1 className="text-[26px] font-bold tracking-tight text-slate-800">
            All Users
          </h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            <div className="text-[14px] text-slate-600">
              Total Users-

              <strong className="ml-1 font-bold text-slate-800">
                {visibleUsers.length}
              </strong>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowAddUser(
                  true,
                )
              }
              className="rounded-[10px] bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white transition hover:bg-slate-800"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* ERROR */}
        {visibleError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {visibleError}
          </div>
        )}

        {/* USERS */}
        {isLoadingUsers ? (
          <div className="rounded-[12px] border border-slate-200 bg-[#f5f5f5] px-4 py-10 text-center text-sm text-slate-500">
            Loading users...
          </div>
        ) : (
          <UsersTable
            users={visibleUsers}
            accessToken={accessToken}
            onRoleChange={
              updateRole
            }
            onDelete={
              removeUserFromList
            }
          />
        )}
      </div>

      {/* ADD USER MODAL */}
      {showAddUser && (
        <AddUserModal
          accessToken={accessToken}
          onClose={() =>
            setShowAddUser(
              false,
            )
          }
          onSuccess={(user) =>
            setUsers((current) => [
              ...current,
              user,
            ])
          }
        />
      )}
    </div>
  )
}

export default AllUsersPage