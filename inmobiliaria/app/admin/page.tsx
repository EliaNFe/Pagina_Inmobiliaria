import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"
import PropiedadesTable from "@/components/PropiedadesTable"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false })

  const listaPropiedades = propiedades || []

  const total = listaPropiedades.length
  const marcadasDestacadas = listaPropiedades.filter(p => p.destacada)
  const destacadas = marcadasDestacadas.length

  const LIMITE_HOME = 10
  const idsVisiblesEnHome = marcadasDestacadas.slice(0, LIMITE_HOME).map(p => p.id)
  const excedenLimite = destacadas - idsVisiblesEnHome.length

  return (
    <main className="min-h-screen" style={{ background: "#FDFBF9" }}>
      <div className="max-w-6xl mx-auto py-10 px-6">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: excedenLimite > 0 ? "16px" : "28px" }}>
          {[
            { label: "Total propiedades", value: total, dark: true },
            { label: `Destacadas (máx. ${LIMITE_HOME} en home)`, value: destacadas, dark: false, accent: true },
            { label: "No destacadas", value: total - destacadas, dark: false },
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
          propiedades={listaPropiedades as never}
          idsVisiblesEnHome={idsVisiblesEnHome}
          limiteHome={LIMITE_HOME}
        />

      </div>
    </main>
  )
}
