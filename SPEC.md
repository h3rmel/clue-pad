# clue-pad — Especificação Técnica (SPEC)

> Cartilha digital PWA para o jogo de tabuleiro **Detetive** (Estrela).
> Companion de uso rápido durante a partida física: substitui a cartilha de papel.

---

## 1. Visão geral

O `clue-pad` é um PWA minimalista usado **junto** ao tabuleiro físico do Detetive. Exibe suspeitos, armas e lugares e permite ao jogador marcar cada item conforme sua dedução. Não há lógica de jogo, multiplayer, sincronização ou backend — é uma cartilha eletrônica, nada além disso.

**Não-objetivos (out of scope):**

- Não valida palpites nem conhece a solução do crime.
- Não tem contas, login ou sincronização entre dispositivos.
- Não substitui tabuleiro, dado, cartas físicas ou regras.
- Não tem múltiplos jogadores no mesmo app (cada jogador usa o seu).

---

## 2. Stack técnica

| Camada | Escolha |
|---|---|
| Build / dev | Vite |
| UI | React 18+ + TypeScript |
| Componentes | shadcn/ui (Radix + Tailwind) |
| Estilo | Tailwind CSS |
| PWA | `vite-plugin-pwa` |
| Estado | React state + Context (ou Zustand se crescer) |
| Persistência | localStorage |
| Gerenciador | pnpm |
| Deploy | estático (SPA), sem backend |

> shadcn/ui instalado via CLI; componentes ficam no repo (`src/components/ui`). Prováveis: `dialog`/`drawer`, `card`, `button`, `select`, `badge`, `alert-dialog`.

---

## 3. Entidades e versões do jogo

As entidades **não** são fixas globalmente: pertencem a uma **versão do jogo** selecionável. O app carrega uma versão por vez; trocar a versão troca itens **e** assets.

### Modelo de versão

```ts
type Category = 'suspects' | 'weapons' | 'places';

interface GameItem {
  id: string;          // slug estável e único dentro da versão, ex: 'sr-marinho'
  name: string;
  category: Category;
  image: string;       // caminho do asset DAQUELA versão
}

interface GameVersion {
  id: string;          // ex: 'estrela-2020'
  label: string;       // ex: 'Detetive — Estrela (2020)'
  items: GameItem[];
}
```

Registro central de versões (ex: `src/lib/games/index.ts`) exporta um array de `GameVersion`. Adicionar uma nova versão = adicionar um objeto + sua pasta de assets. Nenhuma lógica de UI muda.

### Versão inicial — `estrela-2020`

**Suspeitos (8):** Sr. Marinho · Dona Branca · Srta. Rosa · Dona Violeta · Mordomo James · Tony Gourmet · Sérgio Soturno · Sargento Bigode

**Armas (8):** Arma Química · Espingarda · Pá · Faca · Veneno · Pé-de-cabra · Soco Inglês · Tesoura

**Lugares (11):** Restaurante · Prefeitura · Banco · Hospital · Mansão · Praça · Floricultura · Hotel · Cemitério · Estação de Trem · Boate

### Assets / imagens — IMPORTANTE

As **artes oficiais da Estrela são protegidas por direitos autorais e NÃO ficam versionadas no repositório**. A estrutura prevê o *slot* para elas:

```
public/games/estrela-2020/
  sr-marinho.png
  dona-branca.png
  ...
```

- O repo inclui **placeholders** (ícones genéricos / silhuetas) com os mesmos nomes de arquivo.
- O usuário que possuir os arquivos licenciados os substitui localmente nessa pasta.
- `image` em cada `GameItem` aponta para esse caminho; o código não distingue placeholder de arte final.
- Fallback: se um asset não carregar, exibir placeholder + nome.

---

## 4. Estados de um item

Cada item tem exatamente um de três estados:

| Estado | Significado | Tratamento visual (sugestão) |
|---|---|---|
| `neutral` | Sem marcação (padrão inicial) | Card neutro |
| `doubt` | Suspeita de ser a carta do crime | Destaque âmbar + badge "Dúvida" |
| `eliminated` | Carta revelada num palpite → descartada | Esmaecido/dessaturado + badge "Eliminado" |

Estado inicial de todos os itens: `neutral`.

---

## 5. Layout e interação

