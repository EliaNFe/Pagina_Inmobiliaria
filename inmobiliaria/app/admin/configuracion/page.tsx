"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { guardarConfiguracion } from "@/lib/property-actions"
import Link from "next/link"

// Sigue usándose para LEER la config inicial. El guardado ahora pasa
// por la Server Action guardarConfiguracion (lib/property-actions.ts).
const supabase = getSupabaseClient()

export default function Configuracion() {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [config, setConfig] = useState({
    telefono: "",
    whatsapp: "",
    email: "",
    horario: "",
    direccion: "",
    instagram: "",
  })

  useEffect(() => {
    async function cargarConfig() {
      const { data } = await supabase.from("configuracion").select("*")
      if (data) {
        const obj: Record<string, string> = {}
        ;(data as never as { clave: string; valor: string }[]).forEach((row) => {
          obj[row.clave] = row.valor
        })
        setConfig(prev => ({ ...prev, ...obj }))
      }
      setLoadingData(false)
    }
    cargarConfig()
  }, [])

  async function handleGuardar() {
    setLoading(true)
    setError("")
    setSuccess("")

    const resultado = await guardarConfiguracion(config)

    if (resultado.error) {
      setError(resultado.error)
      setLoading(false)
      return
    }

    setSuccess("Configuración guardada correctamente")
    setLoading(false)
  }

  if (loadingData) {
    return (
      <main className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p style={{color: "#92400E"}}>Cargando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" style={{color: "#92400E", fontSize: "14px", textDecoration: "none"}}>← Volver</Link>
          <h1 style={{fontSize: "1.5rem", fontWeight: 700, color: "#1C0A00"}}>Configuración del sitio</h1>
        </div>

        {error && <div style={{background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px"}}>{error}</div>}
        {success && <div style={{background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px"}}>{success}</div>}

        <div className="p-5 sm:p-8" style={{background: "#fff", borderRadius: "16px", border: "1px solid #FFE4CC", display: "flex", flexDirection: "column", gap: "24px"}}>

          <div>
            <p style={{fontSize: "13px", fontWeight: 700, color: "#C2540A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", borderBottom: "1px solid #FFE4CC", paddingBottom: "8px"}}>Contacto</p>
            <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Teléfono</label>
                <input value={config.telefono} onChange={e => setConfig(prev => ({...prev, telefono: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="+54 9 2262 000000" />
              </div>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>WhatsApp (solo números con código de país)</label>
                <input value={config.whatsapp} onChange={e => setConfig(prev => ({...prev, whatsapp: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="5492262000000" />
              </div>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Instagram (usuario o link)</label>
                <input value={config.instagram} onChange={e => setConfig(prev => ({...prev, instagram: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="@inmobiliarialiliana" />
              </div>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Email</label>
                <input value={config.email} onChange={e => setConfig(prev => ({...prev, email: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="liliana@inmobiliaria.com" />
              </div>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Horario de atención</label>
                <input value={config.horario} onChange={e => setConfig(prev => ({...prev, horario: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="Lunes a viernes de 9 a 18hs" />
              </div>
              <div>
                <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Dirección</label>
                <input value={config.direccion} onChange={e => setConfig(prev => ({...prev, direccion: e.target.value}))}
                  style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                  placeholder="Necochea, Buenos Aires" />
              </div>
            </div>
          </div>

          <button onClick={handleGuardar} disabled={loading}
            style={{background: "#C2540A", color: "#fff", fontWeight: 700, padding: "14px", borderRadius: "10px", border: "none", fontSize: "15px", cursor: "pointer", opacity: loading ? 0.6 : 1}}>
            {loading ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </div>
    </main>
  )
}
