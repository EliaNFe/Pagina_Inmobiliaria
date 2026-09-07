import Image from "next/image"
import Link from "next/link"
import { Fraunces } from "next/font/google"
import { ArrowRight, House, MapPin } from "lucide-react"
import s from "./nosotros.module.css"

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-nosotros-display" })

const MATRICULA_URL = "https://martillerosnecochea.com.ar/colegiados/cirigliano-liliana-noemi/"

export default function Nosotros() {
  return (
    <main className={`${s.nosotros} ${display.variable}`}>
      {/* HERO */}
      <section className={s.hero} aria-labelledby="nosotros-title">
        <div className={s.heroPhoto}>
          <Image src="/fachada-nosotros.jpg" alt="Local de Liliana Cirigliano en Necochea" fill sizes="(max-width: 760px) 100vw, 56vw" style={{ objectFit: "cover" }} />
        </div>
        <div className={s.container}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Sobre nosotros</p>
            <h1 id="nosotros-title">Necochea es chica.<br />Acá te atiendo<br /><span>yo, en persona.</span></h1>
            <p className={s.heroIntro}>Soy Liliana Cirigliano, martillera y corredora pública. Desde 2019 llevo la inmobiliaria yo misma: sin call center, sin formularios genéricos, con una sola persona respondiendo cada consulta.</p>
            <div className={s.heroActions}>
              <Link href="/contacto" className={s.button}>Hablar con Liliana <ArrowRight size={17} /></Link>
              <a href={MATRICULA_URL} target="_blank" rel="noopener noreferrer" className={s.textLink}>Ver matrícula <ArrowRight size={15} /></a>
            </div>
            <p className={s.heroLocation}><MapPin size={15} strokeWidth={1.4} />Necochea, Buenos Aires</p>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className={s.historia} aria-labelledby="historia-title">
        <div className={`${s.container} ${s.historiaGrid}`}>
          <figure>
            <div className={s.photoFrame}>
              <span className={`${s.corner} ${s.cornerTL}`} />
              <span className={`${s.corner} ${s.cornerTR}`} />
              <span className={`${s.corner} ${s.cornerBL}`} />
              <span className={`${s.corner} ${s.cornerBR}`} />
              <Image src="/liliana-nosotros.png" alt="Liliana Cirigliano — Gestiones Inmobiliarias" width={340} height={255} style={{ maxWidth: "78%", height: "auto", objectFit: "contain" }} />
            </div>
            <figcaption className={s.photoCaption}><span />Necochea, Buenos Aires</figcaption>
          </figure>

          <div className={s.historiaCopy}>
            <p className={s.eyebrow}>Atención personalizada</p>
            <h2 id="historia-title">Conocemos el mercado,<br /><span>entendemos lo que buscás.</span></h2>
            <p>El rubro inmobiliario requiere mucho más que simplemente mostrar propiedades; se trata de escuchar y entender la necesidad real de cada persona que entra a la oficina. Ese es el enfoque principal de nuestra inmobiliaria: un trato directo, realista y sin vueltas.</p>
            <p>Ya sea para tasaciones, ventas o alquileres, nos enfocamos en que el proceso sea dinámico y ordenado. Sabemos que el papeleo y los trámites pueden ser estresantes, por lo que nos ocupamos de filtrar el ruido y dejar las condiciones claras desde el primer momento.</p>
            <p>Trabajar de forma personalizada nos permite estar encima de cada detalle de la operación. Acá hablás siempre con la misma persona, asegurando respuestas concretas y priorizando la tranquilidad de tu inversión.</p>
            <Link href="/contacto" className={s.textLink}>Hablar con Liliana <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section className={s.trabajo} aria-labelledby="trabajo-title">
        <div className={s.container}>
          <div className={s.trabajoHead}>
            <p className={s.eyebrow} id="trabajo-title">Cómo trabajamos</p>
          </div>
          <div className={s.steps}>
            {[
              { num: "01", titulo: "Asesoramiento inicial", desc: "Escuchamos qué estás buscando comprar, vender o alquilar para entender tus prioridades y presupuesto real desde el primer día." },
              { num: "02", titulo: "Búsqueda y gestión", desc: "Seleccionamos propiedades o compradores adecuados. Filtramos las opciones para que no pierdas tiempo en visitas innecesarias." },
              { num: "03", titulo: "Cierre de operación", desc: "Nos ocupamos de la documentación, escribanía y coordinación. Un proceso prolijo y sin sorpresas de último momento." },
            ].map((item) => (
              <div key={item.num} className={s.step}>
                <span className={s.stepNum}>{item.num}</span>
                <h4>{item.titulo}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={`${s.container}`}>
          <div className={s.footerBrand}><House size={32} strokeWidth={1.1} /><div><p className={s.eyebrow}>Inmobiliaria</p><span className={s.footerName}>Liliana Cirigliano</span></div></div>
          <nav aria-label="Navegación al pie"><Link href="/">Inicio</Link><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></nav>
          <p>Necochea, Buenos Aires</p>
        </div>
        <div className={`${s.container} ${s.footerBottom}`}>
          <p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano.</p>
          <p className={s.matricInline}>Martillera y corredora pública matriculada · <a href={MATRICULA_URL} target="_blank" rel="noopener noreferrer">Ver matrícula</a></p>
        </div>
      </footer>
    </main>
  )
}