# Contributing

This repository contains the public SpaceScale website.

Contributions should be focused, easy to review, and aligned with the existing direction of the site.

## Pull Requests

Open pull requests against `dev` unless a maintainer asks otherwise. `main` is the production branch.

Keep pull requests small. Prefer one issue, one section, or one bug fix per pull request.

Do not mix unrelated responsive fixes, visual redesign, file movement, asset changes, copy changes, and broad cleanup in one pull request unless the issue explicitly asks for that scope.

If you want to add an independent feature, redesign a section, change architecture, or make a broad cleanup, open an issue first and wait for maintainer direction.

If a change touches shared layout, global styles, dependencies, build config, or project structure, explain why in the pull request.

## Project Structure

Use the existing structure:

- `src/layouts` for page layouts
- `src/components/site` for shared site shell components
- `src/components/sections` for page sections
- `src/content` for content collections
- `src/pages` for routes
- `src/styles/global.css` for shared tokens, base styles, and reusable global rules
- `public/assets` for shared static assets

Do not add new top-level folders unless there is a clear project-level reason.

## Design And UI

Match the existing SpaceScale direction:

- dark background
- sharp edges
- restrained mint accent
- calm typography
- precise spacing
- useful technical visuals

If an issue includes a screenshot, visual reference, or asset list, follow it closely. If an asset is missing, ask before adding placeholders.

Responsive fixes should preserve the approved desktop composition unless the issue asks for a redesign. Include screenshots or notes for desktop resize, tablet, and mobile when the change affects layout, diagrams, navigation, or section structure.

## Styling

Reuse existing tokens and patterns where possible.

Keep component-specific CSS scoped to the component that owns it. Avoid broad global overrides for one section.

Prefer width-based or container-based breakpoints. Avoid orientation media queries unless the issue specifically needs them.

Keep media queries clear and non-redundant.

Remove trailing whitespace before committing.

## Dependencies

Do not add new dependencies without prior discussion. If a dependency seems necessary, explain what problem it solves and why the existing stack cannot solve it cleanly.

## Review Standard

Maintainers may ask for changes to preserve visual consistency, clean architecture, small pull request boundaries, accessibility, performance, and long-term maintainability.
