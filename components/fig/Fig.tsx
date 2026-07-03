/**
 * Fluno brand mark — a simple care droplet in the packaging palette.
 * Non-character; used in the header and footer logo lockups.
 */
export function FigMark({ size = 30, headStroke = "#252B42" }: { size?: number; headStroke?: string }) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 60 68" aria-hidden="true">
      {/* droplet body */}
      <path
        d="M30 6 C 30 6, 49 30, 49 44 A 19 19 0 0 1 11 44 C 11 30, 30 6, 30 6 Z"
        fill="#D9814F"
        stroke={headStroke}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* highlight */}
      <circle cx="23" cy="42" r="5.5" fill="#F7F3EC" opacity="0.85" />
    </svg>
  );
}
