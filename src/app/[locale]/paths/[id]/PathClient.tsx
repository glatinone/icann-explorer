"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { LearningPath } from "@/lib/schema";

interface Check {
  question: { en: string; id: string };
  options: Array<{ en: string; id: string }>;
  answerIndex: number;
  explanation: { en: string; id: string };
}

export default function PathClient({ locale, path }: { locale: "id" | "en"; path: LearningPath }): ReactElement {
  const [stepIndex, setStepIndex] = useState(0);
  const storageKey = `icann-explorer-progress-${path.id}`;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setStepIndex(Math.max(0, Math.min(Number(saved), path.steps.length - 1)));
    } catch {
      // localStorage blocked: fine
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path.id]);

  const step = path.steps[stepIndex];

  const goto = (delta: number): void => {
    const clamped = Math.max(0, Math.min(stepIndex + delta, path.steps.length - 1));
    setStepIndex(clamped);
    try {
      window.localStorage.setItem(storageKey, String(clamped));
    } catch {
      // ignore
    }
  };

  const t = (en: string, idn: string) => (locale === "id" ? idn : en);

  return (
    <div className="path-stepper">
      <p className="path-progress-label">
        {locale === "id" ? "Langkah" : "Step"} {stepIndex + 1} / {path.steps.length}
      </p>
      <ol className="path-progress" aria-label={locale === "id" ? "Langkah-langkah" : "Steps"}>
        {path.steps.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#step-${i + 1}`}
              aria-current={i === stepIndex ? "step" : undefined}
              className={i === stepIndex ? "current" : ""}
              onClick={(e) => {
                e.preventDefault();
                setStepIndex(i);
              }}
            >
              {i + 1}
            </a>
          </li>
        ))}
      </ol>

      <section className="path-step" aria-labelledby="step-title">
        <h2 id="step-title">
          {stepIndex + 1}. {step.title[locale]}
        </h2>
        <p>{step.body[locale]}</p>

        {step.links.length > 0 && (
          <div className="path-links">
            {step.links.map((link) => {
              if (link.type === "entity") {
                return (
                  <a key={`e-${link.id}`} className="chip-link" href={`/${locale}/organizations/${link.id}/`}>
                    {link.id.toUpperCase()}
                  </a>
                );
              }
              if (link.type === "term") {
                return (
                  <a key={`t-${link.id}`} className="chip-link" href={`/${locale}/glossary/#term-${link.id}`}>
                    {link.id}
                  </a>
                );
              }
              return null;
            })}
          </div>
        )}

        {step.check && <SelfCheck locale={locale} check={step.check} />}

        <div className="path-nav">
          <button type="button" disabled={stepIndex === 0} onClick={() => goto(-1)}>
            {t("Previous", "Sebelumnya")}
          </button>
          {stepIndex < path.steps.length - 1 ? (
            <button type="button" className="button-primary" onClick={() => goto(1)}>
              {t("Next", "Lanjut")}
            </button>
          ) : (
            <p className="path-done">{t("Done! Try another path.", "Selesai! Coba jalur lain.")}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function SelfCheck({ check, locale }: { locale: "id" | "en"; check: Check }): ReactElement {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="self-check">
      <p>
        <strong>{check.question[locale]}</strong>
      </p>
      <div className="self-check-options">
        {check.options.map((opt, i) => (
          <button key={i} type="button" className={picked === i ? "picked" : ""} onClick={() => setPicked(i)}>
            {opt[locale]}
          </button>
        ))}
      </div>
      {picked !== null && (
        <p className="self-check-result">
          {picked === check.answerIndex ? "✓" : "✗"} {check.explanation[locale]}
        </p>
      )}
    </div>
  );
}
