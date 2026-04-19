import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All 37 Therapy Categories | NutraCare360",
  description: "Browse all 37 complementary and alternative medicine categories available on NutraCare360. Find certified practitioners across Canada.",
};

export default function CategoriesPage() {
  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            All Therapy Categories
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Explore 37 complementary and alternative medicine disciplines. Each category connects you with certified, vetted practitioners across Canada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-md hover:border-primary-200 transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white text-lg font-bold"
                style={{
                  background: idx % 3 === 0
                    ? "linear-gradient(135deg, #0D7377, #52B788)"
                    : idx % 3 === 1
                    ? "linear-gradient(135deg, #0b676b, #0D7377)"
                    : "linear-gradient(135deg, #52B788, #0D7377)",
                }}
              >
                {cat.name.charAt(0)}
              </div>
              <h2 className="font-playfair font-semibold text-[#1A1A2E] text-base mb-2 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{cat.description}</p>
              <div className="flex items-center gap-1 text-xs text-primary-500 font-medium">
                Browse Practitioners <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
