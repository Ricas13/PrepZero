"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultProfile, generateWeeklyPlan, normalizeProfile, UserProfile, WeeklyPlan } from "../lib/prepzero";

const PROFILE_KEY = "prepzero.profile.v1";
const SHOPPING_KEY = "prepzero.shopping.checked.v1";
const ONBOARDED_KEY = "prepzero.onboarded";

export function usePrepZero() {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfileState(normalizeProfile(JSON.parse(raw)));
      const checked = localStorage.getItem(SHOPPING_KEY);
      if (checked) setCheckedItems(JSON.parse(checked));
      setOnboarded(localStorage.getItem(ONBOARDED_KEY) === "1");
    } catch {
      setProfileState(defaultProfile);
      setCheckedItems({});
      setOnboarded(false);
    }
    setHydrated(true);
  }, []);

  const plan: WeeklyPlan = useMemo(() => generateWeeklyPlan(profile), [profile]);

  function saveProfile(next: UserProfile) {
    const normalized = normalizeProfile(next);
    setProfileState(normalized);
    setOnboarded(true);
    setCheckedItems({});
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(normalized));
      localStorage.setItem(ONBOARDED_KEY, "1");
      localStorage.removeItem(SHOPPING_KEY);
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

  return { profile, plan, hydrated, onboarded, saveProfile, checkedItems, toggleShoppingItem, resetShopping };
}
