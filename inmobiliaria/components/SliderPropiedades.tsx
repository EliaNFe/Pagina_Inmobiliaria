"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"

type Propiedad = {
  id: string
  titulo: string
  tipo: string
  precio: number
  superficie: number
  ubicacion: string
  imagen_url: string
}

export default function SliderPropiedades({ propiedades }: { propiedades: Propiedad[] }) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const CARD_WIDTH = 340
  const GAP = 24
  const INTERVALO = 3500

  const siguiente = useCallback(() => {
    setActual(prev => (prev + 1) % propiedades.length)
  }, [propiedades.length])

  const anterior = useCallback(() => {
    setActual(prev => (prev - 1 + propiedades.length) % propiedades.length)
  }, [propiedades.length])

  useEffect(() => {
    if (pausado) return
    const timer = setInterval(siguiente, INTERVALO)
    return () => clearInterval(timer)
  }, [pausado, siguiente])

  useEffect(() => {
    if (!trackRef.current) return
    const offset = actual * (CARD_WIDTH + GAP)
    trackRef.current.style.transform = `translateX(-${offset}px)`
  }, [actual])

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Flechas — solo desktop */}
      {propiedades.length > 1 && (
        <>
          <button
            onClick={anterior}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-20 w-11 h-11 bg-white/50 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_8px_24px_rgba(194,84,10,0.12)] items-center justify-center hover:bg-white/70 transition-colors"
            aria-label="Anterior"
          >
            <svg width="18" height="18" fill="none" stroke="#C2540A" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={siguiente}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-20 w-11 h-11 bg-white/50 backdrop-blur-xl border border-white/60 rounded-full shadow-[0_8px_24px_rgba(194,84,10,0.12)] items-center justify-center hover:bg-white/70 transition-colors"
            aria-label="Siguiente"
          >
            <svg width="18" height="18" fill="none" stroke="#C2540A" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Track — scroll en mobile, animado en desktop */}
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="hidden md:flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ willChange: "transform" }}
        >
          {propiedades.map((propiedad) => (
            <CardPropiedad key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>

        {/* Mobile: scroll nativo */}
        <div className="flex md:hidden gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {propiedades.map((propiedad) => (
            <div key={propiedad.id} className="w-[280px] shrink-0 snap-center">
              <CardPropiedad propiedad={propiedad} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {propiedades.length > 1 && (
        <div className="hidden md:flex justify-center gap-2 mt-8">
          {propiedades.map((_, i) => (
            <button
              key={i}
              onClick={() => setActual(i)}
              className="transition-all duration-300"
              style={{
                width: i === actual ? "28px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === actual ? "#C2540A" : "#FFE4CC",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label={`Ir a propiedad ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CardPropiedad({ propiedad }: { propiedad: Propiedad }) {
  return (
    <Link
      href={`/propiedades/${propiedad.id}`}
      className="group block w-[340px] shrink-0"
      style={{ textDecoration: "none" }}
    >
      <div
        className="bg-white/40 backdrop-blur-xl rounded-[24px] overflow-hidden border border-white/60 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:bg-white/55"
        style={{ boxShadow: "0 8px 32px rgba(194,84,10,0.10)" }}
      >
        <div className="relative overflow-hidden bg-orange-50/60" style={{ aspectRatio: "4/3" }}>
          {propiedad.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={propiedad.imagen_url}
              alt={propiedad.titulo}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-orange-300 text-sm">Sin imagen</span>
            </div>
          )}
          <span className="absolute top-4 left-4 bg-white/60 backdrop-blur-md border border-white/50 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
            {propiedad.tipo}
          </span>
        </div>

        <div className="p-6 flex flex-col grow">
          <h3
            className="font-bold text-stone-900 text-lg mb-2 leading-tight line-clamp-1 transition-colors group-hover:text-orange-700"
          >
            {propiedad.titulo}
          </h3>
          <div className="flex items-center gap-1.5 text-stone-500 text-sm mb-5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{propiedad.ubicacion}</span>
          </div>
          <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/60">
            <p className="text-2xl font-extrabold text-orange-700">${propiedad.precio?.toLocaleString()}</p>
            <p className="text-xs font-semibold text-amber-700">{propiedad.superficie} m²</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
