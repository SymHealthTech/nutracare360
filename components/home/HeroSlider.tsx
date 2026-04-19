"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=80",
    alt: "Serene wellness spa",
  },
  {
    src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1920&q=80",
    alt: "Meditation and yoga therapy",
  },
  {
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80",
    alt: "Massage therapy session",
  },
  {
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1920&q=80",
    alt: "Herbal and Ayurvedic medicine",
  },
  {
    src: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=1920&q=80",
    alt: "Acupuncture therapy",
  },
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/70 via-[#0D7377]/50 to-[#1A1A2E]/70" />

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === current ? "bg-white w-6" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
