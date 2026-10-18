# 01: Architecture

## Stack
See `AGENTS.md`. Summary: Next.js App Router + TS strict + Tailwind + `@xyflow/react` + zod + MiniSearch, static export, pnpm, Vercel.

## Folder layout
```
icann-explorer/
├─ AGENTS.md / CLAUDE.md / README.md
├─ content/                      # all site content, reviewed via PR
│  ├─ entities.json              # map nodes = groups / orgs
│  ├─ relationships.json         # map edges
│  ├─ terms.json                 # glossary
│  ├─ paths.json                 # learning paths
│  ├─ sources.json               # every citable source
│  └─ layout.json                # curated x/y positions + zones for the map
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ page.tsx                       # Home
│  │  │  ├─ map/page.tsx                   # Explore Map (+ list views)
│  │  │  ├─ organizations/page.tsx         # index (grouped by kind)
│  │  │  ├─ organizations/[id]/page.tsx    # profile
│  │  │  ├─ glossary/page.tsx              # A–Z + filter
│  │  │  ├─ glossary/[id]/page.tsx         # term page
│  │  │  ├─ paths/page.tsx
│  │  │  ├─ paths/[id]/page.tsx
│  │  │  └─ about/page.tsx                 # Sources, methodology, disclaimer
│  │  ├─ layout.tsx
│  │  └─ page.tsx                          # redirects to /id/ (default)
│  ├─ components/ (map/, panel/, layout/, search/, citation/, ui/)
│  ├─ lib/
│  │  ├─ content.ts      # load + validate content, typed getters, filters out needs-review
│  │  ├─ schema.ts       # zod schemas (single source of truth for types)
│  │  ├─ relationships.ts# relationship type registry (see modeling rules)
│  │  ├─ graph.ts        # build React Flow nodes/edges from content
│  │  └─ search.ts       # build MiniSearch index at build time
│  └─ i18n/ (id.json, en.json, config.ts)
├─ scripts/
│  ├─ validate-content.ts   # integrity, provenance, ID/EN parity, relationship rules
│  └─ check-links.ts        # GET every source URL, report non-2xx and redirects
├─ tests/ (unit/, e2e/)
├─ vercel.json              # security headers
└─ docs/
   ├─ plan/  reports/
   ├─ decisions.md          # append-only decision log
   └─ ASSETS.md             # fonts/icons/images + licenses
```

## Routing and i18n: language is separate from identity
- **One language-neutral ID per thing** (`gnso`, `alac`, `pdp`, `get-involved`), shared by both locales.
  IDs are lowercase kebab-case ASCII and never translated. **Slugs = IDs.**
- Locale prefix in the path only: `/id/organizations/gnso/` ↔ `/en/organizations/gnso/`. `generateStaticParams` builds every ID × locale.
- The language toggle swaps **only** the locale segment and keeps the path, query string, and hash:
  `/id/map/?node=gnso&view=list#panel` ↔ `/en/map/?node=gnso&view=list#panel`.
- UI state that must survive a toggle lives in the URL (`?node=`, `?edge=`, `?view=map|tree|relations`, path step `#step-3`).
- Text lives only in `LocalizedText` fields (content) and `src/i18n/{id,en}.json` (UI). Components never branch on locale for logic.
- Default locale: `id`. Set `<html lang>` per locale. Add `hreflang` alternates and `x-default`.
- No i18n library is required. A small typed `t(key)` helper is enough, and a test fails if a key is missing in either dictionary.

