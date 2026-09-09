"use client"

import { useId, useState } from "react"
import { MessageCircle } from "lucide-react"
import AsuntoSelect from "./AsuntoSelect"
import s from "./ConsultaWhatsappForm.module.css"

export default function ConsultaWhatsappForm({ numeroWhatsapp }: { numeroWhatsapp: string }) {
  const id = useId()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const numero = numeroWhatsapp.replace(/\D/g, "")
  const texto = `Hola, soy ${nombre.trim()}.${email.trim() ? ` Mi email: ${email.trim()}.` : ""}${asunto ? ` Me interesa: ${asunto}.` : ""} ${mensaje.trim()}`

  return (
    <form action={`https://wa.me/${numero}`} method="get" target="_blank" className="w-full max-w-md mx-auto text-left">
      <input type="hidden" name="text" value={texto} />
      <div className={s.shell} data-open={Boolean(asunto)}>
      <svg className={s.filterDefinition} aria-hidden="true"><defs><filter id={`${id}-liquid`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="9" /><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /><feComposite in="SourceGraphic" operator="atop" /></filter></defs></svg>
      <div className={s.liquid} style={{ filter: `url(#${id}-liquid)` }} aria-hidden="true"><span className={s.source} /><span className={s.drop} /><span className={s.drop} /><span className={s.drop} /></div>
      <div className={s.start}>
        <AsuntoSelect id={`${id}-asunto`} value={asunto} onChange={setAsunto} />
      </div>
      <p className="sr-only" role="status">{asunto ? "Ahora podés completar tu nombre, email y mensaje." : ""}</p>
      <div className={s.reveal} data-open={Boolean(asunto)} inert={!asunto} aria-hidden={!asunto}>
        <div className={s.revealInner}>
        <fieldset disabled={!asunto} className={s.fields}>
        <legend className="sr-only">Tus datos y consulta</legend>
        <div className={s.field}>
          <label htmlFor={`${id}-nombre`}>Tu nombre</label>
          <input id={`${id}-nombre`} autoComplete="name" required maxLength={100} value={nombre} onChange={(e) => setNombre(e.target.value)} className={s.input} placeholder="¿Cómo te llamás?" />
        </div>
        <div className={s.field}>
          <label htmlFor={`${id}-email`}>Tu email <span>(opcional)</span></label>
          <input id={`${id}-email`} type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} className={s.input} placeholder="nombre@ejemplo.com" />
        </div>
        <div className={s.field}>
          <label htmlFor={`${id}-mensaje`}>Contame un poco más</label>
          <textarea id={`${id}-mensaje`} required maxLength={2000} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className={s.input} rows={4} placeholder="Escribí tu consulta…" />
        </div>
        <button type="submit" disabled={!numero || !asunto} className={s.submit}><MessageCircle size={17} />Continuar en WhatsApp</button>
        </fieldset>
        </div>
      </div>
      </div>
      {!numero && <p role="status" className="mt-4 text-sm text-[#dccbbd]">WhatsApp no está disponible por el momento. Consultá nuestros <a href="/contacto" className="underline">datos de contacto</a>.</p>}
    </form>
  )
}
