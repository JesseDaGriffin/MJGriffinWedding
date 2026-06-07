import { v2 as cloudinary } from 'cloudinary'

let cachedResources: any[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  try {
    // Fetch and cache resources if expired or not fetched
    if (!cachedResources || Date.now() - lastFetchTime > CACHE_DURATION) {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'carousel/', // Fetches images inside the 'carousel' folder
        max_results: 500, // Fetch a large batch to randomize from
      })

      let resources = result.resources

      if (resources.length === 0) {
         const fallback = await cloudinary.api.resources({
           type: 'upload',
           max_results: 100
         })
         resources = fallback.resources
      }
      
      cachedResources = resources
      lastFetchTime = Date.now()
    }

    // Create a shallow copy so we can shuffle safely
    let resources = [...(cachedResources || [])]

    // Fisher-Yates shuffle
    for (let i = resources.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resources[i], resources[j]] = [resources[j], resources[i]];
    }

    // Return the shuffled array
    return {
      images: resources.map((img: any) => ({
        id: img.public_id,
        url: cloudinary.url(img.public_id, { fetch_format: 'auto', quality: 'auto' })
      }))
    }

  } catch (error) {
    console.error('Error fetching from Cloudinary:', error)
    return { images: [] }
  }
})
