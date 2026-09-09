const features = [
  {
    icon: "◎",
    title: "Hit your macros",
    text: "Your calories and protein are treated as constraints, not suggestions. The plan adapts around them.",
  },
  {
    icon: "£",
    title: "Spend less",
    text: "PrepZero optimises the real basket you need to buy, using real pack sizes instead of imaginary per-gram costs.",
  },
  {
    icon: "↺",
    title: "Waste almost nothing",
    text: "Ingredients are deliberately reused across the week so opened packs, tins and tubs have somewhere to go.",
  },
  {
    icon: "⌁",
    title: "No scales",
    text: "Use whole packs and simple counts wherever possible. Cook the batch, divide it evenly and your portions are already calculated.",
  },
  {
    icon: "◷",
    title: "Cook less",
    text: "Recipes are grouped into efficient prep sessions so you spend less time chopping, cooking and cleaning.",
  },
  {
    icon: "✦",
    title: "Still proper food",
    text: "High-protein, nutritious, filling meals that are designed to taste good — not a spreadsheet disguised as dinner.",
  },
];

const meals = [
  { name: "Protein French toast", type: "Breakfast", price: "£0.91", kcal: "481", protein: "42g" },
  { name: "Cajun chicken pasta", type: "Lunch", price: "£1.28", kcal: "612", protein: "52g" },
  { name: "Greek yoghurt bowl", type: "Snack", price: "£0.63", kcal: "298", protein: "27g" },
  { name: "Loaded chilli potatoes", type: "Dinner", price: "£1.43", kcal: "883", protein: "54g" },
];

