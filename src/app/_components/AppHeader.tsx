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
        ? "bg-blue-600 text-white"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
              <IconStats className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                Statystyki
              </p>
              <p className="text-xs text-slate-500">
                {calories > 0 ? `${calories} kcal` : "-"} | B {proteinG || 0}g | T{" "}
                {fatG || 0}g | W {carbsG || 0}g
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
