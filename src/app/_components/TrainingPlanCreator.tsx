"use client";

import * as React from "react";

type TrainingType = "silowy" | "cardio" | "interwal";

const TRAINING_MET: Record<TrainingType, number> = {
  silowy: 6,
  cardio: 7.5,
  interwal: 10,
};

const TRAINING_LABEL: Record<TrainingType, string> = {
  silowy: "Silowy",
  cardio: "Cardio",
  interwal: "Interwal",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

export function TrainingPlanCreator({
  activity,
  weightKg,
}: {
  activity: number;
  weightKg: number;
}) {
  const [trainingType, setTrainingType] = React.useState<TrainingType>("silowy");
  const [sessionMinutes, setSessionMinutes] = React.useState(
    activity >= 70 ? 60 : 45,
  );
  const [sessionsPerWeek, setSessionsPerWeek] = React.useState(
    activity >= 80 ? 5 : activity >= 45 ? 4 : 3,
  );

  const safeWeight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : 70;
  const safeMinutes = clamp(sessionMinutes, 10, 180);
  const safeSessions = clamp(sessionsPerWeek, 1, 7);
  const met = TRAINING_MET[trainingType];

  // kcal = MET * 3.5 * masa(kg) / 200 * min
  const kcalPerSession = Math.round((met * 3.5 * safeWeight * safeMinutes) / 200);
  const kcalPerWeek = kcalPerSession * safeSessions;

  return (
    <section className="glass-panel rounded-[28px] p-5 xl:p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          Training Plan Creator
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Prosty kalkulator treningu
        </h2>
        <p className="text-sm text-slate-600">
          Wybierz typ treningu, czas sesji i liczbe sesji w tygodniu.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(TRAINING_MET) as TrainingType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTrainingType(type)}
            className={[
              "h-11 rounded-xl border px-3 text-sm font-semibold transition",
              trainingType === type
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-[color:var(--border)] bg-white text-slate-900 hover:bg-slate-50",
            ].join(" ")}
          >
            {TRAINING_LABEL[type]}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-900">Czas sesji (min)</span>
          <input
            type="number"
            min={10}
            max={180}
            value={safeMinutes}
            onChange={(event) => setSessionMinutes(Number(event.target.value))}
            className="h-10 rounded-xl border border-[color:var(--border)] bg-white px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-slate-900">Sesje / tydzien</span>
          <input
            type="number"
            min={1}
            max={7}
            value={safeSessions}
            onChange={(event) => setSessionsPerWeek(Number(event.target.value))}
            className="h-10 rounded-xl border border-[color:var(--border)] bg-white px-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            kcal / sesje
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {formatInt(kcalPerSession)}
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
            kcal / tydzien
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {formatInt(kcalPerWeek)}
          </p>
        </article>
      </div>
    </section>
  );
}
