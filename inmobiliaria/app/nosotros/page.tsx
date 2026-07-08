import Link from "next/link"

export default function Nosotros() {
  return (
    <main className="antialiased">

      {/* HERO — mismo degradé y blobs que el home */}
      <section
        className="relative overflow-hidden text-white pt-40 pb-20 px-6"
        style={{ background: "linear-gradient(135deg, #7C2D12 0%, #C2540A 45%, #EA580C 100%)" }}
      >
        <div style={{
          position: "absolute", right: "-100px", top: "-100px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)", pointerEvents: "none", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", left: "10%", bottom: "-80px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)", pointerEvents: "none", filter: "blur(20px)"
        }} />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.15em] text-[#FED7AA] uppercase mb-3">Sobre nosotros</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Liliana Cirigliano</h1>
          <p className="text-white/70 mt-3 max-w-lg">Inmobiliaria con años en el mercado de Necochea.</p>
        </div>
      </section>

      {/* HISTORIA — foto en panel de vidrio + texto */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)" }}>
        <div style={{
          position: "absolute", top: "-60px", right: "-80px",
          width: "340px", height: "340px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,84,10,0.12) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div className="relative flex items-center justify-center h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/10 backdrop-blur-2xl border border-white/50 rounded-[32px] rotate-2 scale-95 shadow-xl" />
            <span className="relative z-10 text-stone-400 text-sm">Foto de Liliana</span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-4">Más de dos décadas acompañando familias</h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              Liliana Cirigliano fundó la inmobiliaria en Necochea con una convicción simple: el proceso de comprar o vender una propiedad tiene que ser claro, honesto y sin presiones. En una industria donde a veces la urgencia reemplaza la confianza, ella eligió el camino contrario.
            </p>
            <p className="text-stone-500 leading-relaxed mb-4">
              A lo largo de más de 20 años, acompañó a cientos de familias en decisiones que cambiaron su vida. Eso da perspectiva, y también responsabilidad.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              Hoy la inmobiliaria sigue siendo un emprendimiento personal, donde cada cliente habla directamente con quien tiene la experiencia y el conocimiento del mercado local.
            </p>
            <Link
              href="/contacto"
              className="inline-block font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm text-white hover:-translate-y-0.5"
              style={{ background: "#C2540A", textDecoration: "none", boxShadow: "0 8px 24px rgba(194,84,10,0.3)" }}
            >
              Hablar con Liliana
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS — tarjetas de vidrio */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(180deg, #FEF3E8 0%, #FFF7ED 100%)" }}>
        <div style={{
          position: "absolute", bottom: "-100px", left: "-60px",
          width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-5xl mx-auto px-6">
          <h3 className="font-display text-2xl font-bold text-stone-900 mb-10 text-center">Cómo trabajamos</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", titulo: "Primera consulta", desc: "Nos contás qué estás buscando o qué querés vender. Sin formularios, sin burocracia. Una charla." },
              { num: "02", titulo: "Propuesta a medida", desc: "Te mostramos opciones reales que se ajustan a lo que necesitás, con precios y condiciones claras." },
              { num: "03", titulo: "Acompañamiento total", desc: "Desde la primera visita hasta la escritura. Y después también, si surge alguna duda." },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-7 transition-all hover:-translate-y-1"
                style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
              >
                <p className="text-2xl font-extrabold mb-3" style={{ color: "#C2540A" }}>{item.num}</p>
                <h4 className="font-display font-bold text-stone-900 mb-2 text-[15px]">{item.titulo}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER — igual al del home */}
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
