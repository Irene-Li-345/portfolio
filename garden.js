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

  // Layer translucent petals with a paper-grain filter for a watercolor wash.
  function lotus(side) {
    const id = `lotus-wash-${side}`;
    return `<div class="lotus-corner lotus-${side}"><svg viewBox="0 0 240 190" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <filter id="${id}" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="7" result="grain"/>
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <radialGradient id="${id}-pink"><stop stop-color="#fbe0e7"/><stop offset=".68" stop-color="#e8a5bc"/><stop offset="1" stop-color="#bc789c" stop-opacity=".8"/></radialGradient>
        <linearGradient id="${id}-leaf" x2="1" y2="1"><stop stop-color="#d6dfb9"/><stop offset="1" stop-color="#779b85"/></linearGradient>
      </defs>
      <g filter="url(#${id})">
        <ellipse cx="120" cy="170" rx="104" ry="13" fill="#b3c8be" opacity=".15"/>
        <g class="lotus-leaves" fill="url(#${id}-leaf)" opacity=".8">
          <path d="M121 167Q62 111 14 157Q52 187 121 167Z"/><path d="M119 167Q179 116 226 157Q183 188 119 167Z"/>
          <path d="M119 166Q70 147 40 167M121 166q40-17 78 0" stroke="#688d7d" stroke-width="1" fill="none" opacity=".45"/>
        </g>
        <g class="lotus-petals" fill="url(#${id}-pink)" stroke="#b97896" stroke-width=".65" stroke-opacity=".35">
          <path class="lotus-petal petal-outer" d="M119 159Q49 158 24 90Q88 94 119 159Z" opacity=".8"/>
          <path class="lotus-petal petal-outer" d="M121 159Q190 158 216 90Q153 94 121 159Z" opacity=".8"/>
          <path class="lotus-petal petal-middle" d="M119 158Q53 126 67 48Q116 77 119 158Z" opacity=".85"/>
          <path class="lotus-petal petal-middle" d="M121 158Q187 126 173 48Q125 77 121 158Z" opacity=".85"/>
          <path class="lotus-petal petal-center" d="M120 157Q77 105 120 20Q164 104 120 157Z" opacity=".94"/>
          <path class="lotus-petal petal-front" d="M120 162Q63 175 43 122Q99 111 120 162Z" opacity=".92"/>
          <path class="lotus-petal petal-front" d="M120 162Q177 175 197 122Q142 111 120 162Z" opacity=".92"/>
          <path class="lotus-petal petal-front" d="M120 166Q92 149 120 112Q147 150 120 166Z"/>
        </g>
        <path d="M120 148V71M111 147 91 91m39 56 20-56" stroke="#fff4ec" stroke-width="1.1" opacity=".4" fill="none"/>
        <ellipse cx="120" cy="162" rx="10" ry="3" fill="#e9c781" opacity=".8"/>
      </g>
    </svg></div>`;
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
