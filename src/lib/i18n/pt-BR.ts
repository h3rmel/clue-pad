// Dicionário pt-BR — fonte da verdade das chaves de tradução.
// O tipo das chaves é derivado deste objeto, garantindo, em tempo de compilação,
// que en-US e es cubram exatamente as mesmas chaves.
//
// Atenção: nomes de itens e rótulos de GameVersion NÃO são traduzidos (são nomes
// próprios impressos no tabuleiro físico da Estrela). Aqui só entra o "chrome".

export const ptBR = {
  // Categorias (títulos das seções)
  "category.suspects": "Suspeitos",
  "category.weapons": "Armas",
  "category.places": "Lugares",

  // Estados dos itens
  "status.neutral.label": "Neutro",
  "status.neutral.description": "Sem marcação",
  "status.doubt.label": "Dúvida",
  "status.doubt.description": "Suspeita de ser a carta do crime",
  "status.eliminated.label": "Eliminado",
  "status.eliminated.description": "Carta revelada — descartada",

  // Modal de estado
  "modal.description": "Marque o estado deste item.",

  // Nova partida (reset)
  "reset.trigger": "Nova partida",
  "reset.title": "Começar nova partida?",
  "reset.description":
    "Isto apaga todas as marcações desta versão e volta todos os itens ao estado neutro. Esta ação não pode ser desfeita.",
  "reset.cancel": "Cancelar",
  "reset.confirm": "Nova partida",

  // Seletor de versão do jogo
  "version.label": "Versão do jogo",

  // Seletor de idioma
  "language.label": "Idioma",

  // Tema (modo claro/escuro)
  "theme.label": "Tema",
  "theme.system": "Sistema",
  "theme.light": "Claro",
  "theme.dark": "Escuro",
} as const

export type TranslationKey = keyof typeof ptBR
export type Dictionary = Record<TranslationKey, string>
