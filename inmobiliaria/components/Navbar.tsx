"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Building2, Users, MessageCircle } from "lucide-react"

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

  return (
    <>
      {/* NAV DESKTOP — logo, menú y CTA como tres piezas independientes */}
      <header className="hidden md:block fixed top-5 inset-x-0 z-50 px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo — separado, a la izquierda */}
          <Link
            href="/"
            className="glass rounded-2xl px-5 py-2.5 flex flex-col leading-none shadow-lg shadow-black/5 pointer-events-auto"
            style={{ textDecoration: "none" }}
          >
            <span className="text-[10px] tracking-[0.15em] text-orange-700/70 font-semibold uppercase">
              Inmobiliaria
            </span>
            <span className="font-display text-[15px] font-bold text-stone-900">
              Liliana Cirigliano
            </span>
          </Link>

          {/* Pill de navegación — centrado, libre del logo y del CTA */}
          <nav className="glass rounded-2xl px-2 py-2 flex items-center gap-1 shadow-lg shadow-black/5 pointer-events-auto">
            {links.map((link) => {
              const Icon = link.icon
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    textDecoration: "none",
                    background: active ? "#C2540A" : "transparent",
                    color: active ? "#fff" : "#57534E",
                  }}
                >
                  <Icon size={16} strokeWidth={2} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* NAV MOBILE — tab bar flotante inferior */}
      <nav
        className="flex md:hidden fixed bottom-5 inset-x-4 z-50 rounded-[24px] px-2 py-2 shadow-2xl shadow-black/10 justify-between"
        style={{
          background: "rgba(255, 255, 255, 0)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      >
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl flex-1 transition-all"
              style={{
                textDecoration: "none",
                background: active ? "rgba(194,84,10,0.1)" : "transparent",
              }}
            >
              <Icon size={20} strokeWidth={2} color={active ? "#C2540A" : "#A8A29E"} />
              <span
                className="text-[10px] font-semibold"
                style={{ color: active ? "#C2540A" : "#A8A29E" }}
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
