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
    steps.length <= 1 ? 0 : clamp01((safeCurrentIndex + 1) / steps.length);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">
              Twój plan
            </p>
            <p className="text-xs text-slate-500">Uzupełnij kroki po kolei</p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {safeCurrentIndex + 1} / {steps.length}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <ol className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {steps.map((step, index) => {
            const isDone = index < safeCurrentIndex;
            const isCurrent = index === safeCurrentIndex;
            const canGoTo = Boolean(onGoTo) && index <= safeCurrentIndex;

            const itemClasses = isCurrent
              ? "border-blue-600 bg-blue-600 text-white"
              : isDone
                ? "border-blue-100 bg-blue-50 text-blue-700"
                : "border-[color:var(--border)] bg-white text-slate-500";

            const numberClasses = isCurrent
              ? "bg-white/20 text-white"
              : isDone
                ? "bg-white text-blue-700"
                : "bg-slate-100 text-slate-500";

            const content = (
              <span
                className={[
                  "flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
                  itemClasses,
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    numberClasses,
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {isDone ? "✓" : index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                    Krok {index + 1}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-4">
                    {step.title}
                  </span>
                </span>
              </span>
            );

            return (
              <li key={step.key}>
                {canGoTo ? (
                  <button
                    type="button"
                    onClick={() => onGoTo?.(index)}
                    className="w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {content}
                  </button>
                ) : (
                  <div aria-current={isCurrent ? "step" : undefined}>{content}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
