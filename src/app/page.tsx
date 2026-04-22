"use client";

import * as React from "react";
import { StepHeader } from "./_components/StepHeader";

type Sex = "kobieta" | "mezczyzna";
type Goal = "schudnac" | "utrzymac" | "miesnie";

function numberOrNaN(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function format1(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 1 }).format(
    value,
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </span>
      {children}
    </label>
  );
}

function inputClasses() {
  return "h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10";
}

function pillClasses(active: boolean) {
  return [
    "h-11 w-full rounded-xl border px-3 text-sm font-medium shadow-sm transition",
    active
      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-black"
      : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:border-zinc-700",
  ].join(" ");
}

export default function Home() {
  const steps = React.useMemo(
    () => [
      { key: "dane", title: "Twoje Dane" },
      { key: "cel", title: "Cel" },
      { key: "aktywnosc", title: "Aktywność" },
      { key: "wynik", title: "Twój Plan" },
    ],
    [],
  );

  const [stepIndex, setStepIndex] = React.useState(0);

  const [sex, setSex] = React.useState<Sex | "">("");
  const [age, setAge] = React.useState("");
  const [weight, setWeight] = React.useState("");

  const sexLabel =
    sex === "kobieta" ? "Kobieta" : sex === "mezczyzna" ? "Mężczyzna" : "";

  const [goal, setGoal] = React.useState<Goal | "">("");
  const [activity, setActivity] = React.useState(35);

  const goalLabel =
    goal === "schudnac"
      ? "Chcę Schudnąć"
      : goal === "utrzymac"
        ? "Chcę Utrzymać"
        : goal === "miesnie"
          ? "Chcę Zbudować Mięśnie"
          : "";

  const ageNum = numberOrNaN(age);
  const weightNum = numberOrNaN(weight);

  const step1Valid =
    sex !== "" &&
    Number.isFinite(ageNum) &&
    ageNum >= 10 &&
    ageNum <= 100 &&
    Number.isFinite(weightNum) &&
    weightNum >= 30 &&
    weightNum <= 250;

  const step2Valid = goal !== "";

  const step3Valid = activity >= 0 && activity <= 100;

  const canGoNext =
    (stepIndex === 0 && step1Valid) ||
    (stepIndex === 1 && step2Valid) ||
    (stepIndex === 2 && step3Valid) ||
    stepIndex >= 3;

  const activityLabel =
    activity < 20
      ? "Kanapowiec"
      : activity < 60
        ? "Umiarkowanie"
        : "Sportowiec";

  const activityKcalPerKg = 25 + (activity / 100) * 10; // 25..35 kcal/kg (szacunek)
  const maintenanceCalories =
    Number.isFinite(weightNum) && weightNum > 0
      ? Math.round(weightNum * activityKcalPerKg)
      : 0;

  const goalMultiplier =
    goal === "schudnac" ? 0.85 : goal === "miesnie" ? 1.1 : 1.0;

  const targetCalories = Math.round(maintenanceCalories * goalMultiplier);

  const proteinPerKg =
    goal === "schudnac" ? 2.0 : goal === "miesnie" ? 1.8 : 1.9;
  const fatPerKg = 0.8;

  const proteinG = Math.round(
    Number.isFinite(weightNum) ? weightNum * proteinPerKg : 0,
  );
  const fatG = Math.round(Number.isFinite(weightNum) ? weightNum * fatPerKg : 0);
  const carbsG = Math.max(
    0,
    Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4),
  );

  function goNext() {
    if (!canGoNext) return;
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-black">
      <StepHeader
        steps={steps}
        currentIndex={stepIndex}
        onGoTo={(index) => setStepIndex(index)}
      />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-8">
          {stepIndex === 0 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Krok 1: Twoje Dane
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Płeć, wiek i waga - to wystarczy na start.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="Płeć">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={pillClasses(sex === "kobieta")}
                      onClick={() => setSex("kobieta")}
                    >
                      Kobieta
                    </button>
                    <button
                      type="button"
                      className={pillClasses(sex === "mezczyzna")}
                      onClick={() => setSex("mezczyzna")}
                    >
                      Mężczyzna
                    </button>
                  </div>
                </Field>

                <Field label="Wiek">
                  <input
                    className={inputClasses()}
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="np. 28"
                    aria-invalid={age.length > 0 && !Number.isFinite(ageNum)}
                  />
                </Field>

                <Field label="Waga (kg)">
                  <input
                    className={inputClasses()}
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="np. 74,5"
                    aria-invalid={
                      weight.length > 0 && !Number.isFinite(weightNum)
                    }
                  />
                </Field>
              </div>

              {!step1Valid ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Uzupełnij dane (wiek 10-100, waga 30-250), aby przejść dalej.
                </p>
              ) : null}
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Krok 2: Cel
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Wybierz cel: -15%, 0% lub +10% kalorii.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  className={[
                    pillClasses(goal === "schudnac"),
                    "min-h-24 px-4 text-base",
                  ].join(" ")}
                  onClick={() => setGoal("schudnac")}
                >
                  Chcę Schudnąć
                </button>
                <button
                  type="button"
                  className={[
                    pillClasses(goal === "utrzymac"),
                    "min-h-24 px-4 text-base",
                  ].join(" ")}
                  onClick={() => setGoal("utrzymac")}
                >
                  Chcę Utrzymać
                </button>
                <button
                  type="button"
                  className={[
                    pillClasses(goal === "miesnie"),
                    "min-h-24 px-4 text-base",
                  ].join(" ")}
                  onClick={() => setGoal("miesnie")}
                >
                  Chcę Zbudować Mięśnie
                </button>
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Krok 3: Aktywność
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Suwak od "Kanapowiec" do "Sportowiec".
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {activityLabel}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {activity}%
                  </p>
                </div>

                <input
                  className="mt-4 w-full"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={activity}
                  onChange={(e) => setActivity(Number(e.target.value))}
                  aria-label="Poziom aktywności"
                />

                <div className="mt-3 flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                  <span>Kanapowiec</span>
                  <span>Sportowiec</span>
                </div>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Szacunek utrzymania:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {maintenanceCalories > 0
                    ? `${formatInt(maintenanceCalories)} kcal`
                    : "-"}
                </span>{" "}
                ({format1(activityKcalPerKg)} kcal/kg).
              </p>
            </div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Wynik: Twój Plan
                </h1>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Orientacyjny plan na podstawie wybranych kroków.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Podsumowanie
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">Płeć</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {sexLabel || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">Wiek</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {Number.isFinite(ageNum) ? `${formatInt(ageNum)} lat` : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">Waga</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {Number.isFinite(weightNum)
                          ? `${format1(weightNum)} kg`
                          : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-zinc-500 dark:text-zinc-400">Cel</dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {goalLabel || "-"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-zinc-500 dark:text-zinc-400">
                        Aktywność
                      </dt>
                      <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                        {activityLabel} ({activity}%)
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Propozycja dzienna
                  </p>
                  <div className="mt-3 flex flex-col gap-2 text-sm">
                    <p className="flex items-baseline justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Kalorie
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {targetCalories > 0 ? `${formatInt(targetCalories)} kcal` : "-"}
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Białko
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {proteinG > 0 ? `${formatInt(proteinG)} g` : "-"}
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Tłuszcze
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {fatG > 0 ? `${formatInt(fatG)} g` : "-"}
                      </span>
                    </p>
                    <p className="flex items-baseline justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Węgle
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {carbsG > 0 ? `${formatInt(carbsG)} g` : "-"}
                      </span>
                    </p>
                  </div>
                  <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
                    To szybki szacunek na start - możesz doprecyzować dane i wrócić
                    do kroków.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
            >
              Wstecz
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext || stepIndex === steps.length - 1}
              className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
            >
              {stepIndex === steps.length - 2 ? "Zobacz plan" : "Dalej"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

