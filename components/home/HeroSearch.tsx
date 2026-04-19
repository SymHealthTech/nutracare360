"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { CATEGORIES, CITIES } from "@/lib/constants";

export function HeroSearch() {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-4">
          <Search className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 py-3 text-[#1A1A2E] bg-transparent outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="">All therapy types...</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block w-px bg-[#E5E7EB] my-2" />

        <div className="flex-1 flex items-center gap-2 px-4">
          <MapPin className="w-5 h-5 text-[#6B7280] flex-shrink-0" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 py-3 text-[#1A1A2E] bg-transparent outline-none text-sm appearance-none cursor-pointer"
          >
            <option value="">Any city...</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors flex-shrink-0"
        >
          Find Practitioners &amp; Clinics →
        </button>
      </div>
    </form>
  );
}
