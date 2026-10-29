// Initialize every project button, including any cards added later in HTML.
document.querySelectorAll('.project-toggle').forEach(button => {
  // Find this card, its title, and the details panel linked by aria-controls.
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const article = button.closest('article');
  const title = article.querySelector('h3').textContent;
  // Keep track of a running animation so repeated clicks can interrupt it.
  let animation;

  // Reverse the current state, starting from the panel height visible right now.
  function toggleDetails() {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    const startHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    animation?.cancel();
    // Keep the screen-reader state, accessible name, and visible label synchronized.
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', `${opening ? 'Show less about' : 'Read more about'} ${title}`);
    button.replaceChildren(document.createTextNode(opening ? 'Show less ' : 'Read more '));
    // The plus/minus icon is decoration, so it is hidden from screen readers.
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = opening ? '−' : '+';
    button.append(icon);
    // Reveal the panel for measurement; prevent interaction while it closes.
    panel.hidden = false;
    panel.inert = !opening;
    const endHeight = opening ? panel.scrollHeight : 0;
    // Skip motion when requested or when the browser lacks animation support.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !panel.animate) {
      panel.hidden = !opening;
      return;
    }
    // Animate height and opacity, then hide a closed panel after motion finishes.
    animation = panel.animate(
      [{ height: `${startHeight}px`, opacity: opening ? 0 : 1 }, { height: `${endHeight}px`, opacity: opening ? 1 : 0 }],
      { duration: 280, easing: 'ease-in-out' }
    );
    animation.onfinish = () => { panel.hidden = !opening; animation = null; };
  }

  // Native buttons support mouse clicks, Enter, and Space.
  button.addEventListener('click', toggleDetails);
  // Also allow clicks on the card, while preserving links, text selection, and details.
  article.addEventListener('click', event => {
    if (event.target.closest('button, a, .project-details') || window.getSelection()?.toString()) return;
    toggleDetails();
  });
});
