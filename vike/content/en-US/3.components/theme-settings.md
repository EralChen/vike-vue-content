---
title: ThemeSettings
description: Full theme panel for Primary, Neutral, Radius, Font, Color Mode, and export.
---

# ThemeSettings

A full theme panel component.

```ts
import { ThemeSettings } from 'vike-vue-content/components/theme-settings'
```

`ThemeSettings` is built on top of `useTheme()` and reads/writes the active theme state directly.

Conceptually, it is a client-side override layer on top of the defaults defined in `+config.ts`:

- on first load, defaults come from `theme`, `themes`, and `appearance`
- user changes in the panel are stored in `localStorage['vvc-theme']`
- clicking the reset button drops that client override and goes back to the defaults from `+config.ts`

## Usage

```vue
<script setup>
import { ThemeSettings } from 'vike-vue-content/components/theme-settings'
</script>

<template>
  <ThemeSettings />
</template>
```

## Capabilities

- choose a Primary preset
- enter a raw hex Primary such as `#0066cc`
- choose a Neutral preset
- choose a Radius preset
- choose a Font preset
- switch between `light`, `dark`, and `system`
- export CSS for the current theme
- export a `vike-theme.json` that can be pasted back into `themes`
- reset back to the default theme from `+config.ts`

## Behavior

- Exposes no extra props; forwarded HTML attributes land on the root element
- Primary accepts either named presets or raw hex; raw hex values generate a light/dark ramp automatically
- Neutral currently uses named presets and expands into semantic variables such as `muted`, `bg`, `surface`, `text`, and `border`
- Theme changes are applied immediately to `document.documentElement`
- User changes are persisted to `localStorage['vvc-theme']`
- Clicking reset removes that user override and reuses `theme/themes/appearance` from `+config.ts`

## Reverting to `+config.ts`

If you want the user to go back to the site defaults, there are two ways:

- click the reset button at the bottom of `ThemeSettings`
- manually clear `localStorage['vvc-theme']`

After that, runtime resolution falls back to the Vike page config defaults:

```ts
export default {
  extends: [vikeVue, vikeVueContent],
  theme: 'brand',
  themes: [brand],
  appearance: 'system'
}
```

In other words, `ThemeSettings` does not rewrite `+config.ts`; it only overrides it on the client.

## Export

The panel footer contains two export buttons:

- `main.css`: exports the current theme as CSS variables
- `vike-theme.json`: exports the normalized theme object

The exported JSON can be used directly as a theme object inside `themes`.

## Dependencies

`ThemeSettings` expects the theme system to be wired in:

- `vike-vue-content/config` is extended in the page config
- `vike-vue-content/index.css` is imported in the layout

For the lower-level theme model, see [Theme System](/en-US/guide/theme).
