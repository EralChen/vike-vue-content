# Development Workflow

## Vike App 验证发布包

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
pnpm --filter @vike-vue-content/vike update vike-vue-content
pnpm -C vike run build
```

如果只验证 npm 包内容：

```bash
cd entry
npm pack --dry-run
```

## pnpm file dependency 刷新

`vike` 通过 `file:../entry` 消费发布包。新增 `entry/` 输出目录后，如果 pnpm 虚拟 store 复用旧内容，可能出现 `entry/package.json` 已有导出但安装态目录缺文件的情况。

可靠刷新命令：

```bash
pnpm --filter @vike-vue-content/vike update vike-vue-content
```

## 开发记录要求

每次开发完成一个小闭环后，在 [../devlog/](../devlog/) 中创建下一个编号文件，并更新 [../devlog/README.md](../devlog/README.md) 索引。例如当前最大编号是 `10.`，下一个任务写入 `devlog/11.<slug>.md`。

每个任务文件至少记录：

- 日期
- 目标
- 改动文件
- 关键决策
- 执行过的命令
- 验证结果
- 未解决问题
- 下一步

如果验证失败，也要记录失败信号和当前缩小到的范围。失败记录不是噪音，它是后续继续推进的上下文。[../devlog/README.md](../devlog/README.md) 只维护索引，不追加长篇任务正文。

## 前端验收分工

代码侧负责构建、包产物、运行时导入和可自动化验证。浏览器里的最终视觉效果、交互手感和截图验收由用户协助确认，除非明确要求自动化浏览器验证。