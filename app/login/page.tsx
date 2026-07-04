"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// ── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name:          z.string().min(2, "Name must be at least 2 characters"),
  email:         z.string().email("Enter a valid email address"),
  phone:         z.string().regex(/^\d{10}$/, "Enter a 10-digit mobile number"),
  password:      z.string().min(6, "Password must be at least 6 characters"),
  acceptTerms:   z.boolean().refine(v => v === true, { message: "You must accept the Terms & Conditions" }),
  acceptCookies: z.boolean().refine(v => v === true, { message: "You must accept our Cookie Policy" }),
});

type LoginData  = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;
type Tab = "login" | "signup";

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router   = useRouter();
  const [tab, setTab]           = useState<Tab>("login");
  const [showPass, setShowPass] = useState(false);

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "", email: "", phone: "", password: "",
      acceptTerms: false, acceptCookies: false,
    },
  });

  function switchTab(t: Tab) {
    setTab(t);
    loginForm.clearErrors();
    signupForm.clearErrors();
  }

  async function handleLogin(data: LoginData) {
    const res = await signIn("credentials", {
      email:    data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error) {
      loginForm.setError("root", { message: "Incorrect email or password." });
      toast.error("Login failed", { description: "Check your email and password." });
    } else {
      toast.success("Welcome back!", { icon: "👋" });
      router.push("/account");
    }
  }

  async function handleSignup(data: SignupData) {
    try {
      const res = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        signupForm.setError("root", { message: json.error ?? "Sign up failed. Please try again." });
        toast.error("Signup failed", { description: json.error });
        return;
      }
      const signin = await signIn("credentials", {
        email:    data.email,
        password: data.password,
        redirect: false,
      });
      if (signin?.error) {
        toast.success("Account created! Please log in.");
        setTab("login");
      } else {
        toast.success("Account created!", { description: "Welcome to Fluno 🧡", icon: "🎉" });
        router.push("/account");
      }
    } catch {
      signupForm.setError("root", { message: "Something went wrong. Please try again." });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-fig-navy relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="animate-orb1 absolute top-[10%] left-[10%]  w-[400px] h-[400px] rounded-full bg-fig-terracotta/15 blur-[120px]" />
        <div className="animate-orb2 absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-fig-terracotta-deep/10 blur-[140px]" />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(192, 120, 91,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(192, 120, 91,.5) 1px, transparent 1px)",
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
            <span className="font-fig font-bold text-5xl text-white text-glow group-hover:text-fig-terracotta transition-colors duration-200">
              fluno
            </span>
          </Link>
          <p className="font-fig-body text-xs text-fig-terracotta/70 mt-1 tracking-widest uppercase">
            care in every drop
          </p>
        </div>

        <div className="glass p-8">
          {/* Tabs */}
          <div className="flex mb-8 bg-white/5 rounded-full p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-full font-fig-body text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-fig-terracotta text-fig-navy shadow-lg shadow-fig-terracotta/30"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/account" })}
            className="w-full flex items-center justify-center gap-3 bg-white text-fig-navy font-fig-body font-semibold text-sm py-3.5 rounded-full hover:bg-fig-sage transition-colors duration-200 shadow-lg mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-3 font-fig-body text-xs text-white/25">or</span>
            </div>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {tab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {loginForm.formState.errors.root && (
                  <p className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 font-fig-body text-sm text-red-400">
                    {loginForm.formState.errors.root.message}
                  </p>
                )}

                <div>
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    className="fig-input-dark"
                    placeholder="Email address"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...loginForm.register("password")}
                      type={showPass ? "text" : "password"}
                      className="fig-input-dark pr-10"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="font-fig-body text-xs text-fig-terracotta hover:underline">Forgot password?</Link>
                </div>

                <button
                  type="submit"
                  disabled={loginForm.formState.isSubmitting}
                  className="fig-btn w-full justify-center"
                >
                  {loginForm.formState.isSubmitting
                    ? <Loader2 size={15} className="animate-spin" />
                    : <>Log In <ArrowRight size={15} /></>
                  }
                </button>

                <p className="font-fig-body text-[10px] text-white/25 text-center leading-relaxed">
                  By logging in, you&apos;re agreeing to our{" "}
                  <Link href="/privacy-policy" className="text-fig-terracotta/60 hover:text-fig-terracotta transition-colors">Privacy Policy</Link>
                  {" "}&amp;{" "}
                  <Link href="/terms" className="text-fig-terracotta/60 hover:text-fig-terracotta transition-colors">Terms of Service</Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                {signupForm.formState.errors.root && (
                  <p className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 font-fig-body text-sm text-red-400">
                    {signupForm.formState.errors.root.message}
                  </p>
                )}

                <div>
                  <input
                    {...signupForm.register("name")}
                    type="text"
                    className="fig-input-dark"
                    placeholder="Full Name"
                  />
                  {signupForm.formState.errors.name && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...signupForm.register("email")}
                    type="email"
                    className="fig-input-dark"
                    placeholder="Email address"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex gap-2">
                    <span className="fig-input-dark w-14 text-center text-white/40 flex-shrink-0 flex items-center justify-center cursor-default">+91</span>
                    <input
                      {...signupForm.register("phone")}
                      type="tel"
                      className="fig-input-dark flex-1"
                      placeholder="Mobile Number"
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        signupForm.setValue("phone", val);
                      }}
                    />
                  </div>
                  {signupForm.formState.errors.phone && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...signupForm.register("password")}
                      type={showPass ? "text" : "password"}
                      className="fig-input-dark pr-10"
                      placeholder="Password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...signupForm.register("acceptTerms")}
                      className="mt-0.5 w-4 h-4 accent-fig-terracotta cursor-pointer flex-shrink-0"
                    />
                    <span className="font-fig-body text-[11px] text-white/45 leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-fig-terracotta hover:underline">Terms & Conditions</Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" className="text-fig-terracotta hover:underline">Privacy Policy</Link>
                    </span>
                  </label>
                  {signupForm.formState.errors.acceptTerms && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.acceptTerms.message}</p>
                  )}
                </div>

                {/* Cookie consent */}
                <div>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...signupForm.register("acceptCookies")}
                      className="mt-0.5 w-4 h-4 accent-fig-terracotta cursor-pointer flex-shrink-0"
                    />
                    <span className="font-fig-body text-[11px] text-white/45 leading-relaxed">
                      I accept cookies for analytics &amp; personalisation
                    </span>
                  </label>
                  {signupForm.formState.errors.acceptCookies && (
                    <p className="mt-1 font-fig-body text-xs text-red-400">{signupForm.formState.errors.acceptCookies.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={signupForm.formState.isSubmitting}
                  className="fig-btn w-full justify-center"
                >
                  {signupForm.formState.isSubmitting
                    ? <Loader2 size={15} className="animate-spin" />
                    : <>Create Account <ArrowRight size={15} /></>
                  }
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 font-fig-body text-xs text-white/25">
          <ShieldCheck size={13} className="text-fig-terracotta" />
          Protected under India&apos;s DPDP Act 2023
        </div>

        <p className="text-center font-fig-body text-[10px] text-white/12 mt-3 tracking-wider">
          Powered by{" "}
          <span className="text-fig-terracotta/40 font-fig font-bold">fluno</span>
          {" "}· myfluno.com
        </p>
      </motion.div>
    </div>
  );
}
