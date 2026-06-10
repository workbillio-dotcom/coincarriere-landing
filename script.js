/* ═══════════════════════════════════════════════════
   CoinCarrière BTP — script.js
═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   BLUEPRINT CANVAS — Ambient Living Surface
   Slow wave-breathing grid · Cursor proximity reveal
   Passive, engineered, below perceptual dominance
───────────────────────────────────────────────── */
// Meta Lead tracking for all registration CTAs.
(function () {
  function normalize(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function buildPayload(cta) {
    return {
      content_name: cta.dataset.ctaId || '',
      content_category: 'landing_page_cta',
      cta_id: cta.dataset.ctaId || '',
      cta_location: cta.dataset.ctaLocation || '',
      cta_label: cta.dataset.ctaLabel || normalize(cta.textContent),
      cta_destination: cta.getAttribute('href') || '',
      page_path: window.location.pathname || '/',
    };
  }

  function trackLeadCta(cta) {
    if (!cta || !window.fbq) return;
    fbq('track', 'Lead', buildPayload(cta));
  }

  window.trackLeadCta = trackLeadCta;

  document.addEventListener('click', function (event) {
    const cta = event.target.closest && event.target.closest('[data-meta-lead-cta]');
    if (!cta) return;
    trackLeadCta(cta);
  });
}());

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
    'scta-hidden',
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
    if (r > 0.88)              return 'scta-hidden';   // near footer — fade out
    if (t < 2.5 || r < 0.20)  return 'scta-dormant';  // wait past hero
    if (r < 0.32)              return 'scta-trace';
    if (r < 0.48)              return 'scta-seed';
    if (r < 0.64)              return 'scta-brief';
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

  // Click: smooth scroll to final CTA instead of navigating away
  action && action.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById('final-cta');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  function initCarousel(track, dotsEl, loop) {
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
            if (loop && dir === 1) {
              // Loop: instant jump back to start, brief pause, keep going forward
              track.scrollLeft = 0;
              pos = 0;
              holding = true;
              holdTimer = setTimeout(() => { holding = false; }, 300);
            } else {
              // Bounce: reverse direction
              holding = true;
              dir = -dir;
              holdTimer = setTimeout(() => { holding = false; }, HOLD_MS);
            }
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
  initCarousel(document.querySelector('.trust-stats-grid'),  null,  false);
  initCarousel(document.getElementById('process-track'),     document.getElementById('process-dots'), false);
  initCarousel(document.querySelector('.feat-small-cards'),  null,  true);  // loop, not bounce
  initCarousel(document.querySelector('.stats-bar-grid'),    null,  false);
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

  // Lazy-load video src on first interaction
  let srcLoaded = false;
  function ensureSrc() {
    if (srcLoaded) return;
    srcLoaded = true;
    const dataSrc = video.getAttribute('data-src');
    if (dataSrc) { video.src = dataSrc; video.load(); }
  }

  // ── Poster: seek past black opening frames, capture a real frame ──
  (function () {
    const posterImg = wrap.querySelector('.vp-poster');
    if (!posterImg) return;

    const CACHE_KEY = 'cc_vp_poster_v2';  // v2: seek-based, skips black frame 0
    const src = video.getAttribute('data-src') || 'demo.webm';

    function applyPoster(dataUrl) {
      posterImg.src = dataUrl;
      video.poster = dataUrl;
      posterImg.addEventListener('load', () => posterImg.classList.add('vp-poster-ready'), { once: true });
      if (posterImg.complete && posterImg.naturalWidth) posterImg.classList.add('vp-poster-ready');
    }

    // Clear stale v1 cache (black frame)
    try { sessionStorage.removeItem('cc_vp_poster_v1'); } catch (e) {}

    // Instant on repeat visits (same session)
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) { applyPoster(cached); return; }
    } catch (e) {}

    // First visit: load & seek to skip black opening, then capture
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';  // need decoded pixel data, not just metadata

    v.addEventListener('loadedmetadata', function () {
      // Seek 1 second in (or 10% through if shorter) — skips black intro frames
      v.currentTime = Math.min(1.0, (v.duration || 10) * 0.1);
    }, { once: true });

    v.addEventListener('seeked', function () {
      try {
        const w = v.videoWidth || 1280;
        const h = v.videoHeight || 720;
        const scale = Math.min(1, 960 / w);
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height);
        let dataUrl = canvas.toDataURL('image/webp', 0.75);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.75);
        }
        try { sessionStorage.setItem(CACHE_KEY, dataUrl); } catch (e) {}
        applyPoster(dataUrl);
      } catch (e) {}
      v.removeAttribute('src');
      v.load();
    }, { once: true });

    v.src = src;
  }());

  // Click: toggle play / pause, or replay on ended
  btn.addEventListener('click', () => {
    ensureSrc();
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

  // ── Seekable progress bar ──────────────────────
  const seekBar    = document.getElementById('vp-seek-bar');
  const bufFill    = document.getElementById('vp-buffer-fill');
  const handle     = document.getElementById('vp-seek-handle');
  const tooltip    = document.getElementById('vp-time-tooltip');

  function fmtTime(s) {
    const m = Math.floor(s / 60);
    return m + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  }

  function pctFromEvent(e) {
    const rect = seekBar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  function applyPct(pct) {
    if (!progFill) return;
    const w = (pct * 100).toFixed(2) + '%';
    progFill.style.width = w;
    if (handle) handle.style.left = w;
    if (seekBar) seekBar.setAttribute('aria-valuenow', Math.round(pct * 100));
  }

  function updateTooltip(pct) {
    if (!tooltip || !video.duration) return;
    tooltip.textContent = fmtTime(pct * video.duration);
    tooltip.style.left = (pct * 100).toFixed(2) + '%';
  }

  // sync playback progress
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = video.currentTime / video.duration;
    applyPct(pct);
  });

  // sync buffer
  video.addEventListener('progress', () => {
    if (!bufFill || !video.duration || !video.buffered.length) return;
    bufFill.style.width = ((video.buffered.end(video.buffered.length - 1) / video.duration) * 100).toFixed(2) + '%';
  });

  // hover tooltip (no drag)
  if (seekBar) {
    seekBar.addEventListener('mousemove', (e) => {
      if (seekBar.classList.contains('vp-dragging')) return;
      updateTooltip(pctFromEvent(e));
    });

    // click to seek
    seekBar.addEventListener('click', (e) => {
      if (!video.duration) return;
      const pct = pctFromEvent(e);
      video.currentTime = pct * video.duration;
      applyPct(pct);
    });

    // drag to seek (mouse)
    let dragging = false;
    seekBar.addEventListener('mousedown', (e) => {
      dragging = true;
      seekBar.classList.add('vp-dragging');
      updateTooltip(pctFromEvent(e));
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging || !video.duration) return;
      const pct = pctFromEvent(e);
      applyPct(pct);
      updateTooltip(pct);
    });
    document.addEventListener('mouseup', (e) => {
      if (!dragging) return;
      dragging = false;
      seekBar.classList.remove('vp-dragging');
      if (video.duration) video.currentTime = pctFromEvent(e) * video.duration;
    });

    // drag to seek (touch)
    seekBar.addEventListener('touchstart', (e) => {
      seekBar.classList.add('vp-dragging');
      updateTooltip(pctFromEvent(e));
      e.preventDefault();
    }, { passive: false });
    seekBar.addEventListener('touchmove', (e) => {
      if (!video.duration) return;
      const pct = pctFromEvent(e);
      applyPct(pct);
      updateTooltip(pct);
      e.preventDefault();
    }, { passive: false });
    seekBar.addEventListener('touchend', (e) => {
      seekBar.classList.remove('vp-dragging');
      if (video.duration && e.changedTouches.length) {
        video.currentTime = Math.max(0, Math.min(1, (e.changedTouches[0].clientX - seekBar.getBoundingClientRect().left) / seekBar.getBoundingClientRect().width)) * video.duration;
      }
    });

    // keyboard seek (←/→ 5s)
    seekBar.addEventListener('keydown', (e) => {
      if (!video.duration) return;
      if (e.key === 'ArrowLeft')  video.currentTime = Math.max(0, video.currentTime - 5);
      if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
    });
  }

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
    if (t < 3.2 || r < 0.22) return 'mcta-hidden';
    if (r < 0.50) return 'mcta-peek';
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

