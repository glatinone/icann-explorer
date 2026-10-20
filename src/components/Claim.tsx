import type { ReactElement } from "react";
import type { Claim } from "@/lib/schema";
import type { Notes } from "@/lib/notes";
import { t, type Locale } from "@/i18n";

export function Cite({ numbers, locale }: { numbers: number[]; locale: Locale }): ReactElement {
  return (
    <sup className="cite">
      {numbers.map((n) => (
        <a key={n} href={`#note-${n}`} aria-label={t(locale, "notes.cite", { n })}>
          {n}
        </a>
      ))}
    </sup>
  );
}

/** A claim's text in the current language, followed by its footnote numbers. */
export function ClaimText({
  claim,
  notes,
  locale,
}: {
  claim: Claim;
  notes: Notes;
  locale: Locale;
}): ReactElement {
  const numbers = notes.cite(claim);
  if (claim.kind === "interpretation") {
    return (
      <span className="claim claim-interpretation" title={t(locale, "claim.interpretation")}>
        {claim.text[locale]}
        <Cite numbers={numbers} locale={locale} />
      </span>
    );
  }
  return (
    <span className="claim">
      {claim.text[locale]}
      <Cite numbers={numbers} locale={locale} />
    </span>
  );
}
