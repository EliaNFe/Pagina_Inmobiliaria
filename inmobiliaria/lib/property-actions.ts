"use server"

import { createClient } from "@/lib/supabase-server"
import { registrarActividad } from "@/lib/auditoria"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return { supabase, user }
}

type FormPropiedad = {
  titulo: string
  descripcion: string
  tipo: string
  operacion: string
  moneda: string
  precio: string
  superficie: string
  ubicacion: string
  destacada: boolean
}

type Cambio = { antes: unknown; despues: unknown }

function obtenerCambios(
  anterior: Record<string, unknown>,
  nuevo: Record<string, unknown>
) {
  const detalle: Record<string, Cambio> = {}

  for (const [campo, despues] of Object.entries(nuevo)) {
    const antes = anterior[campo]
    if (antes !== despues) detalle[campo] = { antes, despues }
  }

  return detalle
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
  const { supabase, user } = await requireUser()

  const { data: propiedad, error: insertError } = await supabase
    .from("propiedades")
    .insert({
      titulo: form.titulo,
      descripcion: form.descripcion,
      tipo: form.tipo,
      operacion: form.operacion,
      moneda: form.moneda,
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

  await registrarActividad(supabase, {
    usuarioEmail: user.email ?? "Sin email",
    accion: "crear",
    entidad: "propiedad",
    entidadId: propiedadId,
    entidadTitulo: form.titulo,
  })

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
  const { supabase, user } = await requireUser()

  const { data: propiedadAnterior } = await supabase
    .from("propiedades")
    .select("titulo, descripcion, tipo, operacion, moneda, precio, superficie, ubicacion, destacada")
    .eq("id", id)
    .maybeSingle()

  const nuevosValores = {
    titulo: form.titulo,
    descripcion: form.descripcion,
    tipo: form.tipo,
    operacion: form.operacion,
    moneda: form.moneda,
    precio: Number(form.precio),
    superficie: Number(form.superficie),
    ubicacion: form.ubicacion,
    destacada: form.destacada,
  }

  const { error: updateError } = await supabase
    .from("propiedades")
    .update(nuevosValores as never)
    .eq("id", id)

  if (updateError) {
    return { error: "Error al guardar los cambios" }
  }

  let fotosAgregadas = 0
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
      const { error: insertImagenError } = await supabase.from("propiedad_imagenes").insert({
        propiedad_id: id,
        url: urlData.publicUrl,
        orden: ordenInicial + i,
      } as never)
      if (!insertImagenError) fotosAgregadas += 1
    }
  }

  if (nuevasImagenesBase64.length > 0) {
    await sincronizarImagenPrincipal(supabase, id)
  }

  await registrarActividad(supabase, {
    usuarioEmail: user.email ?? "Sin email",
    accion: "editar",
    entidad: "propiedad",
    entidadId: id,
    entidadTitulo: form.titulo,
    detalle: obtenerCambios(
      (propiedadAnterior ?? {}) as Record<string, unknown>,
      nuevosValores
    ),
  })

  if (fotosAgregadas > 0) {
    await registrarActividad(supabase, {
      usuarioEmail: user.email ?? "Sin email",
      accion: "agregar_fotos",
      entidad: "imagen",
      entidadId: id,
      entidadTitulo: form.titulo,
      detalle: { cantidad: fotosAgregadas },
    })
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
  const { supabase, user } = await requireUser()

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("titulo")
    .eq("id", propiedadId)
    .maybeSingle()

  const filename = url.split("/").pop()
  if (filename) {
    await supabase.storage.from("propiedades").remove([filename])
  }
  const { error: deleteError } = await supabase
    .from("propiedad_imagenes")
    .delete()
    .eq("id", imagenId)

  // Acá está el fix del "hueco": después de borrar, recalculamos imagen_url
  // para que apunte a la foto que quedó primera, o quede vacía si no queda ninguna.
  await sincronizarImagenPrincipal(supabase, propiedadId)

  if (!deleteError) {
    await registrarActividad(supabase, {
      usuarioEmail: user.email ?? "Sin email",
      accion: "borrar_foto",
      entidad: "imagen",
      entidadId: propiedadId,
      entidadTitulo: (propiedad as { titulo?: string } | null)?.titulo,
      detalle: { imagen_id: imagenId },
    })
  }

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${propiedadId}`)
  revalidatePath("/admin")
}

export async function borrarPropiedad(id: string, imagenes: { url: string }[]) {
  const { supabase, user } = await requireUser()

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("titulo")
    .eq("id", id)
    .maybeSingle()

  for (const img of imagenes) {
    const filename = img.url.split("/").pop()
    if (filename) await supabase.storage.from("propiedades").remove([filename])
  }
  const { error: deleteError } = await supabase
    .from("propiedades")
    .delete()
    .eq("id", id)

  if (!deleteError) {
    await registrarActividad(supabase, {
      usuarioEmail: user.email ?? "Sin email",
      accion: "borrar",
      entidad: "propiedad",
      entidadId: id,
      entidadTitulo: (propiedad as { titulo?: string } | null)?.titulo,
    })
  }

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  redirect("/admin")
}

export async function borrarPropiedadesMultiples(ids: string[]) {
  const { supabase, user } = await requireUser()

  const { data: propiedades } = await supabase
    .from("propiedades")
    .select("id, titulo")
    .in("id", ids)
  const titulos = new Map(
    ((propiedades || []) as { id: string; titulo: string }[])
      .map((propiedad) => [propiedad.id, propiedad.titulo])
  )

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

    const { error: deleteError } = await supabase
      .from("propiedades")
      .delete()
      .eq("id", id)

    if (!deleteError) {
      await registrarActividad(supabase, {
        usuarioEmail: user.email ?? "Sin email",
        accion: "borrar",
        entidad: "propiedad",
        entidadId: id,
        entidadTitulo: titulos.get(id),
      })
    }
  }

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath("/admin")

  return { success: true, borradas: ids.length }
}


export async function guardarOrdenImagenes(propiedadId: string, orden: { id: string; orden: number }[]) {
  const { supabase, user } = await requireUser()

  const { data: propiedad } = await supabase
    .from("propiedades")
    .select("titulo")
    .eq("id", propiedadId)
    .maybeSingle()

  let ordenGuardado = true
  for (const item of orden) {
    const { error } = await supabase
      .from("propiedad_imagenes")
      .update({ orden: item.orden } as never)
      .eq("id", item.id)
    if (error) ordenGuardado = false
  }

  // La foto que quedó en el orden más bajo pasa a ser la portada automáticamente.
  await sincronizarImagenPrincipal(supabase, propiedadId)

  if (ordenGuardado) {
    await registrarActividad(supabase, {
      usuarioEmail: user.email ?? "Sin email",
      accion: "reordenar_fotos",
      entidad: "propiedad",
      entidadId: propiedadId,
      entidadTitulo: (propiedad as { titulo?: string } | null)?.titulo,
    })
  }

  revalidatePath("/")
  revalidatePath("/propiedades")
  revalidatePath(`/propiedades/${propiedadId}`)
  revalidatePath("/admin")

  return { success: true }
}

export async function guardarConfiguracion(config: Record<string, string>) {
  const { supabase, user } = await requireUser()

  const { data: configuracionAnterior } = await supabase
    .from("configuracion")
    .select("clave, valor")
  const valoresAnteriores = Object.fromEntries(
    ((configuracionAnterior || []) as { clave: string; valor: string }[])
      .map(({ clave, valor }) => [clave, valor])
  )

  const entries = Object.entries(config)
  for (const [clave, valor] of entries) {
    const { error } = await supabase
      .from("configuracion")
      .upsert({ clave, valor } as never, { onConflict: "clave" })

    if (error) {
      return { error: "Error al guardar la configuración" }
    }
  }

  await registrarActividad(supabase, {
    usuarioEmail: user.email ?? "Sin email",
    accion: "guardar_configuracion",
    entidad: "configuracion",
    detalle: obtenerCambios(valoresAnteriores, config),
  })

  revalidatePath("/")
  revalidatePath("/contacto")

  return { success: true }
}
