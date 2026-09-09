import Link from "next/link";

const features = [
  { icon: "◎", title: "Hit your macros", text: "Calories and protein are constraints, not suggestions. Your week is built around what your body actually needs." },
  { icon: "£", title: "Spend less", text: "Optimise the basket you really pay for, using actual pack sizes instead of imaginary per-gram recipe costs." },
  { icon: "↺", title: "Waste almost nothing", text: "Recipes and batches work together so opened packs, tins and tubs have somewhere useful to go." },
  { icon: "⌁", title: "No scales", text: "Cook the batch, mix it well and divide it evenly. The macros per portion are already worked out." },
  { icon: "◷", title: "Cook less", text: "Your week is grouped into efficient batch sessions so you spend less time chopping, cooking and cleaning." },
  { icon: "✦", title: "Still proper food", text: "Nutritious, filling meals designed to taste good. A mathematically perfect meal nobody wants is a failed meal." },
];

const meals = [
  { name: "Berry yoghurt overnight oats", type: "Breakfast", price: "£1.51", kcal: "472", protein: "39g" },
  { name: "Creamy Cajun chicken pasta", type: "Lunch", price: "£2.09", kcal: "626", protein: "54g" },
  { name: "Yoghurt crunch pot", type: "Snack", price: "£1.41", kcal: "312", protein: "28g" },
  { name: "Smoky fajita chicken rice", type: "Dinner", price: "£1.99", kcal: "641", protein: "53g" },
];

const steps = [
  { number: "01", title: "Tell us what your body needs", text: "Enter height, weight, activity and goal. PrepZero estimates maintenance and sets sensible calorie, protein, fat and fibre targets." },
  { number: "02", title: "We optimise the entire week", text: "The planner chooses recipes, packs and batch sizes together — balancing nutrition, basket cost, waste, volume and kitchen time." },
  { number: "03", title: "Buy it. Cook it. Divide it.", text: "Shop the list, cook the planned batches and split them into the shown portions. No weighing every container afterwards." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="PrepZero home"><span className="brand-mark">P0</span><span>PrepZero</span></a>
        <nav className="nav-links" aria-label="Main navigation"><a href="#how">How it works</a><a href="#why">Why PrepZero</a><a href="#example">Example week</a></nav>
        <div className="hero-actions header-actions"><Link className="text-link" href="/dashboard">Open app</Link><Link className="button button-small" href="/onboarding">Build my week</Link></div>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot" /> Food efficiency, without the faff</div>
          <h1>Buy it. Cook it.<br /><span>Divide it. Done.</span></h1>
          <p className="hero-lead">Hit your macros with less waste, less cost and less time in the kitchen. PrepZero builds your week around complete supermarket packs so you can stop weighing every meal and just follow the plan.</p>
          <div className="hero-actions"><Link className="button" href="/onboarding">Build my week <span>→</span></Link><a className="text-link" href="#how">See how it works <span>↓</span></a></div>
          <div className="promise-row"><span>✓ No portion scales</span><span>✓ Minimal waste</span><span>✓ Nutrition first</span></div>
        </div>

        <div className="hero-visual" id="example">
          <div className="week-card">
            <div className="week-card-top"><div><span className="card-kicker">YOUR OPTIMISED WEEK</span><h2>£34.82 <small>/ week</small></h2></div><span className="efficiency-badge">94% efficient</span></div>
            <div className="macro-strip"><div><strong>2,274</strong><span>kcal / day</span></div><div><strong>174g</strong><span>protein</span></div><div><strong>33g</strong><span>fibre</span></div></div>
            <div className="mini-heading"><span>Today</span><span>£7.00</span></div>
            <div className="meal-list">{meals.map((meal) => <div className="meal-row" key={meal.name}><div className="meal-icon">{meal.type[0]}</div><div className="meal-name"><strong>{meal.name}</strong><span>{meal.type}</span></div><div className="meal-macros"><strong>{meal.price}</strong><span>{meal.kcal} kcal · {meal.protein} protein</span></div></div>)}</div>
            <div className="week-footer"><div><span className="footer-icon">↺</span><strong>£0.46</strong><span>unused food</span></div><div><span className="footer-icon">◷</span><strong>1h 26m</strong><span>kitchen time</span></div><div><span className="footer-icon">▦</span><strong>2</strong><span>prep sessions</span></div></div>
          </div>
          <div className="floating-note note-one"><span>✓</span><div><strong>Whole packs preferred</strong><small>Less measuring. Less leftovers.</small></div></div>
          <div className="floating-note note-two"><span>4</span><div><strong>Divide into 4</strong><small>Each portion already calculated.</small></div></div>
        </div>
      </section>

      <section className="logo-strip"><div className="shell logo-strip-inner"><span>MACRO ACCURATE</span><i>•</i><span>ZERO-FUSS PREP</span><i>•</i><span>REAL PACK SIZES</span><i>•</i><span>LESS WASTE</span><i>•</i><span>LOWER COST</span></div></section>

      <section className="section shell" id="why">
        <div className="section-heading"><span className="eyebrow plain">Designed for real life</span><h2>Meal planning that optimises more than calories.</h2><p>Most apps tell you what you ate. PrepZero works out the most efficient way to feed you in the first place.</p></div>
        <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><span className="feature-icon">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
      </section>

      <section className="dark-section" id="how">
        <div className="shell">
          <div className="section-heading light-heading"><span className="eyebrow plain light">How it works</span><h2>The complicated part happens behind the screen.</h2><p>You get a simple week to follow. PrepZero handles the nutrition, pack maths and planning underneath.</p></div>
          <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span className="step-number">{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
          <div className="batch-demo">
            <div className="batch-copy"><span className="eyebrow plain light">A better kind of recipe</span><h2>No 173g chicken. No 84g rice. No portion maths.</h2><p>PrepZero deliberately favours whole packs, tins and simple counts. The plan is built around what you actually buy, not laboratory-perfect ingredient quantities.</p><ul className="check-list"><li><span>✓</span> Use the complete chicken pack</li><li><span>✓</span> Use complete tins and cartons</li><li><span>✓</span> Cook one batch</li><li><span>✓</span> Mix well and divide evenly</li></ul></div>
            <div className="recipe-card"><div className="recipe-top"><div><span className="card-kicker">SUNDAY PREP · 32 MIN</span><h3>Creamy Cajun Chicken Pasta</h3></div><span className="servings">5 meals</span></div><div className="ingredient-list"><div><span>1×</span><p><strong>Chicken breast pack</strong><small>Use all of it</small></p><b>✓</b></div><div><span>1×</span><p><strong>Pasta pack</strong><small>Use all of it</small></p><b>✓</b></div><div><span>1×</span><p><strong>Passata carton</strong><small>Use all of it</small></p><b>✓</b></div><div><span>1×</span><p><strong>Light soft cheese tub</strong><small>Use all of it</small></p><b>✓</b></div><div><span>3×</span><p><strong>Peppers</strong><small>Whole items</small></p><b>✓</b></div></div><div className="divide-box"><div className="divide-icon">5</div><div><strong>Cook everything. Mix well. Divide into 5.</strong><span>Each portion: 626 kcal · 54g protein</span></div></div></div>
          </div>
        </div>
      </section>

      <section className="section shell"><div className="manifesto-card"><div><span className="eyebrow plain">The PrepZero rule</span><h2>If saving 12p makes the plan annoying, we don't save the 12p.</h2></div><p>Cheap only matters if the plan is practical enough to follow. PrepZero optimises for the lowest-friction, nutritionally sound week — not the absolute cheapest spreadsheet of ingredients.</p></div></section>

      <section className="cta-section"><div className="shell cta-inner"><span className="eyebrow plain">PrepZero</span><h2>Eat better. Spend less.<br />Think about it once.</h2><p>Your first working planner is ready. Set your body, goal and preferences and see the complete week.</p><Link className="button" href="/onboarding">Build my week <span>→</span></Link></div></section>
      <footer className="footer shell"><a className="brand" href="#top"><span className="brand-mark">P0</span><span>PrepZero</span></a><p>Buy it. Cook it. Divide it. Done.</p><span>© 2026 PrepZero</span></footer>
    </main>
  );
}
