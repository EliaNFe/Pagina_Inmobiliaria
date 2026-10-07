// Reseñas mostradas en el home (sección "Lo que dicen quienes nos eligieron").
// Son reseñas reales de Google Maps, copiadas tal cual figuran en la ficha.
// El apellido va abreviado a propósito (privacidad). Si una persona pide que se
// retire su reseña, borrá su línea de abajo.
// Para agregar una nueva: sumá un objeto al final de RESENAS (se muestran de a 3).

export type Resena = {
  id: string
  autor: string
  estrellas: 1 | 2 | 3 | 4 | 5
  texto: string
  /** Texto libre tal como lo muestra Google, p. ej. "hace 2 meses". */
  fecha?: string
}

// Puntaje que muestra el home (el de la ficha de Google). Es fijo a propósito:
// las reseñas de abajo son solo las 6 de 5 estrellas, así que el promedio real de Google es otro.
export const PROMEDIO_RESENAS = 4.5

export const RESENAS: Resena[] = [
  { id: "r1", autor: "Silvina S.", estrellas: 5, texto: "Muy buena atencion,  profesionalismo a la hora de brindar asesoramiento y  acompañamiento en el momento de concretar operaciones. Excelente servicio digno de recomendar" },
  { id: "r2", autor: "Andres C.", estrellas: 5, texto: "Excelente vendedora perseverante, recomendable al 100 x 100 excelente trato con los clientes que concurren para requerir sus servicios como agente inmobiliario muy confiable no duden en consultarla si necesitan vender y/o alquilar sus propiedades" },
  { id: "r3", autor: "Gaston F.", estrellas: 5, texto: "Muy buena atención" },
  { id: "r4", autor: "Maria H.", estrellas: 5, texto: "Excelente atención, servicio y gestión de parte de Lili. Gran calidad humana también. Super recomendada para cualquier consulta y operación." },
  { id: "r5", autor: "Yanina S.", estrellas: 5, texto: "Buen servicio, atención amena y cordial, soy inquilina y el lugar donde vivo guarda una muy buena relación precio - calidad. Muy conforme con la gestión entre propietario e inquilina." },
  { id: "r6", autor: "Sergio A.", estrellas: 5, texto: "Exelente atencion y disposicion!!\nRecomendables 100%!!!" },
]

// Place ID del negocio en Google (dato público). Ya queda fijo acá como valor por
// defecto; la variable NEXT_PUBLIC_GOOGLE_PLACE_ID, si existe, tiene prioridad.
const PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "ChIJaar0cL69j5URBBHBIb2saOY"

/** Abre directamente el formulario para dejar una reseña. */
export const URL_ESCRIBIR_RESENA = PLACE_ID
  ? `https://search.google.com/local/writereview?placeid=${PLACE_ID}`
  : "https://www.google.com/maps/search/?api=1&query=Liliana+Cirigliano+Inmobiliaria+Necochea"

/** Abre la ficha con todas las reseñas. */
export const URL_VER_RESENAS = PLACE_ID
  ? `https://search.google.com/local/reviews?placeid=${PLACE_ID}`
  : URL_ESCRIBIR_RESENA
