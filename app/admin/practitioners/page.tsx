import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminPractitionerActions } from "@/components/admin/AdminPractitionerActions";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

interface Props { searchParams: { status?: string } }

export default async function AdminPractitionersPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  const filter = searchParams.status ? { status: searchParams.status } : {};
  const practitioners = await Practitioner.find(filter).sort({ createdAt: -1 }).lean();

  const counts = {
    all: await Practitioner.countDocuments(),
    pending: await Practitioner.countDocuments({ status: "pending" }),
    approved: await Practitioner.countDocuments({ status: "approved" }),
    rejected: await Practitioner.countDocuments({ status: "rejected" }),
  };

  const statusTabs = [
    { label: "All", value: "", count: counts.all },
    { label: "Pending", value: "pending", count: counts.pending },
    { label: "Approved", value: "approved", count: counts.approved },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Practitioners</h1>
            <p className="text-[#6B7280] mt-1">Review, approve, and manage practitioner listings.</p>
          </div>
          <Link
            href="/admin/practitioners/new"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {statusTabs.map((tab) => (
            <Link key={tab.value} href={tab.value ? `/admin/practitioners?status=${tab.value}` : "/admin/practitioners"}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${(!searchParams.status && !tab.value) || searchParams.status === tab.value ? "bg-primary-500 text-white" : "bg-white border border-[#E5E7EB] text-[#374151] hover:border-primary-300"}`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${(!searchParams.status && !tab.value) || searchParams.status === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {tab.count}
              </span>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAF8]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Categories</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">City</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden xl:table-cell">Submitted</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {practitioners.map((p: any) => (
                  <tr key={p._id?.toString()} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar: profileImage for individuals, clinicDetails.logo for clinics */}
                        {(p.profileImage || p.clinicDetails?.logo) ? (
                          <img
                            src={p.profileImage || p.clinicDetails?.logo}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#E5E7EB]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600 text-sm font-bold">
                            {p.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#1A1A2E]">{p.name}</div>
                          <div className="text-xs text-[#6B7280]">{p.designation || p.clinicDetails?.clinicName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.categories?.slice(0, 2).map((c: string) => (
                          <span key={c} className="bg-primary-50 text-primary-600 text-xs px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                        {p.categories?.length > 2 && <span className="text-xs text-[#6B7280]">+{p.categories.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280] hidden md:table-cell">{p.address?.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.status === "approved" ? "bg-accent-50 text-accent-700"
                        : p.status === "pending" ? "bg-yellow-50 text-yellow-700"
                        : p.status === "rejected" ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B7280] hidden xl:table-cell">
                      {new Date(p.createdAt).toLocaleDateString("en-CA")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/admin/practitioners/${p._id}`}
                          className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-lg font-medium hover:bg-primary-100 transition-colors">
                          View
                        </Link>
                        <Link href={`/admin/practitioners/${p._id}/edit`}
                          className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </Link>
                        <AdminPractitionerActions id={p._id?.toString()} currentStatus={p.status} />
                        <AdminDeleteButton id={p._id?.toString()} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {practitioners.length === 0 && (
              <div className="text-center py-12 text-[#6B7280]">No practitioners found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
