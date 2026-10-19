export const uiStyleGuide: string = `# UI Style Guide

## Source of truth

This file is source-owned. Keep project-specific conventions here; later init and generate runs preserve it. If your agent uses a project rules file other than AGENTS.md, reference this guide there.

- This project uses the quiet, compact shadcn/ui visual language, implemented with uni-app Vue 3 and Wot UI 2.x.
- Read shadcn-uniapp.json for the theme, generated CSS and block paths. The installed theme JSON and stylesheet are authoritative, including later theme changes.
- Reuse existing components and installed blocks before creating new ones. Keep Vue Composition API, the existing Vite version and the selected styling system.
- Preserve existing UnoCSS. New projects may use Tailwind CSS v4 + weapp-tailwindcss; do not install both systems or migrate without permission.
- Use atomic classes for layout. Use shared theme rules for third-party component overrides. Do not fork Wot internals.

## Colors, type and shape

Use the semantic CSS variables below. Never copy a preview's light-mode hex colors into a page.

| Role | Theme variable |
| --- | --- |
| Page background / text | --sui-background / --sui-foreground |
| Card surface | --sui-card |
| Primary action / its text | --sui-primary / --sui-primary-foreground |
| Subtle surface / secondary text | --sui-muted / --sui-muted-foreground |
| Dividers and control borders | --sui-border |
| Destructive action / its text | --sui-destructive / --sui-destructive-foreground |
| Corner radius | --sui-radius |
| Body / heading font | --sui-font-body / --sui-font-heading |

- Inherit the selected fonts, radius and Wot density. Use semantic foreground/background pairs in light and dark modes.
- Charts follow the current mode's primary theme color.
- Default type scale: page title 24px semibold, section title 16px semibold, body 14px with 20–24px line height, supporting labels 12px with 18–20px line height. Match existing shared components when they define a different scale.
- Use restrained 1px borders, flat surfaces and little or no shadow. Avoid decorative gradients, oversized icons, unrelated colors and a new visual theme for each page.

## Layout and spacing

- Design for 320–430px phone widths first. Keep the main flow in one column; add columns only when content remains legible. Test long English and Chinese content.
- Reuse a spacing scale of 4, 8, 12, 16, 24 and 32px: page padding 16px, card padding 16px, section gaps 24px, form control gaps 12–16px, icon/label gaps 8px.
- In Tailwind use p-4, gap-2, gap-3, gap-4 and gap-6. In UnoCSS use the project's equivalent utilities and existing unit conventions. Let the configured build handle miniapp unit conversion.
- Use cards for meaningful groups, not every sentence. Keep alignment and page margins consistent. Give long text room to wrap; do not hide layout errors with clipping or forced heights.
- Shortcut groups adapt between two and three columns as space allows, with 8px gaps, 20px icons in 32px muted containers and 12px labels. Keep labels legible and touch targets at least 44px. Use a real button for an action.

## Controls and interaction

- Reuse Wot buttons, fields, selections, dialogs and shared project wrappers. Keep primary actions visually clear and secondary actions quieter.
- Place form labels above their full-width controls, with an 8px gap. Do not use side-by-side labels and inputs. Align checkbox/radio markers with the first line of multiline labels. Give textareas at least 12px inner padding and separate fields from action buttons.
- Notice bars inherit the theme radius; tags fit their content rather than stretching across the row. Keep avatar initials smaller than the surrounding avatar.
- Keep normal, hover/pressed, visible keyboard focus, disabled, loading, error and empty states consistent. Preserve labels and accessible names; support keyboard use on H5.
- Use concise sentence-case labels. Keep important content reachable with large text and the on-screen keyboard.
- Animate only to explain an interaction, including a 200ms border-color transition when fields gain or lose focus. Respect reduced motion. Segmented indicators must slide inside their control when panel height changes.

## Icons

- Read package.json and Vite configuration and reuse the installed icon system. Do not add a second icon family for a new page.
- When @lucide/vue is installed, use named imports, consistent 20px icons and 2px strokes (16px in compact controls). Keep lucideUniapp() from shadcn-uniapp/vite before uni() for miniapps. Do not replace configured icons with wd-icon font mappings, emoji or custom SVG.
- If Lucide is not configured, preserve existing icons. Ask before changing the project icon system. Decorative icons should be hidden from assistive technology; icon-only actions need an accessible name.

## Before completing a page

1. Identify the shared components or installed blocks being reused; change a shared primitive when the same problem appears in several places.
2. Verify the requested interaction, validation and loading/error/empty states, not only the initial screenshot.
3. Check a narrow phone viewport, a wider viewport and both color modes for wrapping, clipping, spacing and contrast.
4. Run the project's relevant type/build checks. Verify miniapp behavior on the intended runtime when available; report real-device checks separately from compilation.
5. Keep this guide current when the project deliberately changes its design rules. Routine business pages should follow it without redesigning the UI.
`
