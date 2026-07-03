"use client";

import { useEffect, useRef } from "react";
import { FigRunner } from "./Fig";

/**
 * "scroll-travel" state: Fig runs along the bottom edge of the viewport,
 * position scrubbed to scroll progress. Runs while scrolling, rests when idle.
 * Hidden entirely under prefers-reduced-motion.
 */
export default function ScrollTraveler() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.display = "block";
    let x = 12;
    let target = 12;
    let facing = 1;
    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const lane = window.innerWidth - el.offsetWidth - 24;
      target = 12 + p * lane;
    };

    const tick = () => {
      x += (target - x) * 0.08;
      const moving = Math.abs(target - x) > 1.5;
      if (moving) {
        el.classList.add("fig-moving");
        facing = target >= x ? 1 : -1;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => el.classList.remove("fig-moving"), 250);
      }
      el.style.transform = `translateX(${x}px) scaleX(${facing})`;
      raf = requestAnimationFrame(tick);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fig-traveler fixed bottom-1 left-0 z-30 w-[74px] max-sm:w-[52px] pointer-events-none opacity-95 hidden"
    >
      <FigRunner animate />
    </div>
  );
}
