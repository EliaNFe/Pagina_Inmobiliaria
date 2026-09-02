import { getPropiedad, getImagenesPropiedad, getConfiguracion } from "@/lib/supabase"
import { formatearPrecio } from "@/lib/formatear-precio"
import Link from "next/link"
import CarruselImagenes from "@/components/CarruselImagenes"
import styles from "./detalle.module.css"

interface PageProps { params: Promise<{ id: string }> }

export default async function DetallePropiedad({ params }: PageProps) {
  const { id } = await params
  const [propiedad, imagenes, config] = await Promise.all([getPropiedad(id), getImagenesPropiedad(id), getConfiguracion()])

  if (!propiedad) return (
    <main className={styles.notFound}><div><span>Propiedad no encontrada</span><h1>No pudimos encontrar esta publicación.</h1><Link href="/propiedades">← Volver al catálogo</Link></div></main>
  )

  const listaImagenes: string[] = imagenes?.map(i => i.url) || []
  const todasLasImagenes = listaImagenes.length ? listaImagenes : (propiedad.imagen_url ? [propiedad.imagen_url] : [])
  const mensajeWhatsapp = encodeURIComponent(`Hola, quería consultar por la propiedad "${propiedad.titulo}" ubicada en ${propiedad.ubicacion}.`)
  const whatsappUrl = config?.whatsapp ? `https://wa.me/${config.whatsapp}?text=${mensajeWhatsapp}` : "/contacto"

  return (
    <main className={styles.page}>
      <header className={styles.hero}><div className={styles.heroInner}>
        <Link href="/propiedades" className={styles.back}>← Volver a propiedades</Link>
        <div className={styles.heading}>
          <div><p className={styles.eyebrow}><span />{propiedad.tipo}</p><h1>{propiedad.titulo}</h1><p className={styles.location}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>{propiedad.ubicacion}</p></div>
        </div>
      </div></header>

      <div className={styles.showcase}>
        <section className={styles.gallery} aria-label="Fotografías de la propiedad"><CarruselImagenes imagenes={todasLasImagenes} titulo={propiedad.titulo} /></section>
        <aside className={`${styles.summary} ${styles.reveal}`}>
          <div className={styles.summaryPrice}><span>Precio</span><strong>{formatearPrecio(propiedad.precio, propiedad.moneda)}</strong></div>
          <dl className={styles.features}><div><dt>Tipo de propiedad</dt><dd>{propiedad.tipo}</dd></div><div><dt>Superficie</dt><dd>{propiedad.superficie} m²</dd></div><div><dt>Ubicación</dt><dd>{propiedad.ubicacion}</dd></div></dl>
          <div className={styles.contact}><p className={styles.contactEyebrow}>¿Te interesa esta propiedad?</p><h2>Coordinemos una visita</h2><p>Escribinos y te contamos todos los detalles.</p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.12.56 4.2 1.62 6.04L0 24l6.14-1.61A11.95 11.95 0 0 0 12.04 24C18.66 24 24 18.62 24 12c0-3.2-1.25-6.2-3.48-8.52Zm-8.48 18.32a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.64.95.97-3.55-.24-.37A9.8 9.8 0 1 1 21.84 12a9.8 9.8 0 0 1-9.8 9.8Zm5.39-7.36c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-2.66-1.33-4.4-2.37-6.17-5.39-.17-.3-.02-.46.13-.61.33-.33.75-.86.75-1.46 0-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5 0 4.38 4.47 8.61 8.96 9.87 1.59.45 3.04.38 4.19.23 1.28-.19 2.91-1.19 3.16-1.89.25-.69.25-1.29.17-1.42-.08-.12-.28-.2-.58-.35Z"/></svg>Consultar por WhatsApp</a><small>Respondemos en menos de 24 hs</small></div>
        </aside>
      </div>

      <div className={styles.content}><div className={styles.primary}><section className={`${styles.section} ${styles.reveal}`}><p className={styles.sectionNumber}>01</p><div><h2>Descripción</h2>{propiedad.descripcion ? <p className={styles.description}>{propiedad.descripcion}</p> : <p className={styles.muted}>Consultanos para conocer más detalles de esta propiedad.</p>}</div></section></div></div>

      <footer className={styles.footer}><div><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires</p><nav><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></nav></div></footer>
    </main>
  )
}
