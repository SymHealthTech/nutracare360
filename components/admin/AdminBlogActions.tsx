"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Trash2, Pencil } from "lucide-react";

interface Props { id: string; slug: string; isPublished: boolean }

export function AdminBlogActions({ id, slug, isPublished }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePublish = async () => {
    setLoading(true);
    await fetch(`/api/blogs/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished, publishedAt: !isPublished ? new Date() : null }),
    });
    router.refresh();
    setLoading(false);
  };

  const deleteBlog = async () => {
    if (!confirm("Delete this article permanently?")) return;
    setLoading(true);
    await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1">
      <Link href={`/blogs/${slug}`} target="_blank"
        className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
        <Eye className="w-3 h-3" />
      </Link>
      <Link href={`/admin/blogs/${slug}/edit`}
        className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-lg font-medium hover:bg-primary-100 transition-colors flex items-center gap-1">
        <Pencil className="w-3 h-3" />
      </Link>
      <button onClick={togglePublish} disabled={loading}
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${isPublished ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-accent-50 text-accent-700 hover:bg-accent-100"}`}>
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button onClick={deleteBlog} disabled={loading}
        className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
