import type { InjectionKey, Ref } from 'vue'
import type { Language } from '../types'

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('vvc-locale')
export const contentDemosKey: InjectionKey<Record<string, any>> = Symbol('vvc-content-demos')
export const contentSourcesKey: InjectionKey<Record<string, string>> = Symbol('vvc-content-sources')
