import Link from "next/link"
import { ArrowDownRight, Building2, Home as HomeIcon, Send, Trees } from "lucide-react"
import { getConfiguracion, getPropiedadesDestacadas } from "@/lib/supabase"
import SliderPropiedades from "@/components/SliderPropiedades"
import ConsultaWhatsappForm from "@/components/ConsultaWhatsappForm"
import Reveal from "@/components/Reveal"

const TIPOS_PROPIEDAD = [
  { number: "01", title: "Casas", text: "Viviendas familiares en distintos barrios de la ciudad.", icon: HomeIcon, href: "/propiedades?tipo=Casa" },
  { number: "02", title: "Departamentos", text: "Unidades para vivir o invertir, en zonas céntricas y cercanas al mar.", icon: Building2, href: "/propiedades?tipo=Departamento" },
  { number: "03", title: "Terrenos", text: "Lotes listos para construir el proyecto que tenés en mente.", icon: Trees, href: "/propiedades?tipo=Terreno" },
  { number: "04", title: "Lotes", text: "Lotes disponibles para construir el proyecto que tenés en mente.", icon: Trees, href: "/propiedades?tipo=Lote" },
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
            <div className="mb-10 flex items-center gap-4"><div className="h-px w-10 bg-[#C2540A]" /><span className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">Inmobiliaria · Buenos Aires</span></div>
            <h1 className="font-display text-[3.5rem] font-bold leading-[0.92] tracking-[-0.045em] md:text-[4.6rem]">Propiedades<br /><span className="font-medium text-white/90">en Necochea</span><span className="text-[#C2540A]">.</span></h1>
            <p className="mt-10 max-w-md text-lg font-light leading-8 text-white/70">Acompañamos a familias a encontrar su lugar. Casas, departamentos y terrenos seleccionados para vivir o invertir.</p>
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

      <section className="relative overflow-hidden bg-[#EAD9C9] py-24 md:py-32">
        <div className="pointer-events-none absolute -left-40 top-16 h-[440px] w-[440px] rounded-full border border-[#C2540A]/10 md:h-[620px] md:w-[620px]" />
        <div className="pointer-events-none absolute -left-20 top-36 h-[300px] w-[300px] rounded-full border border-[#C2540A]/10 md:h-[440px] md:w-[440px]" />

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 md:grid-cols-[.68fr_1.32fr] md:gap-20 md:px-10 lg:gap-28">
          <Reveal>
            <div className="md:sticky md:top-28 md:self-start">
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-[#C2540A]">
                <span className="h-px w-8 bg-[#C2540A]" />
                Explorá por tipo
              </p>
              <h2 className="max-w-sm font-display text-4xl font-bold leading-[.98] tracking-[-.045em] md:text-5xl">
                Cada búsqueda empieza por un lugar.
              </h2>
              <p className="mt-7 max-w-xs text-sm leading-6 text-[#5D473B]">
                Elegí el tipo de propiedad y descubrí las oportunidades disponibles en Necochea.
              </p>
              <div className="mt-10 hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[.18em] text-[#8A6A55] md:flex">
                Deslizá para explorar
                <ArrowDownRight size={15} strokeWidth={1.5} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <nav aria-label="Tipos de propiedad" className="border-b border-[#9A3E08]/25">
              {TIPOS_PROPIEDAD.map(({ number, title, text, icon: Icon, href }) => (
                <Link
                  href={href}
                  key={number}
                  className="group relative grid gap-4 border-t border-[#9A3E08]/25 py-7 sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-6 md:py-8"
                >
                  <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-[#C2540A] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="self-start font-display text-sm text-[#C2540A] sm:self-center">{number}</span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-4">
                      <h3 className="font-display text-[2rem] font-bold leading-none tracking-[-.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.65rem]">
                        {title}
                      </h3>
                      <Icon size={20} strokeWidth={1.25} className="shrink-0 text-[#8A6A55] transition-all duration-500 group-hover:rotate-[-6deg] group-hover:text-[#C2540A]" />
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#6B5548]">{text}</p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-2 border-b border-[#8A6A55]/40 pb-1 text-[11px] font-semibold uppercase tracking-[.12em] text-[#6B5548] transition-colors duration-300 group-hover:border-[#1C0A00] group-hover:text-[#1C0A00]">
                    Ver propiedades
                    <ArrowDownRight size={13} strokeWidth={1.5} />
                  </span>
                </Link>
              ))}
            </nav>
          </Reveal>
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

      <section id="consulta" className="bg-[#120602] py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-[1fr_.9fr] md:px-10"><Reveal><div><p className="mb-5 text-xs font-bold uppercase tracking-[.22em] text-[#F2B27A]">Contacto</p><h2 className="font-display text-4xl font-bold leading-[1] tracking-[-.04em] md:text-5xl">¿Tenés una consulta?</h2><p className="mt-8 max-w-md text-lg leading-8 text-white/60">Sin compromisos. Solo una conversación para entender qué estás buscando.</p><Link href="/contacto" className="mt-9 inline-flex items-center gap-2 border-b border-[#F2B27A]/60 pb-2 text-sm font-bold text-[#F2B27A]">También podés escribirnos <ArrowDownRight size={16} /></Link></div></Reveal><Reveal delay={120}><div className="border-t border-white/20 pt-7 md:border-l md:border-t-0 md:pl-12 md:pt-0"><ConsultaWhatsappForm numeroWhatsapp={configuracion.whatsapp || ""} /><div className="mt-5 flex items-center gap-2 text-xs text-white/40"><Send size={13} />Tu consulta llega directamente por WhatsApp.</div></div></Reveal></div>
      </section>

      <footer className="bg-[#090200] px-6 py-10 text-white/45 md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano</p><div className="flex gap-5"><Link href="/propiedades">Propiedades</Link><Link href="/nosotros">Nosotros</Link><Link href="/contacto">Contacto</Link></div><p>Necochea, Buenos Aires</p></div></footer>
    </main>
  )
}
