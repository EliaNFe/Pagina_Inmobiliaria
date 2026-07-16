"use server"

import { createClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

// Recalcula imagen_url en base a la foto de menor "orden" en propiedad_imagenes.
// Se llama siempre que se agrega o borra una foto, así imagen_url nunca queda
// desincronizada ni apuntando a algo que ya no existe.
async function sincronizarImagenPrincipal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propiedadId: string
) {
  const { data: imgs } = await supabase
    .from("propiedad_imagenes")
    .select("url")
    .eq("propiedad_id", propiedadId)
    .order("orden")
    .limit(1)

  const nuevaImagenUrl = (imgs && imgs.length > 0) ? (imgs[0] as { url: string }).url : ""

  await supabase
    .from("propiedades")
    .update({ imagen_url: nuevaImagenUrl } as never)
    .eq("id", propiedadId)
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

      // Solo se guarda acá. imagen_url ya NO se copia manualmente en paralelo,
      // se sincroniza al final una sola vez con sincronizarImagenPrincipal.
      await supabase.from("propiedad_imagenes").insert({
        propiedad_id: propiedadId,
        url: urlData.publicUrl,
        orden: i,
      } as never)
    }
  }

  await sincronizarImagenPrincipal(supabase, propiedadId)

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

  if (nuevasImagenesBase64.length > 0) {
    await sincronizarImagenPrincipal(supabase, id)
  }

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

export async function borrarImagenPropiedad(imagenId: string, url: string, propiedadId: string) {
  const supabase = await requireUser()

  const filename = url.split("/").pop()
  if (filename) {
    await supabase.storage.from("propiedades").remove([filename])
  }
  await supabase.from("propiedad_imagenes").delete().eq("id", imagenId)

  // Acá está el fix del "hueco": después de borrar, recalculamos imagen_url
  // para que apunte a la foto que quedó primera, o quede vacía si no queda ninguna.
  await sincronizarImagenPrincipal(supabase, propiedadId)

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${propiedadId}`)
  revalidatePath("/admin")
}

export async function borrarPropiedad(id: string, imagenes: { url: string }[]) {
  const supabase = await requireUser()

  for (const img of imagenes) {
    const filename = img.url.split("/").pop()
    if (filename) await supabase.storage.from("propiedades").remove([filename])
  }
  await supabase.from("propiedades").delete().eq("id", id)

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  redirect("/admin")
}

export async function borrarPropiedadesMultiples(ids: string[]) {
  const supabase = await requireUser()

  for (const id of ids) {
    const { data: imgs } = await supabase
      .from("propiedad_imagenes")
      .select("url")
      .eq("propiedad_id", id)

    const urls = (imgs || []) as { url: string }[]
    for (const img of urls) {
      const filename = img.url.split("/").pop()
      if (filename) await supabase.storage.from("propiedades").remove([filename])
    }

    await supabase.from("propiedades").delete().eq("id", id)
  }

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  return { success: true, borradas: ids.length }
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

  revalidatePath("/")
  revalidatePath("/contacto")

  return { success: true }
}
