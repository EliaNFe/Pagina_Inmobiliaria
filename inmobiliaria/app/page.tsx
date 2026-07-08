import { getPropiedadesDestacadas } from "@/lib/supabase"
import Link from "next/link"
import SliderPropiedades from "@/components/SliderPropiedades"

export default async function Home() {
  const propiedades = await getPropiedadesDestacadas()

  return (
    <main className="antialiased">

            {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 45%, #EA580C 100%)",
        position: "relative",
        overflow: "hidden"
      }} className="text-white">

        <div style={{
          position: "absolute", inset: 0, opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0zm40 40h40v40H40z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div style={{
          position: "absolute", right: "-120px", top: "-120px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", pointerEvents: "none",
          filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", right: "80px", bottom: "-60px",
          width: "250px", height: "250px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none",
          filter: "blur(20px)"
        }} />

        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-44 grid md:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-[4rem] font-bold tracking-tight leading-[1.05] mb-6 text-white drop-shadow-sm">
              Tu próximo hogar<br />
              <span className="text-[#FFD8B4]">está acá.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-lg font-light">
              Años acompañando a encontrar el lugar donde vivir. Terrenos, casas y departamentos en Necochea.
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 text-white font-semibold text-[15px] group"
                style={{ textDecoration: "none" }}
              >
                Ver propiedades
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 text-white font-semibold text-[15px] group"
                style={{ textDecoration: "none" }}
              >
                Hablar con Liliana
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
              {/* Panel espacial con la foto */}
<div className="relative hidden md:flex items-center justify-center h-[600px]">

  {/* Efecto Glass redondo principal que contiene la foto */}
  <div style={{
    position: "absolute",
    width: "440px", 
    height: "440px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(1px)",
    WebkitBackdropFilter: "blur(1px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
    overflow: "hidden", // Importante para contener el difuminado
    zIndex: 10,
  }}>

    {/* Imagen con difuminado (mask) solo en el borde inferior */}
    <div
      className="relative h-full w-full"
      style={{
        WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
      }}
      >
      <img
        src="/liliana-hero-cutout.png"
        alt="Liliana Cirigliano"
        className="w-full h-full object-contain"
        style={{ objectPosition: "center -40px" }} // Ajusta la altura de Liliana dentro del círculo
      />
    </div>
  </div>

  {/* Eliminé la sombra negra antigua que molestaba (anterior zIndex: 5) */}

  {/* Chip flotante actualizado */}
  <div
    className="absolute z-20 rounded-full px-8 py-4 shadow-xl"
    style={{ 
      bottom: "120px", // Ajustado para el nuevo layout
      left: "125px", // Ajustado para el nuevo layout
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(15px)",
      WebkitBackdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    }}
  >
    <p className="text-[24px] font-display font-extrabold text-orange-800 leading-none">Liliana Cirigliano</p>
    <p className="text-[14px] text-stone-800 font-medium tracking-tight">Necochea, Buenos Aires</p>
    </div>
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