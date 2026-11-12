// Opt-in flowers bloom only after a mouse or pen rests in one place for two seconds.
(() => {
  const button = document.querySelector('.bloom-toggle');
  if (!button) return;
  const layer = document.createElement('div');
  layer.className = 'idle-flower-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.append(layer);
  button.hidden = false;
  let enabled = false;
  let point = null;
  let timer;
  let hasBloomed = false;
  let flowerNumber = 0;
  const cleanupTimers = new Set();

  function clearFlowers() {
    clearTimeout(timer);
    cleanupTimers.forEach(clearTimeout);
    cleanupTimers.clear();
    layer.replaceChildren();
  }

  // Bud fades as individual petals unfold outward from the same central point.
  function bloom() {
    if (!enabled || !point || document.hidden || hasBloomed) return;
    hasBloomed = true;
    const flower = document.createElement('div');
    flower.className = 'idle-flower';
    flower.style.left = `${point.x}px`;
    flower.style.top = `${point.y}px`;
    const id = `idle-petal-${++flowerNumber}`;
    const petals = Array.from({ length: 5 }, (_, i) => `<g transform="rotate(${i * 72} 60 54)"><g class="unfurl-petal" style="--delay:${.3 + i * .09}s"><path d="M60 60C33 45 35 21 60 13C85 21 87 45 60 60Z" fill="url(#${id})" stroke="#b67791" stroke-width=".8"/><path d="M60 53V23" stroke="#fff5f5" stroke-width="1" opacity=".55"/></g></g>`).join('');
    flower.innerHTML = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs><radialGradient id="${id}" cx="50%" cy="75%" r="80%"><stop stop-color="#fbe6e9"/><stop offset=".7" stop-color="#e7b0c2"/><stop offset="1" stop-color="#c1819c"/></radialGradient></defs>
      <g class="bloom-stem" fill="none" stroke="#8ca78b" stroke-width="2.2" stroke-linecap="round"><path d="M60 58Q67 82 59 108"/><path d="M62 86Q39 88 36 74Q52 72 62 86M62 96Q83 94 85 82Q69 81 62 96" fill="#c7d6b2" stroke-width="1"/></g>
      <g class="flower-bud"><path d="M60 65C44 51 47 35 60 28C73 35 76 51 60 65Z" fill="#dba2b6" stroke="#b67791" stroke-width="1"/><path d="M60 64Q44 62 47 48L60 59L73 48Q76 62 60 64Z" fill="#a6bd96"/></g>
      ${petals}<g class="bloom-center"><circle cx="60" cy="54" r="7.5" fill="#e9c47e"/><circle cx="57" cy="52" r="1" fill="#b88e4d"/><circle cx="63" cy="52" r="1" fill="#b88e4d"/><circle cx="60" cy="57" r="1" fill="#b88e4d"/></g>
    </svg>`;
    layer.replaceChildren(flower);
  }

  function arm() {
    clearTimeout(timer);
    if (enabled && point && !document.hidden && !hasBloomed) timer = setTimeout(bloom, 2000);
  }

  // One bloom per resting position; the old flower gently fades when movement resumes.
  function retire() {
    const flower = layer.querySelector('.idle-flower:not(.is-retiring)');
    if (!flower) return;
    flower.classList.add('is-retiring');
    const cleanup = setTimeout(() => { flower.remove(); cleanupTimers.delete(cleanup); }, 350);
    cleanupTimers.add(cleanup);
  }

  function toggle(value) {
    enabled = value;
    clearFlowers();
    hasBloomed = false;
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Disable idle flower blooms' : 'Enable idle flower blooms');
    button.title = enabled ? 'Disable idle flower blooms' : 'Enable idle flower blooms';
    if (enabled) arm();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') { point = null; clearFlowers(); return; }
    // A small tolerance avoids restarting the timer for sub-pixel hand tremor.
    if (!point || Math.hypot(event.clientX - point.x, event.clientY - point.y) > 3) {
      point = { x: event.clientX, y: event.clientY };
      hasBloomed = false;
      retire();
      arm();
    }
  }, { passive: true });
  function reset() { point = null; hasBloomed = false; clearFlowers(); }
  button.addEventListener('click', () => toggle(!enabled));
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', reset, { passive: true });
  window.addEventListener('resize', reset);
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggle(false);
    else if (event.key === 'Tab') reset();
  });
})();
