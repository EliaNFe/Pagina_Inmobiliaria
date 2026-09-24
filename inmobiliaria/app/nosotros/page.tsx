import Image from "next/image"
import Link from "next/link"
import { Fraunces } from "next/font/google"
import { ArrowRight, House, MapPin } from "lucide-react"
import s from "./nosotros.module.css"
import BrandHouse from "@/components/BrandHouse"

const display = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-nosotros-display" })

const MATRICULA_URL = "https://martillerosnecochea.com.ar/colegiados/cirigliano-liliana-noemi/"

export default function Nosotros() {
  return (
    <main className={`${s.nosotros} ${display.variable}`}>
      {/* HERO */}
      <section className={s.hero} aria-labelledby="nosotros-title">
        <div className={s.container + ' ' + s.heroGrid}>
          <div className={s.heroCopy}>
            <p className={s.eyebrow}>Liliana Cirigliano Â· Desde 2019</p>
            <h1 id="nosotros-title">Cada historia<br />merece un lugar.<br /><span>La tuya, tambiÃ©n.</span></h1>
            <p className={s.heroIntro}>Soy Liliana. Te acompaÃ±o a encontrar tu lugar en Necochea con la cercanÃ­a de conocernos y la tranquilidad de sentirte bien asesorado.</p>
            <div className={s.heroActions}>
              <Link href="/contacto" className={s.button}>Conversemos <span className={s.buttonArrow}><ArrowRight size={18} /></span></Link>
              <a href={MATRICULA_URL} target="_blank" rel="noopener noreferrer" className={s.textLink}>Ver matrÃ­cula <ArrowRight size={15} /></a>
            </div>
            <div className={s.heroSignature}><span className={s.signatureName}>Liliana Cirigliano</span><span>Martillera y corredora pÃºblica</span></div>
          </div>
          <figure className={s.heroVisual}>
            <div className={s.heroPhoto}><Image src="/fachada-nosotros.jpg" alt="Nuestra oficina de Liliana Cirigliano en Necochea" fill sizes="(max-width: 760px) 90vw, 42vw" preload /></div>
            <span className={s.photoSeal}>Desde<strong>2019</strong>junto a vos</span>
            <figcaption className={s.heroLocation}><MapPin size={15} strokeWidth={1.4} /><span>Un lugar donde empezar a conocernos.<small>Necochea, Buenos Aires</small></span></figcaption>
          </figure>
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
              <Image src="/liliana-nosotros.png" alt="Liliana Cirigliano â€” Gestiones Inmobiliarias" width={340} height={255} style={{ maxWidth: "78%", height: "auto", objectFit: "contain" }} />
            </div>
            <figcaption className={s.photoCaption}><span />Necochea, Buenos Aires</figcaption>
          </figure>

          <div className={s.historiaCopy}>
            <p className={s.eyebrow}>AtenciÃ³n personalizada</p>
            <h2 id="historia-title">Conocemos el mercado,<br /><span>entendemos lo que buscÃ¡s.</span></h2>
            <p>El rubro inmobiliario requiere mucho mÃ¡s que simplemente mostrar propiedades; se trata de escuchar y entender la necesidad real de cada persona que entra a la oficina. Ese es el enfoque principal de nuestra inmobiliaria: un trato directo, realista y sin vueltas.</p>
            <p>Ya sea para tasaciones, ventas o alquileres, nos enfocamos en que el proceso sea dinÃ¡mico y ordenado. Sabemos que el papeleo y los trÃ¡mites pueden ser estresantes, por lo que nos ocupamos de filtrar el ruido y dejar las condiciones claras desde el primer momento.</p>
            <p>Trabajar de forma personalizada nos permite estar encima de cada detalle de la operaciÃ³n. AcÃ¡ hablÃ¡s siempre con la misma persona, asegurando respuestas concretas y priorizando la tranquilidad de tu inversiÃ³n.</p>
            <Link href="/contacto" className={s.textLink}>Hablar con Liliana <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>

      {/* CÃ“MO TRABAJAMOS */}
      <section className={s.trabajo} aria-labelledby="trabajo-title">
        <div className={s.container}>
          <div className={s.trabajoHead}>
            <p className={s.eyebrow} id="trabajo-title">CÃ³mo trabajamos</p>
          </div>
          <div className={s.steps}>
            {[
              { num: "01", titulo: "Asesoramiento inicial", desc: "Escuchamos quÃ© estÃ¡s buscando comprar, vender o alquilar para entender tus prioridades y presupuesto real desde el primer dÃ­a." },
              { num: "02", titulo: "BÃºsqueda y gestiÃ³n", desc: "Seleccionamos propiedades o compradores adecuados. Filtramos las opciones para que no pierdas tiempo en visitas innecesarias." },
              { num: "03", titulo: "Cierre de operaciÃ³n", desc: "Nos ocupamos de la documentaciÃ³n, escribanÃ­a y coordinaciÃ³n. Un proceso prolijo y sin sorpresas de Ãºltimo momento." },
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
          <div className={s.footerBrand}><BrandHouse className="h-8 w-10 shrink-0 text-[#e79754]" /><div><p className={s.eyebrow}>Inmobiliaria</p><span className={s.footerName}>Liliana Cirigliano</span></div></div>
          <nav aria-label="NavegaciÃ³n al pie"><Link href="/">Inicio</Link><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link><Link href="/privacidad">Política de Privacidad</Link></nav>`r`n          <p>Necochea, Buenos Aires</p>
        </div>
        <div className={`${s.container} ${s.footerBottom}`}>
          <p>Â© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano.</p>
          <p className={s.matricInline}>Martillera y corredora pÃºblica matriculada Â· <a href={MATRICULA_URL} target="_blank" rel="noopener noreferrer">Ver matrÃ­cula</a></p>
        </div>
      </footer>
    </main>
  )
}
