"use client";

import { useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import { edgeGeometry, nearestInDirection, NODE_H, NODE_W, parallelIndex, type Direction } from "@/lib/geometry";
import { FAMILIES, FAMILY_STYLE, type RelationshipFamily } from "@/lib/relationships";
import type { Selection } from "./MapExplorer";
import type { MapData } from "./types";

const ARROWS: Record<string, Direction> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };

function Markers(): ReactElement {
  return (
    <defs>
      {FAMILIES.map((f) => {
        const { marker } = FAMILY_STYLE[f];
        if (marker === "none") return null;
        const common = { id: `m-${f}`, markerUnits: "userSpaceOnUse", orient: "auto-start-reverse", className: `marker family-${f}` };
        if (marker === "triangle")
          return (
            <marker key={f} {...common} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="12" markerHeight="12">
              <path d="M0,0 L10,5 L0,10 z" />
            </marker>
          );
        if (marker === "chevron")
          return (
            <marker key={f} {...common} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="12" markerHeight="12">
              <path d="M1,1 L9,5 L1,9" className="open" />
            </marker>
          );
        if (marker === "diamond")
          return (
            <marker key={f} {...common} viewBox="0 0 12 10" refX="11" refY="5" markerWidth="13" markerHeight="11">
              <path d="M0,5 L6,0 L12,5 L6,10 z" />
            </marker>
          );
        return (
          <marker key={f} {...common} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="9" markerHeight="9">
            <circle cx="5" cy="5" r="4" />
          </marker>
        );
      })}
    </defs>
  );
}

