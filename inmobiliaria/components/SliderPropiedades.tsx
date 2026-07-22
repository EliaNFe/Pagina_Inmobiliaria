"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"

type Propiedad = {
  id: string
  titulo: string
  tipo: string
  operacion?: string
  precio: number
  superficie: number
  ubicacion: string
  imagen_url: string
}

const INTERVALO = 5500

const LABEL_OPERACION: Record<string, string> = {
  "Venta": "En venta",
  "Alquiler": "En alquiler",
  "Alquiler temporada": "Alquiler temporada",
}

export default function SliderPropiedades({ propiedades }: { propiedades: Propiedad[] }) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  // Valor inicial calculado en el initializer (no dentro de un efecto) para
  // evitar el warning de React por setState síncrono al montar.
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  )

  const filmRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const drag = useRef({ activo: false, startX: 0, dx: 0 })
  const touchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [dragX, setDragX] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const irA = useCallback((i: number) => {
    setActual(((i % propiedades.length) + propiedades.length) % propiedades.length)
  }, [propiedades.length])

  const siguiente = useCallback(() => irA(actual + 1), [actual, irA])
  const anterior = useCallback(() => irA(actual - 1), [actual, irA])

  // Mantiene la miniatura activa visible dentro de su propia tira,
  // sin usar scrollIntoView (eso arrastraría también el scroll de la página).
  useEffect(() => {
    const film = filmRef.current
    const thumb = thumbRefs.current[actual]
    if (!film || !thumb) return
    const destino = thumb.offsetLeft - (film.clientWidth - thumb.clientWidth) / 2
    film.scrollTo({ left: destino, behavior: reducedMotion ? "auto" : "smooth" })
  }, [actual, reducedMotion])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); siguiente() }
    if (e.key === "ArrowLeft") { e.preventDefault(); anterior() }
  }

  // Swipe / arrastre — vive solo en la capa de imágenes, separada del
  // texto y los links, así nunca compite con la navegación por click.
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { activo: true, startX: e.clientX, dx: 0 }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.activo) return
    drag.current.dx = e.clientX - drag.current.startX
    setDragX(drag.current.dx)
  }
  const onPointerUp = () => {
    if (!drag.current.activo) return
    const dx = drag.current.dx
    drag.current.activo = false
    setDragX(0)
    if (dx < -60) siguiente()
    else if (dx > 60) anterior()
  }

  const onTouchStart = () => {
    if (touchTimeout.current) clearTimeout(touchTimeout.current)
    setPausado(true)
  }
  const onTouchEnd = () => {
    touchTimeout.current = setTimeout(() => setPausado(false), 2600)
  }

  if (propiedades.length === 0) return null
  const propiedad = propiedades[actual]
  // Las propiedades viejas sin "operacion" cargada se consideran "Venta"
  // (mismo criterio de fallback que se usa en el resto del sitio).
  const operacionLabel = LABEL_OPERACION[propiedad.operacion || "Venta"] || propiedad.operacion

  return (
    <section
      className="stage-slider"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Propiedades destacadas"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <style jsx>{`
        .stage-slider {
          --clay: #c2540a;
          --ink: #1b130d;
          --sand: #e9ddc8;
          --gold-mist: #f2b27a;
          font-family: "Inter", sans-serif;
        }
        .display { font-family: "Fraunces", serif; font-optical-sizing: auto; }

        .stage {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          aspect-ratio: 4 / 5;
          background: var(--ink);
          box-shadow: 0 20px 50px rgba(27,19,13,0.22);
        }
        @media (min-width: 640px) { .stage { aspect-ratio: 16 / 9; } }
        @media (min-width: 1024px) { .stage { aspect-ratio: 21 / 9; } }

        .capa-imgs {
          position: absolute;
          inset: 0;
          cursor: grab;
          touch-action: pan-y;
        }
        .capa-imgs:active { cursor: grabbing; }

        .layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 900ms ease;
        }
        .layer[data-activo="true"] { opacity: 1; z-index: 2; }

        .layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.09);
        }
        .layer[data-activo="true"] img {
          animation: kenburns 7s ease-out forwards;
        }
        @keyframes kenburns {
          from { transform: scale(1.09); }
          to { transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .layer[data-activo="true"] img { animation: none; transform: scale(1); }
        }

        .scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(27,19,13,0) 22%, rgba(27,19,13,0.55) 55%, rgba(27,19,13,0.94) 100%);
        }

        .overlay { position: absolute; inset: 0; pointer-events: none; z-index: 10; }
        .overlay :global(a), .overlay button { pointer-events: auto; }

        .texto { animation: subeYAparece 600ms cubic-bezier(0.22,1,0.36,1) both; }
        .texto:nth-child(2) { animation-delay: 60ms; }
        .texto:nth-child(3) { animation-delay: 120ms; }
        .texto:nth-child(4) { animation-delay: 180ms; }
        @keyframes subeYAparece {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .texto { animation: none; }
        }

        .flecha {
          opacity: 0;
          transition: opacity 200ms ease, background 200ms ease;
        }
        .stage:hover .flecha, .flecha:focus-visible { opacity: 1; }

        .film-track {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding: 2px 2px 4px;
        }
        .film-track::-webkit-scrollbar { display: none; }
        .thumb {
          flex: 0 0 auto;
          width: 72px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        .thumb-img {
          width: 72px;
          height: 56px;
          border-radius: 8px;
          overflow: hidden;
          opacity: 0.5;
          transition: opacity 250ms ease;
        }
        .thumb[data-activo="true"] .thumb-img { opacity: 1; }
        .thumb-bar {
          position: relative;
          height: 2.5px;
          margin-top: 6px;
          border-radius: 2px;
          background: var(--sand);
          overflow: hidden;
        }
        .thumb-fill {
          position: absolute;
          inset: 0;
          transform-origin: left;
          transform: scaleX(0);
          background: var(--clay);
          animation: llenar var(--dur) linear forwards;
        }
        @keyframes llenar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      <p className="sr-only" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Propiedad {actual + 1} de {propiedades.length}: {propiedad.titulo}
      </p>

      <div className="stage">
        <div
          className="capa-imgs"
          tabIndex={0}
          role="group"
          aria-label="Imagen de la propiedad, deslizar para cambiar"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ transform: dragX ? `translateX(${dragX * 0.5}px)` : undefined }}
        >
          {propiedades.map((p, i) => {
            const activo = i === actual
            return (
              <div className="layer" data-activo={activo} key={p.id}>
                {p.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={`${p.id}-${activo}`} src={p.imagen_url} alt="" draggable={false} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#3a2c1f" }} />
                )}
              </div>
            )
          })}
          <div className="scrim" />
        </div>

        <div className="overlay">
          {/* Índice — orden real dentro del carrusel */}
          <span
            className="display"
            style={{ position: "absolute", top: 20, right: 24, color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            {String(actual + 1).padStart(2, "0")} — {String(propiedades.length).padStart(2, "0")}
          </span>

          {/* Chips — tipo (relleno) + operación (contorno, para diferenciarlo) */}
          <div style={{ position: "absolute", top: 20, left: 24, display: "flex", gap: 8, flexWrap: "wrap", maxWidth: "70%" }}>
            <span
              style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", padding: "7px 14px", borderRadius: 999, background: "rgba(255,251,246,0.9)", color: "var(--ink)" }}
            >
              {propiedad.tipo}
            </span>
            <span
              style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", padding: "7px 14px", borderRadius: 999, background: "rgba(27,19,13,0.75)", border: "1px solid rgba(242,178,122,0.5)", color: "var(--gold-mist)" }}
            >
              {operacionLabel}
            </span>
          </div>

          {propiedades.length > 1 && (
            <>
              <button
                onClick={anterior}
                className="flecha"
                aria-label="Propiedad anterior"
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)", background: "rgba(27,19,13,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={siguiente}
                className="flecha"
                aria-label="Propiedad siguiente"
                style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.4)", background: "rgba(27,19,13,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {/* Bloque de texto — se remonta con key={actual} para relanzar el reveal escalonado */}
          <div key={actual} style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            <h3 className="display texto" style={{ color: "#fff", fontSize: "clamp(22px, 3.4vw, 34px)", fontWeight: 600, lineHeight: 1.1, margin: 0, maxWidth: 560, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
              {propiedad.titulo}
            </h3>

            <div className="texto" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.78)", fontSize: 13, textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{propiedad.ubicacion}</span>
            </div>

            <div className="texto" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, paddingTop: 10, marginTop: 4, borderTop: "1px solid rgba(255,255,255,0.22)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <span className="display" style={{ color: "var(--gold-mist)", fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 600, textShadow: "0 2px 10px rgba(0,0,0,0.55)" }}>
                  ${propiedad.precio?.toLocaleString()}
                </span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  {propiedad.superficie} m²
                </span>
              </div>

              <Link
                href={`/propiedades/${propiedad.id}`}
                className="group"
                style={{ color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
              >
                Ver propiedad
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filmstrip — navegación + progreso del autoplay integrado en la miniatura activa */}
      {propiedades.length > 1 && (
        <div ref={filmRef} className="film-track" style={{ marginTop: 14 }}>
          {propiedades.map((p, i) => {
            const activo = i === actual
            return (
              <button
                key={p.id}
                ref={el => { thumbRefs.current[i] = el }}
                className="thumb"
                data-activo={activo}
                onClick={() => irA(i)}
                aria-label={`Ir a propiedad ${i + 1}: ${p.titulo}`}
                aria-current={activo}
              >
                <div className="thumb-img">
                  {p.imagen_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagen_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#F2E9DC" }} />
                  )}
                </div>
                <div className="thumb-bar">
                  {activo && !reducedMotion && (
                    <span
                      key={`fill-${actual}`}
                      className="thumb-fill"
                      style={{ ["--dur" as string]: `${INTERVALO}ms`, animationPlayState: pausado ? "paused" : "running" }}
                      onAnimationEnd={siguiente}
                    />
                  )}
                  {activo && reducedMotion && (
                    <span className="thumb-fill" style={{ transform: "scaleX(1)" }} />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
