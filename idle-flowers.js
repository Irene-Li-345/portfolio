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
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let flowers = [];
  let bees = [];
  let flightFrame = 0;
  let waveTimer;
  let petals = [];
  let petalFrame = 0;
  let petalTime = 0;
  let scrollFrame = 0;
  let lastTap = null;

  // Bees work in small waves: each visits two different flowers, then leaves.
  function startBees() {
    if (!enabled || reduced.matches || document.hidden || bees.length || flowers.length <= 5) return;
    const available = flowers.filter(f => f.node.isConnected && !f.retiring && f.ready <= performance.now() && f.y - scrollY > 30 && f.y - scrollY < innerHeight - 30);
    if (available.length < 6) {
      if (flowers.some(f => f.ready > performance.now())) waveTimer = setTimeout(startBees, 700);
      return;
    }
    available.sort((a, b) => a.visits - b.visits || a.id - b.id);
    for (let i = 0; i < 3; i++) {
      const node = document.createElement('div');
      node.className = 'fluffy-bee';
      const id = `bee-fuzz-${flowerNumber}-${i}`;
      // No separate head: a fuzzy striped oval, curly antennae and fluttering wings.
      node.innerHTML = `<svg viewBox="0 0 76 62" xmlns="http://www.w3.org/2000/svg">
        <defs><clipPath id="${id}-body"><ellipse cx="38" cy="36" rx="22" ry="15"/></clipPath><filter id="${id}" x="-20%" y="-25%" width="140%" height="150%"><feTurbulence type="fractalNoise" baseFrequency=".35" numOctaves="2" seed="5" result="fuzz"/><feDisplacementMap in="SourceGraphic" in2="fuzz" scale="2"/></filter></defs>
        <g class="bee-wings" fill="#e8f1ec" fill-opacity=".8" stroke="#a5bdb2" stroke-width=".8"><ellipse class="bee-wing" cx="28" cy="20" rx="8" ry="17" transform="rotate(-28 28 20)"/><ellipse class="bee-wing" cx="46" cy="19" rx="8" ry="17" transform="rotate(25 46 19)"/></g>
        <g filter="url(#${id})"><ellipse cx="38" cy="36" rx="22" ry="15" fill="#ecc65b"/><g clip-path="url(#${id}-body)" stroke="#423a31" stroke-width="7"><path d="M25 19q6 16 0 34M40 18q6 16 0 35M54 21q5 14 0 29"/></g></g>
        <path d="M53 25q8-15 14-9t-3 5M48 24q0-16 7-16t1 7" fill="none" stroke="#554637" stroke-width="1.7" stroke-linecap="round"/>
        <path d="m32 49-3 4m13-3 2 3" stroke="#554637" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`;
      layer.append(node);
      const fromLeft = i % 2 === 0;
      const bee = { node, route: [available[i * 2], available[i * 2 + 1]], index: 0, x: fromLeft ? -65 : innerWidth + 65, y: 80 + i * 95, stage: 'fly', pollen: false, lastPollen: 0, delay: performance.now() + i * 350 };
      beginFlight(bee, bee.route[0], bee.delay);
      bees.push(bee);
    }
    if (!flightFrame) flightFrame = requestAnimationFrame(fly);
  }

  function beginFlight(bee, target, now) {
    bee.fromX = bee.x; bee.fromY = bee.y;
    bee.toX = target.node ? target.x - scrollX : target.x;
    bee.toY = target.node ? target.y - scrollY - 12 : target.y - 12;
    bee.start = now;
    bee.duration = Math.max(2000, Math.min(4200, Math.hypot(bee.toX - bee.x, bee.toY - bee.y) * 6));
    bee.stage = 'fly';
    bee.node.classList.remove('is-landed');
  }

  function pollen(bee) {
    const dot = document.createElement('i');
    dot.className = 'bee-pollen';
    dot.style.left = `${bee.x}px`; dot.style.top = `${bee.y + 8}px`;
    dot.style.setProperty('--drift', `${Math.random() * 28 - 14}px`);
    layer.append(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }

  // Count actual landings. A second landing retires only that flower.
  function land(bee, now) {
    const flower = bee.route[bee.index];
    if (flower && !flower.retiring && flower.node.isConnected) {
      flower.visits++;
      flower.node.dataset.visits = flower.visits;
      if (flower.visits >= 2) {
        flower.retiring = true;
        flower.node.classList.add('is-pollinated-out');
        const cleanup = setTimeout(() => {
          flower.node.remove();
          flowers = flowers.filter(f => f !== flower);
          cleanupTimers.delete(cleanup);
        }, 2000);
        cleanupTimers.add(cleanup);
      }
    }
    bee.pollen = true;
    bee.stage = 'land'; bee.until = now + 850;
    bee.node.classList.add('is-landed');
  }

  function fly(now) {
    flightFrame = 0;
    if (!enabled || document.hidden || reduced.matches) return;
    for (const bee of bees) {
      if (bee.stage === 'land') {
        if (now >= bee.until) {
          bee.index++;
          if (bee.index < bee.route.length) beginFlight(bee, bee.route[bee.index], now);
          else { bee.exiting = true; beginFlight(bee, { x: bee.x < innerWidth / 2 ? -90 : innerWidth + 90, y: Math.max(40, bee.y - 120) }, now); }
        }
      } else if (now >= bee.start) {
        const progress = Math.min(1, (now - bee.start) / bee.duration);
        const eased = progress * progress * (3 - 2 * progress);
        bee.x = bee.fromX + (bee.toX - bee.fromX) * eased;
        bee.y = bee.fromY + (bee.toY - bee.fromY) * eased - Math.sin(progress * Math.PI) * 35;
        if (bee.pollen && now - bee.lastPollen > 130) { pollen(bee); bee.lastPollen = now; }
        if (progress === 1) {
          if (bee.exiting) { bee.done = true; bee.node.remove(); }
          else land(bee, now);
        }
      }
      bee.node.style.transform = `translate3d(${bee.x - 27}px, ${bee.y - 22}px, 0) scaleX(${bee.toX >= bee.fromX ? 1 : -1})`;
    }
    bees = bees.filter(bee => !bee.done);
    if (bees.length) flightFrame = requestAnimationFrame(fly);
    else waveTimer = setTimeout(startBees, 1200);
  }

  function stopBees() {
    cancelAnimationFrame(flightFrame); flightFrame = 0;
    clearTimeout(waveTimer);
    bees.forEach(bee => bee.node.remove()); bees = [];
    layer.querySelectorAll('.bee-pollen').forEach(dot => dot.remove());
  }

  function clearFlowers() {
    clearTimeout(timer);
    stopBees();
    cancelAnimationFrame(petalFrame); petalFrame = 0; petalTime = 0;
    cancelAnimationFrame(scrollFrame); scrollFrame = 0;
    petals = [];
    flowers = [];
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
    const documentX = point.x + scrollX;
    const documentY = point.y + scrollY;
    flower.style.left = `${point.x}px`;
    flower.style.top = `${point.y}px`;
    const id = `idle-petal-${++flowerNumber}`;
    // Randomize each petal count independently, while keeping the coordinated pastel palette.
    const petalCount = 3 + Math.floor(Math.random() * 5);
    const leafCount = 1 + (flowerNumber - 1) % 3;
    const pinks = ['#f3cfdb', '#f8dce5', '#efd0e2', '#f9e5ec', '#f0c6d5', '#f5d8e8'];
    const pink = pinks[(flowerNumber - 1) % pinks.length];
    flower.dataset.petals = petalCount;
    flower.dataset.leaves = leafCount;
    const leaves = [
      'M62 86Q39 88 36 74Q52 72 62 86Z',
      'M62 96Q83 94 85 82Q69 81 62 96Z',
      'M63 77Q82 78 86 65Q70 62 63 77Z',
    ].slice(0, leafCount).map(d => `<path class="flower-leaf" d="${d}" fill="#c7d6b2" stroke-width="1"/>`).join('');
    const petals = Array.from({ length: petalCount }, (_, i) => `<g transform="rotate(${i * 360 / petalCount} 60 54)"><g class="unfurl-petal" style="--delay:${.3 + i * .065}s"><path d="M60 60C33 45 35 21 60 13C85 21 87 45 60 60Z" fill="url(#${id})" stroke="#b67791" stroke-width=".8"/><path d="M60 53V23" stroke="#fff5f5" stroke-width="1" opacity=".55"/></g></g>`).join('');
    flower.innerHTML = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs><radialGradient id="${id}" cx="50%" cy="75%" r="80%"><stop stop-color="#fbe6e9"/><stop offset=".7" stop-color="${pink}"/><stop offset="1" stop-color="#c1819c"/></radialGradient></defs>
      <g class="bloom-stem" fill="none" stroke="#8ca78b" stroke-width="2.2" stroke-linecap="round"><path d="M60 58Q67 82 59 108"/>${leaves}</g>
      <g class="flower-bud"><path d="M60 65C44 51 47 35 60 28C73 35 76 51 60 65Z" fill="#dba2b6" stroke="#b67791" stroke-width="1"/><path d="M60 64Q44 62 47 48L60 59L73 48Q76 62 60 64Z" fill="#a6bd96"/></g>
      ${petals}<g class="bloom-center"><circle cx="60" cy="54" r="11.5" fill="#e9c47e"/></g>
    </svg>`;
    flower.dataset.visits = '0';
    layer.append(flower);
    flowers.push({ node: flower, x: documentX, y: documentY, visits: 0, id: flowerNumber, pink, petalCount, leafCount, ready: performance.now() + 2050 });
    if (flowers.length > 5) { clearTimeout(waveTimer); startBees(); }
  }

  // Keep document coordinates while drawing in a click-through viewport layer.
  function renderFlowers() {
    scrollFrame = 0;
    for (const flower of [...flowers]) {
      const y = flower.y - scrollY;
      if (y <= 0 && !flower.retiring) burst(flower);
      else {
        flower.node.style.top = `${y}px`;
        flower.node.style.left = `${flower.x - scrollX}px`;
      }
    }
    renderPetals();
  }

  function burst(flower) {
    flower.retiring = true;
    flower.node.remove();
    flowers = flowers.filter(f => f !== flower);
    if (reduced.matches) return;
    // Detached petals retain page coordinates, allowing the user to follow them down.
    for (let i = 0; i < flower.petalCount; i++) {
      const node = document.createElement('span');
      node.className = 'scattered-petal';
      node.style.background = `radial-gradient(ellipse at 35% 30%, #fff1f6, ${flower.pink} 70%, #c1819c)`;
      layer.append(node);
      petals.push({ node, x: flower.x, y: Math.max(flower.y, scrollY + 8), vx: (i - (flower.petalCount - 1) / 2) * 20, vy: -12 - Math.random() * 28, drift: Math.random() * Math.PI * 2, turn: Math.random() * 360, age: 0 });
    }
    // Each leaf detaches too, using the same page-space flutter and cleanup.
    for (let i = 0; i < flower.leafCount; i++) {
      const node = document.createElement('span');
      node.className = 'scattered-petal scattered-leaf';
      node.innerHTML = '<svg viewBox="0 0 24 34" aria-hidden="true"><path d="M3 31Q-2 8 21 2Q27 24 3 31Z" fill="#c7d6b2" stroke="#8ca78b" stroke-width=".8"/><path d="M3 31 19 5m-9 15-5-5m9-1 5 2" fill="none" stroke="#8ca78b" stroke-width=".7"/></svg>';
      layer.append(node);
      petals.push({ node, x: flower.x + (i % 2 ? 12 : -12), y: Math.max(flower.y + 16, scrollY + 12), vx: (i - (flower.leafCount - 1) / 2) * 24, vy: -8 - Math.random() * 20, drift: Math.random() * Math.PI * 2, turn: Math.random() * 360, age: 0 });
    }
    while (petals.length > 140) petals.shift().node.remove();
    if (!petalFrame && !document.hidden) petalFrame = requestAnimationFrame(fall);
  }

  function renderPetals() {
    for (const petal of petals) {
      petal.node.style.transform = `translate3d(${petal.x - scrollX + Math.sin(petal.age * 2 + petal.drift) * 18}px, ${petal.y - scrollY}px, 0) rotate(${petal.turn + petal.age * 35}deg)`;
    }
  }

  function fall(now) {
    petalFrame = 0;
    if (!enabled || document.hidden || reduced.matches) return;
    const dt = petalTime ? Math.min((now - petalTime) / 1000, .05) : 0;
    petalTime = now;
    const bottom = document.documentElement.scrollHeight - 15;
    for (const petal of petals) {
      petal.age += dt;
      petal.vx *= Math.exp(-dt * 1.5);
      petal.vy = Math.min(85, petal.vy + 35 * dt);
      petal.x = Math.max(10, Math.min(innerWidth - 25, petal.x + petal.vx * dt));
      petal.y += petal.vy * dt;
      petal.node.style.opacity = String(Math.min(1, Math.max(0, (bottom - petal.y) / 75), Math.max(0, 65 - petal.age)));
      if (petal.y >= bottom || petal.age >= 65) { petal.done = true; petal.node.remove(); }
    }
    petals = petals.filter(petal => !petal.done);
    renderPetals();
    if (petals.length) petalFrame = requestAnimationFrame(fall);
    else petalTime = 0;
  }

  function arm() {
    clearTimeout(timer);
    if (enabled && point && !document.hidden && !hasBloomed) timer = setTimeout(bloom, 2000);
  }

  // Flowers persist until two bee visits or the whole effect is switched off.
  function toggle(value) {
    enabled = value;
    clearFlowers();
    hasBloomed = false;
    lastTap = null;
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', enabled ? 'Disable idle flower blooms' : 'Enable idle flower blooms');
    button.title = enabled ? 'Disable idle flower blooms' : 'Enable idle flower blooms';
    if (enabled) arm();
  }

  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') { point = null; clearTimeout(timer); return; }
    // A small tolerance avoids restarting the timer for sub-pixel hand tremor.
    if (!point || Math.hypot(event.clientX - point.x, event.clientY - point.y) > 3) {
      point = { x: event.clientX, y: event.clientY };
      hasBloomed = false;
      arm();
    }
  }, { passive: true });
  // Recognize a double tap without cancelling normal touch scrolling or link actions.
  let touchStart = null;
  window.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  }, { passive: true });
  window.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch' || !enabled || !touchStart) return;
    const start = touchStart; touchStart = null;
    if (event.target.closest('a, button, input, textarea, select, label') || performance.now() - start.time > 450 || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 15) { lastTap = null; return; }
    const tap = { x: event.clientX, y: event.clientY, time: performance.now() };
    if (lastTap && tap.time - lastTap.time < 350 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 25) {
      clearTimeout(timer); point = { x: tap.x, y: tap.y }; hasBloomed = false;
      bloom(); lastTap = null;
    } else lastTap = tap;
  }, { passive: true });
  window.addEventListener('pointercancel', () => { touchStart = null; lastTap = null; }, { passive: true });
  function reset() { point = null; hasBloomed = false; lastTap = null; clearTimeout(timer); }
  button.addEventListener('click', () => toggle(!enabled));
  document.documentElement.addEventListener('pointerleave', event => { if (event.pointerType !== 'touch') reset(); });
  window.addEventListener('blur', reset);
  window.addEventListener('scroll', () => {
    reset();
    if (!enabled) return;
    // Bees choose fresh, visible targets once scrolling settles.
    stopBees();
    if (!scrollFrame) scrollFrame = requestAnimationFrame(renderFlowers);
    waveTimer = setTimeout(startBees, 300);
  }, { passive: true });
  window.addEventListener('resize', () => { reset(); clearFlowers(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { reset(); stopBees(); cancelAnimationFrame(petalFrame); petalFrame = 0; petalTime = 0; }
    else { startBees(); if (petals.length && !petalFrame) petalFrame = requestAnimationFrame(fall); }
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stopBees(); cancelAnimationFrame(petalFrame); petalFrame = 0; petalTime = 0;
      petals.forEach(petal => petal.node.remove()); petals = [];
    } else startBees();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') toggle(false);
    else if (event.key === 'Tab') reset();
  });
})();
