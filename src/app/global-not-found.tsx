import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type { ReactElement } from "react";
import "../globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata = { title: "404 · ICANN Explorer" };

/** Served as 404.html for unknown paths. The locale is unknown here, so the page is bilingual. */
export default function GlobalNotFound(): ReactElement {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/en/" className="brand">
              <span className="brand-mark" aria-hidden="true" />
              <span className="brand-name">ICANN Explorer</span>
              <span className="brand-note">Independent, unofficial educational project</span>
            </Link>
          </div>
        </header>
        <main id="main">
          <div className="page not-found">
            <p className="eyebrow">404</p>
            <h1>
              Halaman tidak ditemukan <span lang="en">· Page not found</span>
            </h1>
            <p>Alamat ini tidak ada di situs ini. · This address does not exist on this site.</p>
            <div className="actions" style={{ marginTop: "var(--s-6)" }}>
              <Link className="button button-primary" href="/id/">
                Kembali ke awal
              </Link>
              <Link className="button" href="/en/" lang="en">
                Back to the start
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
