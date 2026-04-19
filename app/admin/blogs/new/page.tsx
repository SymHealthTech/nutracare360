import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminNewBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto">
        <div className="mb-7">
          <Link
            href="/admin/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-primary-600 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Blog Manager
          </Link>
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">New Article</h1>
          <p className="text-[#6B7280] mt-1">Create a new blog post for the NutraCare360 blog.</p>
        </div>
        <AdminBlogForm />
      </div>
    </AdminShell>
  );
}
