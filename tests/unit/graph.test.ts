import { describe, it, expect } from "vitest";
import { buildGraph, neighborsOf } from "@/lib/graph";
import { entities, relationships, layout } from "@/lib/content";

describe("buildGraph", () => {
  const graph = buildGraph(entities, relationships, layout);

  it("creates one node per entity (17)", () => {
    expect(graph.nodes).toHaveLength(entities.length);
    expect(graph.nodes.length).toBe(17);
  });

  it("creates one edge per relationship (25)", () => {
    expect(graph.edges).toHaveLength(relationships.length);
    expect(graph.edges.length).toBe(25);
  });

  it("places every node inside a zone", () => {
    for (const n of graph.nodes) {
      expect(n.zoneId, `node ${n.id} has no zone`).toBeTruthy();
    }
  });

  it("keeps external nodes in the external zone", () => {
    const external = graph.nodes.filter((n) => n.scope === "external");
    expect(external.length).toBeGreaterThanOrEqual(3);
    for (const n of external) {
      expect(n.zoneId).toContain("external");
    }
  });

  it("computes neighbors for GNSO", () => {
    const gnso = graph.nodes.find((n) => n.id === "gnso");
    expect(gnso).toBeDefined();
    const neigh = neighborsOf("gnso", graph.edges);
    expect(neigh.has("icann-board")).toBe(true);
    expect(neigh.has("empowered-community")).toBe(true);
  });
});
