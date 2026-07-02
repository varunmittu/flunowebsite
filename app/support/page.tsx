"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare, Send, Loader2, TicketCheck,
  Search, CheckCircle2, AlertCircle, ChevronLeft,
  User, Headphones, RefreshCw, ImagePlus, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "order",   label: "Order Issue"       },
  { value: "product", label: "Product / Quality" },
  { value: "payment", label: "Payment / Refund"  },
  { value: "return",  label: "Return / Exchange"  },
  { value: "other",   label: "Other"              },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open:        { label: "Open",        color: "bg-blue-100 text-blue-700 border-blue-200"   },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700 border-amber-200" },
  resolved:    { label: "Resolved",    color: "bg-green-100 text-green-700 border-green-200" },
  closed:      { label: "Closed",      color: "bg-gray-100 text-gray-600 border-gray-200"    },
};

interface TicketMessage {
  sender:    "customer" | "admin";
  text:      string;
  image?:    string | null;
  createdAt?: string;
}

interface FullTicket {
  _id:      string;
  ticketId: string;
  name:     string;
  email:    string;
  subject:  string;
  category: string;
  status:   string;
  message:  string;
  messages: TicketMessage[];
  createdAt: string;
}

type View = "new" | "track" | "chat";

export default function SupportPage() {
  const [view, setView] = useState<View>("new");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "", category: "other",
  });
  const [lookupId, setLookupId]       = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [ticket, setTicket]           = useState<FullTicket | null>(null);
  const [replyText, setReplyText]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [sending, setSending]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [uploading, setUploading]     = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>();

  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  }

  useEffect(() => { if (view === "chat") scrollToBottom(); }, [ticket?.messages?.length, view]);

  const refreshTicket = useCallback(async () => {
    if (!ticket) return;
    try {
      const res  = await fetch(`/api/tickets?ticketId=${ticket.ticketId}&email=${encodeURIComponent(ticket.email)}`);
      const data = await res.json();
      if (data.ticket) setTicket(data.ticket);
    } catch {}
  }, [ticket]);

  useEffect(() => {
    if (view === "chat") {
      pollRef.current = setInterval(refreshTicket, 10000);
    } else {
      clearInterval(pollRef.current);
    }
    return () => clearInterval(pollRef.current);
  }, [view, refreshTicket]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("/api/tickets", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");

      const tRes  = await fetch(`/api/tickets?ticketId=${data.ticketId}&email=${encodeURIComponent(form.email)}`);
      const tData = await tRes.json();
      setTicket(tData.ticket);
      setView("chat");
      toast.success("Ticket created!", { description: `ID: ${data.ticketId}`, icon: "🎫" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupId.trim() || !lookupEmail.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/tickets?ticketId=${lookupId.trim()}&email=${encodeURIComponent(lookupEmail.trim())}`);
      const data = await res.json();
      if (!data.ticket) {
        setError("Ticket not found. Please check your Ticket ID and email.");
        return;
      }
      setTicket(data.ticket);
      setView("chat");
    } catch {
      setError("Failed to find ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file || !ticket) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files can be attached.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large — maximum 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("ticketId", ticket.ticketId);
      fd.append("email", ticket.email);
      const res  = await fetch("/api/tickets/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setPendingImage(data.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReply(e?: React.FormEvent) {
    e?.preventDefault();
    if ((!replyText.trim() && !pendingImage) || !ticket) return;
    setSending(true);
    const text  = replyText.trim();
    const image = pendingImage;
    setReplyText("");
    setPendingImage(null);
    // Optimistic update
    setTicket((t) => t ? { ...t, messages: [...t.messages, { sender: "customer", text, image, createdAt: new Date().toISOString() }] } : t);
    scrollToBottom();
    try {
      const res  = await fetch("/api/tickets", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ticketId: ticket.ticketId, email: ticket.email, text, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send");
      setTicket(data.ticket);
    } catch {
      toast.error("Failed to send. Please try again.");
      setReplyText(text); // restore
      setPendingImage(image);
    } finally {
      setSending(false);
    }
  }

  const statusCfg = STATUS_CONFIG[ticket?.status ?? "open"] ?? STATUS_CONFIG.open;
  const isClosed  = ticket?.status === "resolved" || ticket?.status === "closed";

  // For old tickets without messages array, synthesize from original message
  const allMessages: TicketMessage[] = ticket
    ? (ticket.messages?.length > 0
        ? ticket.messages
        : [{ sender: "customer", text: ticket.message, createdAt: ticket.createdAt }])
    : [];

  return (
    <div className="min-h-screen bg-fluno-light">
      {/* Hero */}
      <div className="bg-fluno-dark pt-16 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[20%] w-[350px] h-[350px] rounded-full bg-fluno-purple/10 blur-[100px]" />
          <div className="absolute bottom-0 right-[15%] w-[250px] h-[250px] rounded-full bg-fluno-purple/8 blur-[80px]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="eyebrow text-fluno-purple mb-4 flex items-center gap-2 justify-center">
            <Headphones size={12} /> Customer Support
          </p>
          <h1 className="font-brand font-bold text-white leading-none mb-3" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            How can we help?
          </h1>
          <p className="font-body text-white/45 text-base">
            We reply within 24 hours — Mon to Sat, 9 AM–6 PM IST.
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <AnimatePresence mode="wait">

          {/* ── CHAT VIEW ── */}
          {view === "chat" && ticket ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-4 px-1">
                <button
                  onClick={() => { setView("new"); setTicket(null); }}
                  className="flex items-center gap-1 font-mono text-xs text-fluno-muted hover:text-fluno-purple transition-colors"
                >
                  <ChevronLeft size={14} /> New Ticket
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-fluno-muted/60">{ticket.ticketId}</span>
                  <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <button
                    onClick={refreshTicket}
                    className="text-fluno-muted/50 hover:text-fluno-purple transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              {/* Chat card */}
              <div className="bg-white rounded-2xl shadow-sm border border-fluno-lavender/60 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-fluno-lavender/30 border-b border-fluno-lavender/50">
                  <h2 className="font-display font-semibold text-fluno-ink text-lg leading-snug">{ticket.subject}</h2>
                  <p className="font-mono text-xs text-fluno-muted/60 mt-0.5">
                    {ticket.name} · {CATEGORIES.find(c => c.value === ticket.category)?.label ?? ticket.category}
                  </p>
                </div>

                {/* Messages */}
                <div
                  ref={chatRef}
                  className="px-5 py-5 space-y-4 overflow-y-auto"
                  style={{ minHeight: 320, maxHeight: 520 }}
                >
                  {allMessages.map((msg, i) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                        className={`flex gap-2.5 ${isAdmin ? "justify-start" : "justify-end"}`}
                      >
                        {isAdmin && (
                          <div className="w-8 h-8 rounded-full bg-fluno-purple flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                            <span className="font-brand font-bold text-white text-[11px]">F</span>
                          </div>
                        )}
                        <div className={`flex flex-col max-w-[78%] ${isAdmin ? "items-start" : "items-end"}`}>
                          <div className={`rounded-2xl text-sm font-body leading-relaxed break-words overflow-hidden ${
                            isAdmin
                              ? "bg-fluno-lavender/70 text-fluno-ink rounded-tl-sm"
                              : "bg-fluno-purple text-white rounded-tr-sm shadow-sm"
                          }`}>
                            {msg.image && (
                              <a href={msg.image} target="_blank" rel="noopener noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={msg.image}
                                  alt="Attached photo"
                                  className="max-h-52 w-auto max-w-full object-cover cursor-zoom-in"
                                />
                              </a>
                            )}
                            {msg.text && (
                              <div className="px-4 py-2.5 whitespace-pre-wrap">{msg.text}</div>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-fluno-muted/45 mt-1 px-1">
                            {isAdmin ? "Fluno Support" : "You"}
                            {msg.createdAt && ` · ${new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                          </span>
                        </div>
                        {!isAdmin && (
                          <div className="w-8 h-8 rounded-full bg-fluno-lavender flex items-center justify-center flex-shrink-0 mt-1">
                            <User size={14} className="text-fluno-purple" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Resolved banner */}
                {isClosed && (
                  <div className="mx-5 mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-sm text-green-700">
                      This ticket is <strong>{statusCfg.label.toLowerCase()}</strong>. If you need further assistance, please raise a new ticket.
                    </p>
                  </div>
                )}

                {/* Reply input */}
                {!isClosed && (
                  <form
                    onSubmit={handleReply}
                    className="px-5 pb-5 pt-3 border-t border-fluno-lavender/40"
                  >
                    {pendingImage && (
                      <div className="mb-2.5 inline-flex items-start gap-2 p-1.5 rounded-xl bg-fluno-lavender/40 border border-fluno-lavender">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pendingImage} alt="Attached" className="h-16 w-16 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setPendingImage(null)}
                          className="p-1 text-fluno-muted/60 hover:text-red-500 transition-colors"
                          aria-label="Remove attachment"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2.5 items-end">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading || !!pendingImage}
                        className="flex-shrink-0 self-end p-3 rounded-xl border border-fluno-lavender text-fluno-purple hover:bg-fluno-lavender/40 transition-colors disabled:opacity-50"
                        aria-label="Attach photo"
                        title="Attach photo (required for damage claims)"
                      >
                        {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
                      </button>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleReply();
                          }
                        }}
                        rows={2}
                        placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                        className="input flex-1 resize-none text-sm py-2.5"
                      />
                      <button
                        type="submit"
                        disabled={(!replyText.trim() && !pendingImage) || sending || uploading}
                        className="btn-primary flex-shrink-0 self-end disabled:opacity-50"
                        aria-label="Send message"
                      >
                        {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                      </button>
                    </div>
                    <p className="font-mono text-[10px] text-fluno-muted/40 mt-1.5">
                      Auto-refreshes every 10 s · For return / damage claims, attach clear photos of the product using the 📎 image button
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

          ) : (
            /* ── FORM VIEW ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-5 justify-center">
                {[
                  { id: "new"   as const, label: "New Ticket",  Icon: TicketCheck },
                  { id: "track" as const, label: "Track Ticket", Icon: Search     },
                ].map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => { setView(id); setError(null); }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-body text-sm font-semibold transition-all duration-200 ${
                      view === id
                        ? "bg-fluno-purple text-white shadow-lg shadow-fluno-purple/25"
                        : "bg-white text-fluno-muted border border-fluno-lavender hover:border-fluno-purple hover:text-fluno-purple shadow-sm"
                    }`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>

              {/* New Ticket form */}
              {view === "new" && (
                <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                      <AlertCircle size={16} className="flex-shrink-0" /> {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Full Name *</label>
                      <input value={form.name} onChange={(e) => setField("name", e.target.value)} required placeholder="Your name" className="input w-full" />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required placeholder="you@example.com" className="input w-full" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Phone</label>
                      <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 98765 43210" className="input w-full" />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Category</label>
                      <select value={form.category} onChange={(e) => setField("category", e.target.value)} className="input w-full">
                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Subject *</label>
                    <input value={form.subject} onChange={(e) => setField("subject", e.target.value)} required placeholder="Brief description of your issue" className="input w-full" />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Message *</label>
                    <textarea value={form.message} onChange={(e) => setField("message", e.target.value)} required rows={4} placeholder="Describe your issue in detail…" className="input w-full resize-none" />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                      : <><Send size={16} /> Submit Ticket</>
                    }
                  </button>

                  <div className="flex items-center gap-2 pt-1">
                    <MessageSquare size={12} className="text-fluno-purple flex-shrink-0" />
                    <p className="font-mono text-[10px] text-fluno-muted/50">
                      After submitting, you can chat directly with our support team.
                    </p>
                  </div>
                </form>
              )}

              {/* Track Ticket form */}
              {view === "track" && (
                <form onSubmit={handleLookup} className="card p-6 sm:p-8 space-y-5">
                  <div className="text-center pb-2">
                    <div className="w-14 h-14 rounded-2xl bg-fluno-purple/10 flex items-center justify-center mx-auto mb-4">
                      <Search size={24} className="text-fluno-purple/60" />
                    </div>
                    <h2 className="font-display font-semibold text-fluno-ink mb-1">Track your ticket</h2>
                    <p className="font-body text-fluno-ink/50 text-sm">
                      Enter your Ticket ID and the email you used — we&apos;ll show you the conversation.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                      <AlertCircle size={16} className="flex-shrink-0" /> {error}
                    </div>
                  )}

                  <div>
                    <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Ticket ID *</label>
                    <input
                      value={lookupId}
                      onChange={(e) => setLookupId(e.target.value.toUpperCase())}
                      required
                      placeholder="TKT-XXXXXXXXXX"
                      className="input w-full font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-fluno-muted/60 mb-1.5 uppercase tracking-wide">Email *</label>
                    <input
                      type="email"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      required
                      placeholder="Email used when raising the ticket"
                      className="input w-full"
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Searching…</>
                      : <><Search size={16} /> Find My Ticket</>
                    }
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
