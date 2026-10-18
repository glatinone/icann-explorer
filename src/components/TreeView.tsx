"use client";

import type { ReactElement } from "react";
import { entities } from "@/lib/content";
import type { Locale } from "@/i18n";

const GROUPS: Array<{ kinds: string[]; id: string; en: string }> = [
  { kinds: ["board", "icann-org"], id: "Dewan & organisasi", en: "Board & org" },
  { kinds: ["supporting-organization"], id: "Supporting Organizations", en: "Supporting Organizations" },
  { kinds: ["advisory-committee"], id: "Komite Penasihat", en: "Advisory Committees" },
  { kinds: ["committee", "mechanism", "stakeholder-group", "regional-organization"], id: "Komite & mekanisme", en: "Committees & mechanisms" },
  { kinds: ["affiliate"], id: "Afiliasi ICANN", en: "ICANN affiliate" },
  { kinds: ["external"], id: "Di luar ICANN", en: "Outside ICANN" },
];

export default function TreeView({ locale }: { locale: Locale }): ReactElement {
  return (
    <div className="tree-view">
      {GROUPS.map((group) => {
        const items = entities.filter((e) => group.kinds.includes(e.kind));
        if (items.length === 0) return null;
        return (
          <section key={group.en}>
            <h2>{locale === "id" ? group.id : group.en}</h2>
            <ul>
              {items.map((e) => (
                <li key={e.id}>
                  <a href={`/${locale}/organizations/${e.id}/`}>
                    <strong>{e.acronym}</strong> {e.name[locale]}
                  </a>
                  <span className="tree-oneliner">{e.oneLiner.text[locale]}</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
