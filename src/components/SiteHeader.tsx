import Link from "next/link";
import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { NavLinks } from "./NavLinks";
import { Search } from "./Search";

export function SiteHeader({ locale }: { locale: Locale }): ReactElement {
  const items = [
    { href: `/${locale}/map/`, label: t(locale, "nav.map") },
    { href: `/${locale}/organizations/`, label: t(locale, "nav.organizations") },
    { href: `/${locale}/paths/`, label: t(locale, "nav.paths") },
    { href: `/${locale}/glossary/`, label: t(locale, "nav.glossary") },
    { href: `/${locale}/about/`, label: t(locale, "nav.about") },
  ];
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={`/${locale}/`} className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">ICANN Explorer</span>
          <span className="brand-note">{t(locale, "site.unofficial")}</span>
        </Link>
        <NavLinks items={items} label={t(locale, "nav.label")} />
        <div className="header-tools">
          <Search
            locale={locale}
            labels={{
              open: t(locale, "search.open"),
              label: t(locale, "search.label"),
              placeholder: t(locale, "search.placeholder"),
              empty: t(locale, "search.empty"),
              hint: t(locale, "search.hint"),
              loading: t(locale, "search.loading"),
              entity: t(locale, "search.group.entity"),
              term: t(locale, "search.group.term"),
              path: t(locale, "search.group.path"),
            }}
          />
          <LanguageToggle locale={locale} label={t(locale, "lang.switch")} />
        </div>
      </div>
    </header>
  );
}
