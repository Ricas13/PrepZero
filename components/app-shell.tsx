"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  ["/dashboard", "Overview", "⌂"],
  ["/plan", "My week", "▦"],
  ["/shopping", "Shopping", "✓"],
  ["/prep", "Prep", "◷"],
  ["/recipes", "Recipes", "◫"],
  ["/settings", "Settings", "⚙"],
] as const;

export function AppShell({ children, title, subtitle, action }: { children: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="portal-root">
      <aside className="portal-sidebar">
        <Link className="portal-brand" href="/dashboard">
          <span className="brand-mark">P0</span>
          <span>PrepZero</span>
        </Link>
        <nav className="portal-nav">
          {links.map(([href, label, icon]) => (
            <Link key={href} href={href} className={pathname === href ? "active" : ""}>
              <span>{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-rule">
          <strong>Buy it. Cook it.<br />Divide it. Done.</strong>
          <span>No scales. Less waste. Less faff.</span>
        </div>
        <Link className="back-home" href="/">← PrepZero home</Link>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div>
            <div className="mobile-brand"><span className="brand-mark">P0</span><strong>PrepZero</strong></div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action && <div className="portal-action">{action}</div>}
        </header>
        <div className="portal-content">{children}</div>
      </div>

      <nav className="mobile-nav" aria-label="App navigation">
        {links.slice(0, 5).map(([href, label, icon]) => (
          <Link key={href} href={href} className={pathname === href ? "active" : ""}>
            <span>{icon}</span><small>{label}</small>
          </Link>
        ))}
      </nav>
    </div>
  );
}
