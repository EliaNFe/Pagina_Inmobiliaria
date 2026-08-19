import { getPropiedad, getImagenesPropiedad , getConfiguracion} from "@/lib/supabase"
import { formatearPrecio } from "@/lib/formatear-precio"
import Link from "next/link"
import CarruselImagenes from "@/components/CarruselImagenes"


interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DetallePropiedad({ params }: PageProps) {
  const { id } = await params

  const [propiedad, imagenes, config] = await Promise.all([
  getPropiedad(id),
  getImagenesPropiedad(id),
  getConfiguracion()
])

const mensajeWhatsapp = encodeURIComponent(
  `Hola, quería consultar por la propiedad "${propiedad.titulo}" ubicada en ${propiedad.ubicacion}.`
)

const whatsappUrl =
  config?.whatsapp
    ? `https://wa.me/${config.whatsapp}?text=${mensajeWhatsapp}`
    : "/contacto"

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
      <div style={{ background: "#1C0A00" }} className="pt-10 pb-8 px-6 md:pt-32 md:pb-10">
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

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

          <div style={{ minWidth: 0 }}>
            <CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} />
          </div>

          <div>
            <div className="flex items-start gap-6 sm:gap-10 mb-8 pb-8" style={{ borderBottom: "1px solid #F0E4D8" }}>
              <div>
                <p className="text-[11px] text-stone-400 uppercase tracking-wider mb-1.5">Precio</p>
                <p className="font-display text-3xl font-extrabold" style={{ color: "#C2540A" }}>
                  {formatearPrecio(propiedad.precio, propiedad.moneda)}
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

    <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2.5 px-5 py-3 font-semibold text-[14px] text-white transition-opacity hover:opacity-90"
          style={{
          background: "#C2540A",
          borderRadius: "8px",
          textDecoration: "none",
          }}
          >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        >
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.12.56 4.2 1.62 6.04L0 24l6.14-1.61A11.95 11.95 0 0 0 12.04 24C18.66 24 24 18.62 24 12c0-3.2-1.25-6.2-3.48-8.52ZM12.04 21.8a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.64.95.97-3.55-.24-.37A9.8 9.8 0 1 1 21.84 12a9.8 9.8 0 0 1-9.8 9.8Zm5.39-7.36c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.48.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.69.25-1.29.17-1.42-.08-.12-.28-.2-.58-.35Z" />
          </svg>

          <span>Consultar por WhatsApp</span>
    </a>
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