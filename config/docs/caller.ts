import { normalizeRoutePath } from './options'
import { inferDocsBaseFromPageFile, normalizeDocsRuntimeFileId } from './page-file'

type StackCallSite = {
	getFileName?: () => string | null
	getScriptNameOrSourceURL?: () => string | null
}

export function resolveDocsBaseFromCaller(base: string | undefined, fallbackBase: string): string {
	if (base) {
		return normalizeRoutePath(base)
	}

	const inferredBase = inferDocsBaseFromCallSites() ?? inferDocsBaseFromStack(new Error().stack)
	return normalizeRoutePath(inferredBase ?? fallbackBase)
}

function inferDocsBaseFromCallSites(): string | null {
	if (typeof Error.captureStackTrace !== 'function') {
		return null
	}

	const previousPrepareStackTrace = Error.prepareStackTrace
	try {
		Error.prepareStackTrace = (_, stack) => stack

		const error = new Error()
		Error.captureStackTrace(error, resolveDocsBaseFromCaller)

		const stack = error.stack
		if (!Array.isArray(stack)) {
			return null
		}

		for (const callSite of stack as StackCallSite[]) {
			const filePath = getCallSiteFilePath(callSite)
			if (!filePath) {
				continue
			}

			const inferredBase = inferDocsBaseFromPageFile(filePath)
			if (inferredBase) {
				return inferredBase
			}
		}
	} finally {
		Error.prepareStackTrace = previousPrepareStackTrace
	}

	return null
}

function inferDocsBaseFromStack(stack: string | undefined): string | null {
	if (!stack) {
		return null
	}

	const lines = stack.split(/\r?\n/)
	for (const line of lines) {
		const filePath = extractStackFilePath(line)
		if (!filePath) {
			continue
		}

		const inferredBase = inferDocsBaseFromPageFile(filePath)
		if (inferredBase) {
			return inferredBase
		}
	}

	return null
}

function getCallSiteFilePath(callSite: StackCallSite): string | null {
	const candidate = callSite.getFileName?.() ?? callSite.getScriptNameOrSourceURL?.()
	if (!candidate) {
		return null
	}

	return normalizeCandidateFilePath(candidate)
}

function extractStackFilePath(line: string): string | null {
	let candidate = line.trim().replace(/^at\s+/, '')
	const parenMatch = candidate.match(/\(([^()]+)\)$/)
	if (parenMatch) {
		candidate = parenMatch[1]
	}

	candidate = candidate.replace(/:\d+:\d+$/, '')
	candidate = candidate.split('?')[0]?.split('#')[0] ?? candidate

	return normalizeCandidateFilePath(candidate)
}


function normalizeCandidateFilePath(candidate: string): string | null {
	if (candidate.includes('://')) {
		try {
			candidate = new URL(candidate).pathname
		} catch {
			return null
		}
	}

	const normalized = normalizeDocsRuntimeFileId(decodeURIComponent(candidate))
	return normalized || null
}
