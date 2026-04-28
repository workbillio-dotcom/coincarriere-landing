/* ═══════════════════════════════════════════════════
   CoinCarrière BTP — script.js
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   BLUEPRINT CANVAS — Ambient Living Surface
   Slow wave-breathing grid · Cursor proximity reveal
   Passive, engineered, below perceptual dominance
───────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('blueprint-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let W = 0, H = 0;
  let mx = -9999, my = -9999;   // raw — off-screen default
  let sx = -9999, sy = -9999;   // smoothed
  let t = 0;

  function init() {
    const parent = canvas.parentElement;
    W = canvas.width  = Math.floor(parent.offsetWidth);
    H = canvas.height = Math.floor(parent.offsetHeight || window.innerHeight);
  }
  window.addEventListener('resize', init);
  init();

  const hero = canvas.parentElement;
  hero.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => {
    mx = -9999; my = -9999;
  });

  /* — Constants ———————————————————————————————— */
  const CELL      = 48;    // grid spacing
  const WAVE_AMP  = 1.3;   // max px displacement per line
  const CURSOR_R  = 210;   // cursor influence radius
  const BASE_A    = 0.024; // base grid opacity
  const PEAK_A    = 0.13;  // cursor-centre opacity

  /* — Smoothstep ——————————————————————————————— */
  function ss(a, b, x) {
    const v = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return v * v * (3 - 2 * v);
  }

  /* ── DRAW ────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const cols = Math.ceil(W / CELL) + 2;
    const rows = Math.ceil(H / CELL) + 2;

    // Global breath: very slow sine oscillating ±8% of BASE_A
    const breath = 1 - 0.08 + 0.08 * Math.sin(t * 0.005);

    const cursorOn = sx > -200 && sx < W + 200 && sy > -200 && sy < H + 200;

    // Vertical lines
    for (let i = 0; i < cols; i++) {
      // Each column has its own slow wave phase
      const wave = Math.sin(i * 0.44 + t * 0.019) * WAVE_AMP;
      const x = i * CELL + wave;

      let alpha = BASE_A * breath;
      if (cursorOn) {
        const d = Math.abs(x - sx);
        if (d < CURSOR_R) alpha = Math.max(alpha, BASE_A + ss(CURSOR_R, 0, d) * (PEAK_A - BASE_A));
      }

      ctx.strokeStyle = `rgba(0,115,180,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Horizontal lines
    for (let i = 0; i < rows; i++) {
      const wave = Math.sin(i * 0.39 + t * 0.016) * WAVE_AMP;
      const y = i * CELL + wave;

      let alpha = BASE_A * breath;
      if (cursorOn) {
        const d = Math.abs(y - sy);
        if (d < CURSOR_R) alpha = Math.max(alpha, BASE_A + ss(CURSOR_R, 0, d) * (PEAK_A - BASE_A));
      }

      ctx.strokeStyle = `rgba(0,115,180,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
  }

  /* ── ANIMATION LOOP ──────────────────────────── */
  function frame() {
    sx += (mx - sx) * 0.028;   // slow, fluid cursor tracking
    sy += (my - sy) * 0.028;
    t++;

    draw();
    requestAnimationFrame(frame);
  }

  frame();
}());

// ─── Scroll fade-up ───────────────────────────────
const fadeUpEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
fadeUpEls.forEach(el => fadeObserver.observe(el));

// ─── Hero immediate reveal ────────────────────────
setTimeout(() => {
  document.querySelectorAll('.hero-fade').forEach(el => el.classList.add('visible'));
}, 80);

// ─── Count-up animation ───────────────────────────
function animateCount(el, target, prefix, suffix, duration) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = prefix + current.toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target.toLocaleString('fr-FR') + suffix;
  };
  requestAnimationFrame(step);
}

[...document.querySelectorAll('.count-up'),
 ...document.querySelectorAll('.count-up-blue')].forEach(el => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(
          el,
          parseInt(el.dataset.target, 10),
          el.dataset.prefix || '',
          el.dataset.suffix || '',
          1400
        );
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  obs.observe(el);
});

