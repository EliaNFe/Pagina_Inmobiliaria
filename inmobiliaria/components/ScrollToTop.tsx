"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    // Los enlaces con ancla deben conservar su destino dentro de la página.
    if (window.location.hash) return

    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname, searchParams])

  return null
}
