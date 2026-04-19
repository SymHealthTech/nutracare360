"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface BlogData {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author?: { name?: string; avatar?: string; bio?: string; practitionerSlug?: string };
  readTime?: number;
  isPublished?: boolean;
  isAIGenerated?: boolean;
}

interface Props {
  blog?: BlogData | null;
}

export function AdminBlogForm({ blog }: Props) {
  const router = useRouter();
  const isEdit = !!blog?.slug;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: blog?.title ?? "",
    excerpt: blog?.excerpt ?? "",
    content: blog?.content ?? "",
    coverImage: blog?.coverImage ?? "",
    category: blog?.category ?? "",
    tags: blog?.tags?.join(", ") ?? "",
    authorName: blog?.author?.name ?? "",
    authorAvatar: blog?.author?.avatar ?? "",
    authorBio: blog?.author?.bio ?? "",
    authorPractitionerSlug: blog?.author?.practitionerSlug ?? "",
    readTime: blog?.readTime ?? 5,
    isPublished: blog?.isPublished ?? false,
    isAIGenerated: blog?.isAIGenerated ?? false,
  });

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      author: {
        name: form.authorName,
        avatar: form.authorAvatar,
        bio: form.authorBio,
        practitionerSlug: form.authorPractitionerSlug,
      },
      readTime: Number(form.readTime),
      isPublished: form.isPublished,
      isAIGenerated: form.isAIGenerated,
    };

    try {
      const url = isEdit ? `/api/blogs/${blog!.slug}` : "/api/blogs";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save blog");
        return;
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
        <h2 className="font-semibold text-[#1A1A2E] text-sm uppercase tracking-wider text-[#6B7280]">
          Article Details
        </h2>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Article title..."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Excerpt</label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
            placeholder="Short description shown in listings (max 300 chars)..."
            maxLength={300}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <option value="">Select...</option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Read Time (min)</label>
            <input
              type="number"
              min={1}
              max={60}
              value={form.readTime}
              onChange={(e) => set("readTime", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Tags</label>
            <input
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Ayurveda, Canada, ..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">Cover Image URL</label>
          <input
            value={form.coverImage}
            onChange={(e) => set("coverImage", e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="https://images.unsplash.com/..."
          />
        </div>
      </div>

      {/* Author */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[#6B7280] text-sm uppercase tracking-wider">Author</h2>
          <div className="group relative">
            <Info className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />
            <div className="absolute left-5 top-0 hidden group-hover:block bg-[#1A1A2E] text-white text-xs rounded-lg p-2 w-56 z-10">
              Set the Practitioner Slug to make the author name a clickable link to their profile page.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Author Name</label>
            <input
              value={form.authorName}
              onChange={(e) => set("authorName", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="e.g. Dr. Priya Sharma"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Practitioner Slug{" "}
              <span className="font-normal text-[#9CA3AF]">(makes name clickable)</span>
            </label>
            <input
              value={form.authorPractitionerSlug}
              onChange={(e) => set("authorPractitionerSlug", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="dr-priya-sharma-toronto"
            />
            {form.authorPractitionerSlug && (
              <Link
                href={`/practitioners/${form.authorPractitionerSlug}`}
                target="_blank"
                className="text-xs text-primary-500 hover:text-primary-600 mt-1 inline-block"
              >
                Preview profile →
              </Link>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Author Avatar URL</label>
            <input
              value={form.authorAvatar}
              onChange={(e) => set("authorAvatar", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">Author Bio</label>
            <input
              value={form.authorBio}
              onChange={(e) => set("authorBio", e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="Short bio or credentials..."
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 space-y-2">
        <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5">
          Article Content <span className="font-normal normal-case">(HTML supported)</span>
        </label>
        <textarea
          rows={16}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-300 resize-y"
          placeholder="<h2>Section Title</h2><p>Content here...</p>"
        />
      </div>

      {/* Publish settings */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
        <h2 className="font-semibold text-[#6B7280] text-sm uppercase tracking-wider mb-4">Settings</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            <span className="text-sm font-medium text-[#374151]">Publish immediately</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAIGenerated}
              onChange={(e) => set("isAIGenerated", e.target.checked)}
              className="w-4 h-4 accent-primary-500"
            />
            <span className="text-sm font-medium text-[#374151]">AI-assisted content</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Link
          href="/admin/blogs"
          className="px-6 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:border-primary-300 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Article"}
        </button>
      </div>
    </form>
  );
}
