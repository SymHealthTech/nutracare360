import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { BookOpen, Clock, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Holistic Health Blog | NutraCare360",
  description: "Expert articles on Ayurveda, Acupuncture, Naturopathy, Homeopathy, and all complementary medicine disciplines across Canada.",
};

export default async function BlogsPage() {
  await connectDB();
  const blogs = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();

  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-4">
            Holistic Health Blog
          </h1>
          <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
            Expert insights, research summaries, and practical guides on complementary medicine in Canada.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-[#6B7280]">No articles yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {blogs.map((blog: any) => (
              <div key={blog.slug} className="group bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-md transition-shadow">
                <Link href={`/blogs/${blog.slug}`} className="block">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={blog.coverImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">{blog.category}</span>
                    </div>
                  </div>
                  <div className="px-5 pt-5">
                    <div className="flex items-center gap-3 text-xs text-[#6B7280] mb-2">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{blog.readTime} min read</span>
                      {blog.publishedAt && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(blog.publishedAt)}</span>}
                    </div>
                    <h2 className="font-playfair font-semibold text-[#1A1A2E] text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-xs text-[#6B7280] line-clamp-3">{blog.excerpt}</p>
                  </div>
                </Link>
                <div className="px-5 pb-5 mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    {blog.author?.practitionerSlug ? (
                      <Link
                        href={`/practitioners/${blog.author.practitionerSlug}`}
                        className="hover:text-primary-500 transition-colors font-medium"
                      >
                        {blog.author.name}
                      </Link>
                    ) : (
                      <span>{blog.author?.name}</span>
                    )}
                  </div>
                  <Link href={`/blogs/${blog.slug}`} className="text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
                    Read Article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
