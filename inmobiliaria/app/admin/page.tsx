import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

// OBLIGAMOS a Next.js a tratar esta ruta como dinámica (para evitar errores en el build)
export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("*")
    .order("created_at", { ascending: false })

  // Salvaguarda: si propiedades es null, aseguramos un array vacío
  const listaPropiedades = propiedades || []

  const total = listaPropiedades.length
  const marcadasDestacadas = listaPropiedades.filter(p => p.destacada)
  const destacadas = marcadasDestacadas.length

  // LÍMITE DEL HOME: tiene que coincidir exactamente con el .limit(6) +
  // order(created_at desc) de getPropiedadesDestacadas en lib/supabase.ts.
  // Si cambiás el límite ahí, cambialo también acá.
  const LIMITE_HOME = 6

  // listaPropiedades ya viene ordenada por created_at desc (línea de arriba),
  // así que las primeras N marcadas que aparezcan en este orden son
  // exactamente las que el home va a mostrar.
  const idsVisiblesEnHome = new Set(
    marcadasDestacadas.slice(0, LIMITE_HOME).map(p => p.id)
  )
  const excedenLimite = destacadas - idsVisiblesEnHome.size

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto py-10 px-6">

        <div className="flex justify-between items-center mb-8">
          <div>
            <p style={{fontSize: "11px", color: "#92400E", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px"}}>Panel Admin</p>
            <h1 style={{fontSize: "1.75rem", fontWeight: 700, color: "#1C0A00"}}>Inmobiliaria Liliana Cirigliano</h1>
          </div>
          <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
            <Link href="/admin/configuracion" style={{
              background: "#FFF7ED", color: "#C2540A", border: "1px solid #FFE4CC",
              fontWeight: 600, padding: "8px 16px", borderRadius: "8px",
              textDecoration: "none", fontSize: "13px"
            }}>
              Configuración
            </Link>
            <Link href="/admin/propiedades/nueva" style={{
              background: "#C2540A", color: "#fff",
              fontWeight: 600, padding: "8px 16px", borderRadius: "8px",
              textDecoration: "none", fontSize: "13px"
            }}>
              + Nueva propiedad
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" style={{background: "none", border: "none", color: "#92400E", fontSize: "13px", cursor: "pointer", padding: "8px"}}>
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: excedenLimite > 0 ? "16px" : "24px"}}>
          {[
            {label: "Total propiedades", value: total, color: "#1C0A00"},
            {label: `Destacadas (máx. ${LIMITE_HOME} en home)`, value: destacadas, color: "#C2540A"},
            {label: "No destacadas", value: total - destacadas, color: "#92400E"},
          ].map(s => (
            <div key={s.label} style={{background: "#fff", borderRadius: "12px", border: "1px solid #FFE4CC", padding: "20px"}}>
              <p style={{fontSize: "11px", color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>{s.label}</p>
              <p style={{fontSize: "2rem", fontWeight: 800, color: s.color}}>{s.value}</p>
            </div>
          ))}
        </div>

        {excedenLimite > 0 && (
          <div style={{
            background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "12px",
            padding: "14px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px"
          }}>
            <span style={{fontSize: "18px"}}>⚠️</span>
            <p style={{fontSize: "13px", color: "#92400E"}}>
              Marcaste <strong>{destacadas}</strong> propiedades como destacadas, pero el home solo muestra un máximo de <strong>{LIMITE_HOME}</strong>.
              {" "}{excedenLimite === 1 ? "Hay 1 propiedad marcada que no se ve" : `Hay ${excedenLimite} propiedades marcadas que no se ven`} en el home (mirá la columna &quot;Home&quot; abajo).
            </p>
          </div>
        )}

        <div style={{background: "#fff", borderRadius: "16px", border: "1px solid #FFE4CC", overflow: "hidden"}}>
          <div style={{padding: "16px 24px", borderBottom: "1px solid #FFF7ED"}}>
            <h2 style={{fontSize: "14px", fontWeight: 600, color: "#1C0A00"}}>Todas las propiedades</h2>
          </div>
          <table style={{width: "100%", borderCollapse: "collapse"}}>
            <thead>
              <tr style={{background: "#FFF7ED"}}>
                {["Propiedad", "Tipo", "Precio", "Home", ""].map(h => (
                  <th key={h} style={{textAlign: "left", padding: "10px 24px", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listaPropiedades.map((propiedad) => (
                <tr key={propiedad.id} style={{borderTop: "1px solid #FFF7ED"}}>
                  <td style={{padding: "14px 24px"}}>
                    <p style={{fontWeight: 600, color: "#1C0A00", fontSize: "14px"}}>{propiedad.titulo}</p>
                    <p style={{color: "#92400E", fontSize: "12px", marginTop: "2px"}}>{propiedad.ubicacion}</p>
                  </td>
                  <td style={{padding: "14px 24px"}}>
                    <span style={{background: "#FFF7ED", color: "#92400E", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "999px"}}>{propiedad.tipo}</span>
                  </td>
                  <td style={{padding: "14px 24px", fontWeight: 600, color: "#C2540A", fontSize: "14px"}}>${propiedad.precio?.toLocaleString()}</td>
                  <td style={{padding: "14px 24px"}}>
                    {!propiedad.destacada ? (
                      <span style={{background: "#F5F5F4", color: "#78716C", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "999px"}}>No</span>
                    ) : idsVisiblesEnHome.has(propiedad.id) ? (
                      <span style={{background: "#FFF7ED", color: "#C2540A", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px"}}>Sí, visible</span>
                    ) : (
                      <span title={`Marcada como destacada, pero no entra en el límite de ${LIMITE_HOME}`} style={{background: "#FEF3C7", color: "#92400E", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px"}}>
                        Marcada, no visible
                      </span>
                    )}
                  </td>
                  <td style={{padding: "14px 24px"}}>
                    <Link href={`/admin/propiedades/${propiedad.id}`} style={{color: "#C2540A", fontSize: "13px", fontWeight: 600, textDecoration: "none"}}>
                      Editar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  )
}
