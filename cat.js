// Optional decorative companion: no movement or pointer tracking until invited.
(() => {
  const button = document.querySelector('.cat-toggle');
  if (!button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cat = document.createElement('div');
  cat.className = 'screen-cat';
  cat.hidden = true;
  cat.setAttribute('aria-hidden', 'true');
  // Four articulated legs, a smaller profile head, and a two-part swaying tail.
  cat.innerHTML = `<svg class="cat-drawing" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#655e57" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="61" cy="85" rx="39" ry="2" fill="#524940" opacity=".12" stroke="none"/>
    <g class="cat-body">
      <g class="cat-tail">
        <path d="M35 50C22 49 13 40 10 28" stroke="#aaa298" stroke-width="6"/>
        <g class="cat-tail-tip"><path d="M10 28C6 18 7 9 13 7" stroke="#aaa298" stroke-width="5"/></g>
      </g>
      <!-- Far-side legs are darker and slightly offset for visible depth. -->
      <g class="cat-leg cat-hind-far" style="--hip-x:43px;--hip-y:54px;--phase:-.47s">
        <path d="M43 54Q50 60 47 68" stroke="#9a9288" stroke-width="8"/>
        <g class="cat-shin" style="--knee-x:47px;--knee-y:68px"><path d="M47 68L43 81h6" stroke="#9a9288" stroke-width="5"/></g>
      </g>
      <g class="cat-leg cat-front-far" style="--hip-x:79px;--hip-y:53px;--phase:-.16s">
        <path d="M79 53L80 67" stroke="#9a9288" stroke-width="6"/>
        <g class="cat-shin" style="--knee-x:80px;--knee-y:67px"><path d="M80 67L79 81h6" stroke="#9a9288" stroke-width="5"/></g>
      </g>
      <!-- Long back, soft belly, and small shoulder and haunch contours. -->
      <path d="M30 48Q32 37 48 38L70 39Q80 37 85 43L92 48Q91 59 83 63L76 64Q63 60 51 62Q36 65 30 56Z" fill="#bdb5aa"/>
      <path d="M48 59Q63 55 79 60" stroke="#d7d0c5" stroke-width="5"/>
      <path d="M38 42q-6 6-2 14M77 43q5 4 3 12" stroke="#a69c8f"/>
      <g class="cat-leg cat-hind-near" style="--hip-x:37px;--hip-y:54px;--phase:0s">
        <path d="M37 54Q45 60 42 68" stroke="#bdb5aa" stroke-width="9"/>
        <g class="cat-shin" style="--knee-x:42px;--knee-y:68px"><path d="M42 68L36 82h7" stroke="#bdb5aa" stroke-width="5.5"/></g>
      </g>
      <g class="cat-leg cat-front-near" style="--hip-x:84px;--hip-y:53px;--phase:-.31s">
        <path d="M84 53L85 67" stroke="#bdb5aa" stroke-width="7"/>
        <g class="cat-shin" style="--knee-x:85px;--knee-y:67px"><path d="M85 67L84 83h7" stroke="#bdb5aa" stroke-width="5.5"/></g>
      </g>
      <g class="cat-head">
        <path d="M81 46L80 26Q80 24 82 26l8 7 7-1 6-8q1-1 1 2l-1 14 7 7-1 5-10 3q-11 1-17-7Z" fill="#bdb5aa"/>
        <path d="M83 30l1 8 4-3M101 30l-1 7-3-2" fill="#c7a8a7" stroke="none"/>
        <path d="M94 42q3-2 5 0" stroke="#42493b" stroke-width="1.5"/>
        <path d="M108 47l3 1-2 3" fill="#8f6b6e" stroke="none"/>
        <path d="M104 51l4 1M102 49l10-2M102 52l10 2" stroke="#79716a" stroke-width=".6"/>
      </g>
    </g>
  </svg>`;
  document.body.append(cat);
  button.hidden = false;

  let active = false;
  let x = -125;
  let direction = 1;
  let previousTime = 0;
  let frame = 0;
  let jumpStart = 0;
  let lastPounce = -Infinity;
  let pointer = null;
  const width = 120;

  // Keep the moving decoration outside the document flow and unable to block clicks.
  function draw(height = 0) {
    cat.style.transform = `translate3d(${x}px, ${-height}px, 0)`;
    cat.querySelector('svg').style.transform = `scaleX(${direction})`;
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }

  function finishExit() {
    cat.hidden = true;
    cat.classList.remove('is-walking', 'is-pouncing');
    jumpStart = 0;
    stop();
  }

  // Toggle off walks the cat back out through its entry corner.
  function setActive(value) {
    active = value;
    button.setAttribute('aria-pressed', String(active));
    // Preserve the featureless icon; expose the action through its accessible name.
    button.title = active ? 'Hide cat companion' : 'Call cat companion';
    button.setAttribute('aria-label', active ? 'Hide cat companion' : 'Call cat companion');
    pointer = null;
    if (reducedMotion.matches) {
      stop();
      jumpStart = 0;
      cat.classList.remove('is-walking', 'is-pouncing');
      cat.hidden = !active;
      x = 12;
      direction = 1;
      draw();
      return;
    }
    if (active && cat.hidden) {
      x = -width;
      direction = 1;
    }
    cat.hidden = false;
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  }

  // Frame-rate independent patrol, nearby-cursor chase, and short playful leaps.
  function tick(time) {
    frame = 0;
    const dt = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    const rightEdge = Math.max(0, window.innerWidth - width);
    let speed = 44;
    if (!active) {
      direction = -1;
      speed = 120;
      jumpStart = 0;
    } else {
      const nearby = pointer && time - pointer.time < 2500 && pointer.y > window.innerHeight - 190 && Math.abs(pointer.x - (x + width / 2)) < 250;
      if (nearby) {
        const distance = pointer.x - (x + width / 2);
        if (Math.abs(distance) > 12) direction = Math.sign(distance);
        speed = Math.abs(distance) > 18 ? 100 : 0;
        if (Math.abs(distance) < 95 && !jumpStart && time - lastPounce > 1800) {
          jumpStart = time;
          lastPounce = time;
        }
      } else if (x >= rightEdge) direction = -1;
      else if (x <= 0) direction = 1;
    }
    x += direction * speed * dt;
    if (active) x = Math.min(x, rightEdge);
    if (!active && x < -width - 5) { finishExit(); return; }
    let height = 0;
    if (jumpStart) {
      const progress = (time - jumpStart) / 550;
      if (progress >= 1) jumpStart = 0;
      else height = Math.sin(progress * Math.PI) * 48;
    }
    // Shorter strides at chase speed; all four legs retain staggered footfalls.
    cat.style.setProperty('--stride', `${speed > 60 ? .5 : .85}s`);
    cat.classList.toggle('is-pouncing', Boolean(jumpStart));
    cat.classList.toggle('is-walking', speed > 0 && !jumpStart);
    draw(height);
    frame = requestAnimationFrame(tick);
  }

  // Pointer input is ignored while hidden and for touch scrolling.
  window.addEventListener('pointermove', event => {
    if (active && !reducedMotion.matches && event.pointerType !== 'touch') {
      pointer = { x: event.clientX, y: event.clientY, time: performance.now() };
    }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { pointer = null; });
  button.addEventListener('click', () => setActive(!active));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) setActive(false);
  });
  // Pause work in background tabs, and respond immediately to reduced-motion changes.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!cat.hidden && !reducedMotion.matches && !frame) frame = requestAnimationFrame(tick);
  });
  reducedMotion.addEventListener('change', () => {
    if (!cat.hidden) setActive(active);
  });
})();
