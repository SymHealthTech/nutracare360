import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Providers } from "./providers";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Canada's Holistic Health Practitioner Directory`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["holistic health", "alternative medicine", "acupuncture", "naturopath", "ayurveda", "Canada"],
  authors: [{ name: "NutraCare360" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://nutracare360.ca",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Canada's Holistic Health Practitioner Directory`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Canada's Holistic Health Practitioner Directory`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAFAF8] text-[#1A1A2E]">
        <Providers>
          <Navbar />
          <DemoBanner />
          <main>{children}</main>
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
