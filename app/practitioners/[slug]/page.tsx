import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { StarRating } from "@/components/ui/StarRating";
import { WorkingHours } from "@/components/practitioners/WorkingHours";
import { ReviewSection } from "@/components/practitioners/ReviewSection";
import {
  MapPin, Phone, Mail, Globe, CheckCircle, ArrowLeft,
  Clock, Share2, ExternalLink, Link2, Video, Map,
} from "lucide-react";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = await Practitioner.findOne({ slug: params.slug, status: "approved" }).lean() as any;
  if (!p) return {};
  const address = p.address as { city?: string };
  return {
    title: `${p.name} — ${(p.categories as string[])?.[0] || "Practitioner"} in ${address?.city || "Canada"} | NutraCare360`,
    description: (p.shortBio as string) || (p.bio as string)?.slice(0, 160),
    openGraph: {
      images: [(p.profileImage as string) || ""],
    },
  };
}

export default async function PractitionerProfilePage({ params }: Props) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = await Practitioner.findOne({ slug: params.slug, status: "approved" }).lean() as any;
  if (!p) notFound();

  const address = p.address as Record<string, string>;
  const social = p.social as Record<string, string>;
  const services = p.services as Array<Record<string, string>>;
  const education = p.education as Array<Record<string, string>>;
  const certifications = p.certifications as Array<Record<string, string>>;

  const isClinic = p.practiceType === "clinic" || p.practiceType === "center";
  const clinicDetails = p.clinicDetails as {
    clinicName?: string;
    logo?: string;
    establishedYear?: number;
    totalPractitioners?: number;
    teamMembers?: Array<{ name: string; designation?: string; photo?: string; specialties?: string[] }>;
  } | undefined;
  const displayName = isClinic ? (clinicDetails?.clinicName ?? (p.name as string)) : (p.name as string);
  const displayImage = isClinic ? clinicDetails?.logo : (p.profileImage as string | undefined);
  const teamMembers = clinicDetails?.teamMembers?.filter((m) => m.name) ?? [];

  return (
    <div className="pt-20 pb-20 min-h-screen bg-[#FAFAF8]">
      {/* Hero banner */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-emerald-500">
        {p.coverImage && (
          <Image
            src={p.coverImage as string}
            alt={`${p.name} practice`}
            fill
            className="object-cover opacity-30"
          />
        )}
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-xs font-semibold text-primary-100 uppercase tracking-widest mb-2">NutraCare360</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold drop-shadow">
            {p.practiceType === "clinic" ? "Clinic Profile" : p.practiceType === "center" ? "Centre Profile" : "Practitioner Profile"}
          </h2>
          <p className="mt-2 text-primary-100 text-sm max-w-md">Connecting you with certified nutrition &amp; wellness experts across Canada</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/practitioners" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500 mt-6 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Practitioners
        </Link>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero info */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-start gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-primary-100">
                    {displayImage ? (
                      <Image src={displayImage} alt={displayName} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary-600">
                        {displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                  {p.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-md p-0.5">
                      <CheckCircle className="w-5 h-5 text-primary-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#1A1A2E]">{displayName}</h1>
                      {!isClinic && p.designation && <p className="text-[#6B7280] text-sm mt-0.5">{p.designation as string}</p>}
                      {!isClinic && p.businessName && <p className="text-primary-600 text-sm font-medium">{p.businessName as string}</p>}
                      {isClinic && clinicDetails?.establishedYear && (
                        <p className="text-[#6B7280] text-sm mt-0.5">Est. {clinicDetails.establishedYear}</p>
                      )}
                    </div>
                    {p.isVerified && (
                      <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full border border-primary-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>

                  {typeof p.rating === "number" && (
                    <div className="mt-2">
                      <StarRating rating={p.rating as number} count={p.reviewCount as number} />
                    </div>
                  )}

                  {address?.city && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-[#6B7280]">
                      <MapPin className="w-4 h-4" />
                      {address.street}, {address.city}, {address.province} {address.postalCode}
                    </div>
                  )}

                  {(p.categories as string[])?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(p.categories as string[]).map((cat) => (
                        <Link key={cat} href={`/categories/${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                          className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium hover:bg-primary-100 transition-colors">
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Social icons */}
                  {social && (
                    <div className="flex gap-3 mt-3">
                      {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary-500"><Share2 className="w-4 h-4" /></a>}
                      {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary-500"><ExternalLink className="w-4 h-4" /></a>}
                      {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary-500"><Link2 className="w-4 h-4" /></a>}
                      {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-[#6B7280] hover:text-primary-500"><Video className="w-4 h-4" /></a>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            {p.bio && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-4">About {displayName}</h2>
                <p className="text-[#374151] leading-relaxed">{p.bio as string}</p>
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {p.experience && (
                    <div className="bg-primary-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary-600 font-playfair">{p.experience as number}+</div>
                      <div className="text-xs text-[#6B7280] mt-1">Years Experience</div>
                    </div>
                  )}
                  {(p.languages as string[])?.length > 0 && (
                    <div className="bg-accent-50 rounded-xl p-4">
                      <div className="text-xs font-semibold text-[#374151] mb-1">Languages</div>
                      <div className="text-sm text-[#1A1A2E]">{(p.languages as string[]).join(", ")}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            {services?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-4">Services Offered</h2>
                <div className="space-y-3">
                  {services.map((service, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E7EB]">
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[#1A1A2E]">{service.name}</div>
                        {service.description && <p className="text-xs text-[#6B7280] mt-0.5">{service.description}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-primary-600 font-bold text-sm">{service.price}</div>
                        {service.duration && (
                          <div className="flex items-center gap-1 text-xs text-[#6B7280] justify-end mt-0.5">
                            <Clock className="w-3 h-3" />{service.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Working Hours */}
            {p.workingHours && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-4">Working Hours</h2>
                <WorkingHours hours={p.workingHours as Record<string, { open: string; close: string; isClosed: boolean }>} />
              </div>
            )}

            {/* Our Team — clinic/center only */}
            {isClinic && teamMembers.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-5">Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E7EB]">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
                        {member.photo ? (
                          <Image src={member.photo} alt={member.name} width={56} height={56} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary-600">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#1A1A2E] leading-tight">{member.name}</p>
                        {member.designation && (
                          <p className="text-xs text-[#6B7280] mt-0.5">{member.designation}</p>
                        )}
                        {member.specialties && member.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.specialties.map((s) => (
                              <span key={s} className="bg-primary-50 text-primary-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            {(education?.length > 0 || certifications?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-4">Education & Certifications</h2>
                {education?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-[#374151] mb-2">Education</h3>
                    <ul className="space-y-1">
                      {education.map((edu, idx) => (
                        <li key={idx} className="text-sm text-[#6B7280]">
                          <span className="font-medium text-[#1A1A2E]">{edu.degree}</span> — {edu.institution}{edu.year ? `, ${edu.year}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {certifications?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#374151] mb-2">Certifications</h3>
                    <ul className="space-y-1">
                      {certifications.map((cert, idx) => (
                        <li key={idx} className="text-sm text-[#6B7280]">
                          <span className="font-medium text-[#1A1A2E]">{cert.name}</span> — {cert.issuedBy}{cert.year ? `, ${cert.year}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* Reviews */}
            <ReviewSection
              practitionerId={String(p._id)}
              practitionerName={displayName}
            />
          </div>

          {/* ── RIGHT COLUMN (sticky sidebar) ── */}
          <aside className="mt-6 lg:mt-0 space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Contact card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm">
                <h3 className="font-playfair text-lg font-bold text-[#1A1A2E] mb-4">Contact</h3>
                <div className="space-y-3">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="flex items-center gap-3 text-sm text-[#1A1A2E] hover:text-primary-500 transition-colors">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary-500" />
                      </div>
                      {p.phone as string}
                    </a>
                  )}
                  {p.email && (
                    <a href={`mailto:${p.email}`} className="flex items-center gap-3 text-sm text-[#1A1A2E] hover:text-primary-500 transition-colors">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary-500" />
                      </div>
                      {p.email as string}
                    </a>
                  )}
                  {p.website && (
                    <a href={p.website as string} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-primary-500 hover:text-primary-600 transition-colors">
                      <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-primary-500" />
                      </div>
                      Visit Website
                    </a>
                  )}
                </div>

                {p.phone && (
                  <a
                    href={`tel:${p.phone}`}
                    className="mt-4 block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Call Now
                  </a>
                )}
                {p.email && (
                  <a
                    href={`mailto:${p.email}`}
                    className="mt-2 block w-full border border-primary-500 text-primary-500 hover:bg-primary-50 text-center py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    Send Email
                  </a>
                )}
              </div>

              {/* Location card */}
              {address && (
                <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                  <h3 className="font-playfair text-lg font-bold text-[#1A1A2E] mb-3">Location</h3>
                  <p className="text-sm text-[#6B7280] mb-3">
                    {address.street}<br />
                    {address.city}, {address.province}<br />
                    {address.postalCode}, {address.country}
                  </p>
                  <div className="bg-[#FAFAF8] rounded-xl h-40 flex items-center justify-center border border-[#E5E7EB] mb-3">
                    <div className="text-center text-[#6B7280]">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-primary-400" />
                      <p className="text-xs">{address.city}, {address.province}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street}, ${address.city}, ${address.province}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border border-[#E5E7EB] text-center py-2.5 rounded-xl text-sm font-medium text-[#374151] hover:border-primary-300 hover:text-primary-500 transition-colors"
                  >
                    Get Directions
                  </a>
                  {p.googleBusinessProfileUrl && (
                    <a
                      href={p.googleBusinessProfileUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 w-full border border-[#E5E7EB] py-2.5 rounded-xl text-sm font-medium text-[#374151] hover:border-primary-300 hover:text-primary-500 transition-colors"
                    >
                      <Map className="w-4 h-4 text-primary-400" />
                      View on Google Maps
                    </a>
                  )}
                </div>
              )}

              {/* Quick info */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
                <h3 className="font-playfair text-lg font-bold text-[#1A1A2E] mb-3">Quick Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Listing Type</span>
                    <span className={`font-medium capitalize ${p.listingType === "premium" ? "text-secondary-600" : "text-[#374151]"}`}>
                      {p.listingType as string}
                    </span>
                  </div>
                  {p.experience && (
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Experience</span>
                      <span className="font-medium text-[#374151]">{p.experience as number} years</span>
                    </div>
                  )}
                  {address?.province && (
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Province</span>
                      <span className="font-medium text-[#374151]">{address.province}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
