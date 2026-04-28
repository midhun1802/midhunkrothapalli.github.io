// ─── THEME TOGGLE ───────────────────────────────────────────────────────────
(function () {
  const btn = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = html.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
  updateIcon();

  if (btn) {
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      updateIcon();
    });
  }

  function updateIcon() {
    if (!btn) return;
    btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// ─── HAMBURGER MENU ─────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  mobileNav.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── COUNTER ANIMATION ──────────────────────────────────────────────────────
function animateCounter(el, target, duration) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = start;
    }
  }, 16);
}

// ─── TERMINAL TYPEWRITER ────────────────────────────────────────────────────
const commands = [
  {
    cmd: 'describe --role',
    output: [
      { text: '> Senior Lab Informatics & LIS Lead', cls: 'line-green' },
      { text: '> Digital Product Owner @ Gilead Sciences', cls: 'line-blue' },
      { text: '> GxP Compliance | Veeva RIMS | LIS/LIMS', cls: '' },
    ]
  },
  {
    cmd: 'skills --top',
    output: [
      { text: '> LIS / LIMS  ████████████  Expert', cls: 'line-green' },
      { text: '> Veeva RIMS  ██████████    Advanced', cls: 'line-blue' },
      { text: '> GxP/CSV/CSA ████████████  Expert', cls: '' },
    ]
  },
  {
    cmd: 'achievements --highlight',
    output: [
      { text: '> -40% manual data handling', cls: 'line-green' },
      { text: '> +25% data quality improvement', cls: 'line-blue' },
      { text: '> global site standardization', cls: '' },
    ]
  }
];

let cmdIndex = 0;
let charIndex = 0;
let typing = true;
let outputShown = false;
let pauseTimer = null;

const cmdEl = document.getElementById('typedCmd');
const outputEl = document.getElementById('terminalOutput');
const cursorEl = document.getElementById('cursor');

function typeCmd() {
  const current = commands[cmdIndex];
  if (charIndex < current.cmd.length) {
    cmdEl.textContent += current.cmd[charIndex];
    charIndex++;
    setTimeout(typeCmd, 65);
  } else {
    cursorEl.style.display = 'none';
    setTimeout(showOutput, 300);
  }
}

function showOutput() {
  const current = commands[cmdIndex];
  outputEl.innerHTML = '';
  current.output.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.textContent = line.text;
      if (line.cls) div.classList.add(line.cls);
      outputEl.appendChild(div);
    }, i * 200);
  });
  setTimeout(clearAndNext, current.output.length * 200 + 2000);
}

function clearAndNext() {
  cmdEl.textContent = '';
  outputEl.innerHTML = '';
  charIndex = 0;
  cmdIndex = (cmdIndex + 1) % commands.length;
  cursorEl.style.display = 'inline';
  setTimeout(typeCmd, 500);
}

setTimeout(typeCmd, 800);

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
let countersTriggered = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Counter observer — triggers when hero stats visible
const statsEls = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target, 1000);
      entry.target.dataset.done = 'true';
    }
  });
}, { threshold: 0.5 });

statsEls.forEach(el => counterObserver.observe(el));

// ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--color-primary)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));
