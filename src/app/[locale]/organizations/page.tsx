import type { ReactElement } from "react";
import { entities } from "@/lib/content";
import type { Locale } from "@/i18n";

const GROUPS: Array<{ kinds: string[]; id: string; en: string }> = [
  { kinds: ["supporting-organization"], id: "Supporting Organizations", en: "Supporting Organizations" },
  { kinds: ["advisory-committee"], id: "Komite Penasihat", en: "Advisory Committees" },
  { kinds: ["board", "icann-org"], id: "Dewan & organisasi", en: "Board & org" },
  { kinds: ["committee", "mechanism", "stakeholder-group", "regional-organization"], id: "Komite & mekanisme", en: "Committees & mechanisms" },
  { kinds: ["affiliate"], id: "Afiliasi ICANN", en: "ICANN affiliate" },
  { kinds: ["external"], id: "Di luar ICANN", en: "Outside ICANN" },
];

export default async function OrganizationsPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale: Locale = loc === "en" ? "en" : "id";
  return (
    <div className="page">
      <h1>{locale === "id" ? "Organisasi" : "Organizations"}</h1>
      {GROUPS.map((group) => {
        const items = entities.filter((e) => group.kinds.includes(e.kind));
        if (items.length === 0) return null;
        return (
          <section key={group.en} aria-labelledby={`org-group-${group.en.replace(/\W+/g, "-")}`}>
            <h2 id={`org-group-${group.en.replace(/\W+/g, "-")}`}>{locale === "id" ? group.id : group.en}</h2>
            <div className="card-grid">
              {items.map((e) => (
                <article className="card" key={e.id}>
                  <h3>
                    <a href={`/${locale}/organizations/${e.id}/`}>{e.acronym}</a>
                  </h3>
                  <p>{e.name[locale]}</p>
                  <p className="card-oneliner">{e.oneLiner.text[locale]}</p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
