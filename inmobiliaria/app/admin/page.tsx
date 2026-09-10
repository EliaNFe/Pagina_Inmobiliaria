import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import PropiedadesTable from "@/components/PropiedadesTable"
import { leerFiltrosAdmin, patronUbicacion, PROPIEDADES_POR_PAGINA, TIPOS_PROPIEDAD, urlAdmin } from "@/lib/admin-propiedades"

export const dynamic = "force-dynamic"

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const filtros = leerFiltrosAdmin(await searchParams)
  const LIMITE_HOME = 10
  function consulta() {
    let query = supabase.from("propiedades").select("id,titulo,ubicacion,tipo,operacion,moneda,precio,destacada,disponible", { count: "exact" })
    if (filtros.ubicacion) query = query.ilike("ubicacion", patronUbicacion(filtros.ubicacion))
    if (filtros.tipo) query = query.eq("tipo", filtros.tipo)
    if (filtros.operacion === "Venta") query = query.or("operacion.eq.Venta,operacion.is.null")
    else if (filtros.operacion) query = query.eq("operacion", filtros.operacion)
    if (filtros.disponibilidad) query = query.eq("disponible", filtros.disponibilidad === "disponibles")
    return query.order("created_at", { ascending: false }).order("id")
  }
  async function obtenerTipos() {
    const tipos = new Set(TIPOS_PROPIEDAD)
    for (let desde = 0; ; desde += 1000) {
      const { data, error } = await supabase.from("propiedades").select("tipo").order("id").range(desde, desde + 999)
      if (error) throw new Error("No se pudieron cargar las categorías.")
      for (const p of data ?? []) if (p.tipo) tipos.add(p.tipo)
      if (!data || data.length < 1000) break
    }
    return [...tipos].sort((a, b) => a.localeCompare(b, "es"))
  }
  const desde = (filtros.pagina - 1) * PROPIEDADES_POR_PAGINA
  const [resultado, totales, ocultas, destacadasResultado, tipos] = await Promise.all([
    consulta().range(desde, desde + PROPIEDADES_POR_PAGINA - 1),
    supabase.from("propiedades").select("id", { count: "exact", head: true }),
    supabase.from("propiedades").select("id", { count: "exact", head: true }).eq("disponible", false),
    supabase.from("propiedades").select("id", { count: "exact" }).eq("destacada", true).eq("disponible", true).order("created_at", { ascending: false }).limit(LIMITE_HOME),
    obtenerTipos(),
  ])
  if (resultado.error || totales.error || ocultas.error || destacadasResultado.error) throw new Error("No se pudieron cargar las propiedades. Intentá nuevamente.")
  const totalFiltrado = resultado.count ?? 0
  const paginas = Math.max(1, Math.ceil(totalFiltrado / PROPIEDADES_POR_PAGINA))
  if (filtros.pagina > paginas) redirect(urlAdmin(filtros, paginas))
  const listaPropiedades = resultado.data ?? []
  const total = totales.count ?? 0
  const destacadas = destacadasResultado.count ?? 0
  const idsVisiblesEnHome = (destacadasResultado.data ?? []).map(p => p.id)
  const excedenLimite = destacadas - idsVisiblesEnHome.length

  return (
    <main className="min-h-screen" style={{ background: "#FDFBF9" }}>
      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: "24px", height: "1.5px", background: "#C2540A" }} />
              <span style={{ fontSize: "11px", color: "#C2540A", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                Panel Admin
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: "1.85rem", fontWeight: 800, color: "#1C0A00" }}>
              Inmobiliaria Liliana Cirigliano
            </h1>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Link
              href="/admin/actividad"
              style={{
                background: "#fff", color: "#1C0A00", border: "1px solid #F0E4D8",
                fontWeight: 600, padding: "10px 18px", borderRadius: "4px",
                textDecoration: "none", fontSize: "13px"
              }}
            >
              Actividad
            </Link>
            <Link
              href="/admin/configuracion"
              style={{
                background: "#fff", color: "#1C0A00", border: "1px solid #F0E4D8",
                fontWeight: 600, padding: "10px 18px", borderRadius: "4px",
                textDecoration: "none", fontSize: "13px"
              }}
            >
              Configuración
            </Link>
            <Link
              href="/admin/propiedades/nueva"
              style={{
                background: "#C2540A", color: "#fff",
                fontWeight: 600, padding: "10px 18px", borderRadius: "4px",
                textDecoration: "none", fontSize: "13px"
              }}
            >
              + Nueva propiedad
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" style={{ background: "none", border: "none", color: "#A8A29E", fontSize: "13px", cursor: "pointer", padding: "10px 6px" }}>
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: excedenLimite > 0 ? "16px" : "28px" }}>
          {[
            { label: "Total propiedades", value: total, dark: true },
            { label: `Destacadas (máx. ${LIMITE_HOME} en home)`, value: destacadas, dark: false, accent: true },
            { label: "No disponibles", value: ocultas.count ?? 0, dark: false },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: s.dark ? "#1C0A00" : (s.accent ? "#C2540A" : "#fff"),
                border: s.dark || s.accent ? "none" : "1px solid #F0E4D8",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <p style={{
                fontSize: "11px",
                color: s.dark || s.accent ? "rgba(255,255,255,0.6)" : "#A8A29E",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px"
              }}>
                {s.label}
              </p>
              <p className="font-display" style={{ fontSize: "2.25rem", fontWeight: 800, color: s.dark || s.accent ? "#fff" : "#1C0A00" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {excedenLimite > 0 && (
          <div style={{
            background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "8px",
            padding: "14px 20px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px"
          }}>
            <span style={{ fontSize: "18px" }}>⚠️</span>
            <p style={{ fontSize: "13px", color: "#92400E" }}>
              Marcaste <strong>{destacadas}</strong> propiedades como destacadas, pero el home solo muestra un máximo de <strong>{LIMITE_HOME}</strong>.
              {" "}{excedenLimite === 1 ? "Hay 1 propiedad marcada que no se ve" : `Hay ${excedenLimite} propiedades marcadas que no se ven`} en el home.
            </p>
          </div>
        )}

        <PropiedadesTable
          key={JSON.stringify([filtros, listaPropiedades])}
          filtros={filtros}
          tipos={tipos}
          totalFiltrado={totalFiltrado}
          propiedades={listaPropiedades as never}
          idsVisiblesEnHome={idsVisiblesEnHome}
          limiteHome={LIMITE_HOME}
        />

      </div>
    </main>
  )
}
