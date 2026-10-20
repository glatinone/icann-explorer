/** Pure geometry for the map: edge routing, label placement, and arrow-key navigation between nodes. */

export const NODE_W = 140;
export const NODE_H = 56;

export interface Point {
  x: number;
  y: number;
}

export interface EdgeGeometry {
  d: string;
  label: Point;
  /** Straight-line distance between the visible ends. */
  length: number;
}

/** Where a ray from the center of a node box towards `toward` leaves the box (with some padding). */
function exitPoint(center: Point, toward: Point, pad: number): Point {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  if (dx === 0 && dy === 0) return center;
  const hw = NODE_W / 2 + pad;
  const hh = NODE_H / 2 + pad;
  const t = Math.min(dx === 0 ? Infinity : hw / Math.abs(dx), dy === 0 ? Infinity : hh / Math.abs(dy));
  return { x: center.x + dx * t, y: center.y + dy * t };
}

/**
 * A quadratic curve between two node boxes. Parallel edges between the same pair
 * (`index` of `count`) fan out so they never sit on top of each other.
 */
export function edgeGeometry(from: Point, to: Point, index = 0, count = 1): EdgeGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bend = (index - (count - 1) / 2) * 30;
  const control = { x: (from.x + to.x) / 2 + nx * bend, y: (from.y + to.y) / 2 + ny * bend };
  const start = exitPoint(from, control, 2);
  const end = exitPoint(to, control, 7);
  const r = (n: number): number => Math.round(n * 10) / 10;
  return {
    length: Math.hypot(end.x - start.x, end.y - start.y),
    d: `M${r(start.x)},${r(start.y)} Q${r(control.x)},${r(control.y)} ${r(end.x)},${r(end.y)}`,
    label: {
      x: r(0.25 * start.x + 0.5 * control.x + 0.25 * end.x),
      y: r(0.25 * start.y + 0.5 * control.y + 0.25 * end.y),
    },
  };
}

/** Groups edges by unordered node pair and returns each edge's index within its group. */
export function parallelIndex<E extends { id: string; from: string; to: string }>(
  edges: E[],
): Map<string, { index: number; count: number }> {
  const groups = new Map<string, E[]>();
  for (const e of edges) {
    const key = [e.from, e.to].sort().join("|");
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  const out = new Map<string, { index: number; count: number }>();
  for (const group of groups.values()) {
    group.forEach((e, i) => {
      // Keep the fan direction stable regardless of which end the edge starts from.
      const flipped = e.from > e.to;
      const index = flipped ? group.length - 1 - i : i;
      out.set(e.id, { index, count: group.length });
    });
  }
  return out;
}

export type Direction = "up" | "down" | "left" | "right";

/** The nearest node in a direction, favoring nodes that are roughly in line. */
export function nearestInDirection<N extends Point & { id: string }>(
  nodes: N[],
  fromId: string,
  direction: Direction,
): N | undefined {
  const from = nodes.find((n) => n.id === fromId);
  if (!from) return undefined;
  let best: N | undefined;
  let bestScore = Infinity;
  for (const n of nodes) {
    if (n.id === fromId) continue;
    const dx = n.x - from.x;
    const dy = n.y - from.y;
    const along = direction === "left" ? -dx : direction === "right" ? dx : direction === "up" ? -dy : dy;
    const across = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
    if (along <= 0) continue;
    const score = along + across * 2;
    if (score < bestScore) {
      bestScore = score;
      best = n;
    }
  }
  return best;
}
