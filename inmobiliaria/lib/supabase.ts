import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Propiedades destacadas para el home — caché de 5 minutos
// LÍMITE: muestra máximo 6. Si hay más de 6 marcadas como "destacada",
// se priorizan las más recientes (created_at descendente). El admin
// avisa esto mismo para que no haya sorpresas.
export const getPropiedadesDestacadas = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("destacada", true)
      .order("created_at", { ascending: false })
      .limit(6)
    return data
  },
  ["propiedades-destacadas"],
  { revalidate: 300, tags: ["propiedades"] }
)

// Todas las propiedades con paginado y filtro opcional por tipo — caché de 5 minutos
export const getPropiedades = unstable_cache(
  async (pagina: number = 1, tipo?: string) => {
    const POR_PAGINA = 12
    const desde = (pagina - 1) * POR_PAGINA
    const hasta = desde + POR_PAGINA - 1

    let query = supabase
      .from("propiedades")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (tipo) {
      query = query.eq("tipo", tipo)
    }

    const { data, count } = await query.range(desde, hasta)

    return { data, count }
  },
  // Antes esta key era ["propiedades"], igual a la de arriba: ambos cachés
  // se pisaban entre sí. Ahora cada función tiene su propia key.
  ["propiedades-listado"],
  { revalidate: 300, tags: ["propiedades"] }
)

// Cantidad de propiedades por tipo — para armar los filtros con conteos reales
export const getConteoPorTipo = unstable_cache(
  async () => {
    const { data } = await supabase.from("propiedades").select("tipo")
    const conteo: Record<string, number> = {}
    data?.forEach((row: { tipo: string }) => {
      conteo[row.tipo] = (conteo[row.tipo] || 0) + 1
    })
    return conteo
  },
  ["propiedades-conteo-tipo"],
  { revalidate: 300, tags: ["propiedades"] }
)

// Detalle de una propiedad — caché de 10 minutos
export const getPropiedad = unstable_cache(
  async (id: string) => {
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("id", id)
      .single()
    return data
  },
  ["propiedad"],
  { revalidate: 600, tags: ["propiedades"] }
)

// Imágenes de una propiedad — caché de 10 minutos
export const getImagenesPropiedad = unstable_cache(
  async (id: string) => {
    const { data } = await supabase
      .from("propiedad_imagenes")
      .select("*")
      .eq("propiedad_id", id)
      .order("orden")
    return data
  },
  ["propiedad-imagenes"],
  { revalidate: 600, tags: ["propiedades"] }
)

// Configuración del sitio — caché de 10 minutos
export const getConfiguracion = unstable_cache(
  async () => {
    const { data } = await supabase.from("configuracion").select("*")
    const config: Record<string, string> = {}
    data?.forEach((row: { clave: string; valor: string }) => {
      config[row.clave] = row.valor
    })
    return config
  },
  ["configuracion"],
  { revalidate: 600, tags: ["configuracion"] }
)
