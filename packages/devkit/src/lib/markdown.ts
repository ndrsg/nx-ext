import { readFileSync } from 'fs';
import { marked } from 'marked';
import hljs from 'highlight.js';
const hljsStylesPath = require.resolve("highlight.js").replace(/highlight\.js.+/, "highlight.js/styles/");

function highlight(code: string, language: string): string {
  return hljs.highlight(code, { language }).value;
}

export function mdToHtml(path: string, codeCss?: string): string {
  if(!codeCss) {
    codeCss = "github.css"
  }
  const src = readFileSync(path).toString();
  const html = marked(src, {
    highlight
  });
  return html;
}

export function getHighlightCss(codeCss?: Styles) {
  if(!codeCss) {
    codeCss = "github.css"
  }
  const css = readFileSync(hljsStylesPath + codeCss).toString();
  return css;
}

export type Styles =
  "a11y-dark.css" |
  "a11y-light.css" |
  "agate.css" |
  "androidstudio.css" |
  "an-old-hope.css" |
  "arduino-light.css" |
  "arta.css" |
  "ascetic.css" |
  "atom-one-dark.css" |
  "atom-one-dark-reasonable.css" |
  "atom-one-light.css" |
  "brown-paper.css" |
  "codepen-embed.css" |
  "color-brewer.css" |
  "dark.css" |
  "default.css" |
  "devibeans.css" |
  "docco.css" |
  "far.css" |
  "felipec.css" |
  "foundation.css" |
  "github.css" |
  "github-dark.css" |
  "github-dark-dimmed.css" |
  "gml.css" |
  "googlecode.css" |
  "gradient-dark.css" |
  "gradient-light.css" |
  "grayscale.css" |
  "hybrid.css" |
  "idea.css" |
  "intellij-light.css" |
  "ir-black.css" |
  "isbl-editor-dark.css" |
  "isbl-editor-light.css" |
  "kimbie-dark.css" |
  "kimbie-light.css" |
  "lightfair.css" |
  "lioshi.css" |
  "magula.css" |
  "mono-blue.css" |
  "monokai.css" |
  "monokai-sublime.css" |
  "night-owl.css" |
  "nnfx-dark.css" |
  "nnfx-light.css" |
  "nord.css" |
  "obsidian.css" |
  "paraiso-dark.css" |
  "paraiso-light.css" |
  "pojoaque.css" |
  "purebasic.css" |
  "qtcreator-dark.css" |
  "qtcreator-light.css" |
  "rainbow.css" |
  "routeros.css" |
  "school-book.css" |
  "shades-of-purple.css" |
  "srcery.css" |
  "stackoverflow-dark.css" |
  "stackoverflow-light.css" |
  "sunburst.css" |
  "tokyo-night-dark.css" |
  "tokyo-night-light.css" |
  "tomorrow-night-blue.css" |
  "tomorrow-night-bright.css" |
  "vs2015.css" |
  "vs.css" |
  "xcode.css" |
  "xt256.css"
