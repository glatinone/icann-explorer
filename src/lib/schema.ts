import { z } from "zod";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const localizedText = z
  .object({
    id: z.string().min(1, "Indonesian text is required"),
    en: z.string().min(1, "English text is required"),
  })
  .strict();

export type LocalizedText = z.infer<typeof localizedText>;

/** ISO date (YYYY-MM-DD), no time component, validated as a real calendar date. */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date (YYYY-MM-DD)")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "must be a real calendar date");

export const kebabCase = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase ASCII kebab-case");

export const sourceSchema = z
  .object({
    id: kebabCase,
    title: z.string().min(1),
    url: z.string().url().startsWith("https://"),
    publisher: z.string().min(1),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    languages: z.array(z.string()).min(1),
    version: z.string().optional(),
    accessed: isoDate,
  })
  .strict();

export type Source = z.infer<typeof sourceSchema>;

export const citation = z
  .object({
    sourceId: z.string(),
    locator: z.string().optional(),
    quote: z.string().optional(),
    verifiedAt: isoDate,
  })
  .strict();

export type Citation = z.infer<typeof citation>;

export const claim = z
  .object({
    text: localizedText,
    kind: z.enum(["fact", "interpretation"]),
    citations: z.array(citation).min(1, "Every claim needs at least one citation"),
    translation: z
      .object({
        original: z.enum(["id", "en"]),
        reviewed: z.boolean(),
      })
      .strict(),
  })
  .strict();

export type Claim = z.infer<typeof claim>;

export const entityKind = z.enum([
  "board",
  "icann-org",
  "supporting-organization",
  "advisory-committee",
  "committee",
  "stakeholder-group",
  "regional-organization",
  "mechanism",
  "affiliate",
  "external",
]);

export type EntityKind = z.infer<typeof entityKind>;

export const entityScope = z.enum(["icann-internal", "icann-affiliate", "external"]);

export const entitySchema = z
  .object({
    id: kebabCase,
    kind: entityKind,
    scope: entityScope,
    acronym: z.string().min(1),
    name: localizedText,
    oneLiner: claim,
    whyItExists: z.array(claim),
    whatItDoes: z.array(claim),
    example: claim,
    getInvolved: z.array(claim).optional(),
    officialUrl: z.string().url().startsWith("https://"),
    relatedTermIds: z.array(kebabCase),
    status: z.enum(["published", "needs-review"]),
    lastReviewed: isoDate,
  })
  .strict();

export type Entity = z.infer<typeof entitySchema>;

export const relationshipType = z.enum([
  "reports-to",
  "oversees",
  "develops-policy-for",
  "advises",
  "implements",
  "performs-functions-for",
  "selects-members-of",
  "appoints-liaison-to",
  "exercises-powers-over",
  "part-of",
  "participates-in",
  "related-to",
]);

export type RelationshipType = z.infer<typeof relationshipType>;

export const relationshipSchema = z
  .object({
    id: kebabCase.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "relationship id must be lowercase kebab"),
    from: kebabCase,
    to: kebabCase,
    type: relationshipType,
    label: localizedText,
    explanation: claim,
    status: z.enum(["published", "needs-review"]),
  })
  .strict();

export type Relationship = z.infer<typeof relationshipSchema>;

export const termSchema = z
  .object({
    id: kebabCase,
    term: z.string().min(1),
    acronym: z.string().optional(),
    definition: claim,
    relatedEntityIds: z.array(kebabCase),
    relatedTermIds: z.array(kebabCase),
    status: z.enum(["published", "needs-review"]),
  })
  .strict();

export type Term = z.infer<typeof termSchema>;

export const learningPathId = z.enum(["beginner", "policy", "technical", "get-involved"]);

export const learningPathLink = z.discriminatedUnion("type", [
  z.object({ type: z.literal("entity"), id: kebabCase }).strict(),
  z.object({ type: z.literal("term"), id: kebabCase }).strict(),
  z.object({ type: z.literal("external"), sourceId: kebabCase }).strict(),
]);

export const learningPathSchema = z
  .object({
    id: learningPathId,
    title: localizedText,
    audience: localizedText,
    estMinutes: z.number().int().positive(),
    steps: z
      .array(
        z
          .object({
            id: kebabCase,
            title: localizedText,
            body: localizedText,
            claims: z.array(claim).optional(),
            links: z.array(learningPathLink),
            check: z
              .object({
                question: localizedText,
                options: z.array(localizedText).min(2),
                answerIndex: z.number().int().min(0),
                explanation: localizedText,
              })
              .strict()
              .optional(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export type LearningPath = z.infer<typeof learningPathSchema>;

export const layoutZone = z
  .object({
    id: kebabCase,
    label: localizedText,
    x: z.number(),
    y: z.number(),
    w: z.number().positive(),
    h: z.number().positive(),
    style: z.enum(["internal", "affiliate", "external"]),
  })
  .strict();

export const layoutSchema = z
  .object({
    zones: z.array(layoutZone),
    positions: z.record(kebabCase, z.object({ x: z.number(), y: z.number() }).strict()),
  })
  .strict();

export type Layout = z.infer<typeof layoutSchema>;
