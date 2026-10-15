"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, MessageCircle, ArrowRight } from "lucide-react"
import BrandHouse from "@/components/BrandHouse"

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
      {/* Navbar de escritorio con vidrio oscuro sobre el hero */}
      <header
        className="hidden md:block fixed top-0 inset-x-0 z-50"
        style={{
          background: "linear-gradient(100deg, rgba(29, 26, 25, 0.76), rgba(49, 37, 32, 0.58) 52%, rgba(39, 31, 29, 0.7))",
          borderBottom: "1px solid rgba(247, 205, 164, 0.13)",
          backdropFilter: "blur(22px) saturate(130%)",
          WebkitBackdropFilter: "blur(22px) saturate(130%)",
          boxShadow: "0 6px 24px rgba(22, 12, 7, 0.1)",
        }}
      >
        <div className="mx-auto grid h-[78px] w-[90%] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 leading-none justify-self-start" style={{ textDecoration: "none" }}>
            <BrandHouse className="h-9 w-[48px] shrink-0 text-[#e79754]" />
            <span className="flex flex-col">
            <span className="text-[9px] tracking-[0.3em] text-[#e79754] font-medium uppercase">
              Inmobiliaria
            </span>
            <span className="font-display text-[22px] font-medium text-white/95 mt-1 tracking-[-0.02em]">
              Liliana Cirigliano
            </span>
            </span>
          </Link>

          {/* Links — minimalistas, con línea inferior animada */}
          <nav aria-label="Navegación principal" className="flex items-center justify-center gap-12">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-3 text-[13px] font-normal tracking-[0.01em] transition-colors"
                  style={{
                    textDecoration: "none",
                    color: active ? "#efa767" : "rgba(255,255,255,0.84)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px bg-[#e79754] transition-all duration-300"
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
            className="group inline-flex h-[46px] shrink-0 items-center justify-center gap-2.5 rounded-full bg-transparent px-[18px] text-[13px] font-normal tracking-[0.01em] text-[#efa15f] transition-colors hover:bg-[#e79754]/[0.08] justify-self-end"
            style={{
              textDecoration: "none",
              border: "1px solid rgba(231,151,84,0.62)",
            }}
          >
            <span className="inline-flex h-[18px] w-[18px] items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-[18px] w-[18px]">
                <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.1-4A8.2 8.2 0 1 1 20.2 11.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M8.2 7.8c.2-.4.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.6 1 1.4 1.8 2.5 2.4.2.1.4.1.6-.1l.8-.8c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.5 0 .6-.3 1.2-.7 1.6-.4.4-1 .5-1.6.5-1-.1-2.3-.7-3.5-1.9-1.2-1.2-1.8-2.5-1.9-3.5-.1-.6.1-1.2.5-1.7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>Hablar con Liliana</span>
            <ArrowRight
              size={15}
              strokeWidth={1.6}
              className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede debajo de la barra fija */}
      {pathname === "/" ? null : <div className="hidden md:block h-[78px]" />}

      <header className="flex md:hidden items-center justify-between gap-4 bg-[#1C0A00] px-5 py-5 text-[#F7F2EA] border-b border-white/15">
        <Link href="/" className="flex items-center gap-2.5"><BrandHouse /><span className="flex flex-col gap-1"><span className="text-[9px] uppercase tracking-[.2em] text-[#dba37b]">Inmobiliaria</span><span className="font-display text-[17px]">Liliana Cirigliano</span></span></Link>
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
