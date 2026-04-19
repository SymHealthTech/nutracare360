"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PractitionerCard } from "@/components/practitioners/PractitionerCard";
import { CATEGORIES, CITIES, PROVINCES } from "@/lib/constants";
import { Search, SlidersHorizontal, X } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [practitioners, setPractitioners] = useState<unknown[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [nameQuery, setNameQuery] = useState(searchParams.get("name") || "");
  const [debouncedName, setDebouncedName] = useState(nameQuery);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [province, setProvince] = useState(searchParams.get("province") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("rating");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNameChange = (value: string) => {
    setNameQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedName(value), 350);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (debouncedName) params.set("name", debouncedName);
      if (category) params.set("category", category);
      if (city) params.set("city", city);
      if (province) params.set("province", province);
      if (verifiedOnly) params.set("verified", "true");
      params.set("sort", sort);
      params.set("limit", "24");

      const res = await fetch(`/api/practitioners?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPractitioners(data.practitioners);
        setTotal(data.total);
      }
      setLoading(false);
    };
    fetchData();
  }, [debouncedName, category, city, province, verifiedOnly, sort]);

  const handleClear = () => {
    setNameQuery("");
    setDebouncedName("");
    setCategory("");
    setCity("");
    setProvince("");
    setVerifiedOnly(false);
    setSort("rating");
    router.push("/search");
  };

  const activeFilters = [nameQuery, category, city, province, verifiedOnly ? "Verified only" : ""].filter(Boolean);

  return (
    <div className="pt-20 min-h-screen bg-[#FAFAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E] mb-4">
            {loading ? "Searching..." : `${total} Practitioner${total !== 1 ? "s" : ""} Found`}
          </h1>
          {(category || city) && (
            <p className="text-[#6B7280] mb-4">
              {category && `for "${category}"`} {city && `in ${city}`}
            </p>
          )}
          {/* Name search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Search by name or initials (e.g. &quot;John&quot; or &quot;JD&quot;)…"
              className="w-full pl-10 pr-10 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 transition"
            />
            {nameQuery && (
              <button
                onClick={() => handleNameChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar filters */}
          <aside className={`${filtersOpen ? "block" : "hidden"} lg:block bg-white rounded-2xl border border-[#E5E7EB] p-6 h-fit mb-6 lg:mb-0`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-[#1A1A2E]">Filters</h2>
              {activeFilters.length > 0 && (
                <button onClick={handleClear} className="text-xs text-primary-500 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400"
                >
                  <option value="">All categories</option>
                  {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wider">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400"
                >
                  <option value="">Any city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wider">Province</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400"
                >
                  <option value="">Any province</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-2 uppercase tracking-wider">Sort by</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#1A1A2E] bg-white outline-none focus:border-primary-400"
                >
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-primary-500"
                />
                <span className="text-sm text-[#374151]">Verified only</span>
              </label>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 bg-white border border-[#E5E7EB] px-4 py-2 rounded-xl text-sm font-medium text-[#1A1A2E]"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeFilters.length > 0 && (
                  <span className="bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-9 bg-gray-200 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : practitioners.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#6B7280] text-lg mb-4">No practitioners found with these filters.</p>
                <button onClick={handleClear} className="text-primary-500 hover:text-primary-600 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {practitioners.map((p: any) => (
                  <PractitionerCard key={p.slug} practitioner={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
