// ── THEME TOGGLE ────────────────────────────────────────────────────────────
(function () {
  const btn = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = html.getAttribute('data-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', theme);
  updateIcon();
  if (btn) btn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    updateIcon();
  });
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
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
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
  let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  function animateGlow() {
    glowX += (targetX - glowX) * 0.08;
    glowY += (targetY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ── PARTICLE CANVAS ──────────────────────────────────────────────────────────
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || window.innerWidth <= 768) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function getAccentColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? '96,165,250' : '37,99,235';
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.life = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${getAccentColor()},${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = 80;
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connections between nearby particles
  function drawConnections() {
    const col = getAccentColor();
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${col},${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounter(el, target, duration) {
  let startTime = null;
  function update(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
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
      animateCounter(entry.target, parseInt(entry.target.dataset.target), 1600);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
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
      { text: '▸ Midhun Krothapalli', cls: 'line-green' },
      { text: '▸ Senior Lab Informatics & LIS Lead', cls: 'line-blue' },
      { text: '▸ Gilead Sciences · Foster City, CA', cls: '' },
    ]
  },
  {
    cmd: 'skills --top-rated',
    output: [
      { text: '▸ LIS/LIMS     ████████████  Expert', cls: 'line-green' },
      { text: '▸ Veeva RIMS   ██████████░░  Advanced', cls: 'line-blue' },
      { text: '▸ GxP / CSV    ████████████  Expert', cls: 'line-orange' },
    ]
  },
  {
    cmd: 'impact --metrics',
    output: [
      { text: '▸ Manual effort    reduced  by 40%', cls: 'line-green' },
      { text: '▸ Data quality   improved  by 25%', cls: 'line-blue' },
      { text: '▸ Turnaround time  cut      by 20%', cls: 'line-orange' },
    ]
  },
  {
    cmd: 'status --availability',
    output: [
      { text: '▸ Status   : OPEN TO OPPORTUNITIES', cls: 'line-green' },
      { text: '▸ Focus    : Senior Leadership Roles', cls: 'line-blue' },
      { text: '▸ Location : Houston, TX (flexible)', cls: '' },
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
    setTimeout(typeCmd, 48 + Math.random() * 28);
  } else {
    if (cursorEl) cursorEl.style.display = 'none';
    setTimeout(showOutput, 320);
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
      div.style.cssText = 'opacity:0;transform:translateX(-10px);transition:opacity 0.28s ease,transform 0.28s ease;';
      outputEl.appendChild(div);
      requestAnimationFrame(() => { div.style.opacity = '1'; div.style.transform = 'translateX(0)'; });
    }, i * 240);
  });
  setTimeout(clearAndNext, commands[cmdIndex].output.length * 240 + 2400);
}

function clearAndNext() {
  if (!cmdEl || !outputEl || !cursorEl) return;
  outputEl.style.opacity = '0';
  outputEl.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    cmdEl.textContent = '';
    outputEl.innerHTML = '';
    outputEl.style.opacity = '1';
    charIndex = 0;
    cmdIndex = (cmdIndex + 1) % commands.length;
    cursorEl.style.display = 'inline';
    setTimeout(typeCmd, 500);
  }, 300);
}
setTimeout(typeCmd, 1200);

// ── SKILL TAG RIPPLE ─────────────────────────────────────────────────────────
document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:60px; height:60px;
      background: var(--color-primary);
      opacity:0.25;
      left:${e.clientX - rect.left - 30}px;
      top:${e.clientY - rect.top - 30}px;
      transform:scale(0);
      transition:transform 0.45s ease, opacity 0.45s ease;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    requestAnimationFrame(() => { ripple.style.transform = 'scale(3)'; ripple.style.opacity = '0'; });
    setTimeout(() => ripple.remove(), 450);
  });
});

// ── TILT EFFECT ON CARDS ─────────────────────────────────────────────────────
document.querySelectorAll('.achievement-card, .stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
    setTimeout(() => card.style.transition = '', 400);
  });
});

// ── HERO HEADING ENTRANCE ────────────────────────────────────────────────────
(function () {
  const heading = document.querySelector('.hero-heading');
  if (!heading) return;
  const spans = heading.querySelectorAll('span');
  spans.forEach((span, i) => {
    span.style.opacity = '0';
    span.style.transform = 'translateY(20px)';
    span.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.15}s`;
    setTimeout(() => { span.style.opacity = '1'; span.style.transform = 'translateY(0)'; }, 100);
  });

  const badge = document.querySelector('.hero-badge');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('.hero-cta-row');
  const tags = document.querySelector('.hero-floating-tags');
  [badge, sub, cta, tags].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.65s ease ${0.55 + i * 0.12}s, transform 0.65s ease ${0.55 + i * 0.12}s`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 80);
  });
})();
