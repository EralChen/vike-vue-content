# Repository Structure

## 目录职责

| 目录 | 职责 |
| --- | --- |
| `config/` | `vike-vue-content/config` 的源码包，遵循 vike-vue 的 `+config` 入口约定。 |
| `query/` | `vike-vue-content/query` 的源码包，提供内容扫描、frontmatter 解析、Comark AST 和最小查询 API。 |
| `components/` | Vue 组件源码包，每个一级目录下的 `index.ts` 会构建为一个导出入口。 |
| `composables/` | Vue composables 源码包，每个一级目录下的 `index.ts` 会构建为一个导出入口。 |
| `shared/` | 共享类型和工具源码包。 |
| `internal/` | 构建辅助、包名常量、外部依赖声明和内部插件。 |
| `entry/` | npm 发布目录，由源码包构建产物和根 README 同步生成。 |
| `vike/` | 本仓库内的 Vike 消费端应用，用来验证打包后的 `vike-vue-content`。 |
| `docs/` | Nuxt 文档站相关内容，可作为文档产品体验参考。 |
| `development/` | 开发者文档目录。 |
| `.dev/` | 本地参考源码，例如 vike、vike-vue、Nuxt Content。 |

## 源码边界

- 功能源码放在源码包目录，不直接写到 `entry/`。
- `entry/` 中的包内容通过构建生成；如果需要修改发布内容，改源包或 `entry/build.sh`。
- `vike/` 是真实消费者应用，应通过 `file:../entry` 消费打包后的发布包，不直接引用源码包。