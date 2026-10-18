import type { ReactElement } from "react";
import MapClient from "./MapClient";

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }): Promise<ReactElement> {
  const { locale: loc } = await params;
  const locale = loc === "en" ? "en" : "id";
  return <MapClient locale={locale} />;
}
