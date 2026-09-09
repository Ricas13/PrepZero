"use client";

import { AppShell } from "../../components/app-shell";
import { usePrepZero } from "../../components/use-prepzero";
import { money } from "../../lib/prepzero";

export default function ShoppingPage() {
  const { plan, hydrated, checkedItems, toggleShoppingItem, resetShopping } = usePrepZero();
  if (!hydrated) return <div className="portal-loading">Loading shopping list…</div>;

  const grouped = plan.shopping.reduce<Record<string, typeof plan.shopping>>((acc, item) => {
    (acc[item.aisle] ||= []).push(item);
    return acc;
  }, {});
  const checked = plan.shopping.filter((item) => checkedItems[`${item.name}|${item.pack}`]).length;

  return (
    <AppShell
      title="Shopping list"
      subtitle="The list uses complete retail packs — because you pay for the pack, not the grams in a recipe."
      action={<button className="button-ghost small" onClick={resetShopping}>Reset ticks</button>}
    >
      <section className="shopping-total-card">
        <div><span className="card-kicker">ALDI · THIS WEEK</span><strong>{money(plan.weeklyCost)}</strong><small>{plan.shopping.length} packs · {checked}/{plan.shopping.length} picked</small></div>
        <div className="shopping-progress"><span style={{ width: `${plan.shopping.length ? (checked / plan.shopping.length) * 100 : 0}%` }} /></div>
        <p>Prices are from the launch catalogue data currently bundled with the MVP and are designed to be replaceable by a live retailer feed later.</p>
      </section>

      <div className="shopping-groups">
        {Object.entries(grouped).map(([aisle, items]) => (
          <section className="shopping-group" key={aisle}>
            <div className="shopping-group-title"><h2>{aisle}</h2><span>{items.length} items</span></div>
            {items.map((item) => {
              const key = `${item.name}|${item.pack}`;
              const isChecked = !!checkedItems[key];
              return (
                <button className={isChecked ? "shopping-row checked" : "shopping-row"} key={key} onClick={() => toggleShoppingItem(key)}>
                  <span className="shopping-check">{isChecked ? "✓" : ""}</span>
                  <span className="shopping-qty">{item.qty}×</span>
                  <span className="shopping-name"><strong>{item.name}</strong><small>{item.pack}</small></span>
                  <strong className="shopping-price">{money(item.price * item.qty)}</strong>
                </button>
              );
            })}
          </section>
        ))}
      </div>

      <section className="shopping-rule"><span>↺</span><div><strong>Why whole packs?</strong><p>PrepZero plans recipes and batch sizes together so the products you actually buy are used deliberately instead of leaving awkward half-packs behind.</p></div></section>
    </AppShell>
  );
}
