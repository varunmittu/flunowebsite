"use client";

/**
 * Fluno doodle system — hand-drawn ink-outline contour illustrations
 * with flat colour fills, in the "simple funny contour" style.
 * Fills use the bright fig palette; outlines are ink (#1E1E24).
 * Wrap any doodle in <DoodleReveal> to make its strokes draw on when scrolled into view.
 * NOTE: spread {...stroke} always comes BEFORE any fill= override.
 */

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

const INK = "#1E1E24";
export const TONE = {
  coral: "#FF6B5C",
  sunny: "#FFC94D",
  sky: "#5AB2FF",
  mint: "#6FE0B0",
  lilac: "#B49BFF",
  paper: "#FFFDF7",
} as const;
type ToneKey = keyof typeof TONE;

const stroke = {
  stroke: INK,
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

/** Reveal wrapper — adds the draw-on animation when the doodle scrolls into view. */
export function DoodleReveal({
  children,
  className = "",
  draw = true,
}: {
  children: ReactNode;
  className?: string;
  draw?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={`${draw ? "doodle-draw" : ""} ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

/** tiny happy face — reused across figures */
function Face({ cx, cy, r = 18 }: { cx: number; cy: number; r?: number }) {
  return (
    <>
      <circle cx={cx - r * 0.34} cy={cy - r * 0.1} r={2.4} fill={INK} data-fill />
      <circle cx={cx + r * 0.34} cy={cy - r * 0.1} r={2.4} fill={INK} data-fill />
      <path d={`M ${cx - r * 0.4} ${cy + r * 0.28} Q ${cx} ${cy + r * 0.7}, ${cx + r * 0.4} ${cy + r * 0.28}`} {...stroke} strokeWidth={3} data-draw="2" />
    </>
  );
}

/** Friendly figure with a waving arm. */
export function WavingFig({ className = "", tone = "coral" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 130 170" className={`doodle ${className}`} aria-hidden="true">
      <path d="M56 120 L50 156" {...stroke} data-draw />
      <path d="M74 120 L82 156" {...stroke} data-draw />
      <path d="M44 158 L56 156" {...stroke} strokeWidth={6} data-draw />
      <path d="M80 156 L92 160" {...stroke} strokeWidth={6} data-draw />
      <path d="M42 74 Q65 62 88 74 L82 122 Q65 130 48 122 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M46 82 Q34 100 40 118" {...stroke} data-draw />
      <g style={{ transformOrigin: "86px 82px" }} className="animate-wave">
        <path d="M86 82 Q104 70 104 50" {...stroke} data-draw />
        <circle cx="104" cy="46" r="7" {...stroke} strokeWidth={4} fill={TONE.sunny} data-draw="2" />
      </g>
      <circle cx="65" cy="46" r="22" {...stroke} fill={TONE.paper} data-draw />
      <Face cx={65} cy={46} r={22} />
    </svg>
  );
}

/** Three little people walking in a row (mid-stride). */
export function WalkingPeople({ className = "" }: { className?: string }) {
  const tones: ToneKey[] = ["coral", "sky", "mint"];
  return (
    <svg viewBox="0 0 320 150" className={`doodle ${className}`} aria-hidden="true">
      {tones.map((t, i) => {
        const x = 45 + i * 110;
        const flip = i === 1 ? -1 : 1;
        return (
          <g key={t} transform={`translate(${x},0)`}>
            <path d={`M-8 96 L${-22 * flip} 132`} {...stroke} data-draw />
            <path d={`M8 96 L${20 * flip} 130`} {...stroke} data-draw />
            <path d="M-18 56 Q0 46 18 56 L14 98 Q0 104 -14 98 Z" {...stroke} fill={TONE[t]} data-draw />
            <path d={`M-14 62 Q${-26 * flip} 76 ${-20 * flip} 92`} {...stroke} data-draw />
            <path d={`M14 62 Q${26 * flip} 72 ${22 * flip} 88`} {...stroke} data-draw />
            <circle cx="0" cy="34" r="17" {...stroke} fill={TONE.paper} data-draw />
            <Face cx={0} cy={34} r={17} />
          </g>
        );
      })}
    </svg>
  );
}

/** United happy team — a huddle of figures with raised hands. */
export function HappyTeam({ className = "" }: { className?: string }) {
  const people = [
    { x: 40, tone: "coral" as ToneKey, raise: true },
    { x: 100, tone: "sunny" as ToneKey, raise: false },
    { x: 160, tone: "sky" as ToneKey, raise: true },
    { x: 220, tone: "lilac" as ToneKey, raise: false },
  ];
  return (
    <svg viewBox="0 0 270 180" className={`doodle ${className}`} aria-hidden="true">
      {people.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${i % 2 ? 12 : 0})`}>
          <path d="M-6 128 L-8 164" {...stroke} data-draw />
          <path d="M8 128 L10 164" {...stroke} data-draw />
          <path d="M-20 78 Q0 66 20 78 L16 130 Q0 136 -16 130 Z" {...stroke} fill={TONE[p.tone]} data-draw />
          {p.raise ? (
            <>
              <path d="M-16 84 Q-30 60 -24 40" {...stroke} data-draw />
              <path d="M16 84 Q30 60 24 40" {...stroke} data-draw />
              <circle cx="-24" cy="36" r="6" {...stroke} strokeWidth={4} fill={TONE.paper} data-draw="2" />
              <circle cx="24" cy="36" r="6" {...stroke} strokeWidth={4} fill={TONE.paper} data-draw="2" />
            </>
          ) : (
            <>
              <path d="M-16 84 Q-30 100 -24 118" {...stroke} data-draw />
              <path d="M16 84 Q30 100 24 118" {...stroke} data-draw />
            </>
          )}
          <circle cx="0" cy="50" r="20" {...stroke} fill={TONE.paper} data-draw />
          <Face cx={0} cy={50} r={20} />
        </g>
      ))}
      <g className="animate-wiggle" style={{ transformOrigin: "135px 20px" }}>
        <path d="M135 8 L135 26 M126 17 L144 17" {...stroke} strokeWidth={4} stroke={TONE.coral} data-draw="3" />
      </g>
    </svg>
  );
}

