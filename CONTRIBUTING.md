# Contributing

This repository contains the public SpaceScale website.

Contributions should be focused, easy to review, and aligned with the existing direction of the site.

## Pull Request Scope

Keep pull requests small.

Follow single responsibility for changes. A pull request should have one clear purpose and one reason to be reviewed.

Prefer one issue, one section, or one bug fix per pull request. Avoid giant pull requests that mix unrelated sections,
broad refactors, asset changes, copy changes, and styling changes in one review.

Use atomic commits where practical. Each commit should represent a coherent change that can be understood on its own.

Do not send random unassigned contributions. If you want to add an independent feature, redesign a section, change
architecture, or make a broad cleanup, open an issue first and wait for maintainer direction.

If a change needs to touch shared layout, global styles, or project structure, explain why in the pull request and link
the issue that approved the direction.

Do not mix responsive fixes, visual redesign, file movement, asset rewrites, and broad cleanup in one pull request unless
the issue explicitly asks for that combined scope.

## Branches

Open pull requests against `dev` unless a maintainer asks otherwise.

`main` is the production branch.

## Project Structure

Use the existing structure:

- `src/layouts` for page layouts
- `src/components/site` for shared site shell components
- `src/components/sections` for page sections
- `src/pages` for routes
- `src/styles/global.css` for shared tokens, fonts, base styles, and reusable global rules
- `public/assets` for static images, SVG illustrations, diagrams, and social preview assets

Do not add new top-level folders unless there is a clear project-level reason.

Engineering blog posts live in `src/content/engineering`. The engineering page UI and cover system live under
`src/components/sections/engineering`. Generated cover routes may live in `src/pages/engineering/covers`, but those route
files should stay thin and delegate implementation to `src/components/sections/engineering/covers`.

For engineering covers, choose `cardVisual` and optional `cardText` in MDX frontmatter. Do not add per-post generated
image paths; the cover route derives the image from the post slug.

## Design And UI

Match the existing SpaceScale direction:

- dark background
- sharp edges
- restrained mint accent
- calm typography
- precise spacing
- useful technical visuals

If an issue includes a visual reference, screenshot, or asset list, follow it closely. If an asset is missing, ask
before adding placeholders.

If an issue references Figma, screenshots, or approved dimensions, match the desktop design first before responsive
behavior is added. Do not approximate dimensions, line patterns, spacing, borders, asset placement, or visual hierarchy.

For responsive changes, preserve the approved desktop composition unless the issue explicitly asks for a redesign. Include
screenshots or notes for desktop resize, tablet, and mobile when the change affects layout, diagrams, navigation, or
section structure.

Responsive fixes should not change navigation, footer, or section copy unless the issue explicitly asks for copy or
information architecture changes.

## Styling

Reuse existing tokens and patterns where possible.
Avoid duplicated colors, font stacks, and spacing values when a shared token already exists. Do not change global styles
for a single one-off section unless the change is truly shared.
Do not make broad responsive changes unless the issue explicitly asks for them.
Prefer width-based or container-based breakpoints. Avoid `orientation` media queries unless the issue specifically needs
orientation-aware behavior.
Keep media queries clear and non-redundant. Do not nest a breakpoint inside another matching breakpoint block.
Scope responsive overrides to the component or section that owns the layout. Avoid broad shared-layout overrides for a
one-section fix.
Keep Astro scoped `<style>` blocks as the default for component-specific CSS. Move styles into sibling CSS files only
when there is a clear reuse or readability reason that outweighs the extra file split.
Remove trailing whitespace before committing.


## Dependencies
Do not add new dependencies without prior discussion.
If a dependency seems necessary, explain what problem it solves and why the existing stack cannot solve it cleanly.

## Review Standard

Maintainers may ask for changes to preserve visual consistency, clean architecture, small pull request boundaries,
accessibility, performance, and long-term maintainability.
That review process is part of keeping SpaceScale deliberate as the site grows.
