"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const links = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/contacto", label: "Contacto" },
  ]

  return (
    <header style={{
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #FFE4CC",
      position: "sticky", top: 0, zIndex: 50
    }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" style={{textDecoration: "none", display: "flex", flexDirection: "column", lineHeight: 1}}>
          <span style={{fontSize: "10px", letterSpacing: "0.15em", color: "#C2540A", fontWeight: 700, textTransform: "uppercase"}}>Inmobiliaria</span>
          <span style={{fontSize: "17px", fontWeight: 700, color: "#1C0A00", letterSpacing: "-0.02em"}}>Liliana Cirigliano</span>
        </Link>
        <nav style={{display: "flex", gap: "32px", alignItems: "center"}}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{
              fontSize: "14px", fontWeight: 500, textDecoration: "none",
              color: pathname === link.href ? "#C2540A" : "#78350F",
              borderBottom: pathname === link.href ? "2px solid #C2540A" : "2px solid transparent",
              paddingBottom: "2px", transition: "color 0.2s"
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
