---
title: 安装与接入
description: 在 Vike 项目中接入 vike-vue-content 并渲染内容。
---

# 安装与接入

在 Vike + Vue 项目中接入内容能力。

## 安装

```bash
pnpm add vike-vue-content
```

## 接入 config

```ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'

export default {
  extends: [vikeVue, vikeVueContent],
}
```

## 渲染内容

把 `content/docs/**/*.md` 放进内容目录，访问对应路径即可看到本页这样的渲染结果。
