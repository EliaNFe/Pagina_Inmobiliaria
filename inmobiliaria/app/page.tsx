import Image from "next/image"
import { Caveat } from "next/font/google"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Building2, Home as House, MapPin, MessageCircle, Trees } from "lucide-react"
import { getConfiguracion, getPropiedadesDestacadas, getPropiedades } from "@/lib/supabase"
import HomeFeatured from "@/components/HomeFeatured"
import HomeBotanical from "@/components/HomeBotanical"
import ConsultaWhatsappForm from "@/components/ConsultaWhatsappForm"
import s from "./home.module.css"

const handwriting = Caveat({ subsets: ["latin"], weight: "400", variable: "--font-note" })
const categorias = [
  { tipo: "Casa", label: "Casas", icon: House },
  { tipo: "Departamento", label: "Departamentos", icon: Building2 },
  { tipo: "Terreno", label: "Terrenos", icon: MapPin },
  { tipo: "Lote", label: "Lotes", icon: Trees },
]

export default async function Home() {
  const [destacadas, config] = await Promise.all([getPropiedadesDestacadas(), getConfiguracion()])
  const propiedades = destacadas?.length ? destacadas : (await getPropiedades()).data || []

  return (
    <main className={`${s.home} ${handwriting.variable}`}>
      <section className={s.hero} aria-labelledby="home-title">
        <div className={s.heroPhoto}>
          <Image src="/hero-necochea.png" alt="Imagen de ambientación generada: terraza frente al mar, inspirada en la costa de Necochea" fill sizes="100vw" preload />
        </div>
        <div className={`${s.container} ${s.heroInner}`}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Necochea, Buenos Aires</p>
            <h1 id="home-title">Encontrá tu<br />próximo lugar<br /><span>en Necochea.</span></h1>
            <p className={s.intro}>Casas, departamentos y terrenos. Te acompañamos a elegir con confianza y un trato cercano.</p>
            <div className={s.actions}>
              <Link href="/propiedades" className={s.button}>Ver propiedades <ArrowRight size={17} /></Link>
              <a href="#consulta" className={s.outlineButton}>Contactar <MessageCircle size={17} /></a>
            </div>
          </div>
          <Link className={s.heroCaption} href="/propiedades"><span>Vivir cerca del mar<strong>también es posible</strong></span><ArrowUpRight size={20} strokeWidth={1.5} /></Link>
        </div>
      </section>

      <div className={s.categoryBand}>
        <nav className={`${s.container} ${s.types}`} aria-label="Buscar por tipo de propiedad">
          <span>Buscá por categoría</span>
          {categorias.map(({ tipo, label, icon: Icon }) => <Link key={tipo} href={`/propiedades?tipo=${tipo}`}><Icon size={22} strokeWidth={1.3} />{label}</Link>)}
          <Link className={s.allTypes} href="/propiedades">Ver todas <ArrowRight size={17} /></Link>
        </nav>
      </div>

      <section className={`${s.container} ${s.featured}`} aria-labelledby="featured-title">
        <HomeFeatured propiedades={propiedades} destacadas={Boolean(destacadas?.length)} />
        <HomeBotanical className={s.botanical} />
      </section>

      <section className={s.office} aria-labelledby="office-title">
        <div className={`${s.container} ${s.officeGrid}`}>
          <div className={s.officeCopy}>
            <p className={s.eyebrow}>Nuestra presencia en la ciudad</p>
            <h2 id="office-title">Una inmobiliaria local,<br /><span>siempre cerca.</span></h2>
            <p>Desde 2019, Liliana Cirigliano acompaña a quienes eligen vivir o invertir en Necochea. Conocemos la zona y te asesoramos personalmente, desde la primera consulta.</p>
            <Link href="/nosotros" className={s.outlineButton}>Conocé nuestra historia <ArrowRight size={17} /></Link>
            <p className={s.credential}>Martillera, corredora pública y tasadora matriculada.</p>
          </div>
          <figure className={s.officeFigure}>
            <div className={s.officeLabel}>Nuestra oficina<span>en Necochea ♡</span></div>
            <div className={s.officePhoto}><Image src="/fachada-inmobiliaria.jpg" alt="Fachada del local de Liliana Cirigliano en Necochea" fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
            <figcaption><MapPin size={25} strokeWidth={1.3} /><span>Nos encontrás en<br />Necochea, Buenos Aires</span><span className={s.officeVisit}>Te esperamos para<br />asesorarte personalmente</span></figcaption>
          </figure>
        </div>
      </section>

      <section className={s.city}>
        <div className={s.container}>
          <div><p className={s.eyebrow}>Viví, invertí, disfrutá</p><h2>Necochea<br /><span>todo el año.</span></h2><p className={s.cityIntro}>Tu lugar para vivir, tu próxima inversión.<br />Te ayudamos a encontrarlo.</p><Link href="/propiedades" className={s.button}>Explorá Necochea <ArrowRight size={17} /></Link></div>
          <div className={s.cityAside}>
            <svg className={s.coastalLines} viewBox="0 0 700 250" fill="none" aria-hidden="true">
              <path d="M0 103H700M0 111H700M0 121C150 114 221 125 350 119S570 125 700 118M0 135C153 128 225 142 362 134S550 143 700 137M0 156C90 135 188 171 275 155S472 142 700 154M0 230C100 214 200 250 340 198S560 178 700 204" />
              <circle cx="450" cy="75" r="25" />
              <path d="M250 250 265 173M289 250 303 167M262 187 301 181M259 207 297 201M360 250Q355 150 322 126M363 250Q376 161 411 139M363 250Q374 180 371 139M354 201Q328 172 313 167M379 208Q404 181 430 184" />
            </svg>
            <p>Mar, naturaleza<br />y nuevas<br />oportunidades.</p>
          </div>
        </div>
      </section>

      <section id="consulta" className={s.contact} aria-labelledby="contact-title">
        <div className={`${s.container} ${s.contactGrid}`}>
          <div className={s.contactCopy}>
            <p className={s.eyebrow}>Contacto directo</p>
            <h2 id="contact-title">¿Tenés una consulta?</h2>
            <p className={s.contactIntro}>Hablemos. Estoy para ayudarte a encontrar<br />lo que estás buscando.</p>
            <Link href="/contacto" className={`${s.outlineButton} ${s.contactLink}`}>
              Conocé nuestros medios de contacto <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={s.form}>
            <ConsultaWhatsappForm numeroWhatsapp={config.whatsapp || ""} />
            <p className={s.formNote}>Tu consulta se prepara en WhatsApp para que puedas enviarla.</p>
          </div>
          <figure className={s.person}>
            <p className={s.personNote}>¡Hablemos!<br />Estoy para<br />ayudarte ♡</p>
            <div className={s.portrait}><Image src="/liliana-hero-cutout.png" alt="Liliana Cirigliano" fill sizes="(max-width: 760px) 320px, (max-width: 1050px) 30vw, 380px" /></div>
            <figcaption className="sr-only">Liliana Cirigliano · Gestiones inmobiliarias</figcaption>
          </figure>
        </div>
      </section>

      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerBrand}><House size={39} strokeWidth={1.1} /><div><p className={s.eyebrow}>Inmobiliaria</p><span className={s.footerName}>Liliana Cirigliano</span></div></div>
          <nav aria-label="Navegación al pie"><Link href="/">Inicio</Link><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></nav>
          <p>Necochea, Buenos Aires</p>
        </div>
        <div className={`${s.container} ${s.footerBottom}`}><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano.</p><p>Gestiones inmobiliarias</p></div>
      </footer>
    </main>
  )
}
