# Development

这份文档面向接手 vike-vue-content 的开发者，说明仓库结构、构建链路、发布产物约定和每次开发必须记录的内容。

## 基本原则

1. 源码优先：业务代码写在 `config/`、`components/`、`composables/`、`shared/`、`internal/`、`vike/` 等源码目录里。
2. 不手写发布产物：`entry/` 是 `entry/build.sh` 生成出来的 npm 发布目录，除 `entry/build.sh` 和必要的包元数据外，不把它当源码目录维护。
3. 每次开发都要记录：新增能力、修改构建、验证命令、失败原因和下一步都写进 [DEVLOG.md](DEVLOG.md)。
4. 当前能力和目标能力分开写：README 只承诺当前可用能力，长期设计放到 [ROADMAP.md](ROADMAP.md)。

## 目录职责

| 目录 | 职责 |
| --- | --- |
| `config/` | `vike-vue-content/config` 的源码包，遵循 vike-vue 的 `+config` 入口约定。 |
| `components/` | Vue 组件源码包，每个一级目录下的 `index.ts` 会构建为一个导出入口。 |
| `composables/` | Vue composables 源码包，每个一级目录下的 `index.ts` 会构建为一个导出入口。 |
| `shared/` | 共享类型和工具源码包。 |
| `internal/` | 构建辅助、包名常量、外部依赖声明和内部插件。 |
| `entry/` | npm 发布目录，由源码包构建产物和根 README 同步生成。 |
| `vike/` | 本仓库内的 Vike 消费端应用，用来验证打包后的 `vike-vue-content`。 |
| `docs/` | Nuxt 文档站相关内容，可作为文档产品体验参考。 |
| `.dev/` | 本地参考源码，例如 vike、vike-vue、Nuxt Content。 |

## Config 包约定

`config/` 负责生成 `vike-vue-content/config`。

源码入口：

```txt
config/+config.ts
```

构建产物：

```txt
entry/config/+config.js
entry/config/+config.d.ts
```

发布导出：

```json
{
  "exports": {
    "./config": "./config/+config.js"
  }
}
```

这个形状参考 `vike-vue` 的发布产物：`.dev/vike-vue/packages/vike-vue/dist/+config.js` 和 `.dev/vike-vue/packages/vike-vue/package.json` 的 `exports["./config"]`。

当前 `config/+config.ts` 只导出最小 Vike extension 元数据：

```ts
const config = {
  name: 'vike-vue-content',
  require: {
    vike: '>=0.4.191',
  },
}
```

后续 Markdown 内容管线、路由生成和查询 API 都应该挂载到这个入口上。

## 构建链路

入口命令：

```bash
pnpm -C entry run build
```

构建过程：

1. `entry/build.sh` 并行构建 `config`、`components`、`composables`、`shared`。
2. 每个源码包输出到自己的 `dist/`。
3. 脚本把各源码包的 `dist/` 复制到 `entry/<package>/`。
4. 脚本扫描 `entry/`，自动重写 `entry/package.json` 的 `exports`。
5. 脚本同步根目录 `README.md` 到 `entry/`，用于 npm 发布包。

当前同步到 `entry/` 的根文件：

- `README.md`
- `LICENSE`

除 `README.md` 外，其他 Markdown 文档不进入 `entry/`。`ROADMAP.md`、`DEVELOPMENT.md`、`DEVLOG.md` 只保留在仓库根目录，作为源码仓库的工程上下文。

## 导出规则

`entry/build.sh` 目前支持两类导出：

- `+config.js`：如果某个包根目录存在 `+config.js`，生成 `./<package>` 导出。例如 `entry/config/+config.js` 生成 `vike-vue-content/config`。
- `index.es.js`：如果某个目录存在 `index.es.js`，生成对应目录导出。例如 `entry/components/hello-world/index.es.js` 生成 `vike-vue-content/components/hello-world`。

`+config.js` 导出必须使用字符串映射，而不是只包含 `import/types` 的条件对象。Vike 的 config-time loader 会通过 Node 的 `require.resolve()` 解析 extension config；如果只有 `import` 条件，`require.resolve('vike-vue-content/config')` 会报 `ERR_PACKAGE_PATH_NOT_EXPORTED`。

新增源码包或导出入口时，先确认它符合这两类规则；不符合时再扩展构建脚本。

## 使用 Vike App 验证发布包

`vike/` 是真实消费者应用，不应该直接引用源码包。它通过 pnpm file dependency 消费打包后的 `entry/`：

```json
{
  "dependencies": {
    "vike-vue-content": "file:../entry"
  }
}
```

Vike config 接入方式：

```ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'

export default {
  extends: [vikeVue, vikeVueContent],
}
```

验证顺序：

```bash
pnpm -C entry run build
pnpm install --lockfile-only
pnpm -C vike run build
```

如果只验证 npm 包内容：

```bash
cd entry
npm pack --dry-run
```

## 开发记录要求

每次开发完成一个小闭环后，更新 [DEVLOG.md](DEVLOG.md)。至少记录：

- 日期
- 目标
- 改动文件
- 关键决策
- 执行过的命令
- 验证结果
- 未解决问题
- 下一步

如果验证失败，也要记录失败信号和当前缩小到的范围。失败记录不是噪音，它是后续继续推进的上下文。