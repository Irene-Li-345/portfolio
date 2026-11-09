// Optional decorative companion: no movement or pointer tracking until invited.
(() => {
  const button = document.querySelector('.cat-toggle');
  if (!button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cat = document.createElement('div');
  cat.className = 'screen-cat';
  cat.hidden = true;
  cat.setAttribute('aria-hidden', 'true');
  // Orange-tabby companion: rounded face, glossy eyes, white bib and four white paws.
  cat.innerHTML = `<svg class="cat-drawing" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#34302c" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="61" cy="85" rx="40" ry="3" fill="#34302c" opacity=".16" stroke="none"/>
    <g class="cat-body">
      <!-- Two tail sections sway independently; stripes move with the fur. -->
      <g class="cat-tail">
        <path d="M35 51Q17 51 11 28" stroke="#34302c" stroke-width="11"/>
        <path d="M35 51Q17 51 11 28" stroke="#f4ae50" stroke-width="8"/>
        <path d="m15 36 6-2M22 45l4-6" stroke="#ca633b" stroke-width="4"/>
        <g class="cat-tail-tip"><path d="M11 28Q5 13 11 10" stroke="#34302c" stroke-width="10"/><path d="M11 28Q5 13 11 10" stroke="#f4ae50" stroke-width="7"/><path d="m8 21 6-1" stroke="#ca633b" stroke-width="4"/></g>
      </g>
      <!-- Darker far-side legs remain visible behind the near-side pair. -->
      <g class="cat-leg cat-hind-far" style="--hip-x:43px;--hip-y:54px;--phase:-.47s">
        <path d="M43 54Q50 60 47 68" stroke="#d68e3e" stroke-width="9"/>
        <g class="cat-shin" style="--knee-x:47px;--knee-y:68px"><path d="M47 68 46 79" stroke="#d68e3e" stroke-width="7"/><ellipse cx="49" cy="81" rx="6" ry="3.5" fill="#eee9df"/></g>
      </g>
      <g class="cat-leg cat-front-far" style="--hip-x:79px;--hip-y:53px;--phase:-.16s">
        <path d="M79 53 80 67" stroke="#d68e3e" stroke-width="8"/>
        <g class="cat-shin" style="--knee-x:80px;--knee-y:67px"><path d="M80 67 78 79" stroke="#d68e3e" stroke-width="7"/><ellipse cx="81" cy="81" rx="6" ry="3.5" fill="#eee9df"/></g>
      </g>
      <!-- Plump tabby body, stripes, and the white chest marking from the reference. -->
      <path d="M30 48Q30 36 46 36L70 38Q87 34 91 48Q95 61 80 66L48 65Q29 65 30 48Z" fill="#f4ae50"/>
      <path d="M41 38q-3 7 2 11M51 38q-3 7 2 10M60 39q-1 5 3 9" stroke="#ca633b" stroke-width="4"/>
      <path d="M76 44q13-1 13 8l-9 13-7-4 1-9Z" fill="#fffdf7" stroke="none"/>
      <path d="M34 54q9-6 16 1" stroke="#ca633b" stroke-width="4"/>
      <g class="cat-leg cat-hind-near" style="--hip-x:37px;--hip-y:54px;--phase:0s">
        <path d="M37 54Q45 60 42 68" stroke="#f4ae50" stroke-width="11"/>
        <g class="cat-shin" style="--knee-x:42px;--knee-y:68px"><path d="M42 68 37 80" stroke="#f4ae50" stroke-width="8"/><path d="m39 73 5 2" stroke="#ca633b" stroke-width="3"/><ellipse cx="39" cy="82" rx="7" ry="4" fill="#fffdf7"/><path d="m37 81-1 3m4-3v3" stroke-width=".7"/></g>
      </g>
      <g class="cat-leg cat-front-near" style="--hip-x:84px;--hip-y:53px;--phase:-.31s">
        <path d="M84 53 85 67" stroke="#f4ae50" stroke-width="9"/>
        <g class="cat-shin" style="--knee-x:85px;--knee-y:67px"><path d="M85 67 84 80" stroke="#f4ae50" stroke-width="8"/><path d="m81 72 7 1" stroke="#ca633b" stroke-width="3"/><ellipse cx="87" cy="83" rx="7" ry="4" fill="#fffdf7"/><path d="m85 82-1 3m4-3v3" stroke-width=".7"/></g>
      </g>
      <g class="cat-head">
        <path d="M66 29Q60 8 67 8q8 0 17 10 12-3 20 0 11-13 14-11 4 5-1 23 5 8 1 17-5 12-25 12-19 0-26-11-6-9-1-19Z" fill="#f4ae50"/>
        <path d="M67 14q5 1 11 9l-10 5ZM113 14l-4 13 7-3Z" fill="#ef9574" stroke="none"/>
        <path d="m88 19 1 12m8-13-2 13m9-11-4 9M67 35l8 2m-8 8 7-1m40-8-7 2m8 8-7-2" stroke="#ca633b" stroke-width="3.4"/>
        <path d="M69 47q7-3 15-8 8-3 13 0 10 7 19 8-7 11-23 11-16 0-24-11Z" fill="#fffdf7" stroke="none"/>
        <ellipse cx="80" cy="36" rx="6.8" ry="7.6" fill="#242321" stroke="none"/><ellipse cx="105" cy="36" rx="6.8" ry="7.6" fill="#242321" stroke="none"/>
        <circle cx="78" cy="33" r="2.1" fill="white" stroke="none"/><circle cx="103" cy="33" r="2.1" fill="white" stroke="none"/>
        <ellipse cx="92" cy="43" rx="3.1" ry="2.1" fill="#e69478"/>
        <path d="M92 45v3q-4 5-7 1m7-1q4 5 7 1" stroke-width="1.3"/>
        <path d="m72 45-8-2m8 5-8 2m48-5 7-2m-7 5 7 2" stroke-width="1"/>
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
