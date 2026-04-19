import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPractitionerActions } from "@/components/admin/AdminPractitionerActions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { StarRating } from "@/components/ui/StarRating";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, Globe, CheckCircle, Pencil } from "lucide-react";

interface Props { params: { id: string } }

export default async function AdminPractitionerDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = await Practitioner.findById(params.id).lean() as any;
  if (!p) notFound();

  const address = p.address as Record<string, string>;
  const services = (p.services || []) as Array<Record<string, string>>;

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <Link href="/admin/practitioners" className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500">
            <ArrowLeft className="w-4 h-4" /> Back to Practitioners
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              p.status === "approved" ? "bg-accent-50 text-accent-700"
              : p.status === "pending" ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
            }`}>
              {p.status as string}
            </span>
            <AdminPractitionerActions id={params.id} currentStatus={p.status as string} />
            <Link
              href={`/admin/practitioners/${params.id}/edit`}
              className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </Link>
            <AdminDeleteButton id={params.id} name={p.name as string} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 space-y-6">
          {/* Header */}
          <div>
            <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E]">{p.name as string}</h1>
            <p className="text-[#6B7280] text-sm mt-1">{p.designation as string}</p>
            {(p.businessName as string) ? <p className="text-primary-500 text-sm">{p.businessName as string}</p> : null}
            {typeof p.rating === "number" && p.rating > 0 && (
              <div className="mt-2"><StarRating rating={p.rating as number} count={p.reviewCount as number} /></div>
            )}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <span className="text-[#374151]">{address?.street}, {address?.city}, {address?.province} {address?.postalCode}</span>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <span className="text-[#374151]">{String(p.phone ?? "")}</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <span className="text-[#374151]">{String(p.email ?? "")}</span>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <span className="text-[#374151]">{String(p.website ?? "")}</span>
            </div>
          </div>

          {/* Categories */}
          {(p.categories as string[])?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#374151] uppercase tracking-wider mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {(p.categories as string[]).map((cat) => (
                  <span key={cat} className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full">{cat}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {p.bio && (
            <div>
              <h3 className="text-xs font-semibold text-[#374151] uppercase tracking-wider mb-2">Bio</h3>
              <p className="text-sm text-[#374151] leading-relaxed">{p.bio as string}</p>
            </div>
          )}

          {/* Services */}
          {services?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#374151] uppercase tracking-wider mb-2">Services ({services.length})</h3>
              <div className="space-y-2">
                {services.map((s, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#FAFAF8] rounded-lg px-4 py-2.5 text-sm">
                    <span className="font-medium text-[#1A1A2E]">{s.name}</span>
                    <div className="text-right text-xs text-[#6B7280]">
                      <div className="text-primary-600 font-semibold">{s.price}</div>
                      <div>{s.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-[#6B7280] pt-4 border-t border-[#E5E7EB]">
            <span>Submitted: {new Date(p.createdAt as Date).toLocaleDateString("en-CA")}</span>
            {p.isVerified && <span className="flex items-center gap-1 text-primary-500"><CheckCircle className="w-3 h-3" /> Verified</span>}
            <span className="capitalize">Listing: {p.listingType as string}</span>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
