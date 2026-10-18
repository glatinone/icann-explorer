"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import MapView from "@/components/MapView";
import TreeView from "@/components/TreeView";
import RelationsView from "@/components/RelationsView";
import NodePanel from "@/components/NodePanel";
import type { Locale } from "@/i18n";

type ViewMode = "map" | "tree" | "relations";

export default function MapClient({ locale }: { locale: Locale }): ReactElement {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("map");

  // Restore URL state after hydration; default to tree on small screens.
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const node = sp.get("node");
    if (node) setSelectedNode(node);
    const v = sp.get("view");
    if (v === "tree" || v === "relations" || v === "map") setView(v);
    else if (window.matchMedia("(max-width: 640px)").matches) setView("tree");
  }, []);

  // Keep ?node= in the URL whenever the selection changes.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedNode) url.searchParams.set("node", selectedNode);
    else url.searchParams.delete("node");
    window.history.replaceState(null, "", url.toString());
  }, [selectedNode]);

  // Keep ?view= in the URL when the view changes.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState(null, "", url.toString());
  }, [view]);

  useEffect(() => {
    const onPop = (): void => {
      const sp = new URLSearchParams(window.location.search);
      setSelectedNode(sp.get("node"));
      const v = sp.get("view");
      if (v === "tree" || v === "relations" || v === "map") setView(v);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <div className="page map-page">
      <h1>{locale === "id" ? "Peta ekosistem" : "Ecosystem map"}</h1>
      <div className="view-switcher" role="tablist" aria-label={locale === "id" ? "Tampilan" : "View"}>
        {(["map", "tree", "relations"] as const).map((v) => (
          <a
            key={v}
            href={`?view=${v}`}
            aria-current={view === v ? "page" : undefined}
            className={view === v ? "on" : ""}
            onClick={(e) => {
              e.preventDefault();
              setView(v);
            }}
          >
            {viewLabel(v, locale)}
          </a>
        ))}
      </div>
      {view === "map" && <MapView locale={locale} selectedNode={selectedNode} onSelectNode={setSelectedNode} />}
      {view === "tree" && <TreeView locale={locale} />}
      {view === "relations" && <RelationsView locale={locale} />}
      {view === "map" && selectedNode && (
        <NodePanel locale={locale} nodeId={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
}

function viewLabel(v: "map" | "tree" | "relations", locale: Locale): string {
  if (locale === "id") return v === "map" ? "Peta" : v === "tree" ? "Pohon" : "Relasi";
  return v.charAt(0).toUpperCase() + v.slice(1);
}
