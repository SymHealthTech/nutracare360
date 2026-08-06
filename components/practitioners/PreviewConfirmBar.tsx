"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, MessageSquare, X } from "lucide-react";

interface Props {
  slug: string;
  token: string;
  displayName: string;
}

export function PreviewConfirmBar({ slug, token, displayName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"confirm" | "request" | null>(null);
  const [done, setDone] = useState<"published" | "requested" | null>(null);
  const [error, setError] = useState("");
  const [showRequest, setShowRequest] = useState(false);
  const [message, setMessage] = useState("");

  const call = async (action: "confirm" | "request-changes", msg?: string) => {
    setError("");
    setLoading(action === "confirm" ? "confirm" : "request");
    try {
      const res = await fetch("/api/practitioners/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, message: msg }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (action === "confirm") {
        setDone("published");
        // Reload without the token so the now-live public page renders.
        setTimeout(() => {
          router.push(`/practitioners/${slug}`);
          router.refresh();
        }, 1800);
      } else {
        setDone("requested");
        setShowRequest(false);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#1A1A2E] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex-shrink-0 bg-white/10 rounded-lg p-1.5">
              <Eye className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              {done === "published" ? (
                <p className="text-sm font-semibold text-emerald-300">Published! Your listing is now live 🎉</p>
              ) : done === "requested" ? (
                <p className="text-sm font-semibold text-amber-200">Thanks — we&apos;ve received your change request.</p>
              ) : (
                <>
                  <p className="text-sm font-semibold leading-tight">Preview — not yet public</p>
                  <p className="text-xs text-white/60 truncate">Review your listing below, then confirm to publish it.</p>
                </>
              )}
            </div>
          </div>

          {!done && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowRequest(true)}
                disabled={!!loading}
                className="flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <MessageSquare className="w-4 h-4" /> Request changes
              </button>
              <button
                onClick={() => call("confirm")}
                disabled={!!loading}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
              >
                <CheckCircle className="w-4 h-4" />
                {loading === "confirm" ? "Publishing…" : "Confirm & Publish"}
              </button>
            </div>
          )}
        </div>
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 -mt-1">
            <p className="text-xs text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Request changes modal */}
      {showRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => !loading && setShowRequest(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-[#1A1A2E]">Request changes</h3>
              <button onClick={() => setShowRequest(false)} disabled={!!loading} className="text-[#9CA3AF] hover:text-[#374151]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">
              Tell us what to change on {displayName}&apos;s listing. Our team will update it and send you a fresh preview.
            </p>
            <textarea
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="e.g. Please fix the phone number and update the services list…"
              className="mt-3 w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-primary-400"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRequest(false)}
                disabled={!!loading}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#6B7280] hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => call("request-changes", message.trim())}
                disabled={!message.trim() || !!loading}
                className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
              >
                {loading === "request" ? "Sending…" : "Send request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
