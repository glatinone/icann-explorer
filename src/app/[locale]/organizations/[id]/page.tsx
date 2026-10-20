import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { ClaimText } from "@/components/Claim";
import { NotesList } from "@/components/NotesList";
import { entities, getEntity, getTerm, relationshipsOf } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Notes } from "@/lib/notes";
import { FAMILIES, RELATIONSHIPS } from "@/lib/relationships";
import { locales, t, toLocale } from "@/i18n";
import { reportUrl } from "@/i18n/config";

type Params = Promise<{ locale: string; id: string }>;

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  return entities.flatMap((e) => locales.map((locale) => ({ locale, id: e.id })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const entity = getEntity(id);
  if (!entity) return {};
  return pageMetadata(locale, `/organizations/${id}/`, {
    title: `${entity.acronym}: ${entity.name[locale]}`,
    description: entity.oneLiner.text[locale],
  });
}

export default async function OrganizationPage({ params }: { params: Params }): Promise<ReactElement> {
  const { locale: raw, id } = await params;
  const locale = toLocale(raw);
  const entity = getEntity(id);
  if (!entity) notFound();

  const notes = new Notes();
  const rels = relationshipsOf(id);
  const connections = FAMILIES.map((family) => ({
    family,
    items: rels
      .filter((r) => RELATIONSHIPS[r.type].family === family)
      .map((r) => {
        const outgoing = r.from === id;
        const other = getEntity(outgoing ? r.to : r.from);
        const info = RELATIONSHIPS[r.type];
        return { r, other, phrase: (outgoing ? info.label : info.inverse)[locale] };
      })
      .filter((c) => c.other),
  })).filter((g) => g.items.length > 0);
  const relatedTerms = entity.relatedTermIds.map(getTerm).filter((x) => x !== undefined);

  // Number the footnotes in reading order before rendering.
  [
    entity.oneLiner,
    entity.whyItExists,
    ...entity.whatItDoes,
    entity.whoIsIn,
    entity.example,
    ...(entity.getInvolved ?? []),
    ...connections.flatMap((g) => g.items.map((c) => c.r.explanation)),
  ].forEach((c) => notes.cite(c));

  return (
    <article className={`page profile kind-${entity.kind}`}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={`/${locale}/organizations/`}>{t(locale, "profile.all")}</Link>
      </nav>

      <header className="profile-head">
        <p className="profile-kind">{t(locale, `kind.${entity.kind}`)}</p>
        <h1>
          <span className="profile-acronym">{entity.acronym}</span>
          {entity.acronym !== entity.name[locale] && <span className="profile-name">{entity.name[locale]}</span>}
        </h1>
        <p className="lede">
          <ClaimText claim={entity.oneLiner} notes={notes} locale={locale} />
        </p>
      </header>

      <div className="profile-body">
        <div className="profile-main">
          <section aria-labelledby="why">
            <h2 id="why">{t(locale, "profile.why")}</h2>
            <p>
              <ClaimText claim={entity.whyItExists} notes={notes} locale={locale} />
            </p>
          </section>

          <section aria-labelledby="what">
            <h2 id="what">{t(locale, "profile.what")}</h2>
            <ul className="claim-list">
              {entity.whatItDoes.map((c, i) => (
                <li key={i}>
                  <ClaimText claim={c} notes={notes} locale={locale} />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="who">
            <h2 id="who">{t(locale, "profile.who")}</h2>
            <p>
              <ClaimText claim={entity.whoIsIn} notes={notes} locale={locale} />
            </p>
          </section>

          <section aria-labelledby="example" className="example">
            <h2 id="example">{t(locale, "profile.example")}</h2>
            <p>
              <ClaimText claim={entity.example} notes={notes} locale={locale} />
            </p>
          </section>

          {entity.getInvolved && entity.getInvolved.length > 0 && (
            <section aria-labelledby="involve">
              <h2 id="involve">{t(locale, "profile.involve")}</h2>
              <ul className="claim-list">
                {entity.getInvolved.map((c, i) => (
                  <li key={i}>
                    <ClaimText claim={c} notes={notes} locale={locale} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {connections.length > 0 && (
            <section aria-labelledby="connections">
              <h2 id="connections">{t(locale, "profile.connections")}</h2>
              {connections.map(({ family, items }) => (
                <div key={family} className={`connection-group family-${family}`}>
                  <h3>
                    <span className="family-swatch" aria-hidden="true" />
                    {t(locale, `family.${family}`)}
                  </h3>
                  <ul>
                    {items.map(({ r, other, phrase }) => (
                      <li key={r.id}>
                        <p className="connection-line">
                          {phrase}{" "}
                          <Link href={`/${locale}/organizations/${other!.id}/`}>
                            <b>{other!.acronym}</b>
                          </Link>
                        </p>
                        <p className="connection-explanation">
                          <ClaimText claim={r.explanation} notes={notes} locale={locale} />
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside className="profile-aside">
          <dl>
            <dt>{t(locale, "profile.official")}</dt>
            <dd>
              <a href={entity.officialUrl} rel="noopener noreferrer" target="_blank">
                {entity.officialUrl.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            </dd>
            <dd>
              <Link href={`/${locale}/map/?node=${entity.id}`}>{t(locale, "profile.viewOnMap")} →</Link>
            </dd>
            {relatedTerms.length > 0 && (
              <>
                <dt>{t(locale, "profile.terms")}</dt>
                <dd>
                  <ul className="term-links">
                    {relatedTerms.map((term) => (
                      <li key={term.id}>
                        <Link href={`/${locale}/glossary/${term.id}/`}>{term.acronym ?? term.term[locale]}</Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </aside>
      </div>

      <NotesList notes={notes} locale={locale} />

      <p className="report-link">
        <a href={reportUrl(`/${locale}/organizations/${id}/`)}>{t(locale, "profile.report")}</a>
      </p>
    </article>
  );
}
