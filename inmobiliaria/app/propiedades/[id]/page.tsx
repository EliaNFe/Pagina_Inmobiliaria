import { getPropiedad, getImagenesPropiedad, getConfiguracion } from "@/lib/supabase"
import { formatearPrecio } from "@/lib/formatear-precio"
import Link from "next/link"
import { MapPin, MessageCircle } from "lucide-react"
import CarruselImagenes from "@/components/CarruselImagenes"
import styles from "./detalle.module.css"

interface PageProps { params: Promise<{ id: string }> }

export default async function DetallePropiedad({ params }: PageProps) {
  const { id } = await params
  const [propiedad, imagenes, config] = await Promise.all([getPropiedad(id), getImagenesPropiedad(id), getConfiguracion()])

  if (!propiedad) return (
    <main className={styles.notFound}><div><span>Propiedad no encontrada</span><h1>No pudimos encontrar esta publicación.</h1><Link href="/propiedades">Volver al catálogo</Link></div></main>
  )

  const listaImagenes: string[] = imagenes?.map(i => i.url) || []
  const todasLasImagenes = listaImagenes.length ? listaImagenes : (propiedad.imagen_url ? [propiedad.imagen_url] : [])
  const mensajeWhatsapp = encodeURIComponent(`Hola, quería consultar por la propiedad "${propiedad.titulo}" ubicada en ${propiedad.ubicacion}.`)
  const whatsappUrl = config?.whatsapp ? `https://wa.me/${config.whatsapp}?text=${mensajeWhatsapp}` : "/contacto"

  return (
    <main className={styles.page}>
      <header className={`${styles.container} ${styles.hero}`}>
        <nav className={styles.breadcrumb} aria-label="Ruta de navegación"><Link href="/propiedades">Propiedades</Link><span aria-hidden="true">/</span><span>{propiedad.tipo}</span></nav>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}>{propiedad.tipo} · {propiedad.operacion || "Venta"}</p><h1>{propiedad.titulo}</h1><p className={styles.location}><MapPin size={16} strokeWidth={1.4} aria-hidden="true" />{propiedad.ubicacion}</p></div>
          <span className={styles.photoCount}>{todasLasImagenes.length} {todasLasImagenes.length === 1 ? "fotografía" : "fotografías"}</span>
        </div>
      </header>

      <div className={`${styles.container} ${styles.showcase}`}>
        <div className={styles.primary}>
          <section className={styles.gallery} aria-label="Fotografías de la propiedad"><CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} /></section>
          <section className={styles.descriptionSection} aria-labelledby="descripcion-title"><div className={styles.sectionHeading}><h2 id="descripcion-title">Sobre la propiedad</h2><span>Descripción</span></div>{propiedad.descripcion ? <p className={styles.description}>{propiedad.descripcion}</p> : <p className={styles.description}>Consultanos para conocer más detalles de esta propiedad.</p>}</section>
        </div>
        <aside className={styles.summary} aria-label="Precio y consulta">
          <div className={styles.summaryPrice}><span>{propiedad.operacion || "Venta"}</span><strong>{formatearPrecio(propiedad.precio, propiedad.moneda)}</strong></div>
          <dl className={styles.features}><div><dt>Propiedad</dt><dd>{propiedad.tipo}</dd></div><div><dt>Superficie</dt><dd>{propiedad.superficie} m²</dd></div><div><dt>Ubicación</dt><dd>{propiedad.ubicacion}</dd></div></dl>
          <div className={styles.contact}><h2>Consultá por esta propiedad</h2><p>Hablá con Liliana para conocer los detalles o coordinar una visita.</p><a className={styles.consultButton} href={whatsappUrl} target={config?.whatsapp ? "_blank" : undefined} rel={config?.whatsapp ? "noopener noreferrer" : undefined}><MessageCircle size={18} strokeWidth={1.5} aria-hidden="true" />{config?.whatsapp ? "Consultar por WhatsApp" : "Contactar a Liliana"}</a><small>Atención personal · Liliana Cirigliano</small></div>
          <Link href="/propiedades" className={styles.back}>Seguir viendo propiedades</Link>
        </aside>
      </div>

      <footer className={styles.footer}><div className={styles.container}><Link href="/" className={styles.brand}><small>Inmobiliaria</small>Liliana Cirigliano</Link><nav aria-label="Navegación al pie"><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></nav></div><div className={`${styles.container} ${styles.footerBottom}`}><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano.</p><span>Necochea, Buenos Aires</span></div></footer>
    </main>
  )
}
