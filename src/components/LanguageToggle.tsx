"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, ReactElement } from "react";
import { otherLocale, type Locale } from "@/i18n/config";

/**
 * Swaps only the locale segment and keeps the rest of the path, the query (map selection)
 * and the hash (path step). The href works without JS; the click handler adds query and hash.
 */
export function LanguageToggle({ locale, label, short }: { locale: Locale; label: string; short: string }): ReactElement {
  const target = otherLocale(locale);
  const pathname = usePathname() ?? `/${locale}/`;
  const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`);

  function onClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    window.location.assign(href + window.location.search + window.location.hash);
  }

  return (
    <a href={href} onClick={onClick} hrefLang={target} lang={target} className="lang-toggle" aria-label={label} title={label}>
      <span className={`lang-opt${locale === "en" ? " is-current" : ""}`} aria-hidden="true">
        EN
      </span>
      <span className={`lang-opt${locale === "id" ? " is-current" : ""}`} aria-hidden="true">
        ID
      </span>
    </a>
  );
}
