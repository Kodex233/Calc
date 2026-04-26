"use client";

import * as React from "react";
import { get, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { StepHeader } from "./_components/StepHeader";
import { AppHeader, type AppTab } from "./_components/AppHeader";
import { ResultsPlanner } from "./_components/ResultsPlanner";

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
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {htmlFor ? (
        <label className="text-sm font-medium text-slate-900" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="text-sm font-medium text-slate-900">{label}</span>
      )}
      {children}
    </div>
  );
}

function inputClasses() {
  return "h-11 w-full rounded-xl border border-[color:var(--border)] bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
}

function pillClasses(active: boolean) {
  return [
    "h-11 w-full rounded-xl border px-3 text-sm font-semibold shadow-sm transition",
    active
      ? "border-blue-600 bg-blue-600 text-white"
      : "border-[color:var(--border)] bg-white text-slate-900 hover:bg-slate-50",
  ].join(" ");
}

type HistoryEntry = {
  id: string;
  createdAt: string;
  title: string;
};

const HISTORY_KEY = "calc:history";
const CLIENT_ID_KEY = "calc:client-id";
const MAX_HISTORY_ITEMS = 30;

function buildHistoryTitle(calories: number, goalLabel: string, activity: number) {
  const caloriesLabel = calories > 0 ? `${formatInt(calories)} kcal` : "-";
  return `${caloriesLabel} | ${goalLabel || "-"} | ${activity}%`;
}

function toHistoryEntry(value: unknown, fallbackId: string): HistoryEntry | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  const id =
    typeof item.id === "string" && item.id.length > 0 ? item.id : fallbackId;
  const createdAt =
    typeof item.createdAt === "string"
      ? item.createdAt
      : new Date(0).toISOString();

  if (typeof item.title === "string" && item.title.trim().length > 0) {
    return {
      id,
      createdAt,
      title: item.title,
    };
  }

  const calories = Math.round(toFiniteNumber(item.calories));
  const goalLabel =
    typeof item.goalLabel === "string" && item.goalLabel.length > 0
      ? item.goalLabel
      : "-";
  const activity = Math.round(toFiniteNumber(item.activity));

  return {
    id,
    createdAt,
    title: buildHistoryTitle(calories, goalLabel, activity),
  };
}

function loadLocalHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item, index) => toHistoryEntry(item, `local-${index}`))
      .filter((item): item is HistoryEntry => item !== null)
      .slice(0, MAX_HISTORY_ITEMS);
  } catch {
    return [];
  }
}

function saveLocalHistory(items: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
  } catch {
    // ignore
  }
}

