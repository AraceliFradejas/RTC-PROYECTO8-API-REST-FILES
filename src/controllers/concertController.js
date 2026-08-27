import mongoose from 'mongoose'
import { cancelledConcertData } from '../data/cancelledConcertData.js'
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
  'city',
  'country',
  'venue',
  'date',
  'tourLeg',
  'showNumber',
  'setlistVersion',
  'notes'
]

const concertPopulate = [
  {
    path: 'regularSongs',
    select: 'title artist album era releaseYear image'
  },
  {
    path: 'surprisePerformances.songs',
    select: 'title artist album era releaseYear image'
  }
]

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const collectSongIds = (regularSongs, surprisePerformances) => [
  ...regularSongs,
  ...surprisePerformances.flatMap((performance) => performance.songs || [])
]

const validateSongReferences = async (regularSongs, surprisePerformances) => {
  const songIds = collectSongIds(regularSongs, surprisePerformances)

  if (songIds.some((id) => !mongoose.isObjectIdOrHexString(id))) {
    throw new AppError('Every related song must have a valid identifier', 400)
  }

  const uniqueSongIds = [...new Set(songIds.map(String))]
  const existingSongs = await Song.countDocuments({
    _id: { $in: uniqueSongIds }
  })

  if (existingSongs !== uniqueSongIds.length) {
    throw new AppError('One or more related songs do not exist', 400)
  }
}

export const getCancelledConcerts = (req, res) => {
  res.status(200).json({
    count: cancelledConcertData.length,
    clarification:
      'These scheduled dates are documented separately and are not part of the 149 concerts performed.',
    events: cancelledConcertData
  })
}

const parseConcertRelations = (body, currentConcert = null) => {
  const regularSongs = parseJsonField(
    body.regularSongs,
    'regularSongs',
    currentConcert?.regularSongs || []
  )
  const surprisePerformances = parseJsonField(
    body.surprisePerformances,
    'surprisePerformances',
    currentConcert?.surprisePerformances || []
  )

  if (!Array.isArray(regularSongs) || !Array.isArray(surprisePerformances)) {
    throw new AppError(
      'regularSongs and surprisePerformances must be JSON arrays',
      400
    )
  }

  if (regularSongs.length === 0) {
    throw new AppError('A concert must contain regular songs', 400)
  }

  const invalidPerformance = surprisePerformances.some(
    (performance) =>
      !performance ||
      typeof performance !== 'object' ||
      !Array.isArray(performance.songs) ||
      performance.songs.length === 0
  )

  if (invalidPerformance) {
    throw new AppError(
      'Every surprise performance must contain a songs array',
      400
    )
  }

  return { regularSongs, surprisePerformances }
}

export const getConcerts = async (req, res) => {
  const filters = {}

  for (const field of ['country', 'tourLeg', 'setlistVersion']) {
    if (req.query[field]) {
      filters[field] = req.query[field]
    }
  }

  if (req.query.city) {
    filters.city = {
      $regex: escapeRegExp(req.query.city),
      $options: 'i'
    }
  }

  const concerts = await Concert.find(filters)
    .populate(concertPopulate)
    .sort({ showNumber: 1 })

  res.status(200).json(concerts)
}

export const getConcertById = async (req, res) => {
  const concert = await Concert.findById(req.params.id).populate(concertPopulate)

  if (!concert) {
    throw new AppError('Concert not found', 404)
  }

  res.status(200).json(concert)
}

