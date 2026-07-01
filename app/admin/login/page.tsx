"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fluno-dark relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute top-[15%] left-[15%]  w-96 h-96 rounded-full bg-fluno-purple/15 blur-[120px] animate-orb1" />
      <div className="absolute bottom-[15%] right-[15%] w-80 h-80 rounded-full bg-fluno-purple-deep/10 blur-[100px] animate-orb2" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-fluno-purple" />
            <span className="font-brand font-bold text-4xl text-white text-glow">fluno</span>
          </div>
          <p className="font-mono text-xs text-fluno-purple/60 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 space-y-5">
          <h1 className="font-display text-2xl text-white text-center mb-6">Welcome back</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block font-body text-xs text-white/50 mb-1.5">Email</label>
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
            <label className="block font-body text-xs text-white/50 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-dark pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            ) : (
              "Sign In to Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
