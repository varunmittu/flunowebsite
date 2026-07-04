"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LockKeyhole, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  const linkInvalid = !token || !email;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/auth/reset", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-fig-navy flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[20%] w-[350px] h-[350px] rounded-full bg-fig-terracotta/10 blur-[110px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[280px] h-[280px] rounded-full bg-fig-terracotta/8 blur-[90px]" />
      </div>

      <div className="reveal relative w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.08] p-8 sm:p-10" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={24} className="text-green-400" />
              </div>
              <h1 className="font-fig font-bold text-xl text-white font-semibold mb-2">Password updated!</h1>
              <p className="font-fig-body text-sm text-white/45 mb-6">Redirecting you to login…</p>
              <Link href="/login" className="font-fig-body text-xs text-fig-terracotta hover:underline">Go to login now</Link>
            </div>
          ) : linkInvalid ? (
            <div className="text-center py-4">
              <h1 className="font-fig font-bold text-xl text-white font-semibold mb-2">Invalid link</h1>
              <p className="font-fig-body text-sm text-white/45 mb-6">
                This password-reset link is incomplete. Please use the link from your email, or request a new one.
              </p>
              <Link href="/forgot-password" className="font-fig-body text-xs text-fig-terracotta hover:underline">Request a new link</Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-fig-terracotta/15 border border-fig-terracotta/25 flex items-center justify-center mb-5">
                <LockKeyhole size={20} className="text-fig-terracotta" />
              </div>
              <h1 className="font-fig font-bold text-xl text-white font-semibold mb-1.5">Choose a new password</h1>
              <p className="font-fig-body text-sm text-white/40 mb-7">For {email}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 font-fig-body text-sm text-red-400">
                    {error}
                  </p>
                )}
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="New password (min 6 characters)"
                    className="fig-input-dark pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  className="fig-input-dark"
                />
                <button
                  type="submit"
                  disabled={loading || !password || !confirm}
                  className="fig-btn w-full justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-fig-navy" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
