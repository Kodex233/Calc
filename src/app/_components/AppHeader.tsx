"use client";

import * as React from "react";
import { IconHistory, IconHome, IconStats } from "./Icons";

export type AppTab = "home" | "history";

export function AppHeader({
  tab,
  onTabChange,
  calories,
  proteinG,
  fatG,
  carbsG,
}: {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}) {
  function tabButtonClasses(active: boolean) {
    return [
      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
      active
        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-black"
        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900/40",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:border-zinc-800/60 dark:bg-black/70">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-zinc-900 p-2 text-white dark:bg-zinc-100 dark:text-black">
              <IconStats className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Statystyki
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {calories > 0 ? `${calories} kcal` : "-"} · B {proteinG || 0}g · T{" "}
                {fatG || 0}g · W {carbsG || 0}g
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={tabButtonClasses(tab === "home")}
              onClick={() => onTabChange("home")}
            >
              <IconHome className="h-4 w-4" />
              Home
            </button>
            <button
              type="button"
              className={tabButtonClasses(tab === "history")}
              onClick={() => onTabChange("history")}
            >
              <IconHistory className="h-4 w-4" />
              History
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

