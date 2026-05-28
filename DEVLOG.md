# Dev Log

开发记录用于沉淀每次具体推进。每次改动都要把目标、文件、命令、验证结果和未解决问题写清楚，方便下一次直接接着做。

## 2026-05-28: README、Roadmap、Config 入口与 Vike 消费端验证

### 目标

- 把 README 改成面向 npm 使用者的入口。
- 新增路线图，承载 vike-vue-content 的长期工程愿景。
- 新增真实的 `vike-vue-content/config` 源码包。
- 让 `vike/` 应用通过 `file:../entry` 消费打包后的发布包。

### 改动

- 更新 `README.md`：说明 early-stage 状态、安装方式、当前导出、Vike 集成和开发状态。
- 新增 `ROADMAP.md`：拆分产品目标、Phase 1-4、近期优先级和非目标。
- 新增 `config/` 包：包含 `package.json`、`tsconfig.json`、`vite.config.ts`、`+config.ts`。
- 更新 `entry/build.sh`：把 `config` 纳入源码包构建；支持 `+config.js` 生成 `./config` 导出；同步 `ROADMAP.md` 到 `entry/`。
- 更新 `entry/package.json`：构建后包含 `type: "module"` 和 `exports["./config"] -> ./config/+config.js`。
- 更新 `pnpm-workspace.yaml`：把 `config` 加入 workspace。
- 更新 `vike/package.json`：添加 `vike-vue-content: file:../entry`。
- 更新 `vike/pages/+config.ts`：在 `extends` 中加入 `vikeVueContent`。

### 关键决策

- `entry/` 是构建结果，不作为主要源码目录手写维护。
- `config` 包采用 vike-vue 的 `+config` 入口约定，而不是 `index.es.js` 入口。
- `vike-vue-content/config` 当前只导出最小 Vike extension 元数据：`name` 和 `require.vike`。
- `config/+config.ts` 暂时不直接 import `vike/types`，因为单包类型构建时无法解析该依赖；后续可以在依赖关系清晰后恢复更强类型约束。

### 参考材料

- `.dev/vike-vue/packages/vike-vue/dist/+config.js`
- `.dev/vike-vue/packages/vike-vue/dist/+config.d.ts`
- `.dev/vike-vue/packages/vike-vue/package.json`
- `.dev/vike-vue/packages/vike-vue/src/+config.ts`

### 验证记录

通过：

```bash
pnpm -C config run build
```

结果：生成 `config/dist/+config.js` 和 `config/dist/+config.d.ts`。

通过：

```bash
pnpm -C entry run build
```

结果：生成 `entry/config/+config.js`、`entry/config/+config.d.ts`，并自动更新 `entry/package.json` 的 `exports`。

通过：

```bash
cd entry
npm pack --dry-run
```

结果：发布包包含 `config/+config.js`、`config/+config.d.ts`、`README.md`、`ROADMAP.md` 和 `package.json`。

通过：

```bash
node -e "import config from './entry/config/+config.js'; console.log(JSON.stringify(config, null, 2));"
```

结果：可以导入默认导出，值为：

```json
{
  "name": "vike-vue-content",
  "require": {
    "vike": ">=0.4.191"
  }
}
```

通过：

```bash
pnpm install --lockfile-only
```

结果：锁文件更新成功，`vike` 可通过 file dependency 指向 `entry`。

失败：

```bash
pnpm -C vike run build
```

失败信号：

```txt
[vike@0.4.259][Bug] You stumbled upon a Vike bug.
loadFileAtConfigTime.js:80
```

当前判断：失败发生在 Vike 解析 config file/extends 阶段。需要继续缩小是 `file:../entry` 包解析、`exports["./config"]` 条件、还是 Vike extension 对象形状触发。

### 下一步

1. 用最小隔离方式测试 `vike-vue-content/config` 是否能被 Vike 的 config-time loader 正常加载。
2. 对比 `vike-vue/config` 的包导出形状，确认是否需要让 `exports["./config"]` 直接是字符串而不是 `{ import, types }` 对象。
3. 如果 Vike 对 config extension 需要更完整字段，再从 `vike-vue/src/+config.ts` 里提炼最小可接受对象。
4. 每次后续推进继续追加本文件，不把调试上下文留在聊天里。

## 2026-05-28: 建立开发者文档和开发记录规范

### 目标

- 为开发者建立系统性的工程阅读入口。
- 规定后续每次开发都要把具体过程写入仓库文档。

### 改动

- 新增 `DEVELOPMENT.md`：说明目录职责、config 包约定、构建链路、导出规则、Vike app 验证方式和开发记录要求。
- 新增 `DEVLOG.md`：用结构化格式记录本轮开发事实。
- 更新 `README.md`：增加 `DEVELOPMENT.md` 和 `DEVLOG.md` 入口。
- 更新 `entry/build.sh`：曾同步 `DEVELOPMENT.md` 和 `DEVLOG.md` 到 `entry/`，后续已按发布目录规则撤销，`entry/` 只保留 `README.md`。

