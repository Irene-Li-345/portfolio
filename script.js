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
