import { getPropiedadesDestacadas, getConteoPorTipo } from "@/lib/supabase"
import Link from "next/link"
import SliderPropiedades from "@/components/SliderPropiedades"

const CATEGORIAS = [
  { tipo: "Casa", label: "Casas", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { tipo: "Departamento", label: "Departamentos", icon: "M4 21V3h16v18M9 21v-6h6v6M8 7h1M15 7h1M8 11h1M15 11h1" },
  { tipo: "Terreno", label: "Terrenos", icon: "M2 20l6-12 4 7 3-5 7 10H2z" },
  { tipo: "Local comercial", label: "Locales", icon: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6" },
]

export default async function Home() {
  const [propiedades, conteoPorTipo] = await Promise.all([
    getPropiedadesDestacadas(),
    getConteoPorTipo(),
  ])

  // Foto real de la primera propiedad destacada de cada tipo, si existe
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
      `}</style>

      {/* HERO */}
      <section style={{ background: "#1C0A00", position: "relative", overflow: "hidden" }} className="text-white">

        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_0.9fr] min-h-[640px]">

          <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-24">

            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: "36px", height: "1.5px", background: "#C2540A" }} />
              <span className="text-xs tracking-[0.2em] font-semibold text-orange-500 uppercase">
                Necochea, Buenos Aires
              </span>
            </div>

            <h1 className="font-display text-[3rem] md:text-[4.2rem] font-bold tracking-tight leading-[0.98] mb-8">
              Tu próximo
              <br />
              hogar<span style={{ color: "#C2540A" }}>.</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed max-w-md mb-12 font-light">
              Años acompañando familias a encontrar el lugar donde vivir. Terrenos, casas y departamentos en Necochea.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/propiedades"
                className="inline-flex items-center justify-center font-semibold text-[15px] px-8 py-4 transition-colors"
                style={{ textDecoration: "none", background: "#C2540A", color: "#fff", borderRadius: "4px" }}
              >
                Ver propiedades
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 font-semibold text-[15px] text-white group"
                style={{ textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: "2px" }}
              >
                Hablar con Liliana
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          <div
            className="relative hidden md:block"
            style={{ clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/liliana-hero-cutout.png"
              alt="Liliana Cirigliano"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center 15%" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(160deg, rgba(124,45,18,0.55) 0%, rgba(28,10,0,0.15) 55%, rgba(28,10,0,0.65) 100%)",
              mixBlendMode: "multiply",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(0deg, rgba(28,10,0,0.5) 0%, transparent 35%)",
            }} />
          </div>
        </div>

        <div style={{ background: "#C2540A", borderTop: "1px solid rgba(255,255,255,0.15)" }} className="py-3 overflow-hidden">
          <div className="flex whitespace-nowrap" style={{ animation: "marquee-scroll 22s linear infinite" }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center">
                {["Terrenos", "Casas", "Departamentos", "Locales comerciales", "+20 años de experiencia", "Necochea, Buenos Aires"].map((item) => (
                  <span key={item} className="flex items-center text-white font-semibold text-sm tracking-wide">
                    {item}
                    <span className="mx-6 text-orange-200">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* WRAPPER — une tiles + destacadas en un solo fondo continuo con parallax CSS puro */}
      <div
        style={{
          position: "relative",
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='4' cy='4' r='2' fill='%23C2540A' fill-opacity='0.22'/%3E%3C/svg%3E"),
            radial-gradient(circle at 92% 8%, rgba(194,84,10,0.16) 0%, transparent 42%),
            radial-gradient(circle at 4% 55%, rgba(28,10,0,0.06) 0%, transparent 40%),
            radial-gradient(circle at 85% 92%, rgba(194,84,10,0.14) 0%, transparent 42%),
            linear-gradient(180deg, #FDFBF9 0%, #FFF7ED 55%, #FEF3E8 100%)
          `,
          backgroundAttachment: "fixed, fixed, fixed, fixed, scroll",
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

        {/* PROPIEDADES DESTACADAS */}
        {propiedades && propiedades.length > 0 && (
          <section style={{ position: "relative", background: "transparent" }}>
            <div className="relative max-w-6xl mx-auto px-6 py-24">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-14 gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] text-[#C2540A] uppercase mb-3">
                    Selección
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1C0A00] tracking-tight">
                    Propiedades destacadas
                  </h2>
                </div>
                <Link href="/propiedades" className="text-sm font-semibold text-[#C2540A] hover:text-[#9A3412] transition-colors">
                  Ver catálogo completo →
                </Link>
              </div>

              <SliderPropiedades propiedades={propiedades as any} />
            </div>
          </section>
        )}
      </div>


      {/* CTA */}
      <section
        className="relative overflow-hidden py-28 text-center"
        style={{ background: "linear-gradient(135deg, #1C0A00 0%, #431407 100%)" }}
      >
        <div style={{
          position: "absolute", left: "20%", top: "-80px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.3) 0%, transparent 70%)",
          filter: "blur(20px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", right: "15%", bottom: "-100px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(20px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-lg mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5">
            ¿Tenés una consulta?
          </h2>
          <p className="text-[16px] text-white/60 mb-10 leading-relaxed">
            Sin compromisos. Solo una conversación para entender qué estás buscando.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-white font-semibold text-[15px] group"
            style={{ textDecoration: "none" }}
          >
            <u>Contactar a Liliana</u>
          </Link>
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
