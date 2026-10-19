export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const siteName = "ICANN Explorer";

/** One config constant for the feedback / discussions link. TODO(Kiell): set the final URL. */
export const feedbackUrl =
  "https://github.com/glatinone/icann-explorer/discussions/new";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "id" ? "en" : "id";
}