const steps = [
  {
    number: "01",
    title: "Tell us what your body needs",
    text: "Set your height, weight, activity, goal and eating preferences. We calculate the daily targets and keep nutrition non-negotiable.",
  },
  {
    number: "02",
    title: "We optimise the entire week",
    text: "PrepZero chooses recipes, pack sizes and batch quantities together — balancing macros, price, waste, food volume and cooking time.",
  },
  {
    number: "03",
    title: "Buy it. Cook it. Divide it.",
    text: "Shop once, cook the planned batches and split them into the number of portions shown. The maths is already done.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <a className="brand" href="#top" aria-label="PrepZero home">
          <span className="brand-mark">P0</span>
          <span>PrepZero</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#why">Why PrepZero</a>
          <a href="#example">Example week</a>
        </nav>
        <a className="button button-small" href="#join">Get early access</a>
      </header>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot" /> Food efficiency, without the faff</div>
          <h1>Buy it. Cook it.<br /><span>Divide it. Done.</span></h1>
          <p className="hero-lead">
            Hit your macros with less waste, less cost and less time in the kitchen. PrepZero builds your week around real supermarket packs — so you can stop weighing every meal and start eating.
          </p>
          <div className="hero-actions">
            <a className="button" href="#join">Build my week <span>→</span></a>
            <a className="text-link" href="#how">See how it works <span>↓</span></a>
          </div>
          <div className="promise-row" aria-label="PrepZero benefits">
            <span>✓ No portion scales</span>
            <span>✓ Minimal waste</span>
            <span>✓ Macro-led</span>
          </div>
        </div>

        <div className="hero-visual" id="example">
          <div className="week-card">
            <div className="week-card-top">
              <div>
                <span className="card-kicker">YOUR OPTIMISED WEEK</span>
                <h2>£34.82 <small>/ week</small></h2>
              </div>
              <span className="efficiency-badge">94% efficient</span>
            </div>

            <div className="macro-strip">
              <div><strong>2,274</strong><span>kcal / day</span></div>
              <div><strong>174g</strong><span>protein</span></div>
              <div><strong>33g</strong><span>fibre</span></div>
            </div>

            <div className="mini-heading"><span>Today</span><span>£4.25</span></div>
            <div className="meal-list">
              {meals.map((meal) => (
                <div className="meal-row" key={meal.name}>
                  <div className="meal-icon">{meal.type.slice(0, 1)}</div>
                  <div className="meal-name">
                    <strong>{meal.name}</strong>
                    <span>{meal.type}</span>
                  </div>
                  <div className="meal-macros">
                    <strong>{meal.price}</strong>
                    <span>{meal.kcal} kcal · {meal.protein} protein</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="week-footer">
              <div><span className="footer-icon">↺</span><strong>£0.46</strong><span>unused food</span></div>
              <div><span className="footer-icon">◷</span><strong>1h 26m</strong><span>kitchen time</span></div>
              <div><span className="footer-icon">▦</span><strong>2</strong><span>prep sessions</span></div>
            </div>
          </div>
          <div className="floating-note note-one"><span>✓</span><div><strong>Whole packs preferred</strong><small>Less measuring. Less leftovers.</small></div></div>
          <div className="floating-note note-two"><span>4</span><div><strong>Divide into 4</strong><small>Each portion already calculated.</small></div></div>
        </div>
      </section>

      <section className="logo-strip" aria-label="PrepZero principles">
        <div className="shell logo-strip-inner">
          <span>MACRO ACCURATE</span><i>•</i><span>ZERO-FUSS PREP</span><i>•</i><span>REAL PACK SIZES</span><i>•</i><span>LESS WASTE</span><i>•</i><span>LOWER COST</span>
        </div>
      </section>

      <section className="section shell" id="why">
        <div className="section-heading">
          <span className="eyebrow plain">Designed for real life</span>
          <h2>Meal planning that optimises more than calories.</h2>
          <p>Most apps tell you what you ate. PrepZero figures out the most efficient way to feed you in the first place.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dark-section" id="how">
        <div className="shell">
          <div className="section-heading light-heading">
            <span className="eyebrow plain light">How it works</span>
            <h2>The complicated part happens behind the screen.</h2>
            <p>You get a simple week to follow. PrepZero handles the nutrition, pack maths and optimisation underneath.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

          <div className="batch-demo">
            <div className="batch-copy">
              <span className="eyebrow plain light">A better kind of recipe</span>
              <h2>No 173g chicken. No 84g rice. No portion maths.</h2>
              <p>PrepZero deliberately looks for whole packs, tins and easy counts. Your recipe is built around what you actually buy — not laboratory-perfect ingredient quantities.</p>
              <ul className="check-list">
                <li><span>✓</span> Use the whole chicken pack</li>
                <li><span>✓</span> Use the whole passata carton</li>
                <li><span>✓</span> Cook one batch</li>
                <li><span>✓</span> Divide evenly into 5 containers</li>
              </ul>
            </div>
            <div className="recipe-card">
              <div className="recipe-top">
                <div>
                  <span className="card-kicker">SUNDAY PREP · 26 MIN</span>
                  <h3>Creamy Cajun Chicken Pasta</h3>
                </div>
                <span className="servings">5 meals</span>
              </div>
              <div className="ingredient-list">
                <div><span>1×</span><p><strong>Chicken breast pack</strong><small>Use all of it</small></p><b>✓</b></div>
                <div><span>1×</span><p><strong>Pasta pack</strong><small>Use all of it</small></p><b>✓</b></div>
                <div><span>1×</span><p><strong>Passata carton</strong><small>Use all of it</small></p><b>✓</b></div>
                <div><span>1×</span><p><strong>Light cream cheese tub</strong><small>Use all of it</small></p><b>✓</b></div>
                <div><span>3×</span><p><strong>Peppers</strong><small>Whole items</small></p><b>✓</b></div>
              </div>
              <div className="divide-box">
                <div className="divide-icon">5</div>
                <div><strong>Cook everything. Mix well. Divide into 5.</strong><span>Each portion: 612 kcal · 52g protein</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="manifesto-card">
          <div>
            <span className="eyebrow plain">The PrepZero rule</span>
            <h2>If saving 12p makes the plan annoying, we don’t save the 12p.</h2>
          </div>
          <p>Cheap only matters if the plan is practical enough to follow. PrepZero optimises for the lowest-friction, nutritionally sound week — not the absolute cheapest spreadsheet of ingredients.</p>
        </div>
      </section>

      <section className="cta-section" id="join">
        <div className="shell cta-inner">
          <span className="eyebrow plain">PrepZero</span>
          <h2>Eat better. Spend less.<br />Think about it once.</h2>
          <p>Join early access and be first to try food planning built around efficiency, not admin.</p>
          <form className="signup-form" action="#">
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@example.com" required />
            <button type="submit" className="button">Get early access <span>→</span></button>
          </form>
          <small>No spam. Just launch updates and early access.</small>
        </div>
      </section>

      <footer className="footer shell">
        <a className="brand" href="#top"><span className="brand-mark">P0</span><span>PrepZero</span></a>
        <p>Buy it. Cook it. Divide it. Done.</p>
        <span>© 2026 PrepZero</span>
      </footer>
    </main>
  );
}
