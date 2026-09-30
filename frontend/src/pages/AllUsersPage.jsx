import { useEffect, useState } from "react";
import {
  deleteMember,
  extractMembers,
  fetchMembers,
  inviteMember,
  normalizeMember,
  updateMemberRole,
  updateMemberSuspension,
  updateMemberSchedule,
} from "../services/membersApi";
import useAuthStore from "../store/authStore";
import { navItems, submenuItems } from "../routes/navigation";
import { updateMemberModules } from "../services/membersApi";
import {
  Edit,
  LockKeyhole,
  Trash2,
  Clock,
  Calendar,
  Save,
  Clock3,
  Play,
  Pause,
  X,
  CreditCard,
  UsersRound,
  ReceiptText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import ManageAccessModal from "./Manageaccessmodal";
import ScheduleManagementModal from "./ScheduleManagementModal";
import {
  createSeatOrder,
  verifySeatPayment,
} from "../services/paymentApi";

const ROLE_OPTIONS = [
  {
    value: "VIEWER",
    label: "View Only",
  },
  {
    value: "ACCOUNTANT",
    label: "View & Create",
  },
  {
    value: "ADMIN",
    label: "Admin Access",
  },
];

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
}

/* ============================================================
   USERS TABLE
============================================================ */

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
                      <select
                        value={editingRole}
                        onChange={(event) => setEditingRole(event.target.value)}
                        disabled={isSaving}
                        autoFocus
                        className="
                          w-full
                          max-w-[220px]
                          rounded-md
                          border border-slate-300
                          bg-white
                          px-3 py-2
                          text-sm
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
                          <option
                            key={roleOption.value}
                            value={roleOption.value}
                          >
                            {roleOption.label}
                          </option>
                        ))}
                      </select>
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
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${user.isSuspended
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

function BuyUserModal({
  accessToken,
  user,
  currentUserCount,
  onClose,
  onPaymentSuccess,
}) {
  const [step, setStep] = useState("select");
  const [seatsToAdd, setSeatsToAdd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  // Current/additional-seat pricing shown before the API call.
  // The backend response remains the source of truth after order creation.
  const seatRate = 3000;
  const gstPercent = 18;

  const subtotal = seatRate * seatsToAdd;
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const estimatedTotal = subtotal + gstAmount;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

 const createOrder = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await createSeatOrder({
      accessToken,
      seats: seatsToAdd,
    });

    console.log("Seat order created:", response);

    setOrderData(response);
    setStep("details");
  } catch (orderError) {
    console.error(
      "Seat order creation failed:",
      orderError,
    );

    setError(
      orderError?.message ||
        "Unable to create seat order.",
    );
  } finally {
    setLoading(false);
  }
};

  const changeSeats = () => {
    if (paymentLoading) return;

    setStep("select");
    setOrderData(null);
    setError("");
    setPaymentSuccess(false);
  };

  const loadRazorpay = async () => {
    if (window.Razorpay) return;

    await new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", resolve, {
          once: true,
        });
        existingScript.addEventListener("error", reject, {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = resolve;
      script.onerror = () =>
        reject(
          new Error(
            "Unable to load Razorpay checkout.",
          ),
        );

      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    const data = orderData?.data || orderData;

    if (!data?.orderId || !data?.keyId) {
      setError(
        "Payment details are missing from the seat order response.",
      );
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout is unavailable.",
        );
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: Number(data.amount || 0),
        currency: data.currency || "INR",
        name: "CtrlBooks",
        description: `${Number(data?.breakdown?.seatsToAdd || seatsToAdd)
          } additional user seat${Number(data?.breakdown?.seatsToAdd || seatsToAdd) === 1
            ? ""
            : "s"
          }`,
        order_id: data.orderId,

        prefill: {
          email:
            user?.email ||
            user?.user?.email ||
            "",
        },

        theme: {
          color: "#10b981",
        },

       handler: async (paymentResponse) => {
  try {
    setPaymentLoading(true);
    setError("");

    await verifySeatPayment({
      accessToken,

      razorpay_order_id:
        paymentResponse.razorpay_order_id,

      razorpay_payment_id:
        paymentResponse.razorpay_payment_id,

      razorpay_signature:
        paymentResponse.razorpay_signature,
    });

    setPaymentSuccess(true);

    await onPaymentSuccess?.();
  } catch (verifyError) {
    console.error(
      "Seat payment verification failed:",
      verifyError,
    );

    setError(
      verifyError?.message ||
        "Payment verification failed.",
    );
  } finally {
    setPaymentLoading(false);
  }
},

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (razorpayError) {
      console.error(
        "Razorpay error:",
        razorpayError,
      );

      setError(
        razorpayError?.message ||
        "Unable to open the payment window. Please try again.",
      );

      setPaymentLoading(false);
    }
  };

  const data = orderData?.data || orderData;
  const breakdown = data?.breakdown || {};

  const backendSeatCount = Number(
    breakdown.seatsToAdd ?? seatsToAdd,
  );

  const backendPerSeatRate = Number(
    breakdown.perSeatRate ?? seatRate,
  );

  const backendSubtotal = Number(
    breakdown.subtotal ?? backendPerSeatRate * backendSeatCount,
  );

  const backendGstPercent = Number(
    breakdown.gstPercent ?? gstPercent,
  );

  const backendGstAmount = Number(
    breakdown.gstAmount ??
    Math.round(
      (backendSubtotal * backendGstPercent) / 100,
    ),
  );

  const backendTotalAmount = Number(
    breakdown.totalAmount ??
    (data?.amount
      ? Number(data.amount) / 100
      : backendSubtotal + backendGstAmount),
  );

  const renderStepIndicator = () => (
    <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 md:px-6">
      <div className="flex items-center">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === "select"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-600 text-white"
              }`}
          >
            {step === "details" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              "1"
            )}
          </span>

          <span
            className={`text-xs font-semibold ${step === "select"
                ? "text-emerald-700"
                : "text-slate-500"
              }`}
          >
            Select seats
          </span>
        </div>

        <div className="mx-3 h-px flex-1 bg-slate-200" />

        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === "details"
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 text-slate-500"
              }`}
          >
            2
          </span>

          <span
            className={`text-xs font-semibold ${step === "details"
                ? "text-emerald-700"
                : "text-slate-400"
              }`}
          >
            Order details
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !paymentLoading
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between px-5 py-4 md:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UsersRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Buy Additional Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {step === "select"
                  ? "Choose how many additional user seats you want to add."
                  : "Review your seat order before payment."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={paymentLoading}
            aria-label="Close buy user modal"
            className="ml-3 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {renderStepIndicator()}

        <div className="space-y-5 p-5 md:p-6">
          {/* =====================================================
              STEP 1: SELECT SEATS
              ===================================================== */}
          {step === "select" && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-800">
                  Number of additional users
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  These seats will be added to your current
                  subscription.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSeatsToAdd((value) =>
                        Math.max(1, value - 1),
                      )
                    }
                    disabled={
                      loading ||
                      paymentLoading ||
                      seatsToAdd <= 1
                    }
                    aria-label="Decrease seats"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    −
                  </button>

                  <div className="flex h-14 min-w-[112px] items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-5 text-2xl font-bold text-slate-800">
                    {seatsToAdd}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSeatsToAdd((value) => value + 1)
                    }
                    disabled={loading || paymentLoading}
                    aria-label="Increase seats"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-slate-500">
                  {seatsToAdd} additional{" "}
                  {seatsToAdd === 1 ? "seat" : "seats"} selected
                </p>
              </div>

              {/* ESTIMATE */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-emerald-600" />

                  <p className="text-sm font-semibold text-emerald-800">
                    Estimated amount
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700">
                      {formatCurrency(seatRate)} ×{" "}
                      {seatsToAdd}{" "}
                      {seatsToAdd === 1 ? "seat" : "seats"}
                    </span>

                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-700">
                      GST ({gstPercent}%)
                    </span>

                    <span className="font-semibold text-emerald-900">
                      {formatCurrency(gstAmount)}
                    </span>
                  </div>

                  <div className="border-t border-emerald-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-900">
                        Estimated total
                      </span>

                      <span className="text-xl font-bold text-emerald-700">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  <p className="text-sm font-semibold text-red-700">
                    Unable to create seat order
                  </p>

                  <p className="mt-1 break-words text-sm text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createOrder}
                  disabled={loading || seatsToAdd < 1}
                  className="rounded-[10px] bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating Order..." : "Continue"}
                </button>
              </div>
            </>
          )}

          {/* =====================================================
              STEP 2: ORDER DETAILS
              ===================================================== */}
          {step === "details" && orderData && (
            <>
              <div
                className={`rounded-xl border p-4 ${paymentSuccess
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-emerald-100 bg-emerald-50"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {paymentSuccess ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <UsersRound className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      {paymentSuccess
                        ? "Payment successful"
                        : "Seat order created successfully"}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      {paymentSuccess
                        ? "Your additional user seats have been added."
                        : "Review the order details below before payment."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="grid grid-cols-1 divide-y divide-slate-200 text-sm sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all font-semibold text-slate-800">
                      {data?.orderId || "-"}
                    </p>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Currency
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {data?.currency || "INR"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <ReceiptText className="h-4 w-4 text-emerald-600" />
                    Payment summary
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Price per user
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendPerSeatRate,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Users to add
                      </span>

                      <span className="font-semibold text-slate-800">
                        {backendSeatCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendSubtotal,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        GST ({backendGstPercent}%)
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatCurrency(
                          backendGstAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-800">
                        Total amount
                      </span>

                      <span className="text-xl font-bold text-emerald-700">
                        {formatCurrency(
                          backendTotalAmount,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={changeSeats}
                  disabled={
                    paymentLoading ||
                    paymentSuccess
                  }
                  className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Change seats
                </button>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={paymentLoading}
                    className="rounded-[10px] border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paymentSuccess
                      ? "Done"
                      : "Close"}
                  </button>

                  {!paymentSuccess && (
                    <button
                      type="button"
                      onClick={openRazorpay}
                      disabled={
                        paymentLoading ||
                        !data?.orderId ||
                        !data?.keyId
                      }
                      className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-[10px] bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Pay{" "}
                          {formatCurrency(
                            backendTotalAmount,
                          )}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AllUsersPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const authUser = useAuthStore((state) => state.user);

  const [users, setUsers] = useState([]);

  const [usersToken, setUsersToken] = useState(null);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showBuyUser, setShowBuyUser] = useState(false);

  const [loading, setLoading] = useState(() => Boolean(accessToken));

  const [accessModalUser, setAccessModalUser] = useState(null);
  const [scheduleModalUser, setScheduleModalUser] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    if (!accessToken) {
      return () => {
        mounted = false;
      };
    }

    setLoading(true);

    fetchMembers(accessToken)
      .then((response) => {
        if (!mounted) return;

        setUsers(extractMembers(response).map(normalizeMember));

        setUsersToken(accessToken);

        setError("");
      })
      .catch((loadError) => {
        if (!mounted) return;

        setUsersToken(accessToken);

        setError(loadError?.message || "Failed to load users.");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const updateRole = (id, role) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
            ...user,
            role,
          }
          : user,
      ),
    );
  };

  const updateAllowedModules = (id, allowedModules) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, allowedModules } : user,
      ),
    );
  };

  const handleToggleSuspend = async (user) => {
    try {
      await updateMemberSuspension({
        accessToken,
        id: user.id,
        isSuspended: !user.isSuspended,
      });
      setUsers((current) =>
        current.map((u) =>
          u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle suspension", err);
    }
  };

  const updateLoginSchedule = (id, loginSchedule) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, loginSchedule } : user,
      ),
    );
  };

  const removeUserFromList = (id) => {
    setUsers((current) => current.filter((user) => user.id !== id));
  };

  const visibleUsers = usersToken === accessToken ? users : [];

  const visibleError = usersToken === accessToken ? error : "";

  const isLoadingUsers =
    loading || Boolean(accessToken && usersToken !== accessToken);

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
              onClick={() => setShowAddUser(true)}
              className="
                rounded-[10px]
                bg-slate-900
                px-4 py-2
                text-[14px]
                font-semibold
                text-white
                transition
                hover:bg-slate-800
              "
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
            onRoleChange={updateRole}
            onDelete={removeUserFromList}
            onManageAccess={setAccessModalUser}
            onToggleSuspend={handleToggleSuspend}
            onManageSchedule={setScheduleModalUser}
          />
        )}
      </div>

      {/* ADD USER MODAL */}
      {showAddUser && (
        <AddUserModal
          accessToken={accessToken}
          onClose={() => setShowAddUser(false)}
          onSuccess={(user) => setUsers((current) => [...current, user])}
          onBuyUser={() => setShowBuyUser(true)}
        />
      )}

      {accessModalUser && (
        <ManageAccessModal
          user={accessModalUser}
          accessToken={accessToken}
          onClose={() => setAccessModalUser(null)}
          onSuccess={updateAllowedModules}
        />
      )}

      {scheduleModalUser && (
        <ScheduleManagementModal
          user={scheduleModalUser}
          accessToken={accessToken}
          onClose={() => setScheduleModalUser(null)}
          onSuccess={updateLoginSchedule}
        />
      )}

      {showBuyUser && (
        <BuyUserModal
          accessToken={accessToken}
          user={authUser}
          currentUserCount={visibleUsers.length}
          onClose={() => setShowBuyUser(false)}
          onPaymentSuccess={async () => {
            try {
              const response = await fetchMembers(accessToken);
              setUsers(extractMembers(response).map(normalizeMember));
              setUsersToken(accessToken);
            } catch (refreshError) {
              console.error("Failed to refresh users after payment", refreshError);
            }
          }}
        />
      )}
    </div>
  );
}

export default AllUsersPage;
