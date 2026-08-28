export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/api/*'],
      },
    ],
    sitemap: 'https://arunatravelstudio.com/sitemap.xml',
  };
}
