"use client";

import { useState } from "react";
import { PractitionerCard } from "@/components/practitioners/PractitionerCard";
import { CATEGORIES } from "@/lib/constants";
import { X } from "lucide-react";
import Link from "next/link";

interface Props {
  city: string;
  practitioners: unknown[];
}

export function CityPageClient({ city, practitioners }: Props) {
  const [category, setCategory] = useState("");

  const filtered = category
    ? practitioners.filter((p: any) =>
        p.categories?.some((c: string) =>
          c.toLowerCase() === category.toLowerCase()
        )
      )
    : practitioners;

  return (
    <>
      {/* Category filter */}
      <div className="flex items-center gap-3 mb-8">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition min-w-[220px]"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.name}>{c.name}</option>
          ))}
        </select>
        {category && (
          <button
            onClick={() => setCategory("")}
            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600 font-medium"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        <span className="text-sm text-[#6B7280] ml-auto">
          {filtered.length} practitioner{filtered.length !== 1 ? "s" : ""}
          {category ? ` in "${category}"` : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#6B7280] mb-4">
            No {category} practitioners found in {city}.
          </p>
          <button
            onClick={() => setCategory("")}
            className="text-primary-500 hover:text-primary-600 font-medium text-sm"
          >
            Show all practitioners
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filtered as any[]).map((p: any) => (
            <PractitionerCard key={p.slug} practitioner={p} />
          ))}
        </div>
      )}
    </>
  );
}
