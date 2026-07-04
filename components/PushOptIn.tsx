"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Loader2, Check } from "lucide-react";
import { subscribeToPush, pushSupported } from "@/lib/push";

export default function PushOptIn({ email }: { email?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "on" | "denied" | "unsupported">("idle");

  useEffect(() => {
    if (!pushSupported()) { setState("unsupported"); return; }
    if (Notification.permission === "granted") setState("on");
    else if (Notification.permission === "denied") setState("denied");
  }, []);

  async function enable() {
    setState("loading");
    const r = await subscribeToPush(email ?? "");
    setState(r === "ok" ? "on" : r === "unsupported" ? "unsupported" : r === "denied" ? "denied" : "idle");
  }

  if (state === "unsupported") return null;

  return (
    <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-fig-terracotta/12 flex items-center justify-center flex-shrink-0">
          <BellRing size={18} className="text-fig-terracotta" />
        </span>
        <div>
          <p className="font-fig font-bold text-fig-navy">Push notifications</p>
          <p className="font-fig-body text-sm text-fig-ink-soft mt-0.5">
            Get notified about new product drops and exclusive offers.
          </p>
        </div>
      </div>

      {state === "on" ? (
        <span className="inline-flex items-center gap-1.5 font-fig-body text-sm font-semibold text-fig-sage flex-shrink-0">
          <Check size={16} strokeWidth={3} /> Notifications on
        </span>
      ) : state === "denied" ? (
        <span className="font-fig-body text-xs text-fig-ink-soft/70 flex-shrink-0 max-w-[16rem]">
          Blocked — enable notifications for myfluno.com in your browser settings.
        </span>
      ) : (
        <button onClick={enable} disabled={state === "loading"} className="fig-btn flex-shrink-0 disabled:opacity-60">
          {state === "loading" ? <Loader2 size={15} className="animate-spin" /> : <Bell size={15} />}
          {state === "loading" ? "Enabling…" : "Enable notifications"}
        </button>
      )}
    </div>
  );
}
