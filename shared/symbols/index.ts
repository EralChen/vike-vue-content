import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { Language, ContentSources } from '../types'

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('vvc-locale')
export const contentDemosKey: InjectionKey<ComputedRef<Record<string, any>>> = Symbol('vvc-content-demos')
export const contentSourcesKey: InjectionKey<ComputedRef<ContentSources>> = Symbol('vvc-content-sources')
