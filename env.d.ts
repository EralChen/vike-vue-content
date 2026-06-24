/// <reference types="vite/client" />

declare module 'virtual:vvc-demos' {
  export const demos: import('@vike-vue-content/shared/types').ContentDemos
}

declare module 'virtual:vvc-demo-sources' {
  export const sources: import('@vike-vue-content/shared/types').ContentSources
}
