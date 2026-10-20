"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";

export function NavLinks({ items, label }: { items: Array<{ href: string; label: string }>; label: string }): ReactElement {
  const pathname = usePathname();
  return (
    <nav className="site-nav" aria-label={label}>
      <ul>
        {items.map((item) => {
          const current = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={current ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