// ─── Sticky Header — Smart Visibility ────────────
(function () {
  const header   = document.getElementById('sticky-header');
  if (!header) return;

  const hero     = document.getElementById('hero-section');
  const finalCta = document.getElementById('final-cta');
  let ticking    = false;
  let b          = {};

  function recalc() {
    const sy = window.scrollY;
    b = {
      heroEnd:  hero     ? hero.getBoundingClientRect().bottom  + sy : 600,
      finalTop: finalCta ? finalCta.getBoundingClientRect().top + sy : Infinity,
    };
  }

  function update() {
    const y         = window.scrollY;
    const pastHero  = y > b.heroEnd  - 60;
    const nearFinal = y + window.innerHeight * 0.20 >= b.finalTop;
    const show      = pastHero && !nearFinal;

    header.classList.toggle('sh-visible', show);
    header.setAttribute('aria-hidden', show ? 'false' : 'true');
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', () => { recalc(); update(); }, { passive: true });

  recalc();
  update();
}());

// ─── Final CTA — Periodic micro-nudge ────────────
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var btn = document.querySelector('.cta-final');
  if (!btn) return;

  var NUDGE_INTERVAL = 8000; // ms between nudges
  var NUDGE_DURATION =  720; // matches CSS animation duration
  var timer    = null;
  var inView   = false;
  var entered  = false;

  function nudge() {
    if (!inView || document.hidden || btn.matches(':hover')) return;
    btn.classList.remove('cta-nudge-active');
    void btn.offsetWidth; // force reflow — restarts the animation
    btn.classList.add('cta-nudge-active');
    setTimeout(function () { btn.classList.remove('cta-nudge-active'); }, NUDGE_DURATION);
  }

  function startCycle() {
    clearInterval(timer);
    timer = setInterval(nudge, NUDGE_INTERVAL);
  }

  function stopCycle() {
    clearInterval(timer);
    timer = null;
    btn.classList.remove('cta-nudge-active');
  }

  // Entry + nudge cycle driven by IntersectionObserver
  var io = new IntersectionObserver(function (entries) {
    inView = entries[0].isIntersecting;
    if (inView) {
      // Entry animation — once only
      if (!entered) {
        entered = true;
        btn.classList.add('cta-entering');
        setTimeout(function () { btn.classList.remove('cta-entering'); }, 600);
      }
      // First nudge after a short settle delay, then repeat
      setTimeout(function () { nudge(); startCycle(); }, 1600);
    } else {
      stopCycle();
    }
  }, { threshold: 0.5 });

  io.observe(btn);

  // Pause cycle while hovering so nudge never fights with hover state
  btn.addEventListener('mouseenter', stopCycle);
  btn.addEventListener('mouseleave', function () { if (inView) startCycle(); });
}());

