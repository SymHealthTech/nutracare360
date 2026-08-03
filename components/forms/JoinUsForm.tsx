"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, CITIES, PROVINCES } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle, Plus, Trash2, ChevronRight, ChevronLeft, Award, Upload, UserPlus, X } from "lucide-react";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday",
  thursday: "Thursday", friday: "Friday", saturday: "Saturday", sunday: "Sunday",
};

const STEPS = [
  "Practice Info",
  "Contact & Location",
  "About Your Practice",
  "Working Hours",
  "Services",
  "Review & Submit",
];

type WorkingHour = { open: string; close: string; isClosed: boolean };

interface TeamMember {
  name: string;
  designation: string;
  photo: string;
  specialties: string;
}

interface ClinicDetails {
  clinicName: string;
  establishedYear: string;
  teamMembers: TeamMember[];
}

interface FormData {
  practiceType: string;
  name: string;
  businessName: string;
  designation: string;
  profileImage: string;
  coverImage: string;
  clinicDetails: ClinicDetails;
  categories: string[];
  address: { street: string; city: string; province: string; postalCode: string };
  phone: string;
  email: string;
  website: string;
  social: { instagram: string; facebook: string; linkedin: string };
  shortBio: string;
  bio: string;
  experience: string;
  languages: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  certifications: Array<{ name: string; issuedBy: string; year: string }>;
  workingHours: Record<string, WorkingHour>;
  services: Array<{ name: string; duration: string; price: string; description: string }>;
}

const defaultWorkingHours = Object.fromEntries(
  DAYS.map((d) => [d, { open: "", close: "", isClosed: false }])
) as Record<string, WorkingHour>;

const emptyTeamMember = (): TeamMember => ({ name: "", designation: "", photo: "", specialties: "" });

