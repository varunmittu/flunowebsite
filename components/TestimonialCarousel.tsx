"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ashwini R.",
    location: "India",
    text: "I switched to Fluno hand wash two months ago and my hands actually feel soft now. I was skeptical at first but the difference is real.",
    rating: 5,
    product: "Gentle Hand Wash",
    initials: "AR",
  },
  {
    name: "Srikar V.",
    location: "Bangalore",
    text: "The sunscreen doesn't leave any white cast — that's rare in this price range. I've already recommended it to my whole family.",
    rating: 5,
    product: "Everyday Sunscreen SPF 50",
    initials: "SV",
  },
  {
    name: "Manish K.",
    location: "Mumbai",
    text: "Quality you can feel the moment you use it. These guys clearly know what they're doing with ingredients.",
    rating: 4,
    product: "Everyday Sunscreen SPF 50",
    initials: "MK",
  },
  {
    name: "Priya N.",
    location: "Chennai",
    text: "Finally a sunscreen that doesn't feel greasy. My skin has been looking so much better since I started using it consistently.",
    rating: 5,
    product: "Everyday Sunscreen SPF 50",
    initials: "PN",
  },
  {
    name: "Rahul S.",
    location: "Delhi",
    text: "Honest brand, honest pricing. Love that they don't use clever marketing tricks — just good products that work.",
    rating: 5,
    product: "Gentle Hand Wash",
    initials: "RS",
  },
];

export default function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden -mx-3">
        <div className="flex touch-pan-y">
          {testimonials.map((t) => (
            <div key={t.name} className="flex-none w-full sm:w-1/2 lg:w-1/3 px-3">
              <div className="card p-7 h-full flex flex-col relative overflow-hidden group">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-fluno-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= t.rating ? "fill-fluno-purple text-fluno-purple" : "fill-fluno-lavender text-fluno-lavender"}
                    />
                  ))}
                </div>

                <p className="font-body text-fluno-ink/70 leading-relaxed italic flex-1 relative z-10 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fluno-purple to-fluno-purple-dark flex items-center justify-center flex-shrink-0">
                    <span className="font-brand font-bold text-xs text-white">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-brand font-semibold text-fluno-ink text-sm">{t.name}</p>
                    <p className="font-mono text-[10px] text-fluno-muted/60">{t.location} · {t.product}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots + Nav */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={scrollPrev}
          className="w-9 h-9 rounded-full border border-fluno-lavender flex items-center justify-center text-fluno-ink hover:border-fluno-purple hover:text-fluno-purple transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 bg-fluno-purple"
                  : "w-2 bg-fluno-lavender hover:bg-fluno-purple/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-9 h-9 rounded-full border border-fluno-lavender flex items-center justify-center text-fluno-ink hover:border-fluno-purple hover:text-fluno-purple transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
