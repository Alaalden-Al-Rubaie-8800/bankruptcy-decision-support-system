"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ?? "Invalid email address or password."
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your information and try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 md:p-9"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-sky-950 text-xl font-black text-white shadow-lg shadow-sky-950/15">
          BR
        </div>

        <p className="mb-2 text-xs font-bold tracking-wide text-sky-900">
          Bankruptcy Risk Prediction System
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Sign In
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
         
        </p>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label
          className="mb-2 block text-sm font-bold text-slate-800"
          htmlFor="email"
        >
          Email Address
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
              />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </div>

          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full rounded-2xl border border-slate-300
              bg-white py-3.5 pl-12 pr-4
              text-sm text-slate-900
              outline-none transition
              placeholder:text-slate-400
              hover:border-slate-400
              focus:border-sky-500
              focus:ring-4
              focus:ring-sky-100
            "
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-5">
        <label
          className="mb-2 block text-sm font-bold text-slate-800"
          htmlFor="password"
        >
          Password
        </label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </div>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full rounded-2xl border border-slate-300
              bg-white py-3.5 pl-12 pr-12
              text-sm text-slate-900
              outline-none transition
              placeholder:text-slate-400
              hover:border-slate-400
              focus:border-sky-500
              focus:ring-4
              focus:ring-sky-100
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="
              absolute inset-y-0 right-0
              flex items-center pr-4
              text-slate-400
              transition
              hover:text-sky-900
              focus:outline-none
            "
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 4.2A10.4 10.4 0 0 1 12 4c5.5 0 9.5 4 10 8a10.7 10.7 0 0 1-2.2 4.3" />
                <path d="M6.6 6.6A10.6 10.6 0 0 0 2 12c.5 4 4.5 8 10 8a10.3 10.3 0 0 0 5.4-1.5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 h-4 w-4 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>

          <span>{error}</span>
        </div>
      )}

      {/* Sign In Button */}
      <button
        className="
          flex w-full items-center justify-center gap-2
          rounded-2xl bg-sky-950
          px-4 py-3.5
          text-sm font-bold text-white
          shadow-lg shadow-sky-950/15
          transition
          hover:bg-sky-900
          focus:outline-none
          focus:ring-4
          focus:ring-sky-100
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        disabled={busy}
        type="submit"
      >
        {busy && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />

            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="opacity-90"
            />
          </svg>
        )}

        {busy ? "Signing in..." : "Sign In"}
      </button>

      {/* Register */}
      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-sky-900 transition hover:text-sky-700 hover:underline"
        >
          Create Account
        </Link>
      </div>
    </form>
  );
}