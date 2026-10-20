import type { ReactElement } from "react";

/** Sticky in-page navigation. Items point at heading ids that already exist on the page. */
export function OnThisPage({ title, items }: { title: string; items: Array<{ id: string; label: string }> }): ReactElement {
  return (
    <nav className="toc" aria-label={title}>
      <p className="toc-title">{title}</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
