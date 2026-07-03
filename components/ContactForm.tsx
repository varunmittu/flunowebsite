"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const SUBJECTS = [
  "Order Enquiry",
  "Product Question",
  "Return / Refund",
  "Feedback",
  "Other",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "Order Enquiry", message: "",
  });
  const [status,  setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setForm({ name: "", email: "", subject: "Order Enquiry", message: "" });
    } catch {
      setErrMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-green-600" />
        </div>
        <div>
          <p className="font-fig font-bold text-lg font-semibold text-fig-navy mb-1">Message sent!</p>
          <p className="font-fig-body text-sm text-fig-navy/55">
            We&apos;ll get back to you within 24–48 hours.
          </p>
        </div>
        <button
          onClick={() => setStatus("idle")}
          className="font-fig-body text-xs text-fig-terracotta hover:underline mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
          <AlertCircle size={15} className="flex-shrink-0" /> {errMsg}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="fig-input"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="fig-input"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Subject</label>
        <select
          value={form.subject}
          onChange={(e) => set("subject", e.target.value)}
          className="fig-input"
        >
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-fig-body text-sm text-fig-navy/70 mb-1">Message *</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className="fig-input resize-none"
          placeholder="How can we help you?"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="fig-btn w-full justify-center disabled:opacity-60"
      >
        {status === "loading"
          ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
          : <><Send size={15} /> Send Message</>
        }
      </button>
    </form>
  );
}
