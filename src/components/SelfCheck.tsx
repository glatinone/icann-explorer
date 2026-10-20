"use client";

import { useId, useState } from "react";
import type { ReactElement } from "react";

export function SelfCheck({
  title,
  question,
  options,
  answerIndex,
  explanation,
  correct,
  incorrect,
}: {
  title: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  correct: string;
  incorrect: string;
}): ReactElement {
  const [picked, setPicked] = useState<number | null>(null);
  const name = useId();
  const answered = picked !== null;
  return (
    <fieldset className="self-check">
      <legend>
        <span className="group-label">{title}</span>
        <span className="self-check-question">{question}</span>
      </legend>
      {options.map((option, i) => (
        <label
          key={i}
          className={answered ? (i === answerIndex ? "is-answer" : i === picked ? "is-wrong" : undefined) : undefined}
        >
          <input type="radio" name={name} checked={picked === i} onChange={() => setPicked(i)} />
          {option}
        </label>
      ))}
      <p className="self-check-result" aria-live="polite">
        {answered && (
          <>
            <b>{picked === answerIndex ? correct : incorrect}</b> {explanation}
          </>
        )}
      </p>
    </fieldset>
  );
}
