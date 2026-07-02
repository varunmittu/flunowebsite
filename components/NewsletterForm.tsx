"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setDone(true);
        toast.success("You're subscribed!", { description: "Welcome to the Fluno family.", icon: "💜" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center justify-center gap-3 p-4 bg-fluno-purple/10 rounded-2xl border border-fluno-purple/20">
        <span className="text-2xl">💜</span>
        <p className="font-body text-sm text-fluno-purple font-semibold">You&apos;re in! Check your inbox for a welcome note.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        name="email"
        type="email"
        placeholder="your@email.com"
        required
        className="input flex-1"
      />
      <button type="submit" disabled={loading} className="btn-primary flex-shrink-0">
        {loading ? "..." : "Subscribe"}
      </button>
    </form>
  );
}
