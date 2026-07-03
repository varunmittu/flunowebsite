"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }
      setSent(true);
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

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/[0.08] p-8 sm:p-10" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center mx-auto mb-5">
                <MailCheck size={24} className="text-green-400" />
              </div>
              <h1 className="font-fig font-bold text-xl text-white font-semibold mb-2">Check your inbox</h1>
              <p className="font-fig-body text-sm text-white/45 leading-relaxed mb-6">
                If an account exists for <span className="text-white/70">{email}</span>, we&apos;ve sent a password-reset link. It expires in 1 hour.
              </p>
              <Link href="/login" className="font-fig-body text-xs text-fig-terracotta hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-fig-terracotta/15 border border-fig-terracotta/25 flex items-center justify-center mb-5">
                <KeyRound size={20} className="text-fig-terracotta" />
              </div>
              <h1 className="font-fig font-bold text-xl text-white font-semibold mb-1.5">Forgot your password?</h1>
              <p className="font-fig-body text-sm text-white/40 leading-relaxed mb-7">
                Enter the email you registered with and we&apos;ll send you a link to reset it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 font-fig-body text-sm text-red-400">
                    {error}
                  </p>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  className="fig-input-dark"
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="fig-btn w-full justify-center disabled:opacity-50"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : "Send Reset Link"}
                </button>
              </form>

              <Link href="/login" className="flex items-center justify-center gap-1.5 font-fig-body text-xs text-white/30 hover:text-white/60 transition-colors mt-6">
                <ArrowLeft size={12} /> Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
