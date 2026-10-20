export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const siteName = "ICANN Explorer";
export const repoUrl = "https://github.com/glatinone/icann-explorer";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}

/** Prefilled GitHub issue for a content error on a given page path. */
export function reportUrl(pagePath: string): string {
  const title = encodeURIComponent(`[Content] ${pagePath}`);
  return `${repoUrl}/issues/new?template=content-error.yml&title=${title}`;
}
