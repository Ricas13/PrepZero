import Link from "next/link";
import { AppShell } from "./app-shell";

export function OnboardingRequired({ title = "Set up PrepZero first" }: { title?: string }) {
  return (
    <AppShell title={title} subtitle="This part of the portal needs your nutrition profile before it can show a real plan.">
      <section className="empty-state gate-state">
        <strong>Build your first week before using this screen.</strong>
        <span>It takes four short steps to calculate your targets and generate the first batch-aligned plan.</span>
        <Link className="button portal-button" href="/onboarding">Start onboarding →</Link>
      </section>
    </AppShell>
  );
}
