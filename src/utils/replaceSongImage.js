import { deleteImageFromCloudinary } from './cloudinaryFiles.js'

// Persists the image already assigned to song and compensates a failed replacement.
export const replaceSongImage = async (song, previousImage, newImage) => {
  let imageToCleanUp = newImage

  try {
    await song.save()

    if (previousImage?.publicId) {
      try {
        await deleteImageFromCloudinary(previousImage.publicId)
      } catch (deletionError) {
        song.image = previousImage
        await song.save()

        if (imageToCleanUp?.publicId) {
          await deleteImageFromCloudinary(imageToCleanUp.publicId)
          imageToCleanUp = null
        }

        throw deletionError
      }
    }
  } catch (error) {
    if (imageToCleanUp?.publicId) {
      try {
        await deleteImageFromCloudinary(imageToCleanUp.publicId)
      } catch (cleanupError) {
        console.error('Unable to clean up replacement image:', cleanupError.message)
      }
    }

    throw error
  }
}
