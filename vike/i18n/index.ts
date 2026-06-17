import { createI18n } from 'vue-i18n'
import { localeOptions, Locale } from '../api/locale'


export const i18n = createI18n({
  legacy: false,
  availableLocales: localeOptions.map((option) => option.value),
  messages: { // 必须有对应key， 才能激活 availableLocales
    [Locale.zhCN]: {},
    [Locale.enUS]: {},
  }
})


export default i18n