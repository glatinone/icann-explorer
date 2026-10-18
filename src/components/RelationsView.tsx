"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { relationships, entities } from "@/lib/content";
import { RELATIONSHIP_REGISTRY, FAMILY_STYLE } from "@/lib/relationships";
import type { Locale } from "@/i18n";

export default function RelationsView({ locale }: { locale: Locale }): ReactElement {
  const [family, setFamily] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("");

  const acronymById = new Map(entities.map((e) => [e.id, e.acronym]));

  const rows = relationships.filter((r) => {
    if (family !== "all") {
      const info = RELATIONSHIP_REGISTRY[r.type as keyof typeof RELATIONSHIP_REGISTRY];
      if (!info || info.family !== family) return false;
    }
    if (entityFilter) {
      return r.from === entityFilter || r.to === entityFilter;
    }
    return true;
  });

  return (
    <div className="relations-view">
      <div className="relations-filters">
        <label>
          {locale === "id" ? "Keluarga: " : "Family: "}
          <select value={family} onChange={(e) => setFamily(e.target.value)}>
            <option value="all">{locale === "id" ? "Semua" : "All"}</option>
            {Object.entries(FAMILY_STYLE).map(([key, val]) => (
              <option key={key} value={key}>
                {val[locale]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {locale === "id" ? "Entitas: " : "Entity: "}
          <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)}>
            <option value="">{locale === "id" ? "Semua" : "All"}</option>
            {[...acronymById.entries()].map(([id, ac]) => (
              <option key={id} value={id}>
                {ac}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table className="relations-table">
        <thead>
          <tr>
            <th scope="col">{locale === "id" ? "Dari" : "From"}</th>
            <th scope="col">{locale === "id" ? "Relasi" : "Relationship"}</th>
            <th scope="col">{locale === "id" ? "Ke" : "To"}</th>
            <th scope="col">{locale === "id" ? "Penjelasan" : "Explanation"}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <a href={`/${locale}/organizations/${r.from}/`}>{acronymById.get(r.from)}</a>
              </td>
              <td>{r.label[locale]}</td>
              <td>
                <a href={`/${locale}/organizations/${r.to}/`}>{acronymById.get(r.to)}</a>
              </td>
              <td>{r.explanation.text[locale]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
