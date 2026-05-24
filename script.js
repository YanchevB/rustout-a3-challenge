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
   SHARED UTILITIES
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

let toastActive = false;

function showToast(msg, duration, onDismiss) {
  toastActive = true;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const text = document.createElement('span');
  text.textContent = msg;

  const close = document.createElement('button');
  close.className = 'toast-close';
  close.setAttribute('aria-label', 'Dismiss');
  close.textContent = '✕';

  toast.appendChild(text);
  toast.appendChild(close);
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  function dismiss() {
    toastActive = false;
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', function () {
      toast.remove();
      if (onDismiss) onDismiss();
    }, { once: true });
  }

  close.addEventListener('click', dismiss);
  setTimeout(dismiss, duration || 3000);
}

/* ============================================================
   PUZZLE 1 — Q1 Report Submit
============================================================ */
document.getElementById('btn-submit-q1').addEventListener('click', function () {
  playChime();

  gameState.keysFound = 1;
  document.getElementById('key-counter').classList.remove('hidden');
  document.getElementById('key-count').textContent = '1';

  gameState.currentTask = 2;
  updateTaskList();
  document.getElementById('budget-total').classList.add('budget-active');

  this.disabled = true;
  this.textContent = 'Submitted';
});

/* ============================================================
   PUZZLE 2 — Budget Total Fix
============================================================ */
(function () {
  const totalCell = document.getElementById('budget-total');
  let editing = false;

  totalCell.addEventListener('click', function () {
    if (!totalCell.classList.contains('budget-active')) return;
    if (editing) return;
    editing = true;

    const wrapper = document.createElement('div');
    wrapper.className = 'budget-edit-wrapper';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'budget-input';
    input.value = '€13,000';
    input.setAttribute('aria-label', 'Correct Q1 total');

    const confirm = document.createElement('button');
    confirm.className = 'budget-confirm';
    confirm.textContent = '✓';

    const error = document.createElement('div');
    error.className = 'budget-error hidden';
    error.textContent = 'Incorrect. Try again.';

    wrapper.appendChild(input);
    wrapper.appendChild(confirm);

    totalCell.textContent = '';
    totalCell.appendChild(wrapper);

    const tfoot = totalCell.closest('tfoot');
    tfoot.insertAdjacentElement('afterend', (() => {
      const row = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 2;
      td.appendChild(error);
      row.appendChild(td);
      return row;
    })());

    input.focus();
    input.select();

    function validate() {
      const raw = input.value.replace(/[€,\s]/g, '');
      if (raw === '13100') {
        playChime();

        gameState.keysFound = 2;
        document.getElementById('key-count').textContent = '2';

        gameState.currentTask = 3;
        updateTaskList();

        document.getElementById('panel-expenses').classList.remove('panel-blurred');

        totalCell.classList.remove('budget-active');
        totalCell.classList.add('budget-solved');
        totalCell.textContent = '€13,100';

        tfoot.nextElementSibling.remove();

        const msg = document.createElement('p');
        msg.className = 'budget-message';
        msg.textContent = 'Budget corrected. Something else just became visible.';
        tfoot.insertAdjacentElement('afterend', (() => {
          const row = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = 2;
          td.appendChild(msg);
          row.appendChild(td);
          return row;
        })());
        requestAnimationFrame(() => { msg.style.opacity = '1'; });
      } else {
        error.classList.remove('hidden');
      }
    }

    confirm.addEventListener('click', validate);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') validate();
    });
  });
}());

/* ============================================================
   PUZZLE 3 — Expense Click
============================================================ */
(function () {
  let done = false;

  document.querySelectorAll('.expense-item:not(#expense-top)').forEach(function (item) {
    item.addEventListener('click', function () {
      if (done || toastActive) return;
      showToast("No, that doesn't seem to be it.");
    });
  });

  document.getElementById('expense-top').addEventListener('click', function () {
    if (done) return;
    done = true;

    playChime();

    gameState.keysFound = 3;
    document.getElementById('key-count').textContent = '3';

    gameState.scrollUnlocked = true;
    document.querySelector('.main-content').style.overflowY = 'auto';

    showToast("You found something you weren't supposed to see. The way down is open now.", 6000);

    gameState.currentTask = 4;
    updateTaskList();
  });
}());

