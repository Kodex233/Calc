"use client";

import * as React from "react";
import { ResultsDashboard } from "./ResultsDashboard";

type Goal = "schudnac" | "utrzymac" | "miesnie";

type PlanBlock = {
  title: string;
  note: string;
};

type Meal = {
  name: string;
  kcal: number;
  description: string;
};

function distributeCalories(total: number, ratios: number[]) {
  const values = ratios.map((ratio) => Math.round(total * ratio));
  const current = values.reduce((sum, value) => sum + value, 0);
  const diff = total - current;

  if (values.length > 0) {
    values[values.length - 1] += diff;
  }

  return values;
}

function planMeta(goal: Goal, activity: number, calories: number) {
  const stepsGoal =
    activity < 20 ? "7 000 kroków" : activity < 60 ? "9 000 kroków" : "11 000 kroków";
  const cardioMinutes = activity < 20 ? 15 : activity < 60 ? 20 : 25;

  if (goal === "schudnac") {
    const [breakfast, lunch, snack, dinner] = distributeCalories(calories, [
      0.25, 0.3, 0.15, 0.3,
    ]);

    return {
      badge: "Redukcja",
      title: "Plan odchudzania",
      description:
        "Priorytetem jest sytość, regularność i trening siłowy, żeby utrzymać mięśnie przy deficycie.",
      dailyBlocks: [
        { title: "Start dnia", note: `Szklanka wody, 10 min ruchu i cel: ${stepsGoal}.` },
        {
          title: "Blok główny",
          note: `Trening siłowy 40-50 min plus cardio ${cardioMinutes} min w spokojnym tempie.`,
        },
        {
          title: "Żywienie",
          note: "4 posiłki, wysoki udział białka i warzyw, mało płynnych kalorii.",
        },
        {
          title: "Regeneracja",
          note: "Minimum 7 h snu i lekki spacer po ostatnim posiłku.",
        },
      ] satisfies PlanBlock[],
      trainingBlocks: [
        { title: "Rozgrzewka", note: "5-8 min orbitrek lub marsz plus mobilizacja bioder i barków." },
        {
          title: "Trening dnia",
          note: "3 serie: przysiad, wyciskanie, wiosłowanie, wykroki, plank. Zakres 8-12 powtórzeń.",
        },
        {
          title: "Finisher",
          note: `${cardioMinutes} min szybkiego marszu, roweru lub schodów w strefie tlenowej.`,
        },
      ] satisfies PlanBlock[],
      meals: [
        {
          name: `Śniadanie · ${breakfast} kcal`,
          kcal: breakfast,
          description: "Skyr lub jajka, owoce jagodowe, owsianka albo pieczywo pełnoziarniste.",
        },
        {
          name: `Lunch · ${lunch} kcal`,
          kcal: lunch,
          description: "Kurczak lub indyk, ryż lub ziemniaki, duża porcja warzyw i sos jogurtowy.",
        },
        {
          name: `Przekąska · ${snack} kcal`,
          kcal: snack,
          description: "Jogurt wysokobiałkowy, shake lub twaróg z owocem.",
        },
        {
          name: `Kolacja · ${dinner} kcal`,
          kcal: dinner,
          description: "Chuda ryba albo tofu, sałatka, pieczywo lub kasza i warzywa.",
        },
      ] satisfies Meal[],
      recovery: `Deficyt kontroluj przez ${stepsGoal} i stałe godziny posiłków.`,
    };
  }

  if (goal === "miesnie") {
    const [breakfast, preworkout, postworkout, dinner] = distributeCalories(
      calories,
      [0.23, 0.22, 0.25, 0.3],
    );

    return {
      badge: "Masa",
      title: "Plan budowania mięśni",
      description:
        "Nadwyżka kalorii ma wspierać progres na treningu, regenerację i spokojne dokładanie masy.",
      dailyBlocks: [
        {
          title: "Start dnia",
          note: "Pierwszy posiłek z węglowodanami i białkiem, nawodnienie od rana.",
        },
        {
          title: "Blok główny",
          note: "Trening hipertroficzny 60-75 min, progres obciążeń i zapisywanie serii.",
        },
        {
          title: "Żywienie",
          note: "4 mocniejsze posiłki, węgle wokół treningu i szybka podaż białka po sesji.",
        },
        {
          title: "Regeneracja",
          note: "7,5-8 h snu, lekka mobilność i ograniczenie przypadkowego cardio.",
        },
      ] satisfies PlanBlock[],
      trainingBlocks: [
        { title: "Rozgrzewka", note: "8 min cardio, aktywacja pośladków i łopatek, serie wprowadzające." },
        {
          title: "Trening dnia",
          note: "Push/Pull/Legs albo Full Body A/B. 4-5 ćwiczeń bazowych plus 2 izolacje, 6-12 powtórzeń.",
        },
        {
          title: "Po treningu",
          note: "Krótki cooldown, białko 25-40 g i porcja węglowodanów w ciągu 1-2 godzin.",
        },
      ] satisfies PlanBlock[],
      meals: [
        {
          name: `Śniadanie · ${breakfast} kcal`,
          kcal: breakfast,
          description: "Omlet lub owsianka z jogurtem, bananem i orzechami.",
        },
        {
          name: `Przed treningiem · ${preworkout} kcal`,
          kcal: preworkout,
          description: "Ryż, pieczywo albo makaron plus chude źródło białka i mało tłuszczu.",
        },
        {
          name: `Po treningu · ${postworkout} kcal`,
          kcal: postworkout,
          description: "Mięso, ryba lub tofu plus ryż lub ziemniaki, warzywa i owoc.",
        },
        {
          name: `Kolacja · ${dinner} kcal`,
          kcal: dinner,
          description: "Twaróg, skyr lub pełny posiłek z kaszą i zdrowymi tłuszczami.",
        },
      ] satisfies Meal[],
      recovery: "Utrzymuj stały ciężki trening i nie uciekaj zbyt mocno w cardio.",
    };
  }

  const [breakfast, lunch, snack, dinner] = distributeCalories(calories, [
    0.24, 0.28, 0.18, 0.3,
  ]);

  return {
    badge: "Utrzymanie",
    title: "Plan utrzymania formy",
    description:
      "Celem jest trzymać wagę, energię i dobrą sprawność bez agresywnego cięcia ani nadwyżki.",
    dailyBlocks: [
      {
        title: "Start dnia",
        note: "Równe tempo, regularne śniadanie i krótki spacer lub mobility.",
      },
      {
        title: "Blok główny",
        note: "Trening siłowy 45-60 min albo aktywny dzień z dłuższym spacerem.",
      },
      {
        title: "Żywienie",
        note: "4 zbilansowane posiłki, bez dużych skoków kalorii między dniami.",
      },
      {
        title: "Regeneracja",
        note: "Sen, nawodnienie i lekka praca nad ruchem 10-15 min.",
      },
    ] satisfies PlanBlock[],
    trainingBlocks: [
      { title: "Rozgrzewka", note: "5-6 min marszu lub roweru plus mobilizacja całego ciała." },
      {
        title: "Trening dnia",
        note: "Full Body 3-4 razy w tygodniu: przysiad, hinge, push, pull, core po 3 serie.",
      },
      {
        title: "Aktywność dodatkowa",
        note: `Dzienny cel: ${stepsGoal}. Cardio traktuj jako zdrowie, nie karę.`,
      },
    ] satisfies PlanBlock[],
    meals: [
      {
        name: `Śniadanie · ${breakfast} kcal`,
        kcal: breakfast,
        description: "Jajka albo nabiał, źródło węgli i owoc.",
      },
      {
        name: `Lunch · ${lunch} kcal`,
        kcal: lunch,
        description: "Białko plus ryż, kasza lub ziemniaki oraz warzywa.",
      },
      {
        name: `Przekąska · ${snack} kcal`,
        kcal: snack,
        description: "Skyr, kanapka lub shake z owocem.",
      },
      {
        name: `Kolacja · ${dinner} kcal`,
        kcal: dinner,
        description: "Lekki, sycący posiłek z białkiem i błonnikiem.",
      },
    ] satisfies Meal[],
    recovery: "Największą różnicę robi konsekwencja, nie ekstremum.",
  };
}

