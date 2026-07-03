"use client";

import { useState } from "react";
import { toast } from "sonner";

/** Mustard launch-list strip — posts to the existing newsletter API. */
export default function NotifyStrip() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("You're on the list", { description: "Launches and restocks only. No noise." });
      } else {
        toast.error("Couldn't subscribe. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="notify" className="bg-fig-mustard py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-7">
        <div>
          <h2 className="font-fig font-bold text-fig-navy text-2xl md:text-[2rem] leading-tight">
            Hear about the next one first.
          </h2>
          <p className="font-fig-body text-fig-navy/75 mt-1.5 max-w-md">
            Launches and restocks only. No daily &ldquo;self-care journey&rdquo; emails, promise.
          </p>
        </div>
        {done ? (
          <p className="font-fig font-semibold text-fig-navy text-lg">On the list ✓</p>
        ) : (
          <form onSubmit={subscribe} className="flex flex-wrap gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="border-2 border-fig-navy bg-fig-paper text-fig-navy rounded-full px-5 py-3 font-fig-body text-sm min-w-[240px] placeholder:text-fig-ink-soft focus:outline-none focus:ring-2 focus:ring-fig-navy/30"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-fig-navy hover:bg-fig-navy-soft text-fig-cream font-fig font-semibold text-[15px] px-7 py-3 transition-colors disabled:opacity-60"
            >
              {loading ? "…" : "Notify me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
