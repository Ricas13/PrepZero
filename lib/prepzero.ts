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

type MacroSet = {
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
  packAmount: number;
  unit: string;
  nutritionBasis: number;
  nutrition: MacroSet;
  wasteFactor: number;
};

type RecipeIngredient = {
  productId: string;
  amount: number;
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
  ingredients: RecipeIngredient[];
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
  nutritionFit: number;
  averages: { calories: number; protein: number; fat: number; fibre: number };
  selectedRecipes: Recipe[];
  warnings: string[];
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

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function normalizeProfile(input: Partial<UserProfile>): UserProfile {
  const merged = { ...defaultProfile, ...input } as UserProfile;
  return {
    ...merged,
    name: String(merged.name || "").trim().slice(0, 60),
    age: Math.round(clamp(Number(merged.age), 18, 90)),
    heightCm: Math.round(clamp(Number(merged.heightCm), 130, 230)),
    weightKg: Math.round(clamp(Number(merged.weightKg), 35, 300) * 10) / 10,
    sex: merged.sex === "female" ? "female" : "male",
    activity: ["sedentary", "light", "moderate", "active", "very-active"].includes(merged.activity) ? merged.activity : "moderate",
    goal: ["cut", "maintain", "bulk"].includes(merged.goal) ? merged.goal : "maintain",
    mealsPerDay: merged.mealsPerDay === 3 ? 3 : 4,
    supermarket: "Aldi",
    diet: merged.diet === "vegetarian" ? "vegetarian" : "everything",
    allergies: String(merged.allergies || "").slice(0, 250),
    dislikes: String(merged.dislikes || "").slice(0, 250),
  };
}

export function calculateTargets(rawProfile: UserProfile): Targets {
  const profile = normalizeProfile(rawProfile);
  const sexOffset = profile.sex === "male" ? 5 : -161;
  const bmr = Math.round(10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + sexOffset);
  const maintenance = Math.round(bmr * activityFactors[profile.activity]);
  const adjustment = profile.goal === "cut" ? 0.85 : profile.goal === "bulk" ? 1.08 : 1;
  const safeFloor = profile.sex === "male" ? 1500 : 1200;
  const calories = Math.max(safeFloor, Math.round(maintenance * adjustment));
  const proteinMultiplier = profile.goal === "cut" ? 2 : 1.8;
  const protein = Math.round(profile.weightKg * proteinMultiplier);
  const fat = Math.round(profile.weightKg * 0.75);
  const fibre = Math.max(25, Math.round((calories / 1000) * 14));
  return { bmr, maintenance, calories, protein, fat, fibre };
}

const products: Product[] = [
  { id: "yoghurt", name: "0% Greek yoghurt", pack: "1kg tub", price: 1.85, aisle: "Chilled", packAmount: 1, unit: "tub", nutritionBasis: 1, nutrition: { calories: 590, protein: 100, fat: 4, carbs: 40, fibre: 0 }, wasteFactor: 0.9 },
  { id: "oats", name: "Porridge oats", pack: "1kg bag", price: 1.25, aisle: "Cereal", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 3700, protein: 130, fat: 70, carbs: 600, fibre: 100 }, wasteFactor: 0.02 },
  { id: "berries", name: "Frozen mixed berries", pack: "500g bag", price: 2.15, aisle: "Frozen", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 250, protein: 5, fat: 2.5, carbs: 50, fibre: 25 }, wasteFactor: 0.03 },
  { id: "banana", name: "Bananas", pack: "5 pack", price: 0.78, aisle: "Fruit & veg", packAmount: 5, unit: "banana", nutritionBasis: 1, nutrition: { calories: 105, protein: 1.3, fat: 0.4, carbs: 27, fibre: 3 }, wasteFactor: 0.8 },
  { id: "bread", name: "Wholemeal bread", pack: "800g loaf", price: 0.75, aisle: "Bakery", packAmount: 20, unit: "slice", nutritionBasis: 1, nutrition: { calories: 95, protein: 4, fat: 1, carbs: 17, fibre: 2.5 }, wasteFactor: 0.45 },
  { id: "eggs", name: "Eggs", pack: "12 pack", price: 2.35, aisle: "Dairy", packAmount: 12, unit: "egg", nutritionBasis: 1, nutrition: { calories: 70, protein: 6.3, fat: 4.8, carbs: 0.4, fibre: 0 }, wasteFactor: 0.35 },
  { id: "wraps", name: "Wholemeal wraps", pack: "8 pack", price: 1.29, aisle: "Bakery", packAmount: 8, unit: "wrap", nutritionBasis: 1, nutrition: { calories: 180, protein: 6, fat: 4, carbs: 30, fibre: 5 }, wasteFactor: 0.35 },
  { id: "baked-beans", name: "Baked beans", pack: "2 x 420g tins", price: 0.92, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 330, protein: 20, fat: 2, carbs: 54, fibre: 14 }, wasteFactor: 0.02 },
  { id: "cheese-slices", name: "Reduced-fat cheddar slices", pack: "10 slices", price: 1.99, aisle: "Chilled", packAmount: 10, unit: "slice", nutritionBasis: 1, nutrition: { calories: 50, protein: 5, fat: 3.5, carbs: 1, fibre: 0 }, wasteFactor: 0.75 },
  { id: "chicken", name: "Chicken breast fillets", pack: "1kg pack", price: 5.49, aisle: "Meat", packAmount: 1, unit: "pack", nutritionBasis: 1, nutrition: { calories: 1100, protein: 230, fat: 15, carbs: 0, fibre: 0 }, wasteFactor: 1 },
  { id: "penne", name: "Penne pasta", pack: "500g bag", price: 0.75, aisle: "Pasta", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 1750, protein: 60, fat: 10, carbs: 360, fibre: 17.5 }, wasteFactor: 0.02 },
  { id: "passata", name: "Passata", pack: "500g carton", price: 0.55, aisle: "Tins", packAmount: 1, unit: "carton", nutritionBasis: 1, nutrition: { calories: 150, protein: 7, fat: 1, carbs: 25, fibre: 7.5 }, wasteFactor: 0.75 },
  { id: "soft-cheese", name: "Light soft cheese", pack: "300g tub", price: 1.39, aisle: "Chilled", packAmount: 1, unit: "tub", nutritionBasis: 1, nutrition: { calories: 450, protein: 24, fat: 24, carbs: 30, fibre: 0 }, wasteFactor: 0.9 },
  { id: "peppers", name: "Mixed peppers", pack: "3 pack", price: 1.49, aisle: "Fruit & veg", packAmount: 3, unit: "pepper", nutritionBasis: 1, nutrition: { calories: 35, protein: 1.2, fat: 0.3, carbs: 7, fibre: 2 }, wasteFactor: 0.85 },
  { id: "cajun", name: "Cajun seasoning", pack: "jar", price: 0.79, aisle: "Spices", packAmount: 1, unit: "jar", nutritionBasis: 1, nutrition: { calories: 50, protein: 2, fat: 1, carbs: 8, fibre: 2 }, wasteFactor: 0 },
  { id: "beef", name: "5% beef mince", pack: "750g pack", price: 4.79, aisle: "Meat", packAmount: 1, unit: "pack", nutritionBasis: 1, nutrition: { calories: 1028, protein: 161, fat: 37.5, carbs: 0, fibre: 0 }, wasteFactor: 1 },
  { id: "kidney", name: "Kidney beans", pack: "2 x 400g tins", price: 0.98, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 230, protein: 16, fat: 1.2, carbs: 34, fibre: 14.4 }, wasteFactor: 0.02 },
  { id: "tomatoes", name: "Chopped tomatoes", pack: "2 x 400g tins", price: 0.94, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 100, protein: 4.8, fat: 0.8, carbs: 16, fibre: 6 }, wasteFactor: 0.02 },
  { id: "potatoes", name: "Baking potatoes", pack: "4 pack", price: 1.35, aisle: "Fruit & veg", packAmount: 4, unit: "potato", nutritionBasis: 1, nutrition: { calories: 230, protein: 6, fat: 0.3, carbs: 52, fibre: 6 }, wasteFactor: 0.8 },
  { id: "onions", name: "Frozen diced onions", pack: "500g bag", price: 1.05, aisle: "Frozen", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 175, protein: 5, fat: 0.5, carbs: 40, fibre: 10 }, wasteFactor: 0.03 },
  { id: "rice", name: "Long grain rice", pack: "500g bag", price: 0.79, aisle: "Rice", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 1800, protein: 35, fat: 5, carbs: 400, fibre: 5 }, wasteFactor: 0.02 },
  { id: "mixed-veg", name: "Frozen mixed vegetables", pack: "1kg bag", price: 1.65, aisle: "Frozen", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 450, protein: 30, fat: 5, carbs: 70, fibre: 30 }, wasteFactor: 0.03 },
  { id: "teriyaki", name: "Teriyaki sauce", pack: "250ml bottle", price: 1.29, aisle: "Sauces", packAmount: 1, unit: "bottle", nutritionBasis: 1, nutrition: { calories: 300, protein: 5, fat: 0, carbs: 67.5, fibre: 0 }, wasteFactor: 0.1 },
  { id: "turkey", name: "Turkey mince", pack: "750g pack", price: 4.25, aisle: "Meat", packAmount: 1, unit: "pack", nutritionBasis: 1, nutrition: { calories: 975, protein: 165, fat: 37.5, carbs: 0, fibre: 0 }, wasteFactor: 1 },
  { id: "spaghetti", name: "Wholewheat spaghetti", pack: "500g bag", price: 0.89, aisle: "Pasta", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 1750, protein: 60, fat: 10, carbs: 360, fibre: 17.5 }, wasteFactor: 0.02 },
  { id: "chickpeas", name: "Chickpeas", pack: "2 x 400g tins", price: 0.94, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 300, protein: 15, fat: 5, carbs: 45, fibre: 12 }, wasteFactor: 0.02 },
  { id: "lentils", name: "Green lentils", pack: "2 x 400g tins", price: 1.10, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 280, protein: 20, fat: 1, carbs: 45, fibre: 17 }, wasteFactor: 0.02 },
  { id: "coconut", name: "Light coconut milk", pack: "400ml tin", price: 0.89, aisle: "Tins", packAmount: 1, unit: "tin", nutritionBasis: 1, nutrition: { calories: 340, protein: 4, fat: 28, carbs: 16, fibre: 0 }, wasteFactor: 0.05 },
  { id: "granola", name: "High-protein granola", pack: "400g bag", price: 2.49, aisle: "Cereal", packAmount: 1, unit: "bag", nutritionBasis: 1, nutrition: { calories: 1800, protein: 80, fat: 60, carbs: 220, fibre: 32 }, wasteFactor: 0.03 },
  { id: "apples", name: "Apples", pack: "6 pack", price: 1.29, aisle: "Fruit & veg", packAmount: 6, unit: "apple", nutritionBasis: 1, nutrition: { calories: 95, protein: 0.5, fat: 0.3, carbs: 25, fibre: 4.4 }, wasteFactor: 0.8 },
  { id: "cottage", name: "Low-fat cottage cheese", pack: "600g tub", price: 1.59, aisle: "Chilled", packAmount: 1, unit: "tub", nutritionBasis: 1, nutrition: { calories: 480, protein: 72, fat: 12, carbs: 24, fibre: 0 }, wasteFactor: 0.9 },
  { id: "pineapple", name: "Pineapple chunks", pack: "400g tin", price: 0.89, aisle: "Tins", packAmount: 1, unit: "tin", nutritionBasis: 1, nutrition: { calories: 240, protein: 2, fat: 0.4, carbs: 60, fibre: 5.2 }, wasteFactor: 0.05 },
  { id: "tofu", name: "Firm tofu", pack: "4 x 200g blocks", price: 4.20, aisle: "Chilled", packAmount: 4, unit: "block", nutritionBasis: 1, nutrition: { calories: 240, protein: 28, fat: 14, carbs: 6, fibre: 4 }, wasteFactor: 0.85 },
  { id: "satay", name: "Satay stir-fry sauce", pack: "250g pouch", price: 1.39, aisle: "Sauces", packAmount: 1, unit: "pouch", nutritionBasis: 1, nutrition: { calories: 450, protein: 15, fat: 30, carbs: 30, fibre: 5 }, wasteFactor: 0.35 },
  { id: "cheddar", name: "Reduced-fat cheddar", pack: "400g block", price: 2.99, aisle: "Chilled", packAmount: 1, unit: "block", nutritionBasis: 1, nutrition: { calories: 1120, protein: 120, fat: 72, carbs: 8, fibre: 0 }, wasteFactor: 0.75 },
  { id: "corn", name: "Sweetcorn", pack: "2 x 340g tins", price: 1.05, aisle: "Tins", packAmount: 2, unit: "tin", nutritionBasis: 1, nutrition: { calories: 220, protein: 7, fat: 3, carbs: 40, fibre: 7 }, wasteFactor: 0.02 },
  { id: "salsa", name: "Tomato salsa", pack: "300g jar", price: 1.19, aisle: "Sauces", packAmount: 1, unit: "jar", nutritionBasis: 1, nutrition: { calories: 120, protein: 4, fat: 1, carbs: 24, fibre: 6 }, wasteFactor: 0.35 },
  { id: "skyr", name: "High-protein skyr pots", pack: "4 pack", price: 2.39, aisle: "Chilled", packAmount: 4, unit: "pot", nutritionBasis: 1, nutrition: { calories: 100, protein: 17, fat: 0, carbs: 8, fibre: 0 }, wasteFactor: 0.85 },
];