/** Thumbs-up hand. */
export function ThumbsUp({ className = "", tone = "sunny" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 120 130" className={`doodle ${className}`} aria-hidden="true">
      <path d="M30 72 L30 112 Q30 118 36 118 L58 118 Q64 118 64 112 L64 72 Z" {...stroke} fill={TONE.coral} data-draw />
      <path d="M64 78 L64 60 Q64 40 78 40 Q88 40 84 58 L82 66 L100 66 Q110 66 110 76 Q110 84 104 86 Q110 90 106 98 Q110 104 104 108 Q106 114 98 114 L74 114 Q64 112 64 104 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M82 66 L96 66 M74 92 L98 92 M74 102 L96 102" {...stroke} strokeWidth={3} data-draw="2" />
    </svg>
  );
}

/* ─────────────── objects ─────────────── */

/** Pump bottle (product). */
export function DoodleBottle({ className = "", tone = "coral" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 80 120" className={`doodle ${className}`} aria-hidden="true">
      <path d="M34 10 L46 10 L46 24 L34 24 Z" {...stroke} fill={TONE.sunny} data-draw />
      <path d="M28 24 L52 24 L52 34 L28 34 Z" {...stroke} fill={TONE.paper} data-draw />
      <path d="M24 34 Q40 30 56 34 L56 104 Q56 112 48 112 L32 112 Q24 112 24 104 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M24 66 Q40 62 56 66" {...stroke} strokeWidth={3.5} data-draw="2" />
      <circle cx="40" cy="86" r="10" {...stroke} strokeWidth={4} fill={TONE.paper} data-draw="2" />
      <path d="M40 80 L40 92 M34 86 L46 86" {...stroke} strokeWidth={3} data-draw="3" />
    </svg>
  );
}

/** Sunburst that slowly spins. */
export function DoodleSun({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <svg viewBox="0 0 100 100" className={`doodle ${className}`} aria-hidden="true">
      <g className="animate-spin-slower" style={{ transformOrigin: "50px 50px" }}>
        {rays.map((a) => (
          <line
            key={a}
            x1={50 + Math.cos((a * Math.PI) / 180) * 30}
            y1={50 + Math.sin((a * Math.PI) / 180) * 30}
            x2={50 + Math.cos((a * Math.PI) / 180) * 44}
            y2={50 + Math.sin((a * Math.PI) / 180) * 44}
            {...stroke}
            strokeWidth={4}
            data-draw
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="22" {...stroke} fill={TONE.sunny} data-draw />
    </svg>
  );
}

/** 4-point sparkle. */
export function DoodleSparkle({ className = "", tone = "sunny" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 60 60" className={`doodle ${className}`} aria-hidden="true">
      <path d="M30 4 Q34 26 56 30 Q34 34 30 56 Q26 34 4 30 Q26 26 30 4 Z" {...stroke} strokeWidth={4} fill={TONE[tone]} data-draw />
    </svg>
  );
}

/** Heart. */
export function DoodleHeart({ className = "", tone = "coral" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 64 60" className={`doodle ${className}`} aria-hidden="true">
      <path d="M32 54 C 6 36, 6 12, 22 12 Q32 12 32 24 Q32 12 42 12 C 58 12, 58 36, 32 54 Z" {...stroke} fill={TONE[tone]} data-draw />
    </svg>
  );
}

/** Water drop. */
export function DoodleDrop({ className = "", tone = "sky" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 60 80" className={`doodle ${className}`} aria-hidden="true">
      <path d="M30 6 C 30 6, 52 38, 52 52 A 22 22 0 0 1 8 52 C 8 38, 30 6, 30 6 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M22 54 Q22 42 30 36" {...stroke} strokeWidth={3.5} stroke={TONE.paper} data-draw="2" />
    </svg>
  );
}

/** 5-point star. */
export function DoodleStar({ className = "", tone = "sunny" }: { className?: string; tone?: ToneKey }) {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 - 90) * (Math.PI / 180);
    return `${30 + Math.cos(a) * 26},${30 + Math.sin(a) * 26}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 60 60" className={`doodle ${className}`} aria-hidden="true">
      <polygon points={pts} {...stroke} strokeWidth={4} fill={TONE[tone]} data-draw />
    </svg>
  );
}

/** Wavy squiggle — used as an animated underline under headings. */
export function DoodleSquiggle({ className = "", color = TONE.coral }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 220 22" className={`doodle ${className}`} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M4 12 Q30 2 56 12 T108 12 T160 12 T212 12"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        className="doodle-underline"
      />
    </svg>
  );
}

/** Loose organic blob for section backgrounds. */
export function DoodleBlob({ className = "", color = TONE.mint }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M44 66 Q60 26 108 30 Q160 34 174 78 Q188 122 154 156 Q120 190 76 172 Q30 154 26 108 Q24 92 44 66 Z"
        fill={color}
      />
    </svg>
  );
}
