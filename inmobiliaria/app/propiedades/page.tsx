import { getPropiedadesPorOperacion, getConteoPorTipo } from "@/lib/supabase"
import Link from "next/link"

const TIPOS = ["Casa", "Departamento", "Terreno", "Lote", "Local comercial"]

const SECCIONES: { clave: "Venta" | "Alquiler" | "Alquiler temporada"; titulo: string; subtitulo: string }[] = [
  { clave: "Venta", titulo: "En venta", subtitulo: "Propiedades disponibles para comprar" },
  { clave: "Alquiler", titulo: "En alquiler", subtitulo: "Alquiler tradicional" },
  { clave: "Alquiler temporada", titulo: "Alquiler por temporada", subtitulo: "Para tus vacaciones en Necochea" },
]

type Propiedad = {
  id: string
  titulo: string
  tipo: string
  operacion?: string
  precio: number
  superficie: number
  ubicacion: string
  imagen_url: string
  created_at?: string
}

function esNueva(created_at?: string) {
  if (!created_at) return false
  const dias = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)
  return dias <= 14
}

export default async function Propiedades({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams

  const [grupos, conteoPorTipo] = await Promise.all([
    getPropiedadesPorOperacion(),
    getConteoPorTipo(),
  ])

  const totalGeneral = Object.values(conteoPorTipo).reduce((a, b) => a + b, 0)
  const tiposDisponibles = TIPOS.filter((t) => conteoPorTipo[t] > 0)

  // Filtramos por tipo (si hay filtro activo) dentro de cada grupo de operación
  const seccionesConDatos = SECCIONES.map((seccion) => {
    const items = ((grupos[seccion.clave] || []) as Propiedad[]).filter(
      (p) => !tipo || p.tipo === tipo
    )
    return { ...seccion, items }
  })

  const totalFiltrado = seccionesConDatos.reduce((acc, s) => acc + s.items.length, 0)
  const hayAlgunaSeccionConDatos = seccionesConDatos.some((s) => s.items.length > 0)

  return (
    <main className="antialiased">

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      {/* HERO — mismo degradé y blobs que el home */}
      <section
        className="relative overflow-hidden text-white pt-40 pb-20 px-6"
        style={{ background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 45%, #EA580C 100%)" }}
      >
        <div style={{
          position: "absolute", right: "-100px", top: "-100px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", pointerEvents: "none", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", left: "10%", bottom: "-80px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none", filter: "blur(20px)"
        }} />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.15em] text-[#FED7AA] uppercase mb-3">Catálogo</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Propiedades disponibles</h1>
          <p className="text-white/70 mt-3">
            {totalFiltrado} {totalFiltrado === 1 ? "propiedad" : "propiedades"} en Necochea y alrededores
          </p>
        </div>
      </section>

      {/* GRILLA — filtros + secciones por operación */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)" }}>
        <div style={{
          position: "absolute", top: "-60px", left: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,84,10,0.12) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.14) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-6xl mx-auto px-6">

          {/* FILTRO POR TIPO — pills de vidrio */}
          <div className="flex flex-wrap gap-2 mb-14 bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-2 w-fit" style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.06)" }}>
            <Link
              href="/propiedades"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                textDecoration: "none",
                background: !tipo ? "#C2540A" : "transparent",
                color: !tipo ? "#fff" : "#78350F",
              }}
            >
              Todas <span className="opacity-70 font-normal">({totalGeneral})</span>
            </Link>
            {tiposDisponibles.map((t) => (
              <Link
                key={t}
                href={`/propiedades?tipo=${encodeURIComponent(t)}`}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  textDecoration: "none",
                  background: tipo === t ? "#C2540A" : "transparent",
                  color: tipo === t ? "#fff" : "#78350F",
                }}
              >
                {t} <span className="opacity-70 font-normal">({conteoPorTipo[t]})</span>
              </Link>
            ))}
          </div>

          {/* NAV RÁPIDA — saltar directo a cada sección sin scrollear a ciegas.
              Solo se muestra si hay más de una sección con datos (si solo hay
              una, saltar a sí misma no sirve de nada). */}
          {seccionesConDatos.filter((s) => s.items.length > 0).length > 1 && (
            <div
              className="flex flex-wrap gap-2 mb-10 sticky z-10 bg-[#FFF7ED]/90 backdrop-blur-md py-2"
              style={{ top: "0px" }}
            >
              {seccionesConDatos.map((seccion) =>
                seccion.items.length === 0 ? null : (
                  <a
                    key={seccion.clave}
                    href={`#${seccion.clave.replace(/\s+/g, "-").toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-colors"
                    style={{
                      textDecoration: "none",
                      color: "#78350F",
                      borderColor: "rgba(194,84,10,0.25)",
                      background: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {seccion.titulo}
                    <span className="opacity-60 font-normal">({seccion.items.length})</span>
                  </a>
                )
              )}
            </div>
          )}

          {!hayAlgunaSeccionConDatos ? (
            <div className="text-center py-20">
              <p className="text-orange-800/70 text-lg mb-4">
                {tipo ? `No hay propiedades de tipo "${tipo}" por el momento.` : "No hay propiedades disponibles por el momento."}
              </p>
              {tipo && (
                <Link href="/propiedades" className="text-orange-700 font-semibold text-sm" style={{ textDecoration: "none" }}>
                  Ver todas las propiedades →
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {seccionesConDatos.map((seccion) =>
                seccion.items.length === 0 ? null : (
                  <div key={seccion.clave} id={seccion.clave.replace(/\s+/g, "-").toLowerCase()} style={{ scrollMarginTop: "90px" }}>
                    <div className="flex items-center gap-3 mb-8">
                      <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
                      <div>
                        <h2 className="font-display text-2xl font-bold text-[#1C0A00] tracking-tight">
                          {seccion.titulo}
                          <span className="text-orange-700/60 font-semibold text-base ml-2">
                            ({seccion.items.length})
                          </span>
                        </h2>
                        <p className="text-stone-500 text-sm">{seccion.subtitulo}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {seccion.items.map((propiedad) => (
                        <Link key={propiedad.id} href={`/propiedades/${propiedad.id}`} style={{ textDecoration: "none" }} className="group block">
                          <div
                            className="bg-white/40 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/60 transition-all duration-300 hover:-translate-y-2 hover:bg-white/55"
                            style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.10)" }}
                          >
                            <div className="relative overflow-hidden bg-orange-50/60" style={{ aspectRatio: "4/3" }}>
                              {propiedad.imagen_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={propiedad.imagen_url} alt={propiedad.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-orange-300 text-sm">Sin imagen</span>
                                </div>
                              )}

                              {/* Degradé inferior para legibilidad de badges */}
                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

                              <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-white/70 backdrop-blur-md border border-white/50 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                  {propiedad.tipo}
                                </span>
                                {esNueva(propiedad.created_at) && (
                                  <span className="bg-orange-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                    Nuevo
                                  </span>
                                )}
                              </div>

                              <span className="absolute bottom-3 right-4 text-white text-sm font-bold drop-shadow">
                                ${propiedad.precio?.toLocaleString()}
                              </span>
                            </div>

                            <div className="p-6">
                              <h3 className="font-bold text-stone-900 mb-1.5 text-[16px] leading-tight line-clamp-1 group-hover:text-orange-700 transition-colors">
                                {propiedad.titulo}
                              </h3>

                              <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-4">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{propiedad.ubicacion}</span>
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t border-white/60">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-white/50 border border-white/50 rounded-full px-3 py-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                                  </svg>
                                  {propiedad.superficie} m²
                                </span>
                                <span className="text-sm font-semibold text-orange-700 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Ver detalle
                                  <span className="transition-transform group-hover:translate-x-1">→</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER — igual al del home */}
      <footer className="py-12 border-t border-white/10" style={{ background: "#0A0300" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires
          </p>
          <nav className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors px-3 py-1.5 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}
