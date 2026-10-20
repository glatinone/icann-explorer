import { describe, expect, it } from "vitest";
import { edgeGeometry, nearestInDirection, NODE_H, NODE_W, parallelIndex } from "@/lib/geometry";

const P = { x: { x: 0, y: 0 }, y: { x: 300, y: 0 } };

describe("edgeGeometry", () => {
  it("starts and ends on the node borders, not the centers", () => {
    const { d } = edgeGeometry({ x: 0, y: 0 }, { x: 400, y: 0 });
    const [start, , end] = d.match(/-?\d+(\.\d+)?,-?\d+(\.\d+)?/g)!.map((p) => Number(p.split(",")[0]));
    expect(start).toBeCloseTo(NODE_W / 2 + 2);
    expect(end).toBeCloseTo(400 - NODE_W / 2 - 7);
  });

  it("fans parallel edges to opposite sides", () => {
    const a = edgeGeometry({ x: 0, y: 0 }, { x: 0, y: 300 }, 0, 2);
    const b = edgeGeometry({ x: 0, y: 0 }, { x: 0, y: 300 }, 1, 2);
    expect(Math.sign(a.label.x)).toBe(-Math.sign(b.label.x));
    expect(Math.abs(a.label.y - 150)).toBeLessThan(NODE_H);
  });
});

describe("parallelIndex", () => {
  it("counts edges between the same pair in either direction", () => {
    const fan = parallelIndex([
      { id: "a", from: "x", to: "y" },
      { id: "b", from: "y", to: "x" },
      { id: "c", from: "x", to: "z" },
    ]);
    expect(fan.get("a")?.count).toBe(2);
    expect(fan.get("b")?.count).toBe(2);
    // Opposite directions, so the curves must still land on different sides.
    const a = edgeGeometry(P.x, P.y, fan.get("a")!.index, 2);
    const b = edgeGeometry(P.y, P.x, fan.get("b")!.index, 2);
    expect(a.label.y).not.toBeCloseTo(b.label.y);
    expect(fan.get("c")).toEqual({ index: 0, count: 1 });
  });
});

describe("nearestInDirection", () => {
  const nodes = [
    { id: "center", x: 0, y: 0 },
    { id: "right", x: 200, y: 10 },
    { id: "far-right", x: 400, y: 0 },
    { id: "up", x: 0, y: -150 },
    { id: "diagonal", x: 120, y: -140 },
  ];
  it("prefers the closest node roughly in line", () => {
    expect(nearestInDirection(nodes, "center", "right")?.id).toBe("right");
    expect(nearestInDirection(nodes, "center", "up")?.id).toBe("up");
  });
  it("returns nothing when no node lies that way", () => {
    expect(nearestInDirection(nodes, "center", "left")).toBeUndefined();
  });
});
