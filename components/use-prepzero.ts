"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultProfile, generateWeeklyPlan, UserProfile, WeeklyPlan } from "../lib/prepzero";

const PROFILE_KEY = "prepzero.profile.v1";
const SHOPPING_KEY = "prepzero.shopping.checked.v1";

export function usePrepZero() {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfileState({ ...defaultProfile, ...JSON.parse(raw) });
      const checked = localStorage.getItem(SHOPPING_KEY);
      if (checked) setCheckedItems(JSON.parse(checked));
    } catch {
      // Keep safe defaults if browser storage is unavailable or corrupt.
    }
    setHydrated(true);
  }, []);

  const plan: WeeklyPlan = useMemo(() => generateWeeklyPlan(profile), [profile]);

  function saveProfile(next: UserProfile) {
    setProfileState(next);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      localStorage.setItem("prepzero.onboarded", "1");
    } catch {}
  }

  function toggleShoppingItem(key: string) {
    const next = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(next);
    try {
      localStorage.setItem(SHOPPING_KEY, JSON.stringify(next));
    } catch {}
  }

  function resetShopping() {
    setCheckedItems({});
    try {
      localStorage.removeItem(SHOPPING_KEY);
    } catch {}
  }

  return { profile, plan, hydrated, saveProfile, checkedItems, toggleShoppingItem, resetShopping };
}