export function MapCanvas({
  data,
  families,
  selection,
  onSelectNode,
  onSelectEdge,
}: {
  data: MapData;
  families: Set<RelationshipFamily>;
  selection: Selection;
  onSelectNode: (id: string | null) => void;
  onSelectEdge: (id: string) => void;
}): ReactElement {
  const { labels } = data;
  const [hover, setHover] = useState<string | null>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());

  const nodeById = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);
  const visibleEdges = useMemo(() => data.edges.filter((e) => families.has(e.family)), [data.edges, families]);
  const fan = useMemo(() => parallelIndex(visibleEdges), [visibleEdges]);
  const degree = useMemo(() => {
    const d = new Map<string, number>();
    for (const e of data.edges) {
      d.set(e.from, (d.get(e.from) ?? 0) + 1);
      d.set(e.to, (d.get(e.to) ?? 0) + 1);
    }
    return d;
  }, [data.edges]);

  const selectedEdge = selection.edge ? data.edges.find((e) => e.id === selection.edge) : undefined;
  const focusId = selection.node ?? hover;
  const lit = useMemo(() => {
    const nodes = new Set<string>();
    const edges = new Set<string>();
    if (selectedEdge) {
      nodes.add(selectedEdge.from).add(selectedEdge.to);
      edges.add(selectedEdge.id);
    } else if (focusId) {
      nodes.add(focusId);
      for (const e of visibleEdges) {
        if (e.from === focusId || e.to === focusId) {
          edges.add(e.id);
          nodes.add(e.from).add(e.to);
        }
      }
    }
    return { nodes, edges, active: nodes.size > 0 };
  }, [selectedEdge, focusId, visibleEdges]);

  const onNodeKey = (e: KeyboardEvent<SVGGElement>, id: string): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectNode(selection.node === id ? null : id);
    } else if (e.key === "Escape") {
      onSelectNode(null);
    } else if (ARROWS[e.key]) {
      e.preventDefault();
      const next = nearestInDirection(data.nodes, id, ARROWS[e.key]);
      if (next) nodeRefs.current.get(next.id)?.focus();
    }
  };

  const showLabels = Boolean(selection.node || selection.edge);

  return (
    <div className="map-canvas" onKeyDown={(e) => e.key === "Escape" && onSelectNode(null)}>
      <svg
        viewBox={`0 0 ${data.width} ${data.height}`}
        role="group"
        aria-label={labels.hint}
        onClick={(e) => {
          if (e.target === e.currentTarget) onSelectNode(null);
        }}
      >
        <Markers />

        {data.zones.map((z) => (
          <g key={z.id} className={`zone zone-${z.style}`} aria-hidden="true">
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={14} />
            <text x={z.x + 16} y={z.y + 24} className="zone-label">
              {z.label}
            </text>
            {z.caption && (
              <text x={z.x + 16} y={z.y + 41} className="zone-caption">
                {z.caption}
              </text>
            )}
          </g>
        ))}

        <g className="edges">
          {visibleEdges.map((edge) => {
            const from = nodeById.get(edge.from);
            const to = nodeById.get(edge.to);
            if (!from || !to) return null;
            const { index, count } = fan.get(edge.id) ?? { index: 0, count: 1 };
            const geo = edgeGeometry(from, to, index, count);
            const style = FAMILY_STYLE[edge.family];
            const isLit = lit.edges.has(edge.id);
            const state = lit.active ? (isLit ? " is-lit" : " is-dim") : "";
            return (
              <g
                key={edge.id}
                className={`edge family-${edge.family}${state}${selection.edge === edge.id ? " is-selected" : ""}`}
                onClick={() => onSelectEdge(edge.id)}
              >
                <path d={geo.d} className="edge-hit" />
                <path
                  d={geo.d}
                  className="edge-line"
                  strokeWidth={style.width}
                  strokeDasharray={style.dash || undefined}
                  markerEnd={style.marker === "none" ? undefined : `url(#m-${edge.family})`}
                />
                <title>{`${from.acronym} ${edge.label} ${to.acronym}`}</title>
              </g>
            );
          })}
        </g>

        <g className="nodes">
          {data.nodes.map((node) => {
            const isSelected = selection.node === node.id;
            const state = lit.active ? (lit.nodes.has(node.id) ? " is-lit" : " is-dim") : "";
            return (
              <g
                key={node.id}
                ref={(el) => {
                  if (el) nodeRefs.current.set(node.id, el);
                  else nodeRefs.current.delete(node.id);
                }}
                className={`node kind-${node.kind}${state}${isSelected ? " is-selected" : ""}`}
                transform={`translate(${node.x},${node.y})`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={labels.node
                  .replace("{acronym}", node.acronym)
                  .replace("{name}", node.name)
                  .replace("{kind}", node.kindLabel)
                  .replace("{n}", String(degree.get(node.id) ?? 0))}
                onClick={() => onSelectNode(isSelected ? null : node.id)}
                onKeyDown={(e) => onNodeKey(e, node.id)}
                onMouseEnter={() => setHover(node.id)}
                onMouseLeave={() => setHover(null)}
              >
                <rect x={-NODE_W / 2} y={-NODE_H / 2} width={NODE_W} height={NODE_H} rx={9} className="node-box" />
                <rect x={-NODE_W / 2} y={-NODE_H / 2} width={5} height={NODE_H} className="node-tab" />
                <text y={-3} className="node-acronym">
                  {node.acronym}
                </text>
                <text y={15} className="node-kind">
                  {node.kindLabel}
                </text>
              </g>
            );
          })}
        </g>

        {showLabels && (
          <g className="edge-labels" aria-hidden="true">
            {visibleEdges
              .filter((e) => lit.edges.has(e.id))
              .map((edge) => {
                const from = nodeById.get(edge.from)!;
                const to = nodeById.get(edge.to)!;
                const { index, count } = fan.get(edge.id) ?? { index: 0, count: 1 };
                const { label, length } = edgeGeometry(from, to, index, count);
                const w = edge.label.length * 6.8 + 16;
                // A short edge has no room for its label; the panel names it instead.
                if (length < w + 12) return null;
                return (
                  <g key={edge.id} transform={`translate(${label.x},${label.y})`} className={`edge-label family-${edge.family}`}>
                    <rect x={-w / 2} y={-10} width={w} height={20} rx={10} />
                    <text y={4}>{edge.label}</text>
                  </g>
                );
              })}
          </g>
        )}
      </svg>
    </div>
  );
}
