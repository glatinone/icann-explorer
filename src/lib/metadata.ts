import type { Metadata } from "next";
import { siteName, type Locale } from "@/i18n/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

/**
 * Metadata for one page in one locale. `path` has no locale prefix ("/organizations/gnso/").
 * A null title means the bare site name (home page).
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title: string | null; description: string },
): Metadata {
  const fullTitle = title ? `${title} · ${siteName}` : siteName;
  return {
    metadataBase: new URL(siteUrl),
    title: fullTitle,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { id: `/id${path}`, en: `/en${path}`, "x-default": `/id${path}` },
    },
    openGraph: {
      title: fullTitle,
      description,
      siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: `/og/og-${locale}.png`, width: 1200, height: 630 }],
    },
    icons: { icon: "/icon.svg" },
  };
}
