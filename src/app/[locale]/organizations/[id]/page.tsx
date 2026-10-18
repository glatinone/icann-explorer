import type { ReactElement } from "react";
import { entities, relationships, entityById } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams(): Array<{ locale: string; id: string }> {
  const locales = ["id", "en"];
  return entities.flatMap((e) => locales.map((locale) => ({ locale, id: e.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale: loc, id } = await params;
  const locale = loc === "en" ? "en" : "id";
  const entity = entities.find((e) => e.id === id);
  if (!entity) return { title: "Not found | ICANN Explorer" };
  return {
    title: `${entity.acronym}: ${entity.name.en} | ICANN Explorer`,
    description: entity.oneLiner.text.en,
    alternates: {
      canonical: `/${locale}/organizations/${id}/`,
      languages: { id: `/id/organizations/${id}/`, en: `/en/organizations/${id}/` },
    },
  };
}

export default async function OrganizationProfile({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<ReactElement> {
  const { locale: loc, id } = await params;
  const locale: "id" | "en" = loc === "en" ? "en" : "id";
  const entity = entityById(id);
  if (!entity) notFound();

  const rels = relationships.filter((r) => r.from === id || r.to === id);

  return (
    <article className="page profile">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <a href={`/${locale}/organizations/`}>{locale === "id" ? "Organisasi" : "Organizations"}</a>
      </nav>
      <h1>
        {entity.acronym} - {entity.name[locale]}
      </h1>
      {entity.scope === "external" && (
        <p className="profile-external-tag">{locale === "id" ? "Di luar ICANN" : "Outside ICANN"}</p>
      )}

      <p className="panel-oneliner">{entity.oneLiner.text[locale]}</p>

      <section aria-labelledby="sec-why">
        <h2 id="sec-why">{locale === "id" ? "Kenapa ada" : "Why it exists"}</h2>
        <ul>
          {entity.whyItExists.map((c, i) => (
            <ClaimLine
              key={i}
              text={c.text[locale]}
              sourceId={c.citations[0]?.sourceId}
              verifiedAt={c.citations[0]?.verifiedAt}
              locale={locale}
            />
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-what">
        <h2>{locale === "id" ? "Apa yang dilakukan" : "What it does"}</h2>
        <ul>
          {entity.whatItDoes.map((c, i) => (
            <ClaimLine key={i} text={c.text[locale]} sourceId={c.citations[0]?.sourceId} verifiedAt={c.citations[0]?.verifiedAt} locale={locale} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-example">
        <h2>{locale === "id" ? "Contoh" : "Example"}</h2>
        <p>{entity.example.text[locale]}</p>
      </section>

      {entity.getInvolved && entity.getInvolved.length > 0 && (
        <section aria-labelledby="sec-involve">
          <h2>{locale === "id" ? "Cara ikut" : "How to get involved"}</h2>
          <ul>
            {entity.getInvolved.map((c, i) => (
              <ClaimLine key={i} text={c.text[locale]} sourceId={c.citations[0]?.sourceId} verifiedAt={c.citations[0]?.verifiedAt} locale={locale} />
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="sec-connects">
        <h2>{locale === "id" ? "Cara terhubung" : "How it connects"}</h2>
        <ul>
          {rels.map((r) => {
            const other = r.from === id ? r.to : r.from;
            const otherEntity = entities.find((e) => e.id === other);
            return (
              <li key={r.id}>
                <a href={`/${locale}/organizations/${other}/`}>{otherEntity?.acronym ?? other}</a>: {r.label[locale]}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="sec-terms">
        <h2>{locale === "id" ? "Istilah terkait" : "Related terms"}</h2>
        <ul className="chip-row">
          {entity.relatedTermIds.map((tid) => (
            <li key={tid}>
              <a href={`/${locale}/glossary/#term-${tid}`}>{tid}</a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-official">
        <h2>{locale === "id" ? "Tautan resmi" : "Official links"}</h2>
        <p>
          <a href={entity.officialUrl} rel="noopener noreferrer" target="_blank">
            {entity.officialUrl}
          </a>
        </p>
        <p className="last-reviewed">
          {locale === "id" ? "Tinjauan terakhir" : "Last reviewed"}: {entity.lastReviewed}
        </p>
        <p>
          <a
            href={`https://github.com/glatinone/icann-explorer/issues/new?template=content-error.yml&title=${encodeURIComponent(`[Content error] /${locale}/organizations/${id}/`)}`}
          >
            {locale === "id" ? "Laporkan kesalahan di halaman ini" : "Report an error on this page"}
          </a>
        </p>
      </section>
    </article>
  );
}

function ClaimLine({
  text,
  sourceId,
  verifiedAt,
  locale,
}: {
  text: string;
  sourceId?: string;
  verifiedAt?: string;
  locale: "id" | "en";
}): ReactElement {
  return (
    <li>
      {text}
      {sourceId && (
        <sup>
          <a href={`/${locale}/about/#source-${sourceId}`} title={`${sourceId} (${verifiedAt ?? ""})`}>
            [{sourceId.slice(0, 12)}]
          </a>
        </sup>
      )}
    </li>
  );
}
