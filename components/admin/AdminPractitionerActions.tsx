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
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const updateStatus = async (status: string, rejectReason?: string) => {
    setLoading(status);
    await fetch(`/api/practitioners/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason: rejectReason }),
    });
    setShowReject(false);
    setReason("");
    router.refresh();
    setLoading(null);
  };

  const rejectButton = (
    <button
      onClick={() => setShowReject(true)}
      disabled={loading === "rejected"}
      className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
    >
      <XCircle className="w-3 h-3" /> {loading === "rejected" ? "..." : "Reject"}
    </button>
  );

  // For a listing still awaiting the practitioner's confirmation, the admin can
  // override and publish it directly ("Publish now").
  const approveLabel = currentStatus === "awaiting_confirmation" ? "Publish now" : "Approve";
  const approveButton = (
    <button
      onClick={() => updateStatus("approved")}
      disabled={!!loading}
      className="text-xs bg-accent-50 text-accent-700 px-2.5 py-1 rounded-lg font-medium hover:bg-accent-100 transition-colors flex items-center gap-1 disabled:opacity-50"
    >
      <CheckCircle className="w-3 h-3" /> {loading === "approved" ? "..." : approveLabel}
    </button>
  );

  return (
    <>
      {currentStatus === "pending" || currentStatus === "awaiting_confirmation" ? (
        <div className="flex gap-1">
          {approveButton}
          {rejectButton}
        </div>
      ) : currentStatus === "approved" ? (
        rejectButton
      ) : (
        approveButton
      )}

      {showReject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !loading && setShowReject(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Reject listing</h3>
            <p className="mt-1 text-sm text-[#6B7280]">
              Add a reason for rejection. It will be included in the email sent to the practitioner.
            </p>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="e.g. Missing valid certification details, unclear service description…"
              className="mt-3 w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-primary-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowReject(false)}
                disabled={!!loading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#6B7280] hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateStatus("rejected", reason.trim())}
                disabled={!reason.trim() || !!loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading === "rejected" ? "Rejecting…" : "Reject & Notify"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
