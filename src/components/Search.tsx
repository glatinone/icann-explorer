"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, ReactElement } from "react";
import type { Locale } from "@/i18n/config";
import { createIndex, searchIds, type SearchIndex } from "@/lib/search";
import type { SearchDoc } from "@/lib/search-docs";

interface Labels {
  open: string;
  label: string;
  placeholder: string;
  empty: string;
  hint: string;
  loading: string;
  entity: string;
  term: string;
  path: string;
}

let cache: Promise<{ docs: Map<string, SearchDoc>; index: SearchIndex }> | null = null;

function loadIndex(): Promise<{ docs: Map<string, SearchDoc>; index: SearchIndex }> {
  cache ??= fetch("/search-index.json")
    .then((r) => r.json() as Promise<SearchDoc[]>)
    .then((docs) => ({ docs: new Map(docs.map((d) => [d.id, d])), index: createIndex(docs) }));
  return cache;
}

export function Search({ locale, labels }: { locale: Locale; labels: Labels }): ReactElement {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<{ docs: Map<string, SearchDoc>; index: SearchIndex } | null>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const open = useCallback((): void => {
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    loadIndex().then(setData, () => (cache = null));
  }, []);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent): void => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const results = useMemo(() => {
    if (!data) return [];
    return searchIds(data.index, q)
      .map((id) => data.docs.get(id))
      .filter((d): d is SearchDoc => Boolean(d));
  }, [data, q]);

  const go = (doc: SearchDoc): void => {
    dialogRef.current?.close();
    setQ("");
    router.push(`/${locale}${doc.path}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  const typeLabel = { entity: labels.entity, term: labels.term, path: labels.path };

  return (
    <>
      <button type="button" className="search-button" onClick={open} aria-haspopup="dialog">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span>{labels.open}</span>
        <kbd>Ctrl K</kbd>
      </button>
      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label={labels.label}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="search-box">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
            aria-label={labels.label}
            placeholder={labels.placeholder}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          <ul id="search-results" role="listbox" className="search-results">
            {results.map((doc, i) => (
              <li
                key={doc.id}
                id={`sr-${doc.id}`}
                role="option"
                aria-selected={i === active}
                className={i === active ? "active" : undefined}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(doc)}
              >
                <span className="sr-type">{typeLabel[doc.type]}</span>
                <span className="sr-title">
                  {doc.acronym && doc.acronym !== doc.title[locale] ? <b>{doc.acronym}</b> : null} {doc.title[locale]}
                </span>
                <span className="sr-summary">{doc.summary[locale]}</span>
              </li>
            ))}
          </ul>
          <p className="search-status" aria-live="polite">
            {!data ? labels.loading : q.trim() && results.length === 0 ? labels.empty.replace("{q}", q.trim()) : q.trim() ? "" : labels.hint}
          </p>
        </div>
      </dialog>
    </>
  );
}
