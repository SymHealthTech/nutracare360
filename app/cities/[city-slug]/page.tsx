import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { CITIES } from "@/lib/constants";
import { CityPageClient } from "./CityPageClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: { "city-slug": string } }

function slugToCity(slug: string): string | undefined {
  return CITIES.find((c) => c.toLowerCase().replace(/\s+/g, "-") === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = slugToCity(params["city-slug"]);
  if (!city) return {};
  return {
    title: `Holistic Health Practitioners in ${city} | NutraCare360`,
    description: `Find certified complementary and alternative medicine practitioners in ${city}, Canada. Browse profiles on NutraCare360.`,
  };
}

export default async function CityPage({ params }: Props) {
  const city = slugToCity(params["city-slug"]);
  if (!city) notFound();

  await connectDB();
  const practitioners = await Practitioner.find({
    status: "approved",
    "address.city": { $regex: new RegExp(city, "i") },
  }).sort({ rating: -1 }).lean();

  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/cities" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Cities
        </Link>

        <div className="mb-8">
          <div className="inline-block bg-primary-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
            {practitioners.length} Practitioners
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-3">
            Holistic Health in {city}
          </h1>
          <p className="text-[#6B7280] text-lg">Find certified complementary medicine practitioners in {city}, Canada.</p>
        </div>

        {practitioners.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6B7280] mb-4">No practitioners found in {city} yet.</p>
            <Link href="/join-us" className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
              Be the First to List in {city}
            </Link>
          </div>
        ) : (
          <CityPageClient city={city} practitioners={practitioners} />
        )}
      </div>
    </div>
  );
}
