import { getPropiedad, getImagenesPropiedad } from "@/lib/supabase"
import Link from "next/link"
import CarruselImagenes from "@/components/CarruselImagenes"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DetallePropiedad({ params }: PageProps) {
  const { id } = await params

  const [propiedad, imagenes] = await Promise.all([
    getPropiedad(id),
    getImagenesPropiedad(id)
  ])

  if (!propiedad) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)" }}>
        <div className="text-center bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl px-10 py-12" style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}>
          <p className="text-orange-800/80 text-lg mb-4">Propiedad no encontrada</p>
          <Link href="/propiedades" className="text-orange-700 font-semibold text-sm" style={{ textDecoration: "none" }}>
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    )
  }

  const listaImagenes: string[] = imagenes?.map(i => i.url) || []
  const todasLasImagenes: string[] = [
    ...(propiedad.imagen_url ? [propiedad.imagen_url] : []),
    ...listaImagenes
  ]

  return (
    <main className="antialiased relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)", minHeight: "100vh" }}>
      <div style={{
        position: "absolute", top: "80px", right: "-100px",
        width: "360px", height: "360px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(194,84,10,0.10) 0%, transparent 70%)",
        filter: "blur(30px)", pointerEvents: "none"
      }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-12">

        <Link href="/propiedades" className="text-stone-500 text-sm inline-block mb-6 hover:text-orange-700 transition-colors" style={{ textDecoration: "none" }}>
          ← Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} />
          </div>

          <div>
            <span className="inline-block bg-white/60 backdrop-blur-md border border-white/50 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide mb-4">
              {propiedad.tipo}
            </span>
            <h1 className="font-display text-3xl font-bold text-stone-900 mb-2 leading-tight">{propiedad.titulo}</h1>
            <p className="text-stone-500 text-sm mb-6">{propiedad.ubicacion}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4" style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mb-1.5">Precio</p>
                <p className="text-[1.75rem] font-extrabold text-orange-700">${propiedad.precio?.toLocaleString()}</p>
              </div>
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-4" style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}>
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mb-1.5">Superficie</p>
                <p className="text-[1.75rem] font-extrabold text-stone-900">{propiedad.superficie} m²</p>
              </div>
            </div>

            {propiedad.descripcion && (
              <div className="mb-6">
                <p className="text-[11px] text-stone-500 uppercase tracking-wider mb-2.5">Descripción</p>
                <p className="text-stone-600 leading-relaxed text-sm">{propiedad.descripcion}</p>
              </div>
            )}

            <Link
              href="/contacto"
              className="block text-center font-bold py-4 rounded-2xl text-white text-[15px] transition-transform hover:-translate-y-0.5"
              style={{ background: "#C2540A", textDecoration: "none", boxShadow: "0 8px 24px rgba(194,84,10,0.3)" }}
            >
              Consultar por esta propiedad
            </Link>
            <p className="text-center text-stone-500 text-xs mt-2.5">Respondemos en menos de 24hs</p>
          </div>
        </div>
      </div>

      {/* FOOTER — igual al del home */}
      <footer className="relative py-12 border-t border-white/10 mt-8" style={{ background: "#0A0300" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires
          </p>
          <nav className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/50 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors px-3 py-1.5 rounded-xl"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}
