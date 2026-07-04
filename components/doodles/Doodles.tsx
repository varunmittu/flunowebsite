"use client";

/**
 * Fluno doodle system — hand-drawn ink-outline contour characters
 * with flat colour fills, in the "simple funny contour" style.
 * Outlines are ink (#1E1E24); heads are paper so faces read clearly.
 * Characters should sit inside a <DoodleCard> (contrasting backing) so
 * they stay visible on ANY section colour.
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

/** Reveal wrapper — replays the draw-on when the doodle scrolls into view.
 *  Doodles are fully visible by default (see globals); this only animates. */
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
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={`${draw ? "doodle-draw" : ""} ${inView ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

const CARD_BG: Record<ToneKey, string> = {
  coral: "bg-fig-terracotta",
  sunny: "bg-fig-mustard",
  sky: "bg-fig-sky",
  mint: "bg-fig-sage",
  lilac: "bg-fig-lilac",
  paper: "bg-fig-paper",
};

/** Contrasting "sticker" backing so a character is always visible. */
export function DoodleCard({
  children,
  tone = "sunny",
  className = "",
}: {
  children: ReactNode;
  tone?: ToneKey;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[2rem] border-[3px] border-fig-navy shadow-[6px_6px_0_0_#1E1E24] ${CARD_BG[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Face with real character — big eyes, cheeks, smile. */
function Face({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const ex = r * 0.34;
  return (
    <>
      <circle cx={cx - ex} cy={cy - r * 0.05} r={r * 0.12} fill={INK} data-fill />
      <circle cx={cx + ex} cy={cy - r * 0.05} r={r * 0.12} fill={INK} data-fill />
      <circle cx={cx - ex - r * 0.04} cy={cy - r * 0.1} r={r * 0.04} fill={TONE.paper} data-fill />
      <circle cx={cx + ex - r * 0.04} cy={cy - r * 0.1} r={r * 0.04} fill={TONE.paper} data-fill />
      <circle cx={cx - ex * 1.5} cy={cy + r * 0.3} r={r * 0.14} fill={TONE.coral} opacity={0.55} data-fill />
      <circle cx={cx + ex * 1.5} cy={cy + r * 0.3} r={r * 0.14} fill={TONE.coral} opacity={0.55} data-fill />
      <path
        d={`M ${cx - r * 0.34} ${cy + r * 0.24} Q ${cx} ${cy + r * 0.6}, ${cx + r * 0.34} ${cy + r * 0.24}`}
        fill="none"
        stroke={INK}
        strokeWidth={Math.max(2.5, r * 0.11)}
        strokeLinecap="round"
        data-draw="2"
      />
    </>
  );
}

/** Head with a little hair tuft + face. */
function Head({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <path d={`M${cx - r * 0.45} ${cy - r * 0.82} q ${r * 0.15} ${-r * 0.4} ${r * 0.38} ${-r * 0.08}`} {...stroke} strokeWidth={r * 0.18} data-draw />
      <path d={`M${cx + r * 0.02} ${cy - r * 0.98} q ${r * 0.22} ${-r * 0.22} ${r * 0.38} ${r * 0.12}`} {...stroke} strokeWidth={r * 0.18} data-draw />
      <circle cx={cx} cy={cy} r={r} {...stroke} fill={TONE.paper} data-draw />
      <Face cx={cx} cy={cy} r={r} />
    </>
  );
}

function Hand({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} {...stroke} strokeWidth={3.5} fill={TONE.paper} data-draw="2" />;
}

/** Friendly figure with a waving arm. */
export function WavingFig({ className = "", tone = "coral" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 140 180" className={`doodle ${className}`} aria-hidden="true">
      <path d="M60 126 L54 162" {...stroke} data-draw />
      <path d="M78 126 L86 162" {...stroke} data-draw />
      <path d="M48 164 L60 162" {...stroke} strokeWidth={7} data-draw />
      <path d="M84 162 L96 166" {...stroke} strokeWidth={7} data-draw />
      <path d="M44 78 Q70 64 96 78 L88 128 Q70 136 52 128 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M50 86 Q36 106 42 124" {...stroke} data-draw />
      <Hand x={42} y={126} />
      <g style={{ transformOrigin: "90px 86px" }} className="animate-wave">
        <path d="M90 86 Q110 74 112 50" {...stroke} data-draw />
        <Hand x={112} y={47} r={7} />
      </g>
      <Head cx={70} cy={44} r={24} />
    </svg>
  );
}

/** Three little people walking in a row (mid-stride). */
export function WalkingPeople({ className = "" }: { className?: string }) {
  const tones: ToneKey[] = ["coral", "sky", "mint"];
  return (
    <svg viewBox="0 0 330 160" className={`doodle ${className}`} aria-hidden="true">
      {tones.map((t, i) => {
        const x = 50 + i * 115;
        const flip = i === 1 ? -1 : 1;
        return (
          <g key={t} transform={`translate(${x},4)`}>
            <path d={`M-8 100 L${-24 * flip} 138`} {...stroke} data-draw />
            <path d={`M8 100 L${22 * flip} 136`} {...stroke} data-draw />
            <path d="M-20 58 Q0 46 20 58 L16 102 Q0 108 -16 102 Z" {...stroke} fill={TONE[t]} data-draw />
            <path d={`M-15 64 Q${-28 * flip} 80 ${-22 * flip} 96`} {...stroke} data-draw />
            <path d={`M15 64 Q${28 * flip} 74 ${24 * flip} 92`} {...stroke} data-draw />
            <Head cx={0} cy={34} r={18} />
          </g>
        );
      })}
    </svg>
  );
}

/** United happy team — a huddle of figures with raised hands. */
export function HappyTeam({ className = "" }: { className?: string }) {
  const people = [
    { x: 42, tone: "coral" as ToneKey, raise: true },
    { x: 104, tone: "sunny" as ToneKey, raise: false },
    { x: 166, tone: "sky" as ToneKey, raise: true },
    { x: 228, tone: "lilac" as ToneKey, raise: false },
  ];
  return (
    <svg viewBox="0 0 280 190" className={`doodle ${className}`} aria-hidden="true">
      {people.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${i % 2 ? 14 : 0})`}>
          <path d="M-6 132 L-8 168" {...stroke} data-draw />
          <path d="M8 132 L10 168" {...stroke} data-draw />
          <path d="M-22 82 Q0 68 22 82 L18 134 Q0 140 -18 134 Z" {...stroke} fill={TONE[p.tone]} data-draw />
          {p.raise ? (
            <>
              <path d="M-17 88 Q-32 62 -26 42" {...stroke} data-draw />
              <path d="M17 88 Q32 62 26 42" {...stroke} data-draw />
              <Hand x={-26} y={40} />
              <Hand x={26} y={40} />
            </>
          ) : (
            <>
              <path d="M-17 88 Q-32 106 -26 122" {...stroke} data-draw />
              <path d="M17 88 Q32 106 26 122" {...stroke} data-draw />
              <Hand x={-26} y={124} />
              <Hand x={26} y={124} />
            </>
          )}
          <Head cx={0} cy={52} r={21} />
        </g>
      ))}
      <g className="animate-wiggle" style={{ transformOrigin: "140px 22px" }}>
        <path d="M140 8 L140 28 M129 18 L151 18" {...stroke} strokeWidth={5} stroke={TONE.coral} data-draw="3" />
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

