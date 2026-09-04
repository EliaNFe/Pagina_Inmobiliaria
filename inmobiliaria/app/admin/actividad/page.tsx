import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const EVENTOS_POR_PAGINA = 30

type Cambio = {
  antes?: unknown
  despues?: unknown
}

type EventoActividad = {
  id: string
  usuario_email: string
  accion: string
  entidad: string
  entidad_id: string | null
  entidad_titulo: string | null
  detalle: Record<string, unknown> | null
  created_at: string
}

const acciones: Record<string, string> = {
  crear: "creó",
  editar: "editó",
  borrar: "borró",
  reordenar_fotos: "reordenó las fotos de",
  borrar_foto: "borró una foto de",
  agregar_fotos: "agregó fotos a",
  guardar_configuracion: "guardó la configuración",
}

function mostrarValor(valor: unknown) {
  if (valor === null || valor === undefined || valor === "") return "—"
  if (typeof valor === "boolean") return valor ? "Sí" : "No"
  return String(valor)
}

function formatearCampo(campo: string) {
  return campo.replaceAll("_", " ")
}

function esCambio(valor: unknown): valor is Cambio {
  return Boolean(
    valor &&
    typeof valor === "object" &&
    ("antes" in valor || "despues" in valor)
  )
}

function textoAccion(evento: EventoActividad) {
  if (evento.accion === "agregar_fotos") {
    const cantidad = evento.detalle?.cantidad
    if (typeof cantidad === "number") {
      return cantidad === 1 ? "agregó una foto a" : `agregó ${cantidad} fotos a`
    }
  }
  return acciones[evento.accion] || evento.accion
}

function fechaValida(fecha?: string) {
  return fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : undefined
}

function hrefPagina(pagina: number, desde?: string, hasta?: string) {
  const params = new URLSearchParams({ pagina: String(pagina) })
  if (desde) params.set("desde", desde)
  if (hasta) params.set("hasta", hasta)
  return `/admin/actividad?${params.toString()}`
}

