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
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FDFBF9" }}>
        <div className="text-center bg-white px-10 py-12" style={{ border: "1px solid #F0E4D8", borderRadius: "10px" }}>
          <p className="text-stone-500 text-lg mb-4">Propiedad no encontrada</p>
          <Link href="/propiedades" className="text-orange-700 font-semibold text-sm" style={{ textDecoration: "none" }}>
            ← Volver al catálogo
          </Link>
        </div>
      </main>
    )
  }

  // propiedad_imagenes es la única fuente de verdad para el carrusel.
  // imagen_url solo se usa como respaldo si por algún motivo la propiedad
  // no tiene ninguna fila en propiedad_imagenes (dato viejo o borrado a mano).
  const listaImagenes: string[] = imagenes?.map(i => i.url) || []
  const todasLasImagenes: string[] =
    listaImagenes.length > 0
      ? listaImagenes
      : (propiedad.imagen_url ? [propiedad.imagen_url] : [])

  return (
    <main className="antialiased" style={{ background: "#FDFBF9", minHeight: "100vh" }}>

      {/* Franja superior oscura con breadcrumb y tipo */}
      <div style={{ background: "#1C0A00" }} className="pt-32 pb-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/propiedades" className="text-white/50 text-sm inline-block mb-6 hover:text-white transition-colors" style={{ textDecoration: "none" }}>
            ← Volver al catálogo
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
            <span className="text-xs tracking-[0.2em] font-semibold text-orange-500 uppercase">{propiedad.tipo}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-2">{propiedad.titulo}</h1>
          <p className="text-white/50 text-[15px]">{propiedad.ubicacion}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-12">

          <div>
            <CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} />
          </div>

          <div>
            <div className="flex items-start gap-10 mb-8 pb-8" style={{ borderBottom: "1px solid #F0E4D8" }}>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mb-1.5">Precio</p>
                <p className="font-display text-3xl font-extrabold" style={{ color: "#C2540A" }}>
                  ${propiedad.precio?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mb-1.5">Superficie</p>
                <p className="font-display text-3xl font-extrabold text-stone-900">
                  {propiedad.superficie} m²
                </p>
              </div>
            </div>

            {propiedad.descripcion && (
              <div className="mb-10">
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mb-3">Descripción</p>
                <p className="text-stone-600 leading-relaxed text-[15px]">{propiedad.descripcion}</p>
              </div>
            )}

            <Link
              href="/contacto"
              className="inline-flex items-center justify-center font-semibold text-white text-[15px] px-8 py-4 w-full transition-opacity hover:opacity-90"
              style={{ background: "#C2540A", textDecoration: "none", borderRadius: "4px" }}
            >
              Consultar por esta propiedad
            </Link>
            <p className="text-center text-stone-400 text-xs mt-3">Respondemos en menos de 24hs</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 mt-8" style={{ background: "#0A0300" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires
          </p>
          <nav className="flex gap-6">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-white/40 text-sm font-medium hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}
