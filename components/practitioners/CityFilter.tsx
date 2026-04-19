"use client";

import { useRouter, usePathname } from "next/navigation";
import { MapPin, ChevronDown } from "lucide-react";

interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  cityCountMap?: Record<string, number>;
}

export function CityFilter({ cities, selectedCity, cityCountMap = {} }: CityFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;
    if (city) {
      router.replace(`${pathname}?city=${encodeURIComponent(city)}`);
    } else {
      router.replace(pathname);
    }
  }

  if (cities.length === 0) return null;

  const totalCount = Object.values(cityCountMap).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm text-[#6B7280] font-medium shrink-0">
        <MapPin className="w-4 h-4 text-primary-500" />
        <span>Filter by city:</span>
      </div>

      <div className="relative">
        <select
          value={selectedCity}
          onChange={handleChange}
          className="appearance-none w-full sm:w-auto min-w-[200px] text-sm border border-[#E5E7EB] hover:border-primary-400 rounded-xl px-4 py-2.5 pr-10 bg-white text-[#1A1A2E] font-medium focus:outline-none focus:ring-0 focus:border-primary-400 cursor-pointer transition-colors"
        >
          <option value="">
            All Cities {totalCount > 0 ? `(${totalCount})` : ""}
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}{cityCountMap[city] ? ` (${cityCountMap[city]})` : ""}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
      </div>

      {selectedCity && (
        <button
          onClick={() => router.replace(pathname)}
          className="text-xs text-primary-500 hover:text-primary-700 font-medium underline underline-offset-2 transition-colors"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
