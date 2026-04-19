import Image from "next/image";
import Link from "next/link";
import { MapPin, CheckCircle } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

interface PractitionerCardProps {
  practitioner: {
    name: string;
    slug: string;
    practiceType?: "individual" | "clinic" | "center";
    profileImage?: string;
    designation?: string;
    businessName?: string;
    clinicDetails?: {
      clinicName?: string;
      logo?: string;
    };
    categories?: string[];
    address?: { city?: string; province?: string };
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    shortBio?: string;
  };
}

export function PractitionerCard({ practitioner: p }: PractitionerCardProps) {
  const isClinic = p.practiceType === "clinic" || p.practiceType === "center";

  const displayName = isClinic ? (p.clinicDetails?.clinicName ?? p.name) : p.name;
  const displayImage = isClinic ? p.clinicDetails?.logo : p.profileImage;
  const displaySubtitle = isClinic
    ? p.categories?.join(", ") ?? ""
    : p.designation ?? "";

  const badgeLabel = p.practiceType === "clinic" ? "Clinic" : p.practiceType === "center" ? "Centre" : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 overflow-hidden bg-gray-100 ${isClinic ? "rounded-xl" : "rounded-full"}`}>
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-bold">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            {p.isVerified && (
              <CheckCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-primary-500 fill-white bg-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-playfair font-semibold text-[#1A1A2E] text-base leading-tight group-hover:text-primary-600 transition-colors">
                {displayName}
              </h3>
              {badgeLabel && (
                <span className="inline-flex items-center bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 leading-tight">
                  {badgeLabel}
                </span>
              )}
            </div>
            {displaySubtitle && (
              <p className="text-xs text-[#6B7280] mt-0.5 truncate">{displaySubtitle}</p>
            )}
            {p.address?.city && (
              <div className="flex items-center gap-1 mt-1 text-xs text-[#6B7280]">
                <MapPin className="w-3 h-3" />
                {p.address.city}, {p.address.province}
              </div>
            )}
          </div>
        </div>

        {typeof p.rating === "number" && (
          <div className="mt-3">
            <StarRating rating={p.rating} count={p.reviewCount} />
          </div>
        )}

        {p.categories && p.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.categories.slice(0, 3).map((cat) => (
              <span key={cat} className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {cat}
              </span>
            ))}
            {p.categories.length > 3 && (
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                +{p.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {p.shortBio && (
          <p className="text-xs text-[#6B7280] mt-3 line-clamp-2">{p.shortBio}</p>
        )}
      </div>

      <div className="px-5 pb-4">
        <Link
          href={`/practitioners/${p.slug}`}
          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