### Tela única com scroll
- **Uma página** com as três categorias empilhadas: seção **Suspeitos**, **Armas**, **Lugares**, nessa ordem, cada uma com um título de seção.
- Sem abas. Navegação por scroll vertical. (Opcional pós-MVP: índice/atalho fixo para pular entre seções.)

### Grid arejado
- Grid de cards com **no máximo ~3 cards por largura de tela**, priorizando respiro e espaço em branco generoso entre elementos.
- Mobile-first; cards com área de toque grande (imagem + nome).
- Card reflete o estado atual via cor/badge/opacidade.

### Seleção de estado
- **Tocar num card** abre um **modal** (`Dialog`, ou `Drawer` no mobile) com as três opções: Neutro · Dúvida · Eliminado.
- Selecionar uma opção fecha o modal e atualiza o card imediatamente.
- O modal indica qual é o estado atual.

### Seleção de versão do jogo
- Controle (`Select`) no topo / cabeçalho para escolher a `GameVersion`.
- Trocar de versão recarrega itens e assets e zera/segrega o estado (ver §6).

### Nova partida (reset)
- Botão **"Nova partida"** reseta todos os itens para `neutral`, com `AlertDialog` de confirmação.

---

## 6. Persistência

- Estado salvo em **localStorage**, versionado e **segmentado por versão de jogo**:
  - chave: `clue-pad:state:v1:<gameVersionId>` → `Record<itemId, ClueStatus>`
  - chave: `clue-pad:selectedVersion:v1` → último `gameVersionId` usado.
- No boot: lê a versão selecionada e o estado dela; ausente/corrompido → tudo `neutral`.
- Salvo a cada mudança.
- Trocar de versão preserva o estado de cada versão separadamente (não mistura partidas de jogos diferentes).
- "Nova partida" limpa apenas o estado da versão ativa.

---

## 7. Arquitetura sugerida

```
src/
  lib/
    types.ts                 # Category, ClueStatus, GameItem, GameVersion
    games/
      index.ts               # registro de versões
      estrela-2020.ts        # itens da versão inicial
    storage.ts               # load/save localStorage (versionado + por jogo)
  state/
    clues.tsx                # Context/store: versão ativa + status por item
  components/
    ui/                      # shadcn/ui (gerado pela CLI)
    VersionSelect.tsx
    CategorySection.tsx
    ClueGrid.tsx
    ClueCard.tsx
    StatusModal.tsx
    ResetButton.tsx
  App.tsx
  main.tsx
public/
  games/estrela-2020/        # assets (placeholders no repo)
  manifest / ícones PWA
```

> `id` dos itens deve ser slug estável (não índice) para a persistência sobreviver a reordenações.

---

## 8. PWA / requisitos não-funcionais

- **Instalável**: manifest com nome, ícones 192/512, tema, `display: standalone`.
- **Offline-first**: funciona 100% sem rede durante a partida; service worker com precache de app shell + assets da(s) versão(ões).
- **Mobile-first**: alvo é celular em pé, uso com uma mão.
- **Boot rápido**: aplicar estado salvo antes do primeiro paint (sem flash de cards não-marcados).
- **Acessibilidade**: contraste adequado nos três estados; modal navegável por teclado; `aria-label` no card indicando nome + estado.
- **Sem backend** e sem variáveis de ambiente.

---

## 9. Critérios de aceite (MVP)

- [ ] Tela única com as três seções (8 / 8 / 11 itens da `estrela-2020`).
- [ ] Grid arejado, ~3 cards por largura, bom espaço em branco.
- [ ] Tocar num card abre o modal com as 3 opções.
- [ ] Selecionar opção fecha o modal e atualiza o card na hora.
- [ ] Os três estados têm tratamento visual distinto e legível.
- [ ] Seletor de versão de jogo funcional (mesmo com só uma versão registrada).
- [ ] Estado persiste ao fechar/reabrir, segmentado por versão.
- [ ] "Nova partida" reseta a versão ativa (com confirmação).
- [ ] App instalável e utilizável offline.
- [ ] Assets via slot por versão; placeholders no repo, arte oficial fora do repo.

---

## 10. Decisões em aberto

- Origem dos placeholders (Lucide, ícones próprios, ilustrações geradas).
- `Dialog` vs `Drawer` no mobile para o seletor de estado (sugestão: `Drawer` no mobile, `Dialog` no desktop).
- Contador opcional por seção (ex: "3 em dúvida") — fora do MVP.
- Índice/atalho fixo para pular entre seções no scroll — fora do MVP.
