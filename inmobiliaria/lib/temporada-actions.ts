"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { supabase as publico } from "@/lib/supabase"
import { registrarActividad } from "@/lib/auditoria"
import { esTemporada, fechaValida, mostrarFecha, type BloqueoTemporada } from "@/lib/temporada"
import { mensajeErrorDisponibilidad } from "@/lib/temporada-errores"

const uuid = (id: unknown): id is string => typeof id === "string" && /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)
type Resultado = { data?: BloqueoTemporada[]; error?: string }

async function contexto(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Ingresá al panel para administrar la disponibilidad.")
  // Mismo modelo de acceso que property-actions: sesión administrativa + RLS.
  const { data, error } = await supabase.from("propiedades").select("titulo, operacion").eq("id", id).single()
  if (error || !data || !esTemporada(data.operacion)) throw new Error("La propiedad debe ser de alquiler temporada.")
  return { supabase, user, propiedad: data }
}

export async function consultarTemporada(id: string, desde: string, hasta: string, admin = false): Promise<Resultado> {
  if (!uuid(id) || !fechaValida(desde) || !fechaValida(hasta) || hasta < desde || desde.slice(0, 7) !== hasta.slice(0, 7)) return { error: "Mes inválido." }
  try {
    let cliente = publico
    if (admin) cliente = (await contexto(id)).supabase
    else {
      const { data, error } = await publico.from("propiedades").select("id").eq("id", id).eq("operacion", "Alquiler temporada").eq("disponible", true).single()
      if (error || !data) return { error: "No se pudo consultar la disponibilidad." }
    }
    const { data, error } = await cliente.from("bloqueos_temporada").select("id, fecha_desde, fecha_hasta, estado")
      .eq("propiedad_id", id).eq("estado", "ACTIVO").lte("fecha_desde", hasta).gte("fecha_hasta", desde).order("fecha_desde").limit(100)
    if (error) return { error: "No se pudo cargar la disponibilidad. Intentá nuevamente." }
    // Un mes tiene como máximo 31 rangos activos no superpuestos. Nunca mostrar datos truncados como libres.
    if ((data?.length ?? 0) >= 100) return { error: "No se pudo verificar la disponibilidad de este mes." }
    return { data: data as BloqueoTemporada[] }
  } catch {
    return { error: "No se pudo consultar la disponibilidad. Verificá tu conexión y sesión." }
  }
}

export async function bloquearTemporada(id: string, desde: string, hasta: string) {
  if (!uuid(id) || !fechaValida(desde) || !fechaValida(hasta) || hasta < desde) return { error: "Ingresá un rango válido: Hasta debe ser igual o posterior a Desde." }
  try {
    const { supabase, user, propiedad } = await contexto(id)
    const { data: cruces, error: lectura } = await supabase.from("bloqueos_temporada").select("id")
      .eq("propiedad_id", id).eq("estado", "ACTIVO").lte("fecha_desde", hasta).gte("fecha_hasta", desde).limit(1)
    if (lectura) return { error: "No se pudo verificar si las fechas están libres." }
    if (cruces?.length) return { error: "El rango se superpone con fechas ocupadas. Elegí otro rango." }
    const ahora = new Date().toISOString()
    const { data, error } = await supabase.from("bloqueos_temporada").insert({ id: randomUUID(), propiedad_id: id, fecha_desde: desde, fecha_hasta: hasta, estado: "ACTIVO", created_at: ahora, updated_at: ahora }).select("id").single()
    if (error || !data) {
      console.error("Error al insertar en bloqueos_temporada:", error ?? { message: "La inserción no devolvió el bloqueo." })
      return { error: mensajeErrorDisponibilidad(error ?? {}, "bloquear") }
    }
    await registrarActividad(supabase, { usuarioEmail: user.email ?? "Sin email", accion: "editar", entidad: "propiedad", entidadId: id, entidadTitulo: propiedad.titulo,
      detalle: { disponibilidad: { antes: "Disponible", despues: `Bloqueó disponibilidad del ${mostrarFecha(desde)} al ${mostrarFecha(hasta)}` }, bloqueo_id: data.id } })
    revalidatePath(`/propiedades/${id}`)
    revalidatePath(`/admin/propiedades/${id}`)
    revalidatePath("/admin/actividad")
    return { success: true }
  } catch (error) {
    console.error("Error inesperado al bloquear disponibilidad:", error)
    return { error: "No se pudo bloquear el rango. Verificá tu sesión administrativa." }
  }
}

export async function cancelarTemporada(id: string, bloqueoId: string) {
  if (!uuid(id) || !uuid(bloqueoId)) return { error: "Bloqueo inválido." }
  try {
    const { supabase, user, propiedad } = await contexto(id)
    const { data, error } = await supabase.from("bloqueos_temporada").update({ estado: "CANCELADO", updated_at: new Date().toISOString() })
      .eq("id", bloqueoId).eq("propiedad_id", id).eq("estado", "ACTIVO").select("fecha_desde, fecha_hasta").single()
    if (error || !data) {
      console.error("Error al cancelar en bloqueos_temporada:", error ?? { message: "No se encontró un bloqueo activo visible." })
      return { error: mensajeErrorDisponibilidad(error ?? {}, "cancelar") }
    }
    await registrarActividad(supabase, { usuarioEmail: user.email ?? "Sin email", accion: "editar", entidad: "propiedad", entidadId: id, entidadTitulo: propiedad.titulo,
      detalle: { disponibilidad: { antes: "Ocupado", despues: `Canceló bloqueo del ${mostrarFecha(data.fecha_desde)} al ${mostrarFecha(data.fecha_hasta)}` }, bloqueo_id: bloqueoId } })
    revalidatePath(`/propiedades/${id}`)
    revalidatePath(`/admin/propiedades/${id}`)
    revalidatePath("/admin/actividad")
    return { success: true }
  } catch { return { error: "No se pudo cancelar el bloqueo. Verificá tu sesión administrativa." } }
}
