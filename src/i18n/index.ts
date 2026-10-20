import en from "./en.json";
import id from "./id.json";
import { locales, defaultLocale, isLocale, otherLocale, type Locale } from "./config";

export type MessageKey = keyof typeof en;

const dictionaries: Record<Locale, Record<MessageKey, string>> = { en, id };

/** UI string lookup with `{name}` interpolation. Parity between dictionaries is enforced by a unit test. */
export function t(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const template = dictionaries[locale][key];
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Formats an ISO date for display, e.g. "20 Oct 2026" / "20 Okt 2026". */
export function formatDate(locale: Locale, iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Narrows a route param to a Locale. Unknown values fall back to the default. */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export { locales, defaultLocale, isLocale, otherLocale };
export type { Locale };
