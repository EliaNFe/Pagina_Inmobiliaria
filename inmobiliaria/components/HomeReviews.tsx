"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react"
import type { Resena } from "@/lib/resenas"
import s from "@/app/home.module.css"

const POR_PAGINA = 3

function Estrellas({ n }: { n: number }) {
  return (
    <span className={s.stars} role="img" aria-label={`${n.toLocaleString("es-AR")} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(i => {
        if (i <= n) return <Star key={i} size={16} strokeWidth={1.5} className={s.starOn} aria-hidden="true" />
        if (i - 0.5 <= n) return (
          <span key={i} style={{ position: "relative", display: "inline-flex" }} aria-hidden="true">
            <Star size={16} strokeWidth={1.5} className={s.starOff} />
            <span style={{ position: "absolute", inset: 0, width: "50%", overflow: "hidden" }}><Star size={16} strokeWidth={1.5} className={s.starOn} /></span>
          </span>
        )
        return <Star key={i} size={16} strokeWidth={1.5} className={s.starOff} aria-hidden="true" />
      })}
    </span>
  )
}

export default function HomeReviews({ resenas, promedio, total, urlEscribir, urlVer }: { resenas: Resena[]; promedio: number; total?: number; urlEscribir: string; urlVer: string }) {
  const [pagina, setPagina] = useState(0)
  const paginas = Math.max(1, Math.ceil(resenas.length / POR_PAGINA))
  const visibles = resenas.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA)

  return (
    <div className={s.reviewsWrap}>
      <div className={s.reviewsHead}>
        <div>
          <h2 id="reviews-title">Lo que dicen<br /><span>quienes nos eligieron.</span></h2>
          <p className={s.reviewsSummary}>
            <strong>{promedio.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong>
            <Estrellas n={promedio} />
            <span>{total ? `${total.toLocaleString("es-AR")} reseñas en Google Maps` : "en Google Maps"}</span>
          </p>
        </div>
        {paginas > 1 && (
          <div className={s.sliderControls}>
            <button type="button" aria-label="Ver reseñas anteriores" aria-controls="home-reviews" disabled={pagina === 0} onClick={() => setPagina(p => Math.max(0, p - 1))}><ChevronLeft size={19} /></button>
            <button type="button" aria-label="Ver más reseñas" aria-controls="home-reviews" disabled={pagina >= paginas - 1} onClick={() => setPagina(p => Math.min(paginas - 1, p + 1))}><ChevronRight size={19} /></button>
          </div>
        )}
      </div>

      <div id="home-reviews" key={pagina} className={s.reviews} aria-live="polite">
        {visibles.map(r => (
          <figure key={r.id} className={s.review}>
            <Estrellas n={r.estrellas} />
            <blockquote>{r.texto}</blockquote>
            <figcaption><strong>{r.autor}</strong>{r.fecha && <span>{r.fecha}</span>}</figcaption>
          </figure>
        ))}
      </div>

      <div className={s.reviewsFoot}>
        {paginas > 1 && (
          <div className={s.dots} aria-hidden="true">
            {Array.from({ length: paginas }, (_, i) => <span key={i} className={i === pagina ? s.dotOn : undefined} />)}
          </div>
        )}
        <div className={s.reviewsActions}>
          <a href={urlEscribir} target="_blank" rel="noopener noreferrer" className={s.button}>Dejá tu reseña en Google <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (se abre en una pestaña nueva)</span></a>
          <a href={urlVer} target="_blank" rel="noopener noreferrer" className={s.reviewsLink}>Ver todas las reseñas<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
        </div>
      </div>
    </div>
  )
}
