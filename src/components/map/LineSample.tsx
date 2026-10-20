import type { ReactElement } from "react";
import { FAMILY_STYLE, type RelationshipFamily } from "@/lib/relationships";

/** A short line in a family's style, for legends and filters. */
export function LineSample({ family }: { family: RelationshipFamily }): ReactElement {
  const style = FAMILY_STYLE[family];
  return (
    <svg className={`line-sample family-${family}`} width="34" height="12" viewBox="0 0 34 12" aria-hidden="true">
      <line
        x1="1"
        y1="6"
        x2={style.marker === "none" ? 33 : 25}
        y2="6"
        strokeWidth={Math.min(style.width, 3)}
        strokeDasharray={style.dash || undefined}
      />
      {style.marker === "triangle" && <path d="M24,1.5 L33,6 L24,10.5 z" className="fill" />}
      {style.marker === "chevron" && <path d="M25,1.5 L33,6 L25,10.5" className="open" />}
      {style.marker === "diamond" && <path d="M22,6 L27.5,2 L33,6 L27.5,10 z" className="fill" />}
      {style.marker === "circle" && <circle cx="29" cy="6" r="3.5" className="fill" />}
    </svg>
  );
}
