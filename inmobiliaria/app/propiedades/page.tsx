import { getPropiedadesPorOperacionPaginado, getConteoPorTipo } from "@/lib/supabase"
import { formatearPrecio } from "@/lib/formatear-precio"
import Link from "next/link"

const TIPOS = ["Casa", "Departamento", "Terreno", "Lote", "Local comercial"]

// Cada sección tiene su propio parámetro de página en la URL (pv/pa/pt) para
// que paginar "Alquiler" no reinicie ni afecte a "Venta" o "Alquiler temporada".
const SECCIONES: { clave: "Venta" | "Alquiler" | "Alquiler temporada"; paramPagina: "pv" | "pa" | "pt"; titulo: string; subtitulo: string }[] = [
  { clave: "Venta", paramPagina: "pv", titulo: "En venta", subtitulo: "Propiedades disponibles para comprar" },
  { clave: "Alquiler", paramPagina: "pa", titulo: "En alquiler", subtitulo: "Alquiler tradicional" },
  { clave: "Alquiler temporada", paramPagina: "pt", titulo: "Alquiler por temporada", subtitulo: "Para tus vacaciones en Necochea" },
]

function esNueva(created_at?: string) {
  if (!created_at) return false
  const dias = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24)
  return dias <= 14
}

export default async function Propiedades({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; pv?: string; pa?: string; pt?: string }>
}) {
  const { tipo, pv, pa, pt } = await searchParams

  const paginas: Record<"pv" | "pa" | "pt", number> = {
    pv: Number(pv) || 1,
    pa: Number(pa) || 1,
    pt: Number(pt) || 1,
  }

  const [resultados, conteoPorTipo] = await Promise.all([
    Promise.all(
      SECCIONES.map((seccion) =>
        getPropiedadesPorOperacionPaginado(seccion.clave, paginas[seccion.paramPagina], tipo)
      )
    ),
    getConteoPorTipo(),
  ])

  const totalGeneral = Object.values(conteoPorTipo).reduce((a, b) => a + b, 0)
  const tiposDisponibles = TIPOS.filter((t) => conteoPorTipo[t] > 0)

  const seccionesConDatos = SECCIONES.map((seccion, i) => ({
    ...seccion,
    items: resultados[i].data,
    count: resultados[i].count,
    totalPaginas: Math.ceil(resultados[i].count / 6),
    paginaActual: paginas[seccion.paramPagina],
  }))

  const totalFiltrado = seccionesConDatos.reduce((acc, s) => acc + s.count, 0)
  const hayAlgunaSeccionConDatos = seccionesConDatos.some((s) => s.count > 0)

  // Arma el href de un link de paginación conservando el resto de los
  // parámetros (tipo + las páginas de las OTRAS secciones intactas).
  function hrefPagina(paramPagina: "pv" | "pa" | "pt", nuevaPagina: number) {
    const params = new URLSearchParams()
    if (tipo) params.set("tipo", tipo)
    ;(["pv", "pa", "pt"] as const).forEach((p) => {
      const valor = p === paramPagina ? nuevaPagina : paginas[p]
      if (valor > 1) params.set(p, String(valor))
    })
    const qs = params.toString()
    return `/propiedades${qs ? `?${qs}` : ""}`
  }

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
        /* "fixed" en desktop se ve lindo, pero en mobile obliga a repintar
           el fondo en cada frame de scroll y genera lag. Ahí lo dejamos
           "scroll" (comportamiento normal), que es liviano. */
        .fondo-texturado {
          background-attachment: fixed, fixed, fixed, fixed, scroll;
        }
        @media (max-width: 768px) {
          .fondo-texturado {
            background-attachment: scroll, scroll, scroll, scroll, scroll;
          }
        }
      `}</style>

      {/* HERO — mismo degradé y blobs que el home */}
      <section
        className="relative overflow-hidden text-white pt-40 pb-20 px-6"
        style={{
          background: `
            radial-gradient(circle at 82% 18%, rgba(194,84,10,0.24) 0%, transparent 34%),
            radial-gradient(circle at 12% 100%, rgba(234,88,12,0.10) 0%, transparent 30%),
            linear-gradient(135deg, #120704 0%, #1C0A00 58%, #2A1007 100%)
          `,
        }}
      >
        <div style={{
          position: "absolute", right: "-100px", top: "-100px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "rgba(194,84,10,0.10)", pointerEvents: "none", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", left: "10%", bottom: "-80px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(255,247,237,0.035)", pointerEvents: "none", filter: "blur(20px)"
        }} />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.15em] text-[#ECA56F] uppercase mb-3">Catálogo</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Propiedades disponibles</h1>
          <p className="text-white/55 mt-3">
            {totalFiltrado} {totalFiltrado === 1 ? "propiedad" : "propiedades"} en Necochea y alrededores
          </p>
        </div>
      </section>

      {/* GRILLA — filtros + secciones por operación — mismo fondo texturado
          (fixed en desktop, scroll en mobile para evitar lag) que el Home */}
      <section
        className="relative py-20 fondo-texturado"
        style={{
          backgroundImage: `
            radial-gradient(circle at 94% 4%, rgba(194,84,10,0.09) 0%, transparent 34%),
            radial-gradient(circle at 3% 48%, rgba(28,10,0,0.035) 0%, transparent 32%),
            radial-gradient(circle at 86% 96%, rgba(194,84,10,0.07) 0%, transparent 34%),
            linear-gradient(180deg, #FDFBF9 0%, #FBF7F2 52%, #FFF9F2 100%)
          `,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
        }}
      >

        <div className="relative max-w-6xl mx-auto px-6">

          {/* FILTRO POR TIPO — tabs de texto, sin pills de vidrio */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
            <Link
              href="/propiedades"
              className="text-sm font-semibold pb-1 transition-colors"
              style={{
                textDecoration: "none",
                color: !tipo ? "#C2540A" : "#5C463B",
                borderBottom: !tipo ? "2px solid #C2540A" : "2px solid transparent",
              }}
            >
              Todas <span className="opacity-60 font-normal">({totalGeneral})</span>
            </Link>
            {tiposDisponibles.map((t) => (
              <Link
                key={t}
                href={`/propiedades?tipo=${encodeURIComponent(t)}`}
                className="text-sm font-semibold pb-1 transition-colors"
                style={{
                  textDecoration: "none",
                  color: tipo === t ? "#C2540A" : "#5C463B",
                  borderBottom: tipo === t ? "2px solid #C2540A" : "2px solid transparent",
                }}
              >
                {t} <span className="opacity-60 font-normal">({conteoPorTipo[t]})</span>
              </Link>
            ))}
          </div>

          {/* NAV RÁPIDA — saltar directo a cada sección. Quieta (no sticky),
              como botoncitos con borde — sin vidrio, sombra ni fondo sólido. */}
          {seccionesConDatos.filter((s) => s.count > 0).length > 1 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {seccionesConDatos.map((seccion) =>
                seccion.count === 0 ? null : (
                  <a
                    key={seccion.clave}
                    href={`#${seccion.clave.replace(/\s+/g, "-").toLowerCase()}`}
                    className="text-[13px] font-semibold inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md transition-colors hover:bg-[#F6E9DD]"
                    style={{
                      textDecoration: "none",
                      color: "#5C3322",
                      border: "1px solid rgba(194,84,10,0.22)",
                    }}
                  >
                    {seccion.titulo}
                    <span className="opacity-60 font-normal">({seccion.count})</span>
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
                seccion.count === 0 ? null : (
                  <div key={seccion.clave} id={seccion.clave.replace(/\s+/g, "-").toLowerCase()} style={{ scrollMarginTop: "90px" }}>
                    <div className="flex items-center gap-3 mb-8">
                      <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
                      <div>
                        <h2 className="font-display text-2xl font-bold text-[#1C0A00] tracking-tight">
                          {seccion.titulo}
                          <span className="text-orange-700/60 font-semibold text-base ml-2">
                            ({seccion.count})
                          </span>
                        </h2>
                        <p className="text-stone-500 text-sm">{seccion.subtitulo}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {seccion.items.map((propiedad) => (
                        <Link key={propiedad.id} href={`/propiedades/${propiedad.id}`} style={{ textDecoration: "none" }} className="group block">
                          <div
                            className="bg-[#FFFCF8]/90 backdrop-blur-md rounded-[20px] overflow-hidden border border-[#E9DDD2] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
                            style={{ boxShadow: "0 12px 32px rgba(28,10,0,0.08)" }}
                          >
                            <div className="relative overflow-hidden bg-[#F3EAE2]" style={{ aspectRatio: "4/3" }}>
                              {propiedad.imagen_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={propiedad.imagen_url} alt={propiedad.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-[#B98A6D] text-sm">Sin imagen</span>
                                </div>
                              )}

                              {/* Degradé inferior para legibilidad de badges */}
                              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />

                              <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-[#FFFDFC]/85 backdrop-blur-md border border-white/60 text-[#3D2A21] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                  {propiedad.tipo}
                                </span>
                                {esNueva(propiedad.created_at) && (
                                  <span className="bg-[#C2540A]/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                                    Nuevo
                                  </span>
                                )}
                              </div>

                              <span className="absolute bottom-3 right-4 text-white text-sm font-bold drop-shadow">
                                {formatearPrecio(propiedad.precio, propiedad.moneda)}
                              </span>
                            </div>

                            <div className="p-6">
                              <h3 className="font-bold text-[#1C0A00] mb-1.5 text-[16px] leading-tight line-clamp-1 group-hover:text-[#C2540A] transition-colors">
                                {propiedad.titulo}
                              </h3>

                              <div className="flex items-center gap-1.5 text-[#766158] text-sm mb-4">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{propiedad.ubicacion}</span>
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t border-[#EDE2D8]">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B3B24] bg-[#F8EFE7] border border-[#EAD8C8] rounded-full px-3 py-1.5">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                                  </svg>
                                  {propiedad.superficie} m²
                                </span>
                                <span className="text-sm font-semibold text-[#B64B08] inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                  Ver detalle
                                  <span className="transition-transform group-hover:translate-x-1">→</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* PAGINACIÓN — propia de esta sección, no afecta a las otras */}
                    {seccion.totalPaginas > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                        {seccion.paginaActual > 1 && (
                          <Link
                            href={hrefPagina(seccion.paramPagina, seccion.paginaActual - 1)}
                            className="bg-[#FFFCF8] border border-[#E4D4C5] text-[#B64B08] font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:bg-white"
                            style={{ textDecoration: "none" }}
                          >
                            ← Anterior
                          </Link>
                        )}
                        {Array.from({ length: seccion.totalPaginas }, (_, i) => i + 1).map((p) => (
                          <Link
                            key={p}
                            href={hrefPagina(seccion.paramPagina, p)}
                            className="font-semibold px-3.5 py-2 rounded-xl text-sm transition-all backdrop-blur-xl border"
                            style={{
                              textDecoration: "none",
                              background: p === seccion.paginaActual ? "#C2540A" : "#FFFCF8",
                              borderColor: p === seccion.paginaActual ? "#C2540A" : "#E4D4C5",
                              color: p === seccion.paginaActual ? "#fff" : "#7A3B1C",
                            }}
                          >
                            {p}
                          </Link>
                        ))}
                        {seccion.paginaActual < seccion.totalPaginas && (
                          <Link
                            href={hrefPagina(seccion.paramPagina, seccion.paginaActual + 1)}
                            className="bg-[#FFFCF8] border border-[#E4D4C5] text-[#B64B08] font-semibold px-4 py-2 rounded-xl text-sm transition-all hover:bg-white"
                            style={{ textDecoration: "none" }}
                          >
                            Siguiente →
                          </Link>
                        )}
                      </div>
                    )}
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
