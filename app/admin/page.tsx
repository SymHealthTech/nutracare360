import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import Blog from "@/models/Blog";
import SuccessStory from "@/models/SuccessStory";
import { AdminShell } from "@/components/admin/AdminShell";
import { Users, FileText, Clock, CheckCircle, Star } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  const [total, pending, approved, blogs, stories] = await Promise.all([
    Practitioner.countDocuments(),
    Practitioner.countDocuments({ status: "pending" }),
    Practitioner.countDocuments({ status: "approved" }),
    Blog.countDocuments(),
    SuccessStory.countDocuments(),
  ]);

  const recentSubmissions = await Practitioner.find().sort({ createdAt: -1 }).limit(8).select("name designation address status createdAt profileImage clinicDetails.logo practiceType").lean();

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-7">
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Dashboard</h1>
          <p className="text-[#6B7280] mt-1">Welcome back, admin. Here&apos;s your platform overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Practitioners", value: total, icon: Users, color: "bg-primary-50 text-primary-500" },
            { label: "Pending Review", value: pending, icon: Clock, color: "bg-yellow-50 text-yellow-500" },
            { label: "Approved", value: approved, icon: CheckCircle, color: "bg-accent-50 text-accent-500" },
            { label: "Blog Articles", value: blogs, icon: FileText, color: "bg-blue-50 text-blue-500" },
            { label: "Success Stories", value: stories, icon: Star, color: "bg-secondary-50 text-secondary-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-[#1A1A2E]">{stat.value}</div>
              <div className="text-xs text-[#6B7280] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent submissions */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <h2 className="font-semibold text-[#1A1A2E]">Recent Submissions</h2>
            <Link href="/admin/practitioners" className="text-xs text-primary-500 hover:text-primary-600 font-medium">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAF8]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">City</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentSubmissions.map((p: any) => (
                  <tr key={p._id?.toString()} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2.5">
                        {(p.profileImage || p.clinicDetails?.logo) ? (
                          <img
                            src={p.profileImage || p.clinicDetails?.logo}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-[#E5E7EB]"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 text-xs font-bold">
                            {p.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="font-medium text-[#1A1A2E]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-[#6B7280] hidden md:table-cell">{p.address?.city}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === "approved" ? "bg-accent-50 text-accent-700"
                        : p.status === "pending" ? "bg-yellow-50 text-yellow-700"
                        : p.status === "rejected" ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[#6B7280] text-xs hidden lg:table-cell">
                      {new Date(p.createdAt).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/practitioners/${p._id}`} className="text-primary-500 hover:text-primary-600 text-xs font-medium">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
