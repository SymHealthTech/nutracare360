import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { AdminShell } from "@/components/admin/AdminShell";
import { JoinUsForm } from "@/components/forms/JoinUsForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props { params: { id: string } }

export default async function AdminEditPractitionerPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = await Practitioner.findById(params.id).lean() as any;
  if (!p) notFound();

  // Convert DB document to form-compatible shape
  const initialData = {
    practiceType: p.practiceType || "individual",
    name: p.name || "",
    businessName: p.businessName || "",
    designation: p.designation || "",
    profileImage: p.profileImage || "",
    clinicDetails: p.clinicDetails
      ? {
          clinicName: p.clinicDetails.clinicName || "",
          logo: p.clinicDetails.logo || "",
          establishedYear: p.clinicDetails.establishedYear || "",
          teamMembers: (p.clinicDetails.teamMembers || []).map((m: { name: string; designation: string; photo: string; specialties: string[] }) => ({
            name: m.name || "",
            designation: m.designation || "",
            photo: m.photo || "",
            specialties: Array.isArray(m.specialties) ? m.specialties.join(", ") : (m.specialties || ""),
          })),
        }
      : undefined,
    categories: p.categories || [],
    address: p.address || {},
    phone: p.phone || "",
    email: p.email || "",
    website: p.website || "",
    social: p.social || { instagram: "", facebook: "", linkedin: "" },
    shortBio: p.shortBio || "",
    bio: p.bio || "",
    experience: p.experience != null ? String(p.experience) : "",
    languages: Array.isArray(p.languages) ? p.languages.join(", ") : (p.languages || ""),
    education: (p.education || []).map((e: { degree: string; institution: string; year: string }) => ({
      degree: e.degree || "",
      institution: e.institution || "",
      year: String(e.year || ""),
    })),
    certifications: (p.certifications || []).map((c: { name: string; issuedBy: string; year: string }) => ({
      name: c.name || "",
      issuedBy: c.issuedBy || "",
      year: String(c.year || ""),
    })),
    workingHours: p.workingHours || undefined,
    services: (p.services || []).map((s: { name: string; duration: string; price: string; description: string }) => ({
      name: s.name || "",
      duration: s.duration || "",
      price: s.price || "",
      description: s.description || "",
    })),
  };

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-7">
          <Link
            href={`/admin/practitioners/${params.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-primary-600 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Practitioner
          </Link>
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Edit Practitioner</h1>
          <p className="text-[#6B7280] mt-1">Editing: <strong>{p.name}</strong></p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <JoinUsForm isAdmin editId={params.id} initialData={initialData} />
        </div>
      </div>
    </AdminShell>
  );
}
