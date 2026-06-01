# Dev Log

开发记录只保留对当前仓库仍有解释价值的事实条目。过程性规范、已被替代的实现路径和误导性的“下一步”在清理时直接删除，不做历史存档展示。

## 记录规则

1. 新任务接着当前最大编号继续写；清理旧条目后允许编号出现缺口，缺口不回填。
2. 每个任务文件只保留事实：当前标准、关键决策、验证结果和仍然存在的边界。
3. 已被后续任务推翻的实现方式直接删掉；只有在解释当前标准不可缺省时，才允许简短提及旧方案。
4. 本文件只维护保留下来的事实索引，不追加长篇任务正文。

## 任务索引

1. [建立 README、Roadmap、Config 与 Vike 消费端基础](1.readme-roadmap-config-vike.md)
3. [定位 Vike config-time loader 失败原因](3.vike-config-loader.md)
4. [收敛 entry 发布文档](4.entry-docs-policy.md)
5. [建立最小内容闭环](5.content-mvp.md)
6. [拆分 query 运行时入口](6.query-entry-split.md)
7. [切换到 Comark AST 与 Vue 渲染闭环](7.comark-ast-renderer.md)
14. [删除 docs.base，收敛零参数 docs 锚点](14.docs-base-removal-and-zero-arg-anchors.md)
15. [收敛 docs 内容配置、导航与重定向标准](15.docs-content-config-and-redirects-standard.md)
16. [建立 shared/types 公共类型入口](16.shared-public-types-entry.md)
