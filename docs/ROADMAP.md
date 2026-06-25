# clue-pad — Roadmap de implementação (MVP)

Plano passo a passo para construir o MVP descrito em [SPEC.md](SPEC.md). Marcar cada item ao concluir.

---

## Fase 0 — Scaffold & tooling
- [x] Inicializar projeto Vite + React + TypeScript com pnpm
- [x] Configurar Tailwind CSS (v4 via `@tailwindcss/vite`, diretivas no CSS global)
- [x] Configurar path alias `@/` (vite + tsconfig)
- [x] Inicializar shadcn/ui via CLI (`components.json`, base theme, smoke test `button`)
- [x] Verificar `pnpm dev` rodando (HTTP 200) e `pnpm build` limpo

## Fase 1 — Modelo de dados & versões
- [x] `src/lib/types.ts` — `Category`, `ClueStatus`, `GameItem`, `GameVersion`
- [x] `src/lib/games/estrela-2020.ts` — 8 suspeitos / 8 armas / 11 lugares, com `id` slug estável e `image` apontando para `/games/estrela-2020/<slug>.png`
- [x] `src/lib/games/index.ts` — registro central (array de `GameVersion`) + helper `getVersion(id)`

## Fase 2 — Persistência
- [x] `src/lib/storage.ts` — load/save com chaves versionadas e segmentadas:
  - `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
  - `clue-pad:selectedVersion:v1` → último `gameVersionId`
- [x] Fallback robusto: ausente/corrompido → tudo `neutral`

## Fase 3 — Estado (Context)
- [x] `src/state/clues.tsx` — Context com: versão ativa, mapa de status, `setStatus`, `resetActiveVersion`, `selectVersion`
- [x] Carregar estado salvo na inicialização (antes do primeiro paint, sem flash)
- [x] Persistir a cada mudança; trocar versão preserva estados separados

## Fase 4 — Componentes UI
- [x] Gerar shadcn: `card`, `button`, `badge`, `select`, `dialog`, `drawer`, `alert-dialog`
- [x] `ClueCard.tsx` — imagem + nome, tratamento visual por estado, `aria-label` (nome + estado), fallback de imagem para placeholder
- [x] `ClueGrid.tsx` — grid arejado (~3 por largura, mobile-first)
- [x] `CategorySection.tsx` — título de seção + grid
- [x] `StatusModal.tsx` — `Drawer` no mobile / `Dialog` no desktop, 3 opções (Neutro · Dúvida · Eliminado), indica estado atual
- [x] `VersionSelect.tsx` — seletor de versão no cabeçalho
- [x] `ResetButton.tsx` — "Nova partida" com `AlertDialog` de confirmação
- [x] `App.tsx` — cabeçalho (VersionSelect + ResetButton) + 3 seções empilhadas (Suspeitos → Armas → Lugares)

## Fase 5 — Assets / placeholders
- [x] Gerar placeholders genéricos (silhuetas/ícones) em `public/games/estrela-2020/` com os 27 nomes de arquivo corretos
- [x] Confirmar que arte oficial **não** é commitada (apenas placeholders no repo)

## Fase 6 — PWA
- [x] Configurar `vite-plugin-pwa` (manifest: nome, tema, `display: standalone`)
- [x] Ícones 192/512
- [x] Service worker com precache de app shell + assets das versões
- [x] Testar offline e instalabilidade via `pnpm build` + `pnpm preview`

## Fase 7 — Verificação (critérios de aceite §9)
- [x] Tela única, 3 seções (8/8/11)
- [x] Grid arejado ~3 por largura
- [x] Tocar card abre modal; selecionar atualiza na hora
- [x] 3 estados visualmente distintos e legíveis
- [x] Seletor de versão funcional
- [x] Estado persiste ao reabrir, segmentado por versão
- [x] "Nova partida" reseta versão ativa (com confirmação)
- [x] Instalável e usável offline
- [x] `pnpm build` limpo (tsc + vite) e lint sem erros
