"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Star } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface StoryData {
  _id?: string;
  patientName?: string;
  patientAvatar?: string;
  patientCity?: string;
  therapyType?: string;
  practitionerName?: string;
  practitionerSlug?: string;
  story?: string;
  beforeAfter?: string;
  rating?: number;
  isPublished?: boolean;
}

interface Props {
  story?: StoryData | null;
  trigger: React.ReactNode;
}

export function AdminSuccessStoryModal({ story, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isEdit = !!story?._id;

  const blank = {
    patientName: "",
    patientAvatar: "",
    patientCity: "",
    therapyType: "",
    practitionerName: "",
    practitionerSlug: "",
    story: "",
    beforeAfter: "",
    rating: 5,
    isPublished: false,
  };

  const [form, setForm] = useState({
    patientName: story?.patientName ?? "",
    patientAvatar: story?.patientAvatar ?? "",
    patientCity: story?.patientCity ?? "",
    therapyType: typeof story?.therapyType === "object" ? (story.therapyType as any)?.name ?? "" : story?.therapyType ?? "",
    practitionerName: story?.practitionerName ?? "",
    practitionerSlug: story?.practitionerSlug ?? "",
    story: story?.story ?? "",
    beforeAfter: story?.beforeAfter ?? "",
    rating: story?.rating ?? 5,
    isPublished: story?.isPublished ?? false,
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEdit ? `/api/success-stories/${story!._id}` : "/api/success-stories";
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setOpen(false);
      if (!isEdit) setForm(blank);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-12">
            <div className="absolute inset-0 bg-black/50" onClick={() => !loading && setOpen(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
                <h2 className="font-playfair text-xl font-bold text-[#1A1A2E]">
                  {isEdit ? "Edit Story" : "New Success Story"}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#6B7280] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Patient info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Patient Name *</label>
                    <input
                      required
                      value={form.patientName}
                      onChange={(e) => set("patientName", e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="e.g. Jennifer Walsh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Patient City</label>
                    <input
                      value={form.patientCity}
                      onChange={(e) => set("patientCity", e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="e.g. Toronto, ON"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Patient Avatar URL</label>
                    <input
                      value={form.patientAvatar}
                      onChange={(e) => set("patientAvatar", e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                {/* Practitioner info */}
                <div className="bg-primary-50 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Practitioner / Clinic</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">Display Name</label>
                      <input
                        value={form.practitionerName}
                        onChange={(e) => set("practitionerName", e.target.value)}
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
                        placeholder="e.g. Dr. Priya Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#374151] mb-1">
                        Profile Slug <span className="font-normal text-[#9CA3AF]">(enables profile link)</span>
                      </label>
                      <input
                        value={form.practitionerSlug}
                        onChange={(e) => set("practitionerSlug", e.target.value)}
                        className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 font-mono"
                        placeholder="dr-priya-sharma-toronto"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Therapy Type</label>
                    <select
                      value={form.therapyType}
                      onChange={(e) => set("therapyType", e.target.value)}
                      className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      <option value="">Select therapy...</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Story content */}
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Patient Story *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.story}
                    onChange={(e) => set("story", e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
                    placeholder="The patient's healing story in their own words..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">Before / After Summary</label>
                  <textarea
                    rows={2}
                    value={form.beforeAfter}
                    onChange={(e) => set("beforeAfter", e.target.value)}
                    className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
                    placeholder="e.g. Before: 6 years of chronic pain. After: pain-free and medication-free."
                  />
                </div>

                {/* Rating + publish */}
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => set("rating", r)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              r <= form.rating
                                ? "fill-secondary-400 text-secondary-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => set("isPublished", e.target.checked)}
                      className="w-4 h-4 accent-primary-500"
                    />
                    <span className="text-sm font-medium text-[#374151]">Publish immediately</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:border-primary-300 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Story"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
