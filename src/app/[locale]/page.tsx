import Link from "next/link";
import type { ReactElement } from "react";
import { EntityChip } from "@/components/EntityChip";
import { entities, entitiesByKind, getEntity, paths } from "@/lib/content";
import { t, toLocale } from "@/i18n";

const COMMUNITY = ["gnso", "ccnso", "aso", "alac", "gac", "ssac", "rssac"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  const community = COMMUNITY.map(getEntity).filter((e) => e !== undefined);
  const board = getEntity("icann-board");
  const org = getEntity("icann-org");

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">{t(locale, "site.unofficial")}</p>
        <h1>{t(locale, "home.title")}</h1>
        <p className="lede">{t(locale, "home.lede")}</p>
        <div className="actions">
          <Link className="button button-primary" href={`/${locale}/map/`}>
            {t(locale, "home.ctaMap")}
          </Link>
          <Link className="button" href={`/${locale}/paths/${paths[0]?.id ?? ""}/`}>
            {t(locale, "home.ctaStart")}
          </Link>
        </div>
      </section>

      <section className="parts" aria-labelledby="parts-title">
        <div className="section-head">
          <h2 id="parts-title">{t(locale, "home.partsTitle")}</h2>
          <p>{t(locale, "home.partsLede")}</p>
        </div>
        <ol className="parts-flow">
          <li className="part part-community">
            <h3>{t(locale, "home.part.community")}</h3>
            <p>{t(locale, "home.part.communityText")}</p>
            <ul className="chip-list">
              {community.map((e) => (
                <li key={e.id}>
                  <EntityChip entity={e} locale={locale} />
                </li>
              ))}
            </ul>
          </li>
          <li className="part-arrow" aria-hidden="true">
            <span>{t(locale, "home.flow.proposes")}</span>
          </li>
          <li className="part part-board">
            <h3>{t(locale, "home.part.board")}</h3>
            <p>{t(locale, "home.part.boardText")}</p>
            {board && (
              <ul className="chip-list">
                <li>
                  <EntityChip entity={board} locale={locale} />
                </li>
              </ul>
            )}
          </li>
          <li className="part-arrow" aria-hidden="true">
            <span>{t(locale, "home.flow.implements")}</span>
          </li>
          <li className="part part-org">
            <h3>{t(locale, "home.part.org")}</h3>
            <p>{t(locale, "home.part.orgText")}</p>
            {org && (
              <ul className="chip-list">
                <li>
                  <EntityChip entity={org} locale={locale} />
                </li>
              </ul>
            )}
          </li>
        </ol>
      </section>

      <section aria-labelledby="paths-title">
        <div className="section-head">
          <h2 id="paths-title">{t(locale, "home.pathsTitle")}</h2>
        </div>
        <ul className="path-list">
          {paths.map((p, i) => (
            <li key={p.id}>
              <Link href={`/${locale}/paths/${p.id}/`} className="path-row">
                <span className="path-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="path-text">
                  <span className="path-title">{p.title[locale]}</span>
                  <span className="path-audience">{p.audience[locale]}</span>
                </span>
                <span className="path-meta">{t(locale, "minutes", { n: p.estMinutes })}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="groups-title">
        <div className="section-head">
          <h2 id="groups-title">{t(locale, "home.groupsTitle")}</h2>
          <Link href={`/${locale}/organizations/`}>
            {t(locale, "home.groupsAll")} ({entities.length})
          </Link>
        </div>
        <div className="group-columns">
          {entitiesByKind().map(({ kind, entities: list }) => (
            <div key={kind} className="group-block">
              <h3 className="group-label">{t(locale, `group.${kind}`)}</h3>
              <ul>
                {list.map((e) => (
                  <li key={e.id}>
                    <Link href={`/${locale}/organizations/${e.id}/`}>
                      <b>{e.acronym}</b> <span>{e.name[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
