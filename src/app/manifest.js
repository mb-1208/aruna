export default function manifest() {
  return {
    name: 'Aruna - Travel & Retreats',
    short_name: 'Aruna',
    description: 'Aruna Travel and Retreats in Bali',
    start_url: '/en',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
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
