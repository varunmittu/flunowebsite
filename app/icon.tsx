import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #D9814F 0%, #C06B3D 100%)",
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: "#F7F3EC",
            fontFamily: "sans-serif",
            letterSpacing: "-1px",
          }}
        >
          f
        </span>
      </div>
    ),
    { ...size }
  );
}
