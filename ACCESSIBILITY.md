# Accessibility checks

Checked October 26, 2026 using Lighthouse 13.5.0 with local Chrome in headless mode (desktop configuration).

| Page | Light mode | Dark mode |
| --- | --- | --- |
| Home | 100 | 100 |
| Certificates | 100 | 100 |
| Projects | 100 | 100 |

Scores are Lighthouse Accessibility scores, not a guarantee of complete accessibility. These runs used the Lighthouse API against a temporary localhost server rather than the DevTools panel.

- The homepage photo has descriptive alt text and is 60,794 bytes, below 500 KB. Decorative SVG illustrations are hidden from assistive technology.
- Keyboard checks on both pages: the first Tab reaches the skip link; Enter moves focus to the main content.
- Homepage project details: Enter expands the first project and Space collapses it. Accessible names now include the visible Read more / Show less wording.
- Project buttons have a minimum height of 44 pixels; keyboard focus outlines remain visible.
- Checked body, secondary-text, and hover palette combinations in both themes. Minimum contrast across those combinations is 4.61:1, exceeding 4.5:1 for normal text.
- No image compression was necessary.

To repeat in Chrome DevTools: serve the repository locally, open each page, choose Lighthouse, select Accessibility, and Analyze page load. Repeat with the site in each theme. Aim for at least 90 and review manual checks as well.

The Projects page was also checked at a 390-pixel viewport with no horizontal overflow. Its skip link focuses main content, and Enter/Space expand and collapse project details.
