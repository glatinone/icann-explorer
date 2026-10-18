import { locales, defaultLocale, isLocale, otherLocale, type Locale } from "./config";

import id from "./id.json";
import en from "./en.json";

export const dictionaries: Record<Locale, Record<string, string>> = { id, en };

/** Typed translation helper: falls back to the key itself when missing (build-time test guards parity). */
export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? key;
}

export { locales, defaultLocale, isLocale, otherLocale };
export type { Locale };
