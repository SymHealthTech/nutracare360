"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  isPublished: boolean;
}

export function AdminStoryActions({ id, isPublished }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const togglePublish = async () => {
    setLoading(true);
    await fetch(`/api/success-stories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !isPublished }),
    });
    router.refresh();
    setLoading(false);
  };

  const deleteStory = async () => {
    if (!confirm("Delete this story permanently?")) return;
    setLoading(true);
    await fetch(`/api/success-stories/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={togglePublish}
        disabled={loading}
        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors disabled:opacity-50 ${
          isPublished
            ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            : "bg-accent-50 text-accent-700 hover:bg-accent-100"
        }`}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={deleteStory}
        disabled={loading}
        className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
