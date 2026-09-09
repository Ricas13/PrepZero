"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateTargets, defaultProfile, type UserProfile } from "../../lib/prepzero";
import { usePrepZero } from "../../components/use-prepzero";

const activities = [
  ["sedentary", "Mostly seated", "Little structured exercise"],
  ["light", "Lightly active", "1–3 active days per week"],
  ["moderate", "Moderately active", "3–5 active days per week"],
  ["active", "Very active", "Hard exercise most days"],
  ["very-active", "Extremely active", "Very physical job + training"],
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { profile: saved, saveProfile } = usePrepZero();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({ ...defaultProfile, ...saved });
  const targets = useMemo(() => calculateTargets(profile), [profile]);

  function patch(next: Partial<UserProfile>) {
    setProfile((p) => ({ ...p, ...next }));
  }

  function finish() {
    saveProfile(profile);
    router.push("/dashboard");
  }

  return (
    <main className="onboarding-page">
      <header className="onboarding-header">
        <a className="portal-brand" href="/"><span className="brand-mark">P0</span><span>PrepZero</span></a>
        <span className="onboarding-tag">Buy it. Cook it. Divide it. Done.</span>
      </header>

      <div className="onboarding-shell">
        <div className="onboarding-progress">
          {[0, 1, 2, 3].map((n) => <span key={n} className={step >= n ? "active" : ""} />)}
        </div>

        {step === 0 && (
          <section className="onboarding-card">
            <span className="card-kicker">STEP 1 OF 4 · YOUR BODY</span>
            <h1>First, what does your body need?</h1>
            <p>We use this to estimate your daily energy needs. You can change the result later.</p>
            <div className="form-grid two">
              <label><span>Name</span><input value={profile.name} onChange={(e) => patch({ name: e.target.value })} placeholder="Ricardo" /></label>
              <label><span>Sex</span><select value={profile.sex} onChange={(e) => patch({ sex: e.target.value as UserProfile["sex"] })}><option value="male">Male</option><option value="female">Female</option></select></label>
              <label><span>Age</span><input type="number" min="18" max="90" value={profile.age} onChange={(e) => patch({ age: Number(e.target.value) })} /></label>
              <label><span>Height (cm)</span><input type="number" min="140" max="220" value={profile.heightCm} onChange={(e) => patch({ heightCm: Number(e.target.value) })} /></label>
              <label><span>Weight (kg)</span><input type="number" min="40" max="250" step="0.1" value={profile.weightKg} onChange={(e) => patch({ weightKg: Number(e.target.value) })} /></label>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="onboarding-card">
            <span className="card-kicker">STEP 2 OF 4 · YOUR GOAL</span>
            <h1>What are we optimising for?</h1>
            <p>Macros stay sensible. PrepZero then finds the lowest-friction way to hit them.</p>
            <div className="choice-grid three">
              {([
                ["cut", "Cut", "Lose fat steadily", "−450 kcal/day"],
                ["maintain", "Maintain", "Keep body weight stable", "Maintenance calories"],
                ["bulk", "Gain", "Build with a modest surplus", "+300 kcal/day"],
              ] as const).map(([value, title, body, meta]) => (
                <button key={value} className={profile.goal === value ? "choice-card selected" : "choice-card"} onClick={() => patch({ goal: value })}>
                  <strong>{title}</strong><span>{body}</span><small>{meta}</small>
                </button>
              ))}
            </div>
            <h3 className="form-subhead">How active are you?</h3>
            <div className="activity-list">
              {activities.map(([value, title, body]) => (
                <button key={value} onClick={() => patch({ activity: value })} className={profile.activity === value ? "activity-row selected" : "activity-row"}>
                  <span><strong>{title}</strong><small>{body}</small></span><i>{profile.activity === value ? "✓" : ""}</i>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="onboarding-card">
            <span className="card-kicker">STEP 3 OF 4 · REAL LIFE</span>
            <h1>Tell us what you actually eat.</h1>
            <p>No effort slider. PrepZero is always zero-fuss — this just keeps the plan realistic for you.</p>
            <div className="form-grid two">
              <label><span>Meals per day</span><select value={profile.mealsPerDay} onChange={(e) => patch({ mealsPerDay: Number(e.target.value) as 3 | 4 })}><option value="3">3 meals</option><option value="4">3 meals + snack</option></select></label>
              <label><span>Supermarket</span><select value={profile.supermarket} disabled><option>Aldi</option></select><small>Aldi is the launch catalogue. More supermarkets come next.</small></label>
              <label><span>Diet</span><select value={profile.diet} onChange={(e) => patch({ diet: e.target.value as UserProfile["diet"] })}><option value="everything">I eat everything</option><option value="vegetarian">Vegetarian</option></select></label>
              <label><span>Allergies</span><input value={profile.allergies} onChange={(e) => patch({ allergies: e.target.value })} placeholder="e.g. peanuts, shellfish" /><small>Comma-separated is fine.</small></label>
              <label className="full"><span>Foods you really dislike</span><input value={profile.dislikes} onChange={(e) => patch({ dislikes: e.target.value })} placeholder="e.g. mushrooms, tuna" /></label>
            </div>
            <div className="zero-fuss-banner"><strong>Zero-fuss is always on.</strong><span>Whole packs, countable ingredients, batch cooking, no portion scales and as little leftover food as possible.</span></div>
          </section>
        )}

        {step === 3 && (
          <section className="onboarding-card result-card">
            <span className="card-kicker">STEP 4 OF 4 · YOUR TARGETS</span>
            <h1>{profile.name ? `${profile.name}, this` : "This"} is what we'll build around.</h1>
            <p>Nutrition comes first. Cost, waste and kitchen time are optimised underneath these targets.</p>
            <div className="target-grid">
              <div><small>Daily calories</small><strong>{targets.calories.toLocaleString()}</strong><span>kcal</span></div>
              <div><small>Protein minimum</small><strong>{targets.protein}</strong><span>g / day</span></div>
              <div><small>Fat minimum</small><strong>{targets.fat}</strong><span>g / day</span></div>
              <div><small>Fibre target</small><strong>{targets.fibre}</strong><span>g / day</span></div>
            </div>
            <div className="calculation-note"><span>◎</span><div><strong>Estimated maintenance: {targets.maintenance.toLocaleString()} kcal</strong><p>BMR {targets.bmr.toLocaleString()} kcal · {profile.goal === "cut" ? "moderate deficit applied" : profile.goal === "bulk" ? "modest surplus applied" : "maintenance target"}</p></div></div>
            <div className="promise-panel">
              <strong>What PrepZero will now do</strong>
              <ul><li>Keep calories close to target and protein at or above target</li><li>Prefer filling, fibre-rich meals</li><li>Build around actual Aldi pack sizes</li><li>Minimise basket cost, waste and prep time</li><li>Tell you how many equal portions to divide every batch into</li></ul>
            </div>
          </section>
        )}

        <div className="onboarding-actions">
          <button className="button-ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>← Back</button>
          {step < 3 ? <button className="button" onClick={() => setStep((s) => Math.min(3, s + 1))}>Continue →</button> : <button className="button" onClick={finish}>Build my first week →</button>}
        </div>
      </div>
    </main>
  );
}
