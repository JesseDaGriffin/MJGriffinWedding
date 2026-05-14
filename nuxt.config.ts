// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase'
  ],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
      'Playfair Display': [400, 600, 700]
    }
  }
})
