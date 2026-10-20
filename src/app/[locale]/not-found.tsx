import Link from "next/link";
import type { ReactElement } from "react";

/** Locale is unknown here, so this page is bilingual. */
export default function NotFound(): ReactElement {
  return (
    <div className="page not-found">
      <h1>
        Halaman tidak ditemukan <span lang="en">· Page not found</span>
      </h1>
      <p>
        <Link href="/id/">Kembali ke awal</Link> · <Link href="/en/" lang="en">Back to the start</Link>
      </p>
    </div>
  );
}
