import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, Clock3, House, Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import { getConfiguracion } from "@/lib/supabase"
import s from "./contacto.module.css"

export const metadata: Metadata = {
  title: "Contacto | Liliana Cirigliano",
  description: "Hablemos de tu próximo lugar en Necochea. Contactá a Liliana Cirigliano o acercate a nuestra oficina.",
}

function linkInstagram(valor?: string) {
  const limpio = valor?.trim()
  if (!limpio) return null
  if (/^https?:\/\//i.test(limpio)) return limpio
  return `https://instagram.com/${limpio.replace(/^@/, "")}`
}

export default async function Contacto() {
  const config = await getConfiguracion()
  const numero = config.whatsapp?.replace(/\D/g, "")
  const whatsapp = numero ? `https://wa.me/${numero}` : null
  const instagram = linkInstagram(config.instagram)
  const direccion = config.direccion || "Necochea, Buenos Aires"
  const consultaMapa = encodeURIComponent(direccion)
  const medios = [
    ...(whatsapp ? [{ title: "WhatsApp", detail: "Contame qué estás buscando", href: whatsapp, icon: MessageCircle, external: true }] : []),
    ...(config.telefono ? [{ title: "Una llamada", detail: config.telefono, href: `tel:${config.telefono}`, icon: Phone, external: false }] : []),
    ...(config.email ? [{ title: "Por correo", detail: config.email, href: `mailto:${config.email}`, icon: Mail, external: false }] : []),
    ...(instagram ? [{ title: "Instagram", detail: "Conocé nuestras últimas novedades", href: instagram, icon: Camera, external: true }] : []),
  ]

  return (
    <main className={s.contacto}>
      <section className={s.hero} aria-labelledby="contacto-title">
        <div className={`${s.container} ${s.heroInner}`}>
          <p className={s.eyebrow}>Contacto</p>
          <h1 id="contacto-title">Hablemos de tu próximo lugar.</h1>
          <p className={s.intro}>Contame qué estás buscando. Estoy para ayudarte.</p>
        </div>
      </section>

      <section id="medios" className={`${s.container} ${s.channels}`} aria-labelledby="medios-title">
        <div className={s.sectionHeading}><p className={s.eyebrow}>A tu manera</p><h2 id="medios-title">Elegí cómo <em>nos encontramos.</em></h2><p>Por mensaje, por teléfono o en persona. Estoy para ayudarte.</p></div>
        <div className={s.channelGrid}>
          {medios.map(({ title, detail, href, icon: Icon, external }) => <a key={title} href={href} className={s.channel} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}><Icon className={s.channelIcon} size={25} strokeWidth={1.3} /><span className={s.channelCopy}><strong>{title}</strong><small>{detail}</small></span><span className={s.channelArrow}><ArrowUpRight size={18} /></span></a>)}
          {!medios.length && <p className={s.empty}>Podés acercarte a nuestra oficina. Encontrá la ubicación a continuación.</p>}
        </div>
      </section>

      <section id="visitanos" className={s.visit} aria-labelledby="visita-title">
        <div className={`${s.container} ${s.visitGrid}`}>
          <div className={s.visitCopy}>
            <p className={s.eyebrow}>Las puertas están abiertas</p>
            <h2 id="visita-title">Nos vemos<br /><em>en Necochea.</em></h2>
            <p className={s.visitIntro}>A veces, una charla en persona es el mejor comienzo. Acercate y conversemos sobre tu próximo proyecto.</p>
            <div className={s.visitDetail}><MapPin size={21} strokeWidth={1.4} /><div><h3>Nuestra oficina</h3><p>{direccion}</p></div></div>
            {config.horario && <div className={s.visitDetail}><Clock3 size={21} strokeWidth={1.4} /><div><h3>Horario de atención</h3><p>{config.horario}</p></div></div>}
            <a className={`${s.button} ${s.directions}`} href={`https://www.google.com/maps/search/?api=1&query=${consultaMapa}`} target="_blank" rel="noopener noreferrer">Cómo llegar <span><ArrowUpRight size={19} /></span></a>
          </div>
          <div className={s.mapComposition}>
            <div className={s.mapHeader}><span className={s.mapDot} />Liliana Cirigliano <span>Gestiones inmobiliarias</span></div>
            <iframe className={s.map} src={`https://www.google.com/maps?q=${consultaMapa}&output=embed`} width="100%" height="440" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación de la inmobiliaria Liliana Cirigliano" />
            <div className={s.mapCaption}><MapPin size={15} /><span>Tu próximo paso tiene un punto de encuentro.</span></div>
          </div>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={`${s.container} ${s.footerTop}`}><Link href="/" className={s.brand}><House size={33} strokeWidth={1.2} /><span><small>Inmobiliaria</small>Liliana Cirigliano</span></Link><p>De persona a persona.<br /><em>De principio a fin.</em></p><nav aria-label="Navegación al pie"><Link href="/">Inicio</Link><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link></nav></div>
        <div className={`${s.container} ${s.footerBottom}`}><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano.</p><span>Necochea, Buenos Aires</span></div>
      </footer>
    </main>
  )
}
