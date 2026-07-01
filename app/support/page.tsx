"use client";

import { useState } from "react";
import { TicketCheck, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const categories = [
  { value: "order",   label: "Order Issue" },
  { value: "product", label: "Product / Quality" },
  { value: "payment", label: "Payment / Refund" },
  { value: "return",  label: "Return / Exchange" },
  { value: "other",   label: "Other" },
];

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "", category: "other",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res  = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      setSuccess(data.ticketId);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", category: "other" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <TicketCheck size={20} className="text-fluno-teal" />
          <p className="font-mono text-xs tracking-widest text-fluno-teal uppercase">Support</p>
        </div>
        <h1 className="section-title mb-3">Raise a Support Ticket</h1>
        <p className="font-body text-fluno-ink/60">
          Tell us your issue and we&apos;ll get back to you within 24–48 hours.
        </p>
      </div>

      {success ? (
        <div className="card p-10 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-xl text-fluno-ink mb-2">Ticket submitted!</h2>
          <p className="font-mono text-sm text-fluno-ink/50 mb-1">Your ticket ID:</p>
          <p className="font-brand font-bold text-2xl text-fluno-teal">{success}</p>
          <p className="font-body text-sm text-fluno-ink/50 mt-4">
            Please save this ID. We&apos;ll reply to your email within 24–48 hours.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="btn-outline mt-6"
          >
            Submit Another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-sm p-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
                placeholder="Your name"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                placeholder="you@example.com"
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className="input w-full"
              />
            </div>
            <div>
              <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Category</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="input w-full"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Subject *</label>
            <input
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              required
              placeholder="Brief description of your issue"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-fluno-ink/50 mb-1.5 uppercase tracking-wide">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              required
              rows={5}
              placeholder="Describe your issue in detail..."
              className="input w-full resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : (
              <><Send size={16} /> Submit Ticket</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
