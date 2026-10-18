import type { ReactElement } from "react";
import { t, type Locale } from "@/i18n";

export function SiteFooter({ locale }: { locale: Locale }): ReactElement {
  return (
    <footer className="site-footer">
      <p className="footer-disclaimer">{t(locale, "footer.disclaimer")}</p>
      <nav aria-label={locale === "id" ? "Tautan footer" : "Footer links"}>
        <a href="https://github.com/glatinone/icann-explorer">{t(locale, "footer.github")}</a>
        <a
          href={`https://github.com/glatinone/icann-explorer/issues/new?template=content-error.yml&title=${encodeURIComponent("[Content error] ")}`}
        >
          {t(locale, "footer.reportError")}
        </a>
      </nav>
    </footer>
  );
}
