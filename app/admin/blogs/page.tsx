import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogActions } from "@/components/admin/AdminBlogActions";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, User, Link2 } from "lucide-react";

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Blog Manager</h1>
            <p className="text-[#6B7280] mt-1">
              {blogs.length} total · {blogs.filter((b: any) => b.isPublished).length} published
            </p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAF8]">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden xl:table-cell">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {blogs.map((blog: any) => (
                  <tr key={blog._id?.toString()} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1A1A2E] line-clamp-1 max-w-xs">{blog.title}</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{blog.readTime} min read</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="bg-primary-50 text-primary-600 text-xs px-2.5 py-1 rounded-full">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      {blog.author?.name ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          {blog.author.practitionerSlug ? (
                            <Link
                              href={`/practitioners/${blog.author.practitionerSlug}`}
                              target="_blank"
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <Link2 className="w-3 h-3" />
                              {blog.author.name}
                            </Link>
                          ) : (
                            <span className="flex items-center gap-1 text-[#6B7280]">
                              <User className="w-3 h-3" />
                              {blog.author.name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.isPublished ? "bg-accent-50 text-accent-700" : "bg-gray-100 text-gray-500"}`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6B7280] hidden lg:table-cell">
                      {blog.publishedAt ? formatDate(blog.publishedAt) : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <AdminBlogActions id={blog._id?.toString()} slug={blog.slug} isPublished={blog.isPublished} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && (
              <div className="text-center py-12 text-[#6B7280]">No blog articles yet.</div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
