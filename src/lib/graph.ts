/**
 * Pure graph builder: turns content JSON into render-ready nodes/edges for the map.
 * Also powers the Tree and Relations views (same data, different presentation).
 */
import type { Entity, Relationship, LocalizedText, Locale } from "./schema";

export interface MapNode {
  id: string;
  acronym: string;
  name: LocalizedText;
  kind: Entity["kind"];
  scope: Entity["scope"];
  x: number;
  y: number;
  zoneId: string | null;
}

export interface MapEdge {
  id: string;
  from: string;
  to: string;
  type: Relationship["type"];
  label: LocalizedText;
}

export interface MapZone {
  id: string;
  label: LocalizedText;
  x: number;
  y: number;
  w: number;
  h: number;
  style: string;
}

export interface GraphData {
  nodes: MapNode[];
  edges: MapEdge[];
  zones: MapZone[];
}

export function buildGraph(
  entities: Entity[],
  relationships: Relationship[],
  layout: {
    zones: Array<{ id: string; label: LocalizedText; x: number; y: number; w: number; h: number; style: string }>;
    positions: Record<string, { x: number; y: number }>;
  },
): { nodes: MapNode[]; edges: MapEdge[]; zones: MapZone[] } {
  const nodes: MapNode[] = entities.map((e) => {
    const pos = layout.positions[e.id] ?? { x: 700, y: 450 };
    const zoneId = layout.zones.find(
      (z) => pos.x >= z.x && pos.x <= z.x + z.w && pos.y >= z.y && pos.y <= z.y + z.h,
    )?.id;
    return {
      id: e.id,
      acronym: e.acronym,
      name: e.name,
      kind: e.kind,
      scope: e.scope,
      x: pos.x,
      y: pos.y,
      zoneId: zoneId ?? null,
    };
  });

  const edges: MapEdge[] = relationships.map((r) => ({
    id: r.id,
    from: r.from,
    to: r.to,
    type: r.type,
    label: r.label,
  }));

  return { nodes, edges, zones: layout.zones as MapZone[] };
}

/** Neighbors of a node (ids connected by any visible edge). */
export function neighborsOf(nodeId: string, edges: MapEdge[]): Set<string> {
  const set = new Set<string>();
  for (const e of edges) {
    if (e.from === nodeId) set.add(e.to);
    else if (e.to === nodeId) set.add(e.from);
  }
  return set;
}

const KIND_LABELS: Record<string, Record<Locale, string>> = {
  board: { id: "Dewan", en: "Board" },
  "icann-org": { id: "Organisasi ICANN", en: "ICANN org" },
  "supporting-organization": { id: "Supporting Organization", en: "Supporting Organization" },
  "advisory-committee": { id: "Komite Penasihat", en: "Advisory Committee" },
  committee: { id: "Komite", en: "Committee" },
  "stakeholder-group": { id: "Kelompok pemangku kepentingan", en: "Stakeholder group" },
  "regional-organization": { id: "Organisasi regional", en: "Regional organization" },
  mechanism: { id: "Mekanisme", en: "Mechanism" },
  affiliate: { id: "Afiliasi ICANN", en: "ICANN affiliate" },
  external: { id: "Di luar ICANN", en: "Outside ICANN" },
};

export function kindLabel(kind: string, locale: Locale): string {
  return KIND_LABELS[kind]?.[locale] ?? kind;
}
