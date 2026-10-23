import { useState } from "react";
import { Edit, LockKeyhole, Trash2, Clock3, Play, Pause } from "lucide-react";
import { deleteMember, updateMemberRole } from "../../services/membersApi";
import { ROLE_OPTIONS } from "./memberUi";
import { formatDate } from "./memberUi";
import { SearchableDropdown } from "../../components/SearchableDropdown";
function UsersTable({
  users,
  accessToken,
  onRoleChange,
  onDelete,
  onManageAccess,
  onToggleSuspend,
  onManageSchedule,
}) {
  const [editingId, setEditingId] = useState(null);

  const [editingRole, setEditingRole] = useState("");

  const [savingId, setSavingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  const removeUser = async (user) => {
    if (!user.hasPersistedId) {
      setError("This member has no database ID and cannot be removed.");
      return;
    }

    if (!window.confirm(`Remove ${user.email}?`)) {
      return;
    }

    try {
      setDeletingId(user.id);
      setError("");

      await deleteMember(accessToken, user.id);

      onDelete(user.id);
    } catch (deleteError) {
      setError(deleteError?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingRole("");
    setError("");
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setEditingRole(user.role || "ACCOUNTANT");
    setError("");
  };

  const saveRole = async (user) => {
    if (!user.hasPersistedId) {
      setError("This member has no database ID and cannot be updated.");
      return;
    }

    const role = editingRole.trim();

    if (!role) {
      setError("Role cannot be empty.");
      return;
    }

    if (role === user.role) {
      cancelEdit();
      return;
    }

    try {
      setSavingId(user.id);
      setError("");

      await updateMemberRole({
        accessToken,
        id: user.id,
        role,
      });

      onRoleChange(user.id, role);

      cancelEdit();
    } catch (saveError) {
      setError(saveError?.message || "Failed to update role.");
    } finally {
      setSavingId(null);
    }
  };

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
              <th className="whitespace-nowrap px-4 py-3">Email</th>

              <th className="whitespace-nowrap px-4 py-3">Role</th>

              <th className="whitespace-nowrap px-4 py-3">Status</th>

              <th className="whitespace-nowrap px-4 py-3">Created At</th>

              <th className="w-[180px] whitespace-nowrap px-4 pr-8 py-3 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-[#f5f5f5] text-[14px] text-slate-700">
            {users.map((user) => {
              const isEditing = editingId === user.id;

              const isSaving = savingId === user.id;

              const isDeleting = deletingId === user.id;

              return (
                <tr key={user.id} className="border-t border-slate-200">
                  {/* EMAIL */}
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {user.email}
                  </td>

                  {/* ROLE */}
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <div className="w-full max-w-[220px]">
                        <SearchableDropdown
                          name="role"
                          label="Role"
                          options={ROLE_OPTIONS.map((roleOption) => ({
                            name: roleOption.label,
                            value: roleOption.value,
                          }))}
                          value={
                            ROLE_OPTIONS.find(
                              (roleOption) => roleOption.value === editingRole,
                            )?.label || editingRole
                          }
                          placeholder="Select role"
                          disabled={isSaving}
                          onSelect={(selectedValue) => {
                            const selectedRole = ROLE_OPTIONS.find(
                              (roleOption) =>
                                roleOption.label === selectedValue ||
                                roleOption.value === selectedValue,
                            );

                            if (selectedRole) {
                              setEditingRole(selectedRole.value);
                            }
                          }}
                          onOptionSelect={(option) => {
                            setEditingRole(option.value);
                          }}
                        />
                      </div>
                    ) : user.role === "ADMIN" ? (
                      "Admin Access"
                    ) : user.role === "ACCOUNTANT" ? (
                      "View & Create"
                    ) : user.role === "VIEWER" ? (
                      "View Only"
                    ) : (
                      user.role || "-"
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    {user.isSuspended ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Suspended
                      </span>
                    ) : (
                      user.status || "-"
                    )}
                  </td>

                  {/* CREATED AT */}
                  <td className="px-4 py-4">{formatDate(user.createdAt)}</td>

                  {/* ACTION */}
                  <td className="w-[180px] px-4 py-4">
                    <div className="flex min-h-[32px] items-center justify-end gap-3">
                      {isEditing ? (
                        <>
                          {/* SAVE */}
                          <button
                            type="button"
                            onClick={() => saveRole(user)}
                            disabled={isSaving}
                            className="
                              rounded-md
                              bg-slate-900
                              px-3 py-2
                              text-xs
                              font-semibold
                              text-white
                              transition
                              hover:bg-slate-800
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>

                          {/* CANCEL */}
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="
                              rounded-md
                              border border-slate-300
                              bg-white
                              px-3 py-2
                              text-xs
                              font-semibold
                              text-slate-700
                              transition
                              hover:bg-slate-100
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(user)}
                            title="Edit role"
                            aria-label="Edit role"
                            className="
    flex
    h-8
    w-8
    items-center
    justify-center
    text-indigo-500
    transition
    hover:text-indigo-700
  "
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {user.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => onToggleSuspend(user)}
                              title={
                                user.isSuspended
                                  ? "Reactivate user"
                                  : "Suspend user"
                              }
                              aria-label={
                                user.isSuspended
                                  ? "Reactivate user"
                                  : "Suspend user"
                              }
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
                                user.isSuspended
                                  ? "border-green-200 bg-green-50 text-green-600 hover:border-green-300 hover:bg-green-100 hover:text-green-700"
                                  : "border-orange-200 bg-orange-50 text-orange-500 hover:border-orange-300 hover:bg-orange-100 hover:text-orange-600"
                              }`}
                            >
                              {user.isSuspended ? (
                                <Play className="h-4 w-4" strokeWidth={2.2} />
                              ) : (
                                <Pause className="h-4 w-4" strokeWidth={2.2} />
                              )}
                            </button>
                          )}

                          {/* SCHEDULE */}
                          {user.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => onManageSchedule(user)}
                              title="Manage login schedule"
                              aria-label="Manage login schedule"
                              className="
      flex h-8 w-8 items-center justify-center
      rounded-lg border border-slate-200
      bg-slate-50 text-slate-600
      transition-all duration-200
      hover:border-slate-300
      hover:bg-slate-100
      hover:text-slate-900
    "
                            >
                              <Clock3 className="h-4 w-4" strokeWidth={2.2} />
                            </button>
                          )}

                          {user.role !== "OWNER" && (
                            <button
                              type="button"
                              onClick={() => onManageAccess(user)}
                              title="Manage sidebar access"
                              aria-label="Manage sidebar access"
                              className="
      flex
      h-8
      w-8
      items-center
      justify-center
      text-yellow-500
      transition
      hover:text-yellow-700
    "
                            >
                              <LockKeyhole className="h-4 w-4" />
                            </button>
                          )}

                          {/* DELETE */}
                          <button
                            type="button"
                            onClick={() => removeUser(user)}
                            disabled={isDeleting}
                            title="Delete user"
                            aria-label="Delete user"
                            className="
    flex
    h-8
    w-8
    items-center
    justify-center
    text-red-500
    transition
    hover:text-red-700
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                          >
                            {isDeleting ? "…" : <Trash2 className="h-4 w-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
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
  );
}

/* ============================================================
   ADD USER MODAL
============================================================ */

export default UsersTable;
