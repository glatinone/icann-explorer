import type { ReactElement } from "react";
import { getSource } from "@/lib/content";
import type { Note, Notes } from "@/lib/notes";
import type { Source } from "@/lib/schema";
import { formatDate, t, type Locale } from "@/i18n";

/**
 * The numbered source list at the bottom of a page, grouped by document so a source cited
 * twenty times is named once. Render it after everything that calls `notes.cite`.
 */
export function NotesList({ notes, locale }: { notes: Notes; locale: Locale }): ReactElement | null {
  const groups = new Map<string, { source: Source; notes: Note[] }>();
  for (const note of notes.list) {
    const source = getSource(note.citation.sourceId);
    if (!source) continue;
    const group = groups.get(source.id) ?? { source, notes: [] };
    group.notes.push(note);
    groups.set(source.id, group);
  }
  if (groups.size === 0) return null;

  return (
    <section className="notes" aria-labelledby="notes-title">
      <h2 id="notes-title">{t(locale, "notes.title")}</h2>
      {[...groups.values()].map(({ source, notes: list }) => (
        <div key={source.id} className="note-source">
          <p className="note-source-head">
            <a href={source.url} rel="noopener noreferrer" target="_blank" className="note-title">
              {source.title}
            </a>
            <span className="note-meta">
              {source.publisher}
              {source.version ? `, ${source.version}` : ""}
            </span>
          </p>
          <ol>
            {list.map(({ n, citation }) => (
              <li key={n} id={`note-${n}`} value={n}>
                {citation.url ? (
                  <a href={citation.url} rel="noopener noreferrer" target="_blank">
                    {citation.locator}
                  </a>
                ) : (
                  citation.locator
                )}
                <span className="note-date">
                  {" "}
                  · {t(locale, "notes.verified", { date: formatDate(locale, citation.verifiedAt) })}
                </span>
                {citation.quote && (
                  <q className="note-quote" lang="en">
                    {citation.quote}
                  </q>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
