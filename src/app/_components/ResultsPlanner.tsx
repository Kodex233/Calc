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

function formatInt(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function mealMoment(index: number) {
  return ["Rano", "Południe", "Popołudnie", "Wieczór"][index] ?? "Posiłek";
}

function distributeCalories(total: number, ratios: number[]) {
  const values = ratios.map((ratio) => Math.round(total * ratio));
  const current = values.reduce((sum, value) => sum + value, 0);
  const diff = total - current;

  if (values.length > 0) {
    values[values.length - 1] += diff;
  }

  return values;
}

function IOSBadge({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "green" | "gray" | "orange";
}) {
  const classes =
    color === "green"
      ? "bg-[#E8F8EE] text-[#248A3D]"
      : color === "orange"
        ? "bg-[#FFF3E0] text-[#C46A00]"
        : color === "gray"
          ? "bg-[#E5E5EA] text-slate-600"
          : "bg-[#EAF3FF] text-[#007AFF]";

  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-[12px] font-semibold tracking-[-0.02em]",
        classes,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function IOSMetricCard({
  label,
  value,
  suffix,
  color = "text-slate-950",
}: {
  label: string;
  value: React.ReactNode;
  suffix?: string;
  color?: string;
}) {
  return (
    <article className="rounded-[24px] bg-white px-4 py-4">
      <p className="text-[13px] font-medium tracking-[-0.02em] text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1.5">
        <p
          className={[
            "text-[34px] font-bold leading-none tracking-[-0.06em]",
            color,
          ].join(" ")}
        >
          {value}
        </p>

        {suffix ? (
          <p className="pb-1 text-[14px] font-semibold tracking-[-0.02em] text-slate-400">
            {suffix}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function IOSSectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="px-1 pb-4">
      {eyebrow ? (
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#007AFF]">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-1 text-[30px] font-bold leading-none tracking-[-0.055em] text-slate-950 sm:text-[34px]">
        {title}
      </h2>

      {description ? (
        <p className="mt-2 max-w-3xl text-[15px] leading-5 tracking-[-0.02em] text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function IOSInfoRow({
  title,
  note,
  index,
}: {
  title: string;
  note: string;
  index?: number;
}) {
  return (
    <div className="flex gap-3 px-4 py-4">
      {typeof index === "number" ? (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-[13px] font-bold text-white">
          {index}
        </div>
      ) : null}

      <div className="min-w-0">
        <p className="text-[16px] font-semibold tracking-[-0.03em] text-slate-950">
          {title}
        </p>
        <p className="mt-1 text-[14px] leading-5 tracking-[-0.02em] text-slate-500">
          {note}
        </p>
      </div>
    </div>
  );
}

function IOSProgress({
  value,
  color = "bg-[#007AFF]",
}: {
  value: number;
  color?: string;
}) {
  const width = Math.min(100, Math.max(0, value));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#E5E5EA]">
      <div
        className={["h-full rounded-full", color].join(" ")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function getPlanMeta(
  goal: Goal,
  activity: number,
  calories: number,
): PlanMeta {
  const stepsGoal =
    activity < 20
      ? "7 000 kroków"
      : activity < 60
        ? "9 000 kroków"
        : "11 000 kroków";

  const cardioMinutes = activity < 20 ? 15 : activity < 60 ? 20 : 25;

  if (goal === "schudnac") {
    const [breakfast, lunch, snack, dinner] = distributeCalories(calories, [
      0.25, 0.3, 0.15, 0.3,
    ]);

    return {
      badge: "Redukcja",
      title: "Plan odchudzania",
      description:
        "Priorytetem jest sytość, regularność i trening siłowy, aby utrzymać mięśnie przy deficycie.",
      dailyBlocks: [
        {
          title: "Start dnia",
          note: `Szklanka wody, 10 min ruchu i cel: ${stepsGoal}.`,
        },
        {
          title: "Blok główny",
          note: `Trening siłowy 40–50 min plus cardio ${cardioMinutes} min w spokojnym tempie.`,
        },
        {
          title: "Żywienie",
          note: "4 posiłki, wysoki udział białka i warzyw, mało płynnych kalorii.",
        },
        {
          title: "Regeneracja",
          note: "Minimum 7 h snu i lekki spacer po ostatnim posiłku.",
        },
      ],
      trainingBlocks: [
        {
          title: "Rozgrzewka",
          note: "5–8 min orbitrek lub marsz plus mobilizacja bioder i barków.",
        },
        {
          title: "Trening dnia",
          note: "3 serie: przysiad, wyciskanie, wiosłowanie, wykroki, plank. Zakres 8–12 powtórzeń.",
        },
        {
          title: "Finisher",
          note: `${cardioMinutes} min szybkiego marszu, roweru lub schodów w strefie tlenowej.`,
        },
      ],
      meals: [
        {
          name: `Śniadanie`,
          kcal: breakfast,
          description:
            "Skyr lub jajka, owoce jagodowe, owsianka albo pieczywo pełnoziarniste.",
        },
        {
          name: `Lunch`,
          kcal: lunch,
          description:
            "Kurczak lub indyk, ryż albo ziemniaki, duża porcja warzyw i sos jogurtowy.",
        },
        {
          name: `Przekąska`,
          kcal: snack,
          description: "Jogurt wysokobiałkowy, shake lub twaróg z owocem.",
        },
        {
          name: `Kolacja`,
          kcal: dinner,
          description:
            "Chuda ryba albo tofu, sałatka, pieczywo lub kasza i warzywa.",
        },
      ],
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
          note: "Trening hipertroficzny 60–75 min, progres obciążeń i zapisywanie serii.",
        },
        {
          title: "Żywienie",
          note: "4 mocniejsze posiłki, węgle wokół treningu i szybka podaż białka po sesji.",
        },
        {
          title: "Regeneracja",
          note: "7,5–8 h snu, lekka mobilność i ograniczenie przypadkowego cardio.",
        },
      ],
      trainingBlocks: [
        {
          title: "Rozgrzewka",
          note: "8 min cardio, aktywacja pośladków i łopatek, serie wprowadzające.",
        },
        {
          title: "Trening dnia",
          note: "Push/Pull/Legs albo Full Body A/B. 4–5 ćwiczeń bazowych plus 2 izolacje, 6–12 powtórzeń.",
        },
        {
          title: "Po treningu",
          note: "Krótki cooldown, białko 25–40 g i porcja węglowodanów w ciągu 1–2 godzin.",
        },
      ],
      meals: [
        {
          name: `Śniadanie`,
          kcal: breakfast,
          description: "Omlet lub owsianka z jogurtem, bananem i orzechami.",
        },
        {
          name: `Przed treningiem`,
          kcal: preworkout,
          description:
            "Ryż, pieczywo albo makaron plus chude źródło białka i mało tłuszczu.",
        },
        {
          name: `Po treningu`,
          kcal: postworkout,
          description:
            "Mięso, ryba lub tofu plus ryż albo ziemniaki, warzywa i owoc.",
        },
        {
          name: `Kolacja`,
          kcal: dinner,
          description:
            "Twaróg, skyr lub pełny posiłek z kaszą i zdrowymi tłuszczami.",
        },
      ],
      recovery:
        "Utrzymuj stały ciężki trening i nie uciekaj zbyt mocno w cardio.",
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
        note: "Trening siłowy 45–60 min albo aktywny dzień z dłuższym spacerem.",
      },
      {
        title: "Żywienie",
        note: "4 zbilansowane posiłki, bez dużych skoków kalorii między dniami.",
      },
      {
        title: "Regeneracja",
        note: "Sen, nawodnienie i lekka praca nad ruchem 10–15 min.",
      },
    ],
    trainingBlocks: [
      {
        title: "Rozgrzewka",
        note: "5–6 min marszu lub roweru plus mobilizacja całego ciała.",
      },
      {
        title: "Trening dnia",
        note: "Full Body 3–4 razy w tygodniu: przysiad, hinge, push, pull, core po 3 serie.",
      },
      {
        title: "Aktywność dodatkowa",
        note: `Dzienny cel: ${stepsGoal}. Cardio traktuj jako zdrowie, nie karę.`,
      },
    ],
    meals: [
      {
        name: `Śniadanie`,
        kcal: breakfast,
        description: "Jajka albo nabiał, źródło węgli i owoc.",
      },
      {
        name: `Lunch`,
        kcal: lunch,
        description: "Białko plus ryż, kasza lub ziemniaki oraz warzywa.",
      },
      {
        name: `Przekąska`,
        kcal: snack,
        description: "Skyr, kanapka lub shake z owocem.",
      },
      {
        name: `Kolacja`,
        kcal: dinner,
        description: "Lekki, sycący posiłek z białkiem i błonnikiem.",
      },
    ],
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
        <section className="rounded-[34px] bg-[#F2F2F7] p-4 sm:p-5 xl:p-6">
          <IOSSectionTitle
            eyebrow="Twój plan"
            title={plan.title}
            description={plan.description}
          />

          <div className="flex flex-wrap gap-2 px-1">
            <IOSBadge>{plan.badge}</IOSBadge>
            <IOSBadge color="gray">{goalLabel}</IOSBadge>
            <IOSBadge color="gray">
              {activityLabel} · {activity}%
            </IOSBadge>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <IOSMetricCard
              label="Kalorie"
              value={formatInt(calories)}
              suffix="kcal"
              color="text-[#007AFF]"
            />

            <IOSMetricCard
              label="Białko"
              value={formatInt(proteinG)}
              suffix="g"
              color="text-[#007AFF]"
            />

            <IOSMetricCard
              label="Tłuszcze"
              value={formatInt(fatG)}
              suffix="g"
              color="text-[#FF9500]"
            />

            <IOSMetricCard
              label="Węglowodany"
              value={formatInt(carbsG)}
              suffix="g"
              color="text-[#34C759]"
            />
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

  const weeklySessions = activity >= 80 ? 5 : activity >= 45 ? 4 : 3;

  const cardioMinutes =
    goal === "schudnac" ? 25 : goal === "utrzymac" ? 15 : 10;

  return (
    <section className="rounded-[34px] bg-[#F2F2F7] p-4 sm:p-5 xl:p-6">
      <IOSSectionTitle
        eyebrow="Trening"
        title="Plan aktywności"
        description="Czytelny tygodniowy schemat treningu, cardio i regeneracji."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <IOSMetricCard
          label="Sesje"
          value={weeklySessions}
          suffix="tydz."
          color="text-[#007AFF]"
        />

        <IOSMetricCard
          label="Czas sesji"
          value={sessionMinutes}
          suffix="min"
        />

        <IOSMetricCard
          label="Cardio"
          value={cardioMinutes}
          suffix="min"
          color="text-[#34C759]"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section>
          <div className="mb-2 px-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Plan dnia
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] bg-white">
            {plan.dailyBlocks.map((block, index) => (
              <React.Fragment key={block.title}>
                <IOSInfoRow
                  title={block.title}
                  note={block.note}
                  index={index + 1}
                />

                {index < plan.dailyBlocks.length - 1 ? (
                  <div className="ml-14 h-px bg-[#E5E5EA]" />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 px-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              Trening dnia
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] bg-white">
            {plan.trainingBlocks.map((block, index) => (
              <React.Fragment key={block.title}>
                <IOSInfoRow
                  title={block.title}
                  note={block.note}
                  index={index + 1}
                />

                {index < plan.trainingBlocks.length - 1 ? (
                  <div className="ml-14 h-px bg-[#E5E5EA]" />
                ) : null}
              </React.Fragment>
            ))}
          </div>

          <div className="mt-4 rounded-[24px] bg-white px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#007AFF]">
                <span className="text-lg font-bold">i</span>
              </div>

              <div>
                <p className="text-[16px] font-semibold tracking-[-0.03em] text-slate-950">
                  Regeneracja
                </p>
                <p className="mt-1 text-[14px] leading-5 tracking-[-0.02em] text-slate-500">
                  {plan.recovery}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
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
  const totalMealsKcal = plan.meals.reduce((sum, meal) => sum + meal.kcal, 0);
  const budgetCalories = calories > 0 ? calories : totalMealsKcal;

  return (
    <section className="rounded-[34px] bg-[#F2F2F7] p-4 sm:p-5 xl:p-6">
      <IOSSectionTitle
        eyebrow="Posiłki"
        title="Plan jedzenia"
        description="Cztery proste bloki dnia z podziałem kalorii i krótką wskazówką."
      />

      <div className="grid grid-cols-2 gap-3">
        <IOSMetricCard
          label="Dzienna pula"
          value={formatInt(calories)}
          suffix="kcal"
          color="text-[#34C759]"
        />

        <IOSMetricCard
          label="Posiłki"
          value={plan.meals.length}
          suffix="bloki"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {plan.meals.map((meal, index) => {
          const percent =
            budgetCalories > 0
              ? Math.round((meal.kcal / budgetCalories) * 100)
              : 0;

          return (
            <article key={`${meal.name}-${index}`} className="rounded-[26px] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <IOSBadge
                    color={
                      index === 0
                        ? "blue"
                        : index === 1
                          ? "green"
                          : index === 2
                            ? "orange"
                            : "gray"
                    }
                  >
                    {mealMoment(index)}
                  </IOSBadge>

                  <h4 className="mt-3 text-[18px] font-bold leading-6 tracking-[-0.04em] text-slate-950">
                    {meal.name}
                  </h4>
                </div>

                <div className="shrink-0 rounded-full bg-[#F2F2F7] px-3 py-1.5 text-[13px] font-semibold tracking-[-0.02em] text-slate-700">
                  {formatInt(meal.kcal)} kcal
                </div>
              </div>

              <p className="mt-3 text-[14px] leading-5 tracking-[-0.02em] text-slate-500">
                {meal.description}
              </p>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-medium tracking-[-0.02em] text-slate-500">
                    Udział w dniu
                  </p>

                  <p className="text-[13px] font-semibold tracking-[-0.02em] text-slate-700">
                    {percent}%
                  </p>
                </div>

                <IOSProgress
                  value={percent}
                  color={
                    index === 0
                      ? "bg-[#007AFF]"
                      : index === 1
                        ? "bg-[#34C759]"
                        : index === 2
                          ? "bg-[#FF9500]"
                          : "bg-slate-400"
                  }
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 rounded-[24px] bg-white px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE] text-[#34C759]">
            <span className="text-lg font-bold">✓</span>
          </div>

          <div>
            <p className="text-[16px] font-semibold tracking-[-0.03em] text-slate-950">
              Notatka
            </p>
            <p className="mt-1 text-[14px] leading-5 tracking-[-0.02em] text-slate-500">
              {plan.recovery}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
