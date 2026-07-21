"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { use } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { actualizarPropiedad, borrarImagenPropiedad, borrarPropiedad } from "@/lib/property-actions"
import { comprimirImagen } from "@/lib/comprimir-imagen"

const supabase = getSupabaseClient()

export default function EditarPropiedad({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [imagenes, setImagenes] = useState<{ id: string; url: string; orden: number }[]>([])
  const [nuevasImagenes, setNuevasImagenes] = useState<File[]>([])
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

  useEffect(() => {
    async function cargarDatos() {
      const { data: propiedad } = await supabase
        .from("propiedades")
        .select("*")
        .eq("id", id)
        .single()

      if (propiedad) {
        const p = propiedad as never as {
          titulo: string; descripcion: string; tipo: string; operacion?: string
          precio: number; superficie: number; ubicacion: string; destacada: boolean
        }
        setForm({
          titulo: p.titulo || "",
          descripcion: p.descripcion || "",
          tipo: p.tipo || "Terreno",
          operacion: p.operacion || "Venta",
          precio: p.precio?.toString() || "",
          superficie: p.superficie?.toString() || "",
          ubicacion: p.ubicacion || "",
          destacada: p.destacada || false,
        })
      }

      const { data: imgs } = await supabase
        .from("propiedad_imagenes")
        .select("*")
        .eq("propiedad_id", id)
        .order("orden")

      if (imgs) setImagenes(imgs as never)
      setLoadingData(false)
    }
    cargarDatos()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleNuevasImagenes(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setNuevasImagenes(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  async function handleBorrarImagen(imagenId: string, url: string) {
    // Le pasamos el id de la propiedad para que la Server Action pueda
    // recalcular imagen_url y no queden "huecos" con la foto principal.
    await borrarImagenPropiedad(imagenId, url, id)
    setImagenes(prev => prev.filter(i => i.id !== imagenId))
  }

  async function handleGuardar() {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const nuevasImagenesBase64 = await Promise.all(
        nuevasImagenes.map(async (img) => ({
          nombre: img.name,
          base64: await comprimirImagen(img),
        }))
      )

      const resultado = await actualizarPropiedad(id, form, nuevasImagenesBase64, imagenes.length)

      if (resultado.error) {
        setError(resultado.error)
        setLoading(false)
        return
      }

      setSuccess("Propiedad actualizada correctamente")
      setNuevasImagenes([])
      setPreviews([])
      if (resultado.imagenes) setImagenes(resultado.imagenes as never)
    } catch {
      setError("Error al guardar los cambios")
    } finally {
      setLoading(false)
    }
  }

  async function handleBorrarPropiedad() {
    if (!confirm("¿Seguro que querés borrar esta propiedad? Esta acción no se puede deshacer.")) return
    await borrarPropiedad(id, imagenes)
    router.push("/admin")
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" style={{color: "#92400E", fontSize: "14px", textDecoration: "none"}}>← Volver</Link>
            <h1 style={{fontSize: "1.5rem", fontWeight: 700, color: "#1C0A00"}}>Editar propiedad</h1>
          </div>
          <button onClick={handleBorrarPropiedad}
            style={{background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer"}}>
            Borrar propiedad
          </button>
        </div>

        {error && <div style={{background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px"}}>{error}</div>}
        {success && <div style={{background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px"}}>{success}</div>}

        <div style={{background: "#fff", borderRadius: "16px", border: "1px solid #FFE4CC", padding: "32px", display: "flex", flexDirection: "column", gap: "20px"}}>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Título</label>
            <input name="titulo" value={form.titulo} onChange={handleChange}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}} />
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
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", resize: "none", boxSizing: "border-box"}} />
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px"}}>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Precio (USD)</label>
              <input name="precio" type="number" value={form.precio} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}} />
            </div>
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Superficie (m²)</label>
              <input name="superficie" type="number" value={form.superficie} onChange={handleChange}
                style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}} />
            </div>
          </div>

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Ubicación</label>
            <input name="ubicacion" value={form.ubicacion} onChange={handleChange}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", boxSizing: "border-box"}} />
          </div>

          <div style={{background: "#FFF7ED", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "12px"}}>
            <input type="checkbox" id="destacada" checked={form.destacada}
              onChange={(e) => setForm(prev => ({...prev, destacada: e.target.checked}))}
              style={{width: "18px", height: "18px", accentColor: "#C2540A"}} />
            <div>
              <label htmlFor="destacada" style={{fontSize: "14px", fontWeight: 600, color: "#1C0A00", cursor: "pointer"}}>Mostrar en página principal</label>
              <p style={{fontSize: "12px", color: "#92400E", marginTop: "2px"}}>Aparece en la sección de propiedades destacadas del home (máximo 6, se priorizan las más recientes)</p>
            </div>
          </div>

          {imagenes.length > 0 && (
            <div>
              <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px"}}>Fotos actuales</label>
              <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px"}}>
                {imagenes.map((img, i) => (
                  <div key={img.id} style={{position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1"}}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="foto" style={{width: "100%", height: "100%", objectFit: "cover"}} />
                    {i === 0 && (
                      <span style={{position: "absolute", top: "4px", left: "4px", background: "#C2540A", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px"}}>
                        Principal
                      </span>
                    )}
                    <button onClick={() => handleBorrarImagen(img.id, img.url)}
                      style={{position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{display: "block", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"}}>Agregar fotos</label>
            <input type="file" accept="image/*" multiple onChange={handleNuevasImagenes}
              style={{width: "100%", border: "1px solid #FFE4CC", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", boxSizing: "border-box"}} />
            {previews.length > 0 && (
              <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px"}}>
                {previews.map((p, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={p} alt="preview" style={{width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "8px", border: "2px solid #C2540A"}} />
                ))}
              </div>
            )}
          </div>

          <button onClick={handleGuardar} disabled={loading}
            style={{background: "#C2540A", color: "#fff", fontWeight: 700, padding: "14px", borderRadius: "10px", border: "none", fontSize: "15px", cursor: "pointer", opacity: loading ? 0.6 : 1}}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </main>
  )
}
