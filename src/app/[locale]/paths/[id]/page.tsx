import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ClaimText } from "@/components/Claim";
import { NotesList } from "@/components/NotesList";
import { SelfCheck } from "@/components/SelfCheck";
import { getEntity, getPath, getSource, getTerm, paths } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Notes } from "@/lib/notes";
import type { LearningPathLink } from "@/lib/schema";
import { locales, t, toLocale, type Locale } from "@/i18n";

type Params = Promise<{ locale: string; id: string }>;

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  return paths.flatMap((p) => locales.map((locale) => ({ locale, id: p.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const path = getPath(id);
  if (!path) return {};
  return pageMetadata(locale, `/paths/${id}/`, { title: path.title[locale], description: path.summary[locale] });
}

function StepLink({ link, locale }: { link: LearningPathLink; locale: Locale }): ReactElement | null {
  if (link.type === "entity") {
    const e = getEntity(link.id);
    return e ? (
      <Link href={`/${locale}/organizations/${e.id}/`}>
        <b>{e.acronym}</b> {e.acronym !== e.name[locale] && e.name[locale]}
      </Link>
    ) : null;
  }
  if (link.type === "term") {
    const term = getTerm(link.id);
    return term ? <Link href={`/${locale}/glossary/${term.id}/`}>{term.term[locale]}</Link> : null;
  }
  const source = getSource(link.id);
  return source ? (
    <a href={source.url} rel="noopener noreferrer" target="_blank">
      {source.title} <span className="ext">↗</span>
    </a>
  ) : null;
}

export default async function PathPage({ params }: { params: Params }): Promise<ReactElement> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const path = getPath(id);
  if (!path) notFound();

  const notes = new Notes();
  path.steps.forEach((s) => s.claims?.forEach((c) => notes.cite(c)));
  const others = paths.filter((p) => p.id !== path.id);

  return (
    <article className="page path-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={`/${locale}/paths/`}>{t(locale, "paths.all")}</Link>
      </nav>
      <header className="page-head">
        <p className="eyebrow">
          {path.audience[locale]} · {t(locale, "minutes", { n: path.estMinutes })}
        </p>
        <h1>{path.title[locale]}</h1>
        <p className="lede">{path.summary[locale]}</p>
      </header>

      <div className="path-layout">
        <nav className="path-toc" aria-labelledby="toc-title">
          <h2 id="toc-title" className="group-label">
            {t(locale, "paths.contents")}
          </h2>
          <ol>
            {path.steps.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.title[locale]}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="path-steps">
          {path.steps.map((step, i) => (
            <section key={step.id} id={step.id} className="path-step" aria-labelledby={`${step.id}-title`}>
              <h2 id={`${step.id}-title`}>
                <span className="step-number">{i + 1}</span>
                {step.title[locale]}
              </h2>
              {step.body[locale].split(/\n\s*\n/).map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              {step.claims && step.claims.length > 0 && (
                <ul className="claim-list">
                  {step.claims.map((c, j) => (
                    <li key={j}>
                      <ClaimText claim={c} notes={notes} locale={locale} />
                    </li>
                  ))}
                </ul>
              )}
              {step.links.length > 0 && (
                <div className="step-links">
                  <h3 className="group-label">{t(locale, "paths.see")}</h3>
                  <ul>
                    {step.links.map((link) => (
                      <li key={`${link.type}-${link.id}`}>
                        <StepLink link={link} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step.check && (
                <SelfCheck
                  title={t(locale, "paths.check")}
                  question={step.check.question[locale]}
                  options={step.check.options.map((o) => o[locale])}
                  answerIndex={step.check.answerIndex}
                  explanation={step.check.explanation[locale]}
                  correct={t(locale, "paths.correct")}
                  incorrect={t(locale, "paths.incorrect")}
                />
              )}
            </section>
          ))}

          <footer className="path-end">
            <p>{t(locale, "paths.done")}</p>
            <ul>
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`/${locale}/paths/${p.id}/`}>{p.title[locale]}</Link>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </div>

      <NotesList notes={notes} locale={locale} />
    </article>
  );
}
