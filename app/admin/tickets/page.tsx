"use client";

import { useEffect, useState } from "react";
import { Loader2, TicketCheck, RefreshCw, AlertCircle } from "lucide-react";

interface Ticket {
  _id: string;
  ticketId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  adminNote?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  open:        "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  resolved:    "bg-green-50 text-green-700",
  closed:      "bg-gray-100 text-gray-500",
};
const PRIORITY_COLORS: Record<string, string> = {
  low:    "bg-gray-100 text-gray-500",
  medium: "bg-amber-50 text-amber-700",
  high:   "bg-red-50 text-red-600",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [note, setNote]         = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");

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

  function changeFilter(f: string) {
    setFilter(f);
    load(f);
    setSelected(null);
  }

  async function updateTicket(id: string, patch: Record<string, string>) {
    setSaving(true);
    try {
      const res  = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      setTickets((prev) => prev.map((t) => t._id === id ? data.ticket : t));
      if (selected?._id === id) setSelected(data.ticket);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TicketCheck size={22} className="text-fluno-purple" />
          <h1 className="font-display text-2xl text-white">Support Tickets</h1>
        </div>
        <button onClick={() => load()} className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {["all", "open", "in_progress", "resolved", "closed"].map((f) => (
          <button
            key={f}
            onClick={() => changeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filter === f ? "bg-fluno-purple text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg p-3 mb-4">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Ticket list */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-fluno-purple" /></div>
          ) : tickets.length === 0 ? (
            <div className="card-dark p-8 text-center">
              <p className="text-white/40 font-body text-sm">No tickets found.</p>
            </div>
          ) : (
            tickets.map((t) => (
              <button
                key={t._id}
                onClick={() => { setSelected(t); setNote(t.adminNote ?? ""); }}
                className={`w-full text-left card-dark p-4 rounded-xl border transition-all ${
                  selected?._id === t._id ? "border-fluno-purple/60" : "border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-mono text-xs text-fluno-purple">{t.ticketId}</p>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${STATUS_COLORS[t.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <p className="font-body text-sm text-white truncate">{t.subject}</p>
                <p className="font-mono text-xs text-white/40 mt-1">{t.name} · {t.email}</p>
                <p className="font-mono text-[10px] text-white/25 mt-1">
                  {new Date(t.createdAt).toLocaleDateString("en-IN")}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Ticket detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="card-dark rounded-xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-fluno-purple mb-1">{selected.ticketId}</p>
                  <h2 className="font-display text-lg text-white">{selected.subject}</h2>
                  <p className="font-mono text-xs text-white/40 mt-1">
                    {selected.name} · {selected.email}
                    {selected.phone && ` · ${selected.phone}`}
                  </p>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded shrink-0 ${PRIORITY_COLORS[selected.priority] ?? ""}`}>
                  {selected.priority}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <p className="font-mono text-xs text-white/40 mb-2 uppercase tracking-wide">Category: {selected.category}</p>
                <p className="font-body text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              {/* Controls */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-white/40 mb-1.5 uppercase tracking-wide">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) => updateTicket(selected._id, { status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs text-white/40 mb-1.5 uppercase tracking-wide">Priority</label>
                  <select
                    value={selected.priority}
                    onChange={(e) => updateTicket(selected._id, { priority: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-white/40 mb-1.5 uppercase tracking-wide">Admin Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Internal note (not shown to customer)..."
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2 resize-none placeholder:text-white/20"
                />
                <button
                  onClick={() => updateTicket(selected._id, { adminNote: note })}
                  disabled={saving}
                  className="btn-primary mt-2 text-sm"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : "Save Note"}
                </button>
              </div>
            </div>
          ) : (
            <div className="card-dark rounded-xl p-12 text-center">
              <TicketCheck size={36} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/30 font-body text-sm">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
