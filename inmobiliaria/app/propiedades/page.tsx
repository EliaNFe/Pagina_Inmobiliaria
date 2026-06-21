import { getPropiedades } from "@/lib/supabase"
import Link from "next/link"

const POR_PAGINA = 12

export default async function Propiedades({ searchParams }: { searchParams: Promise<{ pagina?: string }> }) {
  const { pagina: paginaParam } = await searchParams
  const pagina = Number(paginaParam) || 1

  const { data: propiedades, count } = await getPropiedades(pagina)

  const totalPaginas = Math.ceil((count || 0) / POR_PAGINA)

  return (
    <main>
      <section style={{background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 100%)"}} className="text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p style={{fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#FED7AA", textTransform: "uppercase", marginBottom: "12px"}}>Catálogo</p>
          <h1 style={{fontSize: "2.5rem", fontWeight: 700, color: "#fff"}}>Propiedades disponibles</h1>
          <p style={{color: "rgba(255,255,255,0.65)", marginTop: "8px"}}>
            {count} {count === 1 ? "propiedad" : "propiedades"} en Necochea y alrededores
          </p>
        </div>
      </section>

      <section style={{background: "#FFF7ED"}} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {(!propiedades || propiedades.length === 0) ? (
            <div className="text-center py-20">
              <p style={{color: "#92400E", fontSize: "18px"}}>No hay propiedades disponibles por el momento.</p>
            </div>
          ) : (
            <>
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

              {totalPaginas > 1 && (
                <div style={{display: "flex", justifyContent: "center", gap: "8px", marginTop: "48px", alignItems: "center"}}>
                  {pagina > 1 && (
                    <Link href={`/propiedades?pagina=${pagina - 1}`} style={{
                      background: "#fff", border: "1px solid #FFE4CC", color: "#C2540A",
                      fontWeight: 600, padding: "10px 20px", borderRadius: "8px",
                      textDecoration: "none", fontSize: "14px"
                    }}>
                      ← Anterior
                    </Link>
                  )}
                  {Array.from({length: totalPaginas}, (_, i) => i + 1).map(p => (
                    <Link key={p} href={`/propiedades?pagina=${p}`} style={{
                      background: p === pagina ? "#C2540A" : "#fff",
                      border: "1px solid #FFE4CC",
                      color: p === pagina ? "#fff" : "#92400E",
                      fontWeight: 600, padding: "10px 16px", borderRadius: "8px",
                      textDecoration: "none", fontSize: "14px"
                    }}>
                      {p}
                    </Link>
                  ))}
                  {pagina < totalPaginas && (
                    <Link href={`/propiedades?pagina=${pagina + 1}`} style={{
                      background: "#fff", border: "1px solid #FFE4CC", color: "#C2540A",
                      fontWeight: 600, padding: "10px 20px", borderRadius: "8px",
                      textDecoration: "none", fontSize: "14px"
                    }}>
                      Siguiente →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
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
