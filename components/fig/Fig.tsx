/**
 * The Fluno Figure ("Fig") — v2 character system.
 * Faceless blank-circle-head figure in the packaging palette.
 * Limbs live on separate <g> layers so each joint animates independently.
 * Run-cycle keyframes (.fig-*) are defined in globals.css.
 */

const HEAD = { fill: "#F7F3EC", stroke: "#252B42", strokeWidth: 3.5 };

/** Mid-run pose. `animate` plays the run cycle; static otherwise. */
export function FigRunner({
  animate = false,
  className = "",
  darkGround = false,
}: {
  animate?: boolean;
  className?: string;
  darkGround?: boolean;
}) {
  const a = (cls: string) => (animate ? cls : "");
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <ellipse
        cx="100" cy="238" rx="54" ry="8"
        fill={darkGround ? "#F7F3EC" : "#252B42"}
        opacity={darkGround ? 0.13 : 0.1}
      />
      <g className={a("fig-body")}>
        <g className={a("fig-armB")}>
          <path d="M104 112 C 88 122, 72 120, 62 104" fill="none" stroke="#B96539" strokeWidth="12" strokeLinecap="round" />
        </g>
        <g className={a("fig-legB")}>
          <path d="M98 148 C 84 176, 66 192, 46 198" fill="none" stroke="#8CB89A" strokeWidth="13" strokeLinecap="round" />
          <path d="M46 198 L 33 201" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
        </g>
        <g className={a("fig-legF")}>
          <path d="M104 150 C 120 176, 130 196, 134 216" fill="none" stroke="#8CB89A" strokeWidth="13" strokeLinecap="round" />
          <path d="M134 216 L 148 219" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
        </g>
        <path d="M108 100 L 99 150" fill="none" stroke="#D9814F" strokeWidth="36" strokeLinecap="round" />
        <g className={a("fig-armF")}>
          <path d="M112 116 C 128 122, 140 112, 144 95" fill="none" stroke="#D9814F" strokeWidth="12" strokeLinecap="round" />
        </g>
        <circle cx="123" cy="71" r="20" {...HEAD} />
      </g>
    </svg>
  );
}

/** Arms-up leap — welcome & payment-triumph pose. */
export function FigLeap({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <ellipse cx="100" cy="238" rx="44" ry="7" fill="#252B42" opacity=".1" />
      <path d="M92 88 C 76 72, 68 56, 66 40" fill="none" stroke="#8CB89A" strokeWidth="12" strokeLinecap="round" />
      <path d="M108 88 C 124 72, 132 56, 134 40" fill="none" stroke="#8CB89A" strokeWidth="12" strokeLinecap="round" />
      <path d="M100 82 L 100 130" fill="none" stroke="#8CB89A" strokeWidth="36" strokeLinecap="round" />
      <path d="M96 128 C 82 144, 64 150, 50 146" fill="none" stroke="#252B42" strokeWidth="13" strokeLinecap="round" />
      <path d="M104 128 C 116 148, 118 168, 108 184" fill="none" stroke="#252B42" strokeWidth="13" strokeLinecap="round" />
      <path d="M50 146 L 38 142" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
      <path d="M108 184 L 118 192" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
      <circle cx="100" cy="52" r="20" {...HEAD} />
    </svg>
  );
}

/** Hand-to-brow searching pose — empty states & the "in the lab" card. `animate` sways the torso. */
export function FigSeeker({ animate = false, className = "" }: { animate?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <ellipse cx="100" cy="236" rx="44" ry="7" fill="#252B42" opacity=".1" />
      <g className={animate ? "fig-seek" : ""}>
        <path d="M106 106 C 120 96, 126 84, 116 74" fill="none" stroke="#D9814F" strokeWidth="12" strokeLinecap="round" />
        <path d="M94 112 C 84 122, 86 132, 98 138" fill="none" stroke="#D9814F" strokeWidth="12" strokeLinecap="round" />
        <path d="M100 100 L 100 152" fill="none" stroke="#D9814F" strokeWidth="36" strokeLinecap="round" />
        <circle cx="103" cy="70" r="20" {...HEAD} />
      </g>
      <path d="M97 152 L 88 216" fill="none" stroke="#252B42" strokeWidth="13" strokeLinecap="round" />
      <path d="M103 152 C 114 170, 122 186, 120 210" fill="none" stroke="#252B42" strokeWidth="13" strokeLinecap="round" />
      <path d="M88 216 L 74 218" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
      <path d="M120 210 L 134 214" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

/** Seated, leaning in — support/standards pose. */
export function FigListener({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <rect x="52" y="162" width="82" height="50" rx="10" fill="#FFFDF9" opacity=".55" />
      <ellipse cx="100" cy="236" rx="52" ry="7" fill="#252B42" opacity=".1" />
      <path d="M104 104 L 96 152" fill="none" stroke="#252B42" strokeWidth="36" strokeLinecap="round" />
      <path d="M100 116 C 112 132, 124 142, 136 148" fill="none" stroke="#252B42" strokeWidth="12" strokeLinecap="round" />
      <path d="M96 152 L 134 158" fill="none" stroke="#D9814F" strokeWidth="13" strokeLinecap="round" />
      <path d="M134 158 L 132 210" fill="none" stroke="#D9814F" strokeWidth="13" strokeLinecap="round" />
      <path d="M132 210 L 146 212" fill="none" stroke="#E0A93B" strokeWidth="12" strokeLinecap="round" />
      <circle cx="114" cy="78" r="20" {...HEAD} />
    </svg>
  );
}

/** Compact brand mark: cream head + terracotta body. */
export function FigMark({ size = 30, headStroke = "#252B42" }: { size?: number; headStroke?: string }) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 60 68" aria-hidden="true">
      <path d="M30 36 L30 58" stroke="#D9814F" strokeWidth="17" strokeLinecap="round" />
      <circle cx="30" cy="16" r="11.5" fill="#F7F3EC" stroke={headStroke} strokeWidth="3" />
    </svg>
  );
}
