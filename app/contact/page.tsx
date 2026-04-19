"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", type: "general" as const });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setDone(true);
    setSubmitting(false);
  };

  const inputCls = "w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400 transition-colors";
  const labelCls = "block text-xs font-semibold text-[#374151] mb-1.5 uppercase tracking-wider";

  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">Contact Us</h1>
          <p className="text-[#6B7280] text-lg">We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-5">
            {[
              { icon: Mail, title: "Email", value: "contact@nutracare360.ca" },
              { icon: Phone, title: "Phone", value: "+1 (416) 555-0100" },
              { icon: MapPin, title: "Based in", value: "Canada" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E5E7EB]">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{item.title}</div>
                  <div className="text-sm text-[#1A1A2E] font-medium mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-7">
            {done ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-accent-500" />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E] mb-2">Message Sent!</h2>
                <p className="text-[#6B7280]">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Name *</label>
                    <input required className={inputCls} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input required type="email" className={inputCls} value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.ca" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Subject</label>
                  <input className={inputCls} value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="How can we help?" />
                </div>
                <div>
                  <label className={labelCls}>Message *</label>
                  <textarea required className={`${inputCls} min-h-28 resize-y`} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us more..." />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
