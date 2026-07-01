"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-fluno-dark">
      {/* Cinematic animated gradient — video-like atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary moving orbs */}
        <div className="animate-orb1 absolute top-[8%] left-[5%]  w-[650px] h-[650px] rounded-full bg-fluno-purple/22 blur-[140px]" />
        <div className="animate-orb2 absolute bottom-[5%] right-[5%] w-[750px] h-[750px] rounded-full bg-fluno-purple-deep/18 blur-[180px]" />
        <div className="animate-orb3 absolute top-[45%] left-[40%] w-[400px] h-[400px] rounded-full bg-fluno-glow/10 blur-[100px]" />
        {/* Extra accent orbs for depth */}
        <div
          className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(189,126,250,0.25) 0%, transparent 70%)",
            animation: "orb4 9s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute bottom-[25%] left-[15%] w-[250px] h-[250px] rounded-full blur-[90px] opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(116,201,191,0.2) 0%, transparent 70%)",
            animation: "orb5 11s ease-in-out infinite alternate",
          }}
        />
        {/* Sweeping light beam */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(189,126,250,0.8) 20deg, transparent 40deg)",
            animation: "spin 18s linear infinite",
          }}
        />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(189,126,250,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(189,126,250,.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Film vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 50%, rgba(9,9,15,0.6) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={item} className="flex items-center gap-2 mb-6">
              <Sparkles size={14} className="text-fluno-purple" />
              <span className="eyebrow text-fluno-purple/80">
                Hyderabad · India · Personal Care
              </span>
            </motion.div>

            <motion.div variants={item}>
              <h1 className="font-brand font-bold text-[7rem] md:text-[9rem] leading-none text-white text-glow tracking-tight">
                fluno
              </h1>
              <p className="font-display text-2xl md:text-3xl text-fluno-glow/80 -mt-2">
                Care in Every Drop
              </p>
            </motion.div>

            <motion.p variants={item} className="font-body text-lg text-white/45 mt-7 max-w-lg leading-relaxed">
              Clean ingredients. Honest pricing. Mid-premium personal care
              formulated with intention — for skin that truly deserves better.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 mt-10">
              <Link href="/shop" className="btn-primary text-base px-8 py-4">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/shop" className="btn-outline-white text-base px-8 py-4">
                View Products
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/10"
            >
              {[
                ["1,000+", "Units Sold"],
                ["4.5/5",  "Avg. Rating"],
                ["50%+",   "Repeat Rate"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="font-brand font-bold text-2xl text-fluno-purple">{val}</p>
                  <p className="font-mono text-xs text-white/30 mt-1 tracking-wide">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Floating product */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-fluno-purple/25 blur-[80px] rounded-full scale-90" />

              {/* Product image */}
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-[320px] h-[380px] rounded-3xl overflow-hidden glow-purple"
              >
                <Image
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
                  alt="Fluno products"
                  fill
                  priority
                  className="object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-fluno-dark/40 to-transparent" />
              </motion.div>

              {/* Badge 1 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="glass absolute -top-5 -right-10 px-4 py-3 z-20"
              >
                <p className="font-mono text-xs text-fluno-purple">SPF 50+ PA++++</p>
                <p className="font-display text-sm text-white mt-0.5">EU-Standard ✓</p>
              </motion.div>

              {/* Badge 2 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="glass absolute -bottom-4 -left-10 px-4 py-3 z-20"
              >
                <p className="font-mono text-xs text-fluno-purple">Dermatologist</p>
                <p className="font-display text-sm text-white mt-0.5">Tested ✓</p>
              </motion.div>

              {/* Rating badge */}
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="glass absolute top-1/2 -left-12 px-3 py-2 z-20 -translate-y-1/2"
              >
                <p className="font-brand font-bold text-lg text-fluno-purple">4.5</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4].map(i => (
                    <svg key={i} className="w-3 h-3 fill-fluno-purple" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                  <svg className="w-3 h-3 fill-fluno-purple/40" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to light */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-fluno-light to-transparent" />
    </section>
  );
}
