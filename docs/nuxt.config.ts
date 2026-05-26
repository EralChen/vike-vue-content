export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  devServer: {
    port: 9995
  },
  routeRules: {
    // redirects - default root pages
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  compatibilityDate: 'latest',

  aiChat: {
    model: 'zai/glm-4.7',
    models: [
      'zai/glm-4.7',
      'anthropic/claude-sonnet-4.6',
      'google/gemini-3-flash'
    ]
  },

  mcp: {
    name: 'Movk Nuxt Docs'
  },
  movkNuxtDocs: {
    a11y: false
  }
})
