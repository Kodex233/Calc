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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-zinc-800/60 dark:bg-black/70">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Twój Plan
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Krok {safeCurrentIndex + 1}/{steps.length}
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-4 h-px bg-zinc-200 dark:bg-zinc-800" />
          <div
            className="absolute left-0 top-4 h-px bg-zinc-900 dark:bg-zinc-100"
            style={{ width: `${progress * 100}%` }}
          />

          <ol className="relative flex items-start justify-between gap-2">
            {steps.map((step, index) => {
              const isDone = index < safeCurrentIndex;
              const isCurrent = index === safeCurrentIndex;
              const canGoTo = Boolean(onGoTo) && index <= safeCurrentIndex;

              const circleClasses = isCurrent
                ? "border-zinc-900 bg-white text-zinc-900 dark:border-zinc-100 dark:bg-black dark:text-zinc-50"
                : isDone
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black"
                  : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-black dark:text-zinc-500";

              const labelClasses = isCurrent
                ? "text-zinc-900 dark:text-zinc-50"
                : isDone
                  ? "text-zinc-700 dark:text-zinc-200"
                  : "text-zinc-500 dark:text-zinc-400";

              const content = (
                <span className="flex max-w-[7.5rem] flex-col items-center gap-2 text-center sm:max-w-none sm:flex-row sm:items-start sm:text-left">
                  <span
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
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
                      className="group w-full rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-black"
                      aria-current={isCurrent ? "step" : undefined}
                    >
                      {content}
                    </button>
                  ) : (
                    <div
                      className="w-full p-1"
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

