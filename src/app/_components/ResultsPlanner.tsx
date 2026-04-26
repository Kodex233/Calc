"use client";

import * as React from "react";
import { ResultsDashboard } from "./ResultsDashboard";

export type Goal = "schudnac" | "utrzymac" | "miesnie";

type PlanBlock = {
  title: string;
  note: string;
};

type Meal = {
  name: string;
  kcal: number;
  description: string;
};

type PlanMeta = {
  badge: string;
  title: string;
  description: string;
  dailyBlocks: PlanBlock[];
  trainingBlocks: PlanBlock[];
  meals: Meal[];
  recovery: string;
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

export function getPlanMeta(
  goal: Goal,
  activity: number,
  calories: number,
): PlanMeta {
  const stepsGoal =
    activity < 20 ? "7 000 krokow" : activity < 60 ? "9 000 krokow" : "11 000 krokow";
  const cardioMinutes = activity < 20 ? 15 : activity < 60 ? 20 : 25;

  if (goal === "schudnac") {
    const [breakfast, lunch, snack, dinner] = distributeCalories(calories, [
      0.25, 0.3, 0.15, 0.3,
    ]);

    return {
      badge: "Redukcja",
      title: "Plan odchudzania",
      description:
        "Priorytetem jest sytosc, regularnosc i trening silowy, aby utrzymac miesnie przy deficycie.",
      dailyBlocks: [
        { title: "Start dnia", note: `Szklanka wody, 10 min ruchu i cel: ${stepsGoal}.` },
        {
          title: "Blok glowny",
          note: `Trening silowy 40-50 min plus cardio ${cardioMinutes} min w spokojnym tempie.`,
        },
        {
          title: "Zywienie",
          note: "4 posilki, wysoki udzial bialka i warzyw, malo plynnych kalorii.",
        },
        {
          title: "Regeneracja",
          note: "Minimum 7 h snu i lekki spacer po ostatnim posilku.",
        },
      ],
      trainingBlocks: [
        { title: "Rozgrzewka", note: "5-8 min orbitrek lub marsz plus mobilizacja bioder i barkow." },
        {
          title: "Trening dnia",
          note: "3 serie: przysiad, wyciskanie, wioslowanie, wykroki, plank. Zakres 8-12 powtorzen.",
        },
        {
          title: "Finisher",
          note: `${cardioMinutes} min szybkiego marszu, roweru lub schodow w strefie tlenowej.`,
        },
      ],
      meals: [
        {
          name: `Sniadanie - ${breakfast} kcal`,
          kcal: breakfast,
          description: "Skyr lub jajka, owoce jagodowe, owsianka albo pieczywo pelnoziarniste.",
        },
        {
          name: `Lunch - ${lunch} kcal`,
          kcal: lunch,
          description: "Kurczak lub indyk, ryz lub ziemniaki, duza porcja warzyw i sos jogurtowy.",
        },
        {
          name: `Przekaska - ${snack} kcal`,
          kcal: snack,
          description: "Jogurt wysokobialkowy, shake lub twarog z owocem.",
        },
        {
          name: `Kolacja - ${dinner} kcal`,
          kcal: dinner,
          description: "Chuda ryba albo tofu, salatka, pieczywo lub kasza i warzywa.",
        },
      ],
      recovery: `Deficyt kontroluj przez ${stepsGoal} i stale godziny posilkow.`,
    };
  }

  if (goal === "miesnie") {
    const [breakfast, preworkout, postworkout, dinner] = distributeCalories(
      calories,
      [0.23, 0.22, 0.25, 0.3],
    );

    return {
      badge: "Masa",
      title: "Plan budowania miesni",
      description:
        "Nadwyzka kalorii ma wspierac progres na treningu, regeneracje i spokojne dokladanie masy.",
      dailyBlocks: [
        {
          title: "Start dnia",
          note: "Pierwszy posilek z weglowodanami i bialkiem, nawodnienie od rana.",
        },
        {
          title: "Blok glowny",
          note: "Trening hipertroficzny 60-75 min, progres obciazen i zapisywanie serii.",
        },
        {
          title: "Zywienie",
          note: "4 mocniejsze posilki, wegle wokol treningu i szybka podaz bialka po sesji.",
        },
        {
          title: "Regeneracja",
          note: "7.5-8 h snu, lekka mobilnosc i ograniczenie przypadkowego cardio.",
        },
      ],
      trainingBlocks: [
        { title: "Rozgrzewka", note: "8 min cardio, aktywacja posladkow i lopatek, serie wprowadzajace." },
        {
          title: "Trening dnia",
          note: "Push/Pull/Legs albo Full Body A/B. 4-5 cwiczen bazowych plus 2 izolacje, 6-12 powtorzen.",
        },
        {
          title: "Po treningu",
          note: "Krotki cooldown, bialko 25-40 g i porcja weglowodanow w ciagu 1-2 godzin.",
        },
      ],
      meals: [
        {
          name: `Sniadanie - ${breakfast} kcal`,
          kcal: breakfast,
          description: "Omlet lub owsianka z jogurtem, bananem i orzechami.",
        },
        {
          name: `Przed treningiem - ${preworkout} kcal`,
          kcal: preworkout,
          description: "Ryz, pieczywo albo makaron plus chude zrodlo bialka i malo tluszczu.",
        },
        {
          name: `Po treningu - ${postworkout} kcal`,
          kcal: postworkout,
          description: "Mieso, ryba lub tofu plus ryz lub ziemniaki, warzywa i owoc.",
        },
        {
          name: `Kolacja - ${dinner} kcal`,
          kcal: dinner,
          description: "Twarog, skyr lub pelny posilek z kasza i zdrowymi tluszczami.",
        },
      ],
      recovery: "Utrzymuj staly ciezki trening i nie uciekaj zbyt mocno w cardio.",
    };
  }

  const [breakfast, lunch, snack, dinner] = distributeCalories(calories, [
    0.24, 0.28, 0.18, 0.3,
  ]);

  return {
    badge: "Utrzymanie",
    title: "Plan utrzymania formy",
    description:
      "Celem jest trzymac wage, energie i dobra sprawnosc bez agresywnego ciecia ani nadwyzki.",
    dailyBlocks: [
      {
        title: "Start dnia",
        note: "Rowne tempo, regularne sniadanie i krotki spacer lub mobility.",
      },
      {
        title: "Blok glowny",
        note: "Trening silowy 45-60 min albo aktywny dzien z dluzszym spacerem.",
      },
      {
        title: "Zywienie",
        note: "4 zbilansowane posilki, bez duzych skokow kalorii miedzy dniami.",
      },
      {
        title: "Regeneracja",
        note: "Sen, nawodnienie i lekka praca nad ruchem 10-15 min.",
      },
    ],
    trainingBlocks: [
      { title: "Rozgrzewka", note: "5-6 min marszu lub roweru plus mobilizacja calego ciala." },
      {
        title: "Trening dnia",
        note: "Full Body 3-4 razy w tygodniu: przysiad, hinge, push, pull, core po 3 serie.",
      },
      {
        title: "Aktywnosc dodatkowa",
        note: `Dzienny cel: ${stepsGoal}. Cardio traktuj jako zdrowie, nie kare.`,
      },
    ],
    meals: [
      {
        name: `Sniadanie - ${breakfast} kcal`,
        kcal: breakfast,
        description: "Jajka albo nabial, zrodlo wegli i owoc.",
      },
      {
        name: `Lunch - ${lunch} kcal`,
        kcal: lunch,
        description: "Bialko plus ryz, kasza lub ziemniaki oraz warzywa.",
      },
      {
        name: `Przekaska - ${snack} kcal`,
        kcal: snack,
        description: "Skyr, kanapka lub shake z owocem.",
      },
      {
        name: `Kolacja - ${dinner} kcal`,
        kcal: dinner,
        description: "Lekki, sycacy posilek z bialkiem i blonnikiem.",
      },
    ],
    recovery: "Najwieksza roznice robi konsekwencja, nie ekstremum.",
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
  showOverview = true,
  showTrainingAndDaily = true,
  showMeals = true,
}: {
  goal: Goal;
  goalLabel: string;
  activity: number;
  activityLabel: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  showOverview?: boolean;
  showTrainingAndDaily?: boolean;
  showMeals?: boolean;
}) {
  const plan = getPlanMeta(goal, activity, calories);

  return (
    <div className="flex min-w-0 flex-col gap-5">
      {showOverview ? (
        <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-sm xl:p-7">
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

          <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.5fr)_380px]">
            <div className="min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {plan.title}
              </h2>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                {plan.description}
              </p>
            </div>

            <div className="xl:self-start">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Kalorie
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {calories}
                </p>
                <p className="text-xs text-slate-500">kcal / dzien</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <ResultsDashboard
        calories={calories}
        proteinG={proteinG}
        fatG={fatG}
        carbsG={carbsG}
      />

      {showTrainingAndDaily ? (
        <ResultsTrainingPanel
          goal={goal}
          activity={activity}
          calories={calories}
        />
      ) : null}

      {showMeals ? (
        <ResultsMealsPanel
          goal={goal}
          activity={activity}
          calories={calories}
        />
      ) : null}
    </div>
  );
}

export function ResultsTrainingPanel({
  goal,
  activity,
  calories,
}: {
  goal: Goal;
  activity: number;
  calories: number;
}) {
  const plan = getPlanMeta(goal, activity, calories);
  const sessionMinutes =
    goal === "miesnie" ? 75 : goal === "schudnac" ? 60 : 65;
  const weeklySessions =
    activity >= 80 ? 5 : activity >= 45 ? 4 : 3;
  const cardioMinutes = goal === "schudnac" ? 25 : goal === "utrzymac" ? 15 : 10;

  return (
    <div className="flex flex-col gap-5">
      <section className="glass-panel rounded-[28px] p-5 xl:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/85 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Sesje / tydzien
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {weeklySessions}
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/85 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Czas sesji
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {sessionMinutes} min
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white/85 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Cardio
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {cardioMinutes} min
            </p>
          </article>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm xl:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Plan dnia
          </p>
          <div className="mt-4 space-y-3">
            {plan.dailyBlocks.map((block, index) => (
              <article
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">{block.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{block.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm xl:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Trening dnia
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {plan.trainingBlocks.map((block, index) => (
              <article
                key={block.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {index + 1}. {block.title}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                    Blok {index + 1}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {block.note}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
}

export function ResultsMealsPanel({
  goal,
  activity,
  calories,
}: {
  goal: Goal;
  activity: number;
  calories: number;
}) {
  const plan = getPlanMeta(goal, activity, calories);

  return (
    <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-sm xl:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Dieta
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Prosty rozklad dnia pod wybrany cel.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          4 posilki
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
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
  );
}