/* ─────────────── objects (bright fills — visible on light OR dark) ─────────────── */

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
      <Face cx={50} cy={52} r={16} />
    </svg>
  );
}

export function DoodleSparkle({ className = "", tone = "sunny" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 60 60" className={`doodle ${className}`} aria-hidden="true">
      <path d="M30 4 Q34 26 56 30 Q34 34 30 56 Q26 34 4 30 Q26 26 30 4 Z" {...stroke} strokeWidth={4} fill={TONE[tone]} data-draw />
    </svg>
  );
}

export function DoodleHeart({ className = "", tone = "coral" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 64 60" className={`doodle ${className}`} aria-hidden="true">
      <path d="M32 54 C 6 36, 6 12, 22 12 Q32 12 32 24 Q32 12 42 12 C 58 12, 58 36, 32 54 Z" {...stroke} fill={TONE[tone]} data-draw />
    </svg>
  );
}

export function DoodleDrop({ className = "", tone = "sky" }: { className?: string; tone?: ToneKey }) {
  return (
    <svg viewBox="0 0 60 80" className={`doodle ${className}`} aria-hidden="true">
      <path d="M30 6 C 30 6, 52 38, 52 52 A 22 22 0 0 1 8 52 C 8 38, 30 6, 30 6 Z" {...stroke} fill={TONE[tone]} data-draw />
      <path d="M22 54 Q22 42 30 36" {...stroke} strokeWidth={3.5} stroke={TONE.paper} data-draw="2" />
    </svg>
  );
}

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

/** Wavy squiggle — animated underline under headings. */
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
