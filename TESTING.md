# Site Test Plan

Executed October 26, 2026 against the local repository using headless Google Chrome and Playwright on Windows. Desktop checks use the default browser viewport; responsive checks cover 320, 390, 768, and 1440 pixels. Results reflect this run, not untested browsers or the deployed site.

## Setup

Serve the repository using a local HTTP server and open index.html in Chrome. For example, with Python installed, run `python -m http.server 8000` from the repository and visit `http://localhost:8000/index.html`. For tests requiring a fresh theme preference, clear this origin's site storage or use an Incognito window.

## Results

18 of 18 tests passed. Repeat these checks after changes to navigation, project cards, styles, or scripts.

## T1: Pages load successfully

- **What is being tested:** Pages load successfully.
- **Steps to run:** Open index.html, projects.html, and certificates.html using the local server.
- **Expected result:** Each page returns HTTP 200 and displays one visible main heading.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T2: Primary navigation

- **What is being tested:** Primary navigation.
- **Steps to run:** On each page, select Projects, then Certificates, then Home from the navigation.
- **Expected result:** Each link opens its corresponding page.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T3: Homepage section navigation

- **What is being tested:** Homepage section navigation.
- **Steps to run:** On the homepage, select About, Skills, and Contact in the navigation.
- **Expected result:** Each link targets an existing, visible section and updates the URL fragment.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T4: Homepage project preview links

- **What is being tested:** Homepage project preview links.
- **Steps to run:** Open Home. Select each View project details link, returning Home between attempts.
- **Expected result:** Each preview opens Projects at the matching project card.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T5: Project card content

- **What is being tested:** Project card content.
- **Steps to run:** Open Projects and inspect all three project headings and initial detail states.
- **Expected result:** Weather Lookup, News Headline Finder, and The Shape Series are present; details start collapsed.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T6: Expand and collapse every project

- **What is being tested:** Expand and collapse every project.
- **Steps to run:** On Projects, click Read more on each card; click Show less after reading its details.
- **Expected result:** The matching panel opens and closes; button text, accessible label, and aria-expanded stay synchronized.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T7: Keyboard project controls

- **What is being tested:** Keyboard project controls.
- **Steps to run:** On Projects, use Tab to reach the first Read more button. Press Enter, then Space.
- **Expected result:** Enter opens the details; Space closes them; focus stays on the button with a visible focus outline.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T8: Skip navigation with keyboard

- **What is being tested:** Skip navigation with keyboard.
- **Steps to run:** Reload each page. Press Tab once and then Enter.
- **Expected result:** Skip to content is the first focus target; activating it moves focus to main.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T9: Theme toggle and persistence

- **What is being tested:** Theme toggle and persistence.
- **Steps to run:** On Home, use the theme button to select dark mode. Reload, visit Projects and Certificates, then select light mode.
- **Expected result:** Dark mode persists across reload and navigation; selecting light mode updates the page and button state.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T10: System color preference

- **What is being tested:** System color preference.
- **Steps to run:** In a fresh browser context with no saved theme, set the system preference to dark, load Home, then change it to light.
- **Expected result:** The site follows the system preference when no user choice has been stored.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T11: Responsive layout

- **What is being tested:** Responsive layout.
- **Steps to run:** Open all pages at widths 320, 390, 768, and 1440 pixels. Inspect page width and navigation visibility.
- **Expected result:** No horizontal page overflow; navigation links remain visible at each width.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T12: Image alt text and file size

- **What is being tested:** Image alt text and file size.
- **Steps to run:** Inspect every image on all pages. Check that it loads, has meaningful alt text, and its file is smaller than 500,000 bytes.
- **Expected result:** Every image loads with nonempty alt text and is below 500 KB.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T13: Certificate PDF links

- **What is being tested:** Certificate PDF links.
- **Steps to run:** Open Certificates. Check both View certificate links and request their PDF targets.
- **Expected result:** Two links point to valid PDF files; links open in a new tab and include noopener.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T14: Contact email destination

- **What is being tested:** Contact email destination.
- **Steps to run:** On Home, inspect Get in touch and the email link in Contact.
- **Expected result:** Both links target mailto:il94@njit.edu. Sending email is outside this test.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T15: Reduced-motion preference

- **What is being tested:** Reduced-motion preference.
- **Steps to run:** Enable reduced motion in the browser. Open Projects and expand and collapse a project.
- **Expected result:** Details open and close without an active expansion animation.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T16: Button hover colors

- **What is being tested:** Button hover colors.
- **Steps to run:** For both themes, hover over the homepage project CTA and theme button, then a project Read more button.
- **Expected result:** Each control changes its background color when hovered.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T17: Local links and fragments

- **What is being tested:** Local links and fragments.
- **Steps to run:** Inspect local href/src values on every page. Request each target and check any fragment against an element ID.
- **Expected result:** Every local target returns HTTP 200 and each HTML fragment resolves to an element.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## T18: Browser JavaScript errors

- **What is being tested:** Browser JavaScript errors.
- **Steps to run:** Load all pages while monitoring uncaught JavaScript errors; toggle theme and project details.
- **Expected result:** No uncaught browser JavaScript errors occur during these interactions.
- **Actual result:** **Pass**. Expected behavior observed in the Chrome run.

## Additional accessibility audit

Prior Lighthouse accessibility results for all three pages are recorded in ACCESSIBILITY.md. To rerun, open Chrome DevTools, select Lighthouse, enable Accessibility, and analyze each page. Aim for at least 90; review manual checks as well. Lighthouse scores do not replace keyboard or visual testing.