const productById = new Map(products.map((product) => [product.id, product]));

const recipeTemplates: RecipeTemplate[] = [
  {
    id: "overnight-oats", name: "Berry yoghurt overnight oats", category: "breakfast",
    description: "A cold batch breakfast that reuses yoghurt, oats and fruit across the week.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 4, volume: 9, prepMinutes: 8, cookMinutes: 0,
    tags: ["high-volume", "cold", "vegetarian", "batch"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "yoghurt", amount: 0.5, measure: "Half the 1kg tub" },
      { productId: "oats", amount: 0.25, measure: "Quarter of the bag" },
      { productId: "berries", amount: 1, measure: "Whole bag" },
      { productId: "banana", amount: 2, measure: "2 bananas" },
    ],
    method: ["Mix the yoghurt and oats in one large bowl.", "Fold through the berries and sliced banana.", "Chill, then divide the finished batch evenly into the planned number of containers."],
  },
  {
    id: "french-toast", name: "Protein French toast stack", category: "breakfast",
    description: "Count slices and eggs, cook once, then split the stack — no gram-level serving maths.",
    portionOptions: [2, 4], defaultPortions: 4, volume: 8, prepMinutes: 5, cookMinutes: 12,
    tags: ["hot", "vegetarian", "high-protein"], allergens: ["egg", "milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "bread", amount: 8, measure: "8 slices" },
      { productId: "eggs", amount: 6, measure: "6 eggs" },
      { productId: "yoghurt", amount: 0.5, measure: "Half the tub" },
      { productId: "berries", amount: 0.5, measure: "Half the bag" },
    ],
    method: ["Beat the eggs and coat the bread slices.", "Cook in a non-stick pan until golden.", "Add yoghurt and berries, then divide the full batch evenly into the planned portions."],
  },
  {
    id: "breakfast-wraps", name: "Egg & bean breakfast wraps", category: "breakfast",
    description: "Portable breakfast built from countable wraps, eggs and cheese slices.",
    portionOptions: [2, 4], defaultPortions: 4, volume: 8, prepMinutes: 10, cookMinutes: 18,
    tags: ["freezer", "vegetarian", "batch"], allergens: ["egg", "milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "wraps", amount: 4, measure: "4 wraps" },
      { productId: "eggs", amount: 6, measure: "6 eggs" },
      { productId: "baked-beans", amount: 1, measure: "1 tin" },
      { productId: "cheese-slices", amount: 4, measure: "4 slices" },
    ],
    method: ["Scramble the eggs and warm the beans.", "Lay out the wraps and distribute the filling evenly.", "Add cheese, roll, cool and refrigerate or freeze."],
  },
  {
    id: "breakfast-crunch", name: "Banana berry yoghurt crunch", category: "breakfast",
    description: "A no-cook breakfast using obvious pack fractions rather than scales.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 4, volume: 9, prepMinutes: 6, cookMinutes: 0,
    tags: ["cold", "vegetarian", "quick"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "yoghurt", amount: 0.5, measure: "Half the tub" },
      { productId: "granola", amount: 0.2, measure: "About one-fifth of the bag" },
      { productId: "berries", amount: 0.5, measure: "Half the bag" },
      { productId: "banana", amount: 2, measure: "2 bananas" },
    ],
    method: ["Mix the yoghurt and berries.", "Add sliced banana and granola.", "Divide evenly into the planned containers and chill."],
  },
  {
    id: "cajun-pasta", name: "Creamy Cajun chicken pasta", category: "lunch",
    description: "High-protein pasta that deliberately uses half-packs which can be reused elsewhere in the plan.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 22,
    tags: ["high-protein", "high-volume", "batch", "freezer"], allergens: ["milk", "gluten"], vegetarian: false,
    ingredients: [
      { productId: "chicken", amount: 0.5, measure: "Half the chicken pack" },
      { productId: "penne", amount: 0.5, measure: "Half the pasta bag" },
      { productId: "passata", amount: 0.5, measure: "Half the carton" },
      { productId: "soft-cheese", amount: 0.5, measure: "Half the tub" },
      { productId: "peppers", amount: 2, measure: "2 peppers" },
      { productId: "cajun", amount: 0.1, measure: "Season to taste" },
    ],
    method: ["Cook the planned pasta amount.", "Cook the chicken and peppers with Cajun seasoning.", "Add passata and soft cheese, then fold through the pasta.", "Mix thoroughly and divide evenly into the planned portions."],
  },
  {
    id: "chilli-potato", name: "Loaded beef chilli potatoes", category: "lunch",
    description: "Three big countable potatoes with a thick chilli batch.",
    portionOptions: [3], defaultPortions: 3, volume: 10, prepMinutes: 10, cookMinutes: 35,
    tags: ["high-volume", "batch", "freezer"], allergens: [], vegetarian: false,
    ingredients: [
      { productId: "beef", amount: 0.5, measure: "Half the mince pack" },
      { productId: "kidney", amount: 1, measure: "1 tin" },
      { productId: "tomatoes", amount: 1, measure: "1 tin" },
      { productId: "potatoes", amount: 3, measure: "3 potatoes" },
      { productId: "onions", amount: 0.25, measure: "Quarter of the frozen onion bag" },
    ],
    method: ["Bake all 3 potatoes.", "Brown the beef with onion, then add beans and tomatoes.", "Simmer until thick.", "Put one potato in each container and divide the chilli evenly between all 3."],
  },
  {
    id: "teriyaki-rice", name: "Sticky teriyaki chicken rice", category: "lunch",
    description: "Chicken, rice and frozen veg with simple half-pack measurements.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 8, cookMinutes: 24,
    tags: ["high-protein", "batch", "freezer"], allergens: ["soy", "gluten"], vegetarian: false,
    ingredients: [
      { productId: "chicken", amount: 0.5, measure: "Half the chicken pack" },
      { productId: "rice", amount: 0.5, measure: "Half the rice bag" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
      { productId: "teriyaki", amount: 0.5, measure: "Half the bottle" },
    ],
    method: ["Cook the rice.", "Cook the chicken, then add frozen veg and teriyaki sauce.", "Mix with the rice and divide the whole batch evenly."],
  },
  {
    id: "burrito-rice", name: "Chicken burrito rice bowls", category: "lunch",
    description: "A filling rice bowl that shares chicken, rice and tins efficiently with other recipes.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 10, prepMinutes: 10, cookMinutes: 25,
    tags: ["high-protein", "high-volume", "batch"], allergens: [], vegetarian: false,
    ingredients: [
      { productId: "chicken", amount: 0.5, measure: "Half the chicken pack" },
      { productId: "rice", amount: 0.5, measure: "Half the rice bag" },
      { productId: "kidney", amount: 1, measure: "1 tin" },
      { productId: "corn", amount: 1, measure: "1 tin" },
      { productId: "salsa", amount: 1, measure: "Whole jar" },
    ],
    method: ["Cook the rice and chicken.", "Warm the beans and sweetcorn.", "Mix everything with the salsa and divide evenly into the planned portions."],
  },
  {
    id: "tofu-rice", name: "Satay tofu rice bowls", category: "lunch",
    description: "Vegetarian batch bowls with tofu blocks, rice and frozen vegetables.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 8, cookMinutes: 20,
    tags: ["vegetarian", "batch", "high-volume"], allergens: ["soy", "peanut"], vegetarian: true,
    ingredients: [
      { productId: "tofu", amount: 2, measure: "2 tofu blocks" },
      { productId: "rice", amount: 0.5, measure: "Half the rice bag" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
      { productId: "satay", amount: 0.5, measure: "Half the pouch" },
    ],
    method: ["Cook the rice.", "Brown the tofu, then add vegetables and satay sauce.", "Mix with the rice and divide evenly."],
  },
  {
    id: "turkey-bolognese", name: "Turkey vegetable bolognese", category: "dinner",
    description: "A freezer-friendly pasta batch using half-packs and frozen vegetables.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 30,
    tags: ["high-volume", "batch", "freezer"], allergens: ["gluten"], vegetarian: false,
    ingredients: [
      { productId: "turkey", amount: 0.5, measure: "Half the turkey pack" },
      { productId: "spaghetti", amount: 0.5, measure: "Half the spaghetti bag" },
      { productId: "tomatoes", amount: 1, measure: "1 tin" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
      { productId: "onions", amount: 0.25, measure: "Quarter of the onion bag" },
    ],
    method: ["Cook the spaghetti.", "Brown the turkey and onion.", "Add tomatoes and vegetables and simmer.", "Mix with the spaghetti and divide evenly."],
  },
  {
    id: "bean-curry", name: "Creamy chickpea & lentil curry", category: "dinner",
    description: "Cheap, filling and fibre-rich with tins, rice and frozen vegetables.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 4, volume: 10, prepMinutes: 8, cookMinutes: 25,
    tags: ["vegetarian", "high-volume", "batch", "freezer"], allergens: [], vegetarian: true,
    ingredients: [
      { productId: "chickpeas", amount: 1, measure: "1 tin" },
      { productId: "lentils", amount: 1, measure: "1 tin" },
      { productId: "coconut", amount: 0.5, measure: "Half the tin" },
      { productId: "rice", amount: 0.5, measure: "Half the rice bag" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
    ],
    method: ["Cook the rice.", "Simmer chickpeas, lentils, coconut milk and vegetables until thick.", "Season, then divide the curry and rice evenly into the planned portions."],
  },
  {
    id: "cottage-pasta", name: "High-protein cottage cheese pasta bake", category: "dinner",
    description: "Creamy vegetarian pasta with a whole cottage cheese tub and shared pack fractions.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 10, cookMinutes: 25,
    tags: ["vegetarian", "high-protein", "batch"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "penne", amount: 0.5, measure: "Half the pasta bag" },
      { productId: "cottage", amount: 1, measure: "Whole tub" },
      { productId: "passata", amount: 0.5, measure: "Half the carton" },
      { productId: "cheddar", amount: 0.25, measure: "Quarter of the cheese block" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
    ],
    method: ["Cook the pasta.", "Blend or mash the cottage cheese with passata.", "Combine with vegetables and pasta, top with cheese and bake.", "Divide the full bake evenly."],
  },
  {
    id: "chicken-tray", name: "Chicken potato tray bake", category: "dinner",
    description: "Countable potatoes, chicken and vegetables cooked together on one tray.",
    portionOptions: [2, 4], defaultPortions: 4, volume: 10, prepMinutes: 10, cookMinutes: 35,
    tags: ["high-protein", "high-volume", "one-tray"], allergens: [], vegetarian: false,
    ingredients: [
      { productId: "chicken", amount: 0.5, measure: "Half the chicken pack" },
      { productId: "potatoes", amount: 4, measure: "4 potatoes" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
      { productId: "peppers", amount: 2, measure: "2 peppers" },
    ],
    method: ["Cut the potatoes and peppers into chunks.", "Roast with the chicken and frozen vegetables until cooked through.", "Mix the tray contents and divide evenly into the planned portions."],
  },
  {
    id: "beef-pasta", name: "Cheesy beef pasta bake", category: "dinner",
    description: "High-protein comfort food that shares beef, pasta, passata and cheese efficiently.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 8, prepMinutes: 10, cookMinutes: 28,
    tags: ["high-protein", "batch", "freezer"], allergens: ["milk", "gluten"], vegetarian: false,
    ingredients: [
      { productId: "beef", amount: 0.5, measure: "Half the mince pack" },
      { productId: "penne", amount: 0.5, measure: "Half the pasta bag" },
      { productId: "passata", amount: 0.5, measure: "Half the carton" },
      { productId: "cheddar", amount: 0.25, measure: "Quarter of the cheese block" },
      { productId: "mixed-veg", amount: 0.5, measure: "Half the frozen veg bag" },
    ],
    method: ["Cook the pasta and brown the beef.", "Stir in passata and vegetables.", "Combine, top with cheese and bake.", "Mix through and divide evenly."],
  },
  {
    id: "yoghurt-crunch", name: "Yoghurt crunch pots", category: "snack",
    description: "Cold high-protein pots using simple pack fractions and whole apples.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 4, volume: 8, prepMinutes: 5, cookMinutes: 0,
    tags: ["vegetarian", "cold", "quick"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "yoghurt", amount: 0.5, measure: "Half the yoghurt tub" },
      { productId: "granola", amount: 0.15, measure: "A little under one-sixth of the bag" },
      { productId: "apples", amount: 2, measure: "2 apples" },
    ],
    method: ["Mix the yoghurt and chopped apple.", "Add granola just before eating or portion it separately.", "Divide into the planned number of pots."],
  },
  {
    id: "cottage-fruit", name: "Cottage cheese fruit bowls", category: "snack",
    description: "Two ingredients, high protein and zero cooking.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 9, prepMinutes: 4, cookMinutes: 0,
    tags: ["vegetarian", "cold", "high-volume"], allergens: ["milk"], vegetarian: true,
    ingredients: [
      { productId: "cottage", amount: 1, measure: "Whole tub" },
      { productId: "pineapple", amount: 1, measure: "Whole tin" },
    ],
    method: ["Drain the pineapple.", "Mix with the cottage cheese and divide evenly into the planned bowls or tubs."],
  },
  {
    id: "egg-wrap-snack", name: "Egg & cheese snack wraps", category: "snack",
    description: "A countable two-portion snack with no weighing at all.",
    portionOptions: [2], defaultPortions: 2, volume: 7, prepMinutes: 5, cookMinutes: 10,
    tags: ["vegetarian", "portable"], allergens: ["egg", "milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "wraps", amount: 2, measure: "2 wraps" },
      { productId: "eggs", amount: 4, measure: "4 eggs" },
      { productId: "cheese-slices", amount: 2, measure: "2 cheese slices" },
    ],
    method: ["Cook the eggs.", "Fill 2 wraps evenly and add one cheese slice to each.", "Roll and refrigerate."],
  },
  {
    id: "skyr-berries", name: "Skyr berry pots", category: "snack",
    description: "Four countable high-protein pots with frozen berries.",
    portionOptions: [4], defaultPortions: 4, volume: 8, prepMinutes: 4, cookMinutes: 0,
    tags: ["vegetarian", "cold", "high-protein"], allergens: ["milk"], vegetarian: true,
    ingredients: [
      { productId: "skyr", amount: 4, measure: "All 4 pots" },
      { productId: "berries", amount: 0.5, measure: "Half the berry bag" },
    ],
    method: ["Split the berries evenly across the 4 skyr pots or containers.", "Keep chilled."],
  },
  {
    id: "banana-yoghurt", name: "Banana granola yoghurt pots", category: "snack",
    description: "A slightly larger snack for higher-calorie plans without introducing scales.",
    portionOptions: [2, 3, 4, 5], defaultPortions: 3, volume: 8, prepMinutes: 6, cookMinutes: 0,
    tags: ["vegetarian", "cold"], allergens: ["milk", "gluten"], vegetarian: true,
    ingredients: [
      { productId: "yoghurt", amount: 0.5, measure: "Half the yoghurt tub" },
      { productId: "granola", amount: 0.25, measure: "Quarter of the granola bag" },
      { productId: "banana", amount: 3, measure: "3 bananas" },
    ],
    method: ["Mix the yoghurt and sliced banana.", "Add granola and divide evenly into the planned pots."],
  },
];

function addMacros(a: MacroSet, b: MacroSet): MacroSet {
  return {
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    fat: a.fat + b.fat,
    carbs: a.carbs + b.carbs,
    fibre: a.fibre + b.fibre,
  };
}

function scaleMacros(macros: MacroSet, factor: number): MacroSet {
  return {
    calories: macros.calories * factor,
    protein: macros.protein * factor,
    fat: macros.fat * factor,
    carbs: macros.carbs * factor,
    fibre: macros.fibre * factor,
  };
}

function templateBatchMacros(template: RecipeTemplate): MacroSet {
  return template.ingredients.reduce<MacroSet>((total, ingredient) => {
    const product = productById.get(ingredient.productId);
    if (!product) return total;
    return addMacros(total, scaleMacros(product.nutrition, ingredient.amount / product.nutritionBasis));
  }, { calories: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 });
}

function roundMacro(value: number) {
  return Math.max(0, Math.round(value));
}

function recipeFromTemplate(template: RecipeTemplate, batchSize: number): Recipe {
  const batch = templateBatchMacros(template);
  const ingredients: IngredientPack[] = template.ingredients.map((ingredient) => {
    const product = productById.get(ingredient.productId)!;
    return {
      productId: product.id,
      name: product.name,
      pack: product.pack,
      price: product.price,
      qty: Math.ceil(ingredient.amount / product.packAmount - 1e-9),
      aisle: product.aisle,
      measure: ingredient.measure,
      usedAmount: ingredient.amount,
      packAmount: product.packAmount,
      unit: product.unit,
    };
  });
  return {
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    batchSize,
    calories: roundMacro(batch.calories / batchSize),
    protein: roundMacro(batch.protein / batchSize),
    fat: roundMacro(batch.fat / batchSize),
    carbs: roundMacro(batch.carbs / batchSize),
    fibre: roundMacro(batch.fibre / batchSize),
    batchCalories: roundMacro(batch.calories),
    batchProtein: roundMacro(batch.protein),
    batchFat: roundMacro(batch.fat),
    batchCarbs: roundMacro(batch.carbs),
    batchFibre: roundMacro(batch.fibre),
    volume: template.volume,
    prepMinutes: template.prepMinutes,
    cookMinutes: template.cookMinutes,
    tags: template.tags,
    allergens: template.allergens,
    ingredients,
    method: template.method,
  };
}

export const recipeCatalogue: Recipe[] = recipeTemplates.map((template) => recipeFromTemplate(template, template.defaultPortions));

function parseTerms(value: string) {
  return value
    .toLowerCase()
    .split(/[,;\n]/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function templateMatchesBlockedTerm(template: RecipeTemplate, term: string) {
  if (template.allergens.some((allergen) => allergen === term || allergen.includes(term) || term.includes(allergen))) return true;
  const ingredientNames = template.ingredients.map((ingredient) => productById.get(ingredient.productId)?.name.toLowerCase() || "");
  const haystack = `${template.name} ${template.description} ${ingredientNames.join(" ")} ${template.tags.join(" ")}`.toLowerCase();
  return haystack.includes(term);
}

function eligibleTemplates(profile: UserProfile) {
  const blocked = [...parseTerms(profile.allergies), ...parseTerms(profile.dislikes)];
  return recipeTemplates.filter((template) => {
    if (profile.diet === "vegetarian" && !template.vegetarian) return false;
    return !blocked.some((term) => templateMatchesBlockedTerm(template, term));
  });
}

function recipeConsumedCost(recipe: Recipe) {
  return recipe.ingredients.reduce((sum, ingredient) => {
    const product = productById.get(ingredient.productId)!;
    return sum + product.price * (ingredient.usedAmount / product.packAmount);
  }, 0);
}

export function recipePortionCost(recipe: Recipe) {
  return recipeConsumedCost(recipe) / recipe.batchSize;
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
};

function combinations<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  function walk(start: number, picked: T[]) {
    if (picked.length === size) {
      result.push([...picked]);
      return;
    }
    for (let i = start; i < items.length; i += 1) {
      picked.push(items[i]);
      walk(i + 1, picked);
      picked.pop();
    }
  }
  walk(0, []);
  return result;
}

function groupOptionsForCategory(templates: RecipeTemplate[], category: MealCategory): BatchGroup[] {
  const variants = templates
    .filter((template) => template.category === category)
    .flatMap((template) => template.portionOptions.map((portions) => recipeFromTemplate(template, portions)));

  const groups: BatchGroup[] = [];
  for (const size of [2, 3]) {
    for (const picked of combinations(variants, size)) {
      if (new Set(picked.map((recipe) => recipe.id)).size !== picked.length) continue;
      if (picked.reduce((sum, recipe) => sum + recipe.batchSize, 0) !== 7) continue;
      const totalBatchCalories = picked.reduce((sum, recipe) => sum + recipe.batchCalories, 0);
      const totalBatchProtein = picked.reduce((sum, recipe) => sum + recipe.batchProtein, 0);
      const totalBatchFat = picked.reduce((sum, recipe) => sum + recipe.batchFat, 0);
      const totalBatchFibre = picked.reduce((sum, recipe) => sum + recipe.batchFibre, 0);
      groups.push({
        category,
        recipes: picked,
        averageCalories: totalBatchCalories / 7,
        averageProtein: totalBatchProtein / 7,
        averageFat: totalBatchFat / 7,
        averageFibre: totalBatchFibre / 7,
        averageVolume: picked.reduce((sum, recipe) => sum + recipe.volume * recipe.batchSize, 0) / 7,
        consumedCost: picked.reduce((sum, recipe) => sum + recipeConsumedCost(recipe), 0),
        prepMinutes: picked.reduce((sum, recipe) => sum + recipe.prepMinutes + recipe.cookMinutes, 0),
      });
    }
  }
  return groups;
}

function categoryShares(mealsPerDay: 3 | 4): Record<MealCategory, number> {
  return mealsPerDay === 4
    ? { breakfast: 0.22, lunch: 0.29, dinner: 0.32, snack: 0.17 }
    : { breakfast: 0.25, lunch: 0.35, dinner: 0.4, snack: 0 };
}

function topGroups(groups: BatchGroup[], targetCalories: number, targetProtein: number, share: number) {
  return [...groups]
    .map((group) => {
      const calorieGap = Math.abs(group.averageCalories - targetCalories * share) / Math.max(1, targetCalories);
      const proteinShortfall = Math.max(0, targetProtein * share - group.averageProtein) / Math.max(1, targetProtein);
      const score = calorieGap * 15 + proteinShortfall * 20 + group.consumedCost * 0.04 + group.prepMinutes * 0.002 + (10 - group.averageVolume) * 0.03;
      return { group, score };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 7)
    .map((entry) => entry.group);
}

function aggregateShopping(recipes: Recipe[]) {
  const usage = new Map<string, number>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      usage.set(ingredient.productId, (usage.get(ingredient.productId) || 0) + ingredient.usedAmount);
    }
  }

  const shopping: ShoppingItem[] = [];
  for (const [productId, usedAmount] of usage) {
    const product = productById.get(productId)!;
    const qty = Math.max(1, Math.ceil(usedAmount / product.packAmount - 1e-9));
    const purchasedAmount = qty * product.packAmount;
    const leftoverAmount = Math.max(0, purchasedAmount - usedAmount);
    const wasteRiskValue = (leftoverAmount / product.packAmount) * product.price * product.wasteFactor;
    shopping.push({
      productId,
      name: product.name,
      pack: product.pack,
      price: product.price,
      qty,
      aisle: product.aisle,
      usedAmount,
      leftoverAmount,
      packAmount: product.packAmount,
      unit: product.unit,
      wasteRiskValue,
    });
  }
  return shopping.sort((a, b) => a.aisle.localeCompare(b.aisle) || a.name.localeCompare(b.name));
}

function metricsForGroups(groups: BatchGroup[], targets: Targets) {
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
  const score = calorieDelta * 220 + proteinShortfall * 500 + fatShortfall * 100 + fibreShortfall * 90 + weeklyCost * 0.6 + wasteCost * 3 + prepMinutes * 0.015 + (10 - volume) * 0.4;
  return { averages, selectedRecipes, shopping, weeklyCost, wasteCost, prepMinutes, calorieDelta, proteinShortfall, hardFit, score };
}

function chooseGroups(profile: UserProfile, targets: Targets) {
  const eligible = eligibleTemplates(profile);
  const categories: MealCategory[] = profile.mealsPerDay === 4 ? ["breakfast", "lunch", "dinner", "snack"] : ["breakfast", "lunch", "dinner"];
  const shares = categoryShares(profile.mealsPerDay);
  const choices = categories.map((category) => {
    const all = groupOptionsForCategory(eligible, category);
    return topGroups(all, targets.calories, targets.protein, shares[category]);
  });

  if (choices.some((choice) => choice.length === 0)) return null;

  let bestHard: { groups: BatchGroup[]; metrics: ReturnType<typeof metricsForGroups> } | null = null;
  let bestFallback: { groups: BatchGroup[]; metrics: ReturnType<typeof metricsForGroups> } | null = null;

  function walk(index: number, picked: BatchGroup[]) {
    if (index === choices.length) {
      const metrics = metricsForGroups(picked, targets);
      const candidate = { groups: [...picked], metrics };
      if (metrics.hardFit && (!bestHard || metrics.score < bestHard.metrics.score)) bestHard = candidate;
      if (!bestFallback || metrics.score < bestFallback.metrics.score) bestFallback = candidate;
      return;
    }
    for (const group of choices[index]) {
      picked.push(group);
      walk(index + 1, picked);
      picked.pop();
    }
  }
  walk(0, []);
  return bestHard || bestFallback;
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
    const servings = group.recipes
      .flatMap((recipe) => Array.from({ length: recipe.batchSize }, () => recipe))
      .sort((a, b) => (b.calories + b.protein * 2) - (a.calories + a.protein * 2));

    const dayIndexes = days
      .map((day, index) => ({
        index,
        load: day.calories / Math.max(1, targets.calories) + (day.protein / Math.max(1, targets.protein)) * 0.25,
      }))
      .sort((a, b) => a.load - b.load)
      .map((entry) => entry.index);

    servings.forEach((recipe, position) => {
      const day = days[dayIndexes[position]];
      const meal: DayMeal = { ...recipe, mealLabel: categoryLabel[recipe.category] };
      day.meals.push(meal);
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
  const sessionCount = total > 95 ? 2 : 1;
  const buckets = Array.from({ length: sessionCount }, (_, index) => ({
    title: index === 0 ? "Sunday prep" : "Midweek top-up",
    minutes: 0,
    recipes: [] as PrepSession["recipes"],
  }));

  const ordered = [...recipes].sort((a, b) => (b.prepMinutes + b.cookMinutes) - (a.prepMinutes + a.cookMinutes));
  for (const recipe of ordered) {
    const bucket = [...buckets].sort((a, b) => a.minutes - b.minutes)[0];
    const minutes = recipe.prepMinutes + recipe.cookMinutes;
    bucket.minutes += minutes;
    bucket.recipes.push({
      name: recipe.name,
      portions: recipe.batchSize,
      instruction: `Cook this batch once, mix thoroughly where appropriate, then divide it into exactly ${recipe.batchSize} equal portions.`,
    });
  }
  return buckets.filter((bucket) => bucket.recipes.length > 0);
}

function unavailablePlan(profile: UserProfile, targets: Targets, message: string): WeeklyPlan {
  const days = dayNames.map((day) => ({ day, meals: [], calories: 0, protein: 0, fat: 0, fibre: 0, cost: 0 }));
  return {
    targets,
    days,
    shopping: [],
    prep: [],
    weeklyCost: 0,
    dailyAverageCost: 0,
    wasteCost: 0,
    prepMinutes: 0,
    efficiency: 0,
    nutritionFit: 0,
    averages: { calories: 0, protein: 0, fat: 0, fibre: 0 },
    selectedRecipes: [],
    warnings: [message, ...(profile.allergies.trim() ? ["Always verify retailer allergen labels before eating. Recipe filtering is a planning aid, not an allergy guarantee."] : [])],
  };
}

export function generateWeeklyPlan(rawProfile: UserProfile): WeeklyPlan {
  const profile = normalizeProfile(rawProfile);
  const targets = calculateTargets(profile);
  const chosen = chooseGroups(profile, targets);
  if (!chosen) return unavailablePlan(profile, targets, "The current recipe catalogue cannot build a safe seven-day plan for these food exclusions yet. Try changing the exclusions or add more recipes to the catalogue.");

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
  if (!metrics.hardFit) {
    warnings.push(`The current seed recipe catalogue gets this plan to about ${Math.round(metrics.averages.calories)} kcal and ${Math.round(metrics.averages.protein)}g protein per day. That is the closest low-friction fit available right now, so the app should not present it as an exact macro match.`);
  }
  const farDays = days.filter((day) => Math.abs(day.calories - targets.calories) / Math.max(1, targets.calories) > 0.15).length;
  if (farDays > 0) warnings.push(`${farDays} day${farDays === 1 ? "" : "s"} vary by more than 15% from the calorie target. The weekly average is closer; more recipe variants will tighten day-to-day matching.`);
  if (profile.allergies.trim()) warnings.push("Always verify retailer allergen labels before eating. Recipe filtering is a planning aid, not an allergy guarantee.");
  warnings.push("Aldi prices and nutrition values are MVP seed data. They must be replaced or verified against a maintained retailer/nutrition source before a public launch.");

  return {
    targets,
    days,
    shopping: metrics.shopping,
    prep,
    weeklyCost: Math.round(metrics.weeklyCost * 100) / 100,
    dailyAverageCost: Math.round((metrics.weeklyCost / 7) * 100) / 100,
    wasteCost: Math.round(metrics.wasteCost * 100) / 100,
    prepMinutes: metrics.prepMinutes,
    efficiency,
    nutritionFit,
    averages: {
      calories: Math.round(metrics.averages.calories),
      protein: Math.round(metrics.averages.protein),
      fat: Math.round(metrics.averages.fat),
      fibre: Math.round(metrics.averages.fibre),
    },
    selectedRecipes: metrics.selectedRecipes,
    warnings,
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

export function formatPackAmount(amount: number, unit: string) {
  const rounded = Math.round(amount * 100) / 100;
  if (rounded === 0) return "none";
  const plural = rounded === 1 ? unit : `${unit}s`;
  return `${rounded} ${plural}`;
}
