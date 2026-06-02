# 主题系统架构

本文档描述了 vike-vue-content 项目的主题定制系统架构。

## 目录结构

```
composables/
└── theme/
    ├── index.ts              # 类型定义、预设值、导出
    ├── useTheme.ts           # 主题应用组合式函数
    ├── useThemeStorage.ts    # 主题存储组合式函数
    └── README.md             # 使用文档

components/
├── theme-toggle/
│   ├── index.ts              # 组件入口
│   ├── README.md             # 使用文档
│   └── src/
│       ├── index.vue         # 主题切换按钮组件
│       ├── ctx.ts            # Props 和 Emits 定义
│       └── types.ts          # 类型定义
│
└── theme-settings/
    ├── index.ts              # 组件入口
    ├── README.md             # 使用文档
    └── src/
        ├── index.vue         # 主题设置面板组件
        ├── ctx.ts            # Props 和 Emits 定义
        └── types.ts          # 类型定义
```

## 架构设计

### 1. Composables 层 (`@vike-vue-content/composables/theme`)

负责主题的核心逻辑：

- **useTheme()**: 主要的主题组合式函数
  - 管理主题状态
  - 应用 CSS 变量
  - 处理深色模式切换
  - 监听系统主题变化

- **useThemeStorage()**: 主题持久化组合式函数
  - 使用 localStorage 存储主题配置
  - 提供主题更新方法

### 2. Components 层 (`@vike-vue-content/components`)

提供可复用的 UI 组件：

- **ThemeToggle**: 简单的主题切换按钮
  - 点击切换深色/浅色/系统模式
  - 显示当前模式图标

- **ThemeSettings**: 完整的主题设置面板
  - 主色调选择
  - 中性色选择
  - 圆角调整
  - 字体选择
  - 一键重置

### 3. 样式层

使用 CSS 变量实现主题切换：

```css
/* 主色调变量 */
--vvc-color-primary
--vvc-color-primary-light
--vvc-color-primary-dark

/* 中性色变量 */
--vvc-color-neutral
--vvc-color-neutral-light
--vvc-color-neutral-dark

/* 布局变量 */
--vvc-radius
--vvc-font-family
```

## 使用示例

### 基本使用

```vue
<script setup>
import { ThemeToggle } from '@vike-vue-content/components/theme-toggle'
import { useTheme } from '@vike-vue-content/composables/theme'

const { theme, isDark } = useTheme()
</script>

<template>
  <header>
    <h1>我的应用</h1>
    <ThemeToggle />
  </header>
</template>
```

### 完整设置页面

```vue
<script setup>
import { ThemeSettings } from '@vike-vue-content/components/theme-settings'
</script>

<template>
  <div class="settings-page">
    <h1>主题设置</h1>
    <ThemeSettings @change="onThemeChange" />
  </div>
</template>
```

### 自定义主题

```vue
<script setup>
import { useTheme } from '@vike-vue-content/composables/theme'

const { setPrimaryColor, setRadius, setFont } = useTheme()

// 设置绿色主题
setPrimaryColor('green')

// 设置大圆角
setRadius(0.75)

// 设置字体
setFont('Roboto')
</script>
```

## 依赖关系

```
@vike-vue-content/components/theme-toggle
    └── @vike-vue-content/composables/theme

@vike-vue-content/components/theme-settings
    └── @vike-vue-content/composables/theme

@vike-vue-content/composables/theme
    └── @vueuse/core (useLocalStorage)
```

## 构建

主题系统会随组件库一起构建：

```bash
# 构建组件
pnpm run -C components build

# 构建 composables
pnpm run -C composables build
```

## 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 参考

本架构参考了 `.dev/movk-nuxt-docs` 项目的主题系统设计。