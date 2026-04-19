import { connectDB } from "@/lib/db";
import SuccessStory from "@/models/SuccessStory";
import { StarRating } from "@/components/ui/StarRating";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Success Stories | NutraCare360",
  description: "Real stories from Canadians who found healing through complementary medicine practitioners on NutraCare360.",
};

export default async function SuccessStoriesPage() {
  await connectDB();
  const stories = await SuccessStory.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            Real Stories, Real Healing
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Canadians sharing their transformative experiences with complementary health practitioners discovered on NutraCare360.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {stories.map((story: any) => (
            <div key={story._id?.toString()} className="bg-white rounded-2xl p-7 border border-[#E5E7EB] hover:shadow-md transition-shadow">
              <StarRating rating={story.rating} />
              <p className="text-[#374151] leading-relaxed mt-4 mb-5 italic text-sm">
                &ldquo;{story.story}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                <div>
                  <div className="font-semibold text-sm text-[#1A1A2E]">{story.patientName}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">{story.patientCity}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium">{story.therapyType}</div>
                  <div className="text-xs text-[#6B7280] mt-1">with {story.practitionerName}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-20 text-[#6B7280]">No stories yet. Be the first to share yours!</div>
        )}
      </div>
    </div>
  );
}
