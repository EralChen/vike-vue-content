import { colorMap, neutralColorMap } from './constants'

// 生成主题初始化脚本 - 在页面渲染前执行，防止 FOUC
export function generateThemeInitScript(): string {
  // 简化颜色映射，只保留 500 色值
  const primaryMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(colorMap)) {
    primaryMap[key] = value[500]
  }

  const neutralMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(neutralColorMap)) {
    neutralMap[key] = value[500]
  }

  return `<script>(function(){try{var t=JSON.parse(localStorage.getItem('vvc-theme')||'{}');var r=document.documentElement;var cm=${JSON.stringify(primaryMap)};var nm=${JSON.stringify(neutralMap)};var m=t.colorMode||'system';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)r.classList.add('dark');if(t.blackAsPrimary){r.style.setProperty('--vvc-color-primary',d?'#fff':'#000')}else{r.style.setProperty('--vvc-color-primary',cm[t.colors?.primary]||cm.blue)}r.style.setProperty('--vvc-color-neutral',nm[t.colors?.neutral]||nm.slate);r.style.setProperty('--vvc-radius',(t.radius||0.25)+'rem');r.style.setProperty('--vvc-font-family',"'"+(t.font||'Inter')+"',sans-serif")}catch(e){}})()</script>`
}