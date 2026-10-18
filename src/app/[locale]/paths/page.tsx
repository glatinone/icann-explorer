import type { ReactElement } from "react";
import { paths } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = loc === "en" ? "en" : "id";
  return {
    title: locale === "id" ? "Jalur pembelajaran | ICANN Explorer" : "Learning paths | ICANN Explorer",
    alternates: { canonical: `/${locale}/paths/`, languages: { id: "/id/paths/", en: "/en/paths/" } },
  };
}

const ORDER = ["beginner", "get-involved", "policy", "technical"] as const;

export default async function PathsPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale: "id" | "en" = loc === "en" ? "en" : "id";
  const ordered = [...paths].sort((a, b) => {
    const ia = ORDER.indexOf(a.id as (typeof ORDER)[number]);
    const ib = ORDER.indexOf(b.id as (typeof ORDER)[number]);
    return ia - ib;
  });

  return (
    <div className="page">
      <h1>{locale === "id" ? "Jalur pembelajaran" : "Learning paths"}</h1>
      <div className="card-grid">
        {ordered.map((p) => (
          <article className="card" key={p.id}>
            <h2>
              <a href={`/${locale}/paths/${p.id}/`}>{p.title[locale]}</a>
            </h2>
            <p>{p.audience[locale]}</p>
            <p className="path-meta">
              {p.steps.length} {locale === "id" ? "langkah" : "steps"}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
