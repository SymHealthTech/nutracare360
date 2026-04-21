import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import Blog from "@/models/Blog";
import { HeroSearch } from "@/components/home/HeroSearch";
import SuccessStoriesSlider from "@/components/about/SuccessStoriesSlider";
import { FeaturedClinicCard } from "@/components/home/FeaturedClinicCard";
import { CATEGORIES, CITIES } from "@/lib/constants";
import { Search, Heart, Phone, ArrowRight, Users, BookOpen, MapPin } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";

async function getData() {
  try {
    await connectDB();
    const [practitioners, blogs] = await Promise.all([
      Practitioner.find({ status: "approved", isFeatured: true, practiceType: { $in: ["clinic", "center"] } }).limit(3).lean(),
      Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).select("-content").lean(),
    ]);
    return { practitioners, blogs };
  } catch {
    return { practitioners: [], blogs: [] };
  }
}

export default async function HomePage() {
  const { practitioners, blogs } = await getData();

  const quickCategories = CATEGORIES.slice(0, 8);
  const featuredCities = CITIES.slice(0, 12);

  return (
    <div className="pt-16">
      {/* ── Section 1: Hero ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroSlider />

        <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto pt-8 sm:pt-4 pb-40 sm:pb-20">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-1 md:py-2 rounded-full mb-6 border border-white/30 animate-fade-in">
            <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            Canada's Holistic Health Practitioner Directory
          </div>

          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100">
            Find Your Healing Path<br />
            <span className="text-secondary-400">Across Canada</span>
          </h1>

          <p className="text-white/90 text-sm md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
            Discover certified complementary health practitioners — Chiropractic, Massage, Naturopathy, Homeopathy and 33 more specialties — all in one place.
          </p>

          <div className="animate-fade-in-up delay-300">
            <HeroSearch />
          </div>

          {/* Quick category pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in-up delay-400">
            {quickCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white">
              {[
                { num: "500+", label: "Practitioners" },
                { num: "37", label: "Specialties" },
                { num: "25+", label: "Cities" },
                { num: "100%", label: "Canadian" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold font-playfair text-secondary-400">{stat.num}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: How It Works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Your Journey to Holistic Health
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">Three simple steps to finding your perfect wellness practitioner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: "Search", color: "bg-primary-50 text-primary-600", desc: "Browse 37 therapy categories or search by your city or province" },
              { icon: Heart, title: "Discover", color: "bg-secondary-50 text-secondary-600", desc: "Read full profiles, services, working hours, and credentials" },
              { icon: Phone, title: "Connect", color: "bg-accent-50 text-accent-600", desc: "Contact your chosen practitioner directly — no middleman" },
            ].map((step, i) => (
              <div key={step.title} className={`text-center p-8 rounded-2xl bg-[#FAFAF8] border border-[#E5E7EB] hover:shadow-md transition-shadow animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="w-7 h-7 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center mx-auto mb-3">
                  {i + 1}
                </div>
                <h3 className="font-playfair text-xl font-semibold text-[#1A1A2E] mb-3">{step.title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Clinics & Centres ── */}
      {practitioners.length > 0 && (
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-2">
                  Featured Clinics &amp; Centers
                </h2>
                <p className="text-[#6B7280]">Trusted holistic health practitioners, clinics and wellness centres across Canada</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium text-sm">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {practitioners.map((p: any) => (
                <FeaturedClinicCard key={p.slug} practitioner={p} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/search" className="inline-flex items-center gap-2 text-primary-500 font-medium">
                View All Practitioners &amp; Clinics <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 4: Browse by Category ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Explore All 37 Therapy Categories
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">From ancient traditions to modern integrative therapies — find the healing modality that resonates with you</p>
          </div>

          <CategoryGrid categories={CATEGORIES} />
        </div>
      </section>

      {/* ── Section 5: Browse by City ── */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Find Practitioners in Your City
            </h2>
            <p className="text-[#6B7280]">We cover 25+ Canadian cities and growing</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {featuredCities.map((city) => (
              <Link
                key={city}
                href={`/cities/${city.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-white border border-[#E5E7EB] rounded-xl p-4 text-center hover:border-primary-300 hover:shadow-md transition-all group"
              >
                <MapPin className="w-5 h-5 text-primary-500 mx-auto mb-2 group-hover:text-primary-600" />
                <div className="text-sm font-semibold text-[#1A1A2E]">{city}</div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/cities" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium">
              View All Cities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 6: Join CTA ── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0D7377 0%, #095053 50%, #052f31 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-secondary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-7 h-7 text-secondary-400" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Are You a Complementary Health Practitioner?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join Canada&apos;s growing directory of holistic health professionals. Create your free listing today and be discovered by thousands of Canadians searching for your expertise.
          </p>
          <Link
            href="/join-us"
            className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-colors"
          >
            Create Your Free Listing → <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-white/60 text-sm mt-4">
            Free listing · No credit card required · Admin review within 48 hours
          </p>
        </div>
      </section>

      {/* ── Section 7: Latest Blogs ── */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-2">
                  Latest from Our Blog
                </h2>
                <p className="text-[#6B7280]">Expert insights on holistic health and wellness</p>
              </div>
              <Link href="/blogs" className="hidden sm:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium text-sm">
                View All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {blogs.map((blog: any) => (
                <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group bg-[#FAFAF8] rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={blog.coverImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      {blog.readTime} min read
                    </div>
                    <h3 className="font-playfair font-semibold text-[#1A1A2E] text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{blog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Section 8: Success Stories ── */}
      <section className="py-20 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Real Stories, Real Healing
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Canadians sharing their transformative holistic health experiences with practitioners and clinics on NutraCare360.
            </p>
          </div>
          <SuccessStoriesSlider />
        </div>
      </section>
    </div>
  );
}
