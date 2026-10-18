import { describe, it, expect } from "vitest";
import id from "@/i18n/id.json";
import en from "@/i18n/en.json";

describe("i18n dictionaries", () => {
  it("have identical key sets (ID and EN at parity)", () => {
    const idKeys = Object.keys(id).sort();
    const enKeys = Object.keys(en).sort();
    const missingInEn = idKeys.filter((k) => !enKeys.includes(k));
    const missingInId = enKeys.filter((k) => !idKeys.includes(k));
    expect(missingInEn, "keys missing in EN").toEqual([]);
    expect(missingInId, "keys missing in ID").toEqual([]);
  });

  it("have no empty values", () => {
    for (const dict of [id, en]) {
      for (const [k, v] of Object.entries(dict)) {
        expect(v.trim(), `empty value for "${k}"`).not.toBe("");
      }
    }
  });
});
