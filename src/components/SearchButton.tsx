"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import SearchDialog from "./SearchDialog";
import type { Locale } from "@/i18n";

export default function SearchButton({ locale }: { locale: Locale }): ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" className="search-button" onClick={() => setOpen(true)}>
        {locale === "id" ? "Cari" : "Search"} <kbd>Ctrl K</kbd>
      </button>
      <SearchDialog locale={locale} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
