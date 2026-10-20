import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { termsSorted } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { t, toLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(locale, "/glossary/", { title: t(locale, "glossary.title"), description: t(locale, "glossary.lede") });
}

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  const letters = new Map<string, typeof termsSorted>();
  for (const term of termsSorted) {
    const letter = term.term.en.charAt(0).toUpperCase();
    letters.set(letter, [...(letters.get(letter) ?? []), term]);
  }

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t(locale, "glossary.title")}</h1>
        <p className="lede">{t(locale, "glossary.lede")}</p>
      </header>
      <nav className="letter-index" aria-label="A–Z">
        {[...letters.keys()].map((l) => (
          <a key={l} href={`#letter-${l}`}>
            {l}
          </a>
        ))}
      </nav>
      {[...letters.entries()].map(([letter, list]) => (
        <section key={letter} className="glossary-letter" aria-labelledby={`letter-${letter}`}>
          <h2 id={`letter-${letter}`}>{letter}</h2>
          <dl className="glossary-list">
            {list.map((term) => (
              <div key={term.id} className="glossary-item">
                <dt>
                  <Link href={`/${locale}/glossary/${term.id}/`}>{term.term[locale]}</Link>
                  {term.acronym && term.acronym !== term.term[locale] && <abbr>{term.acronym}</abbr>}
                </dt>
                <dd>{term.definition.text[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
