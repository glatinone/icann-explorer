import type { Metadata } from "next";
import type { ReactElement } from "react";
import { sources } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { formatDate, t, toLocale } from "@/i18n";
import { repoUrl } from "@/i18n/config";

/** Long-form page copy. Kept here rather than in the UI dictionaries because it is prose, not interface. */
const COPY = {
  lede: {
    en: "ICANN Explorer is a free, bilingual guide for people meeting ICANN for the first time. It is an independent, unofficial project: it is not affiliated with or endorsed by ICANN, and it does not speak for any ICANN body.",
    id: "ICANN Explorer adalah panduan gratis dalam dua bahasa untuk orang yang baru mengenal ICANN. Ini proyek independen dan tidak resmi: tidak berafiliasi dengan ICANN, tidak didukung oleh ICANN, dan tidak mewakili badan ICANN mana pun.",
  },
  whyTitle: { en: "Why it exists", id: "Kenapa proyek ini dibuat" },
  why: {
    en: "I came to ICANN87 as a Fellow. What slowed me down was not a lack of interest. It was the wall of acronyms (GNSO, ALAC, ccNSO, SSAC) and not knowing which group handled which topic. ICANN's own material for beginners is good, but it is spread over many pages, and none of them shows how the groups connect. I built this site so the next newcomer can see that picture in a few minutes and then go on to the official programs.",
    id: "Saya datang ke ICANN87 sebagai Fellow. Yang bikin saya lambat paham bukan kurang minat, tapi tembok akronim (GNSO, ALAC, ccNSO, SSAC) dan bingung kelompok mana yang mengurus topik apa. Materi pemula dari ICANN sendiri sebenarnya bagus, tapi tersebar di banyak halaman dan tidak ada yang memperlihatkan hubungan antarkelompoknya. Situs ini saya buat supaya pendatang berikutnya bisa melihat gambaran itu dalam beberapa menit, lalu lanjut ke program resminya.",
  },
  methodTitle: { en: "How the content is checked", id: "Cara konten diperiksa" },
  method: [
    {
      en: "Every factual sentence carries a numbered source. The source list on each page gives the document, the exact article or section, a short verbatim quote, and the date someone checked it.",
      id: "Setiap kalimat fakta punya nomor sumber. Daftar sumber di setiap halaman menyebut dokumennya, pasal atau bagian yang tepat, kutipan singkat apa adanya, dan tanggal pemeriksaannya.",
    },
    {
      en: "Sources are ranked. ICANN's Bylaws, charters and Board resolutions come first, then official ICANN pages, then the official sites of outside organizations (only for facts about themselves). Wikipedia, news and blogs are never enough on their own.",
      id: "Sumber diberi peringkat. Bylaws ICANN, piagam, dan resolusi Dewan berada di urutan pertama, lalu halaman resmi ICANN, lalu situs resmi organisasi luar (hanya untuk fakta tentang organisasi itu sendiri). Wikipedia, berita, dan blog tidak pernah cukup sebagai satu-satunya sumber.",
    },
    {
      en: "Simplified explanations are marked with a dotted underline, so you can tell our reading from what the source says.",
      id: "Penjelasan yang kami sederhanakan diberi garis bawah titik-titik, supaya kamu bisa membedakan tafsiran kami dari isi sumbernya.",
    },
    {
      en: "The map draws each kind of relationship differently. Advice is never drawn like a reporting line, and outside organizations are kept outside ICANN's box.",
      id: "Peta menggambar setiap jenis hubungan secara berbeda. Nasihat tidak pernah digambar seperti garis komando, dan organisasi luar tetap berada di luar kotak ICANN.",
    },
  ],
  errorsTitle: { en: "Found a mistake?", id: "Menemukan kesalahan?" },
  errors: {
    en: "Every page has a link that opens a pre-filled GitHub issue. Corrections need a source, and the higher-ranked source wins.",
    id: "Setiap halaman punya tautan yang membuka issue GitHub yang sudah terisi. Koreksi perlu disertai sumber, dan sumber dengan peringkat lebih tinggi yang dipakai.",
  },
  sourcesTitle: { en: "All sources", id: "Semua sumber" },
  tier: {
    en: ["", "Governing documents", "Official ICANN pages", "Outside organizations", "Secondary"],
    id: ["", "Dokumen tata kelola", "Halaman resmi ICANN", "Organisasi luar", "Sekunder"],
  },
  accessed: { en: "accessed", id: "diakses" },
  report: { en: "Open an issue on GitHub", id: "Buka issue di GitHub" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(locale, "/about/", { title: t(locale, "about.title"), description: COPY.lede[locale] });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  const byTier = [1, 2, 3, 4]
    .map((tier) => ({ tier, list: sources.filter((s) => s.tier === tier).sort((a, b) => a.title.localeCompare(b.title)) }))
    .filter((g) => g.list.length > 0);

  return (
    <article className="page prose-page">
      <header className="page-head">
        <h1>{t(locale, "about.title")}</h1>
        <p className="lede">{COPY.lede[locale]}</p>
      </header>

      <section aria-labelledby="why">
        <h2 id="why">{COPY.whyTitle[locale]}</h2>
        <p>{COPY.why[locale]}</p>
      </section>

      <section aria-labelledby="method">
        <h2 id="method">{COPY.methodTitle[locale]}</h2>
        {COPY.method.map((p, i) => (
          <p key={i}>{p[locale]}</p>
        ))}
      </section>

      <section aria-labelledby="errors">
        <h2 id="errors">{COPY.errorsTitle[locale]}</h2>
        <p>
          {COPY.errors[locale]} <a href={`${repoUrl}/issues/new?template=content-error.yml`}>{COPY.report[locale]}</a>.
        </p>
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources">{COPY.sourcesTitle[locale]}</h2>
        {byTier.map(({ tier, list }) => (
          <div key={tier} className="source-tier">
            <h3 className="group-label">{COPY.tier[locale][tier]}</h3>
            <ul className="source-list">
              {list.map((s) => (
                <li key={s.id} id={`source-${s.id}`}>
                  <a href={s.url} rel="noopener noreferrer" target="_blank">
                    {s.title}
                  </a>
                  <span className="note-meta">
                    {s.publisher}
                    {s.version ? `, ${s.version}` : ""} · {COPY.accessed[locale]} {formatDate(locale, s.accessed)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
