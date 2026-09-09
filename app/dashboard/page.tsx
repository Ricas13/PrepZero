"use client";

import Link from "next/link";
import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { minutesLabel, money } from "../../lib/prepzero";

export default function DashboardPage() {
  const { profile, plan, hydrated } = usePrepZero();
  if (!hydrated) return <div className="portal-loading">Building your week…</div>;

  const todayIndex = Math.max(0, Math.min(6, (new Date().getDay() + 6) % 7));
  const today = plan.days[todayIndex];
  const avgCalories = Math.round(plan.days.reduce((s, d) => s + d.calories, 0) / 7);
  const avgProtein = Math.round(plan.days.reduce((s, d) => s + d.protein, 0) / 7);
  const avgFibre = Math.round(plan.days.reduce((s, d) => s + d.fibre, 0) / 7);

  return (
    <AppShell
      title={profile.name ? `Hi ${profile.name}, here's your week.` : "Your optimised week"}
      subtitle="Nutrition first. Everything else is optimised to make following it easier."
      action={<Link className="button portal-button" href="/onboarding">Rebuild week ↻</Link>}
    >
      <section className="portal-hero-grid">
        <div className="portal-score-card">
          <div className="score-top"><span className="card-kicker">WEEKLY EFFICIENCY</span><span className="efficiency-pill">{plan.efficiency}% efficient</span></div>
          <div className="big-cost">{money(plan.weeklyCost)} <small>/ week</small></div>
          <p>{money(plan.dailyAverageCost)} per day · Aldi launch catalogue</p>
          <div className="score-metrics">
            <div><small>Calories</small><strong>{avgCalories.toLocaleString()}</strong><span>target {plan.targets.calories.toLocaleString()}</span></div>
            <div><small>Protein</small><strong>{avgProtein}g</strong><span>target {plan.targets.protein}g+</span></div>
            <div><small>Fibre</small><strong>{avgFibre}g</strong><span>target {plan.targets.fibre}g+</span></div>
          </div>
        </div>

        <div className="portal-kpi-stack">
          <div className="mini-kpi"><span className="kpi-icon">↺</span><div><small>Estimated unused food</small><strong>{money(plan.wasteCost)}</strong><span>across the week</span></div></div>
          <div className="mini-kpi"><span className="kpi-icon">◷</span><div><small>Total kitchen time</small><strong>{minutesLabel(plan.prepMinutes)}</strong><span>{plan.prep.length} planned prep sessions</span></div></div>
          <div className="mini-kpi"><span className="kpi-icon">⌁</span><div><small>Portion weighing</small><strong>Zero</strong><span>mix each batch, then divide evenly</span></div></div>
        </div>
      </section>

      <section className="portal-section">
        <div className="portal-section-head"><div><span className="card-kicker">TODAY · {today.day.toUpperCase()}</span><h2>Your meals</h2></div><Link href="/plan">See full week →</Link></div>
        <div className="today-meals">
          {today.meals.map((meal) => (
            <article className="today-meal-card" key={`${meal.mealLabel}-${meal.id}`}>
              <div className="meal-type-badge">{meal.mealLabel}</div>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <div className="meal-stat-row"><span><strong>{meal.calories}</strong> kcal</span><span><strong>{meal.protein}g</strong> protein</span><span><strong>{meal.fibre}g</strong> fibre</span></div>
              <div className="meal-card-foot"><span>{money(meal.ingredients.reduce((s, i) => s + i.price * i.qty, 0) / meal.batchSize)} / portion</span><Link href={`/recipes#${meal.id}`}>View recipe →</Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="portal-grid-two">
        <article className="portal-panel">
          <div className="portal-section-head compact"><div><span className="card-kicker">NEXT PREP</span><h2>{plan.prep[0]?.title || "Prep session"}</h2></div><Link href="/prep">Open prep →</Link></div>
          <div className="prep-summary"><span className="prep-clock">{plan.prep[0]?.minutes || 0}<small>min</small></span><div>{plan.prep[0]?.recipes.slice(0, 3).map((r) => <p key={r.name}><strong>{r.portions}×</strong> {r.name}</p>)}</div></div>
          <div className="zero-fuss-line">✓ Cook each batch once · mix well · divide into the shown portions</div>
        </article>

        <article className="portal-panel">
          <div className="portal-section-head compact"><div><span className="card-kicker">SHOPPING</span><h2>{plan.shopping.length} items</h2></div><Link href="/shopping">Open list →</Link></div>
          <div className="shopping-preview">
            {plan.shopping.slice(0, 5).map((item) => <div key={`${item.name}-${item.pack}`}><span>{item.qty}×</span><p><strong>{item.name}</strong><small>{item.pack}</small></p><b>{money(item.price * item.qty)}</b></div>)}
          </div>
        </article>
      </section>

      <section className="product-rule-card"><span>THE PREPZERO RULE</span><h2>If saving 12p makes the plan annoying, we don't save the 12p.</h2><p>The optimiser always prefers a plan that is practical enough to follow over a theoretically cheaper spreadsheet of awkward ingredient quantities.</p></section>
    </AppShell>
  );
}
