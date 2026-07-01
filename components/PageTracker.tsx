"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("fluno_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("fluno_sid", id);
  }
  return id;
}

export default function PageTracker() {
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const controller = new AbortController();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || "",
        sessionId: getSessionId(),
        userEmail: session?.user?.email ?? "",
      }),
      signal: controller.signal,
    }).catch(() => {});
    return () => controller.abort();
  }, [pathname, session]);

  return null;
}
