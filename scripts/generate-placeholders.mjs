// @ts-check
/**
 * Gerador dos placeholders genéricos de estrela-2020.
 *
 * Ferramenta de design/build — NÃO entra no modelo de dados de runtime.
 * Produz os 27 PNGs (mesmos slugs/nomes de arquivo) em
 * public/games/estrela-2020/ a partir do manifesto abaixo (slug -> cor + ícone).
 *
 * Princípio (SPEC-v2 §3): nada deriva da arte oficial da Estrela. Apenas
 * fundos coloridos genéricos + ícones do Lucide. O código de runtime continua
 * sem distinguir placeholder de arte final.
 *
 * Uso:  pnpm placeholders
 *
 * Para regerar com arte própria, basta substituir os PNGs localmente — este
 * script só reproduz os placeholders.
 */
import { Resvg } from "@resvg/resvg-js"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { writeFile } from "node:fs/promises"

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, "../public/games/estrela-2020")
const ICONS_DIR = resolve(
  __dirname,
  "../node_modules/lucide-react/dist/esm/icons",
)
const SIZE = 512

/**
 * Fundo por suspeito = cor do peão no tabuleiro físico (definida com o usuário).
 * Armas e lugares não têm cor de personagem: usam um fundo neutro por categoria,
 * e o ícone é quem diferencia o item.
 */
const WEAPON_BG = "#2d3a4a" // aço escuro
const PLACE_BG = "#3d3530" // pedra quente

/** @type {Record<string, { bg: string; icon: string; border?: boolean }>} */
const MANIFEST = {
  // Suspeitos — cor do tabuleiro
  "sr-marinho": { bg: "#1f7a3d", icon: "user-round" }, // verde
  "dona-branca": { bg: "#f0efea", icon: "user-round", border: true }, // branco
  "srta-rosa": { bg: "#c0202a", icon: "user-round" }, // vermelho
  "dona-violeta": { bg: "#d6357f", icon: "user-round" }, // rosa
  "mordomo-james": { bg: "#1e519e", icon: "user-round" }, // azul
  "tony-gourmet": { bg: "#6b4226", icon: "user-round" }, // marrom
  "sergio-soturno": { bg: "#2b2f36", icon: "user-round" }, // preto/grafite
  "sargento-bigode": { bg: "#e0a51c", icon: "user-round" }, // amarelo

  // Armas — fundo único, ícone referencia o item
  "arma-quimica": { bg: WEAPON_BG, icon: "biohazard" },
  espingarda: { bg: WEAPON_BG, icon: "crosshair" },
  pa: { bg: WEAPON_BG, icon: "shovel" },
  faca: { bg: WEAPON_BG, icon: "sword" },
  veneno: { bg: WEAPON_BG, icon: "skull" },
  "pe-de-cabra": { bg: WEAPON_BG, icon: "wrench" },
  "soco-ingles": { bg: WEAPON_BG, icon: "hand" },
  tesoura: { bg: WEAPON_BG, icon: "scissors" },

  // Lugares — fundo único, ícone referencia o item
  restaurante: { bg: PLACE_BG, icon: "utensils-crossed" },
  prefeitura: { bg: PLACE_BG, icon: "landmark" },
  banco: { bg: PLACE_BG, icon: "vault" },
  hospital: { bg: PLACE_BG, icon: "hospital" },
  mansao: { bg: PLACE_BG, icon: "castle" },
  praca: { bg: PLACE_BG, icon: "tree-pine" },
  floricultura: { bg: PLACE_BG, icon: "flower" },
  hotel: { bg: PLACE_BG, icon: "hotel" },
  cemiterio: { bg: PLACE_BG, icon: "moon" },
  "estacao-de-trem": { bg: PLACE_BG, icon: "train-front" },
  boate: { bg: PLACE_BG, icon: "music" },
}

/** Luminância relativa (sRGB simplificado) para escolher traço claro/escuro. */
function isLight(hex) {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.62
}

/** Carrega o array de nós (`__iconNode`) de um ícone do Lucide. */
async function loadIconNode(name) {
  const mod = await import(resolve(ICONS_DIR, `${name}.mjs`))
  if (!mod.__iconNode) throw new Error(`Ícone sem __iconNode: ${name}`)
  return mod.__iconNode
}

/** Serializa os nós do Lucide (viewBox 24x24) em elementos SVG. */
function iconNodeToSvg(node) {
  return node
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== "key")
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ")
      return `<${tag} ${a} />`
    })
    .join("")
}

function buildSvg(node, { bg, border }) {
  const light = isLight(bg)
  const stroke = light ? "#1a1a1a" : "#ffffff"
  const overlay = light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.07)"

  // Ícone 24x24 -> centralizado e escalado. stroke-width compensa a escala
  // para manter ~14px de traço no canvas final.
  const target = 232 // lado do ícone no canvas
  const scale = target / 24
  const offset = (SIZE - target) / 2
  const strokeW = (14 / scale).toFixed(3)

  const borderRect = border
    ? `<rect x="8" y="8" width="${SIZE - 16}" height="${SIZE - 16}" rx="24" fill="none" stroke="#8a8780" stroke-width="6" />`
    : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${bg}" />
  ${borderRect}
  <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="150" fill="${overlay}" />
  <g transform="translate(${offset} ${offset}) scale(${scale})"
     fill="none" stroke="${stroke}" stroke-width="${strokeW}"
     stroke-linecap="round" stroke-linejoin="round">
    ${iconNodeToSvg(node)}
  </g>
</svg>`
}

async function main() {
  const slugs = Object.keys(MANIFEST)
  for (const slug of slugs) {
    const spec = MANIFEST[slug]
    const node = await loadIconNode(spec.icon)
    const svg = buildSvg(node, spec)
    const png = new Resvg(svg, { fitTo: { mode: "width", value: SIZE } })
      .render()
      .asPng()
    await writeFile(resolve(OUT_DIR, `${slug}.png`), png)
  }
  console.log(`Gerados ${slugs.length} placeholders em public/games/estrela-2020/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
