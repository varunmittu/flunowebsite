"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, Mail, MailOpen, Trash2, Reply, ChevronDown,
  ChevronUp, Loader2, RefreshCw,
} from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const PANEL  = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.07)";

function fmt(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH  = diffMs / (1000 * 60 * 60);
  if (diffH < 24) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (diffH < 168) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function MessagesPage() {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<"all" | "unread">("all");
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const url = filter === "unread" ? "/api/admin/messages?unread=1" : "/api/admin/messages";
    const res = await fetch(url);
    const data = await res.json();
    setMessages(data.messages ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]); // eslint-disable-line

  async function toggleRead(msg: Message) {
    await fetch("/api/admin/messages", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id: msg._id, read: !msg.read }),
    });
    setMessages((prev) =>
      prev.map((m) => m._id === msg._id ? { ...m, read: !m.read } : m)
    );
  }

  async function deleteMsg(id: string) {
    setDeleting(id);
    await fetch("/api/admin/messages", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (expanded === id) setExpanded(null);
    setDeleting(null);
  }

  function handleExpand(id: string, msg: Message) {
    setExpanded((prev) => (prev === id ? null : id));
    if (!msg.read) {
      fetch("/api/admin/messages", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: msg._id, read: true }),
      });
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, read: true } : m));
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl text-white font-semibold">Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-fluno-purple/20 border border-fluno-purple/30 text-fluno-purple text-xs font-mono">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="font-body text-sm text-white/35">Contact form submissions from myfluno.com</p>
        </div>
        <button
          onClick={load}
          className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
          title="Refresh"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
              filter === f
                ? "bg-fluno-purple/20 text-fluno-purple border border-fluno-purple/30"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Message list */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/20">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-white/20">
          <Inbox size={36} />
          <p className="font-mono text-sm">
            {filter === "unread" ? "No unread messages" : "No messages yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isOpen = expanded === msg._id;
              return (
                <motion.div
                  key={msg._id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: isOpen ? "rgba(189,126,250,0.06)" : PANEL,
                    border: `1px solid ${isOpen ? "rgba(189,126,250,0.2)" : BORDER}`,
                  }}
                >
                  {/* Row header */}
                  <button
                    onClick={() => handleExpand(msg._id, msg)}
                    className="w-full flex items-start gap-4 p-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Read dot */}
                    <div className="flex-shrink-0 pt-0.5">
                      {msg.read
                        ? <MailOpen size={16} className="text-white/20" />
                        : <Mail size={16} className="text-fluno-purple" />
                      }
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-body text-sm font-medium truncate ${msg.read ? "text-white/50" : "text-white"}`}>
                          {msg.name}
                        </span>
                        <span className="font-mono text-[10px] text-white/25 flex-shrink-0">
                          {fmt(msg.createdAt)}
                        </span>
                      </div>
                      <p className={`font-body text-xs truncate mb-0.5 ${msg.read ? "text-white/30" : "text-white/70"}`}>
                        {msg.subject}
                      </p>
                      <p className="font-body text-xs text-white/25 truncate">{msg.message}</p>
                    </div>

                    <div className="flex-shrink-0 text-white/20">
                      {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </div>
                  </button>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-white/[0.06]">
                          {/* Sender info */}
                          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-4 pt-3">
                            <div>
                              <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">From</span>
                              <p className="font-body text-sm text-white/80 mt-0.5">{msg.name}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">Email</span>
                              <p className="font-body text-sm text-fluno-purple mt-0.5">{msg.email}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">Subject</span>
                              <p className="font-body text-sm text-white/60 mt-0.5">{msg.subject}</p>
                            </div>
                            <div>
                              <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">Date</span>
                              <p className="font-body text-sm text-white/60 mt-0.5">
                                {new Date(msg.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>

                          {/* Message body */}
                          <div className="rounded-xl p-4 mb-4 whitespace-pre-wrap font-body text-sm text-white/70 leading-relaxed"
                            style={{ background: "rgba(0,0,0,0.25)", border: `1px solid ${BORDER}` }}>
                            {msg.message}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}&body=%0A%0A----%0AOriginal message from ${encodeURIComponent(msg.name)}:%0A${encodeURIComponent(msg.message)}`}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-body font-medium bg-fluno-purple/20 text-fluno-purple border border-fluno-purple/30 hover:bg-fluno-purple/30 transition-colors"
                            >
                              <Reply size={13} /> Reply
                            </a>
                            <button
                              onClick={() => toggleRead(msg)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-body text-white/40 border border-white/[0.08] hover:text-white/70 hover:bg-white/[0.05] transition-colors"
                            >
                              {msg.read ? <Mail size={13} /> : <MailOpen size={13} />}
                              {msg.read ? "Mark Unread" : "Mark Read"}
                            </button>
                            <button
                              onClick={() => deleteMsg(msg._id)}
                              disabled={deleting === msg._id}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-body text-red-400/60 border border-red-500/[0.12] hover:text-red-400 hover:bg-red-500/[0.08] transition-colors disabled:opacity-40"
                            >
                              {deleting === msg._id
                                ? <Loader2 size={13} className="animate-spin" />
                                : <Trash2 size={13} />
                              }
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
