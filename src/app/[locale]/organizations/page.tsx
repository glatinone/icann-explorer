import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";

export default async function OrganizationsPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale = (loc === "en" ? "en" : "id") as Locale;
  return (
    <div className="page">
      <h1>{t(locale, "organizations.title")}</h1>
      <p>{t(locale, "organizations.title.comingSoon")}</p>
    </div>
  );
}
