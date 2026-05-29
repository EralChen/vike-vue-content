import type { App } from 'vue'
import 'vike-vue-content/config'
 
declare global {
  namespace Vike {
    interface PageContext {
      app: App
    }
  }
}
 
// Add this line if TypeScript complains about `declare global`.
// https://typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined
export {}