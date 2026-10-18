import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale = (loc === "en" ? "en" : "id") as Locale;
  return (
    <div className="page">
      <section className="hero" aria-labelledby="home-title">
        <h1 id="home-title">{t(locale, "home.title")}</h1>
        <p>{t(locale, "home.subtitle")}</p>
        <div className="hero-ctas">
          <a className="button button-primary" href={`/${locale}/map/`}>
            {t(locale, "home.cta.map")}
          </a>
          <a className="button button-secondary" href={`/${locale}/paths/beginner/`}>
            {t(locale, "home.cta.beginner")}
          </a>
        </div>
      </section>
      <section aria-labelledby="three-parts-heading">
        <h2 id="three-parts-heading">{t(locale, "home.threeParts.title")}</h2>
        <p>{t(locale, "home.threeParts.subtitle")}</p>
        <div className="card-grid">
          <article className="card">
            <h3>{t(locale, "home.threeParts.community")}</h3>
            <p>{t(locale, "home.threeParts.communityDesc")}</p>
          </article>
          <article className="card">
            <h3>{t(locale, "home.threeParts.board")}</h3>
            <p>{t(locale, "home.threeParts.boardDesc")}</p>
          </article>
          <article className="card">
            <h3>{t(locale, "home.threeParts.org")}</h3>
            <p>{t(locale, "home.threeParts.orgDesc")}</p>
          </article>
        </div>
      </section>
      <section aria-labelledby="where-start-heading">
        <h2 id="where-start-heading">{t(locale, "home.whereToStart")}</h2>
        <div className="card-grid">
          <article className="card">
            <h3>{t(locale, "home.start.curious")}</h3>
            <p>{t(locale, "home.start.curious.desc")}</p>
            <a href={`/${locale}/paths/beginner/`}>{t(locale, "home.cta.beginner")}</a>
          </article>
          <article className="card">
            <h3>{t(locale, "home.start.attending")}</h3>
            <p>{t(locale, "home.start.attending.desc")}</p>
            <a href={`/${locale}/paths/`}>{t(locale, "paths.title")}</a>
          </article>
          <article className="card">
            <h3>{t(locale, "home.start.contributor")}</h3>
            <p>{t(locale, "home.start.contributor.desc")}</p>
            <a href={`/${locale}/paths/get-involved/`}>{t(locale, "home.start.contributor")}</a>
          </article>
        </div>
      </section>
      <section aria-labelledby="popular-heading">
        <h2 id="popular-heading">{t(locale, "home.popularGroups")}</h2>
        <ul className="chip-row">
          {["gnso", "alac", "gac", "ssac"].map((id) => (
            <li key={id}>
              <a href={`/${locale}/organizations/${id}/`}>{id.toUpperCase()}</a>
            </li>
          ))}
        </ul>
        <p>{t(locale, "footer.disclaimer")}</p>
      </section>
    </div>
  );
}
