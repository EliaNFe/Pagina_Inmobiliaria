import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Propiedades destacadas para el home — caché de 5 minutos
export const getPropiedadesDestacadas = unstable_cache(
  async () => {
    const { data } = await supabase
      .from("propiedades")
      .select("*")
      .eq("destacada", true)
      .limit(6)
    return data
  },
  ["propiedades-destacadas"],
  { revalidate: 300 }
)

// Todas las propiedades con paginado — caché de 5 minutos
export const getPropiedades = unstable_cache(
  async (pagina: number = 1) => {
    const POR_PAGINA = 12
    const desde = (pagina - 1) * POR_PAGINA
    const hasta = desde + POR_PAGINA - 1

    const { data, count } = await supabase
      .from("propiedades")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(desde, hasta)

    return { data, count }
  },
  ["propiedades"],
  { revalidate: 300 }
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
  { revalidate: 600 }
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
  { revalidate: 600 }
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
  { revalidate: 600 }
)