"use client";

import { useMemo, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { recipeCatalogue, money } from "../../lib/prepzero";

export default function RecipesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "breakfast" | "lunch" | "dinner" | "snack">("all");

  const recipes = useMemo(() => recipeCatalogue.filter((recipe) => {
    const matchCategory = category === "all" || recipe.category === category;
    const haystack = `${recipe.name} ${recipe.description} ${recipe.tags.join(" ")}`.toLowerCase();
    return matchCategory && haystack.includes(query.toLowerCase());
  }), [category, query]);

  return (
    <AppShell title="Recipes" subtitle="Structured around complete packs, simple counts and batch portions — not awkward gram-level serving maths.">
      <section className="recipe-toolbar">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes…" />
        <div className="filter-tabs">
          {(["all", "breakfast", "lunch", "dinner", "snack"] as const).map((value) => <button key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</button>)}
        </div>
      </section>

      <div className="recipe-catalogue">
        {recipes.map((recipe) => {
          const batchCost = recipe.ingredients.reduce((sum, i) => sum + i.price * i.qty, 0);
          return (
            <article className="catalogue-card" id={recipe.id} key={recipe.id}>
              <div className="catalogue-head"><div><span className="meal-type-badge">{recipe.category}</span><h2>{recipe.name}</h2><p>{recipe.description}</p></div><span className="portion-badge">{recipe.batchSize} portions</span></div>
              <div className="catalogue-macros"><span><strong>{recipe.calories}</strong> kcal</span><span><strong>{recipe.protein}g</strong> protein</span><span><strong>{recipe.fibre}g</strong> fibre</span><span><strong>{recipe.volume}/10</strong> volume</span><span><strong>{money(batchCost / recipe.batchSize)}</strong> / portion</span></div>
              <div className="catalogue-body">
                <div><h3>Buy for the batch</h3><div className="ingredient-mini-list">{recipe.ingredients.map((item) => <p key={`${item.name}-${item.pack}`}><span>{item.qty}×</span><strong>{item.name}</strong><small>{item.pack}</small><b>{money(item.price * item.qty)}</b></p>)}</div></div>
                <div><h3>Cook & divide</h3><ol className="recipe-method">{recipe.method.map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol></div>
              </div>
              <div className="catalogue-foot"><span>◷ {recipe.prepMinutes + recipe.cookMinutes} min total</span><span>⌁ No portion scales</span><strong>Divide into {recipe.batchSize}</strong></div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
