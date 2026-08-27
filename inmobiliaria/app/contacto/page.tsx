import { getConfiguracion } from "@/lib/supabase"
import Link from "next/link"

// Acepta "@usuario", "usuario" o un link completo y siempre devuelve una URL válida.
function linkInstagram(valor?: string) {
  if (!valor) return null
  const limpio = valor.trim()
  if (limpio.startsWith("http")) return limpio
  const usuario = limpio.replace(/^@/, "")
  return `https://instagram.com/${usuario}`
}

export default async function Contacto() {
  const config = await getConfiguracion()
  const instagramHref = linkInstagram(config.instagram)

  return (
    <main className="antialiased">

      {/* HERO — mismo degradé y blobs que el home */}
      <section
        className="relative overflow-hidden text-white pt-40 pb-20 px-6"
        style={{
          background: `
            radial-gradient(circle at 82% 18%, rgba(194,84,10,0.24) 0%, transparent 34%),
            radial-gradient(circle at 12% 100%, rgba(234,88,12,0.10) 0%, transparent 30%),
            linear-gradient(135deg, #120704 0%, #1C0A00 58%, #2A1007 100%)
          `,
        }}
      >
        <div style={{
          position: "absolute", right: "-100px", top: "-100px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "rgba(194,84,10,0.10)", pointerEvents: "none", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", left: "10%", bottom: "-80px",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "rgba(255,247,237,0.035)", pointerEvents: "none", filter: "blur(20px)"
        }} />

        <div className="relative max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-[0.15em] text-[#ECA56F] uppercase mb-3">Contacto</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Hablemos</h1>
          <p className="text-white/55 mt-3 max-w-md">Sin formularios complicados. Elegí cómo contactarnos.</p>
        </div>
      </section>

      {/* CUERPO — fondo cálido con tarjetas de vidrio */}
      <section
        className="relative py-20 overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 4% 12%, rgba(194,84,10,0.08) 0%, transparent 28%),
            radial-gradient(circle at 96% 88%, rgba(194,84,10,0.06) 0%, transparent 30%),
            linear-gradient(180deg, #FDFBF9 0%, #FBF7F2 52%, #FFF9F2 100%)
          `,
        }}
      >
        <div style={{
          position: "absolute", top: "-60px", left: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,84,10,0.07) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-100px", right: "-60px",
          width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194,84,10,0.06) 0%, transparent 70%)",
          filter: "blur(30px)", pointerEvents: "none"
        }} />

        <div className="relative max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12">
  <div>
    <h2 className="font-display text-xl font-bold text-[#1C0A00] mb-5">Medios de contacto</h2>
    <div className="flex flex-col gap-3">
      
      {config.whatsapp && (
        <a
          href={`https://wa.me/${config.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          // Cambiamos a justify-between y un padding más uniforme
          className="group flex items-center justify-between bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl p-4 md:px-5 transition-all hover:-translate-y-0.5 hover:bg-white"
          style={{ textDecoration: "none", boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
        >
          {/* GRUPO IZQUIERDO: Ícono + Textos */}
          <div className="flex items-center gap-3 md:gap-4 pr-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EEE7] backdrop-blur-md border border-[#E8D9CC] flex items-center justify-center text-green-700 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1C0A00] text-sm">Enviar WhatsApp</p>
              {/* text-balance ayuda a que si baja de línea quede armónico */}
              <p className="text-[#766158] text-xs mt-0.5 text-balance">Respuesta rápida — lunes a sábado</p>
            </div>
          </div>

          {/* FLECHA DERECHA (aislada) */}
          <div className="shrink-0 text-[#A89489] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C2540A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </a>
      )}

      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl p-4 md:px-5 transition-all hover:-translate-y-0.5 hover:bg-white"
          style={{ textDecoration: "none", boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
        >
          <div className="flex items-center gap-3 md:gap-4 pr-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EEE7] backdrop-blur-md border border-[#E8D9CC] flex items-center justify-center text-pink-700 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1C0A00] text-sm">Visitar Instagram</p>
              <p className="text-[#766158] text-xs mt-0.5 text-balance">Mirá las últimas propiedades publicadas</p>
            </div>
          </div>
          <div className="shrink-0 text-[#A89489] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C2540A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </a>
      )}

      {config.email && (
        <a
          href={`mailto:${config.email}`}
          className="group flex items-center justify-between bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl p-4 md:px-5 transition-all hover:-translate-y-0.5 hover:bg-white"
          style={{ textDecoration: "none", boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
        >
          <div className="flex items-center gap-3 md:gap-4 pr-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EEE7] backdrop-blur-md border border-[#E8D9CC] flex items-center justify-center text-[#B64B08] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            {/* Break-all ayuda si tienen un mail muy largo para que no rompa la caja */}
            <div className="break-all sm:break-normal">
              <p className="font-semibold text-[#1C0A00] text-sm">Escribir un correo</p>
              <p className="text-[#766158] text-xs mt-0.5">{config.email}</p>
            </div>
          </div>
          <div className="shrink-0 text-[#A89489] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C2540A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </a>
      )}

      {config.telefono && (
        <a
          href={`tel:${config.telefono}`}
          className="group flex items-center justify-between bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl p-4 md:px-5 transition-all hover:-translate-y-0.5 hover:bg-white"
          style={{ textDecoration: "none", boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
        >
          <div className="flex items-center gap-3 md:gap-4 pr-3">
            <div className="w-10 h-10 rounded-full bg-[#F5EEE7] backdrop-blur-md border border-[#E8D9CC] flex items-center justify-center text-blue-700 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#1C0A00] text-sm">Llamar ahora</p>
              <p className="text-[#766158] text-xs mt-0.5">{config.telefono}</p>
            </div>
          </div>
          <div className="shrink-0 text-[#A89489] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#C2540A]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </a>
      )}

    </div>

            {config.horario && (
              <div
                className="mt-5 bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl px-5 py-4"
                style={{ boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-1.5 text-[#B64B08]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="font-bold text-xs uppercase tracking-wider">Horario</p>
                </div>
                <p className="text-[#766158] text-sm leading-relaxed">{config.horario}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-[#1C0A00] mb-5">Ubicación</h2>
            <div
              className="bg-[#FFFCF8]/90 backdrop-blur-xl border border-[#E9DDD2] rounded-2xl px-5 py-4 mb-3"
              style={{ boxShadow: "0 10px 28px rgba(28,10,0,0.07)" }}
            >
              <div className="flex items-center gap-2 mb-1 text-[#1C0A00]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <p className="font-bold text-sm">Inmobiliaria Liliana Cirigliano</p>
              </div>
              <p className="text-[#766158] text-sm leading-relaxed pl-6">{config.direccion || "Necochea, Buenos Aires"}</p>
            </div>
            <div
              className="bg-[#F3EAE2] border border-[#E1D2C4] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 12px 30px rgba(28,10,0,0.08)", height: "220px" }}
            >
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(config.direccion || ", Necochea, Buenos Aires")}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la inmobiliaria"
              />
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
