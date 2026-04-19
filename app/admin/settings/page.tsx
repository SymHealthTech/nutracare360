import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-7">
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Settings</h1>
          <p className="text-[#6B7280] mt-1">Manage your admin account and platform settings.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 space-y-6">
          <div>
            <h2 className="font-semibold text-[#1A1A2E] mb-1">Admin Account</h2>
            <p className="text-sm text-[#6B7280]">Logged in as: <span className="font-medium text-[#1A1A2E]">{session.user?.email}</span></p>
          </div>
          <div className="border-t border-[#E5E7EB] pt-5">
            <h2 className="font-semibold text-[#1A1A2E] mb-3">Platform Status</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#FAFAF8] rounded-xl p-4">
                <div className="text-xs text-[#6B7280] mb-1">Payment System</div>
                <div className="font-medium text-[#1A1A2E]">Not yet active</div>
                <div className="text-xs text-[#6B7280] mt-1">Premium listings — coming soon</div>
              </div>
              <div className="bg-[#FAFAF8] rounded-xl p-4">
                <div className="text-xs text-[#6B7280] mb-1">Email Notifications</div>
                <div className="font-medium text-[#1A1A2E]">Configured via .env</div>
                <div className="text-xs text-[#6B7280] mt-1">SMTP settings in environment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
