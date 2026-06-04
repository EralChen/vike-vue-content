import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import highlight from "comark/plugins/highlight";
import './index.css'


export default highlight({
  themes: {
    light: githubLight,
    dark: githubDark,
  },
})