// ── Hero video: poster extraction + deferred src injection ──────────────────
// On first visit  : video src injected after first paint → no render-blocking download
// On repeat visits: poster applied instantly from sessionStorage → zero black flash
(function () {
  var isMobile  = window.matchMedia('(max-width: 767px)').matches;
  var heroEl    = document.getElementById('hero-section');
  var videoEl   = document.getElementById(isMobile ? 'hero-video-mobile' : 'hero-video-desktop');
  if (!videoEl || !heroEl) return;

  var source  = videoEl.querySelector('source[data-src]');
  var srcUrl  = source && source.getAttribute('data-src');
  if (!srcUrl) return;

  var KEY = 'cc_hero_v1_' + (isMobile ? 'm' : 'd');

  function applyPoster(url) {
    videoEl.poster = url;
    heroEl.style.backgroundImage    = 'url(' + url + ')';
    heroEl.style.backgroundSize     = 'cover';
    heroEl.style.backgroundPosition = isMobile ? 'center center' : 'right center';
  }

  // ① Apply cached poster instantly — eliminates black flash on repeat visits
  try {
    var hit = sessionStorage.getItem(KEY);
    if (hit) applyPoster(hit);
  } catch (e) {}

  // ② Inject video src after first paint — doesn't block initial render
  function startVideo() {
    if (source.src) return;
    source.src = srcUrl;
    videoEl.load();
    videoEl.play().catch(function () {});
  }
  requestAnimationFrame(function () { requestAnimationFrame(startVideo); });

  // ③ Extract poster after window.load — piggybacks on the already-loaded video
  window.addEventListener('load', function () {
    if (sessionStorage.getItem(KEY)) return;  // cache already warm
    var v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.addEventListener('loadedmetadata', function () {
      v.currentTime = Math.min(0.5, (v.duration || 5) * 0.05);
    }, { once: true });
    v.addEventListener('seeked', function () {
      try {
        var iw = v.videoWidth || 750, ih = v.videoHeight || 1334;
        var sc = Math.min(1, 960 / iw);
        var c  = document.createElement('canvas');
        c.width  = Math.round(iw * sc);
        c.height = Math.round(ih * sc);
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        var url = c.toDataURL('image/webp', 0.72);
        if (!url.startsWith('data:image/webp')) url = c.toDataURL('image/jpeg', 0.72);
        try { sessionStorage.setItem(KEY, url); } catch (e) {}
        applyPoster(url);
      } catch (e) {}
      v.removeAttribute('src');
      v.load();
    }, { once: true });
    v.src = srcUrl;
  }, { once: true });
}());
