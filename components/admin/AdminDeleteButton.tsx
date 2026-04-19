"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  name: string;
  redirectTo?: string;
}

export function AdminDeleteButton({ id, name, redirectTo = "/admin/practitioners" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/practitioners/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        alert("Failed to delete. Please try again.");
        setLoading(false);
        setOpen(false);
      }
    } catch {
      alert("Failed to delete. Please try again.");
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
      >
        <Trash2 className="w-3 h-3" /> Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !loading && setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-playfair text-lg font-bold text-[#1A1A2E] mb-2">Delete Practitioner</h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Are you sure you want to permanently delete <strong className="text-[#1A1A2E]">{name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:border-primary-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
