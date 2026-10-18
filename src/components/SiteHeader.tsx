import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";
import { LanguageToggle } from "./LanguageToggle";

const NAV_ITEMS = [
  { key: "site.nav.map", href: "/map/" },
  { key: "site.nav.organizations", href: "/organizations/" },
  { key: "site.nav.glossary", href: "/glossary/" },
  { key: "site.nav.paths", href: "/paths/" },
  { key: "site.nav.about", href: "/about/" },
] as const;

export function SiteHeader({ locale }: { locale: Locale }): ReactElement {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-brand-block">
          <a href={`/${locale}/`} className="site-brand">
            ICANN Explorer
          </a>
          <p className="site-tagline">{t(locale, "common.label.unofficial")}</p>
        </div>
        <LanguageToggle locale={locale} />
      </div>
      <nav aria-label={locale === "id" ? "Navigasi utama" : "Main navigation"}>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a href={`/${locale}${item.href}`}>{t(locale, item.key)}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
