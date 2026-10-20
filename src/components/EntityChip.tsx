import Link from "next/link";
import type { ReactElement } from "react";
import type { Entity } from "@/lib/schema";
import type { Locale } from "@/i18n";

/** Acronym chip linking to a profile, colored by entity kind. The full name is in the title and for screen readers. */
export function EntityChip({ entity, locale }: { entity: Entity; locale: Locale }): ReactElement {
  return (
    <Link href={`/${locale}/organizations/${entity.id}/`} className={`chip kind-${entity.kind}`} title={entity.name[locale]}>
      {entity.acronym}
      <span className="visually-hidden">, {entity.name[locale]}</span>
    </Link>
  );
}
