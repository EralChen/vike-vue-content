# vike-vue-content

[vike](https://vike.dev/) 生态下，基于 [vike-vue](https://github.com/vikejs/vike-vue)，对标  [nuxt content](https://content.nuxt.com/) 的 **文档渲染框架**。



## Installation

```bash
npm install vike-vue-content
```

```ts
// vike.config.ts
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'
import type { Config } from 'vike/types'

// https://vike.dev/config
export default {
  // https://vike.dev/extends
  extends: [vikeVue, vikeVueContent],
  // ... other config
} satisfies Config
```


## For Developers

开发过程中你可以参考源码
 + [vike](../.dev/vike)
 + [vike-vue](../.dev/vike-vue)
 + [nuxt content](../.dev/content)

`nuxt-content` 的用例
 + [movk-nuxt-docs](../.dev/movk-nuxt-docs)