### 验证记录

通过：

```bash
pnpm -C entry run build
```

结果：当时 `DEVELOPMENT.md` 和 `DEVLOG.md` 被复制到 `entry/`，原有 `./config` 导出仍指向 `./config/+config.js`。后续规则已调整为不再复制这些文档。

通过：

```bash
cd entry
npm pack --dry-run
```

结果：当时发布包包含 `DEVELOPMENT.md`、`DEVLOG.md`、`README.md`、`ROADMAP.md`、`config/+config.js` 和 `config/+config.d.ts`。后续规则已调整为除 `README.md` 外其他 Markdown 不进入 `entry/`。

### 下一步

每次后续开发结束前都要追加本文件，至少写清目标、改动、命令、结果、失败点和下一步。

## 2026-05-28: 定位 Vike config-time loader 失败原因

### 目标

- 解释 `pnpm -C vike run build` 中 Vike 在 `loadFileAtConfigTime.js:80` 报内部 bug 的真实原因。
- 让 `vike-vue-content/config` 能被 Vike 的 config-time resolver 解析。

### 发现

Vike 读取用户的 `+config.ts` 时，会把 `import vikeVueContent from 'vike-vue-content/config'` 转成 pointer import 字符串。随后 `loadExtendsConfigs()` 调用 `resolvePointerImportData()`，内部通过 Node 的 `require.resolve()` 解析这个包导出。

当 `entry/package.json` 中的导出是：

```json
"./config": {
  "import": "./config/+config.js",
  "types": "./config/+config.d.ts"
}
```

Node 的 `require.resolve('vike-vue-content/config')` 不会选择 `import` 条件，因此报：

```txt
ERR_PACKAGE_PATH_NOT_EXPORTED: Package subpath './config' is not defined by "exports"
```

Vike 没有把这个底层解析失败包装成 usage error，而是在 `loadFileAtConfigTime.js:80` 的内部断言处报成 `[vike][Bug]`。

### 改动

- 更新 `entry/build.sh`：对 `+config.js` 入口生成字符串导出 `"./config": "./config/+config.js"`，对齐 `vike-vue` 的 `exports["./config"]` 形状。
- 更新 `DEVELOPMENT.md`：记录为什么 `+config.js` 不能只用 `import/types` 条件对象。

### 验证记录

通过：

```bash
pnpm -C entry run build
```

结果：`entry/package.json` 重新生成，`exports["./config"]` 保持为字符串导出：

```json
"./config": "./config/+config.js"
```

通过：

```bash
pnpm install --lockfile-only
```

结果：file dependency 状态已同步。

通过：

```bash
cd vike
node -e "console.log(require.resolve('vike-vue-content/config'))"
```

结果：成功解析到 file 依赖安装态中的 config 文件：

```txt
D:\labCode\platform-template\node_modules\.pnpm\vike-vue-content@file+entry\node_modules\vike-vue-content\config\+config.js
```

通过：

```bash
pnpm -C vike run build
```

结果：Vike client build 和 SSR build 都成功。构建过程中有两个来自 `@vueuse/core` 的非致命 `INVALID_ANNOTATION` 警告，但 exit code 为 0。

### 结论

Vike app 通过 `file:../entry` 消费打包后的 `vike-vue-content/config` 已验证成功。此前的 Vike 内部 bug 报错不是 config 对象内容问题，而是 `exports["./config"]` 的条件对象形状无法被 Vike config-time loader 使用的 `require.resolve()` 解析。

## 2026-05-28: 收敛 entry 发布文档

### 目标

- `entry/` 是 npm 发布目录，除 `README.md` 外，其他 Markdown 文档不进入 `entry/`。
- 开发者文档和开发日志只保留在仓库根目录。

### 改动

- 更新 `entry/build.sh`：文档同步列表从 `README.md`、`ROADMAP.md`、`DEVELOPMENT.md`、`DEVLOG.md`、`LICENSE` 收敛为 `README.md`、`LICENSE`。
- 更新 `DEVELOPMENT.md`：明确 `ROADMAP.md`、`DEVELOPMENT.md`、`DEVLOG.md` 不进入 `entry/`。
- 删除生成产物 `entry/ROADMAP.md`、`entry/DEVELOPMENT.md`、`entry/DEVLOG.md`。

### 验证记录

通过：

```bash
pnpm -C entry run build
```

结果：构建成功，docs step 只同步 `README.md` 和 `LICENSE`。

通过：

```bash
find entry -name "*.md"
```

结果：`entry/` 下只剩 `entry/README.md`，没有 `entry/ROADMAP.md`、`entry/DEVELOPMENT.md`、`entry/DEVLOG.md`。

通过：

```bash
cd entry
npm pack --dry-run
```

结果：npm pack 包含 `README.md`，不包含 `ROADMAP.md`、`DEVELOPMENT.md`、`DEVLOG.md`。