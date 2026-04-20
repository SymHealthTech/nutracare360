"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Leaf } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About Us" },
  { href: "/blogs", label: "Blog" },
  { href: "/success-stories", label: "Success Stories" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white/90 backdrop-blur-sm"
      }`}
       
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
                   src="/images/nutracare360_navbar.png"
                   alt="NutraCare360"
                   width={180}
                   height={50}
                   priority
                   className="h-10 w-auto md:h-12 lg:h-14"
             />
           
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  pathname === link.href ? "text-primary-500" : "text-[#1A1A2E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/search" className="text-[#1A1A2E] hover:text-primary-500 transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/join-us"
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Join Us — Free
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[#1A1A2E]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-4 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-[#1A1A2E] hover:text-primary-500 py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="block text-sm font-medium text-[#1A1A2E] hover:text-primary-500 py-2">
            Search Practitioners
          </Link>
          <Link
            href="/join-us"
            className="block bg-secondary-500 text-white text-center px-4 py-2.5 rounded-lg text-sm font-semibold"
          >
            Join Us — Free Listing
          </Link>
        </div>
      )}
    </header>
  );
}
