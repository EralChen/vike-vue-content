import { ID_INJECTION_KEY } from "element-plus";
import type { PageContext } from 'vike/types'
import { i18n } from '../i18n'

function onCreateApp(ctx: PageContext) {
  if (!ctx.app) return
  
  ctx.app.provide(ID_INJECTION_KEY, {
    prefix: 1024,
    current: 0,
  });
  ctx.app.use(i18n)

}

export { onCreateApp };