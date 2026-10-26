# Portfolio

Plain HTML, CSS, and JavaScript portfolio.

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
python scripts/optimize_profile.py "C:/path/to/new-photo.jpg"
```

The script keeps the original intact, corrects EXIF orientation, removes metadata from the generated files, and crops the center to the existing 4:5 portrait shape. It creates `assets/profile-300.webp` (300 ? 375), `assets/profile-600.webp` (600 ? 750), and `assets/profile.jpg` (600 ? 750 JPEG fallback). Each file must be below 500,000 bytes. Review the central crop; pre-crop the source if needed. Small source images can look soft when enlarged.

The homepage automatically uses these stable filenames and selects a WebP size for the viewport and pixel density. Keep the image's `width="600"`, `height="750"`, and `fetchpriority="high"`. Update the alt text to describe the replacement photo accurately; the script does not change HTML or invent alt text. Preview both desktop and mobile, then commit and push the three generated images and any alt-text change.
