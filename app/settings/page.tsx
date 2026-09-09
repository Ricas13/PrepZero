"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { calculateTargets, normalizeProfile, type UserProfile } from "../../lib/prepzero";

export default function SettingsPage() {
  const { profile, saveProfile, hydrated } = usePrepZero();
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(profile), [profile]);
  if (!hydrated) return <div className="portal-loading">Loading settings…</div>;

  const targets = calculateTargets(draft);
  const valid = draft.age >= 18 && draft.age <= 90 && draft.heightCm >= 130 && draft.heightCm <= 230 && draft.weightKg >= 35 && draft.weightKg <= 300;
  const patch = (next: Partial<UserProfile>) => setDraft((current) => ({ ...current, ...next }));
  const commit = () => {
    if (!valid) return;
    const normalized = normalizeProfile(draft);
    setDraft(normalized);
    saveProfile(normalized);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <AppShell title="Settings" subtitle="Change your body, goal or food preferences. Your plan is rebuilt from the same zero-fuss rules.">
      <div className="settings-layout">
        <section className="settings-panel">
          <div className="settings-title"><span className="card-kicker">PROFILE</span><h2>Your body & goal</h2></div>
          <div className="form-grid two compact-fields">
            <label><span>Name</span><input value={draft.name} onChange={(e) => patch({ name: e.target.value })} /></label>
            <label><span>Sex</span><select value={draft.sex} onChange={(e) => patch({ sex: e.target.value as UserProfile["sex"] })}><option value="male">Male</option><option value="female">Female</option></select></label>
            <label><span>Age</span><input type="number" min="18" max="90" value={draft.age} onChange={(e) => patch({ age: Number(e.target.value) })} /></label>
            <label><span>Height (cm)</span><input type="number" min="130" max="230" value={draft.heightCm} onChange={(e) => patch({ heightCm: Number(e.target.value) })} /></label>
            <label><span>Weight (kg)</span><input type="number" min="35" max="300" step="0.1" value={draft.weightKg} onChange={(e) => patch({ weightKg: Number(e.target.value) })} /></label>
            <label><span>Activity</span><select value={draft.activity} onChange={(e) => patch({ activity: e.target.value as UserProfile["activity"] })}><option value="sedentary">Mostly seated</option><option value="light">Lightly active</option><option value="moderate">Moderately active</option><option value="active">Very active</option><option value="very-active">Extremely active</option></select></label>
            <label><span>Goal</span><select value={draft.goal} onChange={(e) => patch({ goal: e.target.value as UserProfile["goal"] })}><option value="cut">Cut</option><option value="maintain">Maintain</option><option value="bulk">Gain</option></select></label>
            <label><span>Meals per day</span><select value={draft.mealsPerDay} onChange={(e) => patch({ mealsPerDay: Number(e.target.value) as 3 | 4 })}><option value="3">3 meals</option><option value="4">3 meals + snack</option></select></label>
          </div>
          {!valid && <p className="form-error">Age, height or weight is outside the supported range.</p>}
        </section>

        <section className="settings-panel">
          <div className="settings-title"><span className="card-kicker">FOOD</span><h2>Preferences</h2></div>
          <div className="form-grid compact-fields">
            <label><span>Diet</span><select value={draft.diet} onChange={(e) => patch({ diet: e.target.value as UserProfile["diet"] })}><option value="everything">I eat everything</option><option value="vegetarian">Vegetarian</option></select></label>
            <label><span>Allergies</span><input value={draft.allergies} onChange={(e) => patch({ allergies: e.target.value })} placeholder="e.g. peanuts, shellfish" /><small>PrepZero filters the recipe catalogue, but you must still check retailer labels.</small></label>
            <label><span>Foods you dislike</span><input value={draft.dislikes} onChange={(e) => patch({ dislikes: e.target.value })} placeholder="e.g. mushrooms, tuna" /></label>
            <label><span>Supermarket</span><select disabled value="Aldi"><option>Aldi</option></select><small>MVP launch catalogue</small></label>
          </div>
          <div className="fixed-rule-box"><strong>Zero-fuss cannot be turned off.</strong><p>PrepZero always prefers obvious pack fractions, countable ingredients, batch cooking, minimal at-risk leftovers and no portion weighing.</p></div>
        </section>

        <aside className="settings-summary">
          <span className="card-kicker">LIVE TARGETS</span>
          <h2>{targets.calories.toLocaleString()} kcal</h2>
          <div><span>Protein</span><strong>{targets.protein}g+</strong></div>
          <div><span>Fat guide</span><strong>{targets.fat}g</strong></div>
          <div><span>Fibre</span><strong>{targets.fibre}g+</strong></div>
          <div><span>Maintenance</span><strong>{targets.maintenance.toLocaleString()} kcal</strong></div>
          <button className="button" disabled={!valid} onClick={commit}>{saved ? "Saved ✓" : "Save & rebuild plan"}</button>
        </aside>
      </div>
    </AppShell>
  );
}
