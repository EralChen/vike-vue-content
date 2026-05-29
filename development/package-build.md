# Package Build

## 构建链路

入口命令：

```bash
pnpm -C entry run build
```

构建过程：

1. `entry/build.sh` 并行构建 `config`、`query`、`components`、`composables`、`shared`。
2. 每个源码包输出到自己的 `dist/`。
3. 脚本把各源码包的 `dist/` 复制到 `entry/<package>/`。
4. 脚本扫描 `entry/`，自动重写 `entry/package.json` 的 `exports`。
5. 脚本同步根目录 `README.md` 和 `LICENSE` 到 `entry/`。

## 发布目录规则

当前同步到 `entry/` 的根文件：

- `README.md`
- `LICENSE`

除 `README.md` 外，其他 Markdown 文档不进入 `entry/`。`ROADMAP.md`、`development/` 和 `devlog/` 只保留在源码仓库，作为工程上下文。

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

## 导出规则

`entry/build.sh` 目前支持两类导出：

- `+config.js`：如果某个包根目录存在 `+config.js`，生成 `./<package>` 导出。例如 `entry/config/+config.js` 生成 `vike-vue-content/config`。
- `index.es.js`：如果某个目录存在 `index.es.js`，生成对应目录导出。例如 `entry/components/hello-world/index.es.js` 生成 `vike-vue-content/components/hello-world`。

`+config.js` 导出必须使用字符串映射，而不是只包含 `import/types` 的条件对象。Vike 的 config-time loader 会通过 Node 的 `require.resolve()` 解析 extension config；如果只有 `import` 条件，`require.resolve('vike-vue-content/config')` 会报 `ERR_PACKAGE_PATH_NOT_EXPORTED`。

新增源码包或导出入口时，先确认它符合这两类规则；不符合时再扩展构建脚本。

## 依赖合并

`entry/build.sh` 会读取各源码包 `package.json` 的 `dependencies`，合并进 `entry/package.json`。例如：

- `query/package.json` 的 `comark`
- `components/package.json` 的 `@comark/vue` 和 `comark`

组件包应该把大型运行时依赖标记为 external，再通过发布包 dependencies 提供。