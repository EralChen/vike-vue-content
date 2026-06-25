---
name: query-trajectory
description: |
  Query the mimocode trajectory database (SQLite) for session history, tool usage, and message analysis.
  Use when asked to:
  "query trajectory", "analyze sessions", "review history", "check tool usage",
  "query mimocode.db", "trajectory analysis", "session回顾", "分析会话历史",
  "查看工具使用", "查询轨迹数据库".
---

# Query Trajectory

Query the mimocode trajectory database for session history, tool usage patterns, and message analysis.

## Platform Constraints (Windows)

This machine has critical limitations for SQLite access:

- **`sqlite3` CLI**: NOT available in PATH. Do not attempt.
- **Python**: WindowsApps stub only — produces no output. Do not use.
- **`better-sqlite3`**: Not installed and fails to compile (node-gyp error). Do not install.
- **`node:sqlite`** (Node 22+ built-in): May work but output is unreliable on this setup.
- **`sql.js`**: **The only reliable method.** Pure JS, no native compilation.

## Database Location

Dynamically resolved from home directory:

```javascript
const os = require('os');
const path = require('path');
const DB_PATH = path.join(os.homedir(), '.local', 'share', 'mimocode', 'mimocode.db');
```

## Setup (Required Before First Query)

Create a temp working directory with sql.js:

```bash
cd /tmp && mkdir -p trajectory-query && cd trajectory-query
npm init -y 2>/dev/null
npm install sql.js 2>/dev/null
```

This only needs to run once per session. The `node_modules` persist in `/tmp`.

## Query Script Template

Write a `.cjs` file (CommonJS required for `require()`) and run it with `node`:

```javascript
const initSqlJs = require('sql.js');
const fs = require('fs');
const os = require('os');
const path = require('path');

async function main() {
  const SQL = await initSqlJs();
  const dbPath = path.join(os.homedir(), '.local', 'share', 'mimocode', 'mimocode.db');
  const buf = fs.readFileSync(dbPath);
  const db = new SQL.Database(buf);

  // === YOUR QUERIES HERE ===

  // List sessions
  const sessions = db.exec("SELECT id, title, time_created FROM session ORDER BY time_created DESC");
  if (sessions.length > 0) {
    sessions[0].values.forEach(r => {
      const d = new Date(parseInt(r[2]));
      console.log(`${r[0]}  |  ${r[1]||'untitled'}  |  ${d.toISOString().slice(0,10)}`);
    });
  }

  // Tool usage summary
  const tools = db.exec(`
    SELECT json_extract(p.data, '$.tool') as tool,
           substr(json_extract(p.data, '$.state.input'), 1, 200) as input_preview,
           count(*) as n
    FROM message m
    JOIN part p ON p.message_id = m.id
    WHERE json_extract(m.data, '$.role') = 'assistant'
      AND json_extract(p.data, '$.type') = 'tool'
    GROUP BY tool, input_preview
    ORDER BY n DESC
    LIMIT 50
  `);
  if (tools.length > 0) {
    tools[0].values.forEach(r => console.log(`[${r[2]}x] ${r[0]}: ${r[1]}`));
  }

  db.close();
}

main().catch(e => console.error(e));
```

**Important**: Use `.cjs` extension, not `.mjs`. sql.js is a CommonJS package.

## Key Schema Tables

| Table | Purpose |
|---|---|
| `session` | Session metadata: id, title, project_id, time_created |
| `message` | User/assistant turns. `data` JSON has `role` and `content`. |
| `part` | Message parts (text, tool calls, tool results). `data` JSON has `type`, `tool`, `state.input`, `state.output`. |
| `actor_registry` | Subagent/actor history per session. |

## Common Queries

### Sessions in last 30 days
```sql
SELECT id, title, time_created
FROM session
WHERE time_created > (strftime('%s','now') - 2592000) * 1000
ORDER BY time_created DESC;
```

### Tool usage frequency
```sql
SELECT json_extract(p.data, '$.tool') as tool, count(*) as n
FROM message m
JOIN part p ON p.message_id = m.id
WHERE json_extract(m.data, '$.role') = 'assistant'
  AND json_extract(p.data, '$.type') = 'tool'
GROUP BY tool
ORDER BY n DESC;
```

### Assistant text per session
```sql
SELECT m.session_id,
       substr(json_extract(p.data, '$.text'), 1, 500) as text_preview
FROM part p
JOIN message m ON p.message_id = m.id
WHERE json_extract(m.data, '$.role') = 'assistant'
  AND json_extract(p.data, '$.type') = 'text'
ORDER BY p.time_created ASC;
```

### Repeated bash commands (find workflows)
```sql
SELECT json_extract(p.data, '$.state.input') as cmd, count(*) as n
FROM message m
JOIN part p ON p.message_id = m.id
WHERE json_extract(m.data, '$.role') = 'assistant'
  AND json_extract(p.data, '$.tool') = 'bash'
GROUP BY cmd
HAVING n > 1
ORDER BY n DESC;
```

## Workflow

1. **Ensure sql.js is installed** — run the setup commands if `/tmp/trajectory-query/node_modules/sql.js` does not exist.
2. **Write query script** — create a `.cjs` file in `/tmp/trajectory-query/` with the needed SQL.
3. **Run and capture output** — `node <script>.cjs` in the trajectory-query directory.
4. **Clean up** — delete the script file after use (the `node_modules` can stay).

## Validation

- Confirm `sql.js` is installed: `ls /tmp/trajectory-query/node_modules/sql.js/package.json`
- Confirm DB file exists: `ls ~/.local/share/mimocode/mimocode.db`
- Confirm query produces output (non-empty JSON arrays from `db.exec()`)
