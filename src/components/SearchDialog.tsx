"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import MiniSearch from "minisearch";
import { buildSearchIndex } from "@/lib/search";
import type { Locale } from "@/i18n";

interface Hit {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  score: number;
}

export default function SearchDialog({
  locale,
  open,
  onClose,
}: {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}): ReactElement | null {
  const [index, setIndex] = useState<MiniSearch | null>(null);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !index) {
      setIndex(buildSearchIndex(locale));
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, locale, index]);

  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent): void => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, onClose]);

  if (!open) return null;

  const results: Hit[] =
    q.trim() && index
      ? (index.search(q, { boost: { title: 2 }, fuzzy: 0.2 }) as unknown as Hit[]).slice(0, 10)
      : [];

  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={locale === "id" ? "Cari" : "Search"}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="search"
          autoFocus
          placeholder={locale === "id" ? "Cari kelompok dan istilah" : "Search groups and terms"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter" && results.length > 0) {
              window.location.assign(results[0].url);
            }
          }}
          aria-label={locale === "id" ? "Cari" : "Search"}
        />
        <ul className="search-results">
          {q.trim() && results.length === 0 && <li className="search-empty">{locale === "id" ? "Tidak ada hasil" : "No results"}</li>}
          {results.map((r) => (
            <li key={r.id}>
              <a href={r.url} onClick={onClose}>
                <strong>{r.title}</strong>
                <span className="search-subtitle">{r.subtitle}</span>
              </a>
            </li>
          ))}
          {!q.trim() && (
            <li className="search-empty">
              {locale === "id" ? "Coba: GNSO, ALAC, gTLD, PDP, Fellowship" : "Try: GNSO, ALAC, gTLD, PDP, Fellowship"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
