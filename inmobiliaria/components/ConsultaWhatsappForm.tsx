"use client"

import { useId, useState } from "react"
import { MessageCircle } from "lucide-react"

export default function ConsultaWhatsappForm({ numeroWhatsapp }: { numeroWhatsapp: string }) {
  const id = useId()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const numero = numeroWhatsapp.replace(/\D/g, "")
  const texto = `Hola, soy ${nombre.trim()}.${email.trim() ? ` Mi email: ${email.trim()}.` : ""}${asunto ? ` Me interesa: ${asunto}.` : ""} ${mensaje.trim()}`
  const fieldStyle: React.CSSProperties = {
    width: "100%", background: "#36251b", border: "1px solid #604532",
    borderRadius: 3, padding: "11px 12px", fontSize: 13, color: "#f8eee3",
  }

  return (
    <form action={`https://wa.me/${numero}`} method="get" target="_blank" className="w-full max-w-md mx-auto text-left">
      <input type="hidden" name="text" value={texto} />
      <div className="flex flex-col gap-3 mb-4">
        <div>
          <label htmlFor={`${id}-nombre`} className="sr-only">Tu nombre</label>
          <input id={`${id}-nombre`} autoComplete="name" required maxLength={100} value={nombre} onChange={(e) => setNombre(e.target.value)} style={fieldStyle} placeholder="Tu nombre" />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="sr-only">Tu email (opcional)</label>
          <input id={`${id}-email`} type="email" autoComplete="email" maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} placeholder="Tu email" />
        </div>
        <div>
          <label htmlFor={`${id}-asunto`} className="sr-only">¿Qué estás buscando? (opcional)</label>
          <select id={`${id}-asunto`} value={asunto} onChange={(e) => setAsunto(e.target.value)} style={fieldStyle}>
            <option value="">¿Qué estás buscando?</option>
            <option value="Comprar una propiedad">Comprar una propiedad</option>
            <option value="Alquilar una propiedad">Alquilar una propiedad</option>
            <option value="Vender mi propiedad">Vender mi propiedad</option>
            <option value="Una tasación">Una tasación</option>
            <option value="Otra consulta">Otra consulta</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-mensaje`} className="sr-only">Mensaje</label>
          <textarea id={`${id}-mensaje`} required maxLength={2000} value={mensaje} onChange={(e) => setMensaje(e.target.value)} style={{ ...fieldStyle, resize: "vertical", minHeight: 106 }} rows={4} placeholder="Mensaje" />
        </div>
      </div>
      <button type="submit" disabled={!numero} className="inline-flex items-center justify-center gap-3 rounded-[3px] bg-[#bd521d] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#963c19] disabled:opacity-50 disabled:cursor-not-allowed"><MessageCircle size={17} />Continuar en WhatsApp</button>
      {!numero && <p role="status" className="mt-4 text-sm text-[#dccbbd]">WhatsApp no está disponible por el momento. Consultá nuestros <a href="/contacto" className="underline">datos de contacto</a>.</p>}
    </form>
  )
}
