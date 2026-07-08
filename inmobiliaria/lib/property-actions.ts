"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

// Helper: confirma que hay sesión antes de dejar escribir nada.
// Es una segunda capa de seguridad además del middleware: si alguna vez
// el middleware se rompe o se llama a esta acción desde otro lado,
// esto sigue bloqueando.
async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return supabase
}

type FormPropiedad = {
  titulo: string
  descripcion: string
  tipo: string
  precio: string
  superficie: string
  ubicacion: string
  destacada: boolean
}

export async function crearPropiedad(form: FormPropiedad, imagenesBase64: { nombre: string; base64: string }[]) {
  const supabase = await requireUser()

  const { data: propiedad, error: insertError } = await supabase
    .from("propiedades")
    .insert({
      titulo: form.titulo,
      descripcion: form.descripcion,
      tipo: form.tipo,
      precio: Number(form.precio),
      superficie: Number(form.superficie),
      ubicacion: form.ubicacion,
      destacada: form.destacada,
      imagen_url: "",
    } as never)
    .select()
    .single()

  if (insertError || !propiedad) {
    return { error: "Error al guardar la propiedad" }
  }

  const propiedadId = (propiedad as { id: string }).id
  let imagen_url = ""

  for (let i = 0; i < imagenesBase64.length; i++) {
    const img = imagenesBase64[i]
    const ext = img.nombre.split(".").pop()
    const filename = `${Date.now()}_${i}.${ext}`
    const buffer = Buffer.from(img.base64, "base64")

    const { error: uploadError } = await supabase.storage
      .from("propiedades")
      .upload(filename, buffer, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("propiedades").getPublicUrl(filename)
      if (i === 0) imagen_url = urlData.publicUrl

      await supabase.from("propiedad_imagenes").insert({
        propiedad_id: propiedadId,
        url: urlData.publicUrl,
        orden: i,
      } as never)
    }
  }

  if (imagen_url) {
    await supabase.from("propiedades").update({ imagen_url } as never).eq("id", propiedadId)
  }

  // Esto es lo que arregla el delay: invalidamos el caché ni bien terminamos de escribir.
  revalidateTag("propiedades")
  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  redirect("/admin")
}

export async function actualizarPropiedad(
  id: string,
  form: FormPropiedad,
  nuevasImagenesBase64: { nombre: string; base64: string }[],
  ordenInicial: number
) {
  const supabase = await requireUser()

  const { error: updateError } = await supabase
    .from("propiedades")
    .update({
      titulo: form.titulo,
      descripcion: form.descripcion,
      tipo: form.tipo,
      precio: Number(form.precio),
      superficie: Number(form.superficie),
      ubicacion: form.ubicacion,
      destacada: form.destacada,
    } as never)
    .eq("id", id)

  if (updateError) {
    return { error: "Error al guardar los cambios" }
  }

  for (let i = 0; i < nuevasImagenesBase64.length; i++) {
    const img = nuevasImagenesBase64[i]
    const ext = img.nombre.split(".").pop()
    const filename = `${Date.now()}_${i}.${ext}`
    const buffer = Buffer.from(img.base64, "base64")

    const { error: uploadError } = await supabase.storage
      .from("propiedades")
      .upload(filename, buffer, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` })

    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("propiedades").getPublicUrl(filename)
      await supabase.from("propiedad_imagenes").insert({
        propiedad_id: id,
        url: urlData.publicUrl,
        orden: ordenInicial + i,
      } as never)
    }
  }

  revalidateTag("propiedades")
  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${id}`)
  revalidatePath("/admin")

  const { data: imgs } = await supabase
    .from("propiedad_imagenes")
    .select("*")
    .eq("propiedad_id", id)
    .order("orden")

  return { success: true, imagenes: imgs || [] }
}

export async function borrarImagenPropiedad(imagenId: string, url: string) {
  const supabase = await requireUser()

  const filename = url.split("/").pop()
  if (filename) {
    await supabase.storage.from("propiedades").remove([filename])
  }
  await supabase.from("propiedad_imagenes").delete().eq("id", imagenId)

  revalidateTag("propiedades")
}

export async function borrarPropiedad(id: string, imagenes: { url: string }[]) {
  const supabase = await requireUser()

  for (const img of imagenes) {
    const filename = img.url.split("/").pop()
    if (filename) await supabase.storage.from("propiedades").remove([filename])
  }
  await supabase.from("propiedades").delete().eq("id", id)

  revalidateTag("propiedades")
  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  redirect("/admin")
}

export async function guardarConfiguracion(config: Record<string, string>) {
  const supabase = await requireUser()

  const entries = Object.entries(config)
  for (const [clave, valor] of entries) {
    const { error } = await supabase
      .from("configuracion")
      .upsert({ clave, valor } as never, { onConflict: "clave" })

    if (error) {
      return { error: "Error al guardar la configuración" }
    }
  }

  revalidateTag("configuracion")
  revalidatePath("/")
  revalidatePath("/contacto")

  return { success: true }
}
