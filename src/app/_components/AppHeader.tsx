"use client";

import * as React from "react";
import { IconDumbbell, IconForkKnife, IconHistory, IconHome } from "./Icons";

export type AppTab = "home" | "training" | "meals" | "history";

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

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
  const tabs: Array<{
    id: AppTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "home", label: "Plan", icon: IconHome },
    { id: "training", label: "Trening", icon: IconDumbbell },
    { id: "meals", label: "Posiłki", icon: IconForkKnife },
    { id: "history", label: "Historia", icon: IconHistory },
  ];

  function tabButtonClasses(active: boolean) {
    return [
      "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30",
      active
        ? "bg-white text-slate-950 shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
        : "text-slate-500 hover:text-slate-900",
    ].join(" ");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/72 px-3 py-2.5 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/55">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div className="min-w-0 px-1">
            <p className="text-[17px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
              Plan dnia
            </p>

            <p className="mt-0.5 truncate text-[12px] font-medium text-slate-500">
              {calories > 0 ? `${formatInt(calories)} kcal` : "— kcal"} · B{" "}
              {formatInt(Math.max(0, proteinG))}g · T{" "}
              {formatInt(Math.max(0, fatG))}g · W{" "}
              {formatInt(Math.max(0, carbsG))}g
            </p>
          </div>
        </div>

        <nav
          className="flex w-full items-center gap-1 overflow-x-auto rounded-full bg-slate-200/70 p-1 shadow-inner xl:w-auto xl:overflow-visible"
          aria-label="Główna nawigacja"
        >
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={tabButtonClasses(active)}
                onClick={() => onTabChange(item.id)}
                aria-current={active ? "page" : undefined}
              >
                <Icon
                  className={[
                    "h-[16px] w-[16px]",
                    active ? "text-slate-950" : "text-slate-500",
                  ].join(" ")}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
