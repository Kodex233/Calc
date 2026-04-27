"use client";

import * as React from "react";

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function MacroCard({
  label,
  shortLabel,
  grams,
  kcal,
  percent,
  accentClass,
  chipClass,
  barClass,
}: {
  label: string;
  shortLabel: string;
  grams: number;
  kcal: number;
  percent: number;
  accentClass: string;
  chipClass: string;
  barClass: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50/75 p-4">
      <div className="flex items-center justify-between gap-3">
        <span
          className={[
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]",
            chipClass,
          ].join(" ")}
        >
          {shortLabel}
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {formatPercent(percent)}%
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{formatInt(kcal)} kcal</p>

      <div className="mt-2 flex items-end justify-between gap-3">
        <p className={["text-2xl font-bold tracking-tight", accentClass].join(" ")}>
          {formatInt(grams)}g
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={["h-full rounded-full", barClass].join(" ")}
          style={{ width: `${clampPercent(percent)}%` }}
        />
      </div>
    </article>
  );
}

export function ResultsDashboard({
  calories,
  proteinG,
  fatG,
  carbsG,
}: {
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}) {
  const proteinKcal = Math.max(0, proteinG) * 4;
  const fatKcal = Math.max(0, fatG) * 9;
  const carbsKcal = Math.max(0, carbsG) * 4;
  const macroCalories = Math.max(1, proteinKcal + fatKcal + carbsKcal);

  const proteinPercent = (proteinKcal / macroCalories) * 100;
  const fatPercent = (fatKcal / macroCalories) * 100;
  const carbsPercent = (carbsKcal / macroCalories) * 100;

  return (
    <section className="rounded-[26px] border border-[color:var(--border)] bg-white p-5 shadow-sm xl:p-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Makro
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
            Bilans kalorii i makroskladnikow
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
            Kalorie
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight">
            {calories > 0 ? formatInt(calories) : "-"}
          </p>
          <p className="text-xs text-slate-300">kcal / dzien</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <MacroCard
          label="Bialko"
          shortLabel="B"
          grams={proteinG}
          kcal={proteinKcal}
          percent={proteinPercent}
          accentClass="text-blue-700"
          chipClass="bg-blue-50 text-blue-700"
          barClass="bg-blue-600"
        />
        <MacroCard
          label="Tluszcze"
          shortLabel="T"
          grams={fatG}
          kcal={fatKcal}
          percent={fatPercent}
          accentClass="text-amber-600"
          chipClass="bg-amber-50 text-amber-700"
          barClass="bg-amber-500"
        />
        <MacroCard
          label="Weglowodany"
          shortLabel="W"
          grams={carbsG}
          kcal={carbsKcal}
          percent={carbsPercent}
          accentClass="text-emerald-700"
          chipClass="bg-emerald-50 text-emerald-700"
          barClass="bg-emerald-600"
        />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Udzial energii</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="rounded-full bg-white px-3 py-1">
              B {formatPercent(proteinPercent)}%
            </span>
            <span className="rounded-full bg-white px-3 py-1">
              T {formatPercent(fatPercent)}%
            </span>
            <span className="rounded-full bg-white px-3 py-1">
              W {formatPercent(carbsPercent)}%
            </span>
          </div>
        </div>

        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="bg-blue-600"
            style={{ width: `${clampPercent(proteinPercent)}%` }}
          />
          <div
            className="bg-amber-500"
            style={{ width: `${clampPercent(fatPercent)}%` }}
          />
          <div
            className="bg-emerald-600"
            style={{ width: `${clampPercent(carbsPercent)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
