"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { FAMILIES, type RelationshipFamily } from "@/lib/relationships";
import { LineSample } from "./LineSample";
import type { Selection } from "./MapExplorer";
import type { MapData, MapEdge } from "./types";

export function MapPanel({
  data,
  families,
  selection,
  onSelectNode,
  onSelectEdge,
  onClose,
}: {
  data: MapData;
  families: Set<RelationshipFamily>;
  selection: Selection;
  onSelectNode: (id: string | null) => void;
  onSelectEdge: (id: string) => void;
  onClose: () => void;
}): ReactElement {
  const { labels, locale } = data;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const node = selection.node ? data.nodes.find((n) => n.id === selection.node) : undefined;
  const edge = selection.edge ? data.edges.find((e) => e.id === selection.edge) : undefined;
  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));

  // Move focus into the panel when an edge is opened from the list, so keyboard users land on it.
  useEffect(() => {
    if (edge) headingRef.current?.focus();
  }, [edge]);

  if (edge) {
    const from = nodeById.get(edge.from)!;
    const to = nodeById.get(edge.to)!;
    return (
      <aside className="map-panel" aria-live="polite">
        <button type="button" className="panel-close" onClick={onClose} aria-label={labels.close}>
          ×
        </button>
        <p className="panel-kicker">
          <LineSample family={edge.family} /> {labels.families[edge.family].name}
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="panel-title panel-edge-title">
          <button type="button" className="link-button" onClick={() => onSelectNode(from.id)}>
            {from.acronym}
          </button>{" "}
          <span className="panel-verb">{edge.label}</span>{" "}
          <button type="button" className="link-button" onClick={() => onSelectNode(to.id)}>
            {to.acronym}
          </button>
        </h2>
        <p className={edge.interpretation ? "claim-interpretation" : undefined} title={edge.interpretation ? labels.interpretation : undefined}>
          {edge.explanation}
        </p>
        <ul className="panel-sources">
          {[...new Set(edge.sources.map((s) => s.title))].map((title) => {
            const cites = edge.sources.filter((s) => s.title === title);
            return (
              <li key={title}>
                <a href={cites[0].url} rel="noopener noreferrer" target="_blank">
                  {title}
                </a>
                , {cites.map((s) => s.locator).join("; ")}
              </li>
            );
          })}
        </ul>
        {selection.node && (
          <button type="button" className="panel-back" onClick={() => onSelectNode(selection.node)}>
            ← {nodeById.get(selection.node)?.acronym}
          </button>
        )}
      </aside>
    );
  }

  if (node) {
    const connections = data.edges.filter((e) => e.from === node.id || e.to === node.id);
    const grouped = FAMILIES.map((family) => ({ family, items: connections.filter((e) => e.family === family) })).filter(
      (g) => g.items.length > 0,
    );
    const phrase = (e: MapEdge): { verb: string; other: string } =>
      e.from === node.id ? { verb: e.label, other: e.to } : { verb: e.inverse, other: e.from };

    return (
      <aside className="map-panel" aria-live="polite">
        <button type="button" className="panel-close" onClick={onClose} aria-label={labels.close}>
          ×
        </button>
        <p className="panel-kicker">{node.kindLabel}</p>
        <h2 className="panel-title">
          {node.acronym}
          {node.name !== node.acronym && <span className="panel-name">{node.name}</span>}
        </h2>
        <p>{node.oneLiner}</p>
        <Link href={`/${locale}/organizations/${node.id}/`} className="panel-profile">
          {labels.openProfile} →
        </Link>
        <h3 className="group-label">{labels.connections}</h3>
        {grouped.length === 0 && <p className="muted">{labels.noConnections}</p>}
        {grouped.map(({ family, items }) => (
          <div key={family} className={`panel-group${families.has(family) ? "" : " is-hidden-family"}`}>
            <p className="panel-group-name">
              <LineSample family={family} /> {labels.families[family].name}
            </p>
            <ul>
              {items.map((e) => {
                const { verb, other } = phrase(e);
                return (
                  <li key={e.id}>
                    <button type="button" className="connection-button" onClick={() => onSelectEdge(e.id)}>
                      <span className="muted">{verb}</span> <b>{nodeById.get(other)?.acronym}</b>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className="map-panel map-legend">
      <p className="panel-hint">{labels.hint}</p>
      <dl>
        {FAMILIES.map((f) => (
          <div key={f} className={families.has(f) ? undefined : "is-hidden-family"}>
            <dt>
              <LineSample family={f} /> {labels.families[f].name}
            </dt>
            <dd>{labels.families[f].description}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
