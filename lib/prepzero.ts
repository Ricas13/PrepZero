export type Sex = "male" | "female";
export type Goal = "cut" | "maintain" | "bulk";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";

export type UserProfile = {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: Goal;
  mealsPerDay: 3 | 4;
  supermarket: "Aldi";
  diet: "everything" | "vegetarian";
  allergies: string;
  dislikes: string;
};

export type Targets = {
  bmr: number;
  maintenance: number;
  calories: number;
  protein: number;
  fat: number;
  fibre: number;
};

export type IngredientPack = {
  name: string;
  pack: string;
  price: number;
  qty: number;
  aisle: string;
};

export type Recipe = {
  id: string;
  name: string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  description: string;
  batchSize: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fibre: number;
  volume: number;
  prepMinutes: number;
  cookMinutes: number;
  tags: string[];
  ingredients: IngredientPack[];
  method: string[];
};

export type DayMeal = Recipe & { mealLabel: string };
export type DayPlan = {
  day: string;
  meals: DayMeal[];
  calories: number;
  protein: number;
  fibre: number;
  cost: number;
};

export type ShoppingItem = IngredientPack & { checked?: boolean };
export type PrepSession = {
  title: string;
  minutes: number;
  recipes: { name: string; portions: number; instruction: string }[];
};

export type WeeklyPlan = {
  targets: Targets;
  days: DayPlan[];
  shopping: ShoppingItem[];
  prep: PrepSession[];
  weeklyCost: number;
  dailyAverageCost: number;
  wasteCost: number;
  prepMinutes: number;
  efficiency: number;
  selectedRecipes: Recipe[];
};

const activityFactors: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

export const defaultProfile: UserProfile = {
  name: "",
  sex: "male",
  age: 30,
  heightCm: 175,
  weightKg: 75,
  activity: "moderate",
  goal: "maintain",
  mealsPerDay: 4,
  supermarket: "Aldi",
  diet: "everything",
  allergies: "",
  dislikes: "",
};

export function calculateTargets(profile: UserProfile): Targets {
  const sexOffset = profile.sex === "male" ? 5 : -161;
  const bmr = Math.round(10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexOffset);
  const maintenance = Math.round(bmr * activityFactors[profile.activity]);
  const adjustment = profile.goal === "cut" ? -450 : profile.goal === "bulk" ? 300 : 0;
  const calories = Math.max(1400, maintenance + adjustment);
  const proteinMultiplier = profile.goal === "cut" ? 2 : 1.8;
  const protein = Math.round(profile.weightKg * proteinMultiplier);
  const fat = Math.round(profile.weightKg * 0.75);
  const fibre = Math.max(25, Math.round((calories / 1000) * 14));
  return { bmr, maintenance, calories, protein, fat, fibre };
}

