import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import highlight from "comark/plugins/highlight";
import type { HighlightOptions } from "comark/plugins/highlight";
import './index.css'


export default function highlightPlugin(options?: HighlightOptions) {
  return highlight({
    themes: {
      light: githubLight,
      dark: githubDark,
    },
    ...options,
  })
}
