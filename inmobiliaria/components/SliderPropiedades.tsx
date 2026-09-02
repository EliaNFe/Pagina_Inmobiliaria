"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { formatearPrecio } from "@/lib/formatear-precio"

type Propiedad = {
  id: string
  titulo: string
  tipo: string
  operacion?: string
  moneda?: string
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
      <style jsx>{`
        .stage-slider {
          --clay: #c2540a;
          --ink: #1b130d;
          --sand: #e9ddc8;
          --gold-mist: #f2b27a;
          font-family: var(--font-body), sans-serif;
        }
        .display { font-family: var(--font-display), Georgia, serif; }

        .feature-layout {
          display: grid;
          gap: 30px;
        }
        @media (min-width: 900px) {
          .feature-layout {
            grid-template-columns: minmax(0, 1.72fr) minmax(260px, .58fr);
            align-items: stretch;
            gap: clamp(32px, 5vw, 68px);
          }
        }

        .visual-stage {
          position: relative;
          isolation: isolate;
        }
        .visual-stage::before {
          content: "";
          position: absolute;
          z-index: 5;
          inset: 10px;
          border: 1px solid rgba(255,255,255,.22);
          pointer-events: none;
        }

        .stage {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 11;
          background: var(--ink);
          box-shadow: 0 24px 65px rgba(8,2,0,0.26);
        }
        @media (min-width: 640px) {
          .stage { aspect-ratio: 16 / 9; }
        }
        @media (min-width: 1024px) {
          .stage { aspect-ratio: 16 / 9; }
        }

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
          filter: saturate(.92) contrast(1.02);
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
          background: linear-gradient(180deg, rgba(27,19,13,0.2), transparent 25%, transparent 70%, rgba(27,19,13,0.16));
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

        .details {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
          padding: 4px 0;
        }
        .details-rule {
          width: 42px;
          height: 1px;
          margin: 22px 0;
          background: rgba(242,178,122,.55);
        }

        .flecha {
          opacity: 0;
          transition: opacity 200ms ease, background 200ms ease;
        }
        .stage:hover .flecha, .flecha:focus-visible { opacity: 1; }

        .film-track {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding: 20px 2px 4px;
          border-bottom: 1px solid rgba(255,255,255,.12);
        }
        .film-track::-webkit-scrollbar { display: none; }
        .thumb {
          flex: 0 0 auto;
          width: 48px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,.35);
          text-align: left;
          transition: color 250ms ease;
        }
        .thumb[data-activo="true"] { color: var(--gold-mist); }
        .thumb-img {
          display: none;
        }
        .thumb-number { font-family: var(--font-display), Georgia, serif; font-size: 13px; }
        .thumb-bar {
          position: relative;
          height: 2.5px;
          margin-top: 8px;
          background: rgba(255,255,255,.14);
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

      <div className="feature-layout">
        <div>
        <div className="visual-stage">
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
            style={{ position: "absolute", bottom: 20, left: 24, color: "rgba(255,255,255,0.72)", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            {String(actual + 1).padStart(2, "0")} — {String(propiedades.length).padStart(2, "0")}
          </span>

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
                <span className="thumb-number">{String(i + 1).padStart(2, "0")}</span>
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
        </div>

        <aside key={actual} className="details" aria-label="Información de la propiedad seleccionada">
          <div className="texto" style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--gold-mist)", fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" }}>
            <span>{propiedad.tipo}</span>
            <span style={{ width: 18, height: 1, background: "rgba(242,178,122,.5)" }} />
            <span>{operacionLabel}</span>
          </div>

          <h3 className="display texto" style={{ color: "#fff", fontSize: "clamp(27px, 3vw, 39px)", fontWeight: 600, lineHeight: 1.08, letterSpacing: "-.025em", margin: "18px 0 0" }}>
            {propiedad.titulo}
          </h3>

          <div className="details-rule texto" />

          <div className="texto" style={{ display: "flex", alignItems: "flex-start", gap: 9, color: "rgba(255,255,255,.58)", fontSize: 13, lineHeight: 1.55 }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flex: "none", marginTop: 2 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{propiedad.ubicacion}</span>
          </div>

          <div className="texto" style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
            <span className="display" style={{ color: "#fff", fontSize: "clamp(23px, 2.4vw, 30px)", fontWeight: 600 }}>
              {formatearPrecio(propiedad.precio, propiedad.moneda)}
            </span>
            <span style={{ color: "rgba(255,255,255,.42)", fontSize: 10, fontWeight: 650, letterSpacing: ".1em", textTransform: "uppercase" }}>
              {propiedad.superficie} m²
            </span>
          </div>

          <Link
            href={`/propiedades/${propiedad.id}`}
            className="texto group"
            style={{ alignItems: "center", alignSelf: "flex-start", borderBottom: "1px solid rgba(242,178,122,.55)", color: "var(--gold-mist)", display: "inline-flex", fontSize: 12, fontWeight: 650, gap: 8, marginTop: 34, paddingBottom: 7, textDecoration: "none" }}
          >
            Ver propiedad
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="transition-transform group-hover:translate-x-1">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </aside>
      </div>
    </section>
  )
}
