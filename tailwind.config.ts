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
        // v3 bright "doodle" palette (fig-* names kept, values re-skinned)
        "fig-terracotta":      "#FF6B5C", // coral (primary accent)
        "fig-terracotta-deep": "#F0503F", // deep coral (hovers)
        "fig-sage":            "#6FE0B0", // mint
        "fig-mustard":         "#FFC94D", // sunny
        "fig-sky":             "#5AB2FF", // sky blue
        "fig-lilac":           "#B49BFF", // lilac
        "fig-navy":            "#1E1E24", // ink (dark surfaces / outlines / text)
        "fig-navy-soft":       "#33333D",
        "fig-cream":           "#FFF9EC", // warm paper (light bg)
        "fig-paper":           "#FFFDF7", // paper
        "fig-ink-soft":        "#5A5A66", // muted ink text
      },
      fontFamily: {
        brand:   ["var(--font-quicksand)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
        body:    ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-ibm-plex-mono)", "monospace"],
        fig:     ["var(--font-quicksand)", "var(--font-inter)", "sans-serif"],
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
        // doodle motions
        wiggle:           "wiggle 2.8s ease-in-out infinite",
        "wiggle-slow":    "wiggle 5s ease-in-out infinite",
        bob:              "bob 3s ease-in-out infinite",
        "bob-slow":       "bob 5s ease-in-out infinite",
        wave:             "wave 1.6s ease-in-out infinite",
        "spin-slower":    "spin 26s linear infinite",
        "pop-in":         "popIn 0.5s cubic-bezier(.34,1.56,.64,1) both",
        "dash-march":     "dashMarch 1.2s linear infinite",
        "draw-on":        "drawOn 1.2s ease-out both",
        blink:            "blink 4s step-end infinite",
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
        // doodle keyframes
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%":      { transform: "rotate(3deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%":      { transform: "rotate(18deg)" },
          "75%":      { transform: "rotate(-8deg)" },
        },
        popIn: {
          "0%":   { opacity: "0", transform: "scale(0.6) rotate(-6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        dashMarch: {
          to: { "stroke-dashoffset": "-16" },
        },
        drawOn: {
          from: { "stroke-dashoffset": "1000" },
          to:   { "stroke-dashoffset": "0" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "96%":           { transform: "scaleY(0.1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
