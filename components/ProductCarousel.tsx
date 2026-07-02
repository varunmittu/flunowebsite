"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

export default function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)":  { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Nav buttons */}
      <div className="flex gap-2 absolute -top-14 right-0 z-10">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full border-2 border-fluno-lavender flex items-center justify-center text-fluno-ink hover:border-fluno-purple hover:text-fluno-purple transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full border-2 border-fluno-lavender flex items-center justify-center text-fluno-ink hover:border-fluno-purple hover:text-fluno-purple transition-all"
          aria-label="Next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden -mx-3">
        <div className="flex touch-pan-y">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 px-3"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
