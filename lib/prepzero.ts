export type Sex = "male" | "female";
export type Goal = "cut" | "maintain" | "bulk";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";
export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

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

type Macros = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fibre: number;
};

type Product = {
  id: string;
  name: string;
  pack: string;
  price: number;
  aisle: string;
  packUnits: number;
  unit: string;
  macrosPerUnit: Macros;
  wasteFactor: number;
};

type TemplateIngredient = {
  productId: string;
  units: number;
  measure: string;
};

type RecipeTemplate = {
  id: string;
  name: string;
  category: MealCategory;
  description: string;
  portionOptions: number[];
  defaultPortions: number;
  volume: number;
  prepMinutes: number;
  cookMinutes: number;
  tags: string[];
  allergens: string[];
  vegetarian: boolean;
  ingredients: TemplateIngredient[];
  method: string[];
};

export type IngredientPack = {
  productId: string;
  name: string;
  pack: string;
  price: number;
  qty: number;
  aisle: string;
  measure: string;
  usedAmount: number;
  packAmount: number;
  unit: string;
};

export type Recipe = {
  id: string;
  catalogueId: string;
  name: string;
  category: MealCategory;
  description: string;
  batchSize: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fibre: number;
  batchCalories: number;
  batchProtein: number;
  batchFat: number;
  batchCarbs: number;
  batchFibre: number;
  volume: number;
  prepMinutes: number;
  cookMinutes: number;
  tags: string[];
  allergens: string[];
  ingredients: IngredientPack[];
  method: string[];
};

export type DayMeal = Recipe & { mealLabel: string };
export type DayPlan = {
  day: string;
  meals: DayMeal[];
  calories: number;
  protein: number;
  fat: number;
  fibre: number;
  cost: number;
};

export type ShoppingItem = {
  productId: string;
  name: string;
  pack: string;
  price: number;
  qty: number;
  aisle: string;
  usedAmount: number;
  leftoverAmount: number;
  packAmount: number;
  unit: string;
  wasteRiskValue: number;
  checked?: boolean;
};

export type PrepSession = {
  title: string;
  minutes: number;
  recipes: { id: string; name: string; portions: number; instruction: string }[];
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
  nutritionFit: number;
  averages: { calories: number; protein: number; fat: number; fibre: number };
  selectedRecipes: Recipe[];
  warnings: string[];
};

