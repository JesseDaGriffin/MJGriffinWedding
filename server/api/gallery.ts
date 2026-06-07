import { v2 as cloudinary } from 'cloudinary'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  try {
    // Attempt to fetch images from a specific folder named "carousel"
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'carousel/', // Fetches images inside the 'carousel' folder
      max_results: 50,
    })

    // If the 'carousel' folder is empty, fallback to fetching ANY recent images
    // This ensures you see something working right away!
    let resources = result.resources
    if (resources.length === 0) {
       const fallback = await cloudinary.api.resources({
         type: 'upload',
         max_results: 10
       })
       resources = fallback.resources
    }

    // Return an array of optimized URLs
    return resources.map(img => ({
      id: img.public_id,
      url: cloudinary.url(img.public_id, { fetch_format: 'auto', quality: 'auto' })
    }))

  } catch (error) {
    console.error('Error fetching from Cloudinary:', error)
    return []
  }
})
