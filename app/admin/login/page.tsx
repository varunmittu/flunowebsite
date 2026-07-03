"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import {
  WavingFig, DoodleSun, DoodleSparkle, DoodleHeart, DoodleStar, DoodleDrop,
} from "@/components/doodles/Doodles";

export default function AdminLogin() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-fig-navy relative overflow-hidden">

      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb1 absolute top-[10%] left-[10%] w-[420px] h-[420px] rounded-full bg-fig-terracotta/14 blur-[130px]" />
        <div className="animate-orb2 absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-fig-terracotta-deep/9 blur-[150px]" />
        <div className="animate-orb3 absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-fig-terracotta/6 blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,92,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,92,.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating doodles (bright fills pop on the dark bg) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <DoodleSun className="absolute top-[12%] right-[14%] w-16 h-16 hidden sm:block" />
        <DoodleHeart className="absolute top-[22%] left-[16%] w-9 h-9 animate-bob hidden sm:block" tone="coral" />
        <DoodleStar className="absolute bottom-[18%] left-[22%] w-8 h-8 animate-wiggle-slow hidden sm:block" tone="sunny" />
        <DoodleDrop className="absolute bottom-[24%] right-[18%] w-8 h-11 animate-bob-slow hidden sm:block" tone="sky" />
        <DoodleSparkle className="absolute top-[40%] left-[10%] w-7 h-7 animate-wiggle hidden lg:block" tone="mint" />
        <DoodleSparkle className="absolute bottom-[12%] right-[30%] w-6 h-6 animate-wiggle-slow hidden lg:block" tone="lilac" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Mascot + wordmark */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-fig-mustard border-[2.5px] border-fig-navy shadow-[4px_4px_0_0_#1E1E24] flex items-center justify-center animate-bob-slow">
            <WavingFig className="w-16 h-auto" tone="coral" />
          </div>
          <div className="inline-flex items-center gap-2.5 mb-3">
            <DoodleSparkle className="w-5 h-5 animate-wiggle" tone="coral" />
            <span className="font-fig font-bold text-5xl text-white text-glow">fluno</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <ShieldCheck size={12} className="text-fig-terracotta/70" />
            <span className="font-mono text-[10px] text-fig-terracotta/60 tracking-[0.2em] uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Glass card */}
        <div className="glass p-8">
          <h1 className="font-fig font-bold text-2xl text-white text-center mb-1">Welcome back</h1>
          <p className="font-fig-body text-sm text-white/35 text-center mb-8">
            Sign in to manage your store
          </p>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 font-fig-body text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-fig-body text-xs text-white/45 mb-1.5 ml-0.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark"
                placeholder="admin@myfluno.com"
                required
              />
            </div>

            <div>
              <label className="block font-fig-body text-xs text-white/45 mb-1.5 ml-0.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-dark pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                ) : (
                  <>Sign In to Admin <ArrowRight size={15} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <ShieldCheck size={12} className="text-fig-terracotta/50" />
          <span className="font-mono text-[10px] text-white/20">
            Restricted access — authorised personnel only
          </span>
        </div>
      </motion.div>
    </div>
  );
}
