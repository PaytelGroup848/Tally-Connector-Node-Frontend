import { useState } from "react";
import { inviteMember, normalizeMember } from "../../services/membersApi";
import { ROLE_OPTIONS } from "./memberUi";

function AddUserModal({ accessToken, onClose, onSuccess, onBuyUser }) {
  const [email, setEmail] = useState("");

  const [role, setRole] = useState("ACCOUNTANT");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    const trimmedRole = role.trim();

    if (!trimmedEmail || !trimmedRole) {
      setError("Email and role are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await inviteMember({
        accessToken,
        email: trimmedEmail,
        role: trimmedRole,
      });

      const invitedUser = response?.data || response;

      onSuccess(
        normalizeMember(
          {
            ...invitedUser,

            email: invitedUser?.email || trimmedEmail,

            role: invitedUser?.role || trimmedRole,

            status: invitedUser?.status || "Invited",

            createdAt: invitedUser?.createdAt || new Date().toISOString(),
          },
          Date.now(),
        ),
      );

      onClose();
    } catch (submitError) {
      setError(submitError?.message || "Failed to invite user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* HEADER */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Add User</h2>

            <p className="mt-1 text-sm text-slate-500">
              Invite a user to your organization
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              text-2xl
              leading-none
              text-slate-400
              transition
              hover:text-slate-700
            "
          >
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <label className="block text-sm font-semibold text-slate-700">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              placeholder="user@example.com"
              className="
                mt-2
                w-full
                rounded-lg
                border border-slate-300
                px-3 py-2.5
                font-normal
                outline-none
                focus:border-slate-500
                focus:ring-2
                focus:ring-slate-200
                disabled:bg-slate-100
              "
            />
          </label>

          {/* ROLE */}
          <label className="block text-sm font-semibold text-slate-700">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              disabled={loading}
              className="
                mt-2
                w-full
                rounded-lg
                border border-slate-300
                bg-white
                px-3 py-2.5
                font-normal
                text-slate-800
                outline-none
                focus:border-slate-500
                focus:ring-2
                focus:ring-slate-200
                disabled:cursor-not-allowed
                disabled:bg-slate-100
                cursor-pointer
              "
            >
              {ROLE_OPTIONS.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </option>
              ))}
            </select>
          </label>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                {error === "Seat limit reached" || error.includes("Seat limit") ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBuyUser?.();
                    }}
                    className="shrink-0 rounded-md border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Buy User
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-[10px]
                border border-slate-300
                bg-white
                px-4 py-2
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-[10px]
                bg-slate-900
                px-4 py-2
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-slate-800
                disabled:opacity-50
              "
            >
              {loading ? "Inviting..." : "Invite User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================================================
   BUY USER / SEAT ORDER MODAL
   ============================================================ */

export default AddUserModal;
