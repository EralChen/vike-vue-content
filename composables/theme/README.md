# Theme Composables

Vue composables for the client-side theme state. Theme tokens, presets, compilers,
and export helpers live in `@vike-vue-content/theme`.

## Exports

```ts
export { useTheme } from './useTheme'
export { useThemeStorage } from './useThemeStorage'
```

## Usage

```vue
<script setup lang="ts">
import { useTheme } from '@vike-vue-content/composables/theme'
import { primaryColors } from '@vike-vue-content/theme'

const { primary, mode, isDark, resetTheme } = useTheme()
</script>
```

The Vike integration reads `pageContext.config.theme`, `pageContext.config.themes`,
and `pageContext.config.appearance` as the default runtime theme. User changes are
stored in `localStorage` under `vvc-theme`.
