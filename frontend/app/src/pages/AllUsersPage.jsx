import { useState } from 'react'

const initialUsers = [
  { name: 'MAIN', type: 'MAIN', mobile: '7011022899', status: 'Admin', action: 'edit' },
]

function UsersTable() {
  const [users, setUsers] = useState(initialUsers)
  const [editingUser, setEditingUser] = useState(null)

  const handleSave = () => {
    setUsers((current) => current.map((user) => user.mobile === editingUser.mobile ? editingUser : user))
    setEditingUser(null)
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-slate-200 bg-slate-100">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#eef1f3] text-left text-[15px] font-semibold text-slate-700">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Mobile Number</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="bg-[#f5f5f5] text-[14px] text-slate-700">
          {users.map((user) => {
            const isEditing = editingUser?.mobile === user.mobile

            return (
              <tr key={user.mobile} className="border-t border-slate-200">
                <td className="px-4 py-4 font-medium text-slate-800">
                  {isEditing ? <input value={editingUser.name} onChange={(event) => setEditingUser((current) => ({ ...current, name: event.target.value }))} className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 outline-none" /> : user.name}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {isEditing ? <input value={editingUser.type} onChange={(event) => setEditingUser((current) => ({ ...current, type: event.target.value }))} className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 outline-none" /> : user.type}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {isEditing ? <input value={editingUser.mobile} onChange={(event) => setEditingUser((current) => ({ ...current, mobile: event.target.value }))} className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 outline-none" /> : user.mobile}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {isEditing ? <input value={editingUser.status} onChange={(event) => setEditingUser((current) => ({ ...current, status: event.target.value }))} className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-800 outline-none" /> : user.status}
                </td>
                <td className="px-4 py-4 text-right">
                  {isEditing ? (
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={handleSave} className="rounded bg-slate-900 px-3 py-1.5 text-[12px] font-semibold text-white">Save</button>
                      <button type="button" onClick={() => setEditingUser(null)} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700">Cancel</button>
                    </div>
                  ) : (
                    <button type="button" aria-label="Edit user" onClick={() => setEditingUser(user)} className="text-[20px] text-slate-600 transition hover:text-slate-900">
                      ✎
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function AllUsersPage() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">
      <div className="rounded-[14px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[26px] font-bold tracking-tight text-slate-800">All Users</h1>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="text-[14px] text-slate-600">
              <span>Total Purchased-</span>
              <strong className="font-bold text-slate-800">3 Users</strong>
              <span className="mx-2">•</span>
              <span>In Use-1 Users</span>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => window.history.pushState({}, '', '/add-user') || window.dispatchEvent(new PopStateEvent('popstate'))} className="rounded-[10px] border border-slate-800 bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition hover:bg-slate-800">
                + Add User
              </button>
              <button type="button" className="rounded-[10px] border border-slate-300 bg-white px-4 py-2 text-[14px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100">
                + Purchase User
              </button>
            </div>
          </div>
        </div>

        <UsersTable />

        <div className="mt-4 flex items-center justify-end gap-3">
          <div className="text-[14px] text-slate-500">1-1 of 1</div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous page" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-slate-600 shadow-sm hover:bg-slate-100">
              ‹
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1f2937] text-[15px] font-semibold text-white shadow-sm">
              1
            </button>
            <button type="button" aria-label="Next page" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-slate-600 shadow-sm hover:bg-slate-100">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUsersPage
