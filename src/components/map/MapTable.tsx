import Link from "next/link";
import type { ReactElement } from "react";
import { FAMILIES, type RelationshipFamily } from "@/lib/relationships";
import { LineSample } from "./LineSample";
import type { MapData } from "./types";

/** Every relationship as a row, filtered by the same family checkboxes as the map. */
export function MapTable({ data, families }: { data: MapData; families: Set<RelationshipFamily> }): ReactElement {
  const { labels, locale } = data;
  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));
  const rows = FAMILIES.flatMap((f) => (families.has(f) ? data.edges.filter((e) => e.family === f) : []));
  return (
    <div className="map-table-wrap">
      <table className="map-table">
        <caption>{labels.count.replace("{n}", String(rows.length))}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.from}</th>
            <th scope="col">{labels.type}</th>
            <th scope="col">{labels.to}</th>
            <th scope="col">{labels.explanation}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <th scope="row">
                <Link href={`/${locale}/organizations/${e.from}/`}>{nodeById.get(e.from)?.acronym}</Link>
              </th>
              <td className="nowrap">
                <LineSample family={e.family} /> {e.label}
              </td>
              <td>
                <Link href={`/${locale}/organizations/${e.to}/`}>{nodeById.get(e.to)?.acronym}</Link>
              </td>
              <td>
                {e.explanation}
                <span className="table-sources">
                  {e.sources.map((s, i) => (
                    <a key={i} href={s.url} rel="noopener noreferrer" target="_blank">
                      {s.title}, {s.locator}
                    </a>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
