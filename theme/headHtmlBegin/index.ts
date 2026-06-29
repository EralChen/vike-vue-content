import {
  generateThemeInitScript,
  resolveThemeConfig
} from '../script'

export function headHtmlBegin(pageContext: any): string {
  return generateThemeInitScript(
    resolveThemeConfig(pageContext.config.theme, pageContext.config.themes),
    pageContext.config.appearance
  )
}
