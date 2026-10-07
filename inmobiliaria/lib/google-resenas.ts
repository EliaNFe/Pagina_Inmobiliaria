import "server-only"
import { unstable_cache } from "next/cache"
import { RESENAS, PROMEDIO_RESENAS, type Resena } from "./resenas"

// Trae las reseñas desde Google Places API (New). Corre SOLO en el servidor:
// la clave nunca llega al navegador y el visitante no hace ningún pedido a Google.
// Se cachea 24 h (≈30 llamadas por mes). Si falla o no hay credenciales,
// se muestran las reseñas de respaldo de lib/resenas.ts.

export type ResenasHome = { resenas: Resena[]; promedio: number; total?: number; desdeGoogle: boolean }

type GoogleReview = {
  name?: string
  rating?: number
  relativePublishTimeDescription?: string
  text?: { text?: string }
  originalText?: { text?: string }
  authorAttribution?: { displayName?: string }
}

const respaldo = (): ResenasHome => ({
  resenas: RESENAS,
  promedio: PROMEDIO_RESENAS,
  desdeGoogle: false,
})

const traerDeGoogle = unstable_cache(
  async (): Promise<ResenasHome> => {
    const key = process.env.GOOGLE_PLACES_API_KEY
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID
    if (!key || !placeId) throw new Error("Faltan credenciales de Google Places")

    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=es`, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews" },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) throw new Error(`Google Places respondió ${res.status}`)

    const data = (await res.json()) as { rating?: number; userRatingCount?: number; reviews?: GoogleReview[] }
    const resenas: Resena[] = (data.reviews ?? [])
      .map((r, i): Resena | null => {
        const texto = (r.text?.text || r.originalText?.text || "").trim()
        const estrellas = Math.min(5, Math.max(1, Math.round(r.rating ?? 0))) as Resena["estrellas"]
        if (!texto || !r.rating) return null
        return { id: r.name || `g${i}`, autor: r.authorAttribution?.displayName || "Usuario de Google", estrellas, texto, fecha: r.relativePublishTimeDescription }
      })
      .filter((r): r is Resena => r !== null)
    if (!resenas.length) throw new Error("Google no devolvió reseñas con texto")

    return { resenas, promedio: data.rating ?? resenas.reduce((t, r) => t + r.estrellas, 0) / resenas.length, total: data.userRatingCount, desdeGoogle: true }
  },
  ["resenas-google"],
  { revalidate: 86400, tags: ["resenas"] }
)

export async function getResenasHome(): Promise<ResenasHome> {
  // Sin credenciales de Google se usan directamente las reseñas cargadas a mano.
  if (!process.env.GOOGLE_PLACES_API_KEY || !process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID) return respaldo()
  try {
    return await traerDeGoogle()
  } catch (e) {
    console.warn("[reseñas] usando respaldo:", e instanceof Error ? e.message : e)
    return respaldo()
  }
}