export default async function ActividadAdmin({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; desde?: string; hasta?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const {
    pagina: paginaParam,
    desde: desdeParam,
    hasta: hastaParam,
  } = await searchParams
  const fechaDesde = fechaValida(desdeParam)
  const fechaHasta = fechaValida(hastaParam)
  const paginaSolicitada = Number.parseInt(paginaParam ?? "1", 10)
  const pagina = Number.isFinite(paginaSolicitada) && paginaSolicitada > 0
    ? paginaSolicitada
    : 1
  const desde = (pagina - 1) * EVENTOS_POR_PAGINA
  const hasta = desde + EVENTOS_POR_PAGINA - 1

  let consulta = supabase
    .from("actividad_admin")
    .select("id, usuario_email, accion, entidad, entidad_id, entidad_titulo, detalle, created_at", { count: "exact" })
    .order("created_at", { ascending: false })

  if (fechaDesde) {
    consulta = consulta.gte("created_at", `${fechaDesde}T00:00:00-03:00`)
  }
  if (fechaHasta) {
    consulta = consulta.lte("created_at", `${fechaHasta}T23:59:59.999-03:00`)
  }

  const { data, count, error } = await consulta.range(desde, hasta)

  const eventos = (data || []) as EventoActividad[]
  const totalPaginas = Math.max(1, Math.ceil((count || 0) / EVENTOS_POR_PAGINA))
  const formatoFecha = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  })

  return (
    <main className="min-h-screen" style={{ background: "#FDFBF9" }}>
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <Link href="/admin" style={{ color: "#92400E", fontSize: "14px", textDecoration: "none" }}>
              ← Volver al panel
            </Link>
            <h1 className="font-display" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1C0A00", marginTop: "14px" }}>
              Actividad administrativa
            </h1>
            <p style={{ color: "#92400E", fontSize: "13px", marginTop: "6px" }}>
              Últimos cambios realizados en el panel.
            </p>
          </div>
          <span style={{ color: "#92400E", fontSize: "12px" }}>
            {count || 0} {(count || 0) === 1 ? "evento" : "eventos"}
          </span>
        </div>

        <form
          method="GET"
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          style={{ background: "#fff", border: "1px solid #FFE4CC", borderRadius: "10px", padding: "16px 18px", marginBottom: "20px" }}
        >
          <label style={{ color: "#92400E", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Desde
            <input
              type="date"
              name="desde"
              defaultValue={fechaDesde}
              style={{ display: "block", marginTop: "7px", border: "1px solid #FFE4CC", borderRadius: "6px", padding: "9px 11px", color: "#1C0A00", fontSize: "13px" }}
            />
          </label>
          <label style={{ color: "#92400E", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Hasta
            <input
              type="date"
              name="hasta"
              defaultValue={fechaHasta}
              style={{ display: "block", marginTop: "7px", border: "1px solid #FFE4CC", borderRadius: "6px", padding: "9px 11px", color: "#1C0A00", fontSize: "13px" }}
            />
          </label>
          <div className="flex gap-2">
            <button type="submit" style={{ background: "#C2540A", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 16px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              Filtrar
            </button>
            {(fechaDesde || fechaHasta) && (
              <Link href="/admin/actividad" style={{ background: "#fff", color: "#92400E", border: "1px solid #FFE4CC", borderRadius: "6px", padding: "9px 14px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Limpiar
              </Link>
            )}
          </div>
        </form>

        {error ? (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "14px 18px", borderRadius: "8px" }}>
            No se pudo cargar la actividad.
          </div>
        ) : eventos.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px", padding: "32px", color: "#92400E", textAlign: "center" }}>
            Todavía no hay actividad registrada.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {eventos.map((evento) => {
              const cambios = Object.entries(evento.detalle || {}).filter(
                (entrada): entrada is [string, Cambio] => esCambio(entrada[1])
              )
              const objetivo = evento.entidad_titulo || evento.entidad_id

              return (
                <article key={evento.id} style={{ background: "#fff", border: "1px solid #FFE4CC", borderRadius: "10px", padding: "18px 20px" }}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <p style={{ color: "#1C0A00", fontSize: "14px", lineHeight: 1.5 }}>
                      <strong style={{ fontWeight: 700 }}>{evento.usuario_email}</strong>{" "}
                      <span style={{ color: "#92400E" }}>{textoAccion(evento)}</span>
                      {objetivo && <> <strong style={{ fontWeight: 700 }}>{objetivo}</strong></>}
                    </p>
                    <time dateTime={evento.created_at} style={{ color: "#A8A29E", fontSize: "12px", whiteSpace: "nowrap" }}>
                      {formatoFecha.format(new Date(evento.created_at))}
                    </time>
                  </div>

                  {cambios.length > 0 && (
                    <ul style={{ margin: "12px 0 0", padding: "10px 0 0 18px", borderTop: "1px solid #FFE4CC", color: "#92400E", fontSize: "12px", lineHeight: 1.7 }}>
                      {cambios.map(([campo, cambio]) => (
                        <li key={campo}>
                          <strong>{formatearCampo(campo)}:</strong>{" "}
                          {mostrarValor(cambio.antes)} → {mostrarValor(cambio.despues)}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        )}

        {totalPaginas > 1 && (
          <nav aria-label="Paginación de actividad" className="flex items-center justify-between mt-7">
            {pagina > 1 ? (
              <Link href={hrefPagina(pagina - 1, fechaDesde, fechaHasta)} style={{ color: "#92400E", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                ← Anterior
              </Link>
            ) : <span />}
            <span style={{ color: "#92400E", fontSize: "12px" }}>
              Página {pagina} de {totalPaginas}
            </span>
            {pagina < totalPaginas ? (
              <Link href={hrefPagina(pagina + 1, fechaDesde, fechaHasta)} style={{ color: "#92400E", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                Siguiente →
              </Link>
            ) : <span />}
          </nav>
        )}
      </div>
    </main>
  )
}
