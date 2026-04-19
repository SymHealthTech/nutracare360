import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Award } from "lucide-react";
import { successStories } from "@/components/about/successStoriesData";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = successStories.find((s) => s.slug === params.slug);
  if (!story) return {};
  return {
    title: `${story.patientName}'s Story | NutraCare360`,
    description: story.excerpt,
  };
}

export default function StoryPage({ params }: Props) {
  const story = successStories.find((s) => s.slug === params.slug);
  if (!story) notFound();

  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/about#success-stories"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Stories
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main story */}
          <article className="lg:col-span-2">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: story.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-secondary-400 text-secondary-400" />
              ))}
            </div>

            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-6 leading-tight">
              {story.patientName}&apos;s Healing Journey
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-100">
                <Image
                  src={story.patientAvatar}
                  alt={story.patientName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="font-semibold text-[#1A1A2E]">{story.patientName}</div>
                <div className="text-sm text-[#6B7280] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {story.patientCity}
                </div>
              </div>
              <span className="ml-auto text-xs bg-accent-50 text-accent-700 px-3 py-1 rounded-full font-medium">
                {story.therapyType}
              </span>
            </div>

            <div
              className="prose prose-p:text-[#374151] prose-p:leading-relaxed prose-p:mb-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: story.fullStory }}
            />

            <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
              <p className="text-xs text-[#9CA3AF] italic">
                Individual results vary. These testimonials reflect personal experiences and are not medical claims. Always consult a qualified healthcare professional.
              </p>
            </div>
          </article>

          {/* Practitioner sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sticky top-28">
              <div className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Featured Practitioner
              </div>

              <div className="relative w-full h-36 rounded-xl overflow-hidden mb-4">
                <Image
                  src={story.practitioner.image}
                  alt={story.practitioner.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <Link
                href={`/practitioners/${story.practitioner.slug}`}
                className="font-playfair font-bold text-lg text-[#1A1A2E] hover:text-primary-600 transition-colors leading-snug block"
              >
                {story.practitioner.name}
              </Link>

              <p className="text-xs text-[#6B7280] mt-1">{story.practitioner.designation}</p>
              <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {story.practitioner.city}
              </p>

              <Link
                href={`/practitioners/${story.practitioner.slug}`}
                className="mt-5 w-full flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                View Full Profile
              </Link>
              <Link
                href="/practitioners"
                className="mt-2 w-full flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB] text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                Browse All Practitioners
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
