// Optional decorative garden; neither the flowers nor the dragonfly intercept clicks.
(() => {
  const button = document.querySelector('.garden-toggle');
  if (!button) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(any-pointer: fine)');
  const root = document.documentElement;
  let active = false;
  let lastPointer = null;
  const garden = document.createElement('div');
  garden.className = 'lotus-garden';
  garden.hidden = true;
  garden.setAttribute('aria-hidden', 'true');

  // Transparent watercolor artwork is shared by both corners, with the right mirrored.
  function lotus(side) {
    return `<div class="lotus-corner lotus-${side}"><img class="lotus-art" src="assets/lotus-watercolor.webp" width="640" height="640" alt="" draggable="false"></div>`;
  }
  garden.innerHTML = lotus('left') + lotus('right');
  const dragonfly = document.createElement('div');
  dragonfly.className = 'dragonfly-cursor';
  dragonfly.hidden = true;
  dragonfly.setAttribute('aria-hidden', 'true');
  dragonfly.innerHTML = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <g class="dragonfly-wings" fill="#d4ece6" fill-opacity=".8" stroke="#81a69e" stroke-width=".8">
      <g class="dragonfly-wing wing-left"><path d="M39 30Q1 0 4 20Q10 35 39 33Z"/><path d="M39 35Q1 34 12 48Q24 55 40 38Z"/></g>
      <g class="dragonfly-wing wing-right"><path d="M41 30Q79 0 76 20Q70 35 41 33Z"/><path d="M41 35Q79 34 68 48Q56 55 40 38Z"/></g>
      <path d="M11 19 37 31M18 44 37 36M69 19 43 31M62 44 43 36" fill="none" opacity=".5"/>
    </g>
    <path d="M40 29Q36 49 40 69Q44 49 40 29Z" fill="#789c91" stroke="#52756b" stroke-width="1"/>
    <path d="M38 44h4m-4 7h4m-3 7h2" stroke="#d1c3ad" stroke-width="1"/>
    <ellipse cx="40" cy="29" rx="4" ry="7" fill="#73998d"/>
    <circle cx="37.5" cy="21" r="3.5" fill="#b28ba4"/><circle cx="42.5" cy="21" r="3.5" fill="#b28ba4"/>
  </svg>`;
  document.body.append(garden, dragonfly);
  button.hidden = false;

  function restoreCursor() {
    dragonfly.hidden = true;
    root.classList.remove('dragonfly-active');
  }

  // The dragonfly's head sits at the real pointer hotspot, not offset from clicks.
  function positionPointer(event) {
    if (event.pointerType === 'touch') { lastPointer = null; restoreCursor(); return; }
    lastPointer = { x: event.clientX, y: event.clientY };
    if (!active || reduced.matches || !finePointer.matches) return;
    dragonfly.style.transform = `translate3d(${event.clientX - 30}px, ${event.clientY - 15.75}px, 0)`;
    dragonfly.hidden = false;
    root.classList.add('dragonfly-active');
  }

  function toggle(value) {
    active = value;
    garden.hidden = !active;
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', active ? 'Hide lotus garden' : 'Bloom lotus garden');
    button.title = active ? 'Hide lotus garden' : 'Bloom lotus garden';
    restoreCursor();
    if (active && lastPointer) positionPointer({ clientX: lastPointer.x, clientY: lastPointer.y, pointerType: 'mouse' });
  }
  button.addEventListener('click', () => toggle(!active));
  window.addEventListener('pointermove', positionPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { lastPointer = null; restoreCursor(); });
  window.addEventListener('blur', restoreCursor);
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('garden-paused', document.hidden);
    if (document.hidden) restoreCursor();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) toggle(false);
    else if (event.key === 'Tab') restoreCursor();
  });
  reduced.addEventListener('change', restoreCursor);
  finePointer.addEventListener('change', restoreCursor);
})();
