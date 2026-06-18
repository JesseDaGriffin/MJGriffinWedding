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
      'Playfair Display': [400, 600, 700],
      'UnifrakturMaguntia': true,
      'Pirata One': true,
      'Cinzel': [400, 500, 600, 700]
    }
  },
  supabase: {
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production'
    }
  },
  runtimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
  }
})
