"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Send, Clock } from "lucide-react";

interface Props {
  id: string;
  previewUrl: string;
  email?: string;
  expiresAt?: string;
}

export function ReviewLinkPanel({ id, previewUrl, email, expiresAt }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(previewUrl);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNote("Couldn't copy automatically — select the link and copy manually.");
    }
  };

  const resend = async () => {
    setSending(true);
    setNote("");
    try {
      const res = await fetch(`/api/practitioners/${id}/review-link`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNote(data.error || "Failed to send. Please try again.");
        return;
      }
      // A fresh token invalidates the old link — reflect the new URL here.
      if (data.previewUrl) setUrl(data.previewUrl);
      setNote(data.emailSent ? "A fresh preview link was emailed." : "Link regenerated, but the email failed to send. Share the link manually.");
      router.refresh();
    } catch {
      setNote("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="flex items-start gap-2">
        <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-900">Awaiting practitioner confirmation</p>
          <p className="text-xs text-amber-700 mt-0.5">
            This listing is hidden from the public. A private preview link was sent to{" "}
            <strong>{email || "the practitioner"}</strong>. It goes live when they click <em>Confirm &amp; Publish</em>.
            {expiresAt && <> Link expires {new Date(expiresAt).toLocaleDateString("en-CA")}.</>}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-0 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs text-[#374151] outline-none"
            />
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-lg bg-white border border-amber-200 px-3 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={resend}
              disabled={sending}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-60 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" /> {sending ? "Sending…" : "Resend email"}
            </button>
          </div>
          {note && <p className="mt-2 text-xs text-amber-800">{note}</p>}
        </div>
      </div>
    </div>
  );
}
