// ── THEME TOGGLE ────────────────────────────────────────────────────────────
(function () {
  const btn = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = html.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
  updateIcon();
  if (btn) btn.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; html.setAttribute('data-theme', theme); updateIcon(); });
  function updateIcon() {
    if (!btn) return;
    btn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// ── HAMBURGER ────────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    mobileNav.classList.remove('open'); hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', false);
  }));
}

// ── SCROLL PROGRESS BAR ──────────────────────────────────────────────────────
const progressBar = document.getElementById('progressBar');
const siteHeader = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
  if (siteHeader) siteHeader.classList.toggle('scrolled', scrollTop > 20);
}, { passive: true });

// ── CURSOR GLOW ──────────────────────────────────────────────────────────────
const glow = document.getElementById('cursorGlow');
if (glow && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounter(el, target, duration) {
  let start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = 'true';
      animateCounter(entry.target, parseInt(entry.target.dataset.target), 1400);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => revealObserver.observe(el));

// ── ACTIVE NAV ───────────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObserver.observe(s));

// ── TERMINAL TYPEWRITER ──────────────────────────────────────────────────────
const commands = [
  {
    cmd: 'whoami --verbose',
    output: [
      { text: '> Midhun Krothapalli', cls: 'line-green' },
      { text: '> Role: Senior Lab Informatics & LIS Lead', cls: 'line-blue' },
      { text: '> Company: Gilead Sciences · Foster City, CA', cls: '' },
    ]
  },
  {
    cmd: 'skills --top-rated',
    output: [
      { text: '> LIS/LIMS     ████████████  Expert', cls: 'line-green' },
      { text: '> Veeva RIMS   ██████████░░  Advanced', cls: 'line-blue' },
      { text: '> GxP/CSV/CSA  ████████████  Expert', cls: 'line-orange' },
    ]
  },
  {
    cmd: 'achievements --highlight',
    output: [
      { text: '> -40% manual data handling', cls: 'line-green' },
      { text: '> +25% laboratory data quality', cls: 'line-blue' },
      { text: '> Global site standardization ✓', cls: 'line-orange' },
    ]
  },
  {
    cmd: 'status --availability',
    output: [
      { text: '> Status: OPEN TO OPPORTUNITIES', cls: 'line-green' },
      { text: '> Focus: Senior Leadership Roles', cls: 'line-blue' },
      { text: '> Location: Houston, TX (flexible)', cls: '' },
    ]
  }
];

let cmdIndex = 0, charIndex = 0;
const cmdEl = document.getElementById('typedCmd');
const outputEl = document.getElementById('terminalOutput');
const cursorEl = document.getElementById('cursor');

function typeCmd() {
  const current = commands[cmdIndex];
  if (charIndex < current.cmd.length) {
    cmdEl.textContent += current.cmd[charIndex++];
    setTimeout(typeCmd, 55 + Math.random() * 30);
  } else {
    if (cursorEl) cursorEl.style.display = 'none';
    setTimeout(showOutput, 350);
  }
}
function showOutput() {
  if (!outputEl) return;
  outputEl.innerHTML = '';
  commands[cmdIndex].output.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.textContent = line.text;
      if (line.cls) div.classList.add(line.cls);
      div.style.opacity = '0';
      div.style.transform = 'translateX(-8px)';
      div.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      outputEl.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = '1'; div.style.transform = 'translateX(0)'; });
    }, i * 250);
  });
  setTimeout(clearAndNext, commands[cmdIndex].output.length * 250 + 2200);
}
function clearAndNext() {
  if (!cmdEl || !outputEl || !cursorEl) return;
  outputEl.style.opacity = '0';
  setTimeout(() => {
    cmdEl.textContent = ''; outputEl.innerHTML = ''; outputEl.style.opacity = '1';
    charIndex = 0; cmdIndex = (cmdIndex + 1) % commands.length;
    cursorEl.style.display = 'inline';
    setTimeout(typeCmd, 400);
  }, 300);
}
setTimeout(typeCmd, 1000);

// ── SKILL TAG RIPPLE ─────────────────────────────────────────────────────────
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:60px; height:60px;
      background: var(--color-primary);
      opacity: 0.3;
      left:${e.clientX - rect.left - 30}px;
      top:${e.clientY - rect.top - 30}px;
      transform: scale(0);
      transition: transform 0.4s ease, opacity 0.4s ease;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    requestAnimationFrame(() => { ripple.style.transform = 'scale(3)'; ripple.style.opacity = '0'; });
    setTimeout(() => ripple.remove(), 400);
  });
});
