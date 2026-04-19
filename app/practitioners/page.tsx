import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { PractitionerCard } from "@/components/practitioners/PractitionerCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Practitioners | NutraCare360",
  description: "Browse all certified complementary and alternative medicine practitioners on NutraCare360 across Canada.",
};

export default async function PractitionersPage() {
  await connectDB();
  const practitioners = await Practitioner.find({ status: "approved" }).sort({ isFeatured: -1, rating: -1 }).lean();

  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-3">
            All Practitioners
          </h1>
          <p className="text-[#6B7280] text-lg">{practitioners.length} certified practitioners across Canada</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {practitioners.map((p: any) => (
            <PractitionerCard key={p.slug} practitioner={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