export const createConcert = async (req, res, next) => {
  let uploadedImage = null

  try {
    if (!req.file) {
      throw new AppError('An image is required to create a concert', 400)
    }

    if (!req.body.imageAlt?.trim()) {
      throw new AppError('imageAlt is required when uploading an image', 400)
    }

    const { regularSongs, surprisePerformances } = parseConcertRelations(req.body)
    const openingActs = parseJsonField(req.body.openingActs, 'openingActs', [])

    if (!Array.isArray(openingActs)) {
      throw new AppError('openingActs must be a JSON array', 400)
    }

    await validateSongReferences(regularSongs, surprisePerformances)

    uploadedImage = await uploadImageToCloudinary(
      req.file.buffer,
      CLOUDINARY_FOLDERS.concerts
    )

    const concert = await Concert.create({
      city: req.body.city,
      country: req.body.country,
      venue: req.body.venue,
      date: req.body.date,
      tourLeg: req.body.tourLeg,
      openingActs,
      showNumber: req.body.showNumber,
      setlistVersion: req.body.setlistVersion,
      attendance: parseJsonField(req.body.attendance, 'attendance', null),
      regularSongs,
      surprisePerformances,
      image: buildImageMetadata(req.body, uploadedImage),
      sources: parseJsonField(req.body.sources, 'sources', []),
      notes: req.body.notes
    })

    await concert.populate(concertPopulate)
    res.status(201).json(concert)
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

export const updateConcert = async (req, res, next) => {
  let newUploadedImage = null
  let concert = null
  let previousImage = null

  try {
    concert = await Concert.findById(req.params.id)

    if (!concert) {
      throw new AppError('Concert not found', 404)
    }

    for (const field of editableFields) {
      if (req.body[field] !== undefined) {
        concert[field] = req.body[field]
      }
    }

    if (
      req.body.regularSongs !== undefined ||
      req.body.surprisePerformances !== undefined
    ) {
      const relations = parseConcertRelations(req.body, concert)
      await validateSongReferences(
        relations.regularSongs,
        relations.surprisePerformances
      )
      concert.regularSongs = relations.regularSongs
      concert.surprisePerformances = relations.surprisePerformances
    }

    if (req.body.sources !== undefined) {
      concert.sources = parseJsonField(req.body.sources, 'sources', [])
    }

    if (req.body.attendance !== undefined) {
      concert.attendance = parseJsonField(
        req.body.attendance,
        'attendance',
        null
      )
    }

    if (req.body.openingActs !== undefined) {
      const openingActs = parseJsonField(req.body.openingActs, 'openingActs', [])

      if (!Array.isArray(openingActs)) {
        throw new AppError('openingActs must be a JSON array', 400)
      }

      concert.openingActs = openingActs
    }

    if (req.file) {
      if (!req.body.imageAlt?.trim()) {
        throw new AppError('imageAlt is required when replacing an image', 400)
      }

      newUploadedImage = await uploadImageToCloudinary(
        req.file.buffer,
        CLOUDINARY_FOLDERS.concerts
      )
      previousImage = concert.image?.toObject() || null
      concert.image = buildImageMetadata(req.body, newUploadedImage)
    } else if (concert.image) {
      const metadataFields = {
        imageSourceUrl: 'sourceUrl',
        imageAuthor: 'author',
        imageLicense: 'license',
        imageLicenseUrl: 'licenseUrl',
        imageAlt: 'alt'
      }

      for (const [bodyField, imageField] of Object.entries(metadataFields)) {
        if (req.body[bodyField] !== undefined) {
          concert.image[imageField] = req.body[bodyField] || null
        }
      }
    }

    await concert.save()

    if (previousImage?.publicId) {
      try {
        await deleteImageFromCloudinary(previousImage.publicId)
      } catch (deletionError) {
        concert.image = previousImage
        await concert.save()

        if (newUploadedImage?.publicId) {
          await deleteImageFromCloudinary(newUploadedImage.publicId)
          newUploadedImage = null
        }

        throw deletionError
      }
    }

    newUploadedImage = null
    await concert.populate(concertPopulate)
    res.status(200).json(concert)
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

export const deleteConcert = async (req, res, next) => {
  try {
    const concert = await Concert.findById(req.params.id)

    if (!concert) {
      throw new AppError('Concert not found', 404)
    }

    if (concert.image?.publicId) {
      await deleteImageFromCloudinary(concert.image.publicId)
    }

    await concert.deleteOne()

    res.status(200).json({
      message: 'Concert and Cloudinary image deleted successfully',
      concert
    })
  } catch (error) {
    next(error)
  }
}
