import { getPropiedadesDestacadas } from "@/lib/supabase"
import Link from "next/link"

export default async function Home() {
  const propiedades = await getPropiedadesDestacadas()

  return (
    <main>

      <section style={{
        background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 45%, #EA580C 100%)",
        position: "relative",
        overflow: "hidden"
      }} className="text-white">
        <div style={{
          position: "absolute", inset: 0, opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0zm40 40h40v40H40z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div style={{
          position: "absolute", right: "-120px", top: "-120px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", right: "80px", bottom: "-60px",
          width: "250px", height: "250px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none"
        }} />
        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-44">
          <div className="max-w-2xl">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "999px", padding: "6px 16px", marginBottom: "24px"
            }}>
              <div style={{width: "6px", height: "6px", borderRadius: "50%", background: "#FED7AA"}} />
              <span style={{fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600, color: "#FED7AA"}}>NECOCHEA, BUENOS AIRES</span>
            </div>
            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 700, lineHeight: 1.1, marginBottom: "24px", color: "#fff"
            }}>
              Tu próximo hogar<br />
              <span style={{color: "#FED7AA"}}>está acá.</span>
            </h1>
            <p style={{
              fontSize: "18px", color: "rgba(255,255,255,0.8)",
              lineHeight: 1.7, marginBottom: "40px", maxWidth: "480px"
            }}>
              Más de 20 años acompañando familias a encontrar el lugar donde construir su historia. Terrenos, casas y departamentos en Necochea.
            </p>
            <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
              <Link href="/propiedades" style={{
                background: "#fff", color: "#C2540A",
                fontWeight: 700, padding: "14px 32px", borderRadius: "12px",
                textDecoration: "none", fontSize: "15px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
              }}>
                Ver propiedades
              </Link>
              <Link href="/contacto" style={{
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                color: "#fff", fontWeight: 600, padding: "14px 32px",
                borderRadius: "12px", textDecoration: "none", fontSize: "15px"
              }}>
                Hablar con Liliana
              </Link>
            </div>
          </div>
        </div>
      </section>

      {propiedades && propiedades.length > 0 && (
        <section style={{background: "#FFF7ED"}} className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p style={{fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#C2540A", textTransform: "uppercase", marginBottom: "8px"}}>Selección</p>
                <h2 style={{fontSize: "2rem", fontWeight: 700, color: "#1C0A00"}}>Propiedades destacadas</h2>
              </div>
              <Link href="/propiedades" style={{fontSize: "14px", fontWeight: 600, color: "#C2540A", textDecoration: "none"}}>
                Ver todas →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propiedades.map((propiedad) => (
                <Link key={propiedad.id} href={`/propiedades/${propiedad.id}`} style={{textDecoration: "none"}} className="group">
                  <div style={{
                    background: "#fff", borderRadius: "16px", overflow: "hidden",
                    border: "1px solid #FFE4CC",
                    boxShadow: "0 2px 8px rgba(194,84,10,0.06)"
                  }} className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div style={{position: "relative", height: "210px", overflow: "hidden"}}>
                      {propiedad.imagen_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={propiedad.imagen_url} alt={propiedad.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div style={{width: "100%", height: "100%", background: "#FFE4CC", display: "flex", alignItems: "center", justifyContent: "center"}}>
                          <span style={{color: "#C2540A", fontSize: "13px", opacity: 0.5}}>Sin imagen</span>
                        </div>
                      )}
                      <span style={{
                        position: "absolute", top: "12px", left: "12px",
                        background: "rgba(255,255,255,0.95)", color: "#7C2D12",
                        fontSize: "11px", fontWeight: 700, padding: "5px 12px",
                        borderRadius: "999px", letterSpacing: "0.05em"
                      }}>
                        {propiedad.tipo}
                      </span>
                    </div>
                    <div style={{padding: "20px"}}>
                      <h3 style={{fontWeight: 600, color: "#1C0A00", marginBottom: "4px", fontSize: "16px"}} className="group-hover:text-orange-700 transition-colors">{propiedad.titulo}</h3>
                      <p style={{color: "#92400E", fontSize: "13px", marginBottom: "16px"}}>{propiedad.ubicacion}</p>
                      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <p style={{fontSize: "20px", fontWeight: 800, color: "#C2540A"}}>${propiedad.precio?.toLocaleString()}</p>
                        <p style={{fontSize: "12px", color: "#A16207"}}>{propiedad.superficie} m²</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{background: "#fff"}} className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p style={{fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#C2540A", textTransform: "uppercase", marginBottom: "12px"}}>Por qué elegirnos</p>
          <h2 style={{fontSize: "1.75rem", fontWeight: 700, color: "#1C0A00", lineHeight: 1.3, marginBottom: "20px"}}>
            Una inmobiliaria que trabaja para vos, no para la comisión
          </h2>
          <p style={{color: "#78350F", lineHeight: 1.8, marginBottom: "32px", fontSize: "15px", maxWidth: "600px", margin: "0 auto 32px"}}>
            Cada operación es distinta. Por eso no usamos guiones ni procesos genéricos. Liliana conoce Necochea palmo a palmo y te va a asesorar con la honestidad de quien quiere que tomes la mejor decisión.
          </p>
          <Link href="/nosotros" style={{color: "#C2540A", fontWeight: 600, fontSize: "14px", textDecoration: "none"}}>
            Conocer más sobre nosotros →
          </Link>
        </div>
      </section>

      <section style={{
        background: "linear-gradient(135deg, #431407 0%, #7C2D12 50%, #9A3412 100%)",
        position: "relative", overflow: "hidden"
      }} className="py-24 text-center">
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "rgba(255,255,255,0.03)", pointerEvents: "none"
        }} />
        <div className="relative max-w-xl mx-auto px-6">
          <h2 style={{fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: "16px"}}>¿Tenés una consulta?</h2>
          <p style={{color: "rgba(255,255,255,0.65)", marginBottom: "36px", lineHeight: 1.7, fontSize: "15px"}}>
            Sin compromisos ni formularios interminables. Solo una conversación para entender qué estás buscando.
          </p>
          <Link href="/contacto" style={{
            display: "inline-block",
            background: "#fff", color: "#C2540A",
            fontWeight: 700, padding: "16px 40px", borderRadius: "12px",
            textDecoration: "none", fontSize: "15px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
          }}>
            Contactar a Liliana
          </Link>
        </div>
      </section>

      <footer style={{background: "#0C0500"}} className="py-8">
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