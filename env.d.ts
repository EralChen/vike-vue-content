/// <reference types="vite/client" />

declare module 'virtual:vvc-demos' {
  export const demosByDir: Record<string, import('@vike-vue-content/shared/types').ContentDemos>
}

declare module 'virtual:vvc-demo-sources' {
  export const sourcesByDir: Record<string, import('@vike-vue-content/shared/types').ContentSources>
}
