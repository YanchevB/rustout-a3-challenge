# RUST-OUT

> **Apollo3 Web Design Challenge** — This project was built for the [A3 platform](https://a3icp.com/#top), which hosted four distinct competition categories:
> 1. One Color Challenge
> 2. Worst UX Challenge
> 3. **Web Game Challenge** ← this entry
> 4. 2126 Portfolio Challenge
>
> The project was deployed on the A3 platform and submitted under category 3.

---

> **rust-out** *(n.)* — the gradual disengagement that sets in when work becomes too repetitive, too pointless, or too unchallenging. Unlike burnout, which comes from doing too much, rust-out comes from doing too little of anything that matters. You don't burn out — you slowly corrode.

---

A browser-based escape room game set inside a corporate dashboard. You play as an office worker who has been staring at the same screens for too long — and slowly realises the company is hiding something. Work through a series of puzzles hidden inside what looks like a normal analytics dashboard to uncover the truth and escape.

No frameworks, no build steps. Pure HTML, CSS, and vanilla JavaScript.

---

## Project Structure

```
rustout-a3-challenge/
├── index.html   — All markup: landing page, dashboard, sidebar, panels, end screen
├── styles.css   — All styling, including puzzle-specific states and animations
└── script.js    — All game logic, puzzle handlers, animations, and audio
```

### index.html

Two main views plus an end screen, all in one file:

- **Landing page** (`#landing`) — title and Wake Up button
- **Dashboard** (`#dashboard`) — fixed sidebar with navigation and task tracker, fixed top bar with key counter, and a scrollable main content area containing all the puzzle panels
- **End screen** (`#end-screen`) — shown after the game is completed

The dashboard is hidden on load and revealed when the player clicks Wake Up.

### styles.css

Organised into sections matching the game's structure:

- Base reset and CSS custom properties
- Shared utilities (`.hidden`, buttons)
- Landing and end screen layouts
- Dashboard shell (sidebar, top bar, main content grid)
- Panel cards and KPI widgets
- Decorative chart containers
- Puzzle-specific styles (budget table, expense list, asset panel, password lock)
- Modal and toast notification styles
- Fly-key animation and escape sequence styles

### script.js

Organised into clearly labelled sections:

- **Game state** — a single `gameState` object tracks current task, keys found, scroll lock, and exit clicks remaining
- **Task messages** — a map from task number to the hint text shown in the sidebar
- **Shared utilities** — `playChime()`, `showModal()`, `showToast()`
- **Fly-key animation** — `flyKey(fromEl, onLand)` animates a 🔑 from a source element to the key counter
- **Puzzles 1–6** — one IIFE or event listener block per puzzle
- **Decorative charts** — Chart.js initialisation for the three dashboard charts

---

## Game Flow

```
Landing → Dashboard appears → Modal hint → Puzzle 1 → 2 → 3 → 4 (X) → 4 (password) → 5 → 6 (type ESCAPE) → EXIT clicks → End screen
```

Each puzzle awards one key. Six keys total. The number of keys collected determines how many times the player must click EXIT to escape.

---

## Puzzle Solutions

### Puzzle 1 — Submit the Q1 Report
**Task:** "The Q1 report is still missing. Find the report and submit it."

Click the **Submit Report** button inside the Q1 Report panel. The report status updates to Submitted, the key counter appears in the top bar, and the Budget Calculations panel becomes interactive.

---

### Puzzle 2 — Fix the Budget Total
**Task:** "There is something wrong with the budget again. Fix it now."

The Q1 Total in the Budget Calculations panel shows **€13,000**, but the three monthly figures add up to €4,200 + €3,800 + €5,100 = **€13,100**. Click the total cell and type `13100` (with or without the € and comma), then confirm. The Expense Breakdown panel unblurs.

---

### Puzzle 3 — Find the Suspicious Expense
**Task:** "Some company expenses seemed to be way higher than the rest."

In the Expense Breakdown panel, click the **Executive Discretionary Fund** row (the one with €379,700 — slightly higher than all the others). Clicking any other row gives a "No, that doesn't seem to be it" toast. Clicking the right row unlocks vertical scrolling on the page, allowing you to scroll down to hidden panels.

---

### Puzzle 4 (Part 1) — Dismiss the Decoy Panel
**Task:** "Maybe the boss is hiding these assets somewhere unannounced."

After solving Puzzle 3, scroll down. An Internal Announcements panel appears with a small **✕** button in its top-right corner (only visible after Puzzle 3 is complete). Click the ✕ to close it. The hidden asset panel appears beneath it.

---

### Puzzle 4 (Part 2) — Unlock the Asset Panel
**Task:** "It seems to be password protected — maybe it is something management values the most?"

The asset panel is covered by a password prompt. The Company Overview panel elsewhere on the dashboard contains four KPI boxes; the bottom-right one reads **GREED** under "Core Company Value". Type `greed` (case-insensitive) into the password field and click Unlock.

---

### Puzzle 5 — Withdraw All Assets
**Task:** "These are definitely not company property. Withdraw the funds now!"

Click the **Withdraw All Assets** button that appears after unlocking the asset panel. The asset values count down to €0 over 1.5 seconds.

---

### Puzzle 6 — Escape
**Task:** "We have to ESCAPE! Find a way to navigate to the exit!"

Six letter boxes appear in the top bar. Type the word **ESCAPE** on your keyboard one letter at a time. Each correct letter lights up its box in purple. A wrong letter resets the sequence. Once all six letters are filled, an **EXIT** button appears.

Click EXIT once for each key you collected (6 times). The counter in the hint counts down with each click. On the final click, the dashboard hides and the end screen is shown.

---

## Running Locally

Open `index.html` directly in a browser. No server, no dependencies to install — Chart.js is loaded from a CDN.
