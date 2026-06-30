"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Tab = "login" | "signup";

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-fluno-dark relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb1 absolute top-[10%] left-[10%]  w-[400px] h-[400px] rounded-full bg-fluno-purple/15 blur-[120px]" />
        <div className="animate-orb2 absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-fluno-purple-deep/10 blur-[140px]" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(189,126,250,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(189,126,250,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <span className="font-brand font-bold text-5xl text-white text-glow group-hover:text-fluno-purple transition-colors duration-200">
              fluno
            </span>
          </Link>
          <p className="font-mono text-xs text-fluno-purple/70 mt-1 tracking-widest uppercase">
            care in every drop
          </p>
        </div>

        <div className="glass p-8">
          {/* Tabs */}
          <div className="flex mb-8 bg-white/5 rounded-full p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-full font-body text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-fluno-purple text-white shadow-lg shadow-fluno-purple/30"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-white text-fluno-ink font-body font-semibold text-sm py-3.5 rounded-full hover:bg-fluno-lavender transition-colors duration-200 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => signIn("facebook", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white font-body font-semibold text-sm py-3.5 rounded-full hover:bg-[#166FE5] transition-colors duration-200 shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0 fill-white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 font-mono text-xs text-white/25">or</span>
            </div>
          </div>

          {/* Email form */}
          {tab === "login" ? (
            <div className="space-y-4">
              <input type="email"    className="input-dark" placeholder="Email address" />
              <input type="password" className="input-dark" placeholder="Password"      />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-fluno-purple" />
                  <span className="font-body text-xs text-white/40">Remember me</span>
                </label>
                <Link href="#" className="font-mono text-xs text-fluno-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button className="btn-primary w-full">
                Log In <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text"     className="input-dark" placeholder="Full Name"    />
              <input type="email"    className="input-dark" placeholder="Email"         />
              <div className="flex gap-2">
                <span className="input-dark w-16 text-center text-white/40 flex-shrink-0 flex items-center justify-center cursor-default">+91</span>
                <input type="tel" className="input-dark flex-1" placeholder="Mobile Number" maxLength={10} />
              </div>
              <input type="password" className="input-dark" placeholder="Password"     />
              <p className="font-mono text-[11px] text-white/30 leading-relaxed">
                By signing up, you agree to our{" "}
                <Link href="/terms"          className="text-fluno-purple hover:underline">Terms</Link>
                {" "}and{" "}
                <Link href="/privacy-policy" className="text-fluno-purple hover:underline">Privacy Policy</Link>.
              </p>
              <button className="btn-primary w-full">
                Create Account <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 font-mono text-xs text-white/25">
          <ShieldCheck size={13} className="text-fluno-purple" />
          Protected under India&apos;s DPDP Act 2023
        </div>
      </motion.div>
    </div>
  );
}
