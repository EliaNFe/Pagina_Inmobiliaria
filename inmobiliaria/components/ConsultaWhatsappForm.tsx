"use client"

import { useState } from "react"

export default function ConsultaWhatsappForm({ numeroWhatsapp }: { numeroWhatsapp: string }) {
  const [nombre, setNombre] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")

  const mensajeArmado = `Hola, soy ${nombre || "..."}.${asunto ? ` Asunto: ${asunto}.` : ""}${mensaje ? ` ${mensaje}` : ""}`
  const href = numeroWhatsapp
    ? `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeArmado)}`
    : "#"

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "4px",
    padding: "12px 14px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
  }

  return (
    <div className="w-full max-w-md mx-auto" style={{ textAlign: "left" }}>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={inputStyle}
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Asunto</label>
          <input
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            style={inputStyle}
            placeholder="Ej: Quiero info de un terreno"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Mensaje</label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            style={{ ...inputStyle, resize: "none" }}
            rows={3}
            placeholder="Contanos qué estás buscando..."
          />
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 font-semibold text-[15px] transition-opacity hover:opacity-90"
        style={{
          background: "#C2540A",
          color: "#fff",
          borderRadius: "4px",
          padding: "14px",
          textDecoration: "none",
        }}
      >
        Enviar por WhatsApp
      </a>
    </div>
  )
}
