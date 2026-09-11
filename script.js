(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('progressBar');
  const spotlight = document.getElementById('spotlight');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const timeline = document.getElementById('timeline');
  const timelineFill = document.getElementById('timelineFill');

  document.getElementById('year').textContent = new Date().getFullYear();

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;

    if (timeline && timelineFill) {
      const r = timeline.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.62;
      const travelled = viewportAnchor - r.top;
      const amount = Math.max(0, Math.min(r.height, travelled));
      timelineFill.style.height = `${amount}px`;
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    })
  );

  const revealEls = [...document.querySelectorAll('[data-reveal]')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.13,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    revealEls.forEach(el => io.observe(el));
  }

  const counters = [...document.querySelectorAll('[data-count]')];

  const runCounter = el => {
    const target = Number(el.dataset.count || 0);

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    const duration = 1100;
    const start = performance.now();

    const tick = now => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);

      el.textContent = String(Math.round(target * eased));

      if (t < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const countIO = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );

    counters.forEach(el => countIO.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  if (
    !reduceMotion &&
    window.matchMedia('(pointer:fine)').matches &&
    spotlight
  ) {
    let tx = innerWidth / 2;
    let ty = innerHeight / 2;
    let x = tx;
    let y = ty;

    window.addEventListener(
      'pointermove',
      e => {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );

    const animateSpot = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;

      spotlight.style.transform =
        `translate(${x - 325}px, ${y - 325}px)`;

      requestAnimationFrame(animateSpot);
    };

    animateSpot();
  }

  if (
    !reduceMotion &&
    window.matchMedia('(pointer:fine)').matches
  ) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();

        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;

        const rx = py * -5;
        const ry = px * 6;

        card.style.transform =
          `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transition =
          'transform 450ms cubic-bezier(.2,.8,.2,1)';

        card.style.transform = '';

        setTimeout(() => {
          card.style.transition = '';
        }, 460);
      });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();

        const x =
          (e.clientX - r.left - r.width / 2) * 0.08;

        const y =
          (e.clientY - r.top - r.height / 2) * 0.11;

        el.style.transform = `translate(${x}px, ${y}px)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });
  }
})();

// CHAKRA featured engineering project.
(() => {
  if (document.getElementById('chakra')) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'chakra.css';
  document.head.appendChild(css);

  const desktopNav = document.querySelector('.nav-links');
  const mobileNav = document.getElementById('mobileMenu');
  const projectLink = '<a href="#chakra">Projects</a>';

  if (desktopNav && !desktopNav.querySelector('a[href="#chakra"]')) {
    desktopNav.insertAdjacentHTML('beforeend', projectLink);
  }
  if (mobileNav && !mobileNav.querySelector('a[href="#chakra"]')) {
    mobileNav.querySelector('a[href="#knowledge"]')?.insertAdjacentHTML('beforebegin', projectLink);
  }

  const knowledge = document.getElementById('knowledge');
  if (!knowledge) return;

  const section = document.createElement('section');
  section.className = 'chakra-section';
  section.id = 'chakra';
  section.innerHTML = `
    <div class="container chakra-wrap">
      <div class="chakra-kicker reveal in-view" data-reveal>
        <span>05</span>
        <span>FEATURED ENGINEERING PROJECT</span>
        <span class="chakra-status">ACTIVE RESEARCH</span>
      </div>

      <div class="chakra-head">
        <h2 class="chakra-title reveal in-view" data-reveal>CHAKRA <em>Market Intelligence</em></h2>
        <p class="chakra-intro reveal in-view" data-reveal>
          A research-driven platform for SPX/SPY and index-options market intelligence—built to turn raw market data into structured, quality-gated setups before any execution layer is allowed to exist.
        </p>
      </div>

      <div class="chakra-panel reveal in-view" data-reveal>
        <div class="chakra-console">
          <div class="chakra-visual">
            <div class="chakra-topline">
              <span class="chakra-label">SIGNAL PIPELINE / OBSERVATION MODE</span>
              <span class="chakra-live">● ARCHITECTURE IN VALIDATION</span>
            </div>
            <div class="chakra-flow" aria-label="CHAKRA system flow">
              <div class="chakra-node">Market<br>Data</div>
              <div class="chakra-node">Domain<br>Model</div>
              <div class="chakra-node">Shared<br>State</div>
              <div class="chakra-node">Scoring<br>Engine</div>
              <div class="chakra-node">Discord<br>Alerts</div>
            </div>
            <div class="chakra-wave" aria-hidden="true">
              <svg viewBox="0 0 700 100" preserveAspectRatio="none">
                <defs><linearGradient id="cw" x1="0" x2="1"><stop offset="0" stop-color="#62e6d1"/><stop offset=".5" stop-color="#6ea8ff"/><stop offset="1" stop-color="#9b8cff"/></linearGradient></defs>
                <path d="M0 62 C55 68 72 32 124 42 S203 78 251 54 S335 22 380 47 S463 82 511 53 S595 34 700 45" fill="none" stroke="url(#cw)" stroke-width="2" opacity=".95"/>
                <path d="M0 72 C55 78 72 42 124 52 S203 88 251 64 S335 32 380 57 S463 92 511 63 S595 44 700 55" fill="none" stroke="url(#cw)" stroke-width="1" opacity=".22"/>
              </svg>
            </div>
          </div>

          <div class="chakra-details">
            <span class="chakra-label">QUANTITATIVE RESEARCH · PERSONAL PROJECT</span>
            <h3>Engineered for confidence before live operation.</h3>
            <p>
              CHAKRA is being developed through staged architecture, data-quality, state-management, recovery, and acceptance-validation phases. The current objective is high-quality market setup intelligence and Discord notifications—not autonomous trading.
            </p>
            <div class="chakra-tags">
              <span>SPX / SPY</span><span>0–5 DTE</span><span>Python</span><span>Options Data</span><span>Data Quality</span><span>Observability</span><span>Risk Gates</span>
            </div>
            <div class="chakra-metrics">
              <div class="chakra-metric"><strong>0–5</strong><small>DTE research universe</small></div>
              <div class="chakra-metric"><strong>Offline</strong><small>validation-first design</small></div>
              <div class="chakra-metric"><strong>Discord</strong><small>setup-notification target</small></div>
            </div>
            <div class="chakra-note">Research/engineering project only. No performance claims and no financial advice.</div>
          </div>
        </div>
      </div>

      <div class="chakra-principles">
        <article class="chakra-principle reveal in-view" data-reveal><span>01</span><strong>Canonical data</strong><p>Normalize instruments, contracts, calendars, and market observations before strategy logic.</p></article>
        <article class="chakra-principle reveal in-view" data-reveal><span>02</span><strong>Quality gates</strong><p>Stale, conflicting, incomplete, or structurally invalid data should never silently become a setup.</p></article>
        <article class="chakra-principle reveal in-view" data-reveal><span>03</span><strong>Shared state</strong><p>Typed ownership, freshness, revisions, and publication boundaries make downstream reasoning inspectable.</p></article>
        <article class="chakra-principle reveal in-view" data-reveal><span>04</span><strong>Controlled rollout</strong><p>Observation and alerting come before paper execution; live execution comes only after acceptance confidence.</p></article>
      </div>
    </div>`;

  knowledge.parentNode.insertBefore(section, knowledge);
})();
