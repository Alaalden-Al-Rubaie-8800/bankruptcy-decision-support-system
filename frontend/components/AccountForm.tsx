"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";


type UserAccount = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
};


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


export default function AccountForm() {
  const [user, setUser] =
    useState<UserAccount | null>(null);

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {
    async function loadAccount() {
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

        const data =
          await response.json();

        if (!response.ok) {
          setError(
            data.detail ??
              "Unable to load account information."
          );
          return;
        }

        setUser(data);
        setFullName(
          data.full_name
        );
        setEmail(
          data.email
        );

      } catch {
        setError(
          "An unexpected error occurred while loading account information."
        );

      } finally {
        setLoading(false);
      }
    }

    void loadAccount();
  }, []);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError(
        "Please enter your full name."
      );
      return;
    }

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (
      password &&
      password.length < 8
    ) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    setSaving(true);

    const body: {
      full_name: string;
      email: string;
      password?: string;
    } = {
      full_name:
        fullName.trim(),

      email:
        email.trim(),
    };


    if (password) {
      body.password =
        password;
    }


    try {
      const response =
        await fetch(
          "/api/account/me",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                body
              ),
          }
        );


      if (
        response.status === 401
      ) {
        window.location.href =
          "/login";

        return;
      }


      const data =
        await response.json();


      if (!response.ok) {
        setError(
          data.detail ??
            "Unable to update account information."
        );

        return;
      }


      setUser(data);

      setFullName(
        data.full_name
      );

      setEmail(
        data.email
      );

      setPassword("");
      setConfirmPassword("");

      setSuccess(
        "Account information updated successfully."
      );

    } catch {
      setError(
        "An unexpected error occurred while updating your account."
      );

    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="flex min-h-48 flex-col items-center justify-center text-center">

          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-900" />

          <h2 className="text-lg font-bold text-slate-900">
            Loading Account Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while your account details are loaded.
          </p>

        </div>

      </section>
    );
  }


  if (!user) {
    return (
      <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <div className="rounded-2xl bg-red-50 p-4 text-red-700">

          <h2 className="font-bold text-red-900">
            Unable to Load Account
          </h2>

          <p className="mt-1 text-sm">
            {error ||
              "Account information could not be loaded."}
          </p>

        </div>

      </section>
    );
  }


  return (
    <div className="mx-auto max-w-5xl space-y-3">

      {/* Page Header */}
      <section>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          My Account
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account information and security settings.
        </p>

      </section>


      {/* Account Overview */}
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {/* User ID */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            User ID
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            #{user.id}
          </p>

        </div>


        {/* Role */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Role
          </p>

          <div className="mt-1.5">

            <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
              {formatRole(
                user.role
              )}
            </span>

          </div>

        </div>


        {/* Status */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account Status
          </p>

          <div className="mt-1.5">

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                user.is_active
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
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

          </div>

        </div>


        {/* Created Date */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Created Date
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatDate(
              user.created_at
            )}
          </p>

        </div>

      </section>


      {/* Main Settings Card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Profile */}
          <div>

            <h2 className="text-xl font-bold text-slate-950">
              Profile Settings
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              Update your personal account information.
            </p>

          </div>


          <div className="grid gap-4 md:grid-cols-2">

            {/* Full Name */}
            <div>

              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Full Name
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(
                    event.target.value
                  )
                }
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                required
              />

            </div>


            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Email Address
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email address"
                dir="ltr"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                required
              />

            </div>

          </div>


          {/* Security */}
          <div className="border-t border-slate-200 pt-4">

            <h3 className="text-base font-bold text-slate-950">
              Security
            </h3>

            <p className="mt-0.5 text-sm text-slate-500">
              Leave both password fields empty if you do not want to change your password.
            </p>


            <div className="mt-3 grid gap-4 md:grid-cols-2">

              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  New Password
                </label>


                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-12 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 3 18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A9.8 9.8 0 0 1 12 4c5.5 0 9.5 4.5 10 8a11.7 11.7 0 0 1-2.1 4.3" />
                        <path d="M6.6 6.6C4.4 8 2.7 10 2 12c.8 3.5 4.5 8 10 8a10 10 0 0 0 4-.8" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    )}

                  </button>

                </div>


                <p className="mt-1 text-xs text-slate-400">
                  Minimum 8 characters
                </p>

              </div>


              {/* Confirm Password */}
              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Confirm New Password
                </label>


                <div className="relative">

                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    placeholder="Re-enter new password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-12 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showConfirmPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m3 3 18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A9.8 9.8 0 0 1 12 4c5.5 0 9.5 4.5 10 8a11.7 11.7 0 0 1-2.1 4.3" />
                        <path d="M6.6 6.6C4.4 8 2.7 10 2 12c.8 3.5 4.5 8 10 8a10 10 0 0 0 4-.8" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />
                      </svg>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">

              <span className="font-bold">
                !
              </span>

              <span className="font-medium">
                {error}
              </span>

            </div>
          )}


          {/* Success */}
          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">

              <span className="font-bold">
                ✓
              </span>

              <span className="font-medium">
                {success}
              </span>

            </div>
          )}


          {/* Save */}
          <div className="flex justify-end border-t border-slate-200 pt-3">

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-w-40 items-center justify-center rounded-xl bg-sky-950 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}