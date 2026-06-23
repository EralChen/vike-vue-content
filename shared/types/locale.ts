export type TranslatePair = {
	[key: string]: string | TranslatePair
}

export type Language = {
	name: string
	vvc: TranslatePair
}

export type TranslatorOption = Record<string, string | number>
export type Translator = (path: string, option?: TranslatorOption) => string
export type LocaleContext = {
	lang: import('vue').Ref<string>
	locale: import('vue').Ref<Language | undefined>
	t: Translator
}
