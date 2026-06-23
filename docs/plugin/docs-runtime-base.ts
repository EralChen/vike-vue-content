
import type { Plugin } from 'vite'
import {
	parseSync,
	Visitor,
	type CallExpression,
	type ExportNamedDeclaration,
	type ExportSpecifier,
	type ModuleExportName,
	type Program,
} from 'oxc-parser'
import {
	inferDocsBaseFromPageFile,
	isDocsPrerenderFile,
	isDocsRouteFile,
	normalizeDocsRuntimeFileId,
} from '../utils/page-file'

interface Edit {
	start: number
	end: number
	replacement: string
}

export function docsRuntimeBasePlugin(): Plugin {
	return {
		name: 'vike-vue-content-docs-runtime-base',
		enforce: 'pre',
		transform(code, id) {
			// 1. 文件路径判断优先 — 比 code 扫描更快，大多数文件直接跳过
			const normalizedId = normalizeDocsRuntimeFileId(id)
			const isRoute = isDocsRouteFile(normalizedId)
			const isPrerender = !isRoute && isDocsPrerenderFile(normalizedId)
			if (!isRoute && !isPrerender) {
				return null
			}

			// 2. 快速检查代码是否包含目标工厂函数名
			const factoryName = isRoute ? 'createDocsRoute' : 'createDocsPrerender'
			if (!code.includes(factoryName)) {
				return null
			}

			// 3. 从文件路径推断 docs base（如 /pages/zh-CN/+route.ts → "/zh-CN"）
			const docsBase = inferDocsBaseFromPageFile(normalizedId)
			if (!docsBase) {
				return null
			}

			// 4. 单次解析完成所有 AST 变换（re-export 替换 + 零参注入）
			const transformed = transformFile(code, docsBase, factoryName)

			if (transformed === code) {
				return null
			}

			return { code: transformed, map: null }
		},
	}
}

/**
 * 单次解析同时处理 re-export 替换和零参工厂调用注入
 */
function transformFile(code: string, docsBase: string, factoryName: string): string {
	const { program } = parseSync('+route.ts', code)
	const edits: Edit[] = []

	// Pass 1: 遍历顶层节点，将工厂函数的 re-export 模式替换为 import + 调用
	for (const node of program.body) {
		if (!isReexportDeclaration(node)) continue

		const source = node.source.value
		const replacement = buildReexportReplacement(node, source, docsBase, factoryName)
		if (replacement != null) {
			edits.push({ start: node.start, end: node.end, replacement })
		}
	}

	// Pass 2: Visitor 遍历完整 AST，为零参调用注入 docsBase
	collectInjectEdits(program, edits, docsBase, factoryName)

	return applyEdits(code, edits)
}

/**
 * 构建 re-export 替换代码：
 *   export { createDocsRoute as default } from '...'   →  import + createDocsRoute(base)
 *   export { createDocsPrerender as default } from '...' →  import + createDocsPrerender(base)
 *   export { default } from '...'                       →  import + factory(base)
 */
function buildReexportReplacement(
	node: ExportNamedDeclaration & { source: NonNullable<ExportNamedDeclaration['source']> },
	source: string,
	docsBase: string,
	factoryName: string,
): string | null {
	const defaultSpec = node.specifiers.find(
		s => getName(s.local) === factoryName && getName(s.exported) === 'default',
	)
	if (defaultSpec) {
		const restSpecs = node.specifiers.filter(s => s !== defaultSpec)
		const rest = restSpecs.length > 0
			? `export { ${restSpecs.map(formatSpecifier).join(', ')} } from ${JSON.stringify(source)};\n`
			: ''
		return `${rest}import { ${factoryName} } from ${JSON.stringify(source)};\nexport default ${factoryName}(${JSON.stringify(docsBase)})`
	}

	if (
		node.specifiers.length === 1
		&& getName(node.specifiers[0]!.exported) === 'default'
		&& getName(node.specifiers[0]!.local) === 'default'
	) {
		return `import { ${factoryName} } from ${JSON.stringify(source)};\nexport default ${factoryName}(${JSON.stringify(docsBase)})`
	}

	return null
}

/**
 * Visitor 遍历 AST，收集零参工厂调用的参数注入编辑点
 */
function collectInjectEdits(program: Program, edits: Edit[], docsBase: string, target: string): void {
	const visitor = new Visitor({
		CallExpression(node: CallExpression) {
			if (
				node.callee.type === 'Identifier'
				&& node.callee.name === target
				&& node.arguments.length === 0
			) {
				// 在 `)` 前插入参数：createDocsRoute() → createDocsRoute("/zh-CN")
				edits.push({
					start: node.end - 1,
					end: node.end - 1,
					replacement: JSON.stringify(docsBase),
				})
			}
		},
	})
	visitor.visit(program)
}

/**
 * 从右到左应用编辑，避免位置偏移
 */
function applyEdits(code: string, edits: Edit[]): string {
	edits.sort((a, b) => b.start - a.start)
	let result = code
	for (const edit of edits) {
		result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end)
	}
	return result
}

function isReexportDeclaration(
	node: Program['body'][number],
): node is ExportNamedDeclaration & { source: NonNullable<ExportNamedDeclaration['source']> } {
	return node.type === 'ExportNamedDeclaration' && node.source != null
}

function formatSpecifier(s: ExportSpecifier): string {
	const local = getName(s.local)
	const exported = getName(s.exported)
	return local === exported ? local : `${local} as ${exported}`
}

function getName(node: ModuleExportName): string {
	return node.type === 'Literal' ? node.value : node.name
}
