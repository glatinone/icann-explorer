import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ClaimText } from "@/components/Claim";
import { EntityChip } from "@/components/EntityChip";
import { NotesList } from "@/components/NotesList";
import { getEntity, getTerm, terms } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Notes } from "@/lib/notes";
import { locales, t, toLocale } from "@/i18n";
import { reportUrl } from "@/i18n/config";

type Params = Promise<{ locale: string; id: string }>;

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  return terms.flatMap((term) => locales.map((locale) => ({ locale, id: term.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const term = getTerm(id);
  if (!term) return {};
  return pageMetadata(locale, `/glossary/${id}/`, { title: term.term[locale], description: term.definition.text[locale] });
}

export default async function TermPage({ params }: { params: Params }): Promise<ReactElement> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const term = getTerm(id);
  if (!term) notFound();

  const notes = new Notes();
  notes.cite(term.definition);
  const relatedEntities = term.relatedEntityIds.map(getEntity).filter((e) => e !== undefined);
  const relatedTerms = term.relatedTermIds.map(getTerm).filter((x) => x !== undefined);

  return (
    <article className="page term-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={`/${locale}/glossary/`}>{t(locale, "glossary.all")}</Link>
      </nav>
      <header className="page-head">
        <h1>
          {term.term[locale]}
          {term.acronym && term.acronym !== term.term[locale] && <abbr className="term-acronym">{term.acronym}</abbr>}
        </h1>
        <p className="lede">
          <ClaimText claim={term.definition} notes={notes} locale={locale} />
        </p>
      </header>

      {relatedEntities.length > 0 && (
        <section aria-labelledby="rel-entities">
          <h2 id="rel-entities">{t(locale, "glossary.entities")}</h2>
          <ul className="chip-list">
            {relatedEntities.map((e) => (
              <li key={e.id}>
                <EntityChip entity={e} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedTerms.length > 0 && (
        <section aria-labelledby="rel-terms">
          <h2 id="rel-terms">{t(locale, "glossary.terms")}</h2>
          <ul className="term-links">
            {relatedTerms.map((r) => (
              <li key={r.id}>
                <Link href={`/${locale}/glossary/${r.id}/`}>{r.term[locale]}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <NotesList notes={notes} locale={locale} />
      <p className="report-link">
        <a href={reportUrl(`/${locale}/glossary/${id}/`)}>{t(locale, "profile.report")}</a>
      </p>
    </article>
  );
}
