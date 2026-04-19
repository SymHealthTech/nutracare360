import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blog = await Blog.findOne({ slug: params.slug, isPublished: true }).lean() as any;
  if (!blog) return {};
  return {
    title: `${blog.title} | NutraCare360 Blog`,
    description: blog.excerpt as string,
    openGraph: { images: [blog.coverImage as string] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  await connectDB();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blog = await Blog.findOne({ slug: params.slug, isPublished: true }).lean() as any;
  if (!blog) notFound();

  return (
    <div className="pt-16 min-h-screen bg-[#FAFAF8]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-primary-500 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Articles
        </Link>

        <div className="mb-4">
          <span className="bg-primary-500 text-white text-xs px-3 py-1 rounded-full font-medium">{blog.category}</span>
        </div>

        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-6">
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{blog.readTime} min read</span>
          {blog.publishedAt && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{formatDate(blog.publishedAt)}</span>}
          {blog.author?.name && (
            <span>
              By{" "}
              {blog.author.practitionerSlug ? (
                <Link
                  href={`/practitioners/${blog.author.practitionerSlug}`}
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  {blog.author.name}
                </Link>
              ) : (
                blog.author.name
              )}
            </span>
          )}
        </div>

        {blog.coverImage && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-5 text-sm text-primary-800">
            <strong>Medical Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional before making health decisions.
          </div>
        </div>
      </article>
    </div>
  );
}
