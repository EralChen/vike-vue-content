---
title: 内容驱动路由
description: content 目录如何自动映射为 Vike 页面路由。
---

# 内容驱动路由

`content/docs/**/*.md` 会按目录结构映射为页面路由：

| 内容文件 | 访问路径 |
| --- | --- |
| `content/docs/index.md` | `/docs` |
| `content/docs/getting-started.md` | `/docs/getting-started` |
| `content/docs/guide/routing.md` | `/docs/guide/routing` |

本页位于嵌套目录 `guide/`，用来验证多层级路由可以正常工作。
