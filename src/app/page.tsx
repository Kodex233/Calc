"use client";

import * as React from "react";
import { StepHeader } from "./_components/StepHeader";
import { AppHeader, type AppTab } from "./_components/AppHeader";

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

function buildBar({
  filled,
  filledToken,
  total = 7,
}: {
  filled: number;
  filledToken: string;
  total?: number;
}) {
  const emptyToken = "\u{2B1C}\u{FE0F}"; // ⬜️
  const clampedFilled = Math.min(total, Math.max(0, filled));
  return (
    filledToken.repeat(clampedFilled) + emptyToken.repeat(total - clampedFilled)
  );
}

type PlanSnapshot = {
  id: string;
  createdAt: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  goalLabel: string;
  activity: number;
};

function loadHistory(): PlanSnapshot[] {
  try {
    const raw = localStorage.getItem("calc:history");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PlanSnapshot[];
  } catch {
    return [];
  }
}

function saveHistory(items: PlanSnapshot[]) {
  try {
    localStorage.setItem("calc:history", JSON.stringify(items.slice(0, 30)));
  } catch {
    // ignore
  }
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
  const [isFinished, setIsFinished] = React.useState(false);
  const [tab, setTab] = React.useState<AppTab>("home");

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

  const proteinKcal = proteinG * 4;
  const fatKcal = fatG * 9;
  const carbsKcal = carbsG * 4;

  const maxMacroG = Math.max(1, proteinG, fatG, carbsG);
  const proteinBlocks = proteinG > 0 ? Math.ceil((proteinG / maxMacroG) * 7) : 0;
  const fatBlocks = fatG > 0 ? Math.ceil((fatG / maxMacroG) * 7) : 0;
  const carbsBlocks = carbsG > 0 ? Math.ceil((carbsG / maxMacroG) * 7) : 0;

  const resultsDashboard = (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
        Dashboard Wyników
      </p>

      <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Twoje zapotrzebowanie:
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {targetCalories > 0 ? `${formatInt(targetCalories)} kcal` : "-"}
        </p>
      </div>

      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        Rozkład makroskładników (g):
      </p>

      <div className="mt-3 flex flex-col gap-3 text-sm">
        <div className="flex flex-col gap-1">
          <p className="text-zinc-900 dark:text-zinc-50">
            <span className="font-medium">Białko:</span>{" "}
            {proteinG > 0 ? `${formatInt(proteinG)}g` : "-"}{" "}
            {proteinG > 0 ? `(${formatInt(proteinKcal)} kcal)` : ""}{" "}
            {proteinG > 0 ? "\u2014" : ""}{" "}
            <span className="font-mono tracking-widest">
              {proteinG > 0
                ? buildBar({
                    filled: proteinBlocks,
                    filledToken: "\u{1F7E6}", // 🟦
                  })
                : ""}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-zinc-900 dark:text-zinc-50">
            <span className="font-medium">Tłuszcze:</span>{" "}
            {fatG > 0 ? `${formatInt(fatG)}g` : "-"}{" "}
            {fatG > 0 ? `(${formatInt(fatKcal)} kcal)` : ""}{" "}
            {fatG > 0 ? "\u2014" : ""}{" "}
            <span className="font-mono tracking-widest">
              {fatG > 0
                ? buildBar({
                    filled: fatBlocks,
                    filledToken: "\u{1F7E8}", // 🟨
                  })
                : ""}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-zinc-900 dark:text-zinc-50">
            <span className="font-medium">Węglowodany:</span>{" "}
            {carbsG > 0 ? `${formatInt(carbsG)}g` : "-"}{" "}
            {carbsG > 0 ? `(${formatInt(carbsKcal)} kcal)` : ""}{" "}
            {carbsG > 0 ? "\u2014" : ""}{" "}
            <span className="font-mono tracking-widest">
              {carbsG > 0
                ? buildBar({
                    filled: carbsBlocks,
                    filledToken: "\u{1F7E9}", // 🟩
                  })
                : ""}
            </span>
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        To szybki szacunek na start. Możesz wrócić do kroków i doprecyzować dane.
      </p>
    </div>
  );

  const [history, setHistory] = React.useState<PlanSnapshot[]>([]);

  React.useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function goNext() {
    if (!canGoNext) return;
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  function finish() {
    const snapshot: PlanSnapshot = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      calories: targetCalories,
      proteinG,
      fatG,
      carbsG,
      goalLabel: goalLabel || "-",
      activity,
    };
    const next = [snapshot, ...history];
    setHistory(next);
    saveHistory(next);
    setIsFinished(true);
    setTab("home");
  }

  function reset() {
    setIsFinished(false);
    setStepIndex(0);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans dark:bg-black">
      {isFinished ? (
        <AppHeader
          tab={tab}
          onTabChange={setTab}
          calories={targetCalories}
          proteinG={proteinG}
          fatG={fatG}
          carbsG={carbsG}
        />
      ) : (
        <StepHeader
          steps={steps}
          currentIndex={stepIndex}
          onGoTo={(index) => setStepIndex(index)}
        />
      )}

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-black sm:p-8">
          {isFinished ? (
            <div className="flex flex-col gap-6">
              {tab === "home" ? (
                <div className="flex flex-col gap-4">
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Home
                  </h1>
                  {resultsDashboard}
                  <button
                    type="button"
                    onClick={reset}
                    className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition dark:border-zinc-800 dark:bg-black dark:text-zinc-50"
                  >
                    Zacznij od nowa
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                      History
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Zapisane: {history.length}
                    </p>
                  </div>

                  {history.length === 0 ? (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Brak zapisanych planów. Zakończ kroki, żeby dodać pierwszy.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
                        >
                          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {item.calories > 0
                              ? `${formatInt(item.calories)} kcal`
                              : "-"}{" "}
                            · {item.goalLabel} · {item.activity}%
                          </p>
                          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                            B {formatInt(item.proteinG)}g · T {formatInt(item.fatG)}g ·
                            W {formatInt(item.carbsG)}g
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
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

          {stepIndex >= 1 && stepIndex <= 2 ? (
            <div className="mt-8">{resultsDashboard}</div>
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

                {resultsDashboard}
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

            {stepIndex === steps.length - 1 ? (
              <button
                type="button"
                onClick={finish}
                className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
              >
                Zakończ
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="h-11 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-black dark:hover:bg-white"
              >
                Dalej
              </button>
            )}
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

