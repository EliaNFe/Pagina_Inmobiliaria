"use client"

import { useState } from "react"
import Link from "next/link"
import { crearPropiedad } from "@/lib/property-actions"
import { comprimirImagen } from "@/lib/comprimir-imagen"

export default function NuevaPropiedad() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imagenes, setImagenes] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "Terreno",
    operacion: "Venta",
    precio: "",
    superficie: "",
    ubicacion: "",
    destacada: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleImagenes(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setImagenes(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    if (!form.titulo || !form.precio || !form.superficie) {
      setError("Completá título, precio y superficie como mínimo")
      setLoading(false)
      return
    }

    try {
      const imagenesBase64 = await Promise.all(
        imagenes.map(async (img) => ({
          nombre: img.name,
          base64: await comprimirImagen(img),
        }))
      )

      const resultado = await crearPropiedad(form, imagenesBase64)

      if (resultado?.error) {
        setError(resultado.error)
        setLoading(false)
      }
    } catch {
      setError("Error al guardar la propiedad")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" style={{color: "#92400E", fontSize: "14px", textDecoration: "none"}}>← Volver</Link>
          <h1 style={{fontSize: "1.5rem", fontWeight: 700, color: "#1C0A00"}}>Nueva propiedad</h1>
        </div>

        {error && <div style={{background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px"}}>{error}</div>}

        <div style={{background: "#fff", borderRadius: "16px", border: "1px solid #FFE4CC", padding: "32px", display: "flex", flexDirection: "column", gap: "20px"}}>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Título</label>
            <input name="titulo" value={form.titulo} onChange={handleChange}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
              placeholder="Ej: Casa en zona sur" />
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", background: "#fff", boxSizing: "border-box"}}>
                <option>Terreno</option>
                <option>Casa</option>
                <option>Lote</option>
                <option>Departamento</option>
                <option>Local comercial</option>
              </select>
            </div>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Operación</label>
              <select name="operacion" value={form.operacion} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", background: "#fff", boxSizing: "border-box"}}>
                <option>Venta</option>
                <option>Alquiler</option>
                <option>Alquiler temporada</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={4}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box"}}
              placeholder="Describí la propiedad con detalle..." />
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Precio (USD)</label>
              <input name="precio" type="number" value={form.precio} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                placeholder="45000" />
            </div>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Superficie (m²)</label>
              <input name="superficie" type="number" value={form.superficie} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
                placeholder="500" />
            </div>
          </div>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Ubicación</label>
            <input name="ubicacion" value={form.ubicacion} onChange={handleChange}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}}
              placeholder="Ej: Zona Norte, Necochea" />
          </div>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Fotos (podés subir varias)</label>
            <input type="file" accept="image/*" multiple onChange={handleImagenes}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", boxSizing: "border-box"}} />
            {previews.length > 0 && (
              <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px"}}>
                {previews.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={p} alt="preview" style={{width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "1px solid #FFE4CC"}} />
                ))}
              </div>
            )}
          </div>

          <div style={{background: "#FFF7ED", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "12px"}}>
            <input type="checkbox" id="destacada" checked={form.destacada}
              onChange={(e) => setForm(prev => ({...prev, destacada: e.target.checked}))}
              style={{width: "18px", height: "18px", accentColor: "#C2540A"}}
            />
            <div>
              <label htmlFor="destacada" style={{fontSize: "14px", fontWeight: 600, color: "#1C0A00", cursor: "pointer"}}>Mostrar en página principal</label>
              <p style={{fontSize: "12px", color: "#92400E", marginTop: "2px"}}>Aparece en la sección de propiedades destacadas del home (máximo 6, se priorizan las más recientes)</p>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{background: "#C2540A", color: "#fff", fontWeight: 700, padding: "14px", borderRadius: "10px", border: "none", fontSize: "15px", cursor: "pointer", opacity: loading ? 0.6 : 1}}>
            {loading ? "Guardando..." : "Guardar propiedad"}
          </button>
        </div>
      </div>
    </main>
  )
}
