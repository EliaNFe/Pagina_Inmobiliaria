import { getPropiedadesDestacadas } from "@/lib/supabase"
import Link from "next/link"
import SliderPropiedades from "@/components/SliderPropiedades"

export default async function Home() {
  const propiedades = await getPropiedadesDestacadas()

  return (
    <main className="antialiased">

             {/* HERO — estilo editorial, fondo oscuro sólido, foto diagonal */}
      <section style={{ background: "#1C0A00", position: "relative", overflow: "hidden" }} className="text-white">

        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_0.9fr] min-h-[640px]">

          {/* Columna de texto */}
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

          {/* Columna de foto — panel diagonal a pantalla completa */}
          <div
            className="relative hidden md:block"
            style={{
              clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/liliana-hero-cutout.png"
              alt="Liliana Cirigliano"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center 15%" }}
            />
            {/* Overlay duotono para integrar la foto a la paleta */}
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

        {/* Cinta de texto en movimiento */}
        <div style={{ background: "#C2540A", borderTop: "1px solid rgba(255,255,255,0.15)" }} className="py-3 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee-scroll 22s linear infinite" }}
          >
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

          
      {/* PROPIEDADES DESTACADAS */}
      {propiedades && propiedades.length > 0 && (
        <section style={{background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)"}}>
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-14 gap-4">
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#C2540A] uppercase mb-3">
                  Selección
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1C0A00] tracking-tight">
                  Propiedades destacadas
                </h2>
              </div>
              <Link
                href="/propiedades"
                className="text-sm font-semibold text-[#C2540A] hover:text-[#9A3412] transition-colors"
              >
                Ver catálogo completo →
              </Link>
            </div>

            <SliderPropiedades propiedades={propiedades as any} />
          </div>
</section>
      )}

      {/* CTA — Panel de vidrio sobre fondo oscuro */}
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
          {/* Acá está la magia del Glassmorfismo oscuro */}
         
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

      {/* FOOTER — línea de vidrio sutil para unificar con el resto */}
      <footer className="py-12 border-t border-white/10" style={{background: "#0A0300"}}>
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