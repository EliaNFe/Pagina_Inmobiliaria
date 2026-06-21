import { getConfiguracion } from "@/lib/supabase"
import Link from "next/link"

export default async function Contacto() {
  const config = await getConfiguracion()

  return (
    <main>
      <section style={{background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 100%)"}} className="text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#FED7AA", textTransform: "uppercase", marginBottom: "12px"}}>Contacto</p>
          <h1 style={{fontSize: "2.5rem", fontWeight: 700, color: "#fff"}}>Hablemos</h1>
          <p style={{color: "rgba(255,255,255,0.65)", marginTop: "8px"}}>Sin formularios complicados. Elegí cómo contactarnos.</p>
        </div>
      </section>

      <section style={{background: "#FFF7ED"}} className="py-20">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 style={{fontSize: "1.25rem", fontWeight: 700, color: "#1C0A00", marginBottom: "20px"}}>Medios de contacto</h2>
            <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
              {config.whatsapp && (
                <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px",
                  padding: "16px 20px", textDecoration: "none"
                }}>
                  <div style={{width: "40px", height: "40px", background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A", fontWeight: 700, fontSize: "16px"}}>W</div>
                  <div>
                    <p style={{fontWeight: 600, color: "#1C0A00", fontSize: "14px"}}>WhatsApp</p>
                    <p style={{color: "#92400E", fontSize: "12px", marginTop: "2px"}}>Respuesta rápida — lunes a sábado</p>
                  </div>
                </a>
              )}
              {config.email && (
                <a href={`mailto:${config.email}`} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px",
                  padding: "16px 20px", textDecoration: "none"
                }}>
                  <div style={{width: "40px", height: "40px", background: "#FFF7ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2540A", fontWeight: 700, fontSize: "16px"}}>@</div>
                  <div>
                    <p style={{fontWeight: 600, color: "#1C0A00", fontSize: "14px"}}>Email</p>
                    <p style={{color: "#92400E", fontSize: "12px", marginTop: "2px"}}>{config.email}</p>
                  </div>
                </a>
              )}
              {config.telefono && (
                <a href={`tel:${config.telefono}`} style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px",
                  padding: "16px 20px", textDecoration: "none"
                }}>
                  <div style={{width: "40px", height: "40px", background: "#EFF6FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", fontWeight: 700, fontSize: "16px"}}>T</div>
                  <div>
                    <p style={{fontWeight: 600, color: "#1C0A00", fontSize: "14px"}}>Teléfono</p>
                    <p style={{color: "#92400E", fontSize: "12px", marginTop: "2px"}}>{config.telefono}</p>
                  </div>
                </a>
              )}
            </div>
            {config.horario && (
              <div style={{marginTop: "20px", background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px", padding: "16px 20px"}}>
                <p style={{fontWeight: 700, color: "#C2540A", fontSize: "13px", marginBottom: "6px"}}>Horario de atención</p>
                <p style={{color: "#92400E", fontSize: "13px", lineHeight: 1.6}}>{config.horario}</p>
              </div>
            )}
          </div>

          <div>
            <h2 style={{fontSize: "1.25rem", fontWeight: 700, color: "#1C0A00", marginBottom: "20px"}}>Ubicación</h2>
            <div style={{background: "#fff", border: "1px solid #FFE4CC", borderRadius: "12px", padding: "20px", marginBottom: "12px"}}>
              <p style={{fontWeight: 700, color: "#1C0A00", fontSize: "14px", marginBottom: "4px"}}>Inmobiliaria Liliana Cirigliano</p>
              <p style={{color: "#92400E", fontSize: "13px", lineHeight: 1.6}}>{config.direccion || "Necochea, Buenos Aires"}</p>
            </div>
            <div style={{background: "#FFE4CC", borderRadius: "12px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <p style={{color: "#C2540A", fontSize: "13px", opacity: 0.6}}>Mapa — próximamente</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{background: "#0C0500"}} className="py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{color: "rgba(255,255,255,0.35)", fontSize: "13px"}}>© 2025 Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires</p>
          <div style={{display: "flex", gap: "24px"}}>
            {[{href: "/propiedades", label: "Propiedades"}, {href: "/nosotros", label: "Nosotros"}, {href: "/contacto", label: "Contacto"}].map(l => (
              <Link key={l.href} href={l.href} style={{color: "rgba(255,255,255,0.35)", fontSize: "13px", textDecoration: "none"}}>{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