## Data schema (zod → TS types)
```ts
// src/lib/schema.ts (shape. Implement it with zod.)
type Locale = 'id' | 'en';
type LocalizedText = { id: string; en: string };            // both required, non-empty

type Source = {
  id: string;                 // kebab-case, e.g. "icann-bylaws"
  title: string;
  url: string;                // https only
  publisher: string;          // "ICANN", "At-Large", "IANA", "APNIC"...
  tier: 1 | 2 | 3 | 4;        // see AGENTS.md trust order. Tier 4 can't be the only citation of a fact
  languages: string[];        // languages the source itself is available in, e.g. ["en","es","fr","ar","ru","zh"]
  version?: string;           // e.g. Bylaws effective date
  accessed: string;           // ISO date the link was last opened
};

type Citation = {
  sourceId: string;
  locator?: string;           // "Art. 7, Sec. 7.2" / "section 'How to get involved'"
  quote?: string;             // short supporting excerpt in the source's language (≤ 30 words). Shown on hover, used by reviewers
  verifiedAt: string;         // ISO date a human or agent last checked this claim against the source
};

type Claim = {
  text: LocalizedText;
  kind: 'fact' | 'interpretation';
  citations: Citation[];      // min 1. A fact needs ≥ 1 Tier 1–3 citation
  translation: {              // provenance of the wording itself
    original: Locale;         // which language was written first
    reviewed: boolean;        // the other language was reviewed for meaning, not just machine-translated
  };
};

type EntityKind =
  | 'board' | 'icann-org' | 'supporting-organization' | 'advisory-committee'
  | 'committee' | 'stakeholder-group' | 'regional-organization'
  | 'mechanism' | 'affiliate' | 'external';

type Entity = {
  id: string;
  kind: EntityKind;
  scope: 'icann-internal' | 'icann-affiliate' | 'external';
  acronym: string;
  name: LocalizedText;        // official English name in both. The id field may add an Indonesian gloss in parentheses
  oneLiner: Claim;            // "In one sentence"
  whyItExists: Claim[];
  whatItDoes: Claim[];
  example: Claim;
  getInvolved?: Claim[];
  officialUrl: string;
  relatedTermIds: string[];
  status: 'published' | 'needs-review';
  lastReviewed: string;       // = latest verifiedAt across its claims
};

type Relationship = {
  id: string;                 // "<from>--<type>--<to>"
  from: string; to: string;   // entity ids
  type: RelationshipType;     // see the registry below
  label: LocalizedText;       // short edge label, e.g. "advises" / "memberi nasihat"
  explanation: Claim;         // shown when the edge is selected
  status: 'published' | 'needs-review';
};

type Term = {
  id: string; term: string; acronym?: string;
  definition: Claim;
  relatedEntityIds: string[];
  relatedTermIds: string[];
  status: 'published' | 'needs-review';
};

type LearningPath = {
  id: 'beginner' | 'policy' | 'technical' | 'get-involved';
  title: LocalizedText; audience: LocalizedText; estMinutes: number;
  steps: {
    id: string;               // language-neutral step id, used in the URL hash
    title: LocalizedText; body: LocalizedText;
    claims?: Claim[];         // any factual statement in the step body must also appear here with citations
    links: ({ type: 'entity' | 'term'; id: string } | { type: 'external'; sourceId: string })[];
    check?: { question: LocalizedText; options: LocalizedText[]; answerIndex: number; explanation: LocalizedText };
  }[];
};

type Layout = {
  zones: { id: string; label: LocalizedText; x: number; y: number; w: number; h: number; style: 'internal' | 'affiliate' | 'external' }[];
  positions: Record<string /*entityId*/, { x: number; y: number }>;
};
```

## Relationship modeling rules
The map shows **several kinds of relationships**, not one hierarchy. Each type has a precise meaning, its own visual
family, and its own allowed endpoints. `src/lib/relationships.ts` is the registry. The validator enforces it.

| Type | Meaning (use only when the source supports exactly this) | Visual family | Typical example |
| --- | --- | --- | --- |
| `reports-to` | Line accountability: the `from` side is managed by and answerable to the `to` side | **Accountability**: solid, thick, filled arrow | ICANN org (via the President & CEO) → Board |
| `oversees` | Inverse view of the same, from the overseer. **Pick one per pair, never both** | Accountability | (prefer `reports-to`) |
| `develops-policy-for` | Runs a formal policy development process whose recommendations go to `to` for adoption | **Policy**: solid, medium, open arrow, accent color | GNSO → Board (gTLD policy) |
| `advises` | Gives advice that `to` must consider. **Not binding, not a reporting line** | **Advice**: long-dash, medium, open arrow | ALAC / GAC / SSAC / RSSAC → Board |
| `implements` | Puts adopted decisions or policies into effect | **Implementation**: solid, thin, diamond arrowhead | ICANN org → Board decisions |
| `performs-functions-for` | Operates functions under a contract or agreement | Implementation | PTI → ICANN (IANA naming functions) |
| `selects-members-of` | Selects or appoints voting members or directors of `to` | **Selection**: dotted, thin, circle arrowhead | NomCom → Board |
| `appoints-liaison-to` | Sends a non-voting liaison | Selection (lighter) | SSAC → Board |
| `exercises-powers-over` | Holds formal powers that can check `to` | **Accountability (community)**: double line | Empowered Community → Board |
| `part-of` | Is a structural component of `to` | **Membership**: no line. Drawn as nesting or grouping, plus a thin connector | GNSO stakeholder groups → GNSO |
| `participates-in` | Takes part in `to` without being a component of it | Membership (thin, no arrow) | GAC → Empowered Community |
| `related-to` | Contextual or knowledge link. **No authority implied** | **Context**: short-dash, muted, no arrow. Hidden by default | IANA ↔ IETF protocol registries |

**Rules**
1. Use the **most specific** type the source supports. If you can only say "they work together", that's `related-to`, nothing stronger.
2. **No SO, AC, committee, stakeholder group, or external org may be the `from` of `reports-to`.** Only ICANN org (and PTI → ICANN org, if sourced) can be.
3. `advises` must never be drawn or worded like a reporting line. Its label always says "advises / memberi nasihat".
4. `external` entities may only use `related-to`, `participates-in`, `appoints-liaison-to`, or (where sourced) `selects-members-of`. They are never `part-of` an internal entity, and nothing internal `reports-to` them.
5. Every relationship needs its own `explanation` claim with citations, including `related-to`.
6. Maximum one relationship per (from, type, to). Don't draw both `reports-to` and `oversees` for the same pair.
7. The validator fails on any violation of rules 2, 4, 5, and 6.

