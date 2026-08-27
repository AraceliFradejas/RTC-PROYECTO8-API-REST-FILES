import mongoose from 'mongoose'
import { imageSchema, sourceSchema } from './schemas/sharedSchemas.js'

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    artist: {
      type: String,
      required: true,
      trim: true,
      default: 'Taylor Swift'
    },
    album: {
      type: String,
      required: true,
      trim: true
    },
    era: {
      type: String,
      required: true,
      trim: true
    },
    releaseYear: {
      type: Number,
      required: true,
      min: 2006,
      max: new Date().getFullYear()
    },
    spotifyUrl: {
      type: String,
      trim: true,
      default: null
    },
    appleMusicUrl: {
      type: String,
      trim: true,
      default: null
    },
    amazonMusicUrl: {
      type: String,
      trim: true,
      default: null
    },
    image: {
      type: imageSchema,
      default: null
    },
    sources: {
      type: [sourceSchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Song = mongoose.model('Song', songSchema)

export default Song
