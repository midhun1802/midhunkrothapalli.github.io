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

  // Header + page progress + scroll-linked timeline.
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

  // Mobile nav.
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

  // Reveal choreography.
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

  // Number counters trigger once when visible.
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

  // Cursor spotlight on fine pointers only.
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

  // Premium, restrained 3D tilt for cards.
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

    // Magnetic CTA movement.
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
