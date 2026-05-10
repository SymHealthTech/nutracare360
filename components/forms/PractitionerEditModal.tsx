"use client";

import { useState, useRef, useEffect } from "react";
import { X, Mail, ShieldCheck, ArrowRight, RefreshCw, Pencil } from "lucide-react";
import { JoinUsForm } from "./JoinUsForm";

type ModalStep = "email" | "otp" | "edit" | "updated";

interface PractitionerData {
  _id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

export function PractitionerEditModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // After request-otp
  const [initials, setInitials] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  // After verify-otp
  const [editToken, setEditToken] = useState("");
  const [practitionerId, setPractitionerId] = useState("");
  const [practitionerData, setPractitionerData] = useState<PractitionerData | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && step === "email") {
      setTimeout(() => emailInputRef.current?.focus(), 100);
    }
    if (step === "otp") {
      setTimeout(() => otpInputRef.current?.focus(), 100);
    }
  }, [isOpen, step]);

  // Cooldown countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [resendCooldown]);

  const resetModal = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setError("");
    setInitials("");
    setMaskedEmail("");
    setEditToken("");
    setPractitionerId("");
    setPractitionerData(null);
    setResendCooldown(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(resetModal, 300);
  };

  const handleSendOTP = async () => {
    if (!email.trim()) { setError("Please enter your email address"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/practitioners/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send verification code"); return; }
      setInitials(data.initials);
      setMaskedEmail(data.maskedEmail);
      setOtp("");
      setStep("otp");
      setResendCooldown(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/practitioners/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to resend code"); return; }
      setOtp("");
      setResendCooldown(60);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) { setError("Please enter the 6-digit code"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/practitioners/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid code"); return; }
      setEditToken(data.editToken);
      setPractitionerId(data.practitionerId);
      setPractitionerData(data.practitioner);
      setStep("edit");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    // Clear edit session — require re-verification for any further updates
    setEditToken("");
    setPractitionerData(null);
    setStep("updated");
  };

  const handleOTPKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleVerifyOTP();
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendOTP();
  };

  // Backdrop click closes modal only on email/otp steps (not mid-edit)
  const handleBackdropClick = () => {
    if (step !== "edit") handleClose();
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-primary-300 bg-white text-primary-600 text-sm font-semibold hover:bg-primary-50 hover:border-primary-400 transition-all shadow-sm"
      >
        <Pencil className="w-4 h-4" />
        Update My Listing
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" onClick={handleBackdropClick} />

          {/* Modal card */}
          <div
            className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ maxWidth: step === "edit" ? "800px" : "440px", maxHeight: "90vh", overflowY: "auto" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-lg font-bold text-white">Update Your Listing</h2>
                <p className="text-white/75 text-xs mt-0.5">
                  {step === "email" && "Enter your registered email to get started"}
                  {step === "otp" && "Check your email for the verification code"}
                  {step === "edit" && "Update your listing information below"}
                  {step === "updated" && "Your listing has been updated successfully"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicator (email + otp only) */}
            {(step === "email" || step === "otp") && (
              <div className="flex items-center gap-0 px-6 py-3 bg-primary-50 border-b border-primary-100">
                <StepDot active={step === "email"} done={step === "otp"} label="1. Email" />
                <div className="h-px flex-1 bg-primary-200 mx-2" />
                <StepDot active={step === "otp"} done={false} label="2. Verify" />
                <div className="h-px flex-1 bg-primary-200 mx-2" />
                <StepDot active={false} done={false} label="3. Edit" dimmed />
              </div>
            )}

            <div className="p-6">
              {/* ── Step 1: Email ── */}
              {step === "email" && (
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-primary-500" />
                    </div>
                    <p className="text-[#374151] text-sm">
                      Enter the email address associated with your NutraCare360 listing. We&apos;ll send a verification code to confirm your identity.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                      Registered Email Address
                    </label>
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      onKeyDown={handleEmailKeyDown}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all"
                    />
                  </div>
                  {error && <ErrorBox message={error} />}
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || !email.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {loading ? <Spinner /> : <><ArrowRight className="w-4 h-4" /> Send Verification Code</>}
                  </button>
                </div>
              )}

              {/* ── Step 2: OTP ── */}
              {step === "otp" && (
                <div className="space-y-5">
                  {/* Initials avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                      style={{ background: "linear-gradient(135deg, #2d6a4f, #40916c)" }}
                    >
                      {initials}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#1A1A2E]">Code sent to</p>
                      <p className="text-primary-600 font-mono text-sm">{maskedEmail}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5 text-center">
                      6-Digit Verification Code
                    </label>
                    <input
                      ref={otpInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setOtp(v);
                        setError("");
                      }}
                      onKeyDown={handleOTPKeyDown}
                      placeholder="000000"
                      className="w-full px-4 py-4 rounded-xl border border-[#E5E7EB] text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition-all font-mono"
                    />
                    <p className="text-xs text-[#9CA3AF] text-center mt-1.5">
                      Check your inbox — expires in 15 minutes
                    </p>
                  </div>

                  {error && <ErrorBox message={error} />}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {loading ? <Spinner /> : <><ShieldCheck className="w-4 h-4" /> Verify & Continue</>}
                  </button>

                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <button
                      onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                      className="hover:text-primary-600 transition-colors"
                    >
                      ← Change email
                    </button>
                    <button
                      onClick={handleResendOTP}
                      disabled={resendCooldown > 0 || loading}
                      className="flex items-center gap-1 hover:text-primary-600 disabled:text-[#9CA3AF] disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Edit form ── */}
              {step === "edit" && practitionerData && (
                <div>
                  <div className="mb-4 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-xs text-primary-700 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
                    <span>
                      Identity verified. You can update your listing below. After saving, you&apos;ll need to verify again for any further changes.
                    </span>
                  </div>
                  <JoinUsForm
                    editId={practitionerId}
                    initialData={practitionerData}
                    selfEditToken={editToken}
                    onSelfUpdateSuccess={handleUpdateSuccess}
                  />
                </div>
              )}

              {/* ── Step 4: Updated ── */}
              {step === "updated" && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#1A1A2E]">Listing Updated!</h3>
                    <p className="text-[#6B7280] text-sm mt-1">
                      Your changes have been saved. They are live on your profile immediately.
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 text-left">
                    To make further updates, you&apos;ll need to verify your email again for security.
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { resetModal(); }}
                      className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:border-primary-300 transition-colors"
                    >
                      Update Again
                    </button>
                    <button
                      onClick={handleClose}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StepDot({ active, done, label, dimmed }: { active: boolean; done: boolean; label: string; dimmed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          done ? "bg-primary-500 text-white" : active ? "bg-primary-600 text-white ring-2 ring-primary-200" : dimmed ? "bg-[#E5E7EB] text-[#9CA3AF]" : "bg-[#E5E7EB] text-[#9CA3AF]"
        }`}
      >
        {done ? "✓" : label.split(".")[0]}
      </div>
      <span className={`text-xs font-medium ${active ? "text-primary-700" : "text-[#9CA3AF]"}`}>
        {label.split(". ")[1]}
      </span>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-3">
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}