/* ============================================================
   PUZZLE 4 — Decoy Close + Asset Password
============================================================ */
(function () {
  // Step 1: reveal X button once task 4 is reached.
  // We watch for updateTaskList calls by wrapping it.
  const _origUpdate = updateTaskList;
  updateTaskList = function () {
    _origUpdate();
    if (gameState.currentTask === 4) {
      document.getElementById('btn-close-cover').classList.remove('hidden');
    }
  };

  // Step 2: X closes decoy, reveals asset panel.
  document.getElementById('btn-close-cover').addEventListener('click', function () {
    document.getElementById('panel-cover').classList.add('hidden');
    document.getElementById('panel-assets').classList.remove('hidden');
  });

  // Step 3: password form.
  const passwordInput = document.getElementById('asset-password');
  const submitBtn = document.getElementById('btn-asset-submit');
  const assetLock = document.getElementById('asset-lock');

  const errorEl = document.createElement('p');
  errorEl.className = 'asset-error hidden';
  errorEl.textContent = 'Access denied.';
  assetLock.appendChild(errorEl);

  function tryPassword() {
    if (passwordInput.value.trim().toLowerCase() !== 'greed') {
      errorEl.classList.remove('hidden');
      return;
    }

    // Correct — remove overlay.
    assetLock.classList.add('hidden');
    errorEl.classList.add('hidden');

    gameState.keysFound = 4;
    document.getElementById('key-count').textContent = '4';

    gameState.currentTask = 5;
    updateTaskList();

    playChime();

    const msg = document.createElement('p');
    msg.className = 'asset-success';
    msg.textContent = 'Full access granted.';
    document.getElementById('panel-assets').appendChild(msg);
    requestAnimationFrame(() => { msg.style.opacity = '1'; });

    document.getElementById('btn-withdraw-wrapper').classList.remove('hidden');
  }

  submitBtn.addEventListener('click', tryPassword);
  passwordInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') tryPassword();
  });
}());

/* ============================================================
   PUZZLE 5 — Withdraw All Assets
============================================================ */
(function () {
  document.getElementById('btn-withdraw').addEventListener('click', function () {
    this.disabled = true;
    this.textContent = 'Withdrawing…';

    const cells = Array.from(
      document.querySelectorAll('#panel-assets .asset-table td.text-right')
    );
    const startValues = cells.map(function (cell) {
      return parseInt(cell.textContent.replace(/[€,]/g, ''), 10);
    });

    const duration = 1500;
    const startTime = performance.now();

    function format(n) {
      return '€' + Math.round(n).toLocaleString('en-GB');
    }

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);

      cells.forEach(function (cell, i) {
        cell.textContent = format(startValues[i] * (1 - progress));
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        cells.forEach(function (cell) { cell.textContent = '€0'; });

        document.getElementById('btn-withdraw').textContent = 'Action done';

        gameState.currentTask = 6;
        updateTaskList();

        setTimeout(function () {
          showToast("This feels suffocating, now's the time to escape!", 6000, initEscapeSequence);
        }, 500);
      }
    }

    requestAnimationFrame(tick);
  });
}());

/* ============================================================
   PUZZLE 6 — Escape Sequence + Exit
============================================================ */
function endGame() {
  document.body.style.overflow = '';
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('end-screen').classList.remove('hidden');
}

function initEscapeSequence() {
  const sequence = ['E', 'S', 'C', 'A', 'P', 'E'];
  let position = 0;

  const slotsWrapper = document.createElement('div');
  slotsWrapper.className = 'escape-slots';

  const slots = sequence.map(function (letter) {
    const slot = document.createElement('span');
    slot.className = 'escape-slot';
    slot.textContent = '';
    slotsWrapper.appendChild(slot);
    return slot;
  });

  const keyCounter = document.getElementById('key-counter');
  keyCounter.parentNode.insertBefore(slotsWrapper, keyCounter);

  function handleKey(e) {
    if (!/^[a-zA-Z]$/.test(e.key)) return;

    const key = e.key.toUpperCase();

    if (key !== sequence[position]) {
      slots.forEach(function (s) {
        s.classList.remove('escape-slot-active');
        s.textContent = '';
      });
      position = 0;
    }

    if (key === sequence[position]) {
      slots[position].textContent = sequence[position];
      slots[position].classList.add('escape-slot-active');
      position++;

      if (position === sequence.length) {
        document.removeEventListener('keydown', handleKey);
        setTimeout(function () {
          slotsWrapper.remove();
          showExitButton();
        }, 600);
      }
    }
  }

  document.addEventListener('keydown', handleKey);

  function showExitButton() {
    gameState.exitClicksRemaining = gameState.keysFound;

    const exitWrapper = document.createElement('div');
    exitWrapper.className = 'exit-wrapper';

    const exitBtn = document.createElement('button');
    exitBtn.className = 'btn-exit';
    exitBtn.textContent = 'EXIT';

    const exitHint = document.createElement('span');
    exitHint.className = 'exit-hint';
    exitHint.textContent = 'Keys collected: ' + gameState.keysFound + '. Each one buys you one click of freedom.';

    exitWrapper.appendChild(exitBtn);
    exitWrapper.appendChild(exitHint);

    const kc = document.getElementById('key-counter');
    kc.parentNode.insertBefore(exitWrapper, kc);

    exitBtn.addEventListener('click', function () {
      gameState.exitClicksRemaining--;
      if (gameState.exitClicksRemaining <= 0) {
        endGame();
      } else {
        exitHint.textContent = gameState.exitClicksRemaining +
          (gameState.exitClicksRemaining === 1 ? ' click' : ' clicks') + ' remaining.';
      }
    });
  }
}

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
