# Development

这组文档面向接手 vike-vue-content 的开发者，说明仓库结构、构建链路、发布产物约定、内容管线和每次开发必须记录的内容。

## 文档地图

- [repository.md](repository.md)：目录职责和源码边界。
- [package-build.md](package-build.md)：`entry/` 生成规则、导出规则、config 包约定和发布内容检查。
- [content-pipeline.md](content-pipeline.md)：`query`、Comark AST、`ContentRenderer` 和 `.dev/content` 参考策略。
- [workflow.md](workflow.md)：常用验证命令、pnpm file dependency 刷新、开发日志规则和前端验收分工。
- [../devlog/README.md](../devlog/README.md)：开发记录索引；具体任务记录在 [../devlog/](../devlog/)。
- [../ROADMAP.md](../ROADMAP.md)：长期路线图和阶段目标。

## 基本原则

1. 源码优先：业务代码写在 `config/`、`query/`、`components/`、`composables/`、`shared/`、`internal/`、`vike/` 等源码目录里。
2. 不手写发布产物：`entry/` 是 `entry/build.sh` 生成出来的 npm 发布目录，除 `entry/build.sh` 和必要的包元数据外，不把它当源码目录维护。
3. 每次开发都要记录：新增能力、修改构建、验证命令、失败原因和下一步都写进 [../devlog/](../devlog/) 的下一个编号文件，并更新 [../devlog/README.md](../devlog/README.md) 索引。
4. 当前能力和目标能力分开写：README 只承诺当前可用能力，长期设计放到 [../ROADMAP.md](../ROADMAP.md)。

## 入口约定

本目录就是开发者文档入口。新增开发者说明优先放到本目录，按主题拆文件。

`entry/` 只同步根 [../README.md](../README.md) 和 [../LICENSE](../LICENSE)。本目录不会进入 npm 发布产物。