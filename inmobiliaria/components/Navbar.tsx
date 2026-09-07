"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, MessageCircle, ArrowUpRight } from "lucide-react"

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/nosotros", label: "Nosotros", icon: Users },
  { href: "/contacto", label: "Contacto", icon: MessageCircle },
]

export default function Navbar() {
  const pathname = usePathname()

  // El panel de admin tiene su propia navegación interna;
  // el navbar público no debe superponerse ahí.
  if (pathname?.startsWith("/admin")) return null

  // Si ya estamos en Home, hacemos scroll suave en vez de saltar de golpe.
  // Si venimos de otra página, dejamos que el Link navegue normal (el ancla igual funciona).
  const handleConsultaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      document.getElementById("consulta")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" })
    }
  }

  return (
    <>
      {/* NAV DESKTOP — barra sólida, elegante, sin glass */}
      <header
        className="hidden md:block fixed top-0 inset-x-0 z-50"
        style={{
          background: "#1C0A00",
          borderBottom: "1px solid rgba(242,178,122,0.14)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-5 px-8 lg:px-12 h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 leading-none" style={{ textDecoration: "none" }}>
            <Home size={38} strokeWidth={1.1} className="hidden lg:block text-[#e79754]" aria-hidden="true" />
            <span className="flex flex-col">
            <span className="text-[10px] tracking-[0.28em] text-[#C2540A] font-semibold uppercase">
              Inmobiliaria
            </span>
            <span className="font-display text-[19px] font-bold text-white mt-1 tracking-[-0.01em]">
              Liliana Cirigliano
            </span>
            </span>
          </Link>

          {/* Links — minimalistas, con línea inferior animada */}
          <nav aria-label="Navegación principal" className="flex items-center gap-5 lg:gap-9">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-2 text-[12px] font-medium transition-colors"
                  style={{
                    textDecoration: "none",
                    color: active ? "#F2B27A" : "rgba(255,255,255,0.62)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-[#C2540A] transition-all duration-300"
                    style={{ width: active ? "100%" : "0%" }}
                  />
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#F2B27A] transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            })}
          </nav>

          {/* CTA — lleva a la sección de consulta con scroll suave; efecto de relleno "wipe" al pasar el mouse */}
          <Link
            href="/#consulta"
            onClick={handleConsultaClick}
            className="group relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-[3px] bg-[#bd521d] px-5 py-3 text-[12px] font-semibold text-white"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(194,84,10,0.55)",
            }}
          >
            <span className="absolute inset-0 -translate-x-full bg-[#C2540A] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Hablar con Liliana</span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.3}
              className="relative z-10 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            />
          </Link>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede debajo de la barra fija */}
      <div className="hidden md:block h-[72px]" />

      <header className="flex md:hidden items-center justify-between gap-4 bg-[#1C0A00] px-5 py-5 text-[#F7F2EA] border-b border-white/15">
        <Link href="/" className="flex flex-col gap-1"><span className="text-[9px] uppercase tracking-[.2em] text-[#dba37b]">Inmobiliaria</span><span className="font-display text-[17px]">Liliana Cirigliano</span></Link>
        <Link href="/#consulta" onClick={handleConsultaClick} className="text-xs border-b border-[#dba37b] pb-1">Hablemos</Link>
      </header>

      {/* NAV MOBILE — tab bar inferior, sólida, sin blur */}
      <nav
        aria-label="Navegación móvil"
        className="flex md:hidden fixed bottom-0 inset-x-0 z-50 justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
        style={{
          background: "#1C0A00",
          borderTop: "1px solid rgba(242,178,122,0.14)",
        }}
      >
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center gap-1 py-2 px-3 flex-1"
              style={{ textDecoration: "none" }}
            >
              <span
                className="absolute top-0 h-px transition-all duration-300"
                style={{
                  width: active ? "28px" : "0px",
                  background: "#C2540A",
                }}
              />
              <Icon size={19} strokeWidth={1.8} color={active ? "#F2B27A" : "rgba(255,255,255,0.45)"} />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? "#F2B27A" : "rgba(255,255,255,0.45)" }}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
