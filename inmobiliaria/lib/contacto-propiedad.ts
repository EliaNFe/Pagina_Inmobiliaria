export function contactoPropiedad(whatsapp: string | undefined, titulo: string, ubicacion: string, fecha?: string) {
  const mensaje = `Hola, quería consultar por la propiedad "${titulo}" ubicada en ${ubicacion}${fecha ? ` para el día ${fecha}` : ""}.`
  return whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}` : "/contacto"
}
