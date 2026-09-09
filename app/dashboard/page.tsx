"use client";

import Link from "next/link";
import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { minutesLabel, money, recipePortionCost } from "../../lib/prepzero";

export default function DashboardPage() {
  const { profile, plan, hydrated, onboarded } = usePrepZero();
  if (!hydrated) return <div className="portal-loading">Building your week…</div>;

  if (!onboarded) {
    return (
      <AppShell title="Build your first week" subtitle="Tell PrepZero what your body needs, then the optimiser can build a real seven-day plan.">
        <section className="product-rule-card"><span>START HERE</span><h2>Buy it. Cook it. Divide it. Done.</h2><p>Your profile has not been set up yet. Complete the short onboarding flow before using the portal.</p><Link className="button portal-button" href="/onboarding">Start onboarding →</Link></section>
      </AppShell>
    );
  }

  const todayIndex = Math.max(0, Math.min(6, (new Date().getDay() + 6) % 7));
  const today = plan.days[todayIndex];

  return (
    <AppShell
      title={profile.name ? `Hi ${profile.name}, here's your week.` : "Your optimised week"}
      subtitle="Nutrition first. Everything else is optimised to make following it easier."
      action={<Link className="button portal-button" href="/onboarding">Rebuild week ↻</Link>}
    >
      <section className="portal-hero-grid">
        <div className="portal-score-card">
          <div className="score-top"><span className="card-kicker">WEEKLY EFFICIENCY</span><span className="efficiency-pill">{plan.efficiency}% efficient</span></div>
          <div className="big-cost">{money(plan.weeklyCost)} <small>/ basket</small></div>
          <p>{money(plan.dailyAverageCost)} per day · Aldi MVP catalogue</p>
          <div className="score-metrics">
            <div><small>Calories</small><strong>{plan.averages.calories.toLocaleString()}</strong><span>target {plan.targets.calories.toLocaleString()}</span></div>
            <div><small>Protein</small><strong>{plan.averages.protein}g</strong><span>target {plan.targets.protein}g+</span></div>
            <div><small>Fibre</small><strong>{plan.averages.fibre}g</strong><span>target {plan.targets.fibre}g+</span></div>
          </div>
        </div>

        <div className="portal-kpi-stack">
          <div className="mini-kpi"><span className="kpi-icon">◎</span><div><small>Nutrition fit</small><strong>{plan.nutritionFit}%</strong><span>weekly target + daily consistency</span></div></div>
          <div className="mini-kpi"><span className="kpi-icon">↺</span><div><small>At-risk leftover value</small><strong>{money(plan.wasteCost)}</strong><span>perishable surplus after pack matching</span></div></div>
          <div className="mini-kpi"><span className="kpi-icon">◷</span><div><small>Total kitchen time</small><strong>{minutesLabel(plan.prepMinutes)}</strong><span>{plan.prep.length} planned prep session{plan.prep.length === 1 ? "" : "s"}</span></div></div>
          <div className="mini-kpi"><span className="kpi-icon">⌁</span><div><small>Portion weighing</small><strong>Zero</strong><span>every cooked batch is fully allocated</span></div></div>
        </div>
      </section>

      {plan.warnings.length > 0 && (
        <section className="plan-warning-list" aria-label="Plan notes">
          <strong>Before you follow this week</strong>
          {plan.warnings.map((warning) => <p key={warning}>• {warning}</p>)}
        </section>
      )}

      <section className="portal-section">
        <div className="portal-section-head"><div><span className="card-kicker">TODAY · {today.day.toUpperCase()}</span><h2>Your meals</h2></div><Link href="/plan">See full week →</Link></div>
        <div className="today-meals">
          {today.meals.length ? today.meals.map((meal) => (
            <article className="today-meal-card" key={`${meal.mealLabel}-${meal.id}`}>
              <div className="meal-type-badge">{meal.mealLabel}</div>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <div className="meal-stat-row"><span><strong>{meal.calories}</strong> kcal</span><span><strong>{meal.protein}g</strong> protein</span><span><strong>{meal.fibre}g</strong> fibre</span></div>
              <div className="meal-card-foot"><span>{money(recipePortionCost(meal))} ingredient value / portion</span><Link href={`/recipes#${meal.catalogueId}`}>View recipe →</Link></div>
            </article>
          )) : <div className="empty-state"><strong>No compatible meals yet.</strong><span>Review your food exclusions or expand the recipe catalogue.</span></div>}
        </div>
      </section>

      <section className="portal-grid-two">
        <article className="portal-panel">
          <div className="portal-section-head compact"><div><span className="card-kicker">NEXT PREP</span><h2>{plan.prep[0]?.title || "No prep available"}</h2></div><Link href="/prep">Open prep →</Link></div>
          <div className="prep-summary"><span className="prep-clock">{plan.prep[0]?.minutes || 0}<small>min</small></span><div>{plan.prep[0]?.recipes.slice(0, 3).map((recipe) => <p key={recipe.id}><strong>{recipe.portions}×</strong> {recipe.name}</p>)}</div></div>
          <div className="zero-fuss-line">✓ Every selected batch is divided into exactly the portions the seven-day plan uses</div>
        </article>

        <article className="portal-panel">
          <div className="portal-section-head compact"><div><span className="card-kicker">SHOPPING</span><h2>{plan.shopping.length} products</h2></div><Link href="/shopping">Open list →</Link></div>
          <div className="shopping-preview">
            {plan.shopping.slice(0, 5).map((item) => <div key={item.productId}><span>{item.qty}×</span><p><strong>{item.name}</strong><small>{item.pack}</small></p><b>{money(item.price * item.qty)}</b></div>)}
          </div>
        </article>
      </section>

      <section className="product-rule-card"><span>THE PREPZERO RULE</span><h2>If saving 12p makes the plan annoying, we don't save the 12p.</h2><p>The optimiser prefers a plan that is practical enough to follow over a theoretically cheaper spreadsheet of awkward ingredient quantities.</p></section>
    </AppShell>
  );
}
