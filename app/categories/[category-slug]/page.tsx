import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { PractitionerCard } from "@/components/practitioners/PractitionerCard";
import { CityFilter } from "@/components/practitioners/CityFilter";
import { CATEGORIES } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { "category-slug": string };
  searchParams: { city?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params["category-slug"]);
  if (!cat) return {};
  return {
    title: `${cat.name} Practitioners in Canada | NutraCare360`,
    description: `Find certified ${cat.name} practitioners across Canada. ${cat.description}. Browse profiles, read credentials, and connect directly.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const cat = CATEGORIES.find((c) => c.slug === params["category-slug"]);
  if (!cat) notFound();

  await connectDB();

  const allPractitioners = await Practitioner.find({
    status: "approved",
    categories: { $regex: new RegExp(cat.name, "i") },
  })
    .sort({ rating: -1 })
    .lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cityCountMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const p of allPractitioners as any[]) {
    const city = p.address?.city?.trim();
    if (city) cityCountMap[city] = (cityCountMap[city] ?? 0) + 1;
  }
  const cities: string[] = Object.keys(cityCountMap).sort();

  const selectedCity = (searchParams.city ?? "").trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const practitioners = selectedCity
    ? (allPractitioners as any[]).filter(
        (p) =>
          p.address?.city?.trim().toLowerCase() === selectedCity.toLowerCase()
      )
    : allPractitioners;

  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> All Categories
        </Link>

        <div className="mb-8">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-3"
            style={{ background: "linear-gradient(135deg, #0D7377, #52B788)" }}
          >
            {practitioners.length} Practitioners{selectedCity ? ` in ${selectedCity}` : ""}
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-3">
            {cat.name} Practitioners{selectedCity ? ` in ${selectedCity}` : " in Canada"}
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl">{cat.description}</p>
        </div>

        {cities.length > 0 && (
          <div className="mb-8 p-4 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <CityFilter cities={cities} selectedCity={selectedCity} cityCountMap={cityCountMap} />
          </div>
        )}

        {practitioners.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6B7280] mb-4">
              {selectedCity
                ? `No practitioners found in ${selectedCity} for this category.`
                : "No practitioners found for this category yet."}
            </p>
            {!selectedCity && (
              <Link
                href="/join-us"
                className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors"
              >
                Be the First to List
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(practitioners as any[]).map((p) => (
              <PractitionerCard key={p.slug} practitioner={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
