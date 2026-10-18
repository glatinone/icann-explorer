"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { buildGraph, neighborsOf, kindLabel } from "@/lib/graph";
import { entities, relationships, layout } from "@/lib/content";
import { RELATIONSHIP_REGISTRY, FAMILY_STYLE, RELATIONSHIP_FAMILIES } from "@/lib/relationships";
import type { Locale } from "@/i18n";

const CANVAS_W = 1400;
const CANVAS_H = 900;

interface Props {
  locale: Locale;
  selectedNode: string | null;
  onSelectNode: (id: string | null) => void;
}

export default function MapView({ locale, selectedNode, onSelectNode }: Props): ReactElement {
  const graph = buildGraph(entities, relationships, layout);
  const [activeFamilies, setActiveFamilies] = useState<Set<string>>(
    new Set(["policy", "advice", "accountability", "implementation"]),
  );

  const visibleEdges = graph.edges.filter((e) => {
    const info = RELATIONSHIP_REGISTRY[e.type as keyof typeof RELATIONSHIP_REGISTRY];
    return info ? activeFamilies.has(info.family) : false;
  });

  const neighborIds = selectedNode ? neighborsOf(selectedNode, graph.edges) : new Set<string>();

  const select = (id: string | null): void => {
    onSelectNode(id);
  };

  return (
    <div className="map-wrap">
      <div className="map-filters" role="group" aria-label={locale === "id" ? "Filter keluarga relasi" : "Filter by relationship family"}>
        {(RELATIONSHIP_FAMILIES as readonly string[]).map((fam) => {
          const style = FAMILY_STYLE[fam as keyof typeof FAMILY_STYLE];
          const on = activeFamilies.has(fam);
          return (
            <button
              key={fam}
              type="button"
              aria-pressed={on}
              className={`family-chip family-${fam}${on ? " on" : ""}`}
              onClick={() => {
                const next = new Set(activeFamilies);
                if (on) next.delete(fam);
                else next.add(fam);
                setActiveFamilies(next);
              }}
            >
              {style[locale]}
            </button>
          );
        })}
      </div>

      <svg
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="map-svg"
        role="group"
        aria-label={locale === "id" ? "Peta ekosistem ICANN" : "ICANN ecosystem map"}
      >
        {graph.zones.map((z) => (
          <g key={z.id} className={`map-zone map-zone-${z.style}`}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={12} />
            <text x={z.x + 16} y={z.y + 26} className="map-zone-label">
              {z.label[locale]}
            </text>
          </g>
        ))}

        {visibleEdges.map((edge) => {
          const from = graph.nodes.find((n) => n.id === edge.from);
          const to = graph.nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const info = RELATIONSHIP_REGISTRY[edge.type as keyof typeof RELATIONSHIP_REGISTRY];
          if (!info) return null;
          const dim = selectedNode && edge.from !== selectedNode && edge.to !== selectedNode;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 8;
          return (
            <g key={edge.id} className={`map-edge family-${info.family}${dim ? " dimmed" : ""}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
              <text x={midX} y={midY} textAnchor="middle" className="map-edge-label">
                {edge.label[locale]}
              </text>
            </g>
          );
        })}

        {graph.nodes.map((node) => {
          const selected = selectedNode === node.id;
          const isNeighbor = selectedNode ? neighborIds.has(node.id) : false;
          const dim = Boolean(selectedNode) && !selected && !isNeighbor;
          return (
            <g
              key={node.id}
              transform={`translate(${node.x},${node.y})`}
              className={`map-node kind-${node.kind} scope-${node.scope}${selected ? " selected" : ""}${dim ? " dimmed" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`${node.acronym}, ${node.name[locale]}, ${kindLabel(node.kind, locale)}${node.scope === "external" ? `, ${locale === "id" ? "di luar ICANN" : "outside ICANN"}` : ""}`}
              onClick={() => select(node.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(node.id);
                } else if (e.key === "Escape") {
                  select(null);
                }
              }}
            >
              <rect x={-70} y={-26} width={140} height={52} rx={8} className="map-node-box" />
              <text x={0} y={-2} textAnchor="middle" className="map-node-acronym">
                {node.acronym}
              </text>
              <text x={0} y={16} textAnchor="middle" className="map-node-name">
                {node.name[locale]}
              </text>
            </g>
          );
        })}
      </svg>

      <p aria-live="polite" className="visually-hidden">
        {selectedNode
          ? locale === "id"
            ? `Terpilih: ${graph.nodes.find((n) => n.id === selectedNode)?.name.id ?? selectedNode}`
            : `Selected: ${graph.nodes.find((n) => n.id === selectedNode)?.name.en ?? selectedNode}`
          : ""}
      </p>
    </div>
  );
}
