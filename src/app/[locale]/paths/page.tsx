import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { paths } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { t, toLocale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(locale, "/paths/", { title: t(locale, "paths.title"), description: t(locale, "paths.lede") });
}

export default async function PathsPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  return (
    <div className="page">
      <header className="page-head">
        <h1>{t(locale, "paths.title")}</h1>
        <p className="lede">{t(locale, "paths.lede")}</p>
      </header>
      <ul className="path-cards">
        {paths.map((p, i) => (
          <li key={p.id}>
            <Link href={`/${locale}/paths/${p.id}/`} className="path-card">
              <span className="path-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="path-title">{p.title[locale]}</span>
              <span className="path-audience">{p.audience[locale]}</span>
              <span className="path-summary">{p.summary[locale]}</span>
              <span className="path-meta">
                {t(locale, "steps", { n: p.steps.length })} · {t(locale, "minutes", { n: p.estMinutes })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
