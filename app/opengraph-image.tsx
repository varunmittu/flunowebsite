import { ImageResponse } from "next/og";

export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt         = "Fluno — Care in Every Drop";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2C2A27",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Soft purple glow — top centre */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: "50%",
            marginLeft: -300,
            width: 600,
            height: 400,
            borderRadius: 300,
            background: "rgba(192, 120, 91,0.20)",
          }}
        />
        {/* Soft purple glow — bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -80,
            width: 400,
            height: 300,
            borderRadius: 200,
            background: "rgba(140,184,154,0.15)",
          }}
        />

        {/* Pill label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 22px",
            borderRadius: 100,
            border: "1px solid rgba(192, 120, 91,0.35)",
            background: "rgba(192, 120, 91,0.12)",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              fontSize: 15,
              color: "rgba(224,169,59,0.95)",
              fontFamily: "sans-serif",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Care in Every Drop
          </span>
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: "white",
            fontFamily: "sans-serif",
            letterSpacing: "-4px",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          fluno
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "sans-serif",
            letterSpacing: "0.01em",
            marginBottom: 40,
          }}
        >
          Mid-premium personal care · Made in India
        </div>

        {/* Badges row */}
        <div style={{ display: "flex", gap: 12 }}>
          {["Everyday Care", "Cruelty-Free", "Made in India"].map((badge) => (
            <div
              key={badge}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 13,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "sans-serif",
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            right: 48,
            fontSize: 16,
            color: "rgba(192, 120, 91,0.6)",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          myfluno.com
        </div>
      </div>
    ),
    { ...size }
  );
}
