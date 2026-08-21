"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";


type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};


type ConfirmAction =
  | {
      type: "delete";
      user: AdminUser;
    }
  | {
      type: "status";
      user: AdminUser;
    }
  | null;


function formatRole(role: string) {
  if (role === "admin") {
    return "Administrator";
  }

  if (role === "financial_user") {
    return "Financial User";
  }

  return role;
}


function formatDate(date: string) {
  return new Date(date).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}


function roleBadgeClass(role: string) {
  if (role === "admin") {
    return "inline-flex whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800";
  }

  return "inline-flex whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700";
}


function statusBadgeClass(
  isActive: boolean
) {
  return isActive
    ? "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
    : "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700";
}


export default function AdminUsersTable() {
  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [
    currentUserId,
    setCurrentUserId,
  ] = useState<number | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [
    workingId,
    setWorkingId,
  ] = useState<number | null>(
    null
  );

  const [
    confirmAction,
    setConfirmAction,
  ] = useState<ConfirmAction>(
    null
  );

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  async function loadCurrentUser() {
    try {
      const response = await fetch(
        "/api/account/me",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href =
          "/login";
        return;
      }

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setCurrentUserId(
        data.id
      );

    } catch {
      // Do not block the admin panel.
    }
  }


  async function loadUsers() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href =
          "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href =
          "/dashboard";
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "Unable to load users."
        );
        return;
      }

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch {
      setError(
        "An unexpected error occurred while loading users."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    void Promise.all([
      loadCurrentUser(),
      loadUsers(),
    ]);
  }, []);


  const stats = useMemo(() => {
    const administrators =
      users.filter(
        (user) =>
          user.role === "admin"
      ).length;

    const financialUsers =
      users.filter(
        (user) =>
          user.role ===
          "financial_user"
      ).length;

    const activeUsers =
      users.filter(
        (user) =>
          user.is_active
      ).length;

    return {
      total: users.length,
      administrators,
      financialUsers,
      activeUsers,
    };
  }, [users]);


  async function toggleUserStatus(
    user: AdminUser
  ) {
    if (
      user.id ===
      currentUserId
    ) {
      setError(
        "You cannot change the status of your current administrator account."
      );
      setSuccess("");
      return;
    }

    setWorkingId(
      user.id
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/users/${user.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              is_active:
                !user.is_active,
            }),
          }
        );

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";
        return;
      }

      if (
        response.status === 403
      ) {
        window.location.href =
          "/dashboard";
        return;
      }

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.detail ??
            "Unable to update user status."
        );
        return;
      }

      setUsers(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              user.id
                ? data
                : item
          )
      );

      setSuccess(
        data.is_active
          ? "User account activated successfully."
          : "User account deactivated successfully."
      );

      setConfirmAction(
        null
      );

    } catch {
      setError(
        "An unexpected error occurred while updating the user status."
      );

    } finally {
      setWorkingId(null);
    }
  }


  async function deleteUser(
    user: AdminUser
  ) {
    if (
      user.id ===
      currentUserId
    ) {
      setError(
        "You cannot delete your current administrator account."
      );
      setSuccess("");
      return;
    }

    setWorkingId(
      user.id
    );

    setError("");
    setSuccess("");

    try {
      const response =
        await fetch(
          `/api/admin/users/${user.id}`,
          {
            method: "DELETE",
          }
        );

      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";
        return;
      }

      if (
        response.status === 403
      ) {
        window.location.href =
          "/dashboard";
        return;
      }

      if (!response.ok) {
        let message =
          "Unable to delete user.";

        try {
          const data =
            await response.json();

          message =
            data.detail ??
            message;

        } catch {
          // No JSON response body.
        }

        setError(
          message
        );
        return;
      }

      setUsers(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              user.id
          )
      );

      setSuccess(
        "User deleted successfully."
      );

      setConfirmAction(
        null
      );

    } catch {
      setError(
        "An unexpected error occurred while deleting the user."
      );

    } finally {
      setWorkingId(null);
    }
  }


  async function executeConfirmedAction() {
    if (!confirmAction) {
      return;
    }

    if (
      confirmAction.type ===
      "delete"
    ) {
      await deleteUser(
        confirmAction.user
      );
      return;
    }

    await toggleUserStatus(
      confirmAction.user
    );
  }


  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-56 flex-col items-center justify-center text-center">

          <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-sky-900" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Users
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while registered users are loaded.
          </p>

        </div>

      </section>
    );
  }


  return (
    <>
      <div className="space-y-5">

        {/* Page Header */}
        <section>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Admin Panel
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Manage system users, roles, and account access.
          </p>

        </section>


        {/* Statistics */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-950">
              {stats.total}
            </p>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Administrators
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-950">
              {stats.administrators}
            </p>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Financial Users
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-950">
              {stats.financialUsers}
            </p>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Accounts
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-700">
              {stats.activeUsers}
            </p>
          </div>

        </section>


        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

            <span className="font-bold">
              !
            </span>

            <span className="font-medium">
              {error}
            </span>

          </div>
        )}


        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

            <span className="font-bold">
              ✓
            </span>

            <span className="font-medium">
              {success}
            </span>

          </div>
        )}


        {/* User Management */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">

            <div>
              <h2 className="text-lg font-bold text-slate-950">
                User Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review registered users and manage account access.
              </p>
            </div>


            <button
              type="button"
              onClick={() => {
                void loadUsers();
              }}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
              </svg>

              Refresh
            </button>

          </div>


          {!users.length ? (

            <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">

              <h3 className="font-bold text-slate-900">
                No Users Found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No registered user accounts are currently available.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px] border-collapse table-fixed">

                <thead>

                  <tr className="border-b border-slate-200 bg-slate-50/80">

                    <th className="w-[20%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Name
                    </th>

                    <th className="w-[22%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </th>

                    <th className="w-[13%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="w-[10%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="w-[17%] px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Created Date
                    </th>

                    <th className="w-[18%] px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-100">

                  {users.map(
                    (user) => {
                      const isCurrentUser =
                        user.id ===
                        currentUserId;

                      const isWorking =
                        workingId ===
                        user.id;

                      return (
                        <tr
                          key={user.id}
                          className="transition hover:bg-slate-50/70"
                        >

                          {/* Name */}
                          <td className="px-5 py-4 align-middle">

                            <div className="font-semibold leading-5 text-slate-900">
                              {user.full_name}
                            </div>


                            {isCurrentUser && (
                              <span className="mt-1.5 inline-flex whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">
                                Current User
                              </span>
                            )}

                          </td>


                          {/* Email */}
                          <td
                            className="overflow-hidden text-ellipsis whitespace-nowrap px-5 py-4 align-middle text-sm text-slate-700"
                            dir="ltr"
                            title={user.email}
                          >
                            {user.email}
                          </td>


                          {/* Role */}
                          <td className="whitespace-nowrap px-5 py-4 align-middle">

                            <span
                              className={roleBadgeClass(
                                user.role
                              )}
                            >
                              {formatRole(
                                user.role
                              )}
                            </span>

                          </td>


                          {/* Status */}
                          <td className="whitespace-nowrap px-5 py-4 align-middle">

                            <span
                              className={statusBadgeClass(
                                user.is_active
                              )}
                            >

                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  user.is_active
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />

                              {user.is_active
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>


                          {/* Date */}
                          <td className="whitespace-nowrap px-5 py-4 align-middle text-sm font-medium text-slate-700">

                            {formatDate(
                              user.created_at
                            )}

                          </td>


                          {/* Actions */}
                          <td className="whitespace-nowrap px-5 py-4 align-middle">

                            {isCurrentUser ? (

                              <div className="text-right">

                                <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                                  Protected account
                                </span>

                              </div>

                            ) : (

                              <div className="flex flex-nowrap justify-end gap-2">

                                <button
                                  type="button"
                                  disabled={
                                    isWorking
                                  }
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "status",
                                      user,
                                    })
                                  }
                                  className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    user.is_active
                                      ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  }`}
                                >

                                  {isWorking
                                    ? "Working..."
                                    : user.is_active
                                      ? "Deactivate"
                                      : "Activate"}

                                </button>


                                <button
                                  type="button"
                                  disabled={
                                    isWorking
                                  }
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "delete",
                                      user,
                                    })
                                  }
                                  className="whitespace-nowrap rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Delete
                                </button>

                              </div>

                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>


      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  confirmAction.type ===
                  "delete"
                    ? "bg-red-50 text-red-600"
                    : confirmAction.user
                        .is_active
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                }`}
              >

                {confirmAction.type ===
                "delete" ? (

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                  </svg>

                ) : (

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2v10" />
                    <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
                  </svg>

                )}

              </div>


              <div className="flex-1">

                <h2 className="text-lg font-bold text-slate-950">

                  {confirmAction.type ===
                  "delete"
                    ? "Delete User?"
                    : confirmAction.user
                        .is_active
                      ? "Deactivate User?"
                      : "Activate User?"}

                </h2>


                <p className="mt-2 text-sm leading-6 text-slate-500">

                  {confirmAction.type ===
                  "delete" ? (
                    <>
                      You are about to permanently delete{" "}
                      <span className="font-semibold text-slate-800">
                        {
                          confirmAction
                            .user
                            .full_name
                        }
                      </span>
                      . This action cannot be undone.
                    </>

                  ) : confirmAction.user
                      .is_active ? (
                    <>
                      This will deactivate{" "}
                      <span className="font-semibold text-slate-800">
                        {
                          confirmAction
                            .user
                            .full_name
                        }
                      </span>
                      {" "}and prevent account access until reactivated.
                    </>

                  ) : (
                    <>
                      This will reactivate{" "}
                      <span className="font-semibold text-slate-800">
                        {
                          confirmAction
                            .user
                            .full_name
                        }
                      </span>
                      {" "}and restore account access.
                    </>
                  )}

                </p>

              </div>

            </div>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                disabled={
                  workingId !==
                  null
                }
                onClick={() =>
                  setConfirmAction(
                    null
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>


              <button
                type="button"
                disabled={
                  workingId !==
                  null
                }
                onClick={() =>
                  void executeConfirmedAction()
                }
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmAction.type ===
                  "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : confirmAction.user
                        .is_active
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >

                {workingId !== null
                  ? "Processing..."
                  : confirmAction.type ===
                      "delete"
                    ? "Delete User"
                    : confirmAction.user
                        .is_active
                      ? "Deactivate"
                      : "Activate"}

              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}