import type { EntityKind, EntityScope, RelationshipType } from "@/lib/schema";
import type { RelationshipFamily } from "@/lib/relationships";

/** Map data, already resolved to one language on the server. */
export interface MapNode {
  id: string;
  acronym: string;
  name: string;
  kind: EntityKind;
  kindLabel: string;
  scope: EntityScope;
  oneLiner: string;
  x: number;
  y: number;
}

export interface MapEdge {
  id: string;
  from: string;
  to: string;
  type: RelationshipType;
  family: RelationshipFamily;
  label: string;
  inverse: string;
  explanation: string;
  interpretation: boolean;
  sources: Array<{ title: string; locator: string; url: string }>;
}

export interface MapZone {
  id: string;
  label: string;
  caption?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  style: "internal" | "affiliate" | "external";
}

export interface MapLabels {
  views: string;
  viewMap: string;
  viewList: string;
  viewTable: string;
  filters: string;
  hint: string;
  close: string;
  connections: string;
  noConnections: string;
  openProfile: string;
  node: string;
  selected: string;
  relationship: string;
  from: string;
  type: string;
  to: string;
  explanation: string;
  count: string;
  interpretation: string;
  families: Record<RelationshipFamily, { name: string; description: string }>;
}

export interface MapData {
  locale: "id" | "en";
  width: number;
  height: number;
  nodes: MapNode[];
  edges: MapEdge[];
  zones: MapZone[];
  /** Ordered groups for the list view. */
  groups: Array<{ label: string; ids: string[] }>;
  labels: MapLabels;
}