// ─── Ambient CTA — 5-state context-aware engine ──
(function () {
  const cta    = document.getElementById('smart-cta');
  const fill   = document.getElementById('scta-rail-fill');
  const tick   = document.getElementById('scta-rail-tick');
  const node   = document.getElementById('scta-node');
  const action = document.getElementById('scta-action');
  if (!cta) return;

  const STATES = [
    'scta-dormant',
    'scta-trace',
    'scta-seed',
    'scta-brief',
    'scta-full',
    'scta-intent',
  ];

  let current    = 'scta-dormant';
  let elapsed    = 0;        // seconds since page load
  let lastTs     = 0;
  let lastScroll = 0;        // elapsed-time of last scroll event
  let nearEdge   = false;    // cursor within 110px of right edge

  function scrollRatio() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, window.scrollY / max) : 0;
  }

  function scrollIdle() {
    return elapsed - lastScroll;
  }

  function resolveState(r, t) {
    if (t < 1.8 || r < 0.08)  return 'scta-dormant';
    if (r < 0.22)              return 'scta-trace';
    if (r < 0.40)              return 'scta-seed';
    if (r < 0.58)              return 'scta-brief';
    // Full → Intent based on additional signals
    const isIntent = nearEdge || scrollIdle() > 5 || r > 0.82;
    return isIntent ? 'scta-intent' : 'scta-full';
  }

  function set(next) {
    if (next === current) return;
    STATES.forEach(s => cta.classList.remove(s));
    cta.classList.add(next);
    current = next;
  }

  // Update rail tick position to match scroll progress
  function updateTick(r) {
    if (!tick) return;
    const vh = window.innerHeight;
    // Tick travels between 10% and 90% of viewport height
    const pct = 10 + r * 80;
    tick.style.top = pct + '%';
  }

  // Cursor proximity to right edge
  window.addEventListener('mousemove', e => {
    nearEdge = window.innerWidth - e.clientX < 110;
  }, { passive: true });

  // Track last scroll time for idle detection
  window.addEventListener('scroll', () => {
    lastScroll = elapsed;
  }, { passive: true });

  // Keyboard: Enter/Space on node triggers the action link
  node && node.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action && action.click();
    }
  });

  function frame(ts) {
    if (lastTs) elapsed += Math.min(ts - lastTs, 250) / 1000;
    lastTs = ts;

    const r = scrollRatio();
    if (fill) fill.style.height = (r * 100).toFixed(1) + '%';
    updateTick(r);
    set(resolveState(r, elapsed));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}());

// ─── Carousel Engine v2 — smooth auto-scroll · spring focus ──
(function () {
  if (!window.matchMedia('(max-width: 767px)').matches) return;

  /* ── Tuning ────────────────────────────────────────────────── */
  const SPEED_MAX    = 0.65;  // px/frame at full speed (~39 px/s @ 60fps)
  const EASE_ZONE    = 160;   // px near endpoint where deceleration begins
  const HOLD_MS      = 820;   // ms to pause at each endpoint before reversing
  const IDLE_MS      = 2200;  // ms idle after touch before auto-scroll resumes
  const START_DELAY  = 1200;  // ms before first movement on page load

  /* cosine ease-in-out: 0 at boundary, 1 far from boundary */
  function easeNear(dist) {
    const t = Math.max(0, Math.min(1, dist / EASE_ZONE));
    return 0.12 + 0.88 * (1 - Math.cos(t * Math.PI)) * 0.5;
  }

  /* ── Single carousel ───────────────────────────────────────── */
  function initCarousel(track, dotsEl) {
    if (!track) return;
    const items = Array.from(track.children);
    if (items.length < 2) return;

    track.classList.add('carousel-js-active');

    let dir          = 1;      // 1 forward, -1 backward
    let paused       = true;
    let holding      = false;  // true during endpoint pause
    let userTouching = false;
    let idleTimer    = null;
    let holdTimer    = null;
    let lastFocus    = -1;
    let pos          = track.scrollLeft;

    /* ── Focus state ─────────────────────────────────────────── */
    function applyFocus(idx) {
      if (idx === lastFocus) return;
      lastFocus = idx;
      items.forEach((item, i) => {
        item.classList.toggle('cc-active',   i === idx);
        item.classList.toggle('cc-inactive', i !== idx);
      });
      if (dotsEl) {
        dotsEl.querySelectorAll('.process-dot')
          .forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    }

    /* ── Centre detection ────────────────────────────────────── */
    function detectFocus() {
      const r  = track.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      let best = 0, bestD = Infinity;
      items.forEach((item, i) => {
        const ir = item.getBoundingClientRect();
        const d  = Math.abs(ir.left + ir.width / 2 - cx);
        if (d < bestD) { bestD = d; best = i; }
      });
      applyFocus(best);
    }

    /* ── Pause / resume ──────────────────────────────────────── */
    function pause() { paused = true; clearTimeout(idleTimer); }
    function scheduleResume() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { paused = false; }, IDLE_MS);
    }

    /* ── Touch interaction ───────────────────────────────────── */
    track.addEventListener('touchstart', () => {
      userTouching = true;
      holding = false;
      clearTimeout(holdTimer);
      pause();
    }, { passive: true });

    track.addEventListener('touchend', () => {
      userTouching = false;
      pos = track.scrollLeft; // sync position after manual swipe
      detectFocus();
      scheduleResume();
    }, { passive: true });

    track.addEventListener('touchcancel', () => {
      userTouching = false;
      pos = track.scrollLeft;
      scheduleResume();
    }, { passive: true });

    // Manual scroll → sync pos + update focus (don't interrupt auto-scroll)
    track.addEventListener('scroll', () => {
      if (userTouching) {
        pos = track.scrollLeft;
        detectFocus();
      }
    }, { passive: true });

    /* ── rAF loop ────────────────────────────────────────────── */
    function tick() {
      if (!paused && !userTouching && !holding) {
        const max = track.scrollWidth - track.clientWidth;
        if (max > 0) {
          const distToEnd = dir === 1 ? max - pos : pos;

          if (distToEnd <= 0.5) {
            // Hit endpoint — hold then reverse
            holding = true;
            dir = -dir;
            holdTimer = setTimeout(() => { holding = false; }, HOLD_MS);
          } else {
            // Cosine deceleration near endpoints
            const speed = SPEED_MAX * easeNear(distToEnd);
            pos = Math.max(0, Math.min(max, pos + speed * dir));
            track.scrollLeft = pos;
            detectFocus();
          }
        }
      }
      requestAnimationFrame(tick);
    }

    detectFocus();
    idleTimer = setTimeout(() => { paused = false; }, START_DELAY);
    requestAnimationFrame(tick);
  }

  /* ── Wire up ───────────────────────────────────────────────── */
  initCarousel(document.querySelector('.trust-stats-grid'),  null);
  initCarousel(document.getElementById('process-track'),     document.getElementById('process-dots'));
  initCarousel(document.querySelector('.feat-small-cards'),  null);
  initCarousel(document.querySelector('.stats-bar-grid'),    null);
}());