**Visual rules:** every visual family differs by **line pattern + arrowhead + text label**, not only by color, and they stay
distinguishable in grayscale. The legend lists every family. On selection, edge labels are always shown as text.

## Map design
**Library:** React Flow with **fixed curated positions** from `layout.json` (no auto-layout in MVP).

**Zones (background regions):**
```
┌──────────────────────────── ICANN community ────────────────────────────┐
│  Supporting Organizations          Board             Advisory Committees │
│  (develop policy)                                       (give advice)    │
│   GNSO   ccNSO   ASO            ICANN Board          ALAC  GAC  SSAC  RSSAC
│   └ stakeholder groups                               └ RALOs             │
│                  NomCom      Empowered Community                         │
│                              ICANN org                                   │
├─────────────── ICANN affiliate ──────────────────────────────────────────┤
│                         PTI (performs IANA functions)                    │
└──────────────────────────────────────────────────────────────────────────┘
┌──────────── Outside ICANN (related, independent) ─── dashed border ──────┐
│     5 RIRs           IETF          Root server operators                 │
└──────────────────────────────────────────────────────────────────────────┘
```
The Board sits in the middle because many arrows point to it. The layout must not suggest that SOs/ACs sit "under" the Board in a chain of command.
The zone captions spell out the difference: "develop policy" vs "give advice".

**Filters:** chips per relationship family (Policy · Advice · Accountability · Implementation · Selection · Membership · Context. That's 7 families. "Accountability (community)" counts as Accountability).
Defaults on: Policy, Advice, Accountability, Implementation. Off: Selection, Membership, Context. Entity chips: SOs / ACs / Committees / External.

**Interactions:**
- Click, Enter, or Space on a node → highlight the node, its edges, and its neighbors, dim the rest, open the side panel (desktop) or bottom sheet (mobile), and set `?node=`.
- The panel shows: acronym, full name, one-liner, "What it does" (≤ 3 bullets), "Connected to" grouped by relationship type (clickable), "Read full profile →", the official link, and citation markers.
- Selecting an edge → the panel shows the relationship type, the explanation, and its citations. Sets `?edge=`.
- Legend always visible (collapsible on mobile).
- "Guided tour" (Board → SOs → ACs → ICANN org → Outside ICANN). Optional if time runs short.

**Accessible alternatives (MVP, required):** a view switcher on `/map/`: `Map · Tree · Relations` (`?view=`).
- **Tree:** a hierarchical list of zones → kinds → entities (nested `<ul>` with headings). Each item links to its profile and shows a one-liner.
- **Relations:** a table with the columns From · Relationship · To · Explanation · Source. It can be filtered by relationship family and entity, and sorted.
- Under 640px the default view is Tree, with an "Open interactive map" button.
- Keyboard on the map: Tab moves through nodes in a curated reading order (Board → SOs → ACs → committees → org → affiliate → external).
  Arrow keys move to connected neighbors. Esc clears the selection. Nodes have `aria-label` = "<acronym>, <full name>, <kind>, <n> connections".

**Visual style:** clean editorial, generous whitespace, one accent per entity kind as CSS variables, light and dark themes.
Don't reuse ICANN brand colors or logo shapes.

## Citations in the UI
- Each claim renders a small numbered marker. Hover or focus shows the source title, locator, verified date, and the quote (if any). Click jumps to the page's source list.
- If the source isn't available in the reader's language, show a small "EN" tag next to the link.
- Interpretation claims get a subtle "simplified explanation / penjelasan sederhana" style.

## Search
- Build the MiniSearch index at build time from entities + terms + paths (both locales). Serialize it to a static JSON file and lazy-load it on first focus.
- Fields: acronym (boost 3), name, term, oneLiner/definition. Prefix + fuzzy search.
- `Cmd/Ctrl+K` opens the search dialog. Results are grouped "Organizations" / "Terms" / "Paths", and they link by ID, so they work in either locale.

## Basic security (static site)
`vercel.json` headers: `Content-Security-Policy` (self + only what's needed, no `unsafe-eval`), `X-Content-Type-Options: nosniff`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, mic, geolocation off), `X-Frame-Options: DENY`, and HSTS.
External links: `rel="noopener noreferrer"`. No inline third-party scripts. Dependabot or `pnpm audit` in CI.

## Quality gates (CI via GitHub Actions)
`pnpm lint` · `pnpm typecheck` · `pnpm test` (Vitest + content validation + i18n key parity) · `pnpm build` · Playwright smoke + axe on 5 key pages.
`check-links` runs on demand and weekly, not on every PR (to avoid flaky external hosts).

### What `validate-content.ts` enforces
- Referential integrity: every ID referenced anywhere resolves. Every source is used. Every entity has a layout position.
- **Provenance:** every claim has ≥ 1 citation, every fact has ≥ 1 Tier 1–3 citation, and every citation has a `verifiedAt` that is a real date and not in the future.
- **Relationship rules 2, 4, 5, and 6** (above).
- **Language parity:** every `LocalizedText` has non-empty `id` and `en`. IDs are ASCII kebab-case.
- `needs-review` items are excluded from the build output, and the validator prints a count of them.
