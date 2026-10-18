"use client";

import type { ReactElement } from "react";
import { entityById, relationshipsFor } from "@/lib/content";
import type { Locale } from "@/i18n";

export default function NodePanel({
  locale,
  nodeId,
  onClose,
}: {
  locale: Locale;
  nodeId: string;
  onClose: () => void;
}): ReactElement {
  const entity = entityById(nodeId);
  if (!entity) return <></>;
  const rels = relationshipsFor(nodeId);

  return (
    <aside className="node-panel" aria-label={entity.name[locale]}>
      <button type="button" className="panel-close" onClick={onClose} aria-label={locale === "id" ? "Tutup panel" : "Close panel"}>
        ×
      </button>
      <h2>
        {entity.acronym} - {entity.name[locale]}
      </h2>
      <p className="panel-oneliner">{entity.oneLiner.text[locale]}</p>
      <h3>{locale === "id" ? "Terhubung dengan" : "Connected to"}</h3>
      <ul>
        {rels.slice(0, 8).map((r) => {
          const other = r.from === nodeId ? r.to : r.from;
          return (
            <li key={r.id}>
              <a href={`/${locale}/organizations/${other}/`}>{r.label[locale]}</a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
