"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { subscribeToPush } from "@/lib/push";
import { CONSENT_KEY, CONSENT_EVENT } from "./CookieConsent";

export default function NotificationPrompt() {
  const { data: session } = useSession();
  const [show,   setShow]   = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) return;

    if (Notification.permission !== "default") return;
    if (localStorage.getItem("push_dismissed")) return;

    let t: ReturnType<typeof setTimeout>;

    // Don't overlap the cookie banner: only prompt once the cookie choice
    // has been made (or was made on a previous visit).
    if (localStorage.getItem(CONSENT_KEY)) {
      t = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(t);
    }

    const onConsent = () => {
      t = setTimeout(() => setShow(true), 1500);
    };
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      clearTimeout(t);
    };
  }, []);

  async function handleAllow() {
    setStatus("loading");
    const result = await subscribeToPush(session?.user?.email ?? "");
    if (result === "ok") {
      setStatus("done");
      setTimeout(() => setShow(false), 2000);
    } else {
      setShow(false);
    }
  }

  function dismiss() {
    localStorage.setItem("push_dismissed", "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-sm"
        >
          <div
            className="rounded-2xl px-5 py-4 shadow-2xl border border-white/[0.08] flex items-start gap-3"
            style={{ background: "rgba(44,42,39,0.96)", backdropFilter: "blur(20px)" }}
          >
            <div className="w-9 h-9 rounded-xl bg-fig-terracotta/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bell size={16} className="text-fig-terracotta" />
            </div>

            <div className="flex-1 min-w-0">
              {status === "done" ? (
                <p className="font-fig-body text-sm text-white font-semibold">
                  You&apos;re in! 🎉 We&apos;ll notify you about new drops.
                </p>
              ) : (
                <>
                  <p className="font-fig-body text-sm text-white font-semibold leading-snug">
                    Stay updated with Fluno
                  </p>
                  <p className="font-fig-body text-[11px] text-white/40 mt-0.5 leading-relaxed">
                    Get notified about new products, blog posts &amp; exclusive offers.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleAllow}
                      disabled={status === "loading"}
                      className="flex-1 bg-fig-terracotta text-fig-navy font-fig-body text-xs font-semibold py-2 rounded-xl hover:bg-fig-terracotta/90 transition-colors disabled:opacity-60"
                    >
                      {status === "loading" ? "Enabling…" : "Allow Notifications"}
                    </button>
                    <button
                      onClick={dismiss}
                      className="px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all font-fig-body text-xs"
                    >
                      Not now
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={dismiss}
              className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
