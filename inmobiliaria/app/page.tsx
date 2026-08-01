import { getPropiedadesDestacadas, getConteoPorTipo } from "@/lib/supabase"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import SliderPropiedades from "@/components/SliderPropiedades"
import ConsultaWhatsappForm from "@/components/ConsultaWhatsappForm"
import Reveal from "@/components/Reveal"

const CATEGORIAS = [
  { tipo: "Casa", label: "Casas", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { tipo: "Departamento", label: "Departamentos", icon: "M4 21V3h16v18M9 21v-6h6v6M8 7h1M15 7h1M8 11h1M15 11h1" },
  { tipo: "Terreno", label: "Terrenos", icon: "M2 20l6-12 4 7 3-5 7 10H2z" },
  { tipo: "Local comercial", label: "Locales", icon: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" },
]

export default async function Home() {
  const [propiedades, conteoPorTipo, configData] = await Promise.all([
    getPropiedadesDestacadas(),
    getConteoPorTipo(),
    supabase.from("configuracion").select("*"),
  ])

  const whatsapp = configData.data?.find((c: any) => c.clave === "whatsapp")?.valor || ""

  const imagenPorTipo: Record<string, string> = {}
  propiedades?.forEach((p: any) => {
    if (p.tipo && p.imagen_url && !imagenPorTipo[p.tipo]) {
      imagenPorTipo[p.tipo] = p.imagen_url
    }
  })

  return (
    <main className="antialiased">

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* "fixed" en desktop se ve lindo, pero en mobile obliga a repintar
           el fondo en cada frame de scroll y genera lag. Ahí lo dejamos
           "scroll" (comportamiento normal), que es liviano. Esto es lo
           único que toca este bloque — el resto del Home queda intacto. */
        .fondo-texturado {
          background-attachment: fixed, fixed, fixed, fixed, scroll;
        }
        @media (max-width: 768px) {
          .fondo-texturado {
            background-attachment: scroll, scroll, scroll, scroll, scroll;
          }
        }
      `}</style>

  {/* HERO */}
<section
  className="relative overflow-hidden text-white"
  style={{
    background: "linear-gradient(180deg, #241005 0%, #1C0A00 100%)",
  }}
>
  <div className="relative max-w-7xl mx-auto min-h-[640px]">

    {/* Línea diagonal */}
    <div
      className="absolute pointer-events-none hidden md:block"
      style={{
        left: "48%",
        top: "-5%",
        width: "1px",
        height: "115%",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(194,84,10,.22) 15%, rgba(194,84,10,.12) 85%, transparent 100%)",
        transform: "rotate(12deg)",
        transformOrigin: "top",
      }}
    />

    {/* Contenido */}
    <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-24 max-w-xl min-h-[640px]">

      <div className="flex items-center gap-4 mb-10">
        <div className="w-10 h-px bg-[#C2540A]" />

        <span className="text-xs tracking-[0.22em] font-semibold uppercase text-orange-400">
          Necochea, Buenos Aires
        </span>
      </div>

      <h1 className="font-display text-[3.5rem] md:text-[4.6rem] font-bold leading-[0.92] tracking-tight">
        Tu próximo
        <br />
        hogar
        <span className="text-[#C2540A]">.</span>
      </h1>

      <p className="mt-10 text-lg leading-8 text-white/70 font-light max-w-md">
        Años acompañando familias a encontrar el lugar donde vivir.
        Terrenos, casas y departamentos en Necochea.
      </p>

      <div className="flex items-center gap-10 mt-12">

        <Link
          href="/propiedades"
          className="font-semibold text-white hover:text-[#C2540A] transition-colors"
        >
          Ver propiedades
        </Link>

        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 font-semibold text-white group"
        >
          Hablar con Liliana

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>

        </Link>

      </div>

    </div>

    {/* Imagen */}
    <div className="hidden md:block absolute inset-y-0 right-0 w-[47%]">

      {/* Luz MUY sutil */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(194,84,10,.07) 0%, rgba(194,84,10,.025) 45%, transparent 75%)",
        }}
      />

      <img
        src="/liliana-hero-cutout.png"
        alt="Liliana Cirigliano"
        className="absolute bottom-[0px] right-[-45px] h-[103%] w-auto max-w-none object-contain select-none"
        draggable={false}
      />

      {/* Sombra inferior muy suave */}
      <div
        className="absolute bottom-0 right-24 w-[280px] h-10 rounded-full blur-2xl opacity-25"
        style={{
          background: "#000",
        }}
      />

    </div>

  </div>

  {/* Franja inferior */}
  <div className="bg-[#C2540A] border-t border-white/10 py-3 overflow-hidden">

    <div
      className="flex whitespace-nowrap"
      style={{
        animation: "marquee-scroll 22s linear infinite",
      }}
    >
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center">

          {[
            "Terrenos",
            "Casas",
            "Departamentos",
            "Locales comerciales",
            "Tasación",
            "Alquiler",
            "Necochea, Buenos Aires",
          ].map((item) => (
            <span
              key={item}
              className="flex items-center text-white font-semibold text-sm tracking-wide"
            >
              {item}
              <span className="mx-6 text-orange-200">•</span>
            </span>
          ))}

        </div>
      ))}
    </div>

  </div>

</section>

      {/* WRAPPER — une tiles + destacadas + quiénes somos en un solo fondo continuo */}
      <div
        className="fondo-texturado"
        style={{
          position: "relative",
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='2' fill='%23C2540A' fill-opacity='0.22'/%3E%3C/svg%3E"),
            radial-gradient(circle at 92% 8%, rgba(194,84,10,0.16) 0%, transparent 42%),
            radial-gradient(circle at 4% 55%, rgba(28,10,0,0.06) 0%, transparent 40%),
            radial-gradient(circle at 85% 92%, rgba(194,84,10,0.14) 0%, transparent 42%),
            linear-gradient(180deg, #FDFBF9 0%, #FFF7ED 55%, #FEF3E8 100%)
          `,
          backgroundSize: "48px 48px, auto, auto, auto, auto",
          backgroundRepeat: "repeat, no-repeat, no-repeat, no-repeat, no-repeat",
        }}
      >

        {/* TILES POR CATEGORÍA */}
        <section style={{ position: "relative", background: "transparent" }} className="py-16">
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
              <span className="text-xs tracking-[0.2em] font-semibold text-orange-700 uppercase">
                Explorá por tipo
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIAS.map((cat, i) => {
                const destacado = i === CATEGORIAS.length - 1
                const foto = imagenPorTipo[cat.tipo]

                return (
                  <Link
                    key={cat.tipo}
                    href={`/propiedades?tipo=${encodeURIComponent(cat.tipo)}`}
                    className="group block"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="relative overflow-hidden transition-transform duration-300 group-hover:-translate-y-1"
                      style={{
                        background: foto ? undefined : (destacado ? "#C2540A" : "#1C0A00"),
                        borderRadius: "8px",
                        padding: "1.5rem 1.25rem",
                        minHeight: "170px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      {foto && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={foto}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-110"
                            style={{ objectFit: "cover" }}
                          />
                          <div style={{
                            position: "absolute", inset: 0,
                            background: "linear-gradient(180deg, rgba(28,10,0,0.35) 0%, rgba(28,10,0,0.75) 100%)",
                          }} />
                        </>
                      )}

                      <svg
                        className="relative"
                        width="26" height="26" viewBox="0 0 24 24" fill="none"
                        stroke={foto ? "#FFD8B4" : (destacado ? "#1C0A00" : "#C2540A")}
                        strokeWidth="1.8"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={cat.icon} />
                      </svg>

                      <div className="relative">
                        <div style={{
                          width: "22px", height: "1.5px", marginBottom: "10px",
                          background: foto ? "#FFD8B4" : (destacado ? "#1C0A00" : "#C2540A"),
                        }} />
                        <p
                          className="font-display font-bold"
                          style={{ color: foto ? "#fff" : (destacado ? "#1C0A00" : "#fff"), fontSize: "16px", marginBottom: "2px" }}
                        >
                          {cat.label}
                        </p>
                        <p style={{
                          color: foto ? "rgba(255,255,255,0.7)" : (destacado ? "rgba(28,10,0,0.6)" : "rgba(255,255,255,0.4)"),
                          fontSize: "12px",
                        }}>
                          {conteoPorTipo[cat.tipo] || 0} disponibles
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
<Reveal>
        {/* PROPIEDADES DESTACADAS */}
        {propiedades && propiedades.length > 0 && (
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-6">
              
              {/* Encabezado más compacto y elegante */}
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1C0A00] tracking-tight mb-1">
                    Selección destacada
                  </h2>
                  <p className="text-stone-500 text-sm">Propiedades elegidas para vos</p>
                </div>
                <Link 
                  href="/propiedades" 
                  className="hidden sm:flex text-sm font-semibold text-[#C2540A] hover:opacity-70 transition-opacity"
                >
                  Ver catálogo completo →
                </Link>
              </div>

              {/* Slider - Contenedor ajustado */}
              <div className="relative">
                <SliderPropiedades propiedades={propiedades as any} />
              </div>

              {/* Link móvil (para cuando no se ve el de arriba) */}
              <div className="sm:hidden mt-6 text-center">
                 <Link href="/propiedades" className="text-sm font-semibold text-[#C2540A]">
                  Ver catálogo completo →
                </Link>
              </div>
            </div>
          </section>
        )}
</Reveal>
        {/* QUIÉNES SOMOS */}
        <section style={{ position: "relative", background: "transparent" }} className="pb-24">
          <div className="relative max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-14 items-stretch">

              <div>
                <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
                  <span className="text-xs tracking-[0.2em] font-semibold text-orange-700 uppercase">
                    Quiénes somos
                  </span>
                </div>
                
                <h2 className="font-display text-3xl md:text-3xl font-bold text-[#1C0A00] tracking-tight leading-[1.15] mb-6">
                  UNA INMOBILIARIA DIRIGIDA POR  UNA MARTILLERA CORREDORA PUBLICA Y TASADORA MATRICULADA
                </h2>
                <p className="text-stone-600 leading-relaxed mb-4">
                  Una operación inmobiliaria es una decisión patrimonial muy importante, a la hora de hacerlo debes saber en manos de quien vas a dejar tu patrimonio.
                  Liliana Cirigliano, desde 2019 está presente en el mercado inmobiliario de Necochea. No hay un call center ni un guion armado — cada consulta la atiende ella misma, conociendo la zona.
                </p>
                <p className="text-stone-600 leading-relaxed mb-8">
                  Trabajamos con la convicción de que comprar o vender una propiedad es una decisión importante, y merece un trato directo, honesto y sin apuro.
                  Confiá en una profesional que tiene formación y se capacita constantemente con un Colegio Profesional que la respalda
                </p>
                <a
                  href="/nosotros"
                  className="inline-flex items-center gap-2 font-semibold text-[15px] text-orange-700 group"
                  style={{ textDecoration: "none" }}
                >
                  Conocer más sobre nosotros
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                </Reveal>
              </div>
        <div className="flex flex-col gap-4 md:pt-1">
          {[
          { n: "01", t: "Primera charla", d: "Nos contás qué buscás, sin formularios largos ni compromisos." },
          { n: "02", t: "Propuestas reales", d: "Te mostramos opciones que se ajustan a lo que necesitás de verdad." },
          { n: "03", t: "Acompañamiento", d: "Desde la primera visita hasta la escritura, y después también." },
          ].map((item) => (
          <Reveal key={item.n}> {/* El Reveal ahora envuelve individualmente a cada tarjeta */}
          <div
          className="flex items-start gap-4 backdrop-blur-sm"
          style={{
              background: "rgba(255, 255, 255, 0.62)",
              border: "1px solid rgba(194, 84, 10, 0.18)",
              borderRadius: "12px", 
              padding: "1.15rem 1.25rem",
              boxShadow: "0 8px 24px -14px rgba(28, 10, 0, 0.24)"
              }}
              > 
              <span className="font-display font-extrabold text-orange-700" style={{ fontSize: "22px", lineHeight: 1 }}>
              {item.n}
              </span>
              <div>
                <p className="font-display font-bold text-stone-900 text-[15px] mb-1">{item.t}</p>
                <p className="text-stone-500 text-sm leading-relaxed">{item.d}</p>
                </div>
              </div>
            </Reveal>
            ))}
            </div>

            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
<section
  className="border-t border-[#382015]"
  style={{ background: "#1C0A00" }}
>
  <div className="max-w-6xl mx-auto px-6 py-24">

    <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

      {/* TEXTO */}
      <Reveal>
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C2540A] font-semibold">
            Contacto
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mt-6">
            ¿Tenés una consulta?
          </h2>
          <p className="mt-6 text-lg text-white/60 leading-8 max-w-md">
            Sin compromisos. Solo una conversación para entender qué estás buscando.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 mt-10 text-[#C2540A] font-semibold group"
          >
            También podés escribirnos
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Reveal>

      {/* FORMULARIO */}
      <Reveal delay={150}>
        <div>
          <ConsultaWhatsappForm numeroWhatsapp={whatsapp} />
        </div>
      </Reveal>
    </div>
  </div>
</section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10" style={{ background: "#0A0300" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires
          </p>
          <nav className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/50 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors px-3 py-1.5 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}
