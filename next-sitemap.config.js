module.exports = {
  siteUrl: 'https://www.barojiwon.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/api/*',          // exclude all API routes
    '/generate/*',     // exclude all nested generate routes like /generate/company_data
    '/pricing',        // exclude pricing page
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: '*',
        disallow: ['/admin', '/generate/', '/api/', '/pricing'],
      },
    ],
  },
}