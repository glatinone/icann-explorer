import { z } from "zod";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const localizedText = z
  .object({
    id: z.string().trim().min(1, "Indonesian text is required"),
    en: z.string().trim().min(1, "English text is required"),
  })
  .strict();
export type LocalizedText = z.infer<typeof localizedText>;

/** ISO date (YYYY-MM-DD) that is a real calendar date. */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be an ISO date (YYYY-MM-DD)")
  .refine((v) => {
    const d = new Date(`${v}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
  }, "must be a real calendar date");

export const kebabCase = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase ASCII kebab-case");

const status = z.enum(["published", "needs-review"]);

export const sourceSchema = z
  .object({
    id: kebabCase,
    title: z.string().min(1),
    url: z.string().url().startsWith("https://"),
    publisher: z.string().min(1),
    /** 1 = Bylaws/charters/resolutions, 2 = official ICANN pages, 3 = external orgs about themselves, 4 = secondary. */
    tier: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
    languages: z.array(z.string()).min(1),
    version: z.string().optional(),
    accessed: isoDate,
  })
  .strict();
export type Source = z.infer<typeof sourceSchema>;

export const citationSchema = z
  .object({
    sourceId: kebabCase,
    /** Where in the source: "Art. 11, Sec. 11.1", "section 'Who we are'". Required, so a citation can be checked. */
    locator: z.string().trim().min(3),
    /** Deep link when the passage lives on a sub-page of the source (e.g. one glossary entry). */
    url: z.string().url().startsWith("https://").optional(),
    /** Verbatim excerpt from the source, in the source's language. */
    quote: z
      .string()
      .trim()
      .optional()
      .refine((q) => q === undefined || q.split(/\s+/).length <= 40, "quote must be 40 words or fewer"),
    verifiedAt: isoDate,
  })
  .strict();
export type Citation = z.infer<typeof citationSchema>;

export const claimSchema = z
  .object({
    text: localizedText,
    kind: z.enum(["fact", "interpretation"]),
    citations: z.array(citationSchema).min(1, "every claim needs at least one citation"),
  })
  .strict();
export type Claim = z.infer<typeof claimSchema>;

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
export type EntityScope = z.infer<typeof entityScope>;

export const entitySchema = z
  .object({
    id: kebabCase,
    kind: entityKind,
    scope: entityScope,
    acronym: z.string().min(1),
    name: localizedText,
    /** One sentence, at most ~25 words. */
    oneLiner: claimSchema,
    whyItExists: claimSchema,
    whatItDoes: z.array(claimSchema).min(2).max(4),
    /** Who sits in it, how many, how they get there. */
    whoIsIn: claimSchema,
    example: claimSchema,
    getInvolved: z.array(claimSchema).optional(),
    officialUrl: z.string().url().startsWith("https://"),
    relatedTermIds: z.array(kebabCase),
    status,
  })
  .strict();
export type Entity = z.infer<typeof entitySchema>;

export const relationshipType = z.enum([
  "reports-to",
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
    /** Always `${from}--${type}--${to}`. */
    id: z.string().regex(/^[a-z0-9-]+--[a-z-]+--[a-z0-9-]+$/),
    from: kebabCase,
    to: kebabCase,
    type: relationshipType,
    explanation: claimSchema,
    status,
  })
  .strict()
  .refine((r) => r.id === `${r.from}--${r.type}--${r.to}`, { message: "id must be `${from}--${type}--${to}`" });
export type Relationship = z.infer<typeof relationshipSchema>;

export const termSchema = z
  .object({
    id: kebabCase,
    /** Display name. Usually the official English term in both languages, with an ID gloss where natural. */
    term: localizedText,
    acronym: z.string().optional(),
    definition: claimSchema,
    relatedEntityIds: z.array(kebabCase),
    relatedTermIds: z.array(kebabCase),
    status,
  })
  .strict();
export type Term = z.infer<typeof termSchema>;

export const learningPathLink = z.discriminatedUnion("type", [
  z.object({ type: z.literal("entity"), id: kebabCase }).strict(),
  z.object({ type: z.literal("term"), id: kebabCase }).strict(),
  z.object({ type: z.literal("source"), id: kebabCase }).strict(),
]);
export type LearningPathLink = z.infer<typeof learningPathLink>;

export const pathStepSchema = z
  .object({
    id: kebabCase,
    title: localizedText,
    /** Paragraphs separated by a blank line. */
    body: localizedText,
    claims: z.array(claimSchema).optional(),
    links: z.array(learningPathLink),
    check: z
      .object({
        question: localizedText,
        options: z.array(localizedText).min(2),
        answerIndex: z.number().int().min(0),
        explanation: localizedText,
      })
      .strict()
      .refine((c) => c.answerIndex < c.options.length, "answerIndex out of range")
      .optional(),
  })
  .strict();
export type PathStep = z.infer<typeof pathStepSchema>;

export const learningPathSchema = z
  .object({
    id: kebabCase,
    title: localizedText,
    audience: localizedText,
    summary: localizedText,
    estMinutes: z.number().int().positive(),
    steps: z.array(pathStepSchema).min(1),
  })
  .strict();
export type LearningPath = z.infer<typeof learningPathSchema>;

export const layoutSchema = z
  .object({
    zones: z.array(
      z
        .object({
          id: kebabCase,
          label: localizedText,
          caption: localizedText.optional(),
          x: z.number(),
          y: z.number(),
          w: z.number().positive(),
          h: z.number().positive(),
          style: z.enum(["internal", "affiliate", "external"]),
        })
        .strict(),
    ),
    positions: z.record(kebabCase, z.object({ x: z.number(), y: z.number() }).strict()),
  })
  .strict();
export type Layout = z.infer<typeof layoutSchema>;
