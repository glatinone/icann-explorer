import type { ReactElement } from "react";
import { sources } from "@/lib/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: loc } = await params;
  const locale = loc === "en" ? "en" : "id";
  return {
    title: locale === "id" ? "Tentang & Sumber | ICANN Explorer" : "About & Sources | ICANN Explorer",
    alternates: { canonical: `/${locale}/about/`, languages: { id: "/id/about/", en: "/en/about/" } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale: "id" | "en" = loc === "en" ? "en" : "id";
  const t = (en: string, idn: string) => (locale === "id" ? idn : en);

  return (
    <div className="page">
      <h1>{locale === "id" ? "Tentang & Sumber" : "About & Sources"}</h1>

      <section aria-labelledby="about-what">
        <h2 id="about-what">{locale === "id" ? "Apa ini" : "What this is"}</h2>
        <p>
          {t(
            "ICANN Explorer is an interactive, bilingual guide to the ICANN ecosystem for newcomers. It is independent and unofficial: it is not affiliated with or endorsed by ICANN.",
            "ICANN Explorer adalah panduan interaktif untuk memahami ekosistem ICANN. Proyek ini independen dan tidak resmi.",
          )}
        </p>
        <p>
          {/* TODO(Kiell): write your own 2-3 sentence "why this project exists" story here (ICANN87 Fellow perspective). */}
          {t(
            "TODO(Kiell): tell your ICANN87 Fellow story here, in your own words.",
            "TODO(Kiell): tulis cerita pribadimu soal kenapa proyek ini ada.",
          )}
        </p>
      </section>

      <section aria-labelledby="about-method">
        <h2>{locale === "id" ? "Metodologi" : "Methodology"}</h2>
        <p>
          {t(
            "Every factual claim on this site has its own citation with the date it was verified. Facts need a Tier 1-3 source: ICANN's own governing documents first, then ICANN body pages, then other established organizations. Interpretations are marked as such. When sources disagree, the higher-trust source wins and the conflict is recorded.",
            "Setiap klaim penting punya sitasi sendiri dengan tanggal verifikasi. Fakta butuh sumber Tier 1-3. Interpretasi ditandai berbeda dari fakta.",
          )}
        </p>
        <p>
          {t(
            "The map is modeled by relationship type, not as a single hierarchy. Advisory relationships never look like reporting lines.",
            "Peta dimodelkan per jenis relasi, bukan satu hierarki.",
          )}
        </p>
      </section>

      <section aria-labelledby="about-sources">
        <h2>{locale === "id" ? "Sumber" : "Sources"}</h2>
        <ul className="sources-list">
          {sources.map((s) => (
            <li key={s.id} id={`source-${s.id}`}>
              <a href={s.url} rel="noopener noreferrer" target="_blank">
                {s.title}
              </a>{" "}
              - {s.publisher} (Tier {s.tier}, {t("checked", "diperiksa")} {s.accessed})
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="about-errors">
        <h2>{locale === "id" ? "Melaporkan kesalahan" : "Reporting errors"}</h2>
        <p>
          {t(
            "Found a mistake? Open an issue on GitHub or use the Report an error link in the footer.",
            "Menemukan kesalahan? Buka issue di GitHub atau pakai tautan Laporkan kesalahan di footer.",
          )}
        </p>
      </section>
    </div>
  );
}
