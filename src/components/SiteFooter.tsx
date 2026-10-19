import type { ReactElement } from "react";
import { t, feedbackUrl, type Locale } from "@/i18n";
import { latestReviewDate } from "@/lib/content";

export function SiteFooter({ locale }: { locale: Locale }): ReactElement {
  const date = latestReviewDate();
  return (
    <footer className="site-footer">
      <p className="footer-disclaimer">{t(locale, "footer.disclaimer")}</p>
      <p className="footer-reviewed">{t(locale, "footer.lastReviewed").replace("{date}", date)}</p>
      <nav aria-label={locale === "id" ? "Tautan footer" : "Footer links"}>
        <a href="https://github.com/glatinone/icann-explorer">{t(locale, "footer.github")}</a>
        <a href={feedbackUrl}>{locale === "id" ? "Kirim masukan" : "Give feedback"}</a>
        <a
          href={`https://github.com/glatinone/icann-explorer/issues/new?template=content-error.yml&title=${encodeURIComponent("[Content error] ")}`}
        >
          {t(locale, "footer.reportError")}
        </a>
      </nav>
    </footer>
  );
}
