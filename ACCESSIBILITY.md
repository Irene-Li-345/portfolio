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

## Performance follow-up - October 29, 2026

Clean Chrome (extensions disabled), Lighthouse 13.5.0. Live baseline before these changes: Performance 85, Accessibility 100, Best Practices 96, SEO 100; CLS 0.212. The CSP warning and unexpected Google Fonts request in the supplied report did not reproduce. The clean baseline instead found a missing favicon (HTTP 404).

Local optimized results:

| Page / configuration | Performance | Accessibility | Best Practices | SEO | CLS |
| --- | --- | --- | --- | --- | --- |
| Home / desktop | 97 | 100 | 100 | 100 | 0 |
| Projects / desktop | 97 | 100 | 100 | 100 | 0 |
| Certificates / desktop | 97 | 100 | 100 | 100 | 0 |
| Home / mobile | 100 | 100 | 100 | 100 | 0 |

Reserved the theme button's space before initialization and fixed its width so theme label changes do not resize the header. Added a relative SVG favicon to all pages. Added a 400 x 500 WebP (11,604 bytes) and included it in the reusable replacement-photo workflow. Existing img width, height, and alt text remain unchanged. All three pages fit widths 320, 390, 768, 966, and 1440 without horizontal overflow; theme button geometry stays unchanged when toggled. A separate replacement image generated all four output sizes successfully.

These are lab results; local and hosted timings are not directly comparable. GitHub Pages' cache-lifetime warning remains a hosting concern. No security-policy change was made because the reported CSP violation did not reproduce in clean Chrome.
