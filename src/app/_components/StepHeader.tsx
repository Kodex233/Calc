"use client";

import * as React from "react";

export type StepHeaderStep = {
  key: string;
  title: string;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function StepHeader({
  steps,
  currentIndex,
  onGoTo,
}: {
  steps: StepHeaderStep[];
  currentIndex: number;
  onGoTo?: (index: number) => void;
}) {
  const safeCurrentIndex = Math.min(
    Math.max(0, currentIndex),
    Math.max(0, steps.length - 1),
  );

  const progress =
    steps.length <= 1 ? 0 : clamp01(safeCurrentIndex / (steps.length - 1));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-sm font-black text-[color:var(--accent)]">
              TP
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Twój plan
              </p>
              <p className="text-xs text-slate-500">Prosty kalkulator celu</p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Krok {safeCurrentIndex + 1}/{steps.length}
          </span>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-slate-200" />
          <div
            className="absolute left-0 top-4 h-1 rounded-full bg-[color:var(--accent)]"
            style={{ width: `${progress * 100}%` }}
          />

          <ol className="relative flex items-start justify-between gap-2">
            {steps.map((step, index) => {
              const isDone = index < safeCurrentIndex;
              const isCurrent = index === safeCurrentIndex;
              const canGoTo = Boolean(onGoTo) && index <= safeCurrentIndex;

              const circleClasses = isCurrent
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
                : isDone
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-500";

              const labelClasses = isCurrent
                ? "text-slate-900"
                : isDone
                  ? "text-slate-700"
                  : "text-slate-500";

              const content = (
                <span className="flex max-w-[7.5rem] flex-col items-center gap-2 text-center sm:max-w-none sm:flex-row sm:items-start sm:text-left">
                  <span
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                      circleClasses,
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <span
                    className={[
                      "text-xs font-medium leading-4 sm:text-sm",
                      labelClasses,
                    ].join(" ")}
                  >
                    {step.title}
                  </span>
                </span>
              );

              return (
                <li key={step.key} className="flex-1">
                  {canGoTo ? (
                    <button
                      type="button"
                      onClick={() => onGoTo?.(index)}
                      className="w-full rounded-xl p-1 text-left transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {content}
                    </button>
                  ) : (
                    <div
                      className="w-full rounded-xl p-1"
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </header>
  );
}
