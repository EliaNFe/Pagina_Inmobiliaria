export function formatearPrecio(precio: number, moneda?: string) {
  const simbolo = moneda === "Dólares" ? "US$" : "$"
  return `${simbolo} ${precio.toLocaleString("es-AR")}`
}