function getOrCreateClientId() {
  try {
    const saved = localStorage.getItem(CLIENT_ID_KEY);
    if (saved) return saved;

    const created = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function toFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function plansRef(clientId: string) {
  return ref(db, `clients/${clientId}/plans`);
}

function historyRef(clientId: string) {
  return ref(db, `history/${clientId}/plans`);
}

function parsePlansSnapshot(snapshotValue: unknown): HistoryEntry[] {
  if (!snapshotValue || typeof snapshotValue !== "object") return [];

  return Object.entries(snapshotValue as Record<string, unknown>)
    .map(([id, value]) => toHistoryEntry(value, id))
    .filter((item): item is HistoryEntry => item !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_HISTORY_ITEMS);
}

async function loadCloudHistory(clientId: string): Promise<HistoryEntry[]> {
  const historySnapshot = await get(historyRef(clientId));
  if (historySnapshot.exists()) {
    const parsed = parsePlansSnapshot(historySnapshot.val() as unknown);
    if (parsed.length > 0) return parsed;
  }

  const plansSnapshot = await get(plansRef(clientId));
  if (!plansSnapshot.exists()) return [];
  return parsePlansSnapshot(plansSnapshot.val() as unknown);
}

async function saveCloudHistoryItem(clientId: string, item: HistoryEntry) {
  const cloudPayload: HistoryEntry = {
    id: item.id,
    createdAt: item.createdAt,
    title: item.title,
  };

  await Promise.allSettled([
    set(ref(db, `clients/${clientId}/plans/${item.id}`), cloudPayload),
    set(ref(db, `history/${clientId}/plans/${item.id}`), cloudPayload),
  ]);
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
      ? "Odchudzanie"
      : goal === "utrzymac"
        ? "Utrzymanie"
        : goal === "miesnie"
          ? "Budowanie mięśni"
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

  const resultsPlanner =
    goal !== "" ? (
      <ResultsPlanner
        goal={goal}
        goalLabel={goalLabel}
        activity={activity}
        activityLabel={activityLabel}
        calories={targetCalories}
        proteinG={proteinG}
        fatG={fatG}
        carbsG={carbsG}
      />
    ) : null;

  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const clientIdRef = React.useRef<string>("");

  React.useEffect(() => {
    const localHistory = loadLocalHistory();
    setHistory(localHistory);

    const clientId = getOrCreateClientId();
    clientIdRef.current = clientId;

    let cancelled = false;

    async function syncHistoryFromCloud() {
      try {
        const cloudHistory = await loadCloudHistory(clientId);
        if (cancelled) return;

        if (cloudHistory.length > 0) {
          setHistory(cloudHistory);
          saveLocalHistory(cloudHistory);
          void Promise.allSettled(
            cloudHistory.map((item) => saveCloudHistoryItem(clientId, item)),
          );
          return;
        }

        if (localHistory.length > 0) {
          await Promise.all(
            localHistory.map((item) => saveCloudHistoryItem(clientId, item)),
          );
        }
      } catch {
        // keep local fallback
      }
    }

    void syncHistoryFromCloud();

    return () => {
      cancelled = true;
    };
  }, []);

  function goNext() {
    if (!canGoNext) return;
    setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStepIndex((s) => Math.max(0, s - 1));
  }

  function finish() {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: buildHistoryTitle(targetCalories, goalLabel || "-", activity),
    };
    const next = [entry, ...history];
    setHistory(next);
    saveLocalHistory(next);

    const clientId = clientIdRef.current || getOrCreateClientId();
    clientIdRef.current = clientId;
    void saveCloudHistoryItem(clientId, entry);

    setIsFinished(true);
    setTab("home");
  }

  function reset() {
    setIsFinished(false);
    setStepIndex(0);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-transparent font-sans">
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
        <div className="rounded-3xl border border-[color:var(--border)] bg-white p-6 shadow-sm sm:p-8">
          {isFinished ? (
            <div className="flex flex-col gap-6">
              {tab === "home" ? (
                <div className="flex flex-col gap-4">
                  <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                    Home
                  </h1>
                  {resultsPlanner}
                  <button
                    type="button"
                    onClick={reset}
                    className="h-11 rounded-xl border border-[color:var(--border)] bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    Zacznij od nowa
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                      History
                    </h1>
                    <p className="text-xs text-slate-500">
                      Zapisane: {history.length}
                    </p>
                  </div>

                  {history.length === 0 ? (
                    <p className="text-sm text-slate-600">
                      Brak zapisanych planów. Zakończ kroki, żeby dodać pierwszy.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-4 shadow-sm"
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {item.title}
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
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Krok 1: Twoje Dane
                </h1>
                <p className="mt-1 text-sm text-slate-600">
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

                <Field label="Wiek" htmlFor="age">
                  <input
                    id="age"
                    className={inputClasses()}
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="np. 28"
                    aria-invalid={age.length > 0 && !Number.isFinite(ageNum)}
                  />
                </Field>

                <Field label="Waga (kg)" htmlFor="weight">
                  <input
                    id="weight"
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
                <p className="text-sm text-slate-500">
                  Uzupełnij dane (wiek 10-100, waga 30-250), aby przejść dalej.
                </p>
              ) : null}
            </div>
          ) : null}

          {stepIndex === 1 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Krok 2: Cel
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Wybierz kierunek planu: redukcja, utrzymanie albo rozbudowa.
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
                  Odchudzanie
                </button>
                <button
                  type="button"
                  className={[
                    pillClasses(goal === "utrzymac"),
                    "min-h-24 px-4 text-base",
                  ].join(" ")}
                  onClick={() => setGoal("utrzymac")}
                >
                  Utrzymanie
                </button>
                <button
                  type="button"
                  className={[
                    pillClasses(goal === "miesnie"),
                    "min-h-24 px-4 text-base",
                  ].join(" ")}
                  onClick={() => setGoal("miesnie")}
                >
                  Budowanie mięśni
                </button>
              </div>
            </div>
          ) : null}

          {stepIndex === 2 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Krok 3: Aktywność
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Suwak od &quot;Kanapowiec&quot; do &quot;Sportowiec&quot;.
                </p>
              </div>

              <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">
                    {activityLabel}
                  </p>
                  <p className="text-xs text-slate-600">
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

                <div className="mt-3 flex justify-between text-xs text-slate-600">
                  <span>Kanapowiec</span>
                  <span>Sportowiec</span>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                Szacunek utrzymania:{" "}
                <span className="font-medium text-slate-900">
                  {maintenanceCalories > 0
                    ? `${formatInt(maintenanceCalories)} kcal`
                    : "-"}
                </span>{" "}
                ({format1(activityKcalPerKg)} kcal/kg).
              </p>
            </div>
          ) : null}

          {stepIndex >= 1 && stepIndex <= 2 && resultsPlanner ? (
            <div className="mt-8">{resultsPlanner}</div>
          ) : null}

          {stepIndex === 3 ? (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Wynik: Twój Plan
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Orientacyjny plan na podstawie wybranych kroków.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-[color:var(--border)] bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-900">
                    Podsumowanie
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Płeć</dt>
                      <dd className="font-medium text-slate-900">
                        {sexLabel || "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Wiek</dt>
                      <dd className="font-medium text-slate-900">
                        {Number.isFinite(ageNum) ? `${formatInt(ageNum)} lat` : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Waga</dt>
                      <dd className="font-medium text-slate-900">
                        {Number.isFinite(weightNum)
                          ? `${format1(weightNum)} kg`
                          : "-"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Cel</dt>
                      <dd className="font-medium text-slate-900">
                        {goalLabel || "-"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500">
                        Aktywność
                      </dt>
                      <dd className="font-medium text-slate-900">
                        {activityLabel} ({activity}%)
                      </dd>
                    </div>
                  </dl>
                </div>

                {resultsPlanner}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={stepIndex === 0}
              className="h-11 rounded-xl border border-[color:var(--border)] bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Wstecz
            </button>

            {stepIndex === steps.length - 1 ? (
              <button
                type="button"
                onClick={finish}
                className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Zakończ
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

