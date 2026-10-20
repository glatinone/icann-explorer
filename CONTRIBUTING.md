# Contributing

Corrections are the most useful contribution. Every page has a "Report an error" link that opens a pre-filled GitHub issue.

## Fixing content yourself

1. Read [`docs/content-guide.md`](docs/content-guide.md): source tiers, citation format, writing style, and the Indonesian vocabulary list.
2. Edit the JSON in `content/`. Every claim keeps at least one citation with a `locator` (article/section or page heading), a verbatim `quote` for facts, and the `verifiedAt` date you actually checked it.
3. Change both languages. Indonesian is written as Indonesian, not translated word for word.
4. Run:

```bash
pnpm validate:content   # schema, provenance and relationship rules
pnpm check:quotes       # every quote still appears in its source
pnpm test
```

5. Open a pull request saying which source supports the change. When sources disagree, the higher tier wins.

## Code

`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` and `pnpm test:e2e` must pass. UI strings go in `src/i18n/{id,en}.json`, never inline.
