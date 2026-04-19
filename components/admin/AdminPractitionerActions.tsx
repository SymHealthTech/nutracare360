"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  id: string;
  currentStatus: string;
}

export function AdminPractitionerActions({ id, currentStatus }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const updateStatus = async (status: string) => {
    setLoading(status);
    await fetch(`/api/practitioners/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(null);
  };

  if (currentStatus === "approved") {
    return (
      <button onClick={() => updateStatus("rejected")} disabled={loading === "rejected"}
        className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50">
        <XCircle className="w-3 h-3" /> Reject
      </button>
    );
  }

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-1">
        <button onClick={() => updateStatus("approved")} disabled={!!loading}
          className="text-xs bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium hover:bg-accent-100 transition-colors flex items-center gap-1 disabled:opacity-50">
          <CheckCircle className="w-3 h-3" /> {loading === "approved" ? "..." : "Approve"}
        </button>
        <button onClick={() => updateStatus("rejected")} disabled={!!loading}
          className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50">
          <XCircle className="w-3 h-3" /> {loading === "rejected" ? "..." : "Reject"}
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => updateStatus("approved")} disabled={loading === "approved"}
      className="text-xs bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium hover:bg-accent-100 transition-colors flex items-center gap-1 disabled:opacity-50">
      <CheckCircle className="w-3 h-3" /> Approve
    </button>
  );
}
