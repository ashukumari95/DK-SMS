import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'D.K.Mishra Student Management',
    short_name: 'D.K.Mishra',
    description: 'Student Management System for D.K.Mishra Classes',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1b9af7',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
