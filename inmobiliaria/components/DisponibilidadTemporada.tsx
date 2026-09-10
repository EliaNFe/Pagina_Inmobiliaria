"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { bloquearTemporada, cancelarTemporada, consultarTemporada } from "@/lib/temporada-actions"
import { diasDelMes, fechaValida, mesArgentina, mostrarFecha, seSuperponen, type BloqueoTemporada } from "@/lib/temporada"
import { contactoPropiedad } from "@/lib/contacto-propiedad"
import s from "./DisponibilidadTemporada.module.css"

type Props = { propiedadId: string; admin?: boolean; titulo?: string; ubicacion?: string; whatsapp?: string }

export default function DisponibilidadTemporada({ propiedadId, admin = false, titulo = "", ubicacion = "", whatsapp }: Props) {
  const [mes, setMes] = useState("")
  const [carga, setCarga] = useState<{ clave: string; data?: BloqueoTemporada[]; error?: string }>()
  const [version, setVersion] = useState(0)
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")
  const [ocupado, setOcupado] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [seleccionado, setSeleccionado] = useState("")
  const [year, month] = mes.split("-").map(Number)
  const clave = `${propiedadId}:${admin}:${mes}:${version}`
  const listo = carga?.clave === clave && !!carga.data
  const bloqueos = listo ? carga.data! : []
  const error = carga?.clave === clave ? carga.error : undefined
  const total = mes ? diasDelMes(year, month) : 0

  useEffect(() => {
    // Inicializar en el navegador evita diferencias de fecha con el HTML prerenderizado.
    const timer = window.setTimeout(() => setMes(mesArgentina()), 0)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => {
    if (!mes) return
    let vigente = true
    consultarTemporada(propiedadId, `${mes}-01`, `${mes}-${total}`, admin)
      .then(resultado => { if (vigente) setCarga({ clave, ...resultado }) })
      .catch(() => { if (vigente) setCarga({ clave, error: "No se pudo cargar el calendario." }) })
    return () => { vigente = false }
  }, [mes, propiedadId, admin, total, clave])
  useEffect(() => {
    const refrescar = () => setVersion(v => v + 1)
    const timer = window.setInterval(refrescar, 60000)
    window.addEventListener("focus", refrescar)
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refrescar) }
  }, [])

  function navegar(delta: number) {
    const fecha = new Date(year, month - 1 + delta, 1)
    setMes(`${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`)
    setSeleccionado("")
  }
  function elegir(fecha: string) {
    if (admin) {
      if (!desde || hasta || fecha < desde) { setDesde(fecha); setHasta("") }
      else setHasta(fecha)
    } else { setDesde(fecha); setHasta(fecha) }
  }
  async function guardar(bloqueoId?: string) {
    if (ocupado) return
    setOcupado(true)
    setMensaje("")
    try {
      const resultado = bloqueoId ? await cancelarTemporada(propiedadId, bloqueoId) : await bloquearTemporada(propiedadId, desde, hasta)
      if (resultado.error) setMensaje(resultado.error)
      else {
        setMensaje(bloqueoId ? "Bloqueo cancelado. Las fechas quedaron liberadas." : "Fechas bloqueadas correctamente.")
        setDesde(""); setHasta(""); setSeleccionado("")
      }
      setVersion(v => v + 1)
    } catch { setMensaje("No se pudo guardar. Intentá nuevamente.") }
    finally { setOcupado(false) }
  }
  const cruce = desde && hasta && bloqueos.some(b => seSuperponen(desde, hasta, b))
  const fechaConsulta = listo && desde.startsWith(mes) && !bloqueos.some(b => seSuperponen(desde, desde, b)) ? desde : ""

  return <section id={admin ? undefined : "disponibilidad"} tabIndex={admin ? undefined : -1} className={s.section} aria-label="Disponibilidad">
    <h2>Disponibilidad</h2>
    <p className={s.intro}>{admin ? "Elegí el inicio y el final en el calendario o ingresá las fechas. Ambos días quedan incluidos." : "Elegí una fecha disponible para consultar. La consulta no confirma una reserva."}</p>
    <div className={s.month}>
      <button type="button" aria-label="Mes anterior" disabled={!mes || ocupado || year <= 1000 && month === 1} onClick={() => navegar(-1)}><ChevronLeft size={18} /></button>
      <strong aria-live="polite">{mes ? new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1)) : "Calendario"}</strong>
      <button type="button" aria-label="Mes siguiente" disabled={!mes || ocupado || year >= 9999 && month === 12} onClick={() => navegar(1)}><ChevronRight size={18} /></button>
    </div>
    {error ? <p role="alert">{error} <button type="button" onClick={() => setVersion(v => v + 1)}>Reintentar</button></p> : !listo ? <p role="status">Cargando disponibilidad…</p> : <>
      <div className={s.grid}>
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => <span className={s.weekday} key={d}>{d}</span>)}
        {Array.from({ length: (new Date(year, month - 1, 1).getDay() + 6) % 7 }, (_, i) => <span key={`v${i}`} />)}
        {Array.from({ length: total }, (_, i) => {
          const fecha = `${mes}-${String(i + 1).padStart(2, "0")}`
          const bloqueo = bloqueos.find(b => seSuperponen(fecha, fecha, b))
          const seleccionado = fecha >= desde && fecha <= (hasta || desde)
          return <button type="button" key={fecha} className={`${s.day} ${bloqueo ? s.busy : s.free} ${seleccionado ? s.selected : ""}`}
            disabled={ocupado || !!bloqueo && !admin} aria-pressed={seleccionado} aria-label={`${mostrarFecha(fecha)}: ${bloqueo ? "Ocupado" : "Disponible"}`}
            onClick={() => bloqueo ? setSeleccionado(bloqueo.id) : elegir(fecha)}>{i + 1}{bloqueo && <span aria-hidden="true">—</span>}</button>
        })}
      </div>
      <div className={s.legend}><span><i className={s.free} />Disponible</span><span><i className={s.busy} />Ocupado</span></div>
    </>}
    {admin ? <>
      <form className={s.form} onSubmit={e => { e.preventDefault(); void guardar() }}>
        <label>Desde<input required type="date" value={desde} disabled={ocupado} onChange={e => setDesde(e.target.value)} /></label>
        <label>Hasta<input required type="date" min={desde || undefined} value={hasta} disabled={ocupado} onChange={e => setHasta(e.target.value)} /></label>
        <button className={s.action} disabled={ocupado || !listo || !fechaValida(desde) || !fechaValida(hasta) || hasta < desde || !!cruce}>{ocupado ? "Guardando…" : "Bloquear fechas"}</button>
      </form>
      {cruce && <p role="alert">El rango incluye fechas ocupadas. Elegí otro rango.</p>}
      {listo && <div className={s.blocks}><h3>Bloqueos de este mes</h3>{bloqueos.length === 0 ? <p>No hay fechas bloqueadas.</p> : bloqueos.map(b => <div className={s.block} key={b.id} data-selected={seleccionado === b.id}>
        <span>{mostrarFecha(b.fecha_desde)} — {mostrarFecha(b.fecha_hasta)}</span>
        <button type="button" disabled={ocupado} onClick={() => guardar(b.id)}>Liberar fechas</button>
      </div>)}</div>}
      <p role="status" className={s.status}>{mensaje}</p>
    </> : fechaConsulta && <a className={s.action} href={contactoPropiedad(whatsapp, titulo, ubicacion, mostrarFecha(fechaConsulta))} target={whatsapp ? "_blank" : undefined} rel={whatsapp ? "noopener noreferrer" : undefined}>Consultar por el {mostrarFecha(fechaConsulta)}{whatsapp ? " por WhatsApp" : ""}</a>}
  </section>
}
