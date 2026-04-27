"use client";

import * as React from "react";

type IntakeEntry = {
  id: string;
  label: string;
  kcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  createdAt: string;
};

type TrainingType = "silowy" | "cardio" | "interwal";

type TrainingDoneEntry = {
  id: string;
  type: TrainingType;
  minutes: number;
  kcal: number;
  createdAt: string;
};

const TRAINING_MET: Record<TrainingType, number> = {
  silowy: 6,
  cardio: 7.5,
  interwal: 10,
};

const TRAINING_LABEL: Record<TrainingType, string> = {
  silowy: "Siłowy",
  cardio: "Cardio",
  interwal: "Interwał",
};

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function parseInputNumber(value: string) {
  if (value.trim().length === 0) return 0;
  const normalized = value.replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function clampMinZero(value: number) {
  return Math.max(0, Math.round(value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function progressPercent(current: number, target: number) {
  if (target <= 0) return 0;
  return clamp((current / target) * 100, 0, 100);
}

function SummaryCard({
  label,
  value,
  suffix = "kcal",
  tone = "default",
}: {
  label: string;
  value: string;
  suffix?: string;
  tone?: "default" | "blue" | "green" | "red";
}) {
  const color =
    tone === "blue"
      ? "text-[#007AFF]"
      : tone === "green"
        ? "text-emerald-600"
        : tone === "red"
          ? "text-rose-600"
          : "text-slate-950";

  return (
    <article className="rounded-[22px] bg-white px-4 py-4">
      <p className="text-[13px] font-medium tracking-[-0.02em] text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1.5">
        <p
          className={[
            "text-[30px] font-bold leading-none tracking-[-0.055em]",
            color,
          ].join(" ")}
        >
          {value}
        </p>

        {suffix ? (
          <p className="pb-1 text-[13px] font-semibold tracking-[-0.02em] text-slate-400">
            {suffix}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function MacroRow({
  label,
  consumed,
  target,
  colorClass,
}: {
  label: string;
  consumed: number;
  target: number;
  colorClass: string;
}) {
  const percent = progressPercent(consumed, target);

  return (
    <div className="px-4 py-3.5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[15px] font-medium tracking-[-0.02em] text-slate-950">
          {label}
        </p>

        <p className="text-[14px] font-semibold tracking-[-0.02em] text-slate-500">
          {formatInt(consumed)} / {formatInt(target)} g
        </p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E5EA]">
        <div
          className={["h-full rounded-full", colorClass].join(" ")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function StepperRow({
  label,
  value,
  suffix,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const safeValue = clamp(value, min, max);

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[16px] font-medium tracking-[-0.02em] text-slate-950">
          {label}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(clamp(safeValue - step, min, max))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F7] text-[22px] font-medium leading-none text-[#007AFF] transition active:bg-[#E5E5EA]"
          >
            −
          </button>

          <div className="min-w-[76px] rounded-full bg-[#F2F2F7] px-3 py-1.5 text-center text-[14px] font-semibold tracking-[-0.02em] text-slate-950">
            {safeValue} {suffix}
          </div>

          <button
            type="button"
            onClick={() => onChange(clamp(safeValue + step, min, max))}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F7] text-[20px] font-medium leading-none text-[#007AFF] transition active:bg-[#E5E5EA]"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

function IOSInput({
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      type="text"
      inputMode={inputMode}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-[14px] bg-[#F2F2F7] px-3 text-[15px] font-medium tracking-[-0.02em] text-slate-950 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#007AFF]/20"
    />
  );
}

export function DailyIntakeTracker({
  storageKey,
  targetCalories,
  targetProteinG,
  targetFatG,
  targetCarbsG,
  activity,
  weightKg,
  showTrainingControls = true,
  showMealEntry = true,
}: {
  storageKey: string;
  targetCalories: number;
  targetProteinG: number;
  targetFatG: number;
  targetCarbsG: number;
  activity: number;
  weightKg: number;
  showTrainingControls?: boolean;
  showMealEntry?: boolean;
}) {
  const [entries, setEntries] = React.useState<IntakeEntry[]>([]);
  const [trainingType, setTrainingType] = React.useState<TrainingType>("silowy");
  const [sessionMinutes, setSessionMinutes] = React.useState(
    activity >= 70 ? 60 : 45,
  );
  const [sessionsPerWeek, setSessionsPerWeek] = React.useState(
    activity >= 80 ? 5 : activity >= 45 ? 4 : 3,
  );
  const [doneTrainings, setDoneTrainings] = React.useState<TrainingDoneEntry[]>(
    [],
  );

  const [label, setLabel] = React.useState("");
  const [kcal, setKcal] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [carbs, setCarbs] = React.useState("");

  const trainingStateKey = `${storageKey}:training`;

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        setEntries([]);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        setEntries([]);
        return;
      }

      const mapped = parsed
        .map((item, index) => {
          if (!item || typeof item !== "object") return null;

          const record = item as Record<string, unknown>;

          return {
            id:
              typeof record.id === "string" && record.id.length > 0
                ? record.id
                : `entry-${index}`,
            label:
              typeof record.label === "string" && record.label.length > 0
                ? record.label
                : "Posiłek",
            kcal:
              typeof record.kcal === "number" && Number.isFinite(record.kcal)
                ? clampMinZero(record.kcal)
                : 0,
            proteinG:
              typeof record.proteinG === "number" &&
              Number.isFinite(record.proteinG)
                ? clampMinZero(record.proteinG)
                : 0,
            fatG:
              typeof record.fatG === "number" && Number.isFinite(record.fatG)
                ? clampMinZero(record.fatG)
                : 0,
            carbsG:
              typeof record.carbsG === "number" && Number.isFinite(record.carbsG)
                ? clampMinZero(record.carbsG)
                : 0,
            createdAt:
              typeof record.createdAt === "string"
                ? record.createdAt
                : new Date(0).toISOString(),
          } satisfies IntakeEntry;
        })
        .filter((item): item is IntakeEntry => item !== null);

      setEntries(mapped);
    } catch {
      setEntries([]);
    }
  }, [storageKey]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(trainingStateKey);

      if (!raw) {
        setDoneTrainings([]);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!parsed || typeof parsed !== "object") {
        setDoneTrainings([]);
        return;
      }

      const value = parsed as Record<string, unknown>;

      const restoredType =
        value.trainingType === "silowy" ||
        value.trainingType === "cardio" ||
        value.trainingType === "interwal"
          ? value.trainingType
          : "silowy";

      const restoredMinutes =
        typeof value.sessionMinutes === "number" &&
        Number.isFinite(value.sessionMinutes)
          ? clamp(value.sessionMinutes, 10, 180)
          : activity >= 70
            ? 60
            : 45;

      const restoredSessions =
        typeof value.sessionsPerWeek === "number" &&
        Number.isFinite(value.sessionsPerWeek)
          ? clamp(value.sessionsPerWeek, 1, 14)
          : activity >= 80
            ? 5
            : activity >= 45
              ? 4
              : 3;

      const done = Array.isArray(value.doneTrainings)
        ? value.doneTrainings
            .map((item, index) => {
              if (!item || typeof item !== "object") return null;

              const record = item as Record<string, unknown>;

              const parsedType =
                record.type === "silowy" ||
                record.type === "cardio" ||
                record.type === "interwal"
                  ? record.type
                  : "silowy";

              return {
                id:
                  typeof record.id === "string" && record.id.length > 0
                    ? record.id
                    : `done-${index}`,
                type: parsedType,
                minutes:
                  typeof record.minutes === "number" &&
                  Number.isFinite(record.minutes)
                    ? clamp(record.minutes, 1, 300)
                    : 0,
                kcal:
                  typeof record.kcal === "number" && Number.isFinite(record.kcal)
                    ? clampMinZero(record.kcal)
                    : 0,
                createdAt:
                  typeof record.createdAt === "string"
                    ? record.createdAt
                    : new Date(0).toISOString(),
              } satisfies TrainingDoneEntry;
            })
            .filter((item): item is TrainingDoneEntry => item !== null)
        : [];

      setTrainingType(restoredType);
      setSessionMinutes(restoredMinutes);
      setSessionsPerWeek(restoredSessions);
      setDoneTrainings(done);
    } catch {
      setDoneTrainings([]);
    }
  }, [trainingStateKey, activity]);

  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
    } catch {
      // ignore storage errors
    }
  }, [entries, storageKey]);

  React.useEffect(() => {
    const payload = {
      trainingType,
      sessionMinutes: clamp(sessionMinutes, 10, 180),
      sessionsPerWeek: clamp(sessionsPerWeek, 1, 14),
      doneTrainings,
    };

    try {
      localStorage.setItem(trainingStateKey, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [
    trainingType,
    sessionMinutes,
    sessionsPerWeek,
    doneTrainings,
    trainingStateKey,
  ]);

  const consumed = React.useMemo(
    () =>
      entries.reduce(
        (acc, entry) => ({
          kcal: acc.kcal + entry.kcal,
          proteinG: acc.proteinG + entry.proteinG,
          fatG: acc.fatG + entry.fatG,
          carbsG: acc.carbsG + entry.carbsG,
        }),
        { kcal: 0, proteinG: 0, fatG: 0, carbsG: 0 },
      ),
    [entries],
  );

  const safeWeight = Number.isFinite(weightKg) && weightKg > 0 ? weightKg : 70;
  const safeMinutes = clamp(sessionMinutes, 10, 180);
  const safeSessions = clamp(sessionsPerWeek, 1, 14);
  const met = TRAINING_MET[trainingType];

  const kcalPerSession = Math.round(
    (met * 3.5 * safeWeight * safeMinutes) / 200,
  );

  const plannedWeeklyTrainingKcal = kcalPerSession * safeSessions;

  const trainingAddedCalories = doneTrainings.reduce(
    (sum, entry) => sum + entry.kcal,
    0,
  );

  const adjustedTargetCalories = targetCalories + trainingAddedCalories;

  const baseMacroCalories = Math.max(
    1,
    targetProteinG * 4 + targetFatG * 9 + targetCarbsG * 4,
  );

  const proteinRatio = (targetProteinG * 4) / baseMacroCalories;
  const fatRatio = (targetFatG * 9) / baseMacroCalories;
  const carbsRatio = (targetCarbsG * 4) / baseMacroCalories;

  const addedProteinG = Math.round((trainingAddedCalories * proteinRatio) / 4);
  const addedFatG = Math.round((trainingAddedCalories * fatRatio) / 9);
  const addedCarbsG = Math.round((trainingAddedCalories * carbsRatio) / 4);

  const adjustedTargetProtein = targetProteinG + Math.max(0, addedProteinG);
  const adjustedTargetFat = targetFatG + Math.max(0, addedFatG);
  const adjustedTargetCarbs = targetCarbsG + Math.max(0, addedCarbsG);

  const remaining = {
    kcal: adjustedTargetCalories - consumed.kcal,
    proteinG: adjustedTargetProtein - consumed.proteinG,
    fatG: adjustedTargetFat - consumed.fatG,
    carbsG: adjustedTargetCarbs - consumed.carbsG,
  };

  function addEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: IntakeEntry = {
      id: crypto.randomUUID(),
      label: label.trim().length > 0 ? label.trim() : "Posiłek",
      kcal: clampMinZero(parseInputNumber(kcal)),
      proteinG: clampMinZero(parseInputNumber(protein)),
      fatG: clampMinZero(parseInputNumber(fat)),
      carbsG: clampMinZero(parseInputNumber(carbs)),
      createdAt: new Date().toISOString(),
    };

    const hasAnyValue =
      next.kcal > 0 || next.proteinG > 0 || next.fatG > 0 || next.carbsG > 0;

    if (!hasAnyValue) return;

    setEntries((current) => [next, ...current]);
    setLabel("");
    setKcal("");
    setProtein("");
    setFat("");
    setCarbs("");
  }

  function addCompletedTraining() {
    const done: TrainingDoneEntry = {
      id: crypto.randomUUID(),
      type: trainingType,
      minutes: safeMinutes,
      kcal: kcalPerSession,
      createdAt: new Date().toISOString(),
    };

    setDoneTrainings((current) => [done, ...current]);
  }

  function removeCompletedTraining(id: string) {
    setDoneTrainings((current) => current.filter((entry) => entry.id !== id));
  }

  function removeEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  function clearEntries() {
    setEntries([]);
    setDoneTrainings([]);
  }

  const remainingTone = remaining.kcal >= 0 ? "green" : "red";

  return (
    <section className="rounded-[32px] bg-[#F2F2F7] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4 px-1 pb-4">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#007AFF]">
            Dzisiaj
          </p>

          <h3 className="mt-1 text-[32px] font-bold leading-none tracking-[-0.055em] text-slate-950">
            {showTrainingControls ? "Bilans dnia" : "Posiłki"}
          </h3>

          <p className="mt-2 text-[15px] leading-5 tracking-[-0.02em] text-slate-500">
            Sprawdź ile zostało do celu.
          </p>
        </div>

        <button
          type="button"
          onClick={clearEntries}
          className="rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold tracking-[-0.02em] text-[#FF3B30] transition active:scale-[0.98] active:bg-[#E5E5EA]"
        >
          Wyczyść
        </button>
      </div>

      {showTrainingControls ? (
        <div className="mb-4">
          <div className="rounded-[18px] bg-[#E5E5EA] p-1">
            <div className="grid grid-cols-3 gap-1">
              {(Object.keys(TRAINING_MET) as TrainingType[]).map((type) => {
                const active = trainingType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTrainingType(type)}
                    className={[
                      "h-9 rounded-[14px] text-[14px] font-semibold tracking-[-0.02em] transition-all duration-150",
                      active
                        ? "bg-white text-slate-950 shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
                        : "text-slate-600 active:bg-slate-300/60",
                    ].join(" ")}
                  >
                    {TRAINING_LABEL[type]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-[22px] bg-white">
            <StepperRow
              label="Czas sesji"
              value={safeMinutes}
              suffix="min"
              min={10}
              max={180}
              step={5}
              onChange={setSessionMinutes}
            />

            <div className="ml-4 h-px bg-[#E5E5EA]" />

            <StepperRow
              label="Sesje w tygodniu"
              value={safeSessions}
              suffix="x"
              min={1}
              max={14}
              step={1}
              onChange={setSessionsPerWeek}
            />
          </div>

          <div className="mt-3 rounded-[22px] bg-white px-4 py-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium tracking-[-0.02em] text-slate-500">
                  Trening
                </p>

                <div className="mt-1 flex items-end gap-1.5">
                  <p className="text-[34px] font-bold leading-none tracking-[-0.06em] text-slate-950">
                    {formatInt(kcalPerSession)}
                  </p>
                  <p className="pb-1 text-[14px] font-semibold tracking-[-0.02em] text-slate-500">
                    kcal / sesję
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addCompletedTraining}
                className="rounded-full bg-[#007AFF] px-4 py-2 text-[14px] font-semibold tracking-[-0.02em] text-white transition active:scale-[0.98] active:bg-blue-700"
              >
                Dodaj
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#F2F2F7] px-3 py-1.5 text-[13px] font-semibold tracking-[-0.02em] text-slate-600">
                Plan: {safeSessions}x / tydz.
              </span>

              <span className="rounded-full bg-[#F2F2F7] px-3 py-1.5 text-[13px] font-semibold tracking-[-0.02em] text-slate-600">
                {formatInt(plannedWeeklyTrainingKcal)} kcal / tydz.
              </span>

              <span className="rounded-full bg-[#F2F2F7] px-3 py-1.5 text-[13px] font-semibold tracking-[-0.02em] text-slate-600">
                Zrobione: {doneTrainings.length}
              </span>
            </div>
          </div>

          {doneTrainings.length > 0 ? (
            <div className="mt-3 overflow-hidden rounded-[22px] bg-white">
              {doneTrainings.map((entry, index) => (
                <React.Fragment key={entry.id}>
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div>
                      <p className="text-[15px] font-medium tracking-[-0.02em] text-slate-950">
                        {TRAINING_LABEL[entry.type]}
                      </p>
                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.02em] text-slate-500">
                        {entry.minutes} min · {formatInt(entry.kcal)} kcal
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCompletedTraining(entry.id)}
                      className="text-[14px] font-semibold tracking-[-0.02em] text-[#FF3B30]"
                    >
                      Usuń
                    </button>
                  </div>

                  {index < doneTrainings.length - 1 ? (
                    <div className="ml-4 h-px bg-[#E5E5EA]" />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard label="Cel" value={formatInt(targetCalories)} />

        <SummaryCard
          label="Po treningu"
          value={formatInt(adjustedTargetCalories)}
          tone="blue"
        />

        <SummaryCard label="Zjedzone" value={formatInt(consumed.kcal)} />

        <SummaryCard
          label={remaining.kcal >= 0 ? "Zostało" : "Ponad cel"}
          value={
            remaining.kcal >= 0
              ? formatInt(remaining.kcal)
              : `+${formatInt(Math.abs(remaining.kcal))}`
          }
          tone={remainingTone}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] bg-white">
        <MacroRow
          label="Białko"
          consumed={consumed.proteinG}
          target={adjustedTargetProtein}
          colorClass="bg-[#007AFF]"
        />

        <div className="ml-4 h-px bg-[#E5E5EA]" />

        <MacroRow
          label="Tłuszcze"
          consumed={consumed.fatG}
          target={adjustedTargetFat}
          colorClass="bg-[#FF9500]"
        />

        <div className="ml-4 h-px bg-[#E5E5EA]" />

        <MacroRow
          label="Węglowodany"
          consumed={consumed.carbsG}
          target={adjustedTargetCarbs}
          colorClass="bg-[#34C759]"
        />
      </div>


      {showMealEntry ? (
        <>
          <form
            className="mt-4 rounded-[22px] bg-white p-4"
            onSubmit={addEntry}
          >
            <p className="mb-3 text-[17px] font-semibold tracking-[-0.03em] text-slate-950">
              Dodaj posiłek
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
              <div className="xl:col-span-2">
                <IOSInput
                  value={label}
                  onChange={setLabel}
                  placeholder="Nazwa posiłku"
                />
              </div>

              <IOSInput
                value={kcal}
                onChange={setKcal}
                placeholder="kcal"
                inputMode="decimal"
              />

              <IOSInput
                value={protein}
                onChange={setProtein}
                placeholder="Białko"
                inputMode="decimal"
              />

              <IOSInput
                value={fat}
                onChange={setFat}
                placeholder="Tłuszcz"
                inputMode="decimal"
              />

              <div className="flex gap-2">
                <IOSInput
                  value={carbs}
                  onChange={setCarbs}
                  placeholder="Węgle"
                  inputMode="decimal"
                />

                <button
                  type="submit"
                  className="h-11 shrink-0 rounded-[14px] bg-[#007AFF] px-4 text-[15px] font-semibold tracking-[-0.02em] text-white transition active:scale-[0.98] active:bg-blue-700"
                >
                  Dodaj
                </button>
              </div>
            </div>
          </form>

          {entries.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-[22px] bg-white">
              {entries.map((entry, index) => (
                <React.Fragment key={entry.id}>
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-950">
                        {entry.label}
                      </p>

                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.02em] text-slate-500">
                        {formatInt(entry.kcal)} kcal · B{" "}
                        {formatInt(entry.proteinG)} g · T{" "}
                        {formatInt(entry.fatG)} g · W{" "}
                        {formatInt(entry.carbsG)} g
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      className="shrink-0 text-[14px] font-semibold tracking-[-0.02em] text-[#FF3B30]"
                    >
                      Usuń
                    </button>
                  </div>

                  {index < entries.length - 1 ? (
                    <div className="ml-4 h-px bg-[#E5E5EA]" />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[22px] bg-white px-4 py-4">
              <p className="text-[15px] leading-5 tracking-[-0.02em] text-slate-500">
                Dodaj pierwszy posiłek, a aplikacja policzy ile zostało do celu.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 rounded-[22px] bg-white px-4 py-4">
          <p className="text-[15px] leading-5 tracking-[-0.02em] text-slate-500">
            Dodawanie posiłków jest dostępne w zakładce Posiłki.
          </p>
        </div>
      )}
    </section>
  );
}
