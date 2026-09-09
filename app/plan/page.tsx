"use client";

import { useState } from "react";
import { AppShell } from "../../components/app-shell";
import { OnboardingRequired } from "../../components/onboarding-required";
import { usePrepZero } from "../../components/use-prepzero";
import { money } from "../../lib/prepzero";

export default function PlanPage() {
  const { plan, hydrated, onboarded } = usePrepZero();
  const [activeDay, setActiveDay] = useState(0);
  if (!hydrated) return <div className="portal-loading">Loading your week…</div>;
  if (!onboarded) return <OnboardingRequired title="My week" />;

  const day = plan.days[activeDay];
  return (
    <AppShell title="My week" subtitle="Every cooked batch is fully allocated across the seven-day plan, so prep portions and shopping quantities stay aligned.">
      <section className="fit-summary-line">
        <span><strong>{plan.averages.calories.toLocaleString()}</strong> avg kcal/day</span>
        <span><strong>{plan.averages.protein}g</strong> avg protein/day</span>
        <span><strong>{plan.nutritionFit}%</strong> nutrition fit</span>
      </section>

      <div className="week-tabs" role="tablist" aria-label="Days of the week">
        {plan.days.map((item, index) => (
          <button key={item.day} role="tab" aria-selected={activeDay === index} className={activeDay === index ? "active" : ""} onClick={() => setActiveDay(index)}>
            <span>{item.day.slice(0, 3)}</span><small>{item.calories} kcal</small>
          </button>
        ))}
      </div>

      <section className="day-summary-card">
        <div><span className="card-kicker">{day.day.toUpperCase()}</span><h2>{day.calories.toLocaleString()} kcal</h2><p>{day.protein}g protein · {day.fibre}g fibre · {money(day.cost)} consumed ingredient value</p></div>
        <div className="target-match"><span>Daily target</span><strong>{plan.targets.calories.toLocaleString()} kcal</strong><small>{plan.targets.protein}g+ protein</small></div>
      </section>

      {day.meals.length ? (
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
              <div className="plan-meal-action"><strong>{meal.batchSize} portions / batch</strong><span>Every portion from this batch is used this week</span><a href={`/recipes#${meal.catalogueId}`}>Recipe →</a></div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state"><strong>No compatible meals available.</strong><span>Review your food exclusions or add more safe recipes to the catalogue.</span></div>}

      <section className="macro-week-grid">
        {plan.days.map((item) => (
          <div className="macro-day" key={item.day}><strong>{item.day.slice(0, 3)}</strong><span>{item.calories} kcal</span><span>{item.protein}g protein</span><i style={{ width: `${Math.min(100, (item.protein / Math.max(1, plan.targets.protein)) * 100)}%` }} /></div>
        ))}
      </section>
    </AppShell>
  );
}
