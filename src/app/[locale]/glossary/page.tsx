import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale = (loc === "en" ? "en" : "id") as Locale;
  return (
    <div className="page">
      <h1>{t(locale, "glossary.title")}</h1>
      <p>{t(locale, "glossary.title.comingSoon")}</p>
    </div>
  );
}
