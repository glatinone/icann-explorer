import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { t } from "@/i18n";

describe("UI dictionaries", () => {
  it("have the same keys in both languages", () => {
    expect(Object.keys(id).sort()).toEqual(Object.keys(en).sort());
  });

  it("have no empty strings and the same placeholders", () => {
    for (const key of Object.keys(en) as Array<keyof typeof en>) {
      expect(en[key].trim(), key).not.toBe("");
      expect(id[key].trim(), key).not.toBe("");
      const vars = (s: string): string[] => (s.match(/\{\w+\}/g) ?? []).sort();
      expect(vars(id[key]), key).toEqual(vars(en[key]));
    }
  });

  it("interpolates variables", () => {
    expect(t("en", "minutes", { n: 12 })).toBe("12 min");
    expect(t("id", "minutes", { n: 12 })).toBe("12 menit");
  });

  it("are all used somewhere in src", () => {
    const files: string[] = [];
    const walk = (dir: string): void => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(f)) files.push(readFileSync(p, "utf8"));
      }
    };
    walk(join(__dirname, "../../src"));
    const code = files.join("\n");
    // Keys built from a prefix (`kind.${kind}`) count as used when the prefix appears.
    const unused = Object.keys(en).filter((k) => !code.includes(`"${k}"`) && !code.includes(`\`${k.split(".")[0]}.\${`));
    expect(unused).toEqual([]);
  });
});
