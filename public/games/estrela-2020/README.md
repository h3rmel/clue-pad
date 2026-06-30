# Assets — estrela-2020

Os arquivos `*.png` desta pasta são **placeholders genéricos** (silhuetas) e
**não** contêm a arte oficial do Detetive (Estrela).

> A arte oficial da Estrela é protegida por direitos autorais e **não** é
> versionada neste repositório.

Se você possui os arquivos licenciados, basta substituí-los localmente mantendo
os **mesmos nomes de arquivo** (ex: `sr-marinho.png`). O código não distingue
placeholder de arte final; se um asset não carregar, exibe um ícone genérico
mais o nome do item.

## Como os placeholders são gerados

Cada PNG é um fundo colorido genérico + um ícone do [Lucide](https://lucide.dev)
que referencia o item — nada derivado da arte oficial:

- **Suspeitos:** fundo na cor do peão no tabuleiro físico (verde, vermelho,
  azul, etc.); "Dona Branca" leva fundo off-white com borda escura para
  permanecer visível no tema claro.
- **Armas:** fundo aço escuro, ícone por arma (tesoura, caveira, …).
- **Lugares:** fundo pedra quente, ícone por lugar (banco, hospital, …).

O mapeamento `slug → { cor, ícone }` e o gerador vivem em
[`scripts/generate-placeholders.mjs`](../../../scripts/generate-placeholders.mjs)
(ferramenta de design/build, fora do modelo de dados de runtime). Para regerar:

```bash
pnpm placeholders
```
