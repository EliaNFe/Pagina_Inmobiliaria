import { createClient } from "@supabase/supabase-js"

export type Propiedad = {
  id: string
  titulo: string
  descripcion: string
  tipo: string
  precio: number
  superficie: number
  ubicacion: string
  imagen_url: string
  destacada: boolean
  created_at: string
}

export type PropiedadImagen = {
  id: string
  propiedad_id: string
  url: string
  orden: number
}

export type Configuracion = {
  clave: string
  valor: string
}

export type Database = {
  public: {
    Tables: {
      propiedades: { Row: Propiedad; Insert: Partial<Propiedad>; Update: Partial<Propiedad> }
      propiedad_imagenes: { Row: PropiedadImagen; Insert: Partial<PropiedadImagen>; Update: Partial<PropiedadImagen> }
      configuracion: { Row: Configuracion; Insert: Partial<Configuracion>; Update: Partial<Configuracion> }
    }
  }
}

let client: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (!client) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}