/* ============================================================
   SCROLL CONTROL
   .main-content is the scroll container, not document.body.
   Task 3 unlock: document.querySelector('.main-content').style.overflowY = 'auto';
============================================================ */

/* ============================================================
   DECORATIVE CHARTS
   Initialized on page load. No interactivity.
============================================================ */

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
