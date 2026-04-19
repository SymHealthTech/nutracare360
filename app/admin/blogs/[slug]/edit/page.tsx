import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminBlogForm } from "@/components/admin/AdminBlogForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export default async function AdminEditBlogPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blog = await Blog.findOne({ slug: params.slug }).lean() as any;
  if (!blog) notFound();

  const blogData = {
    slug: blog.slug as string,
    title: blog.title as string,
    excerpt: blog.excerpt as string,
    content: blog.content as string,
    coverImage: blog.coverImage as string,
    category: blog.category as string,
    tags: blog.tags as string[],
    author: blog.author as { name?: string; avatar?: string; bio?: string; practitionerSlug?: string },
    readTime: blog.readTime as number,
    isPublished: blog.isPublished as boolean,
    isAIGenerated: blog.isAIGenerated as boolean,
  };

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
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E]">Edit Article</h1>
          <p className="text-[#6B7280] mt-1 line-clamp-1">{blog.title}</p>
        </div>
        <AdminBlogForm blog={blogData} />
      </div>
    </AdminShell>
  );
}
