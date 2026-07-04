"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals elements with `.reveal` / `.reveal-stagger` as they scroll into view.
 * The hidden state is gated by `html.reveal-on` (added pre-paint in layout), so
 * content is always visible if JS is disabled or reveal never runs.
 * A MutationObserver picks up elements added after first paint (e.g. lists that
 * render after a fetch), so async content animates too.
 */
export default function ScrollAnimator() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("reveal-on");

    // JS is running → cancel the pre-paint reveal-all failsafe so it never
    // fires during normal use (it only exists to rescue a broken-JS load).
    const w = window as unknown as { __revealReady?: boolean; __revealFailsafe?: number };
    w.__revealReady = true;
    if (w.__revealFailsafe) clearTimeout(w.__revealFailsafe);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noIO = !("IntersectionObserver" in window);

    const seen = new WeakSet<Element>();

    const reveal = (el: Element) => el.classList.add("is-visible");

    if (reduce || noIO) {
      const showAll = () =>
        document.querySelectorAll(".reveal, .reveal-stagger").forEach(reveal);
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        // Clearly in view on load → fade in now; otherwise animate on scroll.
        if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
          reveal(el);
        } else {
          io.observe(el);
        }
      });
    };

    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
