import type { Metadata } from "next";
import type { ReactElement } from "react";
import { MapExplorer } from "@/components/map/MapExplorer";
import type { MapData } from "@/components/map/types";
import { entities, entitiesByKind, getSource, layout, relationships } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { FAMILIES, RELATIONSHIPS } from "@/lib/relationships";
import { t, toLocale, type Locale } from "@/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return pageMetadata(locale, "/map/", { title: t(locale, "map.title"), description: t(locale, "map.lede") });
}

function mapData(locale: Locale): MapData {
  const right = Math.max(...layout.zones.map((z) => z.x + z.w));
  const bottom = Math.max(...layout.zones.map((z) => z.y + z.h));
  return {
    locale,
    width: right + 20,
    height: bottom + 20,
    zones: layout.zones.map((z) => ({ ...z, label: z.label[locale], caption: z.caption?.[locale] })),
    nodes: entities.map((e) => ({
      id: e.id,
      acronym: e.acronym,
      name: e.name[locale],
      kind: e.kind,
      kindLabel: t(locale, `kind.${e.kind}`),
      scope: e.scope,
      oneLiner: e.oneLiner.text[locale],
      ...layout.positions[e.id],
    })),
    edges: relationships.map((r) => ({
      id: r.id,
      from: r.from,
      to: r.to,
      type: r.type,
      family: RELATIONSHIPS[r.type].family,
      label: RELATIONSHIPS[r.type].label[locale],
      inverse: RELATIONSHIPS[r.type].inverse[locale],
      explanation: r.explanation.text[locale],
      interpretation: r.explanation.kind === "interpretation",
      sources: r.explanation.citations.flatMap((c) => {
        const s = getSource(c.sourceId);
        return s ? [{ title: s.title, locator: c.locator, url: s.url }] : [];
      }),
    })),
    groups: entitiesByKind().map((g) => ({ label: t(locale, `group.${g.kind}`), ids: g.entities.map((e) => e.id) })),
    labels: {
      views: t(locale, "map.views"),
      viewMap: t(locale, "map.view.map"),
      viewList: t(locale, "map.view.list"),
      viewTable: t(locale, "map.view.table"),
      filters: t(locale, "map.filters"),
      hint: t(locale, "map.hint"),
      close: t(locale, "map.close"),
      connections: t(locale, "map.connections"),
      noConnections: t(locale, "map.noConnections"),
      openProfile: t(locale, "map.openProfile"),
      node: t(locale, "map.node"),
      selected: t(locale, "map.selected"),
      relationship: t(locale, "map.relationship"),
      from: t(locale, "map.table.from"),
      type: t(locale, "map.table.type"),
      to: t(locale, "map.table.to"),
      explanation: t(locale, "map.table.explanation"),
      count: t(locale, "map.table.count"),
      interpretation: t(locale, "claim.interpretation"),
      families: Object.fromEntries(
        FAMILIES.map((f) => [f, { name: t(locale, `family.${f}`), description: t(locale, `familyDesc.${f}`) }]),
      ) as MapData["labels"]["families"],
    },
  };
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const locale = toLocale((await params).locale);
  return (
    <div className="map-page">
      <header className="page-head map-head">
        <h1>{t(locale, "map.title")}</h1>
        <p className="lede">{t(locale, "map.lede")}</p>
      </header>
      <MapExplorer data={mapData(locale)} />
    </div>
  );
}
