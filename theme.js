// Keep theme variables private to this script.
(() => {
  // Read the operating-system theme and any saved user preference.
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('portfolio-theme'); } catch { /* Storage may be unavailable. */ }
  if (preference !== 'dark' && preference !== 'light') preference = null;

  // Set CSS theme variables through data-theme and update the accessible switch.
  function applyTheme(theme) {
    root.dataset.theme = theme;
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.hidden = false;
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply colors early to reduce a flash of the wrong theme.
  applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
  // Once markup exists, reveal the switch and connect its click behavior.
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(root.dataset.theme);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      // A manual selection overrides the system preference and is saved when possible.
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(preference);
      try { localStorage.setItem('portfolio-theme', preference); } catch { /* Keep working without storage. */ }
    });
  });
  // Follow system changes only until the visitor makes a personal choice.
  systemTheme.addEventListener('change', event => {
    if (!preference) applyTheme(event.matches ? 'dark' : 'light');
  });
})();
