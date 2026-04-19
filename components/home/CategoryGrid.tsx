"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  slug: string;
  name: string;
  description: string;
}

const MOBILE_LIMIT = 8;
const DESKTOP_LIMIT = 12;

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  const mobileVisible = mobileExpanded ? categories : categories.slice(0, MOBILE_LIMIT);
  const desktopVisible = desktopExpanded ? categories : categories.slice(0, DESKTOP_LIMIT);
  const mobileRemaining = categories.length - MOBILE_LIMIT;
  const desktopRemaining = categories.length - DESKTOP_LIMIT;

  const cardStyle = (idx: number) =>
    idx % 4 === 0
      ? "linear-gradient(135deg, #0D7377, #52B788)"
      : idx % 4 === 1
      ? "linear-gradient(135deg, #0b676b, #0D7377)"
      : idx % 4 === 2
      ? "linear-gradient(135deg, #52B788, #0D7377)"
      : "linear-gradient(135deg, #095053, #52B788)";

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {mobileVisible.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl p-4 text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: cardStyle(idx) }}
            >
              <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-white/80 line-clamp-2">{cat.description}</p>
            </Link>
          ))}
        </div>

        {!mobileExpanded && mobileRemaining > 0 && (
          <button
            onClick={() => setMobileExpanded(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-300 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Show {mobileRemaining} more categories
          </button>
        )}

        {mobileExpanded && (
          <button
            onClick={() => setMobileExpanded(false)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-300 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Show less
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {desktopVisible.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl p-5 text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: cardStyle(idx) }}
            >
              <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
              <p className="text-xs text-white/80 line-clamp-2">{cat.description}</p>
              <ArrowRight className="w-4 h-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>

        {!desktopExpanded && desktopRemaining > 0 && (
          <button
            onClick={() => setDesktopExpanded(true)}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-300 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Show {desktopRemaining} more categories
          </button>
        )}

        {desktopExpanded && (
          <button
            onClick={() => setDesktopExpanded(false)}
            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-primary-300 text-primary-600 font-semibold text-sm hover:bg-primary-50 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Show less
          </button>
        )}
      </div>
    </>
  );
}