export function ResultsPlanner({
  goal,
  goalLabel,
  activity,
  activityLabel,
  calories,
  proteinG,
  fatG,
  carbsG,
}: {
  goal: Goal;
  goalLabel: string;
  activity: number;
  activityLabel: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}) {
  const plan = planMeta(goal, activity, calories);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            {plan.badge}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {goalLabel}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {activityLabel} | {activity}%
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.85fr]">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {plan.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {plan.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Kalorie
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {calories}
              </p>
              <p className="text-xs text-slate-500">kcal / dzień</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Regeneracja
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {plan.recovery}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ResultsDashboard
        calories={calories}
        proteinG={proteinG}
        fatG={fatG}
        carbsG={carbsG}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Plan dnia
          </p>
          <div className="mt-4 space-y-4">
            {plan.dailyBlocks.map((block, index) => (
              <div key={block.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  {index < plan.dailyBlocks.length - 1 ? (
                    <span className="mt-2 h-full w-px bg-slate-200" />
                  ) : null}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {block.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {block.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Trening dnia
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {plan.trainingBlocks.map((block, index) => (
              <div key={block.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {block.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {block.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Dieta
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Prosty rozkład dnia pod wybrany cel.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            4 posiłki
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {plan.meals.map((meal, index) => (
            <div key={meal.name} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {meal.name}
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                  {meal.kcal} kcal
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {meal.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
