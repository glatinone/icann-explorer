import type { Metadata } from "next";
import { t, locales, isLocale, type Locale } from "@/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "../../globals.css";

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale: Locale = isLocale(loc) ? loc : "id";
  const title = locale === "id" ? "ICANN Explorer: pahami ekosistem ICANN" : "ICANN Explorer: understand the ICANN ecosystem";
  const description =
    locale === "id"
      ? "Peta interaktif ekosistem ICANN untuk pemula: siapa melakukan apa, bagaimana kelompok saling terhubung, dan cara mulai berkontribusi. Proyek edukasi independen dan tidak resmi."
      : "An interactive map of the ICANN ecosystem for newcomers: who does what, how groups connect, and where to start contributing.";
  return { title, description, alternates: { canonical: `/${locale}/`, languages: { id: "/id/", en: "/en/" } } };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<React.ReactElement> {
  const { locale: loc } = await params;
  const locale: Locale = isLocale(loc) ? loc : "id";
  return (
    <html lang={locale}>
      <body>
        <a href="#main-content" className="skip-link">
          {t(locale, "site.skipToContent")}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
