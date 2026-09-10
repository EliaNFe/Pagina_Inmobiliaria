export const PROPIEDADES_POR_PAGINA = 12
export const TIPOS_PROPIEDAD = ["Terreno", "Casa", "Lote", "Departamento", "Local comercial"]

export function leerFiltrosAdmin(params: Record<string, string | string[] | undefined>) {
  const texto = (key: string) => typeof params[key] === "string" ? params[key].trim() : ""
  const numero = Number(texto("pagina"))
  return {
    ubicacion: texto("ubicacion").slice(0, 200),
    tipo: texto("tipo"),
    operacion: texto("operacion"),
    disponibilidad: ["disponibles", "no-disponibles"].includes(texto("disponibilidad")) ? texto("disponibilidad") : "",
    pagina: Number.isSafeInteger(numero) && numero > 0 ? Math.min(numero, 1000000) : 1,
  }
}

export type FiltrosAdmin = ReturnType<typeof leerFiltrosAdmin>

export function urlAdmin(filtros: FiltrosAdmin, pagina: number) {
  const params = new URLSearchParams()
  for (const key of ["ubicacion", "tipo", "operacion", "disponibilidad"] as const) {
    if (filtros[key]) params.set(key, filtros[key])
  }
  if (pagina > 1) params.set("pagina", String(pagina))
  return `/admin${params.size ? `?${params}` : ""}`
}

export function patronUbicacion(ubicacion: string) {
  return `%${ubicacion.replace(/[\\%_]/g, "\\$&")}%`
}
