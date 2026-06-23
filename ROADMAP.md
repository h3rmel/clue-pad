# clue-pad — Roadmap de implementação (MVP)

Plano passo a passo para construir o MVP descrito em [SPEC.md](SPEC.md). Marcar cada item ao concluir.

---

## Fase 0 — Scaffold & tooling
- [ ] Inicializar projeto Vite + React + TypeScript com pnpm
- [ ] Configurar Tailwind CSS (`tailwind.config`, `postcss`, diretivas no CSS global)
- [ ] Configurar path alias `@/` (vite + tsconfig)
- [ ] Inicializar shadcn/ui via CLI (`components.json`, base theme)
- [ ] Verificar `pnpm dev` rodando com tela em branco

## Fase 1 — Modelo de dados & versões
- [ ] `src/lib/types.ts` — `Category`, `ClueStatus`, `GameItem`, `GameVersion`
- [ ] `src/lib/games/estrela-2020.ts` — 8 suspeitos / 8 armas / 11 lugares, com `id` slug estável e `image` apontando para `/games/estrela-2020/<slug>.png`
- [ ] `src/lib/games/index.ts` — registro central (array de `GameVersion`) + helper `getVersion(id)`

## Fase 2 — Persistência
- [ ] `src/lib/storage.ts` — load/save com chaves versionadas e segmentadas:
  - `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
  - `clue-pad:selectedVersion:v1` → último `gameVersionId`
- [ ] Fallback robusto: ausente/corrompido → tudo `neutral`

## Fase 3 — Estado (Context)
- [ ] `src/state/clues.tsx` — Context com: versão ativa, mapa de status, `setStatus`, `resetActiveVersion`, `selectVersion`
- [ ] Carregar estado salvo na inicialização (antes do primeiro paint, sem flash)
- [ ] Persistir a cada mudança; trocar versão preserva estados separados

## Fase 4 — Componentes UI
- [ ] Gerar shadcn: `card`, `button`, `badge`, `select`, `dialog`, `drawer`, `alert-dialog`
- [ ] `ClueCard.tsx` — imagem + nome, tratamento visual por estado, `aria-label` (nome + estado), fallback de imagem para placeholder
- [ ] `ClueGrid.tsx` — grid arejado (~3 por largura, mobile-first)
- [ ] `CategorySection.tsx` — título de seção + grid
- [ ] `StatusModal.tsx` — `Drawer` no mobile / `Dialog` no desktop, 3 opções (Neutro · Dúvida · Eliminado), indica estado atual
- [ ] `VersionSelect.tsx` — seletor de versão no cabeçalho
- [ ] `ResetButton.tsx` — "Nova partida" com `AlertDialog` de confirmação
- [ ] `App.tsx` — cabeçalho (VersionSelect + ResetButton) + 3 seções empilhadas (Suspeitos → Armas → Lugares)

## Fase 5 — Assets / placeholders
- [ ] Gerar placeholders genéricos (silhuetas/ícones) em `public/games/estrela-2020/` com os 27 nomes de arquivo corretos
- [ ] Confirmar que arte oficial **não** é commitada (apenas placeholders no repo)

## Fase 6 — PWA
- [ ] Configurar `vite-plugin-pwa` (manifest: nome, tema, `display: standalone`)
- [ ] Ícones 192/512
- [ ] Service worker com precache de app shell + assets das versões
- [ ] Testar offline e instalabilidade via `pnpm build` + `pnpm preview`

## Fase 7 — Verificação (critérios de aceite §9)
- [ ] Tela única, 3 seções (8/8/11)
- [ ] Grid arejado ~3 por largura
- [ ] Tocar card abre modal; selecionar atualiza na hora
- [ ] 3 estados visualmente distintos e legíveis
- [ ] Seletor de versão funcional
- [ ] Estado persiste ao reabrir, segmentado por versão
- [ ] "Nova partida" reseta versão ativa (com confirmação)
- [ ] Instalável e usável offline
- [ ] `pnpm build` limpo (tsc + vite) e lint sem erros
