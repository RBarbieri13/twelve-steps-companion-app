import { STEPS, SERENITY_PRAYER, reflectionForToday } from "./data.js";

const STORE_KEY = "twelve-steps-companion:v1";

const defaultState = () => ({
  sobrietyDate: null, // ISO date string "YYYY-MM-DD"
  stepsDone: {}, // { [stepNumber]: true }
  journal: [], // { id, date, stepN|null, text }
});

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable (private mode); app still works in-session */
  }
}

let state = load();
let route = { view: "home", stepN: null };

const app = document.getElementById("app");

// ---------- helpers ----------
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function daysBetween(isoDate) {
  const start = new Date(isoDate + "T00:00:00");
  const now = new Date();
  const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowMid = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((nowMid - startMid) / 86400000));
}

function breakdown(isoDate) {
  const start = new Date(isoDate + "T00:00:00");
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------- views ----------
function renderHome() {
  const view = el(`<div class="view"></div>`);

  // Counter card
  const counter = el(`<section class="card counter"></section>`);
  if (state.sobrietyDate) {
    const total = daysBetween(state.sobrietyDate);
    const b = breakdown(state.sobrietyDate);
    counter.innerHTML = `
      <div class="label">Time in recovery</div>
      <div class="big">${total} ${total === 1 ? "day" : "days"}</div>
      <div class="sub">since ${new Date(state.sobrietyDate + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</div>
      <div class="chips">
        <span class="chip"><b>${b.years}</b> yr</span>
        <span class="chip"><b>${b.months}</b> mo</span>
        <span class="chip"><b>${b.days}</b> d</span>
      </div>
      <button class="btn ghost" id="edit-date">Change date</button>
    `;
    counter.querySelector("#edit-date").addEventListener("click", () => {
      state.sobrietyDate = null;
      save();
      rerender();
    });
  } else {
    counter.innerHTML = `
      <div class="label">Welcome</div>
      <h2>Set your recovery start date</h2>
      <p class="sub">Track your time, one day at a time. Stored only on this device.</p>
      <input type="date" id="set-date" max="${todayISO()}" value="${todayISO()}" />
      <button class="btn" id="save-date">Start counting</button>
    `;
    counter.querySelector("#save-date").addEventListener("click", () => {
      const val = counter.querySelector("#set-date").value;
      if (val) {
        state.sobrietyDate = val;
        save();
        rerender();
      }
    });
  }
  view.appendChild(counter);

  // Daily reflection
  const reflection = el(`
    <section class="card">
      <div class="label">Today's reflection</div>
      <p class="reflection">"${escapeHtml(reflectionForToday())}"</p>
    </section>
  `);
  view.appendChild(reflection);

  // Serenity prayer
  const prayer = el(`
    <section class="card">
      <div class="label">Serenity Prayer</div>
      <p class="prayer">${escapeHtml(SERENITY_PRAYER)}</p>
    </section>
  `);
  view.appendChild(prayer);

  return view;
}

function renderSteps() {
  const view = el(`<div class="view"></div>`);
  const doneCount = STEPS.filter((s) => state.stepsDone[s.n]).length;
  const pct = Math.round((doneCount / STEPS.length) * 100);

  const progress = el(`
    <section class="card">
      <div class="label">Your progress</div>
      <div class="progress-meta"><span>${doneCount} of ${STEPS.length} steps</span><span>${pct}%</span></div>
      <div class="progress-bar"><span style="width:${pct}%"></span></div>
    </section>
  `);
  view.appendChild(progress);

  const list = el(`<section></section>`);
  STEPS.forEach((s) => {
    const done = !!state.stepsDone[s.n];
    const row = el(`
      <div class="step-row ${done ? "done" : ""}">
        <div class="step-num">${done ? "✓" : s.n}</div>
        <div class="step-info">
          <b>Step ${s.n} · ${escapeHtml(s.title)}</b>
          <span>${escapeHtml(s.text)}</span>
        </div>
      </div>
    `);
    row.addEventListener("click", () => {
      route = { view: "step", stepN: s.n };
      rerender();
    });
    list.appendChild(row);
  });
  view.appendChild(list);
  return view;
}

function renderStepDetail(n) {
  const s = STEPS.find((x) => x.n === n);
  const view = el(`<div class="view"></div>`);
  const done = !!state.stepsDone[s.n];

  const card = el(`
    <section class="card">
      <button class="link-back" id="back">← All steps</button>
      <div class="label">Step ${s.n}</div>
      <h2>${escapeHtml(s.title)}</h2>
      <p class="detail-text">${escapeHtml(s.text)}</p>
      <div class="label" style="margin-top:16px">Reflection prompts</div>
      <ul class="prompt-list">
        ${s.prompts.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}
      </ul>
      <div class="toggle-row">
        <input type="checkbox" id="done" ${done ? "checked" : ""} />
        <label for="done">I am working / have completed this step</label>
      </div>
      <button class="btn" id="journal-step">Journal on this step</button>
    </section>
  `);
  card.querySelector("#back").addEventListener("click", () => {
    route = { view: "steps", stepN: null };
    rerender();
  });
  card.querySelector("#done").addEventListener("change", (e) => {
    if (e.target.checked) state.stepsDone[s.n] = true;
    else delete state.stepsDone[s.n];
    save();
  });
  card.querySelector("#journal-step").addEventListener("click", () => {
    route = { view: "journal", stepN: s.n };
    rerender();
  });
  view.appendChild(card);
  return view;
}

function renderJournal(prefillStep = null) {
  const view = el(`<div class="view"></div>`);

  const stepOptions = [`<option value="">No step</option>`]
    .concat(STEPS.map((s) => `<option value="${s.n}" ${prefillStep === s.n ? "selected" : ""}>Step ${s.n} · ${escapeHtml(s.title)}</option>`))
    .join("");

  const composer = el(`
    <section class="card">
      <div class="label">New journal entry</div>
      <label class="field">Related step (optional)
        <select id="entry-step" style="width:100%;background:var(--bg);border:1px solid var(--border);color:var(--text);border-radius:10px;padding:10px 12px;margin-top:8px;font:inherit;">${stepOptions}</select>
      </label>
      <label class="field">Your thoughts
        <textarea id="entry-text" placeholder="Write freely. This stays on your device."></textarea>
      </label>
      <button class="btn" id="save-entry">Save entry</button>
    </section>
  `);
  composer.querySelector("#save-entry").addEventListener("click", () => {
    const text = composer.querySelector("#entry-text").value.trim();
    if (!text) return;
    const stepVal = composer.querySelector("#entry-step").value;
    state.journal.unshift({
      id: `${Date.now()}-${state.journal.length}`,
      date: new Date().toISOString(),
      stepN: stepVal ? Number(stepVal) : null,
      text,
    });
    save();
    route = { view: "journal", stepN: null };
    rerender();
  });
  view.appendChild(composer);

  const listWrap = el(`<section></section>`);
  if (state.journal.length === 0) {
    listWrap.appendChild(el(`<div class="empty">No entries yet. Your reflections will appear here.</div>`));
  } else {
    state.journal.forEach((entry) => {
      const dateStr = new Date(entry.date).toLocaleString(undefined, {
        month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
      });
      const stepLabel = entry.stepN ? `Step ${entry.stepN}` : "";
      const item = el(`
        <article class="entry">
          <div class="meta"><span>${dateStr}${stepLabel ? " · " + stepLabel : ""}</span><button class="del">Delete</button></div>
          <p>${escapeHtml(entry.text)}</p>
        </article>
      `);
      item.querySelector(".del").addEventListener("click", () => {
        state.journal = state.journal.filter((e) => e.id !== entry.id);
        save();
        rerender();
      });
      listWrap.appendChild(item);
    });
  }
  view.appendChild(listWrap);
  return view;
}

// ---------- shell ----------
function renderTabs() {
  const active = route.view === "step" ? "steps" : route.view;
  const tabs = el(`
    <nav class="tabs">
      <button data-tab="home" class="${active === "home" ? "active" : ""}">Home</button>
      <button data-tab="steps" class="${active === "steps" ? "active" : ""}">Steps</button>
      <button data-tab="journal" class="${active === "journal" ? "active" : ""}">Journal</button>
    </nav>
  `);
  tabs.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      route = { view: b.dataset.tab, stepN: null };
      window.scrollTo({ top: 0, behavior: "smooth" });
      rerender();
    });
  });
  return tabs;
}

function rerender() {
  app.innerHTML = "";
  app.appendChild(el(`
    <header class="hero">
      <h1>Twelve Steps Companion</h1>
      <p>A gentle space to work the steps, one day at a time.</p>
    </header>
  `));
  app.appendChild(renderTabs());

  let body;
  switch (route.view) {
    case "steps": body = renderSteps(); break;
    case "step": body = renderStepDetail(route.stepN); break;
    case "journal": body = renderJournal(route.stepN); break;
    default: body = renderHome();
  }
  app.appendChild(body);

  app.appendChild(el(`
    <footer>
      Your data is stored privately in this browser only. ·
      <a href="https://github.com/RBarbieri13/twelve-steps-companion-app">Source</a>
    </footer>
  `));
}

rerender();
