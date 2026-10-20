import Link from "next/link";
import type { ReactElement } from "react";
import type { MapData } from "./types";

/** Text alternative to the map: every group with what it is and what it connects to. */
export function MapList({ data }: { data: MapData }): ReactElement {
  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));
  return (
    <div className="map-list">
      {data.groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <h2 className="group-label">{group.label}</h2>
          <ul>
            {group.ids.map((id) => {
              const node = nodeById.get(id);
              if (!node) return null;
              const out = data.edges.filter((e) => e.from === id);
              return (
                <li key={id} className={`map-list-item kind-${node.kind}`}>
                  <h3>
                    <Link href={`/${data.locale}/organizations/${id}/`}>
                      <b>{node.acronym}</b>
                      {node.name !== node.acronym && <span> {node.name}</span>}
                    </Link>
                  </h3>
                  <p>{node.oneLiner}</p>
                  {out.length > 0 && (
                    <ul className="map-list-relations">
                      {out.map((e) => (
                        <li key={e.id}>
                          {e.label} <b>{nodeById.get(e.to)?.acronym}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
