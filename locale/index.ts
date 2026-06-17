import type { InjectionKey, Ref } from 'vue'
import type { Language } from './types'

export type { Language, TranslatePair, Translator, TranslatorOption, LocaleContext } from './types'

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('vvc-locale')

export { default as enUS } from './lang/en-US'
export { default as zhCN } from './lang/zh-CN'