const ZERO: Macros = { calories: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
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

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function normalizeProfile(input: Partial<UserProfile>): UserProfile {
  const merged = { ...defaultProfile, ...input } as UserProfile;
  const activity: Activity = ["sedentary", "light", "moderate", "active", "very-active"].includes(merged.activity) ? merged.activity : "moderate";
  const goal: Goal = ["cut", "maintain", "bulk"].includes(merged.goal) ? merged.goal : "maintain";
  return {
    ...merged,
    name: String(merged.name || "").trim().slice(0, 60),
    age: Math.round(clamp(Number(merged.age), 18, 90)),
    heightCm: Math.round(clamp(Number(merged.heightCm), 130, 230)),
    weightKg: Math.round(clamp(Number(merged.weightKg), 35, 300) * 10) / 10,
    sex: merged.sex === "female" ? "female" : "male",
    activity,
    goal,
    mealsPerDay: merged.mealsPerDay === 3 ? 3 : 4,
    supermarket: "Aldi",
    diet: merged.diet === "vegetarian" ? "vegetarian" : "everything",
    allergies: String(merged.allergies || "").slice(0, 250),
    dislikes: String(merged.dislikes || "").slice(0, 250),
  };
}

export function calculateTargets(rawProfile: UserProfile): Targets {
  const profile = normalizeProfile(rawProfile);
  const offset = profile.sex === "male" ? 5 : -161;
  const bmr = Math.round(10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + offset);
  const maintenance = Math.round(bmr * activityFactors[profile.activity]);
  const goalFactor = profile.goal === "cut" ? 0.85 : profile.goal === "bulk" ? 1.08 : 1;
  const floor = profile.sex === "male" ? 1500 : 1200;
  const calories = Math.max(floor, Math.round(maintenance * goalFactor));
  const protein = Math.round(profile.weightKg * (profile.goal === "cut" ? 2 : 1.8));
  const fat = Math.round(profile.weightKg * 0.75);
  const fibre = Math.max(25, Math.round((calories / 1000) * 14));
  return { bmr, maintenance, calories, protein, fat, fibre };
}

function macros(calories: number, protein: number, fat: number, carbs: number, fibre: number): Macros {
  return { calories, protein, fat, carbs, fibre };
}

const products: Product[] = [
  { id: "yoghurt", name: "0% Greek yoghurt", pack: "1kg tub", price: 1.85, aisle: "Chilled", packUnits: 1, unit: "tub", macrosPerUnit: macros(590, 100, 4, 40, 0), wasteFactor: 0.9 },
  { id: "oats", name: "Porridge oats", pack: "1kg bag", price: 1.25, aisle: "Cereal", packUnits: 1, unit: "bag", macrosPerUnit: macros(3700, 130, 70, 600, 100), wasteFactor: 0.02 },
  { id: "berries", name: "Frozen mixed berries", pack: "500g bag", price: 2.15, aisle: "Frozen", packUnits: 1, unit: "bag", macrosPerUnit: macros(250, 5, 2.5, 50, 25), wasteFactor: 0.03 },
  { id: "banana", name: "Bananas", pack: "5 pack", price: 0.78, aisle: "Fruit & veg", packUnits: 5, unit: "banana", macrosPerUnit: macros(105, 1.3, 0.4, 27, 3), wasteFactor: 0.8 },
  { id: "apples", name: "Apples", pack: "6 pack", price: 1.29, aisle: "Fruit & veg", packUnits: 6, unit: "apple", macrosPerUnit: macros(95, 0.5, 0.3, 25, 4.4), wasteFactor: 0.8 },
  { id: "bread", name: "Wholemeal bread", pack: "800g loaf", price: 0.75, aisle: "Bakery", packUnits: 20, unit: "slice", macrosPerUnit: macros(95, 4, 1, 17, 2.5), wasteFactor: 0.45 },
  { id: "eggs", name: "Eggs", pack: "12 pack", price: 2.35, aisle: "Dairy", packUnits: 12, unit: "egg", macrosPerUnit: macros(70, 6.3, 4.8, 0.4, 0), wasteFactor: 0.35 },
  { id: "wraps", name: "Wholemeal wraps", pack: "8 pack", price: 1.29, aisle: "Bakery", packUnits: 8, unit: "wrap", macrosPerUnit: macros(180, 6, 4, 30, 5), wasteFactor: 0.35 },
  { id: "baked-beans", name: "Baked beans", pack: "2 x 420g tins", price: 0.92, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(330, 20, 2, 54, 14), wasteFactor: 0.02 },
  { id: "cheese-slices", name: "Reduced-fat cheddar slices", pack: "10 slices", price: 1.99, aisle: "Chilled", packUnits: 10, unit: "slice", macrosPerUnit: macros(50, 5, 3.5, 1, 0), wasteFactor: 0.75 },
  { id: "chicken", name: "Chicken breast fillets", pack: "1kg pack", price: 5.49, aisle: "Meat", packUnits: 1, unit: "pack", macrosPerUnit: macros(1100, 230, 15, 0, 0), wasteFactor: 1 },
  { id: "beef", name: "5% beef mince", pack: "750g pack", price: 4.79, aisle: "Meat", packUnits: 1, unit: "pack", macrosPerUnit: macros(1028, 161, 37.5, 0, 0), wasteFactor: 1 },
  { id: "turkey", name: "Turkey mince", pack: "750g pack", price: 4.25, aisle: "Meat", packUnits: 1, unit: "pack", macrosPerUnit: macros(975, 165, 37.5, 0, 0), wasteFactor: 1 },
  { id: "penne", name: "Penne pasta", pack: "500g bag", price: 0.75, aisle: "Pasta", packUnits: 1, unit: "bag", macrosPerUnit: macros(1750, 60, 10, 360, 17.5), wasteFactor: 0.02 },
  { id: "spaghetti", name: "Wholewheat spaghetti", pack: "500g bag", price: 0.89, aisle: "Pasta", packUnits: 1, unit: "bag", macrosPerUnit: macros(1750, 60, 10, 360, 17.5), wasteFactor: 0.02 },
  { id: "rice", name: "Long grain rice", pack: "500g bag", price: 0.79, aisle: "Rice", packUnits: 1, unit: "bag", macrosPerUnit: macros(1800, 35, 5, 400, 5), wasteFactor: 0.02 },
  { id: "passata", name: "Passata", pack: "500g carton", price: 0.55, aisle: "Tins", packUnits: 1, unit: "carton", macrosPerUnit: macros(150, 7, 1, 25, 7.5), wasteFactor: 0.75 },
  { id: "tomatoes", name: "Chopped tomatoes", pack: "2 x 400g tins", price: 0.94, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(100, 4.8, 0.8, 16, 6), wasteFactor: 0.02 },
  { id: "kidney", name: "Kidney beans", pack: "2 x 400g tins", price: 0.98, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(230, 16, 1.2, 34, 14.4), wasteFactor: 0.02 },
  { id: "chickpeas", name: "Chickpeas", pack: "2 x 400g tins", price: 0.94, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(300, 15, 5, 45, 12), wasteFactor: 0.02 },
  { id: "lentils", name: "Green lentils", pack: "2 x 400g tins", price: 1.10, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(280, 20, 1, 45, 17), wasteFactor: 0.02 },
  { id: "corn", name: "Sweetcorn", pack: "2 x 340g tins", price: 1.05, aisle: "Tins", packUnits: 2, unit: "tin", macrosPerUnit: macros(220, 7, 3, 40, 7), wasteFactor: 0.02 },
  { id: "potatoes", name: "Baking potatoes", pack: "4 pack", price: 1.35, aisle: "Fruit & veg", packUnits: 4, unit: "potato", macrosPerUnit: macros(230, 6, 0.3, 52, 6), wasteFactor: 0.8 },
  { id: "peppers", name: "Mixed peppers", pack: "3 pack", price: 1.49, aisle: "Fruit & veg", packUnits: 3, unit: "pepper", macrosPerUnit: macros(35, 1.2, 0.3, 7, 2), wasteFactor: 0.85 },
  { id: "mixed-veg", name: "Frozen mixed vegetables", pack: "1kg bag", price: 1.65, aisle: "Frozen", packUnits: 1, unit: "bag", macrosPerUnit: macros(450, 30, 5, 70, 30), wasteFactor: 0.03 },
  { id: "onions", name: "Frozen diced onions", pack: "500g bag", price: 1.05, aisle: "Frozen", packUnits: 1, unit: "bag", macrosPerUnit: macros(175, 5, 0.5, 40, 10), wasteFactor: 0.03 },
  { id: "soft-cheese", name: "Light soft cheese", pack: "300g tub", price: 1.39, aisle: "Chilled", packUnits: 1, unit: "tub", macrosPerUnit: macros(450, 24, 24, 30, 0), wasteFactor: 0.9 },
  { id: "cottage", name: "Low-fat cottage cheese", pack: "600g tub", price: 1.59, aisle: "Chilled", packUnits: 1, unit: "tub", macrosPerUnit: macros(480, 72, 12, 24, 0), wasteFactor: 0.9 },
  { id: "cheddar", name: "Reduced-fat cheddar", pack: "400g block", price: 2.99, aisle: "Chilled", packUnits: 1, unit: "block", macrosPerUnit: macros(1120, 120, 72, 8, 0), wasteFactor: 0.75 },
  { id: "tofu", name: "Firm tofu", pack: "4 x 200g blocks", price: 4.20, aisle: "Chilled", packUnits: 4, unit: "block", macrosPerUnit: macros(240, 28, 14, 6, 4), wasteFactor: 0.85 },
  { id: "skyr", name: "High-protein skyr pots", pack: "4 pack", price: 2.39, aisle: "Chilled", packUnits: 4, unit: "pot", macrosPerUnit: macros(100, 17, 0, 8, 0), wasteFactor: 0.85 },
  { id: "granola", name: "High-protein granola", pack: "400g bag", price: 2.49, aisle: "Cereal", packUnits: 1, unit: "bag", macrosPerUnit: macros(1800, 80, 60, 220, 32), wasteFactor: 0.03 },
  { id: "pineapple", name: "Pineapple chunks", pack: "400g tin", price: 0.89, aisle: "Tins", packUnits: 1, unit: "tin", macrosPerUnit: macros(240, 2, 0.4, 60, 5.2), wasteFactor: 0.05 },
  { id: "coconut", name: "Light coconut milk", pack: "400ml tin", price: 0.89, aisle: "Tins", packUnits: 1, unit: "tin", macrosPerUnit: macros(340, 4, 28, 16, 0), wasteFactor: 0.05 },
  { id: "teriyaki", name: "Teriyaki sauce", pack: "250ml bottle", price: 1.29, aisle: "Sauces", packUnits: 1, unit: "bottle", macrosPerUnit: macros(300, 5, 0, 67.5, 0), wasteFactor: 0.1 },
  { id: "satay", name: "Satay stir-fry sauce", pack: "250g pouch", price: 1.39, aisle: "Sauces", packUnits: 1, unit: "pouch", macrosPerUnit: macros(450, 15, 30, 30, 5), wasteFactor: 0.35 },
  { id: "salsa", name: "Tomato salsa", pack: "300g jar", price: 1.19, aisle: "Sauces", packUnits: 1, unit: "jar", macrosPerUnit: macros(120, 4, 1, 24, 6), wasteFactor: 0.35 },
  { id: "cajun", name: "Cajun seasoning", pack: "jar", price: 0.79, aisle: "Spices", packUnits: 1, unit: "jar", macrosPerUnit: macros(50, 2, 1, 8, 2), wasteFactor: 0 },
];

const productById = new Map(products.map((product) => [product.id, product]));

const portions = [2, 3, 4, 5];
const recipeTemplates: RecipeTemplate[] = [
  {
    id: "overnight-oats", name: "Berry yoghurt overnight oats", category: "breakfast", description: "Cold, filling oats using obvious pack fractions and fruit.",
    portionOptions: portions, defaultPortions: 4, volume: 9, prepMinutes: 8, cookMinutes: 0, tags: ["cold", "batch", "vegetarian", "high-volume"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [{ productId: "yoghurt", units: 0.5, measure: "Half the yoghurt tub" }, { productId: "oats", units: 0.2, measure: "One-fifth of the oat bag" }, { productId: "berries", units: 0.5, measure: "Half the berry bag" }, { productId: "banana", units: 2, measure: "2 bananas" }],
    method: ["Mix the yoghurt and oats in one large bowl.", "Fold through the berries and sliced banana.", "Chill, then divide the finished batch evenly."],
  },
  {
    id: "french-toast", name: "Protein French toast stack", category: "breakfast", description: "Count bread slices and eggs, then split the finished stack.",
    portionOptions: portions, defaultPortions: 4, volume: 8, prepMinutes: 5, cookMinutes: 12, tags: ["hot", "vegetarian"], allergens: ["egg", "milk", "gluten"], vegetarian: true,
    ingredients: [{ productId: "bread", units: 8, measure: "8 bread slices" }, { productId: "eggs", units: 6, measure: "6 eggs" }, { productId: "yoghurt", units: 0.5, measure: "Half the yoghurt tub" }, { productId: "berries", units: 0.5, measure: "Half the berry bag" }],
    method: ["Beat the eggs and coat the bread.", "Cook in a non-stick pan until golden.", "Add yoghurt and berries, then divide the full batch evenly."],
  },
  {
    id: "breakfast-wraps", name: "Egg & bean breakfast wraps", category: "breakfast", description: "Portable breakfast built from countable wraps, eggs and beans.",
    portionOptions: portions, defaultPortions: 4, volume: 8, prepMinutes: 10, cookMinutes: 18, tags: ["freezer", "vegetarian", "batch"], allergens: ["egg", "gluten"], vegetarian: true,
    ingredients: [{ productId: "wraps", units: 4, measure: "4 wraps" }, { productId: "eggs", units: 6, measure: "6 eggs" }, { productId: "baked-beans", units: 1, measure: "1 tin of beans" }],
    method: ["Scramble the eggs and warm the beans.", "Distribute the filling between the wraps.", "Roll, cool and refrigerate or freeze."],
  },
  {
    id: "potato-hash", name: "Egg, bean & potato breakfast hash", category: "breakfast", description: "A gluten-free-by-ingredients breakfast built from whole potatoes, eggs and beans.",
    portionOptions: portions, defaultPortions: 3, volume: 10, prepMinutes: 8, cookMinutes: 25, tags: ["vegetarian", "high-volume"], allergens: ["egg"], vegetarian: true,
    ingredients: [{ productId: "eggs", units: 6, measure: "6 eggs" }, { productId: "potatoes", units: 2, measure: "2 potatoes" }, { productId: "baked-beans", units: 1, measure: "1 tin of beans" }, { productId: "peppers", units: 1, measure: "1 pepper" }],
    method: ["Dice and cook the potatoes and pepper until tender.", "Add the eggs and cook through.", "Serve with the warmed beans and divide evenly."],
  },
  {
    id: "tofu-breakfast-wraps", name: "Tofu breakfast wraps", category: "breakfast", description: "Dairy- and egg-free breakfast using countable tofu blocks and wraps.",
    portionOptions: portions, defaultPortions: 4, volume: 9, prepMinutes: 8, cookMinutes: 15, tags: ["vegetarian", "batch"], allergens: ["soy", "gluten"], vegetarian: true,
    ingredients: [{ productId: "tofu", units: 2, measure: "2 tofu blocks" }, { productId: "wraps", units: 4, measure: "4 wraps" }, { productId: "baked-beans", units: 1, measure: "1 tin of beans" }, { productId: "peppers", units: 1, measure: "1 pepper" }],
    method: ["Crumble and cook the tofu with the pepper.", "Warm the beans.", "Fill the wraps evenly and roll."],
  },
  {
    id: "cajun-pasta", name: "Creamy Cajun chicken pasta", category: "lunch", description: "High-protein pasta that shares half-packs efficiently across the week.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 22, tags: ["high-protein", "batch", "freezer"], allergens: ["milk", "gluten"], vegetarian: false,
    ingredients: [{ productId: "chicken", units: 0.5, measure: "Half the chicken pack" }, { productId: "penne", units: 0.5, measure: "Half the pasta bag" }, { productId: "passata", units: 0.5, measure: "Half the passata carton" }, { productId: "soft-cheese", units: 0.5, measure: "Half the soft cheese tub" }, { productId: "peppers", units: 2, measure: "2 peppers" }, { productId: "cajun", units: 0.08, measure: "Season to taste" }],
    method: ["Cook the pasta.", "Cook the chicken and peppers with Cajun seasoning.", "Add passata and soft cheese, fold through the pasta, mix thoroughly and divide evenly."],
  },
  {
    id: "chilli-potato", name: "Loaded beef chilli potatoes", category: "lunch", description: "Large countable potatoes topped with a thick beef chilli.",
    portionOptions: portions, defaultPortions: 3, volume: 10, prepMinutes: 10, cookMinutes: 35, tags: ["high-volume", "batch", "freezer"], allergens: [], vegetarian: false,
    ingredients: [{ productId: "beef", units: 0.5, measure: "Half the beef pack" }, { productId: "kidney", units: 1, measure: "1 tin of kidney beans" }, { productId: "tomatoes", units: 1, measure: "1 tin of tomatoes" }, { productId: "potatoes", units: 3, measure: "3 potatoes" }, { productId: "onions", units: 0.25, measure: "Quarter of the frozen onion bag" }],
    method: ["Bake the potatoes.", "Brown the beef with onion, add beans and tomatoes, then simmer.", "Put a potato in each portion where possible and divide the chilli evenly."],
  },
  {
    id: "teriyaki-rice", name: "Sticky teriyaki chicken rice", category: "lunch", description: "Chicken, rice and frozen vegetables with simple half-pack measures.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 8, cookMinutes: 24, tags: ["high-protein", "batch"], allergens: ["soy", "gluten"], vegetarian: false,
    ingredients: [{ productId: "chicken", units: 0.5, measure: "Half the chicken pack" }, { productId: "rice", units: 0.5, measure: "Half the rice bag" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }, { productId: "teriyaki", units: 0.5, measure: "Half the sauce bottle" }],
    method: ["Cook the rice.", "Cook the chicken, add vegetables and teriyaki sauce.", "Mix with the rice and divide evenly."],
  },
  {
    id: "burrito-rice", name: "Chicken burrito rice bowls", category: "lunch", description: "Filling rice bowls that reuse chicken, rice and tins efficiently.",
    portionOptions: portions, defaultPortions: 3, volume: 10, prepMinutes: 10, cookMinutes: 25, tags: ["high-protein", "high-volume", "batch"], allergens: [], vegetarian: false,
    ingredients: [{ productId: "chicken", units: 0.5, measure: "Half the chicken pack" }, { productId: "rice", units: 0.5, measure: "Half the rice bag" }, { productId: "kidney", units: 1, measure: "1 tin of beans" }, { productId: "corn", units: 1, measure: "1 tin of sweetcorn" }, { productId: "salsa", units: 1, measure: "Whole salsa jar" }],
    method: ["Cook the rice and chicken.", "Warm the beans and sweetcorn.", "Mix everything with salsa and divide evenly."],
  },
  {
    id: "tofu-rice", name: "Satay tofu rice bowls", category: "lunch", description: "Vegetarian batch bowls with tofu blocks, rice and frozen vegetables.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 8, cookMinutes: 20, tags: ["vegetarian", "batch", "high-volume"], allergens: ["soy", "peanut"], vegetarian: true,
    ingredients: [{ productId: "tofu", units: 2, measure: "2 tofu blocks" }, { productId: "rice", units: 0.5, measure: "Half the rice bag" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }, { productId: "satay", units: 0.5, measure: "Half the satay pouch" }],
    method: ["Cook the rice.", "Brown the tofu, add vegetables and satay sauce.", "Mix with rice and divide evenly."],
  },
  {
    id: "lentil-burrito", name: "Lentil burrito rice bowls", category: "lunch", description: "A cheap vegetarian rice bowl built from tins and frozen vegetables.",
    portionOptions: portions, defaultPortions: 3, volume: 10, prepMinutes: 8, cookMinutes: 22, tags: ["vegetarian", "high-volume", "batch"], allergens: [], vegetarian: true,
    ingredients: [{ productId: "lentils", units: 1, measure: "1 tin of lentils" }, { productId: "kidney", units: 1, measure: "1 tin of kidney beans" }, { productId: "rice", units: 0.5, measure: "Half the rice bag" }, { productId: "corn", units: 1, measure: "1 tin of sweetcorn" }, { productId: "salsa", units: 1, measure: "Whole salsa jar" }],
    method: ["Cook the rice.", "Warm the lentils, beans and sweetcorn.", "Mix with salsa and rice, then divide evenly."],
  },
  {
    id: "bean-pasta", name: "Cheesy bean tomato pasta", category: "lunch", description: "Vegetarian comfort food using shared pasta, beans, passata and cheese.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 8, cookMinutes: 22, tags: ["vegetarian", "batch"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [{ productId: "penne", units: 0.5, measure: "Half the pasta bag" }, { productId: "kidney", units: 1, measure: "1 tin of kidney beans" }, { productId: "passata", units: 0.5, measure: "Half the passata carton" }, { productId: "cheddar", units: 0.2, measure: "About one-fifth of the cheese block" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }],
    method: ["Cook the pasta.", "Warm the beans, passata and vegetables.", "Mix together, add cheese and divide evenly."],
  },
  {
    id: "turkey-bolognese", name: "Turkey vegetable bolognese", category: "dinner", description: "Freezer-friendly pasta using half-packs and frozen vegetables.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 30, tags: ["high-volume", "batch", "freezer"], allergens: ["gluten"], vegetarian: false,
    ingredients: [{ productId: "turkey", units: 0.5, measure: "Half the turkey pack" }, { productId: "spaghetti", units: 0.5, measure: "Half the spaghetti bag" }, { productId: "tomatoes", units: 1, measure: "1 tin of tomatoes" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }, { productId: "onions", units: 0.25, measure: "Quarter of the onion bag" }],
    method: ["Cook the spaghetti.", "Brown the turkey and onion.", "Add tomatoes and vegetables, simmer, mix with spaghetti and divide evenly."],
  },
  {
    id: "bean-curry", name: "Creamy chickpea & lentil curry", category: "dinner", description: "Cheap, filling and fibre-rich with tins, rice and frozen vegetables.",
    portionOptions: portions, defaultPortions: 4, volume: 10, prepMinutes: 8, cookMinutes: 25, tags: ["vegetarian", "high-volume", "batch"], allergens: [], vegetarian: true,
    ingredients: [{ productId: "chickpeas", units: 1, measure: "1 tin of chickpeas" }, { productId: "lentils", units: 1, measure: "1 tin of lentils" }, { productId: "coconut", units: 0.5, measure: "Half the coconut milk tin" }, { productId: "rice", units: 0.5, measure: "Half the rice bag" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }],
    method: ["Cook the rice.", "Simmer chickpeas, lentils, coconut milk and vegetables until thick.", "Divide curry and rice evenly."],
  },
  {
    id: "cottage-pasta", name: "High-protein cottage cheese pasta bake", category: "dinner", description: "Creamy vegetarian pasta with cottage cheese and vegetables.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 25, tags: ["vegetarian", "high-protein", "batch"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [{ productId: "penne", units: 0.5, measure: "Half the pasta bag" }, { productId: "cottage", units: 1, measure: "Whole cottage cheese tub" }, { productId: "passata", units: 0.5, measure: "Half the passata carton" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }],
    method: ["Cook the pasta.", "Mix cottage cheese with passata and vegetables.", "Combine with pasta, bake until hot and divide evenly."],
  },
  {
    id: "chicken-tray", name: "Chicken potato tray bake", category: "dinner", description: "Countable potatoes, chicken and vegetables cooked on one tray.",
    portionOptions: portions, defaultPortions: 4, volume: 10, prepMinutes: 10, cookMinutes: 35, tags: ["high-protein", "high-volume", "one-tray"], allergens: [], vegetarian: false,
    ingredients: [{ productId: "chicken", units: 0.5, measure: "Half the chicken pack" }, { productId: "potatoes", units: 4, measure: "4 potatoes" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }, { productId: "peppers", units: 2, measure: "2 peppers" }],
    method: ["Cut the potatoes and peppers into chunks.", "Roast with the chicken and vegetables until cooked through.", "Distribute the chicken pieces, then divide the remaining tray evenly."],
  },
  {
    id: "beef-pasta", name: "Cheesy beef pasta bake", category: "dinner", description: "High-protein comfort food using shared beef, pasta, passata and cheese.",
    portionOptions: portions, defaultPortions: 3, volume: 8, prepMinutes: 10, cookMinutes: 28, tags: ["high-protein", "batch"], allergens: ["milk", "gluten"], vegetarian: false,
    ingredients: [{ productId: "beef", units: 0.5, measure: "Half the beef pack" }, { productId: "penne", units: 0.5, measure: "Half the pasta bag" }, { productId: "passata", units: 0.5, measure: "Half the passata carton" }, { productId: "cheddar", units: 0.2, measure: "About one-fifth of the cheese block" }, { productId: "mixed-veg", units: 0.5, measure: "Half the frozen veg bag" }],
    method: ["Cook the pasta and brown the beef.", "Add passata and vegetables.", "Combine, add cheese, bake and divide evenly."],
  },
  {
    id: "lentil-chilli-potato", name: "Lentil chilli potatoes", category: "dinner", description: "Vegetarian high-volume chilli over whole baked potatoes.",
    portionOptions: portions, defaultPortions: 3, volume: 10, prepMinutes: 8, cookMinutes: 32, tags: ["vegetarian", "high-volume", "batch"], allergens: [], vegetarian: true,
    ingredients: [{ productId: "lentils", units: 1, measure: "1 tin of lentils" }, { productId: "kidney", units: 1, measure: "1 tin of kidney beans" }, { productId: "tomatoes", units: 1, measure: "1 tin of tomatoes" }, { productId: "potatoes", units: 3, measure: "3 potatoes" }, { productId: "onions", units: 0.25, measure: "Quarter of the onion bag" }],
    method: ["Bake the potatoes.", "Simmer lentils, beans, tomatoes and onion until thick.", "Divide the chilli over the potatoes as evenly as possible."],
  },
  {
    id: "yoghurt-crunch", name: "Yoghurt crunch pots", category: "snack", description: "Cold high-protein pots using simple pack fractions and whole apples.",
    portionOptions: portions, defaultPortions: 4, volume: 8, prepMinutes: 5, cookMinutes: 0, tags: ["vegetarian", "cold"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [{ productId: "yoghurt", units: 0.5, measure: "Half the yoghurt tub" }, { productId: "granola", units: 0.15, measure: "A little under one-sixth of the granola bag" }, { productId: "apples", units: 2, measure: "2 apples" }],
    method: ["Mix yoghurt and chopped apple.", "Keep granola separate until eating if you prefer crunch.", "Divide into the planned number of pots."],
  },
  {
    id: "cottage-fruit", name: "Cottage cheese fruit bowls", category: "snack", description: "Two ingredients, high protein and zero cooking.",
    portionOptions: portions, defaultPortions: 3, volume: 9, prepMinutes: 4, cookMinutes: 0, tags: ["vegetarian", "cold"], allergens: ["milk"], vegetarian: true,
    ingredients: [{ productId: "cottage", units: 1, measure: "Whole cottage cheese tub" }, { productId: "pineapple", units: 1, measure: "Whole pineapple tin" }],
    method: ["Drain the pineapple.", "Mix with cottage cheese and divide evenly."],
  },
  {
    id: "egg-wrap-snack", name: "Egg snack wraps", category: "snack", description: "Countable eggs and wraps with no portion weighing.",
    portionOptions: portions, defaultPortions: 2, volume: 7, prepMinutes: 5, cookMinutes: 10, tags: ["vegetarian", "portable"], allergens: ["egg", "gluten"], vegetarian: true,
    ingredients: [{ productId: "wraps", units: 2, measure: "2 wraps" }, { productId: "eggs", units: 4, measure: "4 eggs" }],
    method: ["Cook the eggs.", "Fill the wraps evenly, roll and refrigerate."],
  },
  {
    id: "skyr-berries", name: "Skyr berry pots", category: "snack", description: "Countable high-protein pots with frozen berries.",
    portionOptions: portions, defaultPortions: 4, volume: 8, prepMinutes: 4, cookMinutes: 0, tags: ["vegetarian", "cold", "high-protein"], allergens: ["milk"], vegetarian: true,
    ingredients: [{ productId: "skyr", units: 4, measure: "All 4 skyr pots" }, { productId: "berries", units: 0.5, measure: "Half the berry bag" }],
    method: ["Split the berries across the skyr pots or containers.", "Keep chilled."],
  },
  {
    id: "tofu-snack-wraps", name: "Tofu snack wraps", category: "snack", description: "Dairy- and egg-free snack wraps using a whole tofu block.",
    portionOptions: portions, defaultPortions: 2, volume: 8, prepMinutes: 5, cookMinutes: 8, tags: ["vegetarian", "portable"], allergens: ["soy", "gluten"], vegetarian: true,
    ingredients: [{ productId: "tofu", units: 1, measure: "1 tofu block" }, { productId: "wraps", units: 2, measure: "2 wraps" }, { productId: "salsa", units: 0.3, measure: "About one-third of the salsa jar" }],
    method: ["Brown or crumble the tofu.", "Fill the wraps with tofu and salsa, then roll."],
  },
];

function add(a: Macros, b: Macros): Macros {
  return { calories: a.calories + b.calories, protein: a.protein + b.protein, fat: a.fat + b.fat, carbs: a.carbs + b.carbs, fibre: a.fibre + b.fibre };
}

function scale(value: Macros, factor: number): Macros {
  return { calories: value.calories * factor, protein: value.protein * factor, fat: value.fat * factor, carbs: value.carbs * factor, fibre: value.fibre * factor };
}

function batchMacros(template: RecipeTemplate): Macros {
  return template.ingredients.reduce<Macros>((total, ingredient) => {
    const product = productById.get(ingredient.productId);
    return product ? add(total, scale(product.macrosPerUnit, ingredient.units)) : total;
  }, { ...ZERO });
}

function makeRecipe(template: RecipeTemplate, batchSize: number, tag = "catalogue"): Recipe {
  const batch = batchMacros(template);
  const round = (value: number) => Math.max(0, Math.round(value));
  return {
    id: `${template.id}__${batchSize}__${tag}`,
    catalogueId: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    batchSize,
    calories: round(batch.calories / batchSize),
    protein: round(batch.protein / batchSize),
    fat: round(batch.fat / batchSize),
    carbs: round(batch.carbs / batchSize),
    fibre: round(batch.fibre / batchSize),
    batchCalories: round(batch.calories),
    batchProtein: round(batch.protein),
    batchFat: round(batch.fat),
    batchCarbs: round(batch.carbs),
    batchFibre: round(batch.fibre),
    volume: template.volume,
    prepMinutes: template.prepMinutes,
    cookMinutes: template.cookMinutes,
    tags: template.tags,
    allergens: template.allergens,
    ingredients: template.ingredients.map((ingredient) => {
      const product = productById.get(ingredient.productId)!;
      return {
        productId: product.id,
        name: product.name,
        pack: product.pack,
        price: product.price,
        qty: Math.max(1, Math.ceil(ingredient.units / product.packUnits - 1e-9)),
        aisle: product.aisle,
        measure: ingredient.measure,
        usedAmount: ingredient.units,
        packAmount: product.packUnits,
        unit: product.unit,
      };
    }),
    method: template.method,
  };
}

export const recipeCatalogue: Recipe[] = recipeTemplates.map((template) => makeRecipe(template, template.defaultPortions));

function splitTerms(value: string) {
  return value.toLowerCase().split(/[,;\n]/).map((term) => term.trim()).filter(Boolean);
}

function canonicalAllergy(term: string) {
  const clean = term.replace(/s$/, "");
  if (["dairy", "lactose"].includes(clean)) return "milk";
  if (["peanut", "nut"].includes(clean)) return "peanut";
  if (["wheat"].includes(clean)) return "gluten";
  return clean;
}

function eligibleTemplates(profile: UserProfile) {
  const allergyTerms = splitTerms(profile.allergies).map(canonicalAllergy);
  const dislikeTerms = splitTerms(profile.dislikes);
  return recipeTemplates.filter((template) => {
    if (profile.diet === "vegetarian" && !template.vegetarian) return false;
    if (allergyTerms.some((term) => template.allergens.some((allergen) => allergen.includes(term) || term.includes(allergen)))) return false;
    const ingredientText = template.ingredients.map((ingredient) => productById.get(ingredient.productId)?.name || "").join(" ");
    const haystack = `${template.name} ${template.description} ${template.tags.join(" ")} ${ingredientText}`.toLowerCase();
    return !dislikeTerms.some((term) => haystack.includes(term));
  });
}

function consumedBatchCost(recipe: Recipe) {
  return recipe.ingredients.reduce((sum, ingredient) => {
    const product = productById.get(ingredient.productId)!;
    return sum + product.price * (ingredient.usedAmount / product.packUnits);
  }, 0);
}

export function recipePortionCost(recipe: Recipe) {
  return consumedBatchCost(recipe) / recipe.batchSize;
}

type BatchGroup = {
  category: MealCategory;
  recipes: Recipe[];
  averageCalories: number;
  averageProtein: number;
  averageFat: number;
  averageFibre: number;
  averageVolume: number;
  consumedCost: number;
  prepMinutes: number;
  repeated: boolean;
};

type PlanMetrics = {
  averages: { calories: number; protein: number; fat: number; fibre: number };
  selectedRecipes: Recipe[];
  shopping: ShoppingItem[];
  weeklyCost: number;
  wasteCost: number;
  prepMinutes: number;
  calorieDelta: number;
  hardFit: boolean;
  score: number;
};

type GroupChoice = { groups: BatchGroup[]; metrics: PlanMetrics };

function createBatchGroup(category: MealCategory, recipes: Recipe[], repeated: boolean): BatchGroup {
  return {
    category,
    recipes,
    averageCalories: recipes.reduce((sum, recipe) => sum + recipe.batchCalories, 0) / 7,
    averageProtein: recipes.reduce((sum, recipe) => sum + recipe.batchProtein, 0) / 7,
    averageFat: recipes.reduce((sum, recipe) => sum + recipe.batchFat, 0) / 7,
    averageFibre: recipes.reduce((sum, recipe) => sum + recipe.batchFibre, 0) / 7,
    averageVolume: recipes.reduce((sum, recipe) => sum + recipe.volume * recipe.batchSize, 0) / 7,
    consumedCost: recipes.reduce((sum, recipe) => sum + consumedBatchCost(recipe), 0),
    prepMinutes: recipes.reduce((sum, recipe) => sum + recipe.prepMinutes + recipe.cookMinutes, 0),
    repeated,
  };
}

function categoryGroups(templates: RecipeTemplate[], category: MealCategory): BatchGroup[] {
  const categoryTemplates = templates.filter((template) => template.category === category);
  const variants = categoryTemplates.flatMap((template) => template.portionOptions.map((size) => ({ template, size })));
  const distinct: BatchGroup[] = [];
  const repeated: BatchGroup[] = [];

  for (let i = 0; i < variants.length; i += 1) {
    for (let j = i + 1; j < variants.length; j += 1) {
      const left = variants[i];
      const right = variants[j];
      if (left.size + right.size !== 7) continue;
      const isRepeated = left.template.id === right.template.id;
      const pair = [makeRecipe(left.template, left.size, `a${i}`), makeRecipe(right.template, right.size, `b${j}`)];
      (isRepeated ? repeated : distinct).push(createBatchGroup(category, pair, isRepeated));
    }
  }

  return distinct.length ? distinct : repeated;
}

function categoryShares(mealsPerDay: 3 | 4): Record<MealCategory, number> {
  return mealsPerDay === 4
    ? { breakfast: 0.22, lunch: 0.29, dinner: 0.32, snack: 0.17 }
    : { breakfast: 0.25, lunch: 0.35, dinner: 0.4, snack: 0 };
}

function topGroups(groups: BatchGroup[], targets: Targets, share: number) {
  return [...groups]
    .map((group) => {
      const calorieGap = Math.abs(group.averageCalories - targets.calories * share) / Math.max(1, targets.calories);
      const proteinShortfall = Math.max(0, targets.protein * share - group.averageProtein) / Math.max(1, targets.protein);
      const score = calorieGap * 18 + proteinShortfall * 25 + group.consumedCost * 0.04 + group.prepMinutes * 0.002 + (10 - group.averageVolume) * 0.03 + (group.repeated ? 0.75 : 0);
      return { group, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 7)
    .map((entry) => entry.group);
}

function aggregateShopping(recipes: Recipe[]): ShoppingItem[] {
  const usage = new Map<string, number>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) usage.set(ingredient.productId, (usage.get(ingredient.productId) || 0) + ingredient.usedAmount);
  }

  return [...usage.entries()].map(([productId, usedAmount]) => {
    const product = productById.get(productId)!;
    const qty = Math.max(1, Math.ceil(usedAmount / product.packUnits - 1e-9));
    const leftoverAmount = Math.max(0, qty * product.packUnits - usedAmount);
    return {
      productId,
      name: product.name,
      pack: product.pack,
      price: product.price,
      qty,
      aisle: product.aisle,
      usedAmount,
      leftoverAmount,
      packAmount: product.packUnits,
      unit: product.unit,
      wasteRiskValue: (leftoverAmount / product.packUnits) * product.price * product.wasteFactor,
    };
  }).sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}

function metricsForGroups(groups: BatchGroup[], targets: Targets): PlanMetrics {
  const averages = {
    calories: groups.reduce((sum, group) => sum + group.averageCalories, 0),
    protein: groups.reduce((sum, group) => sum + group.averageProtein, 0),
    fat: groups.reduce((sum, group) => sum + group.averageFat, 0),
    fibre: groups.reduce((sum, group) => sum + group.averageFibre, 0),
  };
  const selectedRecipes = groups.flatMap((group) => group.recipes);
  const shopping = aggregateShopping(selectedRecipes);
  const weeklyCost = shopping.reduce((sum, item) => sum + item.price * item.qty, 0);
  const wasteCost = shopping.reduce((sum, item) => sum + item.wasteRiskValue, 0);
  const prepMinutes = selectedRecipes.reduce((sum, recipe) => sum + recipe.prepMinutes + recipe.cookMinutes, 0);
  const calorieDelta = Math.abs(averages.calories - targets.calories) / Math.max(1, targets.calories);
  const proteinShortfall = Math.max(0, targets.protein - averages.protein) / Math.max(1, targets.protein);
  const fatShortfall = Math.max(0, targets.fat * 0.75 - averages.fat) / Math.max(1, targets.fat);
  const fibreShortfall = Math.max(0, targets.fibre * 0.9 - averages.fibre) / Math.max(1, targets.fibre);
  const hardFit = calorieDelta <= 0.07 && averages.protein >= targets.protein && averages.fibre >= targets.fibre * 0.9 && averages.fat >= targets.fat * 0.75;
  const volume = groups.reduce((sum, group) => sum + group.averageVolume, 0) / Math.max(1, groups.length);
  const repetition = groups.filter((group) => group.repeated).length;
  const score = calorieDelta * 220 + proteinShortfall * 500 + fatShortfall * 100 + fibreShortfall * 90 + weeklyCost * 0.6 + wasteCost * 3 + prepMinutes * 0.015 + (10 - volume) * 0.4 + repetition * 3;
  return { averages, selectedRecipes, shopping, weeklyCost, wasteCost, prepMinutes, calorieDelta, hardFit, score };
}

function chooseGroups(profile: UserProfile, targets: Targets): GroupChoice | null {
  const eligible = eligibleTemplates(profile);
  const categories: MealCategory[] = profile.mealsPerDay === 4 ? ["breakfast", "lunch", "dinner", "snack"] : ["breakfast", "lunch", "dinner"];
  const shares = categoryShares(profile.mealsPerDay);
  const choices = categories.map((category) => topGroups(categoryGroups(eligible, category), targets, shares[category]));
  if (choices.some((choice) => choice.length === 0)) return null;

  const candidates: GroupChoice[] = [];
  function walk(index: number, picked: BatchGroup[]) {
    if (index === choices.length) {
      candidates.push({ groups: [...picked], metrics: metricsForGroups(picked, targets) });
      return;
    }
    for (const group of choices[index]) {
      picked.push(group);
      walk(index + 1, picked);
      picked.pop();
    }
  }
  walk(0, []);
  candidates.sort((a, b) => a.metrics.score - b.metrics.score);
  return candidates.find((candidate) => candidate.metrics.hardFit) || candidates[0] || null;
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categoryOrder: MealCategory[] = ["breakfast", "lunch", "dinner", "snack"];
const categoryLabel: Record<MealCategory, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", snack: "Snack" };

function buildDays(groups: BatchGroup[], targets: Targets): DayPlan[] {
  const days: DayPlan[] = dayNames.map((day) => ({ day, meals: [], calories: 0, protein: 0, fat: 0, fibre: 0, cost: 0 }));
  const orderedGroups = [...groups].sort((a, b) => {
    const spreadA = Math.max(...a.recipes.map((recipe) => recipe.calories)) - Math.min(...a.recipes.map((recipe) => recipe.calories));
    const spreadB = Math.max(...b.recipes.map((recipe) => recipe.calories)) - Math.min(...b.recipes.map((recipe) => recipe.calories));
    return spreadB - spreadA;
  });

  for (const group of orderedGroups) {
    const servings = group.recipes.flatMap((recipe) => Array.from({ length: recipe.batchSize }, () => recipe)).sort((a, b) => (b.calories + b.protein * 2) - (a.calories + a.protein * 2));
    const dayIndexes = days.map((day, index) => ({ index, load: day.calories / Math.max(1, targets.calories) + day.protein / Math.max(1, targets.protein) * 0.25 })).sort((a, b) => a.load - b.load).map((entry) => entry.index);
    servings.forEach((recipe, position) => {
      const day = days[dayIndexes[position]];
      day.meals.push({ ...recipe, mealLabel: categoryLabel[recipe.category] });
      day.calories += recipe.calories;
      day.protein += recipe.protein;
      day.fat += recipe.fat;
      day.fibre += recipe.fibre;
      day.cost += recipePortionCost(recipe);
    });
  }

  for (const day of days) {
    day.meals.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
    day.cost = Math.round(day.cost * 100) / 100;
  }
  return days;
}

function buildPrepSessions(recipes: Recipe[]): PrepSession[] {
  if (!recipes.length) return [];
  const total = recipes.reduce((sum, recipe) => sum + recipe.prepMinutes + recipe.cookMinutes, 0);
  const buckets = Array.from({ length: total > 95 ? 2 : 1 }, (_, index) => ({ title: index === 0 ? "Sunday prep" : "Midweek top-up", minutes: 0, recipes: [] as PrepSession["recipes"] }));
  const ordered = [...recipes].sort((a, b) => (b.prepMinutes + b.cookMinutes) - (a.prepMinutes + a.cookMinutes));
  for (const recipe of ordered) {
    const bucket = [...buckets].sort((a, b) => a.minutes - b.minutes)[0];
    bucket.minutes += recipe.prepMinutes + recipe.cookMinutes;
    bucket.recipes.push({ id: recipe.id, name: recipe.name, portions: recipe.batchSize, instruction: `Cook this batch once, then divide it into exactly ${recipe.batchSize} equal portions.` });
  }
  return buckets.filter((bucket) => bucket.recipes.length > 0);
}

function unavailablePlan(profile: UserProfile, targets: Targets, message: string): WeeklyPlan {
  return {
    targets,
    days: dayNames.map((day) => ({ day, meals: [], calories: 0, protein: 0, fat: 0, fibre: 0, cost: 0 })),
    shopping: [], prep: [], weeklyCost: 0, dailyAverageCost: 0, wasteCost: 0, prepMinutes: 0, efficiency: 0, nutritionFit: 0,
    averages: { calories: 0, protein: 0, fat: 0, fibre: 0 }, selectedRecipes: [],
    warnings: [message, ...(profile.allergies.trim() ? ["Always verify retailer allergen labels before eating. Recipe filtering is a planning aid, not an allergy guarantee."] : [])],
  };
}

export function generateWeeklyPlan(rawProfile: UserProfile): WeeklyPlan {
  const profile = normalizeProfile(rawProfile);
  const targets = calculateTargets(profile);
  const chosen = chooseGroups(profile, targets);
  if (!chosen) return unavailablePlan(profile, targets, "The current recipe catalogue cannot build a safe seven-day plan for these exclusions. PrepZero will fail closed rather than insert an incompatible meal.");

  const { groups, metrics } = chosen;
  const days = buildDays(groups, targets);
  const prep = buildPrepSessions(metrics.selectedRecipes);
  const dailyCalorieFit = days.reduce((sum, day) => sum + Math.max(0, 1 - Math.abs(day.calories - targets.calories) / Math.max(1, targets.calories)), 0) / 7;
  const calorieFit = Math.max(0, 1 - metrics.calorieDelta);
  const proteinFit = Math.min(1, metrics.averages.protein / Math.max(1, targets.protein));
  const wasteFit = metrics.weeklyCost > 0 ? Math.max(0, 1 - metrics.wasteCost / metrics.weeklyCost) : 0;
  const timeFit = Math.max(0, 1 - metrics.prepMinutes / 420);
  const nutritionFit = Math.round((calorieFit * 0.45 + proteinFit * 0.35 + dailyCalorieFit * 0.2) * 100);
  const efficiency = Math.round((nutritionFit / 100 * 0.45 + wasteFit * 0.35 + timeFit * 0.2) * 100);

  const warnings: string[] = [];
  if (!metrics.hardFit) warnings.push(`The current seed catalogue gets this profile to about ${Math.round(metrics.averages.calories)} kcal and ${Math.round(metrics.averages.protein)}g protein per day. That is the closest low-friction fit available, so PrepZero does not label it an exact macro match.`);
  const farDays = days.filter((day) => Math.abs(day.calories - targets.calories) / Math.max(1, targets.calories) > 0.15).length;
  if (farDays) warnings.push(`${farDays} day${farDays === 1 ? "" : "s"} vary by more than 15% from the calorie target. More recipe variants will tighten day-to-day matching.`);
  if (groups.some((group) => group.repeated)) warnings.push("One meal category repeats the same recipe twice this week because the current exclusions leave too little safe variety. PrepZero prefers repetition over an incompatible recipe.");
  if (profile.allergies.trim()) warnings.push("Always verify retailer allergen labels before eating. Recipe filtering is a planning aid, not an allergy guarantee.");
  warnings.push("Aldi prices and nutrition values are MVP seed data and must be replaced or verified against maintained retailer/nutrition data before public launch.");

  return {
    targets,
    days,
    shopping: metrics.shopping,
    prep,
    weeklyCost: Math.round(metrics.weeklyCost * 100) / 100,
    dailyAverageCost: Math.round(metrics.weeklyCost / 7 * 100) / 100,
    wasteCost: Math.round(metrics.wasteCost * 100) / 100,
    prepMinutes: metrics.prepMinutes,
    efficiency,
    nutritionFit,
    averages: { calories: Math.round(metrics.averages.calories), protein: Math.round(metrics.averages.protein), fat: Math.round(metrics.averages.fat), fibre: Math.round(metrics.averages.fibre) },
    selectedRecipes: metrics.selectedRecipes,
    warnings,
  };
}

export function money(value: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

export function minutesLabel(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

export function formatPackAmount(amount: number, unit: string) {
  const rounded = Math.round(amount * 100) / 100;
  if (rounded === 0) return "none";
  return `${rounded} ${rounded === 1 ? unit : `${unit}s`}`;
}
