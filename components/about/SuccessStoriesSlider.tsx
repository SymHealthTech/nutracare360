"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { successStories } from "./successStoriesData";

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-secondary-400 text-secondary-400" />
      ))}
    </div>
  );
}

export default function SuccessStoriesSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % successStories.length), []);
  const prev = useCallback(() => setActive((i) => (i - 1 + successStories.length) % successStories.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next]);

  const story = successStories[active];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Card */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left — story */}
          <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-between">
            <div>
              <Quote className="w-10 h-10 text-primary-200 mb-4" />
              <StarRow count={story.rating} />
              <p className="mt-4 text-[#374151] text-base leading-relaxed italic">
                &ldquo;{story.excerpt}&rdquo;
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100 shrink-0">
                <Image
                  src={story.patientAvatar}
                  alt={story.patientName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="font-semibold text-[#1A1A2E] text-sm">{story.patientName}</div>
                <div className="text-xs text-[#6B7280]">{story.patientCity}</div>
              </div>
              <span className="ml-auto text-xs bg-accent-50 text-accent-700 px-3 py-1 rounded-full font-medium">
                {story.therapyType}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href={`/success-stories/${story.slug}`}
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors underline underline-offset-2"
              >
                Read Full Story →
              </Link>
            </div>
          </div>

          {/* Right — practitioner card */}
          <div className="lg:col-span-2 bg-primary-50 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] p-8 flex flex-col justify-center">
            <div className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-4">
              {story.practitioner.type === "center"
                ? "Featured Center"
                : story.practitioner.type === "clinic"
                ? "Featured Clinic"
                : "Featured Practitioner"}
            </div>
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden mb-4 border border-primary-100">
              <Image
                src={story.practitioner.image}
                alt={story.practitioner.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <Link
              href={`/practitioners/${story.practitioner.slug}`}
              className="font-playfair font-bold text-lg text-[#1A1A2E] hover:text-primary-600 transition-colors leading-snug"
            >
              {story.practitioner.name}
            </Link>
            <div className="text-xs text-[#6B7280] mt-1">{story.practitioner.designation}</div>
            <div className="text-xs text-[#6B7280] mt-0.5">{story.practitioner.city}</div>
            <Link
              href={`/practitioners/${story.practitioner.slug}`}
              className="mt-5 inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-primary-50 flex items-center justify-center transition-colors"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
        </button>

        <div className="flex gap-2">
          {successStories.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-primary-500" : "w-2 bg-[#D1D5DB]"
              }`}
              aria-label={`Story ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full border border-[#E5E7EB] bg-white hover:bg-primary-50 flex items-center justify-center transition-colors"
          aria-label="Next story"
        >
          <ChevronRight className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>
    </div>
  );
}
