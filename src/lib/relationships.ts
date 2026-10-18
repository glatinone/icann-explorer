import type { RelationshipType, entityScope } from "./schema";
import type { z } from "zod";

type EntityScope = z.infer<typeof entityScope>;

export type RelationshipFamily =
  | "policy"
  | "advice"
  | "accountability"
  | "implementation"
  | "selection"
  | "membership"
  | "context";

export interface RelationshipTypeInfo {
  family: RelationshipFamily;
  /** Which endpoint scopes this type may connect. Keys are ("icann-internal" | "icann-affiliate" | "external"). */
  allowed: Array<[EntityScope, EntityScope]>;
  label: { id: string; en: string };
}

/**
 * The relationship registry: every relationship type maps to one of 7 visual families,
 * with the endpoint scopes it is allowed to connect. The validator rejects any
 * relationship whose endpoints fall outside the allowed scope pairs.
 */
export const RELATIONSHIP_REGISTRY: Record<RelationshipType, RelationshipTypeInfo> = {
  "reports-to": {
    family: "accountability",
    allowed: [["icann-internal", "icann-internal"], ["icann-internal", "icann-affiliate"]],
    label: { id: "bertanggung jawab kepada", en: "reports to" },
  },
  oversees: {
    family: "accountability",
    allowed: [["icann-internal", "icann-internal"]],
    label: { id: "mengawasi", en: "oversees" },
  },
  "develops-policy-for": {
    family: "policy",
    allowed: [["icann-internal", "icann-internal"]],
    label: { id: "mengembangkan kebijakan untuk", en: "develops policy for" },
  },
  advises: {
    family: "advice",
    allowed: [["icann-internal", "icann-internal"], ["external", "icann-internal"]],
    label: { id: "memberi nasihat kepada", en: "advises" },
  },
  implements: {
    family: "implementation",
    allowed: [["icann-internal", "icann-internal"]],
    label: { id: "menerapkan", en: "implements" },
  },
  "performs-functions-for": {
    family: "implementation",
    allowed: [["icann-internal", "icann-internal"], ["icann-affiliate", "icann-internal"]],
    label: { id: "menjalankan fungsi untuk", en: "performs functions for" },
  },
  "selects-members-of": {
    family: "selection",
    allowed: [["icann-internal", "icann-internal"]],
    label: { id: "memilih anggota", en: "selects members of" },
  },
  "appoints-liaison-to": {
    family: "selection",
    allowed: [["icann-internal", "icann-internal"], ["icann-internal", "icann-affiliate"], ["icann-internal", "external"]],
    label: { id: "mengirim liaison ke", en: "appoints liaison to" },
  },
  "exercises-powers-over": {
    family: "accountability",
    allowed: [["icann-internal", "icann-internal"]],
    label: { id: "memiliki kewenangan atas", en: "exercises powers over" },
  },
  "part-of": {
    family: "membership",
    allowed: [["icann-internal", "icann-internal"], ["icann-affiliate", "icann-affiliate"]],
    label: { id: "bagian dari", en: "part of" },
  },
  "participates-in": {
    family: "membership",
    allowed: [
      ["icann-internal", "icann-internal"],
      ["icann-affiliate", "icann-internal"],
      ["external", "icann-internal"],
    ],
    label: { id: "berpartisipasi dalam", en: "participates in" },
  },
  "related-to": {
    family: "context",
    allowed: [
      ["icann-internal", "icann-internal"],
      ["icann-internal", "icann-affiliate"],
      ["icann-internal", "external"],
      ["icann-affiliate", "external"],
      ["external", "external"],
    ],
    label: { id: "berkaitan dengan", en: "related to" },
  },
};

export const RELATIONSHIP_FAMILIES: RelationshipFamily[] = [
  "policy",
  "advice",
  "accountability",
  "implementation",
  "selection",
  "membership",
  "context",
];

export function relationshipInfo(type: RelationshipType): RelationshipTypeInfo {
  return RELATIONSHIP_REGISTRY[type];
}

/** Visual family used by the map: line pattern, arrowhead, and label come from here. */
export const FAMILY_STYLE: Record<
  RelationshipFamily,
  { id: string; en: string; pattern: "solid" | "dashed" | "dotted" | "dash-dot" | "long-dash"; arrow: "filled" | "open" | "none" }
> = {
  policy: { id: "Kebijakan", en: "Policy", pattern: "solid", arrow: "filled" },
  advice: { id: "Nasihat", en: "Advice", pattern: "dashed", arrow: "open" },
  accountability: { id: "Akuntabilitas", en: "Accountability", pattern: "dotted", arrow: "filled" },
  implementation: { id: "Penerapan", en: "Implementation", pattern: "long-dash", arrow: "filled" },
  selection: { id: "Penunjukan", en: "Selection", pattern: "dash-dot", arrow: "open" },
  membership: { id: "Keanggotaan", en: "Membership", pattern: "solid", arrow: "none" },
  context: { id: "Konteks", en: "Context", pattern: "long-dash", arrow: "open" },
};
