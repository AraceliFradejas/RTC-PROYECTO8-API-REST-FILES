import cloudinary from '../config/cloudinary.js'

export const CLOUDINARY_FOLDERS = {
  songs: 'eras-tour/songs',
  concerts: 'eras-tour/concerts'
}

export const uploadImageToCloudinary = (fileBuffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        use_filename: true,
        unique_filename: true,
        overwrite: false
      },
      (error, result) => {
        if (error) {
          return reject(error)
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        })
      }
    )

    uploadStream.end(fileBuffer)
  })

export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) {
    return
  }

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true
  })

  if (!['ok', 'not found'].includes(result.result)) {
    throw new Error(`Cloudinary could not delete image: ${result.result}`)
  }
}
