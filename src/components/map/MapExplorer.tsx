"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { DEFAULT_FAMILIES, FAMILIES, type RelationshipFamily } from "@/lib/relationships";
import { LineSample } from "./LineSample";
import { MapCanvas } from "./MapCanvas";
import { MapList } from "./MapList";
import { MapPanel } from "./MapPanel";
import { MapTable } from "./MapTable";
import type { MapData } from "./types";

type View = "map" | "list" | "table";
const VIEWS: View[] = ["map", "list", "table"];

export interface Selection {
  node: string | null;
  edge: string | null;
}

function readUrl(): { view: View | null; node: string | null; edge: string | null } {
  const sp = new URLSearchParams(window.location.search);
  const v = sp.get("view");
  return { view: VIEWS.includes(v as View) ? (v as View) : null, node: sp.get("node"), edge: sp.get("edge") };
}

export function MapExplorer({ data }: { data: MapData }): ReactElement {
  const { labels } = data;
  const [view, setView] = useState<View>("map");
  const [selection, setSelection] = useState<Selection>({ node: null, edge: null });
  const [families, setFamilies] = useState<Set<RelationshipFamily>>(() => new Set(DEFAULT_FAMILIES));

  const nodeIds = useMemo(() => new Set(data.nodes.map((n) => n.id)), [data.nodes]);
  const edgeById = useMemo(() => new Map(data.edges.map((e) => [e.id, e])), [data.edges]);

  const applyUrl = useCallback((): void => {
    const url = readUrl();
    const edge = url.edge && edgeById.has(url.edge) ? url.edge : null;
    setSelection({ node: url.node && nodeIds.has(url.node) ? url.node : null, edge });
    if (edge) setFamilies((f) => new Set([...f, edgeById.get(edge)!.family]));
    setView(url.view ?? (window.matchMedia("(max-width: 720px)").matches ? "list" : "map"));
  }, [edgeById, nodeIds]);

  // Static export: the query string is only known in the browser.
  useEffect(() => {
    applyUrl();
    window.addEventListener("popstate", applyUrl);
    return () => window.removeEventListener("popstate", applyUrl);
  }, [applyUrl]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null): void => {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    };
    set("view", view === "map" ? null : view);
    set("node", selection.node);
    set("edge", selection.edge);
    if (url.href !== window.location.href) window.history.replaceState(null, "", url);
  }, [view, selection]);

  const selectNode = useCallback((id: string | null) => setSelection({ node: id, edge: null }), []);
  const selectEdge = useCallback(
    (id: string) => {
      const edge = edgeById.get(id);
      if (edge) setFamilies((f) => (f.has(edge.family) ? f : new Set([...f, edge.family])));
      setSelection((s) => ({ node: s.node, edge: id }));
    },
    [edgeById],
  );

  const toggleFamily = (family: RelationshipFamily): void => {
    setFamilies((current) => {
      const next = new Set(current);
      if (next.has(family)) next.delete(family);
      else next.add(family);
      return next;
    });
  };

  const viewLabel: Record<View, string> = { map: labels.viewMap, list: labels.viewList, table: labels.viewTable };

  return (
    <div className={`map-explorer view-${view}`}>
      <div className="map-toolbar">
        <div className="segmented" role="group" aria-label={labels.views}>
          {VIEWS.map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>
              {viewLabel[v]}
            </button>
          ))}
        </div>
        {view !== "list" && (
          <fieldset className="family-filters">
            <legend>{labels.filters}</legend>
            {FAMILIES.map((f) => (
              <label key={f} className={`family-filter family-${f}`} title={labels.families[f].description}>
                <input type="checkbox" checked={families.has(f)} onChange={() => toggleFamily(f)} />
                <LineSample family={f} />
                <span>{labels.families[f].name}</span>
              </label>
            ))}
          </fieldset>
        )}
      </div>

      {view === "map" && (
        <div className="map-stage">
          <MapCanvas data={data} families={families} selection={selection} onSelectNode={selectNode} onSelectEdge={selectEdge} />
          <MapPanel
            data={data}
            families={families}
            selection={selection}
            onSelectNode={selectNode}
            onSelectEdge={selectEdge}
            onClose={() => setSelection({ node: null, edge: null })}
          />
        </div>
      )}
      {view === "list" && <MapList data={data} />}
      {view === "table" && <MapTable data={data} families={families} />}
    </div>
  );
}
