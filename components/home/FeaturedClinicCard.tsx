import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Building2, Users } from "lucide-react";

interface FeaturedClinicCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  practitioner: any;
}

export function FeaturedClinicCard({ practitioner: p }: FeaturedClinicCardProps) {
  const isClinic = p.practiceType === "clinic" || p.practiceType === "center";
  const displayName = isClinic ? p.clinicDetails?.clinicName || p.businessName : p.businessName || p.name;
  const photo = isClinic ? p.clinicDetails?.logo || p.profilePhoto : p.profilePhoto;
  const badgeLabel = p.practiceType === "clinic" ? "Clinic" : p.practiceType === "center" ? "Centre" : "Practitioner";
  const categories: string[] = p.categories?.slice(0, 3) || [];
  const teamCount: number = p.clinicDetails?.totalPractitioners ?? p.clinicDetails?.teamMembers?.length ?? 0;

  return (
    <Link
      href={`/practitioners/${p.slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Large photo area */}
      <div className="relative h-60 overflow-hidden bg-[#F3F4F6]">
        {photo ? (
          <Image
            src={photo}
            alt={displayName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
            <Building2 className="w-16 h-16 text-primary-200" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badgeLabel}
          </span>
        </div>

        {/* Rating overlay on image bottom */}
        {p.rating > 0 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-[#1A1A2E]">{p.rating?.toFixed(1)}</span>
            {p.reviewCount > 0 && (
              <span className="text-xs text-[#6B7280]">({p.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-playfair text-lg font-semibold text-[#1A1A2E] mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {displayName}
        </h3>

        {/* Location */}
        {(p.city || p.province) && (
          <div className="flex items-center gap-1.5 text-[#6B7280] text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary-400" />
            <span className="line-clamp-1">{[p.city, p.province].filter(Boolean).join(", ")}</span>
          </div>
        )}

        {/* Team count */}
        {teamCount > 0 && (
          <div className="flex items-center gap-1.5 text-[#6B7280] text-xs mb-3">
            <Users className="w-3.5 h-3.5 text-primary-400" />
            <span>{teamCount} practitioners on team</span>
          </div>
        )}

        {/* Specialties */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="bg-primary-50 text-primary-700 text-xs px-2.5 py-0.5 rounded-full border border-primary-100"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Bio */}
        {p.bio && (
          <p className="text-sm text-[#6B7280] line-clamp-2 mb-4 flex-1">{p.bio}</p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 border-t border-[#F3F4F6]">
          <span className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
            {isClinic ? "View Clinic Profile" : "View Practitioner Profile"}
            <span className="text-base leading-none">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
