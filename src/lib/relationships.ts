import type { EntityScope, LocalizedText, RelationshipType } from "./schema";

export type RelationshipFamily =
  | "policy"
  | "advice"
  | "accountability"
  | "implementation"
  | "selection"
  | "membership"
  | "context";

export type Marker = "triangle" | "chevron" | "diamond" | "circle" | "none";

export interface RelationshipTypeInfo {
  family: RelationshipFamily;
  /** Scope pairs [from, to] this type may connect. The validator rejects anything else. */
  allowed: Array<[EntityScope, EntityScope]>;
  label: LocalizedText;
  /** Same relation read from the other end, for "connected to" lists. */
  inverse: LocalizedText;
}

const internal: [EntityScope, EntityScope] = ["icann-internal", "icann-internal"];

export const RELATIONSHIPS: Record<RelationshipType, RelationshipTypeInfo> = {
  "reports-to": {
    family: "accountability",
    allowed: [internal],
    label: { en: "reports to", id: "bertanggung jawab kepada" },
    inverse: { en: "is reported to by", id: "menerima laporan dari" },
  },
  "exercises-powers-over": {
    family: "accountability",
    allowed: [internal],
    label: { en: "holds powers over", id: "punya kewenangan atas" },
    inverse: { en: "is held accountable by", id: "dapat dikoreksi oleh" },
  },
  "develops-policy-for": {
    family: "policy",
    allowed: [internal],
    label: { en: "recommends policy to", id: "merekomendasikan kebijakan ke" },
    inverse: { en: "receives policy from", id: "menerima rekomendasi kebijakan dari" },
  },
  advises: {
    family: "advice",
    allowed: [internal],
    label: { en: "advises", id: "memberi nasihat kepada" },
    inverse: { en: "is advised by", id: "menerima nasihat dari" },
  },
  implements: {
    family: "implementation",
    allowed: [internal],
    label: { en: "implements decisions of", id: "menjalankan keputusan" },
    inverse: { en: "decisions implemented by", id: "keputusannya dijalankan oleh" },
  },
  "performs-functions-for": {
    family: "implementation",
    allowed: [
      ["icann-affiliate", "icann-internal"],
      ["icann-affiliate", "external"],
    ],
    label: { en: "performs functions for", id: "menjalankan fungsi untuk" },
    inverse: { en: "has functions performed by", id: "fungsinya dijalankan oleh" },
  },
  "selects-members-of": {
    family: "selection",
    allowed: [internal, ["external", "icann-internal"]],
    label: { en: "selects members of", id: "memilih anggota" },
    inverse: { en: "has members selected by", id: "sebagian anggotanya dipilih oleh" },
  },
  "appoints-liaison-to": {
    family: "selection",
    allowed: [internal, ["external", "icann-internal"]],
    label: { en: "sends a liaison to", id: "mengirim liaison ke" },
    inverse: { en: "has a liaison from", id: "punya liaison dari" },
  },
  "part-of": {
    family: "membership",
    allowed: [internal, ["icann-affiliate", "icann-affiliate"]],
    label: { en: "is part of", id: "bagian dari" },
    inverse: { en: "includes", id: "mencakup" },
  },
  "participates-in": {
    family: "membership",
    allowed: [internal, ["external", "icann-internal"]],
    label: { en: "takes part in", id: "ikut serta dalam" },
    inverse: { en: "includes", id: "melibatkan" },
  },
  "related-to": {
    family: "context",
    allowed: [
      internal,
      ["icann-internal", "icann-affiliate"],
      ["icann-internal", "external"],
      ["icann-affiliate", "icann-internal"],
      ["icann-affiliate", "external"],
      ["external", "icann-internal"],
      ["external", "icann-affiliate"],
      ["external", "external"],
    ],
    label: { en: "is related to", id: "berkaitan dengan" },
    inverse: { en: "is related to", id: "berkaitan dengan" },
  },
};

export const FAMILIES: RelationshipFamily[] = [
  "policy",
  "advice",
  "accountability",
  "implementation",
  "selection",
  "membership",
  "context",
];

/** Families shown on the map before the reader touches the filters. */
export const DEFAULT_FAMILIES: RelationshipFamily[] = ["policy", "advice", "accountability", "implementation"];

/**
 * How each family is drawn. Families differ by dash pattern and arrowhead, not only by color,
 * so they stay distinguishable in grayscale.
 */
export const FAMILY_STYLE: Record<RelationshipFamily, { dash: string; width: number; marker: Marker }> = {
  policy: { dash: "", width: 2.25, marker: "triangle" },
  advice: { dash: "9 6", width: 2, marker: "chevron" },
  accountability: { dash: "", width: 3.5, marker: "triangle" },
  implementation: { dash: "14 4 2 4", width: 1.75, marker: "diamond" },
  selection: { dash: "2 5", width: 2, marker: "circle" },
  membership: { dash: "", width: 1.25, marker: "none" },
  context: { dash: "3 4", width: 1.25, marker: "none" },
};

export function familyOf(type: RelationshipType): RelationshipFamily {
  return RELATIONSHIPS[type].family;
}
