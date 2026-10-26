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
