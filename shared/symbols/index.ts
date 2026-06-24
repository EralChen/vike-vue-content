import type { InjectionKey, Ref } from 'vue'
import type { Language, ContentSources } from '../types'

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('vvc-locale')
export const contentDemosKey: InjectionKey<Record<string, any>> = Symbol('vvc-content-demos')
export const contentSourcesKey: InjectionKey<ContentSources> = Symbol('vvc-content-sources')
