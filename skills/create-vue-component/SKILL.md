---
name: create-vue-component
description: |
  Create a new Vue component for the component library.
  Use when asked to:
  "create component", "add component", "new component",
  "create vue component", "add vue component", "scaffold component",
  "创建组件", "添加组件", "新建组件".
---

# Create Vue Component

Create a new Vue component following the project's component library conventions.

## Workflow

1. **Validate** — Confirm component name and check for conflicts.
2. **Scaffold** — Create the directory structure and all required files.
3. **Verify** — Ensure the component is properly structured.

---

## Component Directory Structure

Every component lives under `components/<component-name>/` with this exact layout:

```
components/
└── <component-name>/
    ├── index.ts           # Entry file: exports component + types
    └── src/
        ├── index.vue      # Vue SFC (Single File Component)
        ├── ctx.ts         # Props and emits definitions
        └── types.ts       # TypeScript type definitions
```

**Naming convention**: directory name must be `kebab-case` (e.g., `my-button`, `data-table`, `icon-renderer`).

---

## File Templates

### 1. `index.ts` — Entry File

```typescript
import <PascalName> from './src/index.vue'
export type * as __<PascalName> from './src/types'
export { <PascalName> }
export default <PascalName>
```

**Rules:**
- Import the Vue component from `./src/index.vue`
- Re-export types with `export type * as __<PascalName>` (double underscore prefix, PascalCase name)
- Named export + default export of the component
- `<PascalName>` is the PascalCase version of the directory name (e.g., `hello-world` → `Hello`)

---

### 2. `src/types.ts` — Type Definitions

```typescript
// Define all public types, interfaces, and enums for this component
// These types are exported via index.ts and available to consumers

export interface <InterfaceName> {
  // ...
}
```

**Rules:**
- Only types that consumers need (event payloads, configuration objects, etc.)
- Keep internal types private — do not export them here
- Use `interface` for object shapes, `type` for unions/aliases

---

### 3. `src/ctx.ts` — Props & Emits Definition

```typescript
import type { PropType } from 'vue'
// Import types from ./types.ts

export const props = {
  propName: {
    type: <Type> as PropType<<Type>>,
    default: <defaultValue>
  },
  // ...
}

export const emits = {
  eventName: (payload: <PayloadType>) => true
}
```

**Rules:**
- Export `props` object (not `defineProps` call — that happens in the SFC)
- Export `emits` object with validator functions
- Import `PropType` from `vue` for complex types
- Import custom types from `./types`
- Every prop must have a `type` and `default` (unless required)

---

### 4. `src/index.vue` — Vue Component

```vue
<script lang="ts" setup>
import { props as dprops, emits } from './ctx'
const props = defineProps(dprops)
const emit = defineEmits(emits)

// Component logic here
</script>

<template>
  <!-- Template here -->
</template>
```

**Rules:**
- Always use `<script lang="ts" setup>`
- Import `props` (aliased as `dprops`) and `emits` from `./ctx`
- Use `defineProps(dprops)` and `defineEmits(emits)` — do NOT define props/emits inline
- Keep template clean and semantic
- Use `emit()` for all custom events

---

## Step-by-Step Process

### Step 1: Validate Component Name

1. Accept the component name from the user
2. Convert to `kebab-case` for the directory name
3. Convert to `PascalCase` for the TypeScript class name
4. Check that `components/<name>/` does not already exist

### Step 2: Create Files

Create all 4 files in order:

1. `components/<name>/src/types.ts`
2. `components/<name>/src/ctx.ts`
3. `components/<name>/src/index.vue`
4. `components/<name>/index.ts`

### Step 3: Verify

- Confirm all files exist
- Check imports resolve correctly
- Validate TypeScript syntax

---

## Example: `hello-world`

**Directory:** `components/hello-world/`

**`index.ts`:**
```typescript
import Hello from './src/index.vue'
export type * as __Hello from './src/types'
export { Hello }
export default Hello
```

**`src/types.ts`:**
```typescript
export type Theme = 'light' | 'dark'

export interface ClickEvent {
  event: MouseEvent
  name: string
}
```

**`src/ctx.ts`:**
```typescript
import type { PropType } from 'vue'
import type { Theme, ClickEvent } from './types'

export const props = {
  name: {
    type: String,
    default: 'World'
  },
  theme: {
    type: String as PropType<Theme>,
    default: 'light'
  }
}

export const emits = {
  click: (e: ClickEvent) => true
}
```

**`src/index.vue`:**
```vue
<script lang="ts" setup>
import { computed } from 'vue'
import { props as dprops, emits } from './ctx'
const props = defineProps(dprops)
const emit = defineEmits(emits)
const data = computed(() => `Hello, ${props.name}!`)
</script>

<template>
  <div
    @click="emit('click', { name: name, event: $event })"
    :style="{
      color: props.theme === 'light' ? '#000' : '#fff',
      backgroundColor: props.theme === 'light' ? '#fff' : '#333',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer'
    }"
  >{{ data }}</div>
</template>
```

---

## Notes

- This skill is for `components/` package only (Vue lib components)
- For `composables/` or `shared/` packages, use different conventions
- Components are built via `vite build` in the `components/` package
- Type declarations are generated via `vue-tsc`
- After creating, the component will be auto-discovered by the build system via `*/index.{ts,tsx}` glob pattern
