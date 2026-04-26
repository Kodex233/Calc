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
    <article className="rounded-[24px] border border-[color:var(--border)] bg-white/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div
            className={[
              "inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
              chipClass,
            ].join(" ")}
          >
            {shortLabel}
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{formatInt(kcal)} kcal</p>
        </div>

        <div className="text-right">
          <p className={["text-3xl font-bold tracking-tight", accentClass].join(" ")}>
            {formatInt(grams)}g
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            {formatPercent(percent)}%
          </p>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
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
    <section className="glass-panel overflow-hidden rounded-[32px]">
      <div className="border-b border-[color:var(--border)] px-6 py-6">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              Makro
            </p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Bilans kalorii i makroskladnikow
            </h3>
          </div>

          <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
              Kalorie
            </p>
            <p className="mt-3 text-4xl font-bold tracking-tight">
              {calories > 0 ? formatInt(calories) : "-"}
            </p>
            <p className="mt-1 text-xs text-slate-300">kcal / dzien</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
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

        <div className="mt-5 rounded-[24px] border border-[color:var(--border)] bg-slate-50/85 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-sm font-semibold text-slate-900">Udzial energii</p>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                B {formatPercent(proteinPercent)}%
              </span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                T {formatPercent(fatPercent)}%
              </span>
              <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                W {formatPercent(carbsPercent)}%
              </span>
            </div>
          </div>

          <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-white shadow-inner">
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
      </div>
    </section>
  );
}
