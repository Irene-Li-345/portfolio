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
    <!-- Lower the body to keep the shorter paws on the ground. -->
    <g class="cat-walk-pose" transform="translate(0 10)"><g class="cat-body">
      <g transform="translate(16 0) scale(.8 1)">
      <!-- A short tapered tail has a slim root and a plush rounded tip. -->
      <g class="cat-tail">
        <path d="M35 52C25 53 17 44 15 34Q14 28 19 27Q24 27 25 33C25 42 29 47 35 48Z" fill="#eca836"/>
        <path d="m17 35 7-1m-3 9 5-3" stroke="#c77929" stroke-width="3"/>
      </g>
      <!-- Darker far-side legs remain visible behind the near-side pair. -->
      <g class="cat-leg cat-hind-far" style="--hip-x:43px;--hip-y:54px;--phase:-.47s">
        <path d="M39 53Q48 51 49 59L47 67Q55 67 54 71Q54 74 44 73Q41 73 42 69L42 63Q37 59 39 53Z" fill="#d68e3e" stroke="none"/>
        <path d="M42 68Q48 66 52 68Q57 73 46 73L42 72Z" fill="#eee9df" stroke="none"/>
        <!-- One outer contour keeps the white sock continuous with the leg. -->
        <path d="M39 53Q48 51 49 59L47 67Q55 67 54 71Q54 74 44 73Q41 73 42 69L42 63Q37 59 39 53Z"/>
      </g>
      <g class="cat-leg cat-front-far" style="--hip-x:79px;--hip-y:53px;--phase:-.16s">
        <path d="M75 52Q81 50 83 54L82 67Q89 67 89 71Q87 74 78 73Q76 72 77 68Z" fill="#d68e3e" stroke="none"/>
        <path d="M77 68Q84 66 88 69L89 72Q84 75 77 72Z" fill="#eee9df" stroke="none"/>
        <!-- One outer contour keeps the white sock continuous with the leg. -->
        <path d="M75 52Q81 50 83 54L82 67Q89 67 89 71Q87 74 78 73Q76 72 77 68Z"/>
      </g>
      <!-- Plump tabby body, stripes, and the white chest marking from the reference. -->
      <path d="M30 48Q30 36 46 36L70 38Q87 34 91 48Q95 61 80 66L48 65Q29 65 30 48Z" fill="#eca836"/>
      <path d="M41 38q-3 7 2 11M51 38q-3 7 2 10M60 39q-1 5 3 9" stroke="#c77929" stroke-width="4"/>
      <path d="M76 44q13-1 13 8l-9 13-7-4 1-9Z" fill="#fff1ca" stroke="none"/>
      <path d="M34 54q9-6 16 1" stroke="#c77929" stroke-width="4"/>
      <g class="cat-leg cat-hind-near" style="--hip-x:37px;--hip-y:54px;--phase:0s">
        <path d="M32 53Q40 49 44 57Q46 61 42 65L40 69Q48 68 49 72Q49 76 37 75Q33 75 34 71L36 64Q30 60 32 53Z" fill="#eca836" stroke="none"/>
        <path d="M34 70Q41 68 46 70Q52 76 39 75L34 74Z" fill="#fff1ca" stroke="none"/>
        <!-- One outer contour keeps the white sock continuous with the leg. -->
        <path d="M32 53Q40 49 44 57Q46 61 42 65L40 69Q48 68 49 72Q49 76 37 75Q33 75 34 71L36 64Q30 60 32 53Z"/>
      </g>
      <g class="cat-leg cat-front-near" style="--hip-x:84px;--hip-y:53px;--phase:-.31s">
        <path d="M80 53Q87 51 89 55L88 69Q95 68 96 73Q95 76 84 75Q81 75 82 71Z" fill="#eca836" stroke="none"/>
        <path d="M82 70Q89 68 93 70Q99 76 86 75L82 74Z" fill="#fff1ca" stroke="none"/>
        <!-- One outer contour keeps the white sock continuous with the leg. -->
        <path d="M80 53Q87 51 89 55L88 69Q95 68 96 73Q95 76 84 75Q81 75 82 71Z"/>
      </g>
      </g>
      <g class="cat-head">
        <path d="M66 29Q60 8 67 8q8 0 17 10 12-3 20 0 11-13 14-11 4 5-1 23 5 8 1 17-5 12-25 12-19 0-26-11-6-9-1-19Z" fill="#eca836"/>
        <path d="M67 14q5 1 11 9l-10 5ZM113 14l-4 13 7-3Z" fill="#ef9574" stroke="none"/>
        <path d="m88 19 1 12m8-13-2 13m9-11-4 9M67 35l8 2m-8 8 7-1m40-8-7 2m8 8-7-2" stroke="#c77929" stroke-width="3.4"/>
        <path d="M69 47q7-3 15-8 8-3 13 0 10 7 19 8-7 11-23 11-16 0-24-11Z" fill="#fff1ca" stroke="none"/>
        <ellipse cx="80" cy="36" rx="5.6" ry="6.2" fill="#242321" stroke="none"/><ellipse cx="105" cy="36" rx="5.6" ry="6.2" fill="#242321" stroke="none"/>
        <circle cx="78" cy="33" r="1.7" fill="white" stroke="none"/><circle cx="103" cy="33" r="1.7" fill="white" stroke="none"/>
        <ellipse cx="92" cy="43" rx="3.1" ry="2.1" fill="#e69478"/>
        <path d="M92 45v3q-4 5-7 1m7-1q4 5 7 1" stroke-width="1.3"/>
        <path d="m72 45-8-2m8 5-8 2m48-5 7-2m-7 5 7 2" stroke-width="1"/>
      </g>
    </g></g>
  </svg>`;
  // A separate curled resting silhouette follows the sleepy orange-tabby reference.
  const seated = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  seated.setAttribute('class', 'cat-sit-pose');
  seated.innerHTML = `<g class="cat-sleeping" stroke="#40352a" stroke-width="1.7">
    <path d="M29 54Q29 23 58 15Q88 5 106 28Q121 48 110 70Q103 84 81 83L45 80Z" fill="#eca836"/>
    <!-- Rounded tabby stripes follow the curve of the back. -->
    <path d="M47 24q12 1 16 9M61 17q11 4 11 13M77 15q9 5 8 15M94 21q3 9-2 14M106 34l-10 8M111 49l-11 2M107 65l-10-2" stroke="#c77929" stroke-width="5"/>
    <path d="M71 42q-16 1-17 18Q52 80 80 80q17 0 22-10" fill="#eca836"/>
    <path d="M59 49q14-1 25 6M56 61q14-2 23 5" stroke="#c77929" stroke-width="4.5"/>
    <!-- Forepaws tuck beneath the cheek without separate joint outlines. -->
    <path d="M23 68Q9 64 9 72q-2 6 11 7l20 2 18-10" fill="#eca836"/>
    <path d="M22 77q-5-4-1-8M15 75q-3-3 0-5" stroke-width="1"/>
    <!-- A broad cheek and small folded ears soften the sleeping face. -->
    <path d="M14 47Q4 28 11 32l17 5Q41 27 51 30l9-8q7-3 5 18 5 10 0 20-6 14-27 13-22 0-25-13Z" fill="#eca836"/>
    <path d="m12 37 10 5-6 7M59 29l-7 7 9 5" fill="#eaa096" stroke-width="1"/>
    <path d="m29 37 2 8m6-11 2 9m6-11 2 8" stroke="#c77929" stroke-width="3.3"/>
    <path d="M35 47q-2 9-12 12-6 9 15 12 23 1 21-10-12-3-18-14Z" fill="#fff1ca" stroke="none"/>
    <path d="M20 55q4-4 8 0M45 51q4-4 8-2" stroke-width="1.7"/>
    <path d="M34 58q4-3 7 0-3 5-7 0Z" fill="#df8f87" stroke-width="1"/>
    <path d="M37 61v2m0 0q-5 4-8 0m8 0q4 3 7-1" stroke-width="1.1"/>
    <path d="m23 60-16-2m16 5L6 67m45-9 14-5m-13 8 14-1" stroke="#ead7ad" stroke-width=".8"/>
    <path d="M24 74Q15 81 30 83q17 3 32-7" fill="#eca836"/>
    <path d="M26 78q-3 2-1 4m5-4q-2 3 0 5" stroke-width="1"/>
    <!-- A thick rounded tail curls snugly around the sleeping body. -->
    <path d="M65 59Q53 54 54 69q2 15 28 11" stroke="#40352a" stroke-width="13"/>
    <path d="M65 59Q53 54 54 69q2 15 28 11" stroke="#eca836" stroke-width="9.5"/>
    <path d="m56 64 6 1m-3 8 5-2m3 7 2-4m8 5v-3" stroke="#c77929" stroke-width="3"/>
  </g>`;
  cat.querySelector('svg').append(seated);
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
  let idleSince = 0;
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
    cat.classList.remove('is-walking', 'is-pouncing', 'is-grooming');
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
    idleSince = 0;
    cat.classList.remove('is-grooming');
    if (reducedMotion.matches) {
      stop();
      jumpStart = 0;
      cat.classList.remove('is-walking', 'is-pouncing', 'is-grooming');
      cat.hidden = !active;
      cat.classList.toggle('is-grooming', active);
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
    let grooming = false;
    if (!active) {
      direction = -1;
      speed = 120;
      jumpStart = 0;
    } else {
      const nearby = pointer && time - pointer.time < 2500 && pointer.y > window.innerHeight - 190 && Math.abs(pointer.x - (x + width / 2)) < 250;
      if (nearby) {
        idleSince = 0;
        const distance = pointer.x - (x + width / 2);
        if (Math.abs(distance) > 12) direction = Math.sign(distance);
        speed = Math.abs(distance) > 18 ? 100 : 0;
        if (Math.abs(distance) < 95 && !jumpStart && time - lastPounce > 1800) {
          jumpStart = time;
          lastPounce = time;
        }
      } else {
        // Finish entering before settling down; approach resumes immediately on interest.
        if (x >= Math.min(12, rightEdge)) {
          if (!idleSince) idleSince = time;
          grooming = time - idleSince > 1600 && !jumpStart;
          if (grooming) speed = 0;
        }
        if (x >= rightEdge) direction = -1;
        else if (x <= 0) direction = 1;
      }
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
    // Shorter strides at chase speed; all four seamless legs retain staggered footfalls.
    cat.style.setProperty('--stride', `${speed > 60 ? .5 : .85}s`);
    cat.classList.toggle('is-grooming', grooming);
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
