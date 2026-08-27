import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true
    },
    publicId: {
      type: String,
      required: true,
      trim: true
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: null
    },
    author: {
      type: String,
      trim: true,
      default: null
    },
    license: {
      type: String,
      trim: true,
      default: null
    },
    licenseUrl: {
      type: String,
      trim: true,
      default: null
    },
    alt: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
)

const sourceSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    accessedAt: {
      type: Date,
      required: true
    }
  },
  { _id: false }
)

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
