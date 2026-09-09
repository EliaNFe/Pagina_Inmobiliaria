"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import s from "./AsuntoSelect.module.css"

const opciones = ["", "Comprar una propiedad", "Alquilar una propiedad", "Vender mi propiedad", "Una tasación", "Otra consulta"]

export default function AsuntoSelect({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const search = useRef({ text: "", time: 0 })

  useEffect(() => {
    if (!open) return
    options.current[Math.max(0, opciones.indexOf(value))]?.focus()
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [open, value])

  return <div ref={root} className={s.root} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }} onKeyDown={(event) => {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); trigger.current?.focus() }
  }}>
    <button ref={trigger} id={id} type="button" className={s.trigger} aria-label={`¿Qué estás buscando?: ${value || "Sin seleccionar"}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? `${id}-opciones` : undefined} onClick={() => setOpen(!open)} onKeyDown={(event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true) }
    }}><span>{value || "¿Qué estás buscando?"}</span><ChevronDown size={17} aria-hidden="true" /></button>
    <svg className={s.filterDefinition} aria-hidden="true"><defs><filter id={`${id}-menu-liquid`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="9" /><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /><feComposite in="SourceGraphic" operator="atop" /></filter></defs></svg>
    {open && <div id={`${id}-opciones`} role="listbox" aria-label="Asunto de la consulta" className={s.menu}>
      <div className={s.liquid} style={{ filter: `url(#${id}-menu-liquid)` }} aria-hidden="true"><span /><span /><span /></div>
      {opciones.map((option, index) => <button key={option} ref={(node) => { options.current[index] = node }} type="button" role="option" aria-selected={value === option} tabIndex={-1} className={s.option} style={{ animationDelay: `${100 + index * 35}ms` }} onClick={() => { onChange(option); setOpen(false); trigger.current?.focus() }} onKeyDown={(event) => {
        let next = index
        if (event.key === "ArrowDown") next = (index + 1) % opciones.length
        else if (event.key === "ArrowUp") next = (index - 1 + opciones.length) % opciones.length
        else if (event.key === "Home") next = 0
        else if (event.key === "End") next = opciones.length - 1
        else if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = Date.now()
          search.current = { text: (now - search.current.time < 600 ? search.current.text : "") + event.key.toLocaleLowerCase(), time: now }
          const match = opciones.findIndex((label) => label.toLocaleLowerCase().startsWith(search.current.text))
          if (match >= 0) next = match
        } else return
        event.preventDefault()
        options.current[next]?.focus()
      }}><span>{option || "Sin seleccionar"}</span>{value === option && <Check size={16} aria-hidden="true" />}</button>)}
    </div>}
  </div>
}
