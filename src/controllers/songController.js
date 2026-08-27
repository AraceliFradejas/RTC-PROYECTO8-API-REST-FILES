import Concert from '../models/Concert.js'
import Song from '../models/Song.js'
import AppError from '../utils/AppError.js'
import {
  CLOUDINARY_FOLDERS,
  deleteImageFromCloudinary,
  uploadImageToCloudinary
} from '../utils/cloudinaryFiles.js'
import { buildImageMetadata, parseJsonField } from '../utils/requestData.js'

const editableFields = [
  'title',
  'artist',
  'album',
  'era',
  'releaseYear',
  'spotifyUrl',
  'appleMusicUrl',
  'amazonMusicUrl'
]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getSongs = async (req, res) => {
  const filters = {}

  if (req.query.title) {
    filters.title = {
      $regex: escapeRegExp(req.query.title),
      $options: 'i'
    }
  }

  if (req.query.album) {
    filters.album = req.query.album
  }

  if (req.query.era) {
    filters.era = req.query.era
  }

  const songs = await Song.find(filters).sort({ album: 1, title: 1 })

  res.status(200).json(songs)
}

export const getSongById = async (req, res) => {
  const song = await Song.findById(req.params.id)

  if (!song) {
    throw new AppError('Song not found', 404)
  }

  res.status(200).json(song)
}

export const createSong = async (req, res, next) => {
  let uploadedImage = null

  try {
    if (!req.file) {
      throw new AppError('An image is required to create a song', 400)
    }

    if (!req.body.imageAlt?.trim()) {
      throw new AppError('imageAlt is required when uploading an image', 400)
    }

    uploadedImage = await uploadImageToCloudinary(
      req.file.buffer,
      CLOUDINARY_FOLDERS.songs
    )

    const song = await Song.create({
      title: req.body.title,
      artist: req.body.artist || 'Taylor Swift',
      album: req.body.album,
      era: req.body.era,
      releaseYear: req.body.releaseYear,
      spotifyUrl: req.body.spotifyUrl,
      appleMusicUrl: req.body.appleMusicUrl,
      amazonMusicUrl: req.body.amazonMusicUrl,
      sources: parseJsonField(req.body.sources, 'sources', []),
      image: buildImageMetadata(req.body, uploadedImage)
    })

    res.status(201).json(song)
  } catch (error) {
    if (uploadedImage?.publicId) {
      try {
        await deleteImageFromCloudinary(uploadedImage.publicId)
      } catch (cleanupError) {
        console.error('Unable to clean up uploaded image:', cleanupError.message)
      }
    }

    next(error)
  }
}

export const updateSong = async (req, res, next) => {
  let newUploadedImage = null
  let song = null
  let previousImage = null

  try {
    song = await Song.findById(req.params.id)

    if (!song) {
      throw new AppError('Song not found', 404)
    }

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        song[field] = req.body[field]
      }
    }

    if (req.body.sources !== undefined) {
      song.sources = parseJsonField(req.body.sources, 'sources', [])
    }

    if (req.file) {
      if (!req.body.imageAlt?.trim()) {
        throw new AppError('imageAlt is required when replacing an image', 400)
      }

      newUploadedImage = await uploadImageToCloudinary(
        req.file.buffer,
        CLOUDINARY_FOLDERS.songs
      )
      previousImage = song.image?.toObject() || null
      song.image = buildImageMetadata(req.body, newUploadedImage)
    } else if (song.image) {
      const metadataFields = {
        imageSourceUrl: 'sourceUrl',
        imageAuthor: 'author',
        imageLicense: 'license',
        imageLicenseUrl: 'licenseUrl',
        imageAlt: 'alt'
      }

      for (const [bodyField, imageField] of Object.entries(metadataFields)) {
        if (req.body[bodyField] !== undefined) {
          song.image[imageField] = req.body[bodyField] || null
        }
      }
    }

    await song.save()

    if (previousImage?.publicId) {
      try {
        await deleteImageFromCloudinary(previousImage.publicId)
      } catch (deletionError) {
        song.image = previousImage
        await song.save()

        if (newUploadedImage?.publicId) {
          await deleteImageFromCloudinary(newUploadedImage.publicId)
          newUploadedImage = null
        }

        throw deletionError
      }
    }

    newUploadedImage = null
    res.status(200).json(song)
  } catch (error) {
    if (newUploadedImage?.publicId) {
      try {
        await deleteImageFromCloudinary(newUploadedImage.publicId)
      } catch (cleanupError) {
        console.error('Unable to clean up replacement image:', cleanupError.message)
      }
    }

    next(error)
  }
}

export const deleteSong = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id)

    if (!song) {
      throw new AppError('Song not found', 404)
    }

    const relatedConcert = await Concert.exists({
      $or: [
        { regularSongs: song._id },
        { 'surprisePerformances.songs': song._id }
      ]
    })

    if (relatedConcert) {
      throw new AppError(
        'The song cannot be deleted while it is assigned to a concert',
        409
      )
    }

    if (song.image?.publicId) {
      await deleteImageFromCloudinary(song.image.publicId)
    }

    await song.deleteOne()

    res.status(200).json({
      message: 'Song and Cloudinary image deleted successfully',
      song
    })
  } catch (error) {
    next(error)
  }
}
