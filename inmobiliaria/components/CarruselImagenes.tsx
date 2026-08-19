"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export default function CarruselImagenes({ imagenes, titulo }: { imagenes: string[]; titulo: string }) {
  const [actual, setActual] = useState(0)
  const [lightboxAbierto, setLightboxAbierto] = useState(false)

  const mainTrackRef = useRef<HTMLDivElement>(null)
  const mainItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lightboxTrackRef = useRef<HTMLDivElement>(null)
  const lightboxItemRefs = useRef<(HTMLDivElement | null)[]>([])

  const irA = useCallback((i: number, smooth = true) => {
    mainItemRefs.current[i]?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" })
    setActual(i)
  }, [])

  const anterior = useCallback(() => irA((actual - 1 + imagenes.length) % imagenes.length), [actual, irA, imagenes.length])
  const siguiente = useCallback(() => irA((actual + 1) % imagenes.length), [actual, irA, imagenes.length])

  // Detecta la foto centrada mientras el usuario desliza a mano (swipe nativo)
  useEffect(() => {
    const track = mainTrackRef.current
    if (!track) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActual(Number((entry.target as HTMLElement).dataset.index))
          }
        })
      },
      { root: track, threshold: [0.6] }
    )
    mainItemRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [imagenes.length])

  // Mantiene la miniatura activa visible dentro de su tira
  useEffect(() => {
    thumbRefs.current[actual]?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" })
  }, [actual])

  // Lightbox: bloquea el scroll del body, sincroniza posición y cierra con Escape
  useEffect(() => {
    if (!lightboxAbierto) return
    document.body.style.overflow = "hidden"
    lightboxItemRefs.current[actual]?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxAbierto(false)
      if (e.key === "ArrowRight") lightboxItemRefs.current[(actual + 1) % imagenes.length]?.scrollIntoView({ behavior: "smooth", inline: "center" })
      if (e.key === "ArrowLeft") lightboxItemRefs.current[(actual - 1 + imagenes.length) % imagenes.length]?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [lightboxAbierto, actual, imagenes.length])

  useEffect(() => {
    if (!lightboxAbierto) return
    const track = lightboxTrackRef.current
    if (!track) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActual(Number((entry.target as HTMLElement).dataset.index))
          }
        })
      },
      { root: track, threshold: [0.6] }
    )
    lightboxItemRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [lightboxAbierto, imagenes.length])

  const onKeyDownViewer = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); siguiente() }
    if (e.key === "ArrowLeft") { e.preventDefault(); anterior() }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxAbierto(true) }
  }

  if (imagenes.length === 0) {
    return (
      <div style={{
        background: "#F5F0EA", borderRadius: "6px", height: "420px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid #F0E4D8"
      }}>
        <span style={{ color: "#A8A29E", fontSize: "14px" }}>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div className="carrusel-imagenes">
      <style jsx>{`
        .carrusel-imagenes {
          min-width: 0;
          width: 100%;
        }
        .viewer {
          position: relative;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #F0E4D8;
          background: #F5F0EA;
          aspect-ratio: 1 / 1;
        }
        @media (min-width: 640px) {
          .viewer { aspect-ratio: 4 / 3; }
        }
        @media (min-width: 768px) {
          .viewer { aspect-ratio: 16 / 9; }
        }
        .hint-ampliar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(28,10,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 5;
        }
        @media (min-width: 640px) {
          .hint-ampliar { display: none; }
        }
        .track {
          display: flex;
          height: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .track::-webkit-scrollbar { display: none; }
        .slide {
          flex: 0 0 100%;
          scroll-snap-align: center;
          height: 100%;
        }
        .arrow {
          display: none;
        }
        @media (min-width: 640px) {
          .arrow { display: flex; }
        }
        .lightbox-track {
          display: flex;
          height: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .lightbox-track::-webkit-scrollbar { display: none; }
        .lightbox-slide {
          flex: 0 0 100%;
          scroll-snap-align: center;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <p className="sr-only" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        Foto {actual + 1} de {imagenes.length}
      </p>

      <div
        className="viewer"
        tabIndex={0}
        onKeyDown={onKeyDownViewer}
        role="group"
        aria-roledescription="carrusel de fotos"
        aria-label={titulo}
      >
        {/* Barra de progreso tipo stories */}
        {imagenes.length > 1 && (
          <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", gap: "4px", zIndex: 10 }}>
            {imagenes.map((_, i) => (
              <button
                key={i}
                onClick={() => irA(i)}
                style={{
                  flex: 1, height: "2.5px", border: "none", cursor: "pointer",
                  background: i === actual ? "#C2540A" : "rgba(255,255,255,0.5)",
                  transition: "background 0.2s", padding: 0,
                }}
                aria-label={`Ir a foto ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div ref={mainTrackRef} className="track">
          {imagenes.map((img, i) => (
            <div key={i} className="slide" data-index={i} ref={el => { mainItemRefs.current[i] = el }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${titulo} — foto ${i + 1} de ${imagenes.length}`}
                onClick={() => setLightboxAbierto(true)}
                style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "zoom-in" }}
              />
            </div>
          ))}
        </div>

  

        {imagenes.length > 1 && (
          <>
            <button
              onClick={anterior}
              className="arrow"
              style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(28,10,0,0.55)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px", width: "38px", height: "38px", cursor: "pointer",
                fontSize: "18px", alignItems: "center", justifyContent: "center", zIndex: 10,
              }}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              onClick={siguiente}
              className="arrow"
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(28,10,0,0.55)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "4px", width: "38px", height: "38px", cursor: "pointer",
                fontSize: "18px", alignItems: "center", justifyContent: "center", zIndex: 10,
              }}
              aria-label="Foto siguiente"
            >
              ›
            </button>
          </>
        )}

        {/* Contador tipográfico */}
        <div style={{
          position: "absolute", bottom: "14px", left: "14px",
          background: "#1C0A00", color: "#fff",
          fontSize: "13px", fontWeight: 700, padding: "6px 12px", borderRadius: "4px",
          letterSpacing: "0.02em", zIndex: 10,
        }}>
          {String(actual + 1).padStart(2, "0")} / {String(imagenes.length).padStart(2, "0")}
        </div>

        {/* Expandir a pantalla completa */}
        <button
          onClick={() => setLightboxAbierto(true)}
          style={{
            position: "absolute", bottom: "14px", right: "14px",
            background: "#1C0A00", color: "#fff", border: "none",
            fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "4px",
            cursor: "pointer", zIndex: 10, display: "flex", alignItems: "center", gap: "6px",
          }}
          aria-label="Ver todas las fotos en pantalla completa"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
          </svg>
          Ampliar
        </button>
      </div>

      {imagenes.length > 1 && (
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", overflowX: "auto", width: "100%" }}>
          {imagenes.map((img, i) => (
            <button
              key={i}
              ref={el => { thumbRefs.current[i] = el }}
              onClick={() => irA(i)}
              style={{
                cursor: "pointer", padding: 0, background: "none", border: "none",
                flexShrink: 0, width: "68px",
              }}
              aria-label={`Ir a foto ${i + 1}`}
              aria-current={i === actual}
            >
              <div style={{
                width: "68px", height: "68px", borderRadius: "4px", overflow: "hidden",
                opacity: i === actual ? 1 : 0.5, transition: "opacity 0.2s",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{
                height: "2px", marginTop: "6px",
                background: i === actual ? "#C2540A" : "transparent",
              }} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox de pantalla completa */}
      {lightboxAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de fotos — ${titulo}`}
          onClick={e => { if (e.target === e.currentTarget) setLightboxAbierto(false) }}
          style={{
            position: "fixed", inset: 0, background: "rgba(15,8,3,0.96)",
            zIndex: 1000, display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: "0.02em" }}>
              {String(actual + 1).padStart(2, "0")} / {String(imagenes.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => setLightboxAbierto(false)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none", color: "#fff",
                width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer",
                fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label="Cerrar galería"
            >
              ✕
            </button>
          </div>

          <div ref={lightboxTrackRef} className="lightbox-track" style={{ flex: 1 }}>
            {imagenes.map((img, i) => (
              <div key={i} className="lightbox-slide" data-index={i} ref={el => { lightboxItemRefs.current[i] = el }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${titulo} — foto ${i + 1} de ${imagenes.length}`}
                  style={{ maxWidth: "94vw", maxHeight: "78vh", objectFit: "contain" }}
                />
              </div>
            ))}
          </div>

          {imagenes.length > 1 && (
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "16px 20px 20px", justifyContent: "center" }}>
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => lightboxItemRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center" })}
                  style={{
                    flexShrink: 0, width: "52px", height: "52px", borderRadius: "4px", overflow: "hidden",
                    padding: 0, cursor: "pointer",
                    border: i === actual ? "2px solid #C2540A" : "2px solid transparent",
                    opacity: i === actual ? 1 : 0.5,
                  }}
                  aria-label={`Ir a foto ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}