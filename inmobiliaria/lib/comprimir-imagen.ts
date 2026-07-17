// Redimensiona y comprime una imagen en el navegador antes de mandarla al servidor.
// así que se puede intercambiar directamente donde se usaba fileToBase64.
export function comprimirImagen(file: File, maxAncho = 1600, calidad = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        if (width > maxAncho) {
          height = Math.round((height * maxAncho) / width)
          width = maxAncho
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen"))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)

        const dataUrl = canvas.toDataURL("image/jpeg", calidad)
        resolve(dataUrl.split(",")[1])
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
