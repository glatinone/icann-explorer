"use client";

import type { ReactElement, MouseEvent } from "react";
import { t, otherLocale, type Locale } from "@/i18n";

/**
 * Language toggle: swaps only the locale segment and keeps path, query, and hash.
 * Progressive enhancement: the href (no-JS fallback) points at the same path under
 * the other locale; on click we intercept and rewrite the current URL in place.
 */
export function LanguageToggle({ locale }: { locale: Locale }): ReactElement {
  const target = otherLocale(locale);

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    const url = new URL(window.location.href);
    const segments = url.pathname.split("/");
    if ((segments[1] as string | undefined) === locale) {
      segments[1] = target;
    }
    url.pathname = segments.join("/") || "/";
    window.location.assign(url.toString());
  }

  return (
    <a
      href={`/${target}/`}
      onClick={handleClick}
      lang={target}
      hrefLang={target}
      className="language-toggle"
      aria-label={t(locale, "site.language.switchTo")}
    >
      {t(locale, "site.language.other")}
    </a>
  );
}
