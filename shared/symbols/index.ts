import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { Language, ContentSources } from '../types'
import type { ComarkTree } from 'comark'

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = 'vvc-locale' as never
export const contentDemosKey: InjectionKey<ComputedRef<Record<string, any>>> = 'vvc-content-demos'as never
export const contentSourcesKey: InjectionKey<ComputedRef<ContentSources>> = 'vvc-content-sources'as never
export const contentParsedSourcesKey: InjectionKey<ComputedRef<Record<string, ComarkTree>>> = 'vvc-content-parsed-sources' as never
export const contentComponentsKey: InjectionKey<ComputedRef<Record<string, any>>> = 'vvc-content-components' as never
