"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf } from "lucide-react";
import gsap from "gsap";

const CHARS = "fluno".split("");

const badges = [
  { icon: Leaf, label: "Clean Formula", sub: "No harsh chemicals" },
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        .from(".hero-char", {
          opacity: 0,
          y: 100,
          rotateX: -90,
          stagger: 0.08,
          duration: 0.85,
          ease: "back.out(1.3)",
          transformOrigin: "50% 100% -20px",
        })
        .from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.55 }, 0.35)
        .from(".hero-tagline", { opacity: 0, y: 22, duration: 0.6 }, 0.48)
        .from(".hero-desc", { opacity: 0, y: 18, duration: 0.55 }, 0.62)
        .from(".hero-cta > *", { opacity: 0, y: 16, stagger: 0.12, duration: 0.5 }, 0.74)
        .from(".hero-badge", { opacity: 0, y: 14, stagger: 0.1, duration: 0.45 }, 0.88)
        .from(".hero-image-wrap", { opacity: 0, x: 70, duration: 0.95, ease: "power3.out" }, 0.4)
        .from(".hero-float-badge", { opacity: 0, scale: 0.8, stagger: 0.15, duration: 0.5, ease: "back.out(1.5)" }, 0.9);

      // Continuous floating on image
      gsap.to(".hero-image-wrap", {
        y: -18,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Badge micro-floats
      gsap.to(".float-b1", { y: 10, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".float-b2", { y: -10, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.7 });
      gsap.to(".float-b3", { y: 7, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-fluno-dark"
    >
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-orb1 absolute top-[8%]  left-[5%]  w-[650px] h-[650px] rounded-full bg-fluno-purple/22 blur-[140px]" />
        <div className="animate-orb2 absolute bottom-[5%] right-[5%] w-[750px] h-[750px] rounded-full bg-fluno-purple-deep/18 blur-[180px]" />
        <div className="animate-orb3 absolute top-[45%] left-[40%] w-[400px] h-[400px] rounded-full bg-fluno-glow/10 blur-[100px]" />
        <div
          className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(189,126,250,0.25) 0%, transparent 70%)",
            animation: "orb4 9s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(189,126,250,0.8) 20deg, transparent 40deg)",
            animation: "spin 20s linear infinite",
          }}
        />
      </div>

      {/* ── Grid ── */}
      <div
        className="absolute inset-0 opacity-[0.032] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(189,126,250,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(189,126,250,.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(9,9,15,0.65) 100%)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: text ── */}
          <div>
            {/* Eyebrow */}
            <div className="hero-eyebrow flex items-center gap-3 mb-7">
              <span className="h-px w-8 bg-fluno-purple/60" />
              <span className="font-mono text-xs text-fluno-purple/80 tracking-[0.2em] uppercase">
                Made in India · Personal Care
              </span>
            </div>

            {/* Brand wordmark — GSAP char animation */}
            <div
              className="font-brand font-bold leading-none text-white tracking-tight mb-1"
              style={{ fontSize: "clamp(5rem, 12vw, 9.5rem)" }}
              aria-label="fluno"
            >
              {CHARS.map((ch, i) => (
                <span
                  key={i}
                  className="hero-char inline-block"
                  style={{
                    textShadow:
                      "0 0 60px rgba(189,126,250,0.55), 0 0 120px rgba(189,126,250,0.2)",
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>

            {/* Tagline */}
            <p className="hero-tagline font-display text-2xl md:text-3xl text-fluno-glow/75 mb-7 -mt-1">
              Care in Every Drop
            </p>

            {/* Description */}
            <p className="hero-desc font-body text-[1.05rem] text-white/45 max-w-md leading-[1.8]">
              Clean ingredients. Honest pricing. Mid-premium personal care
              formulated with intention — for skin that truly deserves better.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-wrap gap-4 mt-10">
              <Link href="/shop" className="btn-primary text-base px-8 py-4 shadow-lg shadow-fluno-purple/25">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/about" className="btn-outline-white text-base px-8 py-4">
                Our Story
              </Link>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-3 mt-8">
              {badges.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="hero-badge glass flex items-center gap-3 px-4 py-2.5">
                  <div className="w-7 h-7 bg-fluno-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-fluno-purple" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-semibold text-white">{label}</p>
                    <p className="font-mono text-[10px] text-white/35">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* ── Right: product visual ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-fluno-purple/20 blur-[90px] rounded-full scale-90" />

              {/* Product image */}
              <div className="hero-image-wrap relative z-10 w-[310px] h-[380px] rounded-3xl overflow-hidden glow-purple">
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
                  alt="Fluno personal care products"
                  fill
                  priority
                  className="object-cover"
                  sizes="310px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fluno-dark/50 to-transparent" />
                {/* Price tag overlay */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="glass px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-fluno-purple">Everyday Sunscreen</p>
                      <p className="font-display text-sm text-white font-semibold mt-0.5">SPF 50+ PA++++</p>
                    </div>
                    <p className="font-brand font-bold text-xl text-fluno-purple">₹499</p>
                  </div>
                </div>
              </div>

              {/* Float badge 1 — top right */}
              <div className="hero-float-badge float-b1 glass absolute -top-5 -right-12 px-4 py-3 z-20">
                <p className="font-mono text-[10px] text-fluno-purple">Broad Spectrum</p>
                <p className="font-display text-sm text-white mt-0.5">SPF 50+</p>
              </div>

              {/* Float badge 2 — bottom left */}
              <div className="hero-float-badge float-b2 glass absolute -bottom-4 -left-12 px-4 py-3 z-20">
                <p className="font-mono text-[10px] text-fluno-purple">Cruelty-Free</p>
                <p className="font-display text-sm text-white mt-0.5">Always ✓</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-fluno-light to-transparent pointer-events-none" />
    </section>
  );
}