export const recipeCatalogue: Recipe[] = [
  {
    id: "overnight-oats",
    name: "Berry yoghurt overnight oats",
    category: "breakfast",
    description: "Thick, filling oats built from full pots and simple scoop measures.",
    batchSize: 4,
    calories: 472,
    protein: 39,
    fat: 9,
    carbs: 60,
    fibre: 10,
    volume: 9,
    prepMinutes: 8,
    cookMinutes: 0,
    tags: ["high-volume", "cold", "vegetarian", "batch"],
    ingredients: [
      { name: "0% Greek yoghurt", pack: "1kg tub", price: 1.85, qty: 1, aisle: "Chilled" },
      { name: "Porridge oats", pack: "1kg bag", price: 1.25, qty: 1, aisle: "Cereal" },
      { name: "Frozen mixed berries", pack: "500g bag", price: 2.15, qty: 1, aisle: "Frozen" },
      { name: "Bananas", pack: "5 pack", price: 0.78, qty: 1, aisle: "Fruit & veg" },
    ],
    method: ["Mix the yoghurt and oats in one large bowl.", "Fold through the berries and sliced banana.", "Divide the bowl equally between 4 containers and chill overnight."],
  },
  {
    id: "french-toast",
    name: "Protein French toast stack",
    category: "breakfast",
    description: "A no-scale breakfast using slices, eggs and a full yoghurt pot.",
    batchSize: 2,
    calories: 505,
    protein: 42,
    fat: 12,
    carbs: 55,
    fibre: 8,
    volume: 8,
    prepMinutes: 5,
    cookMinutes: 12,
    tags: ["hot", "vegetarian", "high-protein"],
    ingredients: [
      { name: "Wholemeal bread", pack: "800g loaf", price: 0.75, qty: 1, aisle: "Bakery" },
      { name: "Eggs", pack: "12 pack", price: 2.35, qty: 1, aisle: "Dairy" },
      { name: "0% Greek yoghurt", pack: "500g tub", price: 0.95, qty: 1, aisle: "Chilled" },
      { name: "Frozen berries", pack: "500g bag", price: 2.15, qty: 1, aisle: "Frozen" },
    ],
    method: ["Beat the eggs in a shallow bowl and coat the bread slices.", "Cook in a non-stick pan until golden.", "Split the toast evenly between 2 plates or containers and top with yoghurt and berries."],
  },
  {
    id: "breakfast-wraps",
    name: "Egg & bean breakfast wraps",
    category: "breakfast",
    description: "Freezer-friendly wraps using complete packs and tins.",
    batchSize: 6,
    calories: 451,
    protein: 31,
    fat: 14,
    carbs: 49,
    fibre: 11,
    volume: 8,
    prepMinutes: 10,
    cookMinutes: 18,
    tags: ["freezer", "vegetarian", "batch"],
    ingredients: [
      { name: "Wholemeal wraps", pack: "6 pack", price: 1.19, qty: 1, aisle: "Bakery" },
      { name: "Eggs", pack: "12 pack", price: 2.35, qty: 1, aisle: "Dairy" },
      { name: "Baked beans", pack: "2 x 420g tins", price: 0.92, qty: 1, aisle: "Tins" },
      { name: "Reduced-fat cheddar slices", pack: "10 slices", price: 1.99, qty: 1, aisle: "Chilled" },
    ],
    method: ["Scramble the eggs and warm the beans.", "Lay out all 6 wraps and distribute the filling evenly.", "Roll, cool and refrigerate or freeze. One wrap is one portion."],
  },
  {
    id: "cajun-pasta",
    name: "Creamy Cajun chicken pasta",
    category: "lunch",
    description: "One batch, whole packs, big portions and almost no ingredient admin.",
    batchSize: 5,
    calories: 626,
    protein: 54,
    fat: 15,
    carbs: 67,
    fibre: 9,
    volume: 9,
    prepMinutes: 10,
    cookMinutes: 22,
    tags: ["high-protein", "high-volume", "batch", "freezer"],
    ingredients: [
      { name: "Chicken breast fillets", pack: "1kg pack", price: 5.49, qty: 1, aisle: "Meat" },
      { name: "Penne pasta", pack: "500g bag", price: 0.75, qty: 1, aisle: "Pasta" },
      { name: "Passata", pack: "500g carton", price: 0.55, qty: 1, aisle: "Tins" },
      { name: "Light soft cheese", pack: "300g tub", price: 1.39, qty: 1, aisle: "Chilled" },
      { name: "Mixed peppers", pack: "3 pack", price: 1.49, qty: 1, aisle: "Fruit & veg" },
      { name: "Cajun seasoning", pack: "jar", price: 0.79, qty: 1, aisle: "Spices" },
    ],
    method: ["Cook the entire pasta pack.", "Dice and cook the full chicken pack with the peppers and Cajun seasoning.", "Add passata and soft cheese, then fold through the pasta.", "Mix thoroughly and divide equally into 5 containers."],
  },
  {
    id: "chilli-potato",
    name: "Loaded beef chilli potatoes",
    category: "lunch",
    description: "High-volume chilli with baked potatoes and complete tins.",
    batchSize: 4,
    calories: 651,
    protein: 48,
    fat: 16,
    carbs: 72,
    fibre: 15,
    volume: 10,
    prepMinutes: 10,
    cookMinutes: 35,
    tags: ["high-volume", "batch", "freezer"],
    ingredients: [
      { name: "5% beef mince", pack: "750g pack", price: 4.79, qty: 1, aisle: "Meat" },
      { name: "Kidney beans", pack: "2 x 400g tins", price: 0.98, qty: 1, aisle: "Tins" },
      { name: "Chopped tomatoes", pack: "2 x 400g tins", price: 0.94, qty: 1, aisle: "Tins" },
      { name: "Baking potatoes", pack: "4 pack", price: 1.35, qty: 1, aisle: "Fruit & veg" },
      { name: "Frozen diced onions", pack: "500g bag", price: 1.05, qty: 1, aisle: "Frozen" },
    ],
    method: ["Bake all 4 potatoes.", "Brown the entire mince pack with onion, then add both tins of beans and tomatoes.", "Simmer until thick.", "Put one potato in each container and divide the chilli evenly over all 4."],
  },
  {
    id: "teriyaki-rice",
    name: "Sticky teriyaki chicken rice",
    category: "lunch",
    description: "Big meal-prep bowls with frozen veg and a simple packet-based shop.",
    batchSize: 5,
    calories: 612,
    protein: 51,
    fat: 11,
    carbs: 73,
    fibre: 10,
    volume: 9,
    prepMinutes: 8,
    cookMinutes: 24,
    tags: ["high-protein", "batch", "freezer"],
    ingredients: [
      { name: "Chicken breast fillets", pack: "1kg pack", price: 5.49, qty: 1, aisle: "Meat" },
      { name: "Long grain rice", pack: "500g bag", price: 0.79, qty: 1, aisle: "Rice" },
      { name: "Frozen mixed vegetables", pack: "1kg bag", price: 1.65, qty: 1, aisle: "Frozen" },
      { name: "Teriyaki sauce", pack: "250ml bottle", price: 1.29, qty: 1, aisle: "Sauces" },
    ],
    method: ["Cook the full rice pack.", "Cook the chicken and frozen vegetables in a large pan.", "Add the teriyaki sauce and rice, mixing very thoroughly.", "Divide evenly into 5 containers."],
  },
  {
    id: "fajita-rice",
    name: "Smoky fajita chicken rice",
    category: "dinner",
    description: "Whole-pack chicken and peppers with filling rice and salsa.",
    batchSize: 5,
    calories: 641,
    protein: 53,
    fat: 13,
    carbs: 76,
    fibre: 11,
    volume: 9,
    prepMinutes: 10,
    cookMinutes: 24,
    tags: ["high-protein", "batch", "freezer"],
    ingredients: [
      { name: "Chicken breast fillets", pack: "1kg pack", price: 5.49, qty: 1, aisle: "Meat" },
      { name: "Long grain rice", pack: "500g bag", price: 0.79, qty: 1, aisle: "Rice" },
      { name: "Mixed peppers", pack: "3 pack", price: 1.49, qty: 1, aisle: "Fruit & veg" },
      { name: "Black beans", pack: "2 x 400g tins", price: 1.18, qty: 1, aisle: "Tins" },
      { name: "Salsa", pack: "300g jar", price: 0.99, qty: 1, aisle: "Sauces" },
    ],
    method: ["Cook the rice.", "Cook the full chicken pack with sliced peppers.", "Add the drained beans and salsa.", "Mix with the rice and divide evenly into 5 containers."],
  },
  {
    id: "turkey-bolognese",
    name: "Hidden-veg turkey bolognese",
    category: "dinner",
    description: "A high-volume pasta batch with plenty of vegetables hidden in the sauce.",
    batchSize: 5,
    calories: 603,
    protein: 49,
    fat: 12,
    carbs: 72,
    fibre: 13,
    volume: 10,
    prepMinutes: 10,
    cookMinutes: 30,
    tags: ["high-volume", "batch", "freezer"],
    ingredients: [
      { name: "Turkey mince", pack: "750g pack", price: 4.25, qty: 1, aisle: "Meat" },
      { name: "Wholewheat spaghetti", pack: "500g bag", price: 0.89, qty: 1, aisle: "Pasta" },
      { name: "Chopped tomatoes", pack: "2 x 400g tins", price: 0.94, qty: 1, aisle: "Tins" },
      { name: "Frozen mixed vegetables", pack: "1kg bag", price: 1.65, qty: 1, aisle: "Frozen" },
      { name: "Frozen diced onions", pack: "500g bag", price: 1.05, qty: 1, aisle: "Frozen" },
    ],
    method: ["Cook the full spaghetti pack.", "Brown all of the turkey mince and onion.", "Add tomatoes and frozen vegetables and simmer.", "Mix with the spaghetti and divide equally into 5 containers."],
  },
  {
    id: "bean-curry",
    name: "Creamy chickpea & lentil curry",
    category: "dinner",
    description: "Cheap, filling and fibre-rich with complete tins and no awkward leftovers.",
    batchSize: 5,
    calories: 584,
    protein: 28,
    fat: 14,
    carbs: 78,
    fibre: 19,
    volume: 10,
    prepMinutes: 8,
    cookMinutes: 25,
    tags: ["vegetarian", "high-volume", "batch", "freezer"],
    ingredients: [
      { name: "Chickpeas", pack: "2 x 400g tins", price: 0.94, qty: 1, aisle: "Tins" },
      { name: "Green lentils", pack: "2 x 400g tins", price: 1.10, qty: 1, aisle: "Tins" },
      { name: "Light coconut milk", pack: "400ml tin", price: 0.89, qty: 1, aisle: "Tins" },
      { name: "Long grain rice", pack: "500g bag", price: 0.79, qty: 1, aisle: "Rice" },
      { name: "Frozen mixed vegetables", pack: "1kg bag", price: 1.65, qty: 1, aisle: "Frozen" },
    ],
    method: ["Cook the entire rice pack.", "Simmer the drained chickpeas and lentils with coconut milk and vegetables.", "Season with curry powder and salt.", "Mix or portion side-by-side and divide into 5 containers."],
  },
  {
    id: "yoghurt-crunch",
    name: "Yoghurt crunch pot",
    category: "snack",
    description: "A large high-protein snack with no weighing at serving time.",
    batchSize: 4,
    calories: 312,
    protein: 28,
    fat: 6,
    carbs: 36,
    fibre: 7,
    volume: 8,
    prepMinutes: 5,
    cookMinutes: 0,
    tags: ["vegetarian", "cold", "quick"],
    ingredients: [
      { name: "0% Greek yoghurt", pack: "1kg tub", price: 1.85, qty: 1, aisle: "Chilled" },
      { name: "High-protein granola", pack: "400g bag", price: 2.49, qty: 1, aisle: "Cereal" },
      { name: "Apples", pack: "6 pack", price: 1.29, qty: 1, aisle: "Fruit & veg" },
    ],
    method: ["Split the yoghurt between 4 pots.", "Top each with granola and chopped apple.", "Keep chilled."],
  },
  {
    id: "egg-wrap-snack",
    name: "Egg & cheese snack wrap",
    category: "snack",
    description: "Countable ingredients, portable, filling and easy to batch.",
    batchSize: 4,
    calories: 338,
    protein: 26,
    fat: 15,
    carbs: 26,
    fibre: 6,
    volume: 7,
    prepMinutes: 5,
    cookMinutes: 10,
    tags: ["vegetarian", "portable"],
    ingredients: [
      { name: "Wholemeal wraps", pack: "8 pack", price: 1.29, qty: 1, aisle: "Bakery" },
      { name: "Eggs", pack: "12 pack", price: 2.35, qty: 1, aisle: "Dairy" },
      { name: "Reduced-fat cheddar slices", pack: "10 slices", price: 1.99, qty: 1, aisle: "Chilled" },
    ],
    method: ["Cook the eggs.", "Fill 4 wraps with equal egg portions and one cheese slice each.", "Roll and refrigerate."],
  },
  {
    id: "cottage-cheese-fruit",
    name: "Cottage cheese fruit bowl",
    category: "snack",
    description: "Cold, high-volume and ready in minutes using simple half-tub portions.",
    batchSize: 2,
    calories: 286,
    protein: 30,
    fat: 5,
    carbs: 31,
    fibre: 6,
    volume: 9,
    prepMinutes: 4,
    cookMinutes: 0,
    tags: ["vegetarian", "cold", "high-volume"],
    ingredients: [
      { name: "Low-fat cottage cheese", pack: "600g tub", price: 1.59, qty: 1, aisle: "Chilled" },
      { name: "Pineapple chunks", pack: "400g tin", price: 0.89, qty: 1, aisle: "Tins" },
    ],
    method: ["Drain the pineapple.", "Split both the cottage cheese and pineapple evenly between 2 bowls or tubs."],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function recipeCost(recipe: Recipe) {
  return recipe.ingredients.reduce((sum, item) => sum + item.price * item.qty, 0) / recipe.batchSize;
}

function textContainsAny(recipe: Recipe, terms: string[]) {
  const haystack = `${recipe.name} ${recipe.description} ${recipe.ingredients.map((i) => i.name).join(" ")} ${recipe.tags.join(" ")}`.toLowerCase();
  return terms.some((term) => term && haystack.includes(term));
}

function eligibleRecipes(profile: UserProfile) {
  const blocked = `${profile.allergies},${profile.dislikes}`
    .toLowerCase()
    .split(/[,;]/)
    .map((x) => x.trim())
    .filter(Boolean);
  return recipeCatalogue.filter((recipe) => {
    if (profile.diet === "vegetarian" && !recipe.tags.includes("vegetarian")) return false;
    return !textContainsAny(recipe, blocked);
  });
}

function choosePair(recipes: Recipe[], category: Recipe["category"], targets: Targets, mealsPerDay: number) {
  const pool = recipes.filter((r) => r.category === category);
  if (!pool.length) return [];
  const desiredCalories = targets.calories / mealsPerDay;
  const desiredProtein = targets.protein / mealsPerDay;
  const scored = pool
    .map((r) => {
      const underProtein = Math.max(0, desiredProtein - r.protein);
      const calorieGap = Math.abs(desiredCalories - r.calories);
      const score = calorieGap * 0.04 + underProtein * 2 + recipeCost(r) * 5 + (10 - r.volume) * 1.5 + (r.prepMinutes + r.cookMinutes) * 0.03;
      return { r, score };
    })
    .sort((a, b) => a.score - b.score);
  return scored.slice(0, Math.min(2, scored.length)).map((x) => x.r);
}

function aggregateShopping(selectedRecipes: Recipe[], servings: Map<string, number>) {
  const map = new Map<string, ShoppingItem>();
  for (const recipe of selectedRecipes) {
    const portions = servings.get(recipe.id) || 0;
    if (!portions) continue;
    const batches = Math.ceil(portions / recipe.batchSize);
    for (const item of recipe.ingredients) {
      const key = `${item.name}|${item.pack}|${item.price}`;
      const existing = map.get(key);
      if (existing) existing.qty += item.qty * batches;
      else map.set(key, { ...item, qty: item.qty * batches });
    }
  }
  return [...map.values()].sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}

function estimateWaste(selectedRecipes: Recipe[], servings: Map<string, number>) {
  let waste = 0;
  for (const recipe of selectedRecipes) {
    const portions = servings.get(recipe.id) || 0;
    if (!portions) continue;
    const batches = Math.ceil(portions / recipe.batchSize);
    const unusedPortions = batches * recipe.batchSize - portions;
    if (unusedPortions > 0) waste += unusedPortions * recipeCost(recipe) * 0.12;
  }
  return Math.round(waste * 100) / 100;
}

export function generateWeeklyPlan(profile: UserProfile): WeeklyPlan {
  const targets = calculateTargets(profile);
  const eligible = eligibleRecipes(profile);
  const breakfasts = choosePair(eligible, "breakfast", targets, profile.mealsPerDay);
  const lunches = choosePair(eligible, "lunch", targets, profile.mealsPerDay);
  const dinners = choosePair(eligible, "dinner", targets, profile.mealsPerDay);
  const snacks = profile.mealsPerDay === 4 ? choosePair(eligible, "snack", targets, profile.mealsPerDay) : [];

  const fallback = (cat: Recipe["category"]) => recipeCatalogue.find((r) => r.category === cat)!;
  const b = breakfasts.length ? breakfasts : [fallback("breakfast")];
  const l = lunches.length ? lunches : [fallback("lunch")];
  const d = dinners.length ? dinners : [fallback("dinner")];
  const s = snacks.length ? snacks : profile.mealsPerDay === 4 ? [fallback("snack")] : [];

  const servings = new Map<string, number>();
  const dayPlans: DayPlan[] = days.map((day, index) => {
    const chosen = [b[index % b.length], l[index % l.length], d[index % d.length], ...(profile.mealsPerDay === 4 ? [s[index % s.length]] : [])];
    const labels = profile.mealsPerDay === 4 ? ["Breakfast", "Lunch", "Dinner", "Snack"] : ["Breakfast", "Lunch", "Dinner"];
    const meals: DayMeal[] = chosen.map((recipe, i) => {
      servings.set(recipe.id, (servings.get(recipe.id) || 0) + 1);
      return { ...recipe, mealLabel: labels[i] };
    });
    const calories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
    const fibre = meals.reduce((sum, meal) => sum + meal.fibre, 0);
    const cost = meals.reduce((sum, meal) => sum + recipeCost(meal), 0);
    return { day, meals, calories, protein, fibre, cost };
  });

  const selectedRecipes = [...new Map(dayPlans.flatMap((x) => x.meals).map((r) => [r.id, r])).values()];
  const shopping = aggregateShopping(selectedRecipes, servings);
  const weeklyCost = Math.round(shopping.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100;
  const wasteCost = estimateWaste(selectedRecipes, servings);
  const prepMinutes = selectedRecipes.reduce((sum, recipe) => {
    const portions = servings.get(recipe.id) || 0;
    const batches = Math.ceil(portions / recipe.batchSize);
    return sum + (recipe.prepMinutes + recipe.cookMinutes) * batches;
  }, 0);

  const prep: PrepSession[] = [
    {
      title: "Sunday prep",
      minutes: Math.round(prepMinutes * 0.62),
      recipes: selectedRecipes.slice(0, Math.ceil(selectedRecipes.length / 2)).map((r) => ({
        name: r.name,
        portions: servings.get(r.id) || 0,
        instruction: `Cook the planned batch, mix thoroughly and divide into ${servings.get(r.id) || r.batchSize} equal portions.`,
      })),
    },
    {
      title: "Midweek top-up",
      minutes: Math.max(10, prepMinutes - Math.round(prepMinutes * 0.62)),
      recipes: selectedRecipes.slice(Math.ceil(selectedRecipes.length / 2)).map((r) => ({
        name: r.name,
        portions: servings.get(r.id) || 0,
        instruction: `Cook the planned batch and split it evenly into ${servings.get(r.id) || r.batchSize} portions.`,
      })),
    },
  ].filter((session) => session.recipes.length > 0);

  const avgCalories = dayPlans.reduce((s, x) => s + x.calories, 0) / 7;
  const avgProtein = dayPlans.reduce((s, x) => s + x.protein, 0) / 7;
  const calorieFit = Math.max(0, 1 - Math.abs(avgCalories - targets.calories) / targets.calories);
  const proteinFit = Math.min(1, avgProtein / Math.max(1, targets.protein));
  const wasteFit = Math.max(0, 1 - wasteCost / Math.max(1, weeklyCost));
  const timeFit = Math.max(0, 1 - prepMinutes / 420);
  const efficiency = Math.round((calorieFit * 0.3 + proteinFit * 0.3 + wasteFit * 0.25 + timeFit * 0.15) * 100);

  return {
    targets,
    days: dayPlans,
    shopping,
    prep,
    weeklyCost,
    dailyAverageCost: Math.round((weeklyCost / 7) * 100) / 100,
    wasteCost,
    prepMinutes,
    efficiency,
    selectedRecipes,
  };
}

export function money(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

export function minutesLabel(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}
