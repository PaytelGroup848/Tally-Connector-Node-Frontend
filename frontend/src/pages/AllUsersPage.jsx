import { useEffect, useState } from 'react'
import {
  extractMembers,
  fetchMembers,
  inviteMember,
  normalizeMember,
  updateMemberRole,
} from '../services/membersApi'

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB')
}

function UsersTable({ users, onRoleChange }) {
  const [editingId, setEditingId] = useState(null)
  const [editingRole, setEditingRole] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

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
      await updateMemberRole({ id: user.id, role })
      onRoleChange(user.id, role)
      cancelEdit()
    } catch (saveError) {
      setError(saveError?.message || 'Failed to update role.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
      <div className="overflow-x-auto rounded-[12px] border border-slate-200 bg-slate-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#eef1f3] text-left text-[15px] font-semibold text-slate-700">
            <tr>
              {['Email', 'Role', 'Status', 'Created At', 'Action'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3">{heading}</th>)}
            </tr>
          </thead>
          <tbody className="bg-[#f5f5f5] text-[14px] text-slate-700">
            {users.map((user) => {
              const isEditing = editingId === user.id
              const isSaving = savingId === user.id
              return (
                <tr key={user.id} className="border-t border-slate-200">
                  <td className="px-4 py-4 font-medium text-slate-800">{user.email}</td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <input value={editingRole} onChange={(event) => setEditingRole(event.target.value)} disabled={isSaving} autoFocus className="w-full max-w-[220px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-500" />
                    ) : user.role || '-'}
                  </td>
                  <td className="px-4 py-4">{user.status}</td>
                  <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => saveRole(user)} disabled={isSaving} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{isSaving ? 'Saving...' : 'Save'}</button>
                        <button type="button" onClick={cancelEdit} disabled={isSaving} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50">Cancel</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => startEdit(user)} title="Edit role" aria-label="Edit role" className="text-[20px] text-slate-600 hover:text-slate-900">✎</button>
                    )}
                  </td>
                </tr>
              )
            })}
            {users.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No users found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddUserModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('ACCOUNTANT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedRole = role.trim()

    if (!trimmedEmail || !trimmedRole) {
      setError('Email and role are required.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await inviteMember({ email: trimmedEmail, role: trimmedRole })
      const invitedUser = response?.data || response
      onSuccess(normalizeMember({
        ...invitedUser,
        email: invitedUser?.email || trimmedEmail,
        role: invitedUser?.role || trimmedRole,
        status: invitedUser?.status || 'Invited',
        createdAt: invitedUser?.createdAt || new Date().toISOString(),
      }, Date.now()))
      onClose()
    } catch (submitError) {
      setError(submitError?.message || 'Failed to invite user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <div><h2 className="text-xl font-bold text-slate-800">Add User</h2><p className="mt-1 text-sm text-slate-500">Invite a user to your organization</p></div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-slate-400">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-semibold text-slate-700">Email Address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} disabled={loading} placeholder="user@example.com" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-slate-500 disabled:bg-slate-100" /></label>
          <label className="block text-sm font-semibold text-slate-700">Type<input value={role} onChange={(event) => setRole(event.target.value)} disabled={loading} placeholder="ACCOUNTANT" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-slate-500 disabled:bg-slate-100" /></label>
          {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} disabled={loading} className="rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">Cancel</button><button type="submit" disabled={loading} className="rounded-[10px] bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? 'Inviting...' : 'Invite User'}</button></div>
        </form>
      </div>
    </div>
  )
}

function AllUsersPage() {
  const [users, setUsers] = useState([])
  const [showAddUser, setShowAddUser] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    fetchMembers()
      .then((response) => {
        if (mounted) setUsers(extractMembers(response).map(normalizeMember))
      })
      .catch((loadError) => {
        if (mounted) setError(loadError?.message || 'Failed to load users.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  const updateRole = (id, role) => {
    setUsers((current) => current.map((user) => user.id === id ? { ...user, role } : user))
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">
      <div className="rounded-[14px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-800">All Users</h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="text-[14px] text-slate-600">Total Users- <strong className="font-bold text-slate-800">{users.length}</strong></div><button type="button" onClick={() => setShowAddUser(true)} className="rounded-[10px] bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white">+ Add User</button></div>
        </div>
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {loading ? <div className="rounded-[12px] border border-slate-200 bg-[#f5f5f5] px-4 py-10 text-center text-sm text-slate-500">Loading users...</div> : <UsersTable users={users} onRoleChange={updateRole} />}
      </div>
      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onSuccess={(user) => setUsers((current) => [...current, user])} />}
    </div>
  )
}

export default AllUsersPage
