"use client";

import Image from "next/image";
import * as React from "react";

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function SegmentBar({
  filled,
  total = 7,
  colorClass,
}: {
  filled: number;
  total?: number;
  colorClass: string;
}) {
  const safeFilled = Math.min(total, Math.max(0, filled));

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={[
            "h-2.5 w-7 rounded-full",
            index < safeFilled ? colorClass : "bg-slate-200",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function MacroRow({
  label,
  iconSrc,
  grams,
  kcal,
  filled,
  colorClass,
  iconBgClass,
}: {
  label: string;
  iconSrc: string;
  grams: number;
  kcal: number;
  filled: number;
  colorClass: string;
  iconBgClass: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={[
              "flex h-10 w-10 items-center justify-center rounded-2xl",
              iconBgClass,
            ].join(" ")}
          >
            <Image src={iconSrc} alt="" width={22} height={22} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-0.5 text-xs text-slate-600">
              {formatInt(grams)}g ({formatInt(kcal)} kcal)
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <SegmentBar filled={filled} colorClass={colorClass} />
          <p className="text-[11px] font-semibold text-slate-500">{filled}/7</p>
        </div>
      </div>
    </div>
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

  const maxMacroG = Math.max(1, proteinG, fatG, carbsG);
  const proteinBlocks =
    proteinG > 0 ? Math.ceil((proteinG / maxMacroG) * 7) : 0;
  const fatBlocks = fatG > 0 ? Math.ceil((fatG / maxMacroG) * 7) : 0;
  const carbsBlocks = carbsG > 0 ? Math.ceil((carbsG / maxMacroG) * 7) : 0;

  return (
    <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Dashboard wyników
          </p>
          <p className="mt-1 text-xs text-slate-500">Twoje zapotrzebowanie</p>
        </div>

        <div className="rounded-2xl bg-blue-600 px-4 py-2 text-white">
          <p className="text-[11px] font-semibold opacity-90">kcal</p>
          <p className="text-2xl font-bold leading-6 tracking-tight">
            {calories > 0 ? formatInt(calories) : "-"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">Rozkład makroskładników (g):</p>

      <div className="mt-3 grid grid-cols-1 gap-3">
        <MacroRow
          label="Białko"
          iconSrc="/icons/protein.svg"
          grams={proteinG}
          kcal={proteinKcal}
          filled={proteinBlocks}
          colorClass="bg-blue-500"
          iconBgClass="bg-blue-50"
        />
        <MacroRow
          label="Tłuszcze"
          iconSrc="/icons/fat.svg"
          grams={fatG}
          kcal={fatKcal}
          filled={fatBlocks}
          colorClass="bg-amber-400"
          iconBgClass="bg-amber-50"
        />
        <MacroRow
          label="Węglowodany"
          iconSrc="/icons/carbs.svg"
          grams={carbsG}
          kcal={carbsKcal}
          filled={carbsBlocks}
          colorClass="bg-emerald-500"
          iconBgClass="bg-emerald-50"
        />
      </div>

      <p className="mt-4 text-xs text-slate-500">
        To szybki szacunek na start. Możesz wrócić do kroków i doprecyzować dane.
      </p>
    </section>
  );
}
