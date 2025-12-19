import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SomosDaris - Servicio de Limpieza',
    short_name: 'SomosDaris',
    description: 'Servicio profesional de limpieza en Valledupar, Cesar',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#196dffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
        // purpose: 'any maskable',
      },
    ],
  }
}
