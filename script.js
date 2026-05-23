/* ============================================================
   GAME STATE
============================================================ */
const gameState = {
  currentTask: 1,
  keysFound: 0,
  scrollUnlocked: false,
  escapeSequence: [],
  exitClicksRemaining: 0
};

/* ============================================================
   TASK MESSAGES
   currentTask can be 1–6 or the string '4b'.
============================================================ */
const taskMessages = {
  1:   'Find the Q1 report and submit it',
  2:   'Fix the budget calculations for the following months',
  3:   'Find out which expense is costing the company the most',
  4:   'Interesting, the boss only thinks about his holidays.. Find out where his assets are',
  '4b':'Find a way to crack the password',
  5:   "This will teach him, let's take it away from him!",
  6:   'Get out. Now.'
};

/* ============================================================
   UPDATE TASK LIST
============================================================ */
function updateTaskList() {
  const el = document.getElementById('task-text');
  if (el) el.textContent = taskMessages[gameState.currentTask] || '';
}

/* ============================================================
   LANDING → DASHBOARD TRANSITION
============================================================ */
const btnWakeUp = document.getElementById('btn-wake-up');
if (btnWakeUp) {
  btnWakeUp.addEventListener('click', function () {
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateTaskList();
    initCharts();
  });
}

// Dev fallback: if dashboard is already visible on load (landing commented out),
// run initialisation now so the game doesn't silently fail.
(function () {
  const dash = document.getElementById('dashboard');
  if (dash && !dash.classList.contains('hidden')) {
    document.body.style.overflow = 'hidden';
    updateTaskList();
    initCharts();
  }
}());

/* ============================================================
   PUZZLE 1 — Q1 Report Submit
============================================================ */
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(784, ctx.currentTime);       // G5
    osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.07); // C6
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch (e) {}
}

document.getElementById('btn-submit-q1').addEventListener('click', function () {
  playChime();

  gameState.keysFound = 1;
  document.getElementById('key-counter').classList.remove('hidden');
  document.getElementById('key-count').textContent = '1';

  gameState.currentTask = 2;
  updateTaskList();

  this.disabled = true;
  this.textContent = 'Submitted';
});

/* ============================================================
   DECORATIVE CHARTS
   Called once after the dashboard becomes visible.
   Guard prevents double-initialization.
============================================================ */
function initCharts() {
  if (initCharts._done) return;
  initCharts._done = true;

  // Doughnut — Q4 Productivity Breakdown
  new Chart(document.getElementById('chart-pie'), {
    type: 'doughnut',
    data: {
      labels: ['Meetings About Meetings', 'Waiting for Approval', 'Unclear Tasks', 'Actual Work'],
      datasets: [{
        data: [35, 25, 25, 15],
        backgroundColor: ['#c4b5fd', '#a5b4fc', '#93c5fd', '#d1d5db'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      },
      cutout: '58%',
    }
  });

  // Line — Employee Morale Q1–Q4 (trending down)
  new Chart(document.getElementById('chart-morale'), {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        data: [78, 61, 44, 27],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.07)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#6C63FF',
        pointRadius: 4,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 11, family: 'Inter, system-ui, sans-serif' } }
        },
        y: {
          grid: { color: '#f3f4f6' },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 11, family: 'Inter, system-ui, sans-serif' } },
          min: 0,
          max: 100,
        }
      }
    }
  });

  // Bar — Headcount by Department
  new Chart(document.getElementById('chart-headcount'), {
    type: 'bar',
    data: {
      labels: ['Eng', 'Sales', 'Mktg', 'Ops', 'Exec'],
      datasets: [{
        data: [34, 28, 18, 15, 7],
        backgroundColor: '#ede9ff',
        borderColor: '#6C63FF',
        borderWidth: 1.5,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 10, family: 'Inter, system-ui, sans-serif' } }
        },
        y: {
          grid: { color: '#f3f4f6' },
          border: { display: false },
          ticks: { color: '#6b7280', font: { size: 10, family: 'Inter, system-ui, sans-serif' } },
          beginAtZero: true,
        }
      }
    }
  });
}
