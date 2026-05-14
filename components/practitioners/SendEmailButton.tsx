"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function SendEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleSend = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = `mailto:${email}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 flex gap-2">
      <a
        href={`mailto:${email}`}
        onClick={handleSend}
        className="flex-1 border border-primary-500 text-primary-500 hover:bg-primary-50 text-center py-3 rounded-xl font-semibold text-sm transition-colors"
      >
        Send Email
      </a>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? "Copied!" : "Copy email address"}
        className="border border-primary-500 text-primary-500 hover:bg-primary-50 py-3 px-3 rounded-xl text-sm transition-colors flex items-center"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
