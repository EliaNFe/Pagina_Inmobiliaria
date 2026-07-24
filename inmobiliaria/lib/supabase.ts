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
      .limit(10)
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

// NUEVO — Propiedades agrupadas por operación (Venta / Alquiler / Alquiler temporada).
// OJO: esta versión trae TODO sin paginar. Se mantiene por si la necesitás
// en otro lado, pero para /propiedades usá getPropiedadesPorOperacionPaginado.
export const getPropiedadesPorOperacion = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .order("created_at", { ascending: false })

    const grupos: Record<string, typeof data> = {
      Venta: [],
      Alquiler: [],
      "Alquiler temporada": [],
    }

    data?.forEach((p: { operacion?: string }) => {
      const op = p.operacion || "Venta"
      if (!grupos[op]) grupos[op] = []
      grupos[op]!.push(p as never)
    })

    return grupos
  },
  ["propiedades-por-operacion"],
  { revalidate: 300, tags: ["propiedades"] }
)

// NUEVO — Igual que getPropiedadesPorOperacion pero paginado: trae solo
// las propiedades de UNA operación puntual, de a POR_PAGINA por vez, con
// filtro opcional por tipo. Pensado para que cada sección de /propiedades
// (Venta / Alquiler / Alquiler temporada) tenga su propia paginación
// independiente sin traer toda la tabla de una.
//
// Las propiedades viejas sin "operacion" cargada se consideran "Venta"
// (mismo criterio de fallback que se usa en el resto del sitio), por eso
// el .or() especial para ese caso: operacion=null también cuenta como Venta.
const POR_PAGINA_OPERACION = 6

export const getPropiedadesPorOperacionPaginado = unstable_cache(
  async (operacion: "Venta" | "Alquiler" | "Alquiler temporada", pagina: number = 1, tipo?: string) => {
    const desde = (pagina - 1) * POR_PAGINA_OPERACION
    const hasta = desde + POR_PAGINA_OPERACION - 1

    let query = supabase
      .from("propiedades")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    query = operacion === "Venta"
      ? query.or("operacion.eq.Venta,operacion.is.null")
      : query.eq("operacion", operacion)

    if (tipo) {
      query = query.eq("tipo", tipo)
    }

    const { data, count } = await query.range(desde, hasta)

    return { data: data || [], count: count || 0 }
  },
  ["propiedades-por-operacion-paginado"],
  { revalidate: 300, tags: ["propiedades"] }
)

// NUEVO — Cantidad de propiedades por operación, para mostrar contadores
// si hacen falta (ej: "Ventas (12)").
export const getConteoPorOperacion = unstable_cache(
  async () => {
    const { data } = await supabase.from("propiedades").select("operacion")
    const conteo: Record<string, number> = {}
    data?.forEach((row: { operacion?: string }) => {
      const op = row.operacion || "Venta"
      conteo[op] = (conteo[op] || 0) + 1
    })
    return conteo
  },
  ["propiedades-conteo-operacion"],
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
