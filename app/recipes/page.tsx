"use client";

import { useMemo, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { recipeCatalogue, recipePortionCost, money } from "../../lib/prepzero";

export default function RecipesPage() {
  const { plan, hydrated } = usePrepZero();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "breakfast" | "lunch" | "dinner" | "snack">("all");

  const plannedByCatalogueId = useMemo(() => {
    const map = new Map<string, typeof plan.selectedRecipes>();
    for (const recipe of plan.selectedRecipes) {
      const current = map.get(recipe.catalogueId) || [];
      map.set(recipe.catalogueId, [...current, recipe]);
    }
    return map;
  }, [plan.selectedRecipes]);

  const personalised = useMemo(() => recipeCatalogue.map((recipe) => {
    const planned = plannedByCatalogueId.get(recipe.catalogueId);
    return planned?.[0] || recipe;
  }), [plannedByCatalogueId]);

  const recipes = useMemo(() => personalised.filter((recipe) => {
    const matchCategory = category === "all" || recipe.category === category;
    const haystack = `${recipe.name} ${recipe.description} ${recipe.tags.join(" ")} ${recipe.ingredients.map((item) => item.name).join(" ")}`.toLowerCase();
    return matchCategory && haystack.includes(query.toLowerCase());
  }), [category, query, personalised]);

  if (!hydrated) return <div className="portal-loading">Loading recipes…</div>;

  return (
    <AppShell title="Recipes" subtitle="Recipes in your current week show the batch division chosen by the optimiser. The wider catalogue shows a sensible default division.">
      <section className="recipe-toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes or ingredients…" />
        <div className="filter-tabs">
          {(["all", "breakfast", "lunch", "dinner", "snack"] as const).map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</button>)}
        </div>
      </section>

      <div className="recipe-catalogue">
        {recipes.map((recipe) => {
          const plannedVariants = plannedByCatalogueId.get(recipe.catalogueId) || [];
          const divideCounts = [...new Set(plannedVariants.map((planned) => planned.batchSize))].sort((a, b) => a - b);
          return (
            <article className="catalogue-card" id={recipe.catalogueId} key={recipe.catalogueId}>
              <div className="catalogue-head"><div><span className="meal-type-badge">{recipe.category}</span>{plannedVariants.length > 0 && <span className="planned-badge">IN YOUR WEEK</span>}<h2>{recipe.name}</h2><p>{recipe.description}</p></div><span className="portion-badge">{plannedVariants.length > 0 ? `divide ${divideCounts.join(" / ")}` : `${recipe.batchSize} portions`}</span></div>
              <div className="catalogue-macros"><span><strong>{recipe.calories}</strong> kcal</span><span><strong>{recipe.protein}g</strong> protein</span><span><strong>{recipe.fibre}g</strong> fibre</span><span><strong>{recipe.volume}/10</strong> volume</span><span><strong>{money(recipePortionCost(recipe))}</strong> ingredient value / portion</span></div>
              <div className="catalogue-body">
                <div><h3>Use for one batch</h3><div className="ingredient-mini-list">{recipe.ingredients.map((item) => <p key={item.productId}><span>•</span><strong>{item.name}</strong><small>{item.measure} · sold as {item.pack}</small><b>{money(item.price)}</b></p>)}</div></div>
                <div><h3>Cook & divide</h3><ol className="recipe-method">{recipe.method.map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol></div>
              </div>
              <div className="catalogue-foot"><span>◷ {recipe.prepMinutes + recipe.cookMinutes} min / batch</span><span>⌁ No portion scales</span><strong>{plannedVariants.length > 1 ? `This week: two batches, divide into ${divideCounts.join(" and ")}` : `Divide into ${recipe.batchSize}`}</strong></div>
            </article>
          );
        })}
      </div>

      {!recipes.length && <div className="empty-state"><strong>No matching recipes.</strong><span>Try a different search or filter.</span></div>}
    </AppShell>
  );
}