// ─── Video Player — §06 — click-to-play state machine ───
(function () {
  const wrap     = document.getElementById('section-video-wrap');
  const video    = document.getElementById('section-video');
  const btn      = document.getElementById('vp-btn');
  const progFill = document.getElementById('vp-progress-fill');
  if (!wrap || !video || !btn) return;

  const STATES = ['vp-playing', 'vp-paused', 'vp-ended'];
  const LABELS = {
    'vp-playing': 'Mettre en pause',
    'vp-paused':  'Reprendre la lecture',
    'vp-ended':   'Revoir la démo',
  };

  function setState(next) {
    STATES.forEach(s => wrap.classList.remove(s));
    if (next) wrap.classList.add(next);
    btn.setAttribute('aria-label', LABELS[next] || 'Lancer la démo');
  }

  // Click: toggle play / pause, or replay on ended
  btn.addEventListener('click', () => {
    if (wrap.classList.contains('vp-ended')) {
      video.currentTime = 0;
      video.muted = false;
      video.play().catch(() => {});
    } else if (wrap.classList.contains('vp-playing')) {
      video.pause();
    } else {
      video.muted = false;
      video.play().catch(() => {});
    }
  });

  // Sync state classes from native video events
  video.addEventListener('play',  () => setState('vp-playing'));
  video.addEventListener('pause', () => {
    if (!wrap.classList.contains('vp-ended')) setState('vp-paused');
  });
  video.addEventListener('ended', () => setState('vp-ended'));

  // Progress bar — updates on timeupdate
  video.addEventListener('timeupdate', () => {
    if (!progFill || !video.duration) return;
    progFill.style.width = ((video.currentTime / video.duration) * 100).toFixed(1) + '%';
  });

  // Show real duration once metadata loads
  video.addEventListener('loadedmetadata', () => {
    const el = wrap.querySelector('.vp-duration');
    if (!el || !video.duration) return;
    const m = Math.floor(video.duration / 60);
    const s = String(Math.floor(video.duration % 60)).padStart(2, '0');
    el.textContent = m + ':' + s;
  });

  // Pause automatically when scrolled out of view
  new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting && wrap.classList.contains('vp-playing')) {
      video.pause();
    }
  }, { threshold: 0.15 }).observe(wrap);
}());

// ─── Mobile bottom CTA — 3-state engine ──────────────
(function () {
  if (!window.matchMedia('(max-width: 767px)').matches) return;

  const cta        = document.getElementById('mobile-cta');
  if (!cta) return;
  const threadFill = document.getElementById('mcta-thread-fill');

  const STATES = ['mcta-hidden', 'mcta-peek', 'mcta-full', 'mcta-intent'];
  let current    = 'mcta-hidden';
  let elapsed    = 0;
  let lastTs     = 0;
  let lastScroll = 0;

  function scrollRatio() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, window.scrollY / max) : 0;
  }

  function scrollIdle() { return elapsed - lastScroll; }

  function resolveState(r, t) {
    if (t < 3.2 || r < 0.12) return 'mcta-hidden';
    if (r < 0.42) return 'mcta-peek';
    if (r > 0.76 || scrollIdle() > 7) return 'mcta-intent';
    return 'mcta-full';
  }

  function setState(next) {
    if (next === current) return;
    STATES.forEach(s => cta.classList.remove(s));
    cta.classList.add(next);
    current = next;
  }

  window.addEventListener('scroll', () => {
    lastScroll = elapsed;
  }, { passive: true });

  // Hide when the page's own final CTA enters view
  const finalCta = document.getElementById('final-cta');
  if (finalCta) {
    new IntersectionObserver((entries) => {
      cta.classList.toggle('mcta-exit', entries[0].isIntersecting);
    }, { threshold: 0.10 }).observe(finalCta);
  }

  function frame(ts) {
    if (lastTs) elapsed += Math.min(ts - lastTs, 250) / 1000;
    lastTs = ts;
    const r = scrollRatio();
    if (threadFill) threadFill.style.width = (r * 100).toFixed(1) + '%';
    setState(resolveState(r, elapsed));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}());
