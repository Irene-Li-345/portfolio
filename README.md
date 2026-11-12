# Portfolio

> **REVIEW: New overview and setup sections below.** These temporary review labels can be removed once the wording is approved.

## Project description

Irene Li's professional portfolio introduces her background as a Software and Data Engineering Technology student at NJIT and showcases her projects, technical skills, and continued learning. The site includes a homepage with About, Skills, and Contact sections, a dedicated Projects page with expandable project cards, and a Certificates page with links to certificate PDFs.

Built with plain HTML, CSS, and JavaScript, the site uses relative file paths and requires no framework or build step. Features include responsive layouts, light and dark themes, keyboard-accessible navigation, and optimized portrait images.

## Live website

[View Irene Li's portfolio](https://irene-li-345.github.io/portfolio/)

## Viewing locally

1. Clone or download this repository and open its folder.
2. Open `index.html` in your browser for a quick preview.
3. For local testing with a consistent origin, run a local HTTP server from the repository folder. If Python is installed:

   ```powershell
   python -m http.server 8000
   ```

4. Visit [http://localhost:8000/index.html](http://localhost:8000/index.html). Use the navigation to open Projects and Certificates.
5. Stop the server with `Ctrl+C` in the terminal.

Python is optional for a basic browser preview. No npm packages or build commands are required to view the site.

## Notes and acknowledgments

- The site is hosted on GitHub Pages.
- The Hello greeting uses Mrs Saint Delafield from Google Fonts, hosted locally under the SIL Open Font License. Its license is included in `assets/fonts/MrsSaintDelafield-OFL.txt`.
- See [TESTING.md](TESTING.md) for repeatable test cases and recorded results, and [ACCESSIBILITY.md](ACCESSIBILITY.md) for accessibility and Lighthouse checks. Results describe the documented runs and may vary by device or browser.
- The current certificates were issued through LinkedIn Learning. The certificates page can include other providers in the future.
- OpenWeatherMap and NewsAPI are used by the showcased Python projects; this static portfolio does not call those APIs or require their API keys.
- Python and Pillow are needed only for the optional portrait-optimization script described below.

> **END OF REVIEW ADDITIONS.** Existing project and photo editing guides continue below.

## Updating projects

The full project cards are in `projects.html`. Each `<article id="project-1">` inside `.project-grid` is one project. Edit its heading, technology label, summary, and expanded details to replace a project.

To add a project:

1. Copy an entire project `<article>` and paste it inside the same `.project-grid`.
2. Give the article a unique ID, such as `project-4`, and update its displayed number.
3. Give its details panel a unique ID, such as `project-details-4`, and set the button's `aria-controls` to that exact ID.
4. Update the button's `aria-label` to `Read more about YOUR PROJECT TITLE`.
5. Edit the project content. Remove the In progress label if it does not apply.

The existing JavaScript automatically attaches expandable behavior to each `.project-toggle`. The grid adapts to additional cards and smaller screens without JavaScript changes.

The homepage shows three selected project previews. To change those, edit the articles in `index.html` and point each View project details link to the corresponding `projects.html#project-ID`. New projects do not need a homepage preview.

Keep image alt text descriptive and any future image assets under 500 KB. See `ACCESSIBILITY.md` for accessibility checks.

## Replacing the homepage photo

Prepare each new photo before publishing; swapping the source file alone does not optimize it automatically. Install Python and Pillow (`python -m pip install Pillow`), then run from this repository:

```powershell
python scripts/optimize_profile.py "C:/path/to/new-photo.jpg" --output-dir assets/portrait-20261105
```

The script keeps the original intact, corrects EXIF orientation, removes metadata from the generated files, and crops the center to the existing 4:5 portrait shape. It creates `assets/profile-300.webp` (300 x 375), `assets/profile-400.webp` (400 x 500), `assets/profile-600.webp` (600 x 750), and `assets/profile.jpg` (600 x 750 JPEG fallback). Each file must be below 500,000 bytes. Review the central crop; pre-crop the source if needed. Small source images can look soft when enlarged.

The homepage automatically uses these stable filenames and selects a WebP size for the viewport and pixel density. Keep the image's `width="600"`, `height="750"`, and `fetchpriority="high"`. Update the alt text to describe the replacement photo accurately; the script does not change HTML or invent alt text. Preview both desktop and mobile, then commit and push the four generated images and any alt-text change.

The currently displayed portrait files are in assets/portrait-20261105/. Use that output directory when replacing the active portrait, or update the image paths in index.html when creating a new versioned folder.

## Temporarily hidden profile photo

The homepage portrait is temporarily hidden. Its original picture markup remains commented out in `index.html`, and the same optimized photo is preserved in `assets/portrait-20261105/`. To restore it, uncomment that picture block and remove `hero--no-photo` from the hero section. The existing crop and alt text are preserved.

## Idle flower blooms

The five-petal flower button to the left of the theme switch enables idle-pointer flowers. Rest the mouse or pen in one position for two seconds: a bud appears there and its petals unfurl into a five-petal flower. Moving more than a few pixels starts a fresh two-second wait; existing flowers remain. Only one flower blooms per resting position. Once more than five flowers are present, three fluffy striped bees enter in waves. Each lands on two different flowers and flies offscreen, leaving falling, fading yellow pollen after collecting it. Flowers stay visible briefly after their second bee landing, then fade and are removed two seconds after that landing. Each bloom varies between three and seven randomly selected petals, one to three leaves, and varied light pink shades, with a plain golden center and no dark spots. Click the button again or press Escape to disable it.

The normal cursor is preserved and decorations cannot intercept clicks. Scrolling, leaving the page, or switching to keyboard navigation cancels the pending idle timer while preserving existing flowers. Resizing clears the garden so flowers stay within the new viewport. Touch scrolling does not trigger blooms. Reduced-motion settings show static open flowers after the same delay and disable flying bees and pollen. Artwork and timing live in `idle-flowers.js`; styling and unfurl animations live in `idle-flowers.css`.
