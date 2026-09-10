export type BloqueoTemporada = { id: string; fecha_desde: string; fecha_hasta: string; estado: "ACTIVO" | "CANCELADO" }

export function esTemporada(operacion?: string | null) {
  return operacion === "Alquiler temporada"
}

export function diasDelMes(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function fechaValida(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  return year >= 1000 && year <= 9999 && month >= 1 && month <= 12 && day >= 1 && day <= diasDelMes(year, month)
}

export function seSuperponen(desde: string, hasta: string, bloqueo: BloqueoTemporada) {
  return bloqueo.estado === "ACTIVO" && bloqueo.fecha_desde <= hasta && bloqueo.fecha_hasta >= desde
}

export function mostrarFecha(fecha: string) {
  return fecha.split("-").reverse().join("/")
}

export function mesArgentina() {
  const partes = new Intl.DateTimeFormat("en", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit" }).formatToParts(new Date())
  return `${partes.find(p => p.type === "year")!.value}-${partes.find(p => p.type === "month")!.value}`
}
