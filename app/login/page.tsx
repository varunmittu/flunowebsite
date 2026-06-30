"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type Mode = "login" | "signup" | "otp";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-fluno-bg">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl text-fluno-teal font-semibold">
              fluno
            </span>
          </Link>
          <p className="font-mono text-xs text-fluno-blush mt-1 tracking-widest">
            care in every drop
          </p>
        </div>

        <div className="card p-8">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-fluno-stone/40">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 pb-3 font-body text-sm font-medium transition-colors ${
                  mode === m
                    ? "text-fluno-teal border-b-2 border-fluno-teal -mb-px"
                    : "text-fluno-ink/40 hover:text-fluno-ink"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center gap-3 border border-fluno-stone rounded-sm py-3 font-body text-sm text-fluno-ink hover:bg-fluno-stone/20 transition-colors mb-4">
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-fluno-stone/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 font-mono text-xs text-fluno-ink/30">
                or
              </span>
            </div>
          </div>

          {/* Phone OTP */}
          {mode === "login" && (
            <div>
              <p className="font-body text-sm text-fluno-ink/60 mb-4">
                Log in with your phone number (OTP) or email.
              </p>
              {otp === "" ? (
                <>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="input w-14 text-center text-fluno-ink/50 flex-shrink-0 flex items-center justify-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input flex-1"
                      placeholder="98765 43210"
                      maxLength={10}
                    />
                  </div>
                  <button
                    onClick={() => setOtp("sent")}
                    className="btn-primary w-full mt-4"
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <p className="font-mono text-xs text-fluno-teal mb-3">
                    OTP sent to +91 {phone}
                  </p>
                  <label className="block font-body text-sm text-fluno-ink/70 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp === "sent" ? "" : otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input text-center tracking-[0.5em] text-lg"
                    placeholder="× × × × × ×"
                    maxLength={6}
                  />
                  <button className="btn-primary w-full mt-4">
                    Verify & Log In
                  </button>
                  <button
                    onClick={() => setOtp("")}
                    className="text-xs text-fluno-teal hover:underline mt-3 font-body block text-center w-full"
                  >
                    Change number
                  </button>
                </>
              )}

              <div className="divider my-5" />
              <p className="font-body text-sm text-fluno-ink/60 mb-3">
                Or use email & password
              </p>
              <input type="email" className="input mb-3" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button className="btn-outline w-full mt-4">Log In with Email</button>
              <p className="text-center mt-3">
                <Link href="#" className="font-mono text-xs text-fluno-teal hover:underline">
                  Forgot password?
                </Link>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-4">
              <p className="font-body text-sm text-fluno-ink/60">
                Create your Fluno account to track orders and manage returns.
              </p>
              <input className="input" placeholder="Full Name" />
              <input type="email" className="input" placeholder="Email" />
              <div className="flex gap-2">
                <span className="input w-14 text-center text-fluno-ink/50 flex-shrink-0 flex items-center justify-center">+91</span>
                <input type="tel" className="input flex-1" placeholder="Phone" maxLength={10} />
              </div>
              <input type="password" className="input" placeholder="Password" />
              <p className="font-mono text-xs text-fluno-ink/40">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-fluno-teal hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="text-fluno-teal hover:underline">
                  Privacy Policy
                </Link>
                . We will not pre-tick any marketing consent.
              </p>
              <button className="btn-primary w-full">Create Account</button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 font-mono text-xs text-fluno-ink/30">
          <ShieldCheck size={13} className="text-fluno-teal" />
          Your data is protected under India&apos;s DPDP Act 2023
        </div>
      </div>
    </div>
  );
}
