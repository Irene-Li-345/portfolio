// Optional decorative companion: no movement or pointer tracking until invited.
(() => {
  const button = document.querySelector('.cat-toggle');
  if (!button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cat = document.createElement('div');
  cat.className = 'screen-cat';
  cat.hidden = true;
  cat.setAttribute('aria-hidden', 'true');
  // A lightweight, original SVG cat faces right; CSS animates its legs and tail.
  cat.innerHTML = `<svg class="cat-drawing" viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#524940" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <ellipse class="cat-shadow" cx="62" cy="84" rx="39" ry="3" fill="#524940" opacity=".12" stroke="none"/>
    <g class="cat-tail"><path d="M35 55C12 55 7 32 18 27C27 23 31 34 23 38" stroke="#bda99a" stroke-width="10"/><path d="M35 55C12 55 7 32 18 27C27 23 31 34 23 38"/></g>
    <g class="cat-leg cat-leg-back"><path d="M47 61V79H38" stroke="#bda99a" stroke-width="10"/><path d="M47 61V79H38"/></g>
    <g class="cat-leg cat-leg-front"><path d="M78 62V79H87" stroke="#bda99a" stroke-width="10"/><path d="M78 62V79H87"/></g>
    <ellipse cx="57" cy="56" rx="29" ry="19" fill="#d9c8b9"/>
    <path d="M45 40l-3 9M56 38v10M67 40l2 8" stroke="#b49b88" stroke-width="4"/>
    <path d="M72 42L69 17L83 25Q91 22 98 26L111 18L109 44Q107 59 91 60Q75 59 72 42Z" fill="#d9c8b9"/>
    <path d="M74 24l2 12 7-7M105 25l-2 11-5-6" fill="#e9bfc5" stroke="none"/>
    <ellipse cx="83" cy="41" rx="3" ry="4" fill="#697a55" stroke="none"/><ellipse cx="101" cy="41" rx="3" ry="4" fill="#697a55" stroke="none"/>
    <path d="M89 47h5l-2.5 3Z" fill="#a46a78" stroke="none"/><path d="M92 50q-4 5-7 1M92 50q4 5 7 1" stroke-width="1.5"/>
    <path d="M78 48l-10-2M78 52l-10 2M106 48l10-2M106 52l10 2" stroke-width="1.2"/>
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
    button.textContent = active ? 'Hide cat' : 'Call cat';
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
