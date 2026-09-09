# PrepZero

**Buy it. Cook it. Divide it. Done.**

PrepZero is a zero-fuss food-efficiency planner. It calculates nutrition targets from the user's body and goal, then builds a weekly meal plan around structured recipes and real supermarket pack sizes to reduce cost, waste, kitchen time and portion weighing.

## What is included

- Responsive public landing page
- 4-step onboarding flow
- Mifflin-St Jeor BMR / activity-based maintenance calculation
- Cut, maintain and gain targets
- Deterministic weekly planning engine (no LLM required)
- Structured recipe catalogue
- Aldi launch product / pack-size data
- Weekly overview dashboard
- Daily meal-plan view
- Interactive shopping list with browser persistence
- Prep schedule with batch instructions
- No-scale divide-and-portion workflow
- Searchable recipe catalogue
- Profile, diet, allergy and dislike settings
- Responsive desktop and mobile portal navigation
- GitHub Actions build validation

## Product principles

1. Nutrition targets come first.
2. Prefer complete supermarket packs, tins and countable ingredients.
3. Minimise unused food.
4. Minimise cooking sessions and kitchen time.
5. Avoid portion weighing wherever possible.
6. Keep meals filling, nutritious and enjoyable.
7. Do not save a few pennies if it makes the plan materially harder to follow.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/` — public landing page
- `/onboarding` — body, goal and preference setup
- `/dashboard` — weekly overview
- `/plan` — full week
- `/shopping` — pack-based shopping list
- `/prep` — prep sessions and divide instructions
- `/recipes` — structured recipe catalogue
- `/settings` — profile and plan settings

## Stack

- Next.js 15
- React 19
- TypeScript
- Plain responsive CSS
- Deterministic TypeScript nutrition/planning engine
- Browser localStorage for MVP persistence

## Current data status

The app ships with a small curated recipe catalogue and a bundled Aldi-style launch catalogue so the complete product flow works without an external API. Retail prices in the MVP are seed data and should not be represented to users as live pricing. The data model deliberately keeps recipes/ingredients separate from retail products so a live supermarket catalogue can replace the seed data later without rewriting the portal.

## Production follow-ons

The current branch is a functional, deployable MVP/demo. Before handling real customer accounts commercially, add production authentication/database persistence, verified live retailer pricing, a larger licensed/owned recipe catalogue, nutrition-data QA, legal/privacy documents and payments if required.
