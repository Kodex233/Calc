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
    <header className="sticky top-0 z-50 w-full px-4 pb-2 pt-3 backdrop-blur-md">
      <div className="mx-auto w-full max-w-[1500px] rounded-2xl bg-white/95 px-4 py-3 shadow-[0_1px_8px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">Tworzenie planu</p>
          <p className="rounded-full bg-[#F2F2F7] px-2.5 py-1 text-xs font-semibold text-slate-700">
            Krok {safeCurrentIndex + 1} z {steps.length}
          </p>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E5E5EA]">
          <div
            className="h-full rounded-full bg-[#0A84FF] transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <ol className="mt-3 flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const isDone = index < safeCurrentIndex;
            const isCurrent = index === safeCurrentIndex;
            const canGoTo = Boolean(onGoTo) && index <= safeCurrentIndex;

            const chipClasses = isCurrent
              ? "bg-[#0A84FF] text-white"
              : isDone
                ? "bg-[#EAF3FF] text-[#0A63C9]"
                : "bg-[#F2F2F7] text-slate-500";

            const content = (
              <span
                className={[
                  "inline-flex h-9 items-center rounded-full px-3 text-sm font-semibold transition",
                  chipClasses,
                ].join(" ")}
              >
                {index + 1}. {step.title}
              </span>
            );

            return (
              <li key={step.key}>
                {canGoTo ? (
                  <button
                    type="button"
                    onClick={() => onGoTo?.(index)}
                    className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A84FF]/35"
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
