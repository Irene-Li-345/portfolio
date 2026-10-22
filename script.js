const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const mobileScreen = window.matchMedia('(max-width: 700px)');

if (menuToggle && navigation) {
  menuToggle.hidden = false;
  navigation.classList.add('menu-ready');

  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
    navigation.classList.toggle('is-open', open);
  }

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a') && mobileScreen.matches) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  mobileScreen.addEventListener('change', () => setMenu(false));
}

const projectFilters = document.querySelector('.project-filters');
const projectCards = [...document.querySelectorAll('article[data-category]')];
const filterStatus = document.querySelector('.filter-status');

if (projectFilters && filterStatus) {
  projectFilters.hidden = false;
  projectFilters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    projectFilters.querySelectorAll('button').forEach(filter => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    projectCards.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    });
    const count = projectCards.filter(card => !card.hidden).length;
    filterStatus.hidden = false;
    filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
  });
}
