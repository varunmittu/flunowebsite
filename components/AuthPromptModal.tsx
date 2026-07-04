"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Loader2, ArrowRight } from "lucide-react";
import { CONSENT_KEY, CONSENT_EVENT } from "./CookieConsent";

const SEEN_KEY = "fluno_auth_prompt_seen";
export const AUTH_PROMPT_DONE = "fluno-auth-prompt-done";

function fireDone() {
  if (typeof window === "undefined") return;
  (window as unknown as { __authPromptDone?: boolean }).__authPromptDone = true;
  window.dispatchEvent(new Event(AUTH_PROMPT_DONE));
}

export default function AuthPromptModal() {
  const { status } = useSession();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;
  const [show, setShow]       = useState(false);
  const [mode, setMode]       = useState<"signup" | "login">("signup");
  const [form, setForm]       = useState({ name: "", email: "", phone: "", password: "" });
  const [terms, setTerms]     = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // Already logged in → never show; signal downstream prompts they can proceed.
  useEffect(() => {
    if (status === "authenticated") { setShow(false); fireDone(); }
  }, [status]);

  // Show once per session for signed-out visitors, sequenced AFTER the cookie choice.
  useEffect(() => {
    if (isAdmin || status !== "unauthenticated") return;
    if (sessionStorage.getItem(SEEN_KEY)) { fireDone(); return; }

    let t: ReturnType<typeof setTimeout>;
    if (localStorage.getItem(CONSENT_KEY)) {
      t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
    const onConsent = () => { t = setTimeout(() => setShow(true), 700); };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => { window.removeEventListener(CONSENT_EVENT, onConsent); clearTimeout(t); };
  }, [status, isAdmin]);

  function dismiss() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setShow(false);
    fireDone();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!terms || !privacy) {
        setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const d = await res.json();
        if (!res.ok) { setError(d.error || "Sign up failed. Please try again."); setLoading(false); return; }
        await signIn("credentials", { email: form.email, password: form.password, redirect: false });
        sessionStorage.setItem(SEEN_KEY, "1"); // status flips to authenticated → modal closes
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } else {
      setLoading(true);
      const r = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (r?.error) { setError("Incorrect email or password."); setLoading(false); }
      else sessionStorage.setItem(SEEN_KEY, "1");
    }
  }

  if (!show || isAdmin || status !== "unauthenticated") return null;

  const inputCls =
    "w-full border-2 border-fig-navy/20 bg-white text-fig-navy px-3.5 py-2.5 rounded-xl font-fig-body text-sm placeholder:text-fig-ink-soft/50 focus:outline-none focus:border-fig-terracotta focus:ring-2 focus:ring-fig-terracotta/20 transition-all";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-fig-navy/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-md my-8 bg-fig-paper border-[2.5px] border-fig-navy rounded-3xl shadow-[8px_8px_0_0_#2C2A27] p-6 sm:p-7 relative">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-fig-ink-soft/60 hover:text-fig-navy hover:bg-fig-navy/5 transition-all"
        >
          <X size={18} />
        </button>

        <p className="fig-eyebrow text-fig-terracotta mb-1">Welcome to Fluno</p>
        <h2 className="font-fig font-bold text-2xl text-fig-navy leading-tight">
          {mode === "signup" ? "Create your account" : "Sign in"}
        </h2>
        <p className="font-fig-body text-sm text-fig-ink-soft mt-1.5">
          For faster checkout, order tracking, and early access to new drops.
        </p>

        {/* Google */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="mt-5 w-full flex items-center justify-center gap-3 bg-white border-2 border-fig-navy text-fig-navy font-fig font-semibold text-sm py-3 rounded-full hover:bg-fig-mustard transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-fig-navy/10" />
          <span className="font-fig-body text-[11px] text-fig-ink-soft/60">or</span>
          <div className="flex-1 h-px bg-fig-navy/10" />
        </div>

        {error && (
          <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-fig-terracotta/10 border border-fig-terracotta/25 font-fig-body text-xs text-fig-terracotta">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Full name" required />
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="Phone (optional)" />
            </>
          )}
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="Email address" required />
          <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} placeholder="Password (min 6 characters)" required minLength={6} />

          {mode === "signup" && (
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 accent-fig-terracotta w-4 h-4 flex-shrink-0" />
                <span className="font-fig-body text-xs text-fig-ink-soft leading-relaxed">
                  I accept the{" "}
                  <Link href="/terms" target="_blank" className="text-fig-terracotta underline">Terms &amp; Conditions</Link>.
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="mt-0.5 accent-fig-terracotta w-4 h-4 flex-shrink-0" />
                <span className="font-fig-body text-xs text-fig-ink-soft leading-relaxed">
                  I accept the{" "}
                  <Link href="/privacy-policy" target="_blank" className="text-fig-terracotta underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>
          )}

          <button type="submit" disabled={loading} className="fig-btn w-full py-3 mt-1 disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <>{mode === "signup" ? "Create account" : "Sign in"} <ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="font-fig-body text-xs text-fig-ink-soft text-center mt-4">
          {mode === "signup" ? "Already have an account?" : "New to Fluno?"}{" "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            className="text-fig-terracotta font-semibold hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>

        <button onClick={dismiss} className="w-full text-center font-fig-body text-xs text-fig-ink-soft/60 hover:text-fig-ink-soft mt-3 transition-colors">
          Continue browsing
        </button>
      </div>
    </div>
  );
}
