import type { SupabaseClient } from "@supabase/supabase-js"

export type EventoAuditoria = {
  usuarioEmail: string
  accion: string
  entidad: "propiedad" | "imagen" | "configuracion"
  entidadId?: string
  entidadTitulo?: string
  detalle?: Record<string, unknown>
}

export async function registrarActividad(
  supabase: SupabaseClient,
  evento: EventoAuditoria
) {
  try {
    const { error } = await supabase.from("actividad_admin").insert({
      usuario_email: evento.usuarioEmail,
      accion: evento.accion,
      entidad: evento.entidad,
      entidad_id: evento.entidadId,
      entidad_titulo: evento.entidadTitulo,
      detalle: evento.detalle,
    })

    if (error) {
      console.error("Error al registrar actividad administrativa:", error)
    }
  } catch (error) {
    console.error("Error inesperado al registrar actividad administrativa:", error)
  }
}
