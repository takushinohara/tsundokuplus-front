// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    'pages/**': { ssr: false }
  },
  runtimeConfig: {
    public: {
      tsundokuApiBaseUrl: process.env.TSUNDOKU_API_BASE_URL,
      demoUser: {
        email: process.env.DEMO_USER_EMAIL,
        password: process.env.DEMO_USER_PASSWORD
      }
    }
  },
  experimental: {
    payloadExtraction: false
  }
})
