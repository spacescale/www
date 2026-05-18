# Agent Rules

Keep SpaceScale deliberate, sharp, and maintainable. Prefer the smallest correct change that preserves the existing visual language and folder ownership.

## Design

- Preserve the SpaceScale direction: dark surfaces, sharp edges, restrained mint accents, calm typography, and useful technical visuals.
- Avoid generic SaaS layouts, decorative blobs, stock-like hero art, and unnecessary gradients.
- Match approved designs closely when a task provides screenshots, Figma, or exact dimensions.
- For Figma-backed work, verify spacing, borders, line patterns, typography, asset placement, and hierarchy instead of tuning by eye.
- Preserve the approved desktop composition before adding responsive behavior.
- For responsive layout work, verify desktop resize, tablet, and mobile states before finishing.

## Code

- Use Astro components with scoped CSS as the default.
- Use native CSS and existing tokens from `src/styles/global.css` where they fit.
- Use exact local values when a visual spec requires exact spacing, size, border, or placement.
- Keep section-specific styles under a namespaced owner class.
- Prefer semantic HTML, shallow selectors, and clear accessible labels.
- Do not use Tailwind, styling libraries, icon libraries, animation libraries, or build plugins without explicit approval.
- Do not use `!important`.
- Do not change global tokens to solve a one-section problem.

## Structure

- Keep one visual section in the component that owns it unless there is real reuse.
- Do not create abstractions, wrapper components, or helper layers for a single call site.
- Keep component props minimal and concrete.
- Keep data arrays close to the component that owns them.
- Do not move files or reshape folders unless the task is specifically about structure.
- Do not change package files, lockfiles, build config, or framework config unless the task requires it.

## Assets

- Use `public/assets` for shared static visuals and brand/social SVG assets.
- Keep section-owned assets beside the section when they are implementation details of that section.
- Do not add unused assets, placeholders, temporary external asset URLs, or manual generated image paths.
- Do not replace existing SVG diagrams unless animation, proportions, labels, and desktop appearance are preserved.
- Keep asset names descriptive and stable.

## PR Hygiene

- Do not mix implementation work with unrelated cleanup.
- Do not mix responsive fixes, visual redesign, file movement, asset rewrites, and copy changes unless the task asks for that scope.
- Do not change navigation, footer, or section copy while fixing responsive behavior unless requested.
- Fix obvious spelling issues when touching nearby copy.
- Remove trailing whitespace before committing.
- Update nearby docs when a change alters structure, commands, assets, styling direction, or contribution expectations.
- Add comments only when they preserve non-obvious intent or a boundary decision.
