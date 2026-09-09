"use client";

import { AppShell } from "../../components/app-shell";
import { OnboardingRequired } from "../../components/onboarding-required";
import { usePrepZero } from "../../components/use-prepzero";
import { minutesLabel } from "../../lib/prepzero";

export default function PrepPage() {
  const { plan, hydrated, onboarded } = usePrepZero();
  if (!hydrated) return <div className="portal-loading">Loading prep schedule…</div>;
  if (!onboarded) return <OnboardingRequired title="Prep schedule" />;

  return (
    <AppShell title="Prep schedule" subtitle="Cook each selected batch once, mix thoroughly where appropriate, and divide into exactly the portions used by this week.">
      <section className="prep-overview-card">
        <div><span className="card-kicker">THIS WEEK</span><strong>{minutesLabel(plan.prepMinutes)}</strong><small>estimated total kitchen time</small></div>
        <div><span className="card-kicker">SESSIONS</span><strong>{plan.prep.length}</strong><small>planned cooking blocks</small></div>
        <div><span className="card-kicker">EXTRA COOKED PORTIONS</span><strong>0</strong><small>every selected batch is fully allocated</small></div>
        <div><span className="card-kicker">PORTION WEIGHING</span><strong>0</strong><small>mix, divide, done</small></div>
      </section>

      {plan.prep.length ? (
        <div className="prep-session-list">
          {plan.prep.map((session, sessionIndex) => (
            <section className="prep-session" key={session.title}>
              <div className="prep-session-head">
                <div><span className="session-number">{String(sessionIndex + 1).padStart(2, "0")}</span><div><span className="card-kicker">PREP SESSION</span><h2>{session.title}</h2></div></div>
                <strong>{session.minutes} min</strong>
              </div>
              <div className="prep-recipes">
                {session.recipes.map((item) => {
                  const recipe = plan.selectedRecipes.find((candidate) => candidate.id === item.id);
                  return (
                    <article className="prep-recipe-card" key={item.id}>
                      <div className="prep-recipe-title"><div><span className="meal-type-badge">{recipe?.category || "meal"}</span><h3>{item.name}</h3></div><span className="portion-badge">{item.portions} portions</span></div>
                      {recipe && <ol>{recipe.method.map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol>}
                      <div className="divide-callout"><span className="divide-big">÷{item.portions}</span><div><strong>Final step: divide evenly</strong><p>{item.instruction} No portion weighing needed.</p></div></div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : <div className="empty-state"><strong>No compatible prep schedule.</strong><span>Review your plan warnings or food exclusions.</span></div>}

      <section className="prep-tip"><strong>One practical rule</strong><p>For mixed dishes, stir the finished batch thoroughly before portioning. For large discrete ingredients, distribute those evenly first, then split the sauce, rice or vegetables between containers.</p></section>
    </AppShell>
  );
}
