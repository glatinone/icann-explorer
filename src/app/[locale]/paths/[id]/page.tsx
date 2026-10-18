import { paths } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PathClient from "./PathClient";

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  const locales = ["id", "en"];
  const ids = ["beginner", "get-involved", "policy", "technical"];
  return ids.flatMap((id) => locales.map((locale) => ({ locale, id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale: loc, id } = await params;
  const locale = loc === "en" ? "en" : "id";
  const p = paths.find((x) => x.id === id);
  if (!p) return { title: "Not found | ICANN Explorer" };
  return {
    title: `${p.title.en} | ICANN Explorer`,
    description: p.audience.en,
    alternates: {
      canonical: `/${locale}/paths/${id}/`,
      languages: { id: `/id/paths/${id}/`, en: `/en/paths/${id}/` },
    },
  };
}

export default async function PathPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: loc, id } = await params;
  const locale: "id" | "en" = loc === "en" ? "en" : "id";
  const p = paths.find((x) => x.id === id);
  if (!p) notFound();
  return (
    <div className="page">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <a href={`/${locale}/paths/`}>{locale === "id" ? "Jalur pembelajaran" : "Learning paths"}</a>
      </nav>
      <h1>{p.title[locale]}</h1>
      <p>{p.audience[locale]}</p>
      <PathClient locale={locale} path={p} />
    </div>
  );
}
