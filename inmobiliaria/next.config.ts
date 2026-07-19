import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Por default Next.js corta el request a los Server Actions en 1MB.
      // Con varias fotos comprimidas en base64 (que de por sí pesan ~33%
      // más que el archivo original) se pasa fácil ese límite al subir
      // varias de una. Lo subimos a 15MB para tener margen.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
