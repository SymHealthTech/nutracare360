"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { CITIES, CATEGORIES } from "@/lib/constants";
import { useState } from "react";

export default function CitiesPage() {
  const [category, setCategory] = useState("");

  const buildHref = (city: string) => {
    const params = new URLSearchParams({ city });
    if (category) params.set("category", category);
    return `/search?${params.toString()}`;
  };

  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            Find Practitioners by City
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            We cover 25+ Canadian cities. Find holistic health practitioners in your area.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-sm">
            <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wider text-center">
              Filter by Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city}
              href={buildHref(city)}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <MapPin className="w-6 h-6 text-primary-500 mx-auto mb-2 group-hover:text-primary-600" />
              <div className="text-sm font-semibold text-[#1A1A2E]">{city}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
