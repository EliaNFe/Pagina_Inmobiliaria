import { getPropiedad, getImagenesPropiedad } from "@/lib/supabase"
import Link from "next/link"
import CarruselImagenes from "@/components/CarruselImagenes"

export default async function DetallePropiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const propiedad = await getPropiedad(id)
  const imagenes = await getImagenesPropiedad(id)

  if (!propiedad) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p style={{color: "#92400E", fontSize: "18px", marginBottom: "16px"}}>Propiedad no encontrada</p>
          <Link href="/propiedades" style={{color: "#C2540A", fontWeight: 600, fontSize: "14px", textDecoration: "none"}}>
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    )
  }

  const todasLasImagenes = [
    ...(propiedad.imagen_url ? [propiedad.imagen_url] : []),
    ...(imagenes?.map(i => i.url) || [])
  ]

  return (
    <main style={{background: "#FFF7ED", minHeight: "100vh"}}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        <Link href="/propiedades" style={{color: "#92400E", fontSize: "14px", textDecoration: "none", display: "inline-block", marginBottom: "24px"}}>
          ← Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} />
          </div>

          <div>
            <span style={{
              display: "inline-block", background: "#FEE2CC", color: "#7C2D12",
              fontSize: "11px", fontWeight: 700, padding: "5px 12px",
              borderRadius: "999px", letterSpacing: "0.05em", marginBottom: "16px"
            }}>
              {propiedad.tipo}
            </span>
            <h1 style={{fontSize: "2rem", fontWeight: 700, color: "#1C0A00", marginBottom: "8px", lineHeight: 1.2}}>{propiedad.titulo}</h1>
            <p style={{color: "#92400E", fontSize: "14px", marginBottom: "24px"}}>{propiedad.ubicacion}</p>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px"}}>
              <div style={{background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #FFE4CC"}}>
                <p style={{fontSize: "11px", color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px"}}>Precio</p>
                <p style={{fontSize: "1.75rem", fontWeight: 800, color: "#C2540A"}}>${propiedad.precio?.toLocaleString()}</p>
              </div>
              <div style={{background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #FFE4CC"}}>
                <p style={{fontSize: "11px", color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px"}}>Superficie</p>
                <p style={{fontSize: "1.75rem", fontWeight: 800, color: "#1C0A00"}}>{propiedad.superficie} m²</p>
              </div>
            </div>

            {propiedad.descripcion && (
              <div style={{marginBottom: "24px"}}>
                <p style={{fontSize: "11px", color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px"}}>Descripción</p>
                <p style={{color: "#78350F", lineHeight: 1.8, fontSize: "14px"}}>{propiedad.descripcion}</p>
              </div>
            )}

            <Link href="/contacto" style={{
              display: "block", textAlign: "center",
              background: "#C2540A", color: "#fff",
              fontWeight: 700, padding: "16px", borderRadius: "12px",
              textDecoration: "none", fontSize: "15px",
              boxShadow: "0 4px 16px rgba(194,84,10,0.25)"
            }}>
              Consultar por esta propiedad
            </Link>
            <p style={{textAlign: "center", color: "#92400E", fontSize: "12px", marginTop: "10px"}}>Respondemos en menos de 24hs</p>
          </div>
        </div>
      </div>

      <footer style={{background: "#0C0500", marginTop: "48px"}} className="py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{color: "rgba(255,255,255,0.35)", fontSize: "13px"}}>© 2025 Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires</p>
          <div style={{display: "flex", gap: "24px"}}>
            {[
              {href: "/propiedades", label: "Propiedades"},
              {href: "/nosotros", label: "Nosotros"},
              {href: "/contacto", label: "Contacto"},
            ].map(l => (
              <Link key={l.href} href={l.href} style={{color: "rgba(255,255,255,0.35)", fontSize: "13px", textDecoration: "none"}}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
