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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight * 0.94) {
          reveal(el); // already in view → fade in now
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
