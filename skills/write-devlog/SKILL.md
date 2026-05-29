---
name: write-devlog
description: |
  Write or update this repository's Dev Log task files.
  Use when asked to:
  "写 devlog", "记录 devlog", "补 devlog", "write devlog",
  "add devlog", "update devlog", "记录开发日志", "沉淀开发记录".
---

# Write Dev Log

Use this skill to create or update task-based development logs in `devlog/`.

## Workflow

1. **Inspect current state** — Read `devlog/README.md` and list existing `devlog/*.md` files before editing. If the user mentions files changed recently, read those files first.
2. **Choose the task number** — Use the highest existing numbered task file plus one. Do not trust stale examples inside older logs.
3. **Create the task file** — Use `devlog/<number>.<slug>.md` with the current date and a concise Chinese task title.
4. **Update the index** — Add exactly one index entry in `devlog/README.md` and update the “next task” example to the following number.
5. **Validate** — Run focused checks for Markdown diagnostics, file presence, numbering, and stale references.

## Task File Template

````markdown
# YYYY-MM-DD: 任务标题

## 目标

- ...

## 最终改动

- ...

## 关键决策

- ...

## 验证记录

通过：

```bash
command
```

结果：...

## 后续方向

1. ...
````

`后续方向` 是可选章节；只有存在明确后续工作时才写。

## Writing Rules

- Write for future maintainers, not as a chat transcript.
- Keep final facts, important decisions, validation results, and useful follow-up context.
- Remove or compress obsolete intermediate states. If an obsolete state explains a decision, mark it clearly as an old plan.
- Do not leave unverified claims in the final file. Replace `待验证` before finishing the task.
- Keep `devlog/README.md` as an index only; do not append long task bodies there.
- `devlog/` is source-only documentation and must not be copied into `entry/`.

## Validation Checklist

- `devlog/README.md` points to the new task file.
- The next-number example in `devlog/README.md` matches the new maximum plus one.
- The new task file has `目标`, `最终改动`, `关键决策`, and `验证记录` sections.
- Markdown diagnostics are clean for changed Dev Log files.
- Search results do not show stale filenames, stale next numbers, or active links to deleted docs.
- If publish output might be affected, verify `entry/` still contains only intended Markdown files.