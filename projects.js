document.querySelectorAll('.project-toggle').forEach(button => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const article = button.closest('article');
  const title = article.querySelector('h3').textContent;
  let animation;

  function toggleDetails() {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    const startHeight = panel.hidden ? 0 : panel.getBoundingClientRect().height;
    animation?.cancel();
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', `${opening ? 'Show less about' : 'Read more about'} ${title}`);
    button.replaceChildren(document.createTextNode(opening ? 'Show less ' : 'Read more '));
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = opening ? '−' : '+';
    button.append(icon);
    panel.hidden = false;
    panel.inert = !opening;
    const endHeight = opening ? panel.scrollHeight : 0;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !panel.animate) {
      panel.hidden = !opening;
      return;
    }
    animation = panel.animate(
      [{ height: `${startHeight}px`, opacity: opening ? 0 : 1 }, { height: `${endHeight}px`, opacity: opening ? 1 : 0 }],
      { duration: 280, easing: 'ease-in-out' }
    );
    animation.onfinish = () => { panel.hidden = !opening; animation = null; };
  }

  button.addEventListener('click', toggleDetails);
  article.addEventListener('click', event => {
    if (event.target.closest('button, a, .project-details') || window.getSelection()?.toString()) return;
    toggleDetails();
  });
});
