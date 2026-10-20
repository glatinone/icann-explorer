import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { entitiesByKind } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { t, toLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(locale, "/organizations/", { title: t(locale, "orgs.title"), description: t(locale, "orgs.lede") });
}

export default async function OrganizationsPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  return (
    <div className="page">
      <header className="page-head">
        <h1>{t(locale, "orgs.title")}</h1>
        <p className="lede">{t(locale, "orgs.lede")}</p>
      </header>
      {entitiesByKind().map(({ kind, entities }) => (
        <section key={kind} className="org-group" aria-labelledby={`g-${kind}`}>
          <h2 id={`g-${kind}`} className="group-label">
            {t(locale, `group.${kind}`)}
          </h2>
          <ul className="org-list">
            {entities.map((e) => (
              <li key={e.id}>
                <Link href={`/${locale}/organizations/${e.id}/`} className={`org-card kind-${e.kind}`}>
                  <span className="org-acronym">{e.acronym}</span>
                  <span className="org-name">{e.name[locale]}</span>
                  <span className="org-oneliner">{e.oneLiner.text[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
