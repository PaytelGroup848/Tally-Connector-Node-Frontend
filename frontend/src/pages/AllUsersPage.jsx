import { useEffect, useState } from "react";
import { fetchMembers, extractMembers, normalizeMember, updateMemberSuspension } from "../services/membersApi";
import useAuthStore from "../store/authStore";
import ManageAccessModal from "./Manageaccessmodal";
import ScheduleManagementModal from "./ScheduleManagementModal";
import UsersTable from "./AllUsers/UsersTable";
import AddUserModal from "./AllUsers/AddUserModal";
import BuyUserModal from "./AllUsers/BuyUserModal";

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
