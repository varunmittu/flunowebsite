"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export const CONSENT_KEY = "fluno_cookie_consent";
export const CONSENT_EVENT = "fluno-consent-change";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm z-[998]"
        >
          <div
            className="rounded-2xl px-5 py-4 shadow-2xl border border-white/[0.08]"
            style={{ background: "rgba(12,5,24,0.96)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-fluno-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Cookie size={16} className="text-fluno-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-white font-semibold leading-snug">
                  We use cookies
                </p>
                <p className="font-body text-[11px] text-white/40 mt-1 leading-relaxed">
                  We use cookies and similar technologies to run the site, remember your cart,
                  and personalise content and advertising. See our{" "}
                  <Link href="/privacy-policy" className="text-fluno-purple/70 hover:text-fluno-purple underline">
                    Privacy Policy
                  </Link>.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => decide("accepted")}
                    className="flex-1 bg-fluno-purple text-white font-body text-xs font-semibold py-2 rounded-xl hover:bg-fluno-purple/90 transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => decide("declined")}
                    className="px-4 py-2 rounded-xl text-white/35 hover:text-white/70 hover:bg-white/[0.06] transition-all font-body text-xs"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
