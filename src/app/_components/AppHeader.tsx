"use client";

import * as React from "react";
import { IconDumbbell, IconForkKnife, IconHistory, IconHome } from "./Icons";

export type AppTab = "home" | "training" | "meals" | "history";

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
      "flex min-h-12 items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold backdrop-blur-xl transition duration-200",
      active
        ? "border-slate-300/95 bg-slate-100/92 text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.14)]"
        : "border-slate-300/75 bg-slate-100/72 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] hover:bg-slate-100/86 hover:text-slate-950",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-1 py-1">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-h-12 items-center">
            <div className="flex flex-col justify-center rounded-xl border border-slate-300/80 bg-slate-100/75 px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <p className="text-sm font-semibold tracking-tight text-slate-950">
                Plan dnia
              </p>
              <p className="text-xs text-slate-600">
                {calories > 0 ? `${calories} kcal` : "-"} | B {proteinG || 0}g | T {fatG || 0}g | W {carbsG || 0}g
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button
              type="button"
              className={tabButtonClasses(tab === "home")}
              onClick={() => onTabChange("home")}
            >
              <IconHome className="h-4.5 w-4.5" />
              Plan
            </button>
            <button
              type="button"
              className={tabButtonClasses(tab === "training")}
              onClick={() => onTabChange("training")}
            >
              <IconDumbbell className="h-4.5 w-4.5" />
              Trening
            </button>
            <button
              type="button"
              className={tabButtonClasses(tab === "meals")}
              onClick={() => onTabChange("meals")}
            >
              <IconForkKnife className="h-4.5 w-4.5" />
              Posiłki
            </button>
            <button
              type="button"
              className={tabButtonClasses(tab === "history")}
              onClick={() => onTabChange("history")}
            >
              <IconHistory className="h-4.5 w-4.5" />
              Historia
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
