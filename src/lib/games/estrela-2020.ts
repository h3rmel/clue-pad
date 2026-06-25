import type { GameItem, GameVersion } from "@/lib/types"

const BASE = "/games/estrela-2020"

function item(
  id: string,
  name: string,
  category: GameItem["category"],
): GameItem {
  return { id, name, category, image: `${BASE}/${id}.png` }
}

const suspects: GameItem[] = [
  item("sr-marinho", "Sr. Marinho", "suspects"),
  item("dona-branca", "Dona Branca", "suspects"),
  item("srta-rosa", "Srta. Rosa", "suspects"),
  item("dona-violeta", "Dona Violeta", "suspects"),
  item("mordomo-james", "Mordomo James", "suspects"),
  item("tony-gourmet", "Tony Gourmet", "suspects"),
  item("sergio-soturno", "Sérgio Soturno", "suspects"),
  item("sargento-bigode", "Sargento Bigode", "suspects"),
]

const weapons: GameItem[] = [
  item("arma-quimica", "Arma Química", "weapons"),
  item("espingarda", "Espingarda", "weapons"),
  item("pa", "Pá", "weapons"),
  item("faca", "Faca", "weapons"),
  item("veneno", "Veneno", "weapons"),
  item("pe-de-cabra", "Pé-de-cabra", "weapons"),
  item("soco-ingles", "Soco Inglês", "weapons"),
  item("tesoura", "Tesoura", "weapons"),
]

const places: GameItem[] = [
  item("restaurante", "Restaurante", "places"),
  item("prefeitura", "Prefeitura", "places"),
  item("banco", "Banco", "places"),
  item("hospital", "Hospital", "places"),
  item("mansao", "Mansão", "places"),
  item("praca", "Praça", "places"),
  item("floricultura", "Floricultura", "places"),
  item("hotel", "Hotel", "places"),
  item("cemiterio", "Cemitério", "places"),
  item("estacao-de-trem", "Estação de Trem", "places"),
  item("boate", "Boate", "places"),
]

export const estrela2020: GameVersion = {
  id: "estrela-2020",
  label: "Detetive — Estrela (2020)",
  items: [...suspects, ...weapons, ...places],
}
