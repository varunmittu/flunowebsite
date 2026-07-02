"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, TicketCheck, RefreshCw, AlertCircle, Send, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface TicketMessage {
  sender:     "customer" | "admin";
  text:       string;
  image?:     string | null;
  createdAt?: string;
}

interface Ticket {
  _id:       string;
  ticketId:  string;
  name:      string;
  email:     string;
  phone?:    string;
  subject:   string;
  message:   string;
  category:  string;
  status:    string;
  priority:  string;
  adminNote?: string;
  messages?:  TicketMessage[];
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-blue-500/15 text-blue-300 border-blue-500/20",
  in_progress: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  resolved:    "bg-green-500/15 text-green-300 border-green-500/20",
  closed:      "bg-white/10 text-white/40 border-white/10",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets]   = useState<Ticket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [note, setNote]         = useState("");
  const [replyText, setReplyText] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  function scrollChat() {
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  }

  async function load(status = filter) {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/tickets?status=${status}`);
      const data = await res.json();
      setTickets(data.tickets ?? []);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line
  useEffect(() => { if (selected) scrollChat(); }, [selected]);

  function changeFilter(f: string) {
    setFilter(f);
    load(f);
    setSelected(null);
  }

  function selectTicket(t: Ticket) {
    setSelected(t);
    setNote(t.adminNote ?? "");
    setReplyText("");
    scrollChat();
  }

  async function updateTicket(id: string, patch: Record<string, unknown>) {
    setSaving(true);
    try {
      const res  = await fetch("/api/admin/tickets", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      setTickets((prev) => prev.map((t) => t._id === id ? data.ticket : t));
      if (selected?._id === id) setSelected(data.ticket);
    } finally {
      setSaving(false);
    }
  }

  async function sendAdminMessage() {
    if (!replyText.trim() || !selected) return;
    setSaving(true);
    const text = replyText.trim();
    setReplyText("");
    // Optimistic update
    const optimistic: TicketMessage = { sender: "admin", text, createdAt: new Date().toISOString() };
    const updated = { ...selected, messages: [...(selected.messages ?? []), optimistic] };
    setSelected(updated as Ticket);
    setTickets((prev) => prev.map((t) => t._id === selected._id ? updated as Ticket : t));
    scrollChat();
    try {
      const res  = await fetch("/api/admin/tickets", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: selected._id, addMessage: true, text }),
      });
      const data = await res.json();
      setSelected(data.ticket);
      setTickets((prev) => prev.map((t) => t._id === selected._id ? data.ticket : t));
    } finally {
      setSaving(false);
    }
  }

  // Build the full conversation list (handles old tickets without messages array)
  const allMessages: TicketMessage[] = selected
    ? (selected.messages?.length
        ? selected.messages
        : [{ sender: "customer", text: selected.message, createdAt: selected.createdAt }])
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TicketCheck size={22} className="text-fluno-purple" />
          <h1 className="font-display text-2xl text-white">Support Tickets</h1>
        </div>
        <button
          onClick={() => load()}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "open", "in_progress", "resolved", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => changeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              filter === f
                ? "bg-fluno-purple border-fluno-purple text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg p-3 mb-4 border border-red-500/20">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        {/* ── Ticket list ── */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-fluno-purple" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="card-dark p-8 text-center rounded-xl border border-white/8">
              <TicketCheck size={28} className="text-white/20 mx-auto mb-2" />
              <p className="text-white/40 font-body text-sm">No tickets found.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <button
                key={t._id}
                onClick={() => selectTicket(t)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selected?._id === t._id
                    ? "border-fluno-purple/50 bg-fluno-purple/10"
                    : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/6"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-mono text-xs text-fluno-purple">{t.ticketId}</p>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[t.status] ?? STATUS_COLORS.open}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <p className="font-body text-sm text-white truncate">{t.subject}</p>
                <p className="font-mono text-xs text-white/40 mt-1">{t.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="font-mono text-[10px] text-white/25">
                    {new Date(t.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  {(t.messages?.length ?? 0) > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-fluno-purple/60">
                      <MessageSquare size={9} /> {t.messages!.length}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* ── Ticket detail ── */}
        <div className="lg:col-span-3">
          {selected ? (
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl border border-white/10 bg-white/3 overflow-hidden"
            >
              {/* Detail header */}
              <div className="px-6 py-4 border-b border-white/8 bg-white/3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-fluno-purple mb-1">{selected.ticketId}</p>
                    <h2 className="font-display text-base text-white leading-snug">{selected.subject}</h2>
                    <p className="font-mono text-xs text-white/40 mt-1">
                      {selected.name} · {selected.email}
                      {selected.phone && ` · ${selected.phone}`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 items-end flex-shrink-0">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${STATUS_COLORS[selected.status] ?? STATUS_COLORS.open}`}>
                      {selected.status.replace("_", " ")}
                    </span>
                    <span className="font-mono text-[10px] text-white/30 capitalize">{selected.priority} priority</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* ── Chat thread ── */}
                <div>
                  <p className="font-mono text-[10px] text-white/35 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <MessageSquare size={10} /> Conversation
                  </p>

                  <div
                    ref={chatRef}
                    className="rounded-xl border border-white/8 bg-black/25 p-4 space-y-3 overflow-y-auto"
                    style={{ minHeight: 200, maxHeight: 340 }}
                  >
                    {allMessages.map((msg, i) => {
                      const isAdmin = msg.sender === "admin";
                      return (
                        <div key={i} className={`flex gap-2 ${isAdmin ? "justify-end" : "justify-start"}`}>
                          {!isAdmin && (
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <User size={11} className="text-white/50" />
                            </div>
                          )}
                          <div className={`flex flex-col max-w-[80%] ${isAdmin ? "items-end" : "items-start"}`}>
                            <div className={`rounded-xl text-sm font-body leading-relaxed break-words overflow-hidden ${
                              isAdmin
                                ? "bg-fluno-purple/75 text-white rounded-tr-sm"
                                : "bg-white/8 text-white/80 rounded-tl-sm"
                            }`}>
                              {msg.image && (
                                <a href={msg.image} target="_blank" rel="noopener noreferrer">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={msg.image}
                                    alt="Customer photo"
                                    className="max-h-48 w-auto max-w-full object-cover cursor-zoom-in"
                                  />
                                </a>
                              )}
                              {msg.text && (
                                <div className="px-3.5 py-2 whitespace-pre-wrap">{msg.text}</div>
                              )}
                            </div>
                            <span className="font-mono text-[9px] text-white/25 mt-0.5 px-0.5">
                              {isAdmin ? "You (Admin)" : selected.name}
                              {msg.createdAt && ` · ${new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                            </span>
                          </div>
                          {isAdmin && (
                            <div className="w-6 h-6 rounded-full bg-fluno-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="font-brand font-bold text-white text-[9px]">F</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Admin reply */}
                  <div className="flex gap-2 mt-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendAdminMessage();
                        }
                      }}
                      rows={2}
                      placeholder="Reply to customer… (Enter to send, Shift+Enter for new line)"
                      className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 resize-none placeholder:text-white/20 focus:outline-none focus:border-fluno-purple/50 transition-colors"
                    />
                    <button
                      onClick={sendAdminMessage}
                      disabled={!replyText.trim() || saving}
                      className="btn-primary self-end flex-shrink-0 disabled:opacity-40"
                      aria-label="Send reply"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/8" />

                {/* Status + Priority */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] text-white/35 mb-1.5 uppercase tracking-widest">Status</label>
                    <select
                      value={selected.status}
                      onChange={(e) => updateTicket(selected._id, { status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fluno-purple/40"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] text-white/35 mb-1.5 uppercase tracking-widest">Priority</label>
                    <select
                      value={selected.priority}
                      onChange={(e) => updateTicket(selected._id, { priority: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-fluno-purple/40"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Internal note */}
                <div>
                  <label className="block font-mono text-[10px] text-white/35 mb-1.5 uppercase tracking-widest">
                    Internal Note <span className="normal-case text-white/20">(not shown to customer)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Add a private note for your team…"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 resize-none placeholder:text-white/20 focus:outline-none focus:border-fluno-purple/40 transition-colors"
                  />
                  <button
                    onClick={() => updateTicket(selected._id, { adminNote: note })}
                    disabled={saving}
                    className="btn-primary mt-2 text-sm"
                  >
                    {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Note"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-white/8 bg-white/3 p-14 text-center">
              <TicketCheck size={36} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30 font-body text-sm">Select a ticket to view the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
