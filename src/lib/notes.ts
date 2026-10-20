import type { Citation, Claim } from "./schema";

export interface Note {
  n: number;
  citation: Citation;
}

/**
 * Collects the citations of one page into numbered footnotes. The same source + locator
 * gets the same number everywhere on the page. Call `cite` in reading order.
 */
export class Notes {
  private readonly byKey = new Map<string, Note>();

  cite(claim: Claim): number[] {
    return claim.citations.map((citation) => {
      const key = `${citation.sourceId}|${citation.locator}|${citation.url ?? ""}`;
      let note = this.byKey.get(key);
      if (!note) {
        note = { n: this.byKey.size + 1, citation };
        this.byKey.set(key, note);
      }
      return note.n;
    });
  }

  get list(): Note[] {
    return [...this.byKey.values()];
  }
}
