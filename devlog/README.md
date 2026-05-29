# Dev Log

开发记录按任务拆分管理。每个任务一个文件，文件名前缀使用递增序号：`1.`、`2.`、`3.`。

## 记录规则

1. 新任务接着当前最大编号继续写，例如下一个任务使用 `13.<slug>.md`。
2. 每个任务文件只保留对后来者有用的信息：目标、最终改动、关键决策、验证结果和后续方向。
3. 已被后续任务推翻的中间状态只在有必要解释决策时简短提及，不保留流水账和误导性“下一步”。
4. 本文件只维护索引，不追加长篇任务正文。

## 任务索引

1. [建立 README、Roadmap、Config 与 Vike 消费端基础](1.readme-roadmap-config-vike.md)
2. [建立工程文档与记录规范](2.developer-docs-and-devlog.md)
3. [定位 Vike config-time loader 失败原因](3.vike-config-loader.md)
4. [收敛 entry 发布文档](4.entry-docs-policy.md)
5. [建立最小内容闭环](5.content-mvp.md)
6. [拆分 query 运行时入口](6.query-entry-split.md)
7. [切换到 Comark AST 与 Vue 渲染闭环](7.comark-ast-renderer.md)
8. [拆分开发者文档目录](8.development-docs-folder.md)
9. [拆分 Dev Log 为任务文件](9.devlog-task-files.md)
10. [沉淀 Dev Log 写作 Skill](10.write-devlog-skill.md)
11. [内容驱动路由闭环](11.content-driven-routing.md)
12. [内容驱动路由的静态预渲染与 contentDir 解析修复](12.prerender-and-contentdir.md)
