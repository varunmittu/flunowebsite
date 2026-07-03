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
              <div className="bg-fig-paper border border-fig-navy/10 rounded-2xl p-7 h-full flex flex-col relative overflow-hidden group">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-fig-terracotta/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= t.rating ? "fill-fig-terracotta text-fig-terracotta" : "fill-fig-sage text-fig-sage"}
                    />
                  ))}
                </div>

                <p className="font-fig-body text-fig-navy/70 leading-relaxed italic flex-1 relative z-10 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fig-terracotta to-fig-terracotta-deep flex items-center justify-center flex-shrink-0">
                    <span className="font-fig font-bold text-xs text-white">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-fig font-bold font-semibold text-fig-navy text-sm">{t.name}</p>
                    <p className="font-fig-body text-[10px] text-fig-ink-soft/60">{t.location} · {t.product}</p>
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
          className="w-9 h-9 rounded-full border border-fig-sage flex items-center justify-center text-fig-navy hover:border-fig-terracotta hover:text-fig-terracotta transition-all"
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
                  ? "w-6 bg-fig-terracotta"
                  : "w-2 bg-fig-sage hover:bg-fig-terracotta/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-9 h-9 rounded-full border border-fig-sage flex items-center justify-center text-fig-navy hover:border-fig-terracotta hover:text-fig-terracotta transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
