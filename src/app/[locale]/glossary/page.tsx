import type { ReactElement } from "react";
import { terms, entities } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = loc === "en" ? "en" : "id";
  return {
    title: locale === "id" ? "Glosarium | ICANN Explorer" : "Glossary | ICANN Explorer",
    alternates: { canonical: `/${locale}/glossary/`, languages: { id: "/id/glossary/", en: "/en/glossary/" } },
  };
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale: "id" | "en" = loc === "en" ? "en" : "id";
  const sorted = [...terms].sort((a, b) => a.term.localeCompare(b.term));
  const t = (en: string, idn: string) => (locale === "id" ? idn : en);

  return (
    <div className="page">
      <h1>{locale === "id" ? "Glosarium" : "Glossary"}</h1>
      <dl className="glossary-list">
        {sorted.map((term) => (
          <div key={term.id} id={`term-${term.id}`} className="glossary-entry">
            <dt>
              <strong>{term.term}</strong>
            </dt>
            <dd>
              {term.definition.text[locale]}
              {term.relatedEntityIds.length > 0 && (
                <div className="glossary-related">
                  {t("Related groups: ", "Kelompok terkait: ")}
                  {term.relatedEntityIds.map((eid) => {
                    const ent = entities.find((e) => e.id === eid);
                    if (!ent) return null;
                    return (
                      <a key={eid} href={`/${locale}/organizations/${eid}/`}>
                        {ent.acronym}
                      </a>
                    );
                  })}
                </div>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
