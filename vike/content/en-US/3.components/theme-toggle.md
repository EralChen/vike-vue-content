---
title: ThemeToggle
description: Theme mode toggle button that switches between light and dark, with View Transitions when supported.
---

# ThemeToggle

A theme mode toggle button component.

```ts
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle'
```

`ThemeToggle` uses `useTheme()` internally. Clicking it switches the current theme mode between `light` and `dark`, then syncs both the root element styles and `localStorage['vvc-theme']`.

## Usage

```vue
<script setup>
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle'
</script>

<template>
  <ThemeToggle />
</template>
```

## Behavior

- Shows a sun icon in light mode, and clicking switches to dark mode
- Shows a moon icon in dark mode, and clicking switches to light mode
- Exposes no extra props; forwarded HTML attributes land on the root button
- If the browser supports `document.startViewTransition()` and the user has not enabled reduced motion, it plays a circular reveal transition
- If View Transitions are not supported, it switches immediately

## Dependencies

`ThemeToggle` expects the theme system to be wired in:

- `vike-vue-content/config` is extended in the page config
- `vike-vue-content/index.css` is imported in the layout

Without that setup, the button can still change the stored client state, but the page may not reflect the full themed styling.
