import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "fluno-purple":      "#BD7EFA",
        "fluno-purple-dark": "#9B5DE5",
        "fluno-purple-deep": "#7C3AED",
        "fluno-dark":        "#0D0618",
        "fluno-darker":      "#070310",
        "fluno-light":       "#FAF7FF",
        "fluno-lavender":    "#EDE9FF",
        "fluno-ink":         "#1A0A2E",
        "fluno-muted":       "#6B5F7A",
        "fluno-glow":        "#DDB8FF",
        // keep old names so checkout/order pages don't break
        "fluno-bg":          "#FAF7FF",
        "fluno-teal":        "#BD7EFA",
        "fluno-teal-light":  "#9B5DE5",
        "fluno-blush":       "#DDB8FF",
        "fluno-stone":       "#EDE9FF",
        // v2 "Fluno Figure" packaging palette
        "fig-terracotta":      "#D9814F",
        "fig-terracotta-deep": "#C06B3D",
        "fig-sage":            "#8CB89A",
        "fig-mustard":         "#E0A93B",
        "fig-navy":            "#252B42",
        "fig-navy-soft":       "#33395A",
        "fig-cream":           "#F7F3EC",
        "fig-paper":           "#FFFDF9",
        "fig-ink-soft":        "#4A4F66",
      },
      fontFamily: {
        brand:   ["var(--font-quicksand)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        body:    ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-ibm-plex-mono)", "monospace"],
        fig:     ["var(--font-general-sans)", "var(--font-inter)", "sans-serif"],
        "fig-body": ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":        "fadeUp 0.7s ease-out both",
        "fade-in":        "fadeIn 0.5s ease-out both",
        "slide-in-right": "slideInRight 0.35s ease-out both",
        float:            "float 6s ease-in-out infinite",
        marquee:          "marquee 30s linear infinite",
        "spin-slow":      "spin 20s linear infinite",
        orb1:             "orb1 9s ease-in-out infinite",
        orb2:             "orb2 11s ease-in-out infinite",
        orb3:             "orb3 13s ease-in-out infinite 2s",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-18px)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        orb1: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(40px,-50px) scale(1.1)" },
          "66%":      { transform: "translate(-20px,30px) scale(0.9)" },
        },
        orb2: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "40%":      { transform: "translate(-60px,40px) scale(1.08)" },
          "80%":      { transform: "translate(30px,-20px) scale(0.95)" },
        },
        orb3: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%":      { transform: "translate(25px,35px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