async function uploadToCloudinary(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

interface InitialData {
  practiceType?: string;
  name?: string;
  businessName?: string;
  designation?: string;
  profileImage?: string;
  coverImage?: string;
  clinicDetails?: {
    clinicName?: string;
    establishedYear?: string | number;
    teamMembers?: Array<{ name: string; designation: string; photo: string; specialties: string | string[] }>;
  };
  categories?: string[];
  address?: { street?: string; city?: string; province?: string; postalCode?: string };
  phone?: string;
  email?: string;
  website?: string;
  social?: { instagram?: string; facebook?: string; linkedin?: string };
  shortBio?: string;
  bio?: string;
  experience?: string | number;
  languages?: string | string[];
  education?: Array<{ degree: string; institution: string; year: string | number }>;
  certifications?: Array<{ name: string; issuedBy: string; year: string | number }>;
  workingHours?: Record<string, WorkingHour>;
  services?: Array<{ name: string; duration: string; price: string; description: string }>;
}

interface Props {
  isAdmin?: boolean;
  editId?: string;
  initialData?: InitialData;
  selfEditToken?: string;
  onSelfUpdateSuccess?: () => void;
}

export function JoinUsForm({ isAdmin = false, editId, initialData, selfEditToken, onSelfUpdateSuccess }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  // Preview state — pre-populate from initialData URLs
  const [profileImagePreview, setProfileImagePreview] = useState<string>(initialData?.profileImage || "");
  const [coverImagePreview, setCoverImagePreview] = useState<string>(initialData?.coverImage || "");
  const [memberPhotoPreviews, setMemberPhotoPreviews] = useState<string[]>(
    initialData?.clinicDetails?.teamMembers?.map((m) => m.photo || "") || [""]
  );

  // Actual File objects for upload (null = keep existing URL)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [memberPhotoFiles, setMemberPhotoFiles] = useState<(File | null)[]>(
    initialData?.clinicDetails?.teamMembers?.map(() => null) || [null]
  );

  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const memberPhotoRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState<FormData>({
    practiceType: initialData?.practiceType || "individual",
    name: initialData?.name || "",
    businessName: initialData?.businessName || "",
    designation: initialData?.designation || "",
    profileImage: initialData?.profileImage || "",
    coverImage: initialData?.coverImage || "",
    clinicDetails: {
      clinicName: initialData?.clinicDetails?.clinicName || "",
      establishedYear: String(initialData?.clinicDetails?.establishedYear || ""),
      teamMembers: initialData?.clinicDetails?.teamMembers?.map((m) => ({
        name: m.name,
        designation: m.designation,
        photo: m.photo,
        specialties: Array.isArray(m.specialties) ? m.specialties.join(", ") : (m.specialties || ""),
      })) || [emptyTeamMember()],
    },
    categories: initialData?.categories || [],
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      province: initialData?.address?.province || "",
      postalCode: initialData?.address?.postalCode || "",
    },
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    website: initialData?.website || "",
    social: {
      instagram: initialData?.social?.instagram || "",
      facebook: initialData?.social?.facebook || "",
      linkedin: initialData?.social?.linkedin || "",
    },
    shortBio: initialData?.shortBio || "",
    bio: initialData?.bio || "",
    experience: String(initialData?.experience || ""),
    languages: Array.isArray(initialData?.languages) ? initialData.languages.join(", ") : (initialData?.languages || ""),
    education: initialData?.education?.map((e) => ({ degree: e.degree, institution: e.institution, year: e.year != null ? String(e.year) : "" })) || [{ degree: "", institution: "", year: "" }],
    certifications: initialData?.certifications?.map((c) => ({ name: c.name, issuedBy: c.issuedBy, year: c.year != null ? String(c.year) : "" })) || [{ name: "", issuedBy: "", year: "" }],
    workingHours: initialData?.workingHours || defaultWorkingHours,
    services: initialData?.services || [{ name: "", duration: "", price: "", description: "" }],
  });

  // Fire once when a prospective practitioner opens the public signup form
  // (not admin create/edit, not an OTP-verified self-update).
  const isPublicSignup = !isAdmin && !selfEditToken && !editId;
  useEffect(() => {
    if (isPublicSignup) trackEvent("listing_signup_started");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key: keyof FormData, value: unknown) => setForm((f) => ({ ...f, [key]: value }));
  const updateAddr = (key: string, val: string) => setForm((f) => ({ ...f, address: { ...f.address, [key]: val } }));
  const updateSocial = (key: string, val: string) => setForm((f) => ({ ...f, social: { ...f.social, [key]: val } }));

  const updateClinic = (key: keyof ClinicDetails, val: unknown) =>
    setForm((f) => ({ ...f, clinicDetails: { ...f.clinicDetails, [key]: val } }));

  const updateTeamMember = (i: number, key: keyof TeamMember, val: string) =>
    setForm((f) => {
      const members = [...f.clinicDetails.teamMembers];
      members[i] = { ...members[i], [key]: val };
      return { ...f, clinicDetails: { ...f.clinicDetails, teamMembers: members } };
    });

  const addTeamMember = () => {
    setForm((f) => ({
      ...f,
      clinicDetails: { ...f.clinicDetails, teamMembers: [...f.clinicDetails.teamMembers, emptyTeamMember()] },
    }));
    setMemberPhotoPreviews((prev) => [...prev, ""]);
    setMemberPhotoFiles((prev) => [...prev, null]);
  };

  const removeTeamMember = (i: number) => {
    setForm((f) => ({
      ...f,
      clinicDetails: { ...f.clinicDetails, teamMembers: f.clinicDetails.teamMembers.filter((_, idx) => idx !== i) },
    }));
    setMemberPhotoPreviews((prev) => prev.filter((_, idx) => idx !== i));
    setMemberPhotoFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImagePreview(URL.createObjectURL(file));
    setProfileImageFile(file);
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImagePreview(URL.createObjectURL(file));
    setCoverImageFile(file);
  };

  const handleMemberPhotoChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMemberPhotoPreviews((prev) => { const next = [...prev]; next[i] = URL.createObjectURL(file); return next; });
    setMemberPhotoFiles((prev) => { const next = [...prev]; next[i] = file; return next; });
    updateTeamMember(i, "photo", file.name);
  };

  const toggleCategory = (cat: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const addService = () => update("services", [...form.services, { name: "", duration: "", price: "", description: "" }]);
  const removeService = (i: number) => update("services", form.services.filter((_, idx) => idx !== i));
  const updateService = (i: number, key: string, val: string) => {
    const updated = [...form.services];
    updated[i] = { ...updated[i], [key]: val };
    update("services", updated);
  };

  const addEducation = () => update("education", [...form.education, { degree: "", institution: "", year: "" }]);
  const removeEducation = (i: number) => update("education", form.education.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, key: string, val: string) => {
    const updated = [...form.education];
    updated[i] = { ...updated[i], [key]: val };
    update("education", updated);
  };

  const updateHour = (day: string, key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, workingHours: { ...f.workingHours, [day]: { ...f.workingHours[day], [key]: val } } }));

  const isClinicType = form.practiceType === "clinic" || form.practiceType === "center";

  const validateStep = (s: number): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (s === 0) {
      if (isClinicType) {
        if (!form.clinicDetails.clinicName.trim())
          errs.clinicName = `${form.practiceType === "center" ? "Centre" : "Clinic"} name is required and cannot be empty.`;
      } else {
        if (!form.name.trim())
          errs.name = "Full name is required and cannot be empty.";
      }
      if (form.categories.length === 0)
        errs.categories = "Please select at least one category.";
    }
    if (s === 1) {
      if (!form.address.city)
        errs.city = "City is required. Please select a city.";
      if (!form.address.province)
        errs.province = "Province is required. Please select a province.";
      if (!form.phone.trim())
        errs.phone = "Phone number is required and cannot be empty.";
      if (!form.email.trim())
        errs.email = "Email address is required and cannot be empty.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errs.email = "Please enter a valid email address.";
    }
    if (s === 2) {
      if (!form.shortBio.trim())
        errs.shortBio = "Short bio is required and cannot be empty.";
      if (!form.bio.trim())
        errs.bio = "Full bio is required and cannot be empty.";
    }
    return errs;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      // Upload images to Cloudinary
      let profileImageUrl = form.profileImage;
      let coverImageUrl = form.coverImage;
      const memberPhotoUrls = form.clinicDetails.teamMembers.map((m) => m.photo);

      if (profileImageFile) {
        profileImageUrl = await uploadToCloudinary(profileImageFile);
      } else if (!profileImagePreview) {
        // User removed the existing image — clear it
        profileImageUrl = "";
      }
      if (coverImageFile) {
        coverImageUrl = await uploadToCloudinary(coverImageFile);
      } else if (!coverImagePreview) {
        // User removed the existing image — clear it
        coverImageUrl = "";
      }
      for (let i = 0; i < memberPhotoFiles.length; i++) {
        if (memberPhotoFiles[i]) {
          memberPhotoUrls[i] = await uploadToCloudinary(memberPhotoFiles[i]!);
        }
      }

      const teamMembersWithPhotos = form.clinicDetails.teamMembers.map((m, i) => ({
        ...m,
        photo: memberPhotoUrls[i] || m.photo,
      }));

      const payload = {
        ...form,
        profileImage: profileImageUrl,
        coverImage: coverImageUrl,
        name: isClinicType ? form.clinicDetails.clinicName : form.name,
        experience: parseInt(form.experience) || 0,
        languages: form.languages.split(",").map((l) => l.trim()).filter(Boolean),
        education: form.education.filter((e) => e.degree).map((e) => ({ degree: e.degree, institution: e.institution, year: parseInt(e.year) || undefined })),
        certifications: form.certifications.filter((c) => c.name).map((c) => ({ name: c.name, issuedBy: c.issuedBy, year: parseInt(c.year) || undefined })),
        services: form.services.filter((s) => s.name),
        clinicDetails: isClinicType
          ? {
              ...form.clinicDetails,
              establishedYear: parseInt(form.clinicDetails.establishedYear) || undefined,
              teamMembers: teamMembersWithPhotos
                .filter((m) => m.name)
                .map((m) => ({ ...m, specialties: m.specialties.split(",").map((s) => s.trim()).filter(Boolean) })),
            }
          : undefined,
        ...(isAdmin ? { status: "approved" } : {}),
      };

      // Self-service OTP-verified update
      if (selfEditToken && editId) {
        const res = await fetch("/api/practitioners/self-update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ editToken: selfEditToken, practitionerId: editId, ...payload }),
        });
        if (res.ok) {
          onSelfUpdateSuccess?.();
        } else {
          const data = await res.json();
          setSubmitError(data.error || "Update failed. Please try again.");
        }
        return;
      }

      const isEdit = isAdmin && !!editId;
      const endpoint = isEdit
        ? `/api/practitioners/${editId}`
        : isAdmin
          ? "/api/admin/practitioners"
          : "/api/practitioners";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (isAdmin) {
          router.push(isEdit ? `/admin/practitioners/${editId}` : "/admin/practitioners");
          router.refresh();
        } else {
          trackEvent("listing_signup_submitted", { practice_type: form.practiceType });
          setSubmitted(true);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || "Submission failed. Please check your details and try again.");
      }
    } catch {
      setSubmitError("Submission failed. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 transition-colors";
  const inputErrCls = "w-full border border-red-400 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition-colors";
  const labelCls = "block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider";
  const errCls = "text-xs text-red-500 mt-1";

  const fieldCls = (key: string) => errors[key] ? inputErrCls : inputCls;

  if (submitted) {
    return (
      <div className="p-10 text-center">
        <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-accent-500" />
        </div>
        <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E] mb-2">Listing Submitted!</h2>
        <p className="text-[#6B7280] mb-6">Thank you! Your listing is under review. We typically respond within 48 hours.</p>
        <button onClick={() => router.push("/")} className="bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Step progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${i === step ? "bg-primary-500 text-white" : i < step ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-400"}`}>
              <span>{i + 1}</span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-4 h-px ${i < step ? "bg-primary-300" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Practice Info */}
      {step === 0 && (
        <div className="space-y-5">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Practice Information</h3>

          {/* Practice type selector */}
          <div>
            <label className={labelCls}>Practice Type *</label>
            <div className="flex gap-3">
              {(["individual", "clinic", "center"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update("practiceType", t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm capitalize border-2 transition-colors ${form.practiceType === t ? "border-primary-500 bg-primary-50 text-primary-700 font-semibold" : "border-[#E5E7EB] text-[#6B7280] hover:border-primary-200"}`}
                >
                  {t === "center" ? "Centre" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Individual fields ── */}
          {!isClinicType && (
            <div className="space-y-4">
              {/* Profile Photo */}
              <div>
                <label className={labelCls}>Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => profileImageRef.current?.click()}
                    className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-[#E5E7EB] flex items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-colors overflow-hidden"
                  >
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                    <input
                      ref={profileImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#374151]">
                      {profileImagePreview ? "Photo selected" : "Upload profile photo"}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">PNG, JPG, WebP — recommended 400×400</p>
                    {profileImagePreview && (
                      <button
                        type="button"
                        onClick={() => { setProfileImagePreview(""); setProfileImageFile(null); }}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className={labelCls}>Cover Image</label>
                <div
                  onClick={() => coverImageRef.current?.click()}
                  className="relative border-2 border-dashed border-[#E5E7EB] rounded-xl overflow-hidden cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-colors h-32 flex items-center justify-center"
                >
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center px-4">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <p className="text-sm font-medium text-[#374151]">Upload cover image</p>
                      <p className="text-xs text-[#6B7280]">PNG, JPG, WebP — recommended 1200×400</p>
                    </div>
                  )}
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </div>
                {coverImagePreview && (
                  <button
                    type="button"
                    onClick={() => { setCoverImagePreview(""); setCoverImageFile(null); }}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    Remove cover image
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <input
                    className={fieldCls("name")}
                    value={form.name}
                    onChange={(e) => { update("name", e.target.value); if (errors.name) setErrors((prev) => { const n = { ...prev }; delete n.name; return n; }); }}
                    placeholder="Dr. Jane Smith"
                  />
                  {errors.name && <p className={errCls}>{errors.name}</p>}
                </div>
                <div>
                  <label className={labelCls}>Designation / Credentials</label>
                  <input
                    className={inputCls}
                    value={form.designation}
                    onChange={(e) => update("designation", e.target.value)}
                    placeholder="Registered Naturopath, ND"
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Business / Clinic Name</label>
                <input
                  className={inputCls}
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Jane Smith Naturopathy"
                />
                <p className="text-xs text-[#6B7280] mt-1">Your practice or business name, if different from your personal name.</p>
              </div>
            </div>
          )}

          {/* ── Clinic / Centre fields ── */}
          {isClinicType && (
            <div className="space-y-5">
              {/* Clinic Name + Established Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    {form.practiceType === "center" ? "Centre" : "Clinic"} Name *
                  </label>
                  <input
                    className={fieldCls("clinicName")}
                    value={form.clinicDetails.clinicName}
                    onChange={(e) => { updateClinic("clinicName", e.target.value); if (errors.clinicName) setErrors((prev) => { const n = { ...prev }; delete n.clinicName; return n; }); }}
                    placeholder="Harmony Wellness Clinic"
                  />
                  {errors.clinicName && <p className={errCls}>{errors.clinicName}</p>}
                </div>
                <div>
                  <label className={labelCls}>Established Year</label>
                  <input
                    className={inputCls}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={form.clinicDetails.establishedYear}
                    onChange={(e) => updateClinic("establishedYear", e.target.value)}
                    placeholder="2010"
                  />
                </div>
              </div>

              {/* Logo / Profile Image */}
              <div>
                <label className={labelCls}>
                  {form.practiceType === "center" ? "Centre" : "Clinic"} Logo / Photo
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => profileImageRef.current?.click()}
                    className="flex-shrink-0 w-20 h-20 rounded-2xl border-2 border-dashed border-[#E5E7EB] flex items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-colors overflow-hidden"
                  >
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-gray-400" />
                    )}
                    <input
                      ref={profileImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#374151]">
                      {profileImagePreview ? "Logo selected" : "Upload logo or photo"}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">PNG, JPG, WebP — recommended 400×400</p>
                    {profileImagePreview && (
                      <button
                        type="button"
                        onClick={() => { setProfileImagePreview(""); setProfileImageFile(null); }}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className={labelCls}>Cover Image</label>
                <div
                  onClick={() => coverImageRef.current?.click()}
                  className="relative border-2 border-dashed border-[#E5E7EB] rounded-xl overflow-hidden cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-colors h-32 flex items-center justify-center"
                >
                  {coverImagePreview ? (
                    <img src={coverImagePreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-center px-4">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <p className="text-sm font-medium text-[#374151]">Upload cover image</p>
                      <p className="text-xs text-[#6B7280]">PNG, JPG, WebP — recommended 1200×400</p>
                    </div>
                  )}
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </div>
                {coverImagePreview && (
                  <button
                    type="button"
                    onClick={() => { setCoverImagePreview(""); setCoverImageFile(null); }}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors"
                  >
                    Remove cover image
                  </button>
                )}
              </div>

              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={labelCls}>Team Members</label>
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Add Member
                  </button>
                </div>

                <div className="space-y-4">
                  {form.clinicDetails.teamMembers.map((member, i) => (
                    <div key={i} className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#374151]">Member {i + 1}</span>
                        {form.clinicDetails.teamMembers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(i)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Photo + name/designation row */}
                      <div className="flex items-start gap-3">
                        {/* Photo upload */}
                        <div
                          onClick={() => memberPhotoRefs.current[i]?.click()}
                          className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-dashed border-[#E5E7EB] flex items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/40 transition-colors overflow-hidden"
                        >
                          {memberPhotoPreviews[i] ? (
                            <img src={memberPhotoPreviews[i]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Upload className="w-4 h-4 text-gray-400" />
                          )}
                          <input
                            ref={(el) => { memberPhotoRefs.current[i] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleMemberPhotoChange(i, e)}
                          />
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            className={inputCls}
                            value={member.name}
                            onChange={(e) => updateTeamMember(i, "name", e.target.value)}
                            placeholder="Dr. Alex Patel"
                          />
                          <input
                            className={inputCls}
                            value={member.designation}
                            onChange={(e) => updateTeamMember(i, "designation", e.target.value)}
                            placeholder="Acupuncturist, TCM"
                          />
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <label className="block text-[10px] font-semibold text-[#6B7280] mb-1 uppercase tracking-wider">
                          Specialties (comma-separated)
                        </label>
                        <input
                          className={inputCls}
                          value={member.specialties}
                          onChange={(e) => updateTeamMember(i, "specialties", e.target.value)}
                          placeholder="Pain Relief, Fertility, Stress"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Categories — shown for all practice types */}
          <div>
            <label className={labelCls}>Categories (select all that apply) *</label>
            <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-xl p-3 ${errors.categories ? "border-red-400" : "border-[#E5E7EB]"}`}>
              {CATEGORIES.map((cat) => (
                <button key={cat.slug} onClick={() => { toggleCategory(cat.name); if (errors.categories) setErrors((prev) => { const n = { ...prev }; delete n.categories; return n; }); }}
                  className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${form.categories.includes(cat.name) ? "bg-primary-500 text-white border-primary-500" : "border-[#E5E7EB] text-[#374151] hover:border-primary-300"}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            {form.categories.length > 0 && (
              <p className="text-xs text-primary-600 mt-1">{form.categories.length} selected: {form.categories.join(", ")}</p>
            )}
            {errors.categories && <p className={errCls}>{errors.categories}</p>}
          </div>
        </div>
      )}

      {/* Step 1: Contact & Location */}
      {step === 1 && (
        <div className="space-y-5">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Contact & Location</h3>
          <div>
            <label className={labelCls}>Street Address</label>
            <input className={inputCls} value={form.address.street} onChange={(e) => updateAddr("street", e.target.value)} placeholder="123 Main Street" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>City *</label>
              <select className={fieldCls("city")} value={form.address.city} onChange={(e) => { updateAddr("city", e.target.value); if (errors.city) setErrors((prev) => { const n = { ...prev }; delete n.city; return n; }); }}>
                <option value="">Select city</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className={errCls}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelCls}>Province *</label>
              <select className={fieldCls("province")} value={form.address.province} onChange={(e) => { updateAddr("province", e.target.value); if (errors.province) setErrors((prev) => { const n = { ...prev }; delete n.province; return n; }); }}>
                <option value="">Select province</option>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.province && <p className={errCls}>{errors.province}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Postal Code</label>
            <input className={inputCls} value={form.address.postalCode} onChange={(e) => updateAddr("postalCode", e.target.value)} placeholder="M5S 1W7" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone Number *</label>
              <input className={fieldCls("phone")} value={form.phone} onChange={(e) => { update("phone", e.target.value); if (errors.phone) setErrors((prev) => { const n = { ...prev }; delete n.phone; return n; }); }} placeholder="+1 (416) 555-0123" type="tel" />
              {errors.phone && <p className={errCls}>{errors.phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Email Address *</label>
              <input className={fieldCls("email")} value={form.email} onChange={(e) => { update("email", e.target.value); if (errors.email) setErrors((prev) => { const n = { ...prev }; delete n.email; return n; }); }} placeholder="you@example.ca" type="email" />
              {errors.email && <p className={errCls}>{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input className={inputCls} value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yourwebsite.ca" type="url" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["instagram", "facebook", "linkedin"].map((s) => (
              <div key={s}>
                <label className={labelCls}>{s.charAt(0).toUpperCase() + s.slice(1)}</label>
                <input className={inputCls} value={form.social[s as keyof typeof form.social]} onChange={(e) => updateSocial(s, e.target.value)} placeholder={`https://${s}.com/...`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: About */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">About Your Practice</h3>
          <div>
            <label className={labelCls}>Short Bio * (max 200 chars)</label>
            <input className={fieldCls("shortBio")} value={form.shortBio} onChange={(e) => { update("shortBio", e.target.value.slice(0, 200)); if (errors.shortBio) setErrors((prev) => { const n = { ...prev }; delete n.shortBio; return n; }); }} placeholder="One-line description of your practice" />
            <p className="text-xs text-[#6B7280] mt-1">{form.shortBio.length}/200</p>
            {errors.shortBio && <p className={errCls}>{errors.shortBio}</p>}
          </div>
          <div>
            <label className={labelCls}>Full Bio * (max 2000 chars)</label>
            <textarea className={`${fieldCls("bio")} min-h-32 resize-y`} value={form.bio} onChange={(e) => { update("bio", e.target.value.slice(0, 2000)); if (errors.bio) setErrors((prev) => { const n = { ...prev }; delete n.bio; return n; }); }} placeholder="Describe your background, approach, and what makes your practice unique..." />
            <p className="text-xs text-[#6B7280] mt-1">{form.bio.length}/2000</p>
            {errors.bio && <p className={errCls}>{errors.bio}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Years of Experience</label>
              <input className={inputCls} value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="10" type="number" min="0" />
            </div>
            <div>
              <label className={labelCls}>Languages (comma-separated)</label>
              <input className={inputCls} value={form.languages} onChange={(e) => update("languages", e.target.value)} placeholder="English, French, Hindi" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelCls}>Education</label>
              <button onClick={addEducation} className="text-xs text-primary-500 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                <input className={inputCls} value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="Degree" />
                <input className={inputCls} value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="Institution" />
                <div className="flex gap-1">
                  <input className={inputCls} value={edu.year} onChange={(e) => updateEducation(i, "year", e.target.value)} placeholder="Year" />
                  {form.education.length > 1 && (
                    <button onClick={() => removeEducation(i)} className="text-red-400 hover:text-red-600 px-2"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Working Hours */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Working Hours</h3>
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3 flex-wrap">
              <div className="w-24 text-sm font-medium text-[#374151] capitalize">{DAY_LABELS[day]}</div>
              <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer">
                <input type="checkbox" checked={form.workingHours[day].isClosed}
                  onChange={(e) => updateHour(day, "isClosed", e.target.checked)}
                  className="w-4 h-4 accent-primary-500" />
                Closed
              </label>
              {!form.workingHours[day].isClosed && (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" className={`${inputCls} max-w-36`}
                    value={form.workingHours[day].open?.replace(/(AM|PM)/, "").trim()}
                    onChange={(e) => updateHour(day, "open", e.target.value)} />
                  <span className="text-[#6B7280] text-sm">to</span>
                  <input type="time" className={`${inputCls} max-w-36`}
                    value={form.workingHours[day].close?.replace(/(AM|PM)/, "").trim()}
                    onChange={(e) => updateHour(day, "close", e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Services */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Services Offered</h3>
          {form.services.map((s, i) => (
            <div key={i} className="bg-[#FAFAF8] border border-[#E5E7EB] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#374151]">Service {i + 1}</span>
                {form.services.length > 1 && (
                  <button onClick={() => removeService(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input className={inputCls} value={s.name} onChange={(e) => updateService(i, "name", e.target.value)} placeholder="Service name" />
                <input className={inputCls} value={s.duration} onChange={(e) => updateService(i, "duration", e.target.value)} placeholder="60 min" />
                <input className={inputCls} value={s.price} onChange={(e) => updateService(i, "price", e.target.value)} placeholder="CAD $120" />
              </div>
              <input className={inputCls} value={s.description} onChange={(e) => updateService(i, "description", e.target.value)} placeholder="Brief service description" />
            </div>
          ))}
          <button onClick={addService} className="flex items-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
            <Plus className="w-4 h-4" /> Add Another Service
          </button>

          {/* Premium teaser */}
          {!isAdmin && (
            <div className="mt-6 bg-gradient-to-r from-secondary-50 to-secondary-100 border border-secondary-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#1A1A2E] text-sm">Premium Listing — Coming Soon</h4>
                  <p className="text-xs text-[#6B7280] mt-1">Get featured placement, priority in search results, and unlimited gallery photos.</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-white border border-secondary-200 text-secondary-600 text-xs px-3 py-1.5 rounded-full cursor-not-allowed opacity-70">
                    Notify Me When Available
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <div className="space-y-5">
          <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Review Your Listing</h3>
          <div className="bg-[#FAFAF8] rounded-xl p-5 space-y-3 text-sm">
            {/* Profile / logo preview in review step */}
            {profileImagePreview && (
              <div className="flex gap-2 items-center">
                <span className="font-semibold w-32 text-[#374151]">{isClinicType ? "Logo:" : "Profile Photo:"}</span>
                <img
                  src={profileImagePreview}
                  alt={isClinicType ? "Logo" : "Profile"}
                  className={`w-10 h-10 object-cover ${isClinicType ? "rounded-lg" : "rounded-full"}`}
                />
              </div>
            )}
            {coverImagePreview && (
              <div className="space-y-1">
                <span className="font-semibold text-[#374151]">Cover Image:</span>
                <img src={coverImagePreview} alt="Cover" className="w-full h-20 rounded-lg object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <span className="font-semibold w-32 text-[#374151]">Type:</span>
              <span className="capitalize">{form.practiceType === "center" ? "Centre" : form.practiceType}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-32 text-[#374151]">Name:</span>
              <span>{isClinicType ? form.clinicDetails.clinicName : form.name}</span>
            </div>
            {isClinicType && form.clinicDetails.establishedYear && (
              <div className="flex gap-2">
                <span className="font-semibold w-32 text-[#374151]">Est. Year:</span>
                <span>{form.clinicDetails.establishedYear}</span>
              </div>
            )}
            {isClinicType && form.clinicDetails.teamMembers.filter((m) => m.name).length > 0 && (
              <div className="flex gap-2">
                <span className="font-semibold w-32 text-[#374151]">Team:</span>
                <span>{form.clinicDetails.teamMembers.filter((m) => m.name).length} member(s)</span>
              </div>
            )}
            {!isClinicType && form.businessName && (
              <div className="flex gap-2">
                <span className="font-semibold w-32 text-[#374151]">Business Name:</span>
                <span>{form.businessName}</span>
              </div>
            )}
            {!isClinicType && form.designation && (
              <div className="flex gap-2">
                <span className="font-semibold w-32 text-[#374151]">Designation:</span>
                <span>{form.designation}</span>
              </div>
            )}
            <div className="flex gap-2"><span className="font-semibold w-32 text-[#374151]">City:</span><span>{form.address.city}, {form.address.province}</span></div>
            <div className="flex gap-2"><span className="font-semibold w-32 text-[#374151]">Phone:</span><span>{form.phone}</span></div>
            <div className="flex gap-2"><span className="font-semibold w-32 text-[#374151]">Email:</span><span>{form.email}</span></div>
            <div className="flex gap-2"><span className="font-semibold w-32 text-[#374151]">Categories:</span><span>{form.categories.join(", ")}</span></div>
            <div className="flex gap-2"><span className="font-semibold w-32 text-[#374151]">Services:</span><span>{form.services.filter(s => s.name).length} service(s)</span></div>
          </div>
          {isAdmin && (
            <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 text-sm text-accent-800">
              {editId
                ? <><strong>Admin mode:</strong> Changes will be saved immediately.</>
                : <><strong>Admin mode:</strong> This listing will be created with <strong>Approved</strong> status immediately.</>}
            </div>
          )}
          {!isAdmin && !selfEditToken && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm text-primary-800">
              <strong>What happens next?</strong> Our admin team will review your submission within 48 hours. You&apos;ll receive a confirmation at {form.email || "your email"}.
            </div>
          )}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E5E7EB]">
        <button
          onClick={() => { setErrors({}); setSubmitError(""); setStep(Math.max(0, step - 1)); }}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:border-primary-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => {
              const errs = validateStep(step);
              if (Object.keys(errs).length > 0) {
                setErrors(errs);
                return;
              }
              setErrors({});
              setStep(step + 1);
            }}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              const errs0 = validateStep(0);
              const errs1 = validateStep(1);
              const errs2 = validateStep(2);
              const allErrs = { ...errs0, ...errs1, ...errs2 };
              if (Object.keys(allErrs).length > 0) {
                setErrors(allErrs);
                if (Object.keys(errs0).length > 0) setStep(0);
                else if (Object.keys(errs1).length > 0) setStep(1);
                else setStep(2);
                return;
              }
              handleSubmit();
            }}
            disabled={submitting}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {submitting ? "Saving..." : editId ? "Save Changes →" : isAdmin ? "Create Listing →" : "Submit Listing →"}
          </button>
        )}
      </div>
    </div>
  );
}
