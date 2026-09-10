type ErrorDisponibilidad = { code?: string; message?: string; details?: string; hint?: string }

export function mensajeErrorDisponibilidad(error: ErrorDisponibilidad, operacion: "bloquear" | "cancelar") {
  switch (error.code) {
    case "42501":
      return "Supabase no permitió guardar la disponibilidad. Hay que revisar los permisos y las políticas RLS de bloqueos_temporada para tu usuario administrador. (42501)"
    case "23502":
      return "Supabase exige un campo obligatorio que no recibió. Revisá el detalle del error en la terminal del servidor. (23502)"
    case "23P01":
      return "El rango se superpone con otro bloqueo. Elegí otras fechas."
    case "23514":
      return "La base rechazó el rango o el estado del bloqueo por una restricción. Revisá el detalle en la terminal del servidor. (23514)"
    case "23503":
      return "La propiedad ya no está disponible para guardar este bloqueo. Actualizá la página. (23503)"
    case "PGRST116":
      return "No se pudo confirmar el bloqueo guardado. Actualizá el calendario antes de reintentar y revisá los permisos de lectura. (PGRST116)"
    default:
      return `No se pudo ${operacion} el rango. Revisá el detalle en la terminal del servidor.${error.code && /^[A-Z0-9]{5,12}$/.test(error.code) ? ` (${error.code})` : ""}`
  }
}
