"use client";

import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { formatPackAmount, money } from "../../lib/prepzero";

export default function ShoppingPage() {
  const { plan, hydrated, checkedItems, toggleShoppingItem, resetShopping } = usePrepZero();
  if (!hydrated) return <div className="portal-loading">Loading shopping list…</div>;

  const grouped = plan.shopping.reduce<Record<string, typeof plan.shopping>>((acc, item) => {
    (acc[item.aisle] ||= []).push(item);
    return acc;
  }, {});
  const checked = plan.shopping.filter((item) => checkedItems[item.productId]).length;
  const totalPacks = plan.shopping.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AppShell
      title="Shopping list"
      subtitle="PrepZero aggregates ingredient use across every recipe first, then rounds up to the retail packs you actually need to buy."
      action={<button className="button-ghost small" onClick={resetShopping}>Reset ticks</button>}
    >
      <section className="shopping-total-card">
        <div><span className="card-kicker">ALDI · THIS WEEK</span><strong>{money(plan.weeklyCost)}</strong><small>{totalPacks} pack{totalPacks === 1 ? "" : "s"} across {plan.shopping.length} products · {checked}/{plan.shopping.length} picked</small></div>
        <div className="shopping-progress"><span style={{ width: `${plan.shopping.length ? (checked / plan.shopping.length) * 100 : 0}%` }} /></div>
        <p>Prices and nutrition are MVP seed data. The pack-matching logic is real, but the catalogue needs a maintained retailer feed before public launch.</p>
      </section>

      {plan.shopping.length ? (
        <div className="shopping-groups">
          {Object.entries(grouped).map(([aisle, items]) => (
            <section className="shopping-group" key={aisle}>
              <div className="shopping-group-title"><h2>{aisle}</h2><span>{items.length} product{items.length === 1 ? "" : "s"}</span></div>
              {items.map((item) => {
                const key = item.productId;
                const isChecked = !!checkedItems[key];
                return (
                  <button className={isChecked ? "shopping-row checked" : "shopping-row"} key={key} onClick={() => toggleShoppingItem(key)}>
                    <span className="shopping-check">{isChecked ? "✓" : ""}</span>
                    <span className="shopping-qty">{item.qty}×</span>
                    <span className="shopping-name">
                      <strong>{item.name}</strong>
                      <small>{item.pack}</small>
                      {item.leftoverAmount > 0.001 && <small>After the plan: {formatPackAmount(item.leftoverAmount, item.unit)} left</small>}
                    </span>
                    <strong className="shopping-price">{money(item.price * item.qty)}</strong>
                  </button>
                );
              })}
            </section>
          ))}
        </div>
      ) : <div className="empty-state"><strong>No compatible basket yet.</strong><span>Review the plan warnings and food exclusions.</span></div>}

      <section className="shopping-rule"><span>↺</span><div><strong>What counts as waste?</strong><p>PrepZero still tracks any purchased surplus, but the headline waste value weights perishable food much more heavily than shelf-stable or frozen leftovers. A quarter bag of dry oats is inventory; half a forgotten chicken pack is a problem.</p></div></section>
    </AppShell>
  );
}
