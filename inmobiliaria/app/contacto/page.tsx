import { getConfiguracion } from "@/lib/supabase"
import Link from "next/link"

export default async function Contacto() {
  const config = await getConfiguracion()

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
          <p className="text-xs font-bold tracking-[0.15em] text-[#FED7AA] uppercase mb-3">Contacto</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Hablemos</h1>
          <p className="text-white/70 mt-3 max-w-md">Sin formularios complicados. Elegí cómo contactarnos.</p>
        </div>
      </section>

      {/* CUERPO — fondo cálido con tarjetas de vidrio */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #FFF7ED 0%, #FEF3E8 100%)" }}>
        <div style={{
          position: "absolute", top: "-60px", left: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,84,10,0.12) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.14) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Medios de contacto</h2>
            <div className="flex flex-col gap-3">
              {config.whatsapp && (
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-white/55"
                  style={{ textDecoration: "none", boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center text-green-600 font-bold text-base shrink-0">W</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">WhatsApp</p>
                    <p className="text-stone-500 text-xs mt-0.5">Respuesta rápida — lunes a sábado</p>
                  </div>
                </a>
              )}
              {config.email && (
                <a
                  href={`mailto:${config.email}`}
                  className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-white/55"
                  style={{ textDecoration: "none", boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center text-orange-700 font-bold text-base shrink-0">@</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">Email</p>
                    <p className="text-stone-500 text-xs mt-0.5">{config.email}</p>
                  </div>
                </a>
              )}
              {config.telefono && (
                <a
                  href={`tel:${config.telefono}`}
                  className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-white/55"
                  style={{ textDecoration: "none", boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center text-blue-600 font-bold text-base shrink-0">T</div>
                  <div>
                    <p className="font-semibold text-stone-900 text-sm">Teléfono</p>
                    <p className="text-stone-500 text-xs mt-0.5">{config.telefono}</p>
                  </div>
                </a>
              )}
            </div>

            {config.horario && (
              <div
                className="mt-5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4"
                style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
              >
                <p className="font-bold text-orange-700 text-xs mb-1.5">Horario de atención</p>
                <p className="text-stone-500 text-sm leading-relaxed">{config.horario}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-stone-900 mb-5">Ubicación</h2>
            <div
              className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-4 mb-3"
              style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.08)" }}
            >
              <p className="font-bold text-stone-900 text-sm mb-1">Inmobiliaria Liliana Cirigliano</p>
              <p className="text-stone-500 text-sm leading-relaxed">{config.direccion || "Necochea, Buenos Aires"}</p>
            </div>
            <div
              className="bg-white/25 backdrop-blur-xl border border-white/50 rounded-2xl h-[180px] flex items-center justify-center"
              style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.06)" }}
            >
              <p className="text-orange-700/50 text-sm">Mapa — próximamente</p>
            </div>
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
