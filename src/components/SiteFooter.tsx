import type { ReactElement } from "react";
import { lastReviewed } from "@/lib/content";
import { formatDate, t, type Locale } from "@/i18n";
import { repoUrl } from "@/i18n/config";

export function SiteFooter({ locale }: { locale: Locale }): ReactElement {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="footer-disclaimer">{t(locale, "footer.disclaimer")}</p>
        <ul className="footer-meta">
          <li>{t(locale, "footer.reviewed", { date: formatDate(locale, lastReviewed) })}</li>
          <li>
            <a href={`${repoUrl}/issues/new?template=content-error.yml`}>{t(locale, "footer.report")}</a>
          </li>
          <li>
            <a href={repoUrl}>{t(locale, "footer.code")}</a>
          </li>
          <li>{t(locale, "footer.license")}</li>
        </ul>
      </div>
    </footer>
  );
}
