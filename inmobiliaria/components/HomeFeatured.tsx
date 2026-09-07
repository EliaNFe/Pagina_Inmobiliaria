"use client"

import { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MapPin, Scan } from "lucide-react"
import { formatearPrecio } from "@/lib/formatear-precio"
import s from "@/app/home.module.css"

type Property = { id: string; titulo: string; tipo: string; operacion?: string; precio: number; moneda?: string; ubicacion?: string; superficie?: number; imagen_url?: string }
const favoriteKey = "inmobiliaria-favoritas"
function snapshot() { try { return localStorage.getItem(favoriteKey) || "[]" } catch { return "[]" } }
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("favoritas-change", callback)
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("favoritas-change", callback) }
}

export default function HomeFeatured({ propiedades, destacadas }: { propiedades: Property[]; destacadas: boolean }) {
  const [start, setStart] = useState(0)
  const saved = useSyncExternalStore(subscribe, snapshot, () => "[]")
  const [temporary, setTemporary] = useState<string[] | null>(null)
  let favorites: string[] = []
  try { const parsed: unknown = JSON.parse(saved); if (Array.isArray(parsed)) favorites = parsed.filter((id): id is string => typeof id === "string") } catch {}
  favorites = temporary || favorites
  const toggle = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(value => value !== id) : [...favorites, id]
    try { localStorage.setItem(favoriteKey, JSON.stringify(next)); window.dispatchEvent(new Event("favoritas-change")); setTemporary(null) } catch { setTemporary(next) }
  }

  return (
    <>
      <div className={s.sectionHeading}>
        <div><p className={s.eyebrow}>{destacadas ? "Propiedades destacadas" : "Nuestro catálogo"}</p><h2 id="featured-title">Oportunidades<br /><span>para vos</span></h2></div>
        <p className={s.featuredDescription}>Propiedades en Necochea y alrededores. Viví, invertí o encontrá tu lugar en la costa.</p>
        {propiedades.length > 3 && <div className={s.sliderControls}>
          <button type="button" aria-label="Ver propiedades anteriores" aria-controls="home-properties" disabled={start === 0} onClick={() => setStart(Math.max(0, start - 3))}><ChevronLeft size={19} /></button>
          <button type="button" aria-label="Ver más propiedades" aria-controls="home-properties" disabled={start + 3 >= propiedades.length} onClick={() => setStart(start + 3)}><ChevronRight size={19} /></button>
        </div>}
      </div>
      {propiedades.length ? <div id="home-properties" className={s.properties} aria-live="polite">
        {propiedades.slice(start, start + 3).map(p => (
          <article key={p.id} className={s.property}>
            <div className={s.propertyImage}>
              {p.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagen_url} alt={p.titulo} loading="lazy" decoding="async" />
              ) : (
                <div className={s.propertyNoImage}>Sin imagen</div>
              )}
            </div>
            <div className={s.propertyTop}><span className={s.operation}>{p.operacion || "Venta"}</span><button className={s.favorite} aria-label={`${favorites.includes(p.id) ? "Quitar de" : "Guardar en"} favoritas: ${p.titulo}`} aria-pressed={favorites.includes(p.id)} onClick={() => toggle(p.id)}><Heart size={22} strokeWidth={1.5} fill={favorites.includes(p.id) ? "currentColor" : "none"} /></button></div>
            <Link href={`/propiedades/${p.id}`} className={s.propertyBody}>
              <h3>{p.titulo}</h3>
              <p className={s.propertyLocation}><MapPin size={13} />{p.ubicacion || "Necochea, Buenos Aires"}</p>
              <div className={s.propertyFacts}><span>{p.tipo}</span>{(p.superficie ?? 0) > 0 && <span><Scan size={15} />{p.superficie?.toLocaleString("es-AR")} m²</span>}</div>
              <div className={s.propertyBottom}><span className={s.propertyLink}>Ver propiedad <ArrowRight size={15} /></span><span>{p.precio ? formatearPrecio(p.precio, p.moneda) : "Consultar precio"}</span></div>
            </Link>
          </article>
        ))}
      </div> : <p className={s.empty}>Estamos actualizando las propiedades disponibles. <a href="#consulta">Contanos qué estás buscando.</a></p>}
    </>
  )
}