import Link from "next/link"
import { ArrowDownRight, Building2, Home as HomeIcon, Send, Store, Trees } from "lucide-react"
import { getConfiguracion, getPropiedadesDestacadas } from "@/lib/supabase"
import SliderPropiedades from "@/components/SliderPropiedades"
import ConsultaWhatsappForm from "@/components/ConsultaWhatsappForm"
import Reveal from "@/components/Reveal"

const TIPOS_PROPIEDAD = [
  { number: "01", title: "Casas", text: "Viviendas familiares en distintos barrios de la ciudad.", icon: HomeIcon, href: "/propiedades?tipo=Casa" },
  { number: "02", title: "Departamentos", text: "Unidades para vivir o invertir, en zonas céntricas y cercanas al mar.", icon: Building2, href: "/propiedades?tipo=Departamento" },
  { number: "03", title: "Terrenos", text: "Lotes listos para construir el proyecto que tenés en mente.", icon: Trees, href: "/propiedades?tipo=Terreno" },
  { number: "04", title: "Locales", text: "Espacios comerciales en puntos estratégicos de Necochea.", icon: Store, href: "/propiedades?tipo=Local%20comercial" },
]

export default async function Home() {
  const [propiedades, configuracion] = await Promise.all([getPropiedadesDestacadas(), getConfiguracion()])

  return (
    <main className="overflow-hidden bg-[#F8F1E9] text-[#1C0A00]">
      <style>{`
        @keyframes home-reveal { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes home-drift { from { transform: translate3d(0, 0, 0) scale(1.02) } to { transform: translate3d(-1.5%, -1%, 0) scale(1.07) } }
        @keyframes appear { from { opacity: .25; transform: scale(1.025) } to { opacity: 1; transform: scale(1) } }
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .home-reveal { animation: home-reveal .8s cubic-bezier(.2,.8,.2,1) both; }
        .home-reveal-delay { animation-delay: .15s; }
        .hero-image { animation: home-drift 15s ease-in-out alternate infinite; }
        .marquee-track { animation: marquee-left 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .home-reveal, .hero-image, .marquee-track { animation: none; } }
      `}</style>

      <section className="relative overflow-hidden text-white" style={{ background: "linear-gradient(180deg, #241005 0%, #1C0A00 100%)" }}>
        <div className="relative mx-auto min-h-[640px] max-w-7xl">
          <div className="pointer-events-none absolute hidden md:block" style={{ left: "48%", top: "-5%", width: "1px", height: "115%", background: "linear-gradient(180deg, transparent 0%, rgba(194,84,10,.22) 15%, rgba(194,84,10,.12) 85%, transparent 100%)", transform: "rotate(12deg)", transformOrigin: "top" }} />
          <div className="relative z-10 flex min-h-[640px] max-w-xl flex-col justify-center px-6 py-24 md:px-12">
            <div className="mb-10 flex items-center gap-4"><div className="h-px w-10 bg-[#C2540A]" /><span className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">Necochea, Buenos Aires</span></div>
            <h1 className="font-display text-[3.5rem] font-bold leading-[0.92] tracking-tight md:text-[4.6rem]">Tu próximo<br />hogar<span className="text-[#C2540A]">.</span></h1>
            <p className="mt-10 max-w-md text-lg font-light leading-8 text-white/70">Años acompañando familias a encontrar el lugar donde vivir. Terrenos, casas y departamentos en Necochea.</p>
            <div className="mt-12 flex items-center gap-10"><Link href="/propiedades" className="font-semibold text-white transition-colors hover:text-[#C2540A]">Ver propiedades</Link><Link href="/contacto" className="group inline-flex items-center gap-2 font-semibold text-white">Hablar con Liliana <span className="transition-transform duration-300 group-hover:translate-x-1">→</span></Link></div>
          </div>
          <div className="absolute inset-y-0 right-0 hidden w-[47%] md:block"><div className="pointer-events-none absolute right-8 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(194,84,10,.07) 0%, rgba(194,84,10,.025) 45%, transparent 75%)" }} />{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/liliana-hero-cutout.png" alt="Liliana Cirigliano" className="absolute bottom-0 right-[-45px] h-[103%] max-w-none select-none object-contain" draggable={false} /></div>
        </div>
        <div className="overflow-hidden border-t border-white/10 bg-[#C2540A] py-3">
          <div className="marquee-track flex w-max whitespace-nowrap text-sm font-semibold tracking-wide text-white">
            {[0, 1].map((rep) => (
              <span key={rep} className="flex shrink-0">
                Terrenos <b className="mx-6 text-orange-200">•</b> Casas <b className="mx-6 text-orange-200">•</b> Departamentos <b className="mx-6 text-orange-200">•</b> Locales comerciales <b className="mx-6 text-orange-200">•</b> Tasación <b className="mx-6 text-orange-200">•</b> Alquiler <b className="mx-6 text-orange-200">•</b> Necochea, Buenos Aires <b className="mx-6 text-orange-200">•</b>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#EAD9C9] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Reveal><div className="grid gap-10 md:grid-cols-[.8fr_1.2fr] md:gap-20"><div><p className="mb-4 text-xs font-bold uppercase tracking-[.22em] text-[#C2540A]">Explorá por tipo</p><h2 className="font-display text-3xl font-bold leading-[1] tracking-[-.04em] md:text-4xl">Encontrá lo que estás buscando.</h2></div><div className="self-end border-l border-[#C2540A]/35 pl-6 text-base leading-7 text-[#4C382D] md:pb-2">Filtrá por tipo de propiedad y accedé directo a las opciones disponibles.</div></div></Reveal>
          <div className="mt-20 grid border-y border-[#C2540A]/25 md:grid-cols-4">
            {TIPOS_PROPIEDAD.map(({ number, title, text, icon: Icon, href }) => <Link href={href} key={number} className="group border-b border-[#C2540A]/20 p-5 transition-colors hover:bg-[#F0E2D5] md:border-b-0 md:border-r md:last:border-r-0 md:p-6"><div className="flex items-start justify-between"><span className="font-display text-lg text-[#C2540A]">{number}</span><Icon size={19} strokeWidth={1.4} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div><h3 className="mt-9 font-display text-xl font-bold tracking-[-.03em]">{title}</h3><p className="mt-2 max-w-[16rem] text-xs leading-5 text-[#6B5548]">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#C2540A]">Ver propiedades <ArrowDownRight size={14} /></span></Link>)}
          </div>
        </div>
      </section>

      {propiedades && propiedades.length > 0 && (
        <section className="relative overflow-hidden bg-[#1C0A00] py-24 text-white md:py-32">
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(115deg, transparent, transparent 38px, rgba(242,178,122,0.035) 38px, rgba(242,178,122,0.035) 39px)" }} />
          <div className="relative mx-auto max-w-6xl px-6 md:px-10">
            <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-[-.03em] text-white md:text-4xl">Selección destacada</h2>
                <p className="mt-2 text-sm text-white/55">Propiedades elegidas para vos</p>
              </div>
              <Link href="/propiedades" className="hidden items-center gap-2 text-sm font-bold text-[#F2B27A] transition-colors hover:text-white sm:flex">Ver catálogo completo <ArrowDownRight size={16} /></Link>
            </div>
            <SliderPropiedades propiedades={propiedades as any} />
            <Link href="/propiedades" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#F2B27A] sm:hidden">Ver catálogo completo <ArrowDownRight size={16} /></Link>
          </div>
        </section>
      )}

      <section className="bg-[#EAD9C9] py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-[.95fr_1.05fr] md:px-10">
          <Reveal><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#C2540A]">Quiénes somos</p><h2 className="font-display text-3xl font-bold leading-[1.05] tracking-[-.035em] md:text-4xl">Una inmobiliaria dirigida por una martillera corredora pública y tasadora matriculada.</h2><p className="mt-7 max-w-xl leading-7 text-[#5D473B]">Una operación inmobiliaria es una decisión patrimonial muy importante; a la hora de hacerlo debés saber en manos de quién vas a dejar tu patrimonio. Liliana Cirigliano, desde 2019 está presente en el mercado inmobiliario de Necochea. No hay un call center ni un guion armado: cada consulta la atiende ella misma, conociendo la zona.</p><p className="mt-4 max-w-xl leading-7 text-[#5D473B]">Trabajamos con la convicción de que comprar o vender una propiedad es una decisión importante, y merece un trato directo, honesto y sin apuro. Confiá en una profesional que tiene formación y se capacita constantemente con un Colegio Profesional que la respalda.</p><a href="https://martycorrnecochea.com.ar/colegiados/cirigliano-liliana-noemi/" target="_blank" rel="noreferrer" className="mt-7 inline-flex border-b border-[#C2540A] pb-2 text-sm font-bold text-[#9A3E08]">Ver matrícula</a></div></Reveal>
          <Reveal delay={120}>
            <div
              className="relative flex h-[320px] items-center justify-center overflow-hidden sm:h-[400px]"
              style={{
                border: "1px solid rgba(194,84,10,0.25)",
                borderRadius: "16px",
                background: "linear-gradient(160deg, #E8863F 0%, #C2540A 100%)",
                boxShadow: "0 24px 48px rgba(28,10,0,0.16)",
              }}
            >
              <img src="/fachada-inmobiliaria.jpg" alt="Fachada de Inmobiliaria Liliana Cirigliano" className="absolute inset-0 h-full w-full object-cover object-top" />
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(232,134,63,0.28) 0%, rgba(194,84,10,0.08) 40%, rgba(28,10,0,0.05) 65%, rgba(28,10,0,0.45) 100%)" }} />
              <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 60px rgba(28,10,0,0.35)" }} />
              <span style={{ position: "absolute", top: 16, left: 16, width: 22, height: 22, borderTop: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)", borderTopLeftRadius: "4px" }} />
              <span style={{ position: "absolute", top: 16, right: 16, width: 22, height: 22, borderTop: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)", borderTopRightRadius: "4px" }} />
              <span style={{ position: "absolute", bottom: 16, left: 16, width: 22, height: 22, borderBottom: "2px solid rgba(255,255,255,0.6)", borderLeft: "2px solid rgba(255,255,255,0.6)", borderBottomLeftRadius: "4px" }} />
              <span style={{ position: "absolute", bottom: 16, right: 16, width: 22, height: 22, borderBottom: "2px solid rgba(255,255,255,0.6)", borderRight: "2px solid rgba(255,255,255,0.6)", borderBottomRightRadius: "4px" }} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div style={{ width: "18px", height: "1.5px", background: "#C2540A" }} />
              <p className="text-xs tracking-wide text-[#8A6A55]">Nuestro local — Necochea, Buenos Aires</p>
            </div><div className="mt-8 border-l border-[#C2540A]/40 pl-6"><p className="font-display text-xl font-bold text-[#1C0A00]">01 — Primera charla</p><p className="mt-1 text-sm leading-6 text-[#5D473B]">Nos contás qué buscás, sin formularios largos ni compromisos.</p><p className="mt-5 font-display text-xl font-bold text-[#1C0A00]">02 — Propuestas reales</p><p className="mt-1 text-sm leading-6 text-[#5D473B]">Te mostramos opciones que se ajustan a lo que necesitás de verdad.</p><p className="mt-5 font-display text-xl font-bold text-[#1C0A00]">03 — Acompañamiento</p><p className="mt-1 text-sm leading-6 text-[#5D473B]">Desde la primera visita hasta la escritura, y después también.</p></div></Reveal>
        </div>
      </section>

      <section className="bg-[#120602] py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-[1fr_.9fr] md:px-10"><Reveal><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#F2B27A]">Contacto</p><h2 className="font-display text-4xl font-bold leading-[1] tracking-[-.04em] md:text-5xl">¿Tenés una consulta?</h2><p className="mt-8 max-w-md text-lg leading-8 text-white/60">Sin compromisos. Solo una conversación para entender qué estás buscando.</p><Link href="/contacto" className="mt-9 inline-flex items-center gap-2 border-b border-[#F2B27A]/60 pb-2 text-sm font-bold text-[#F2B27A]">También podés escribirnos <ArrowDownRight size={16} /></Link></div></Reveal><Reveal delay={120}><div className="border-t border-white/20 pt-7 md:border-l md:border-t-0 md:pl-12 md:pt-0"><ConsultaWhatsappForm numeroWhatsapp={configuracion.whatsapp || ""} /><div className="mt-5 flex items-center gap-2 text-xs text-white/40"><Send size={13} />Tu consulta llega directamente por WhatsApp.</div></div></Reveal></div>
      </section>

      <footer className="bg-[#090200] px-6 py-10 text-white/45 md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano</p><div className="flex gap-5"><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></div><p>Necochea, Buenos Aires</p></div></footer>
    </main>
  )
}