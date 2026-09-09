"use client";

import { useState } from "react";
import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { money } from "../../lib/prepzero";

export default function PlanPage() {
  const { plan, hydrated } = usePrepZero();
  const [activeDay, setActiveDay] = useState(0);
  if (!hydrated) return <div className="portal-loading">Loading your week…</div>;

  const day = plan.days[activeDay];
  return (
    <AppShell title="My week" subtitle="Every day is built from complete batches so the shopping, prep and portions all line up.">
      <div className="week-tabs" role="tablist">
        {plan.days.map((d, i) => (
          <button key={d.day} className={activeDay === i ? "active" : ""} onClick={() => setActiveDay(i)}>
            <span>{d.day.slice(0, 3)}</span><small>{d.calories} kcal</small>
          </button>
        ))}
      </div>

      <section className="day-summary-card">
        <div><span className="card-kicker">{day.day.toUpperCase()}</span><h2>{day.calories.toLocaleString()} kcal</h2><p>{day.protein}g protein · {day.fibre}g fibre · {money(day.cost)} ingredient value</p></div>
        <div className="target-match"><span>Daily target</span><strong>{plan.targets.calories.toLocaleString()} kcal</strong><small>{plan.targets.protein}g+ protein</small></div>
      </section>

      <div className="plan-meal-list">
        {day.meals.map((meal, index) => (
          <article className="plan-meal" key={`${meal.id}-${index}`}>
            <div className="plan-meal-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="plan-meal-main">
              <div className="meal-type-badge">{meal.mealLabel}</div>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <div className="meal-stat-row"><span><strong>{meal.calories}</strong> kcal</span><span><strong>{meal.protein}g</strong> protein</span><span><strong>{meal.fibre}g</strong> fibre</span><span><strong>{meal.volume}/10</strong> volume</span></div>
            </div>
            <div className="plan-meal-action"><strong>{meal.batchSize} portions / batch</strong><span>Cook once, divide equally</span><a href={`/recipes#${meal.id}`}>Recipe →</a></div>
          </article>
        ))}
      </div>

      <section className="macro-week-grid">
        {plan.days.map((d) => (
          <div className="macro-day" key={d.day}><strong>{d.day.slice(0, 3)}</strong><span>{d.calories} kcal</span><span>{d.protein}g protein</span><i style={{ width: `${Math.min(100, (d.protein / plan.targets.protein) * 100)}%` }} /></div>
        ))}
      </section>
    </AppShell>
  );
}
