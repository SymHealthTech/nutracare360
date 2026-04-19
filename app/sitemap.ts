import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import Blog from "@/models/Blog";
import { CATEGORIES, CITIES } from "@/lib/constants";

const BASE = "https://nutracare360.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/practitioners`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/cities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blogs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/success-stories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/join-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map((city) => ({
    url: `${BASE}/cities/${city.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let practitionerRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    await connectDB();
    const practitioners = await Practitioner.find({ status: "approved" }).select("slug updatedAt").lean();
    practitionerRoutes = practitioners.map((p: Record<string, unknown>) => ({
      url: `${BASE}/practitioners/${p.slug}`,
      lastModified: (p.updatedAt as Date) || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const blogs = await Blog.find({ isPublished: true }).select("slug publishedAt").lean();
    blogRoutes = blogs.map((b: Record<string, unknown>) => ({
      url: `${BASE}/blogs/${b.slug}`,
      lastModified: (b.publishedAt as Date) || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // fail silently during build if DB unavailable
  }

  return [...staticRoutes, ...categoryRoutes, ...cityRoutes, ...practitionerRoutes, ...blogRoutes];
}
