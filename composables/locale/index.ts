import { computed, inject, isRef, ref, unref } from 'vue'
import type { MaybeRef, Ref } from 'vue'
import type { Language, LocaleContext, Translator, TranslatorOption } from '@vike-vue-content/locale'
import { localeContextKey, enUS } from '@vike-vue-content/locale'

function get(obj: unknown, path: string, fallback: string): string {
	const keys = path.split('.')
	let current: unknown = obj
	for (const key of keys) {
		if (current == null || typeof current !== 'object') return fallback
		current = (current as Record<string, unknown>)[key]
	}
	return typeof current === 'string' ? current : fallback
}

function buildTranslator(locale: Ref<Language>): Translator {
	return (path, option) => {
		const raw = get(locale.value.vvc, path, path)
		if (!option) return raw
		return raw.replace(/\{(\w+)\}/g, (_, key) => `${option[key] ?? `{${key}}`}`)
	}
}

export function useLocale(localeOverrides?: MaybeRef<Language | undefined>): LocaleContext {
	const locale = localeOverrides ?? inject(localeContextKey, ref<Language | undefined>())
	const localeRef = isRef(locale) ? locale : ref(locale)
	const lang = computed(() => unref(localeRef)?.name ?? 'en-US')
	const t = buildTranslator(computed(() => unref(localeRef) ?? enUS))
	return { lang, locale: localeRef, t }
}
