import mongoose from 'mongoose'
import { imageSchema, sourceSchema } from './schemas/sharedSchemas.js'

const surprisePerformanceSchema = new mongoose.Schema(
  {
    order: {
      type: Number,
      required: true,
      min: 1
    },
    instrument: {
      type: String,
      required: true,
      enum: ['guitar', 'piano']
    },
    songs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Song'
        }
      ],
      required: true,
      validate: {
        validator: (songs) => songs.length > 0,
        message: 'A surprise performance must contain at least one song'
      }
    },
    guests: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      trim: true,
      default: null
    }
  },
  { _id: false }
)

const concertSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      unique: true
    },
    tourLeg: {
      type: String,
      required: true,
      trim: true
    },
    openingActs: {
      type: [String],
      default: []
    },
    showNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 149
    },
    setlistVersion: {
      type: String,
      required: true,
      enum: ['pre-ttpd', 'post-ttpd']
    },
    regularSongs: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Song'
        }
      ],
      required: true,
      validate: {
        validator: (songs) => songs.length > 0,
        message: 'A concert must contain at least one regular song'
      }
    },
    surprisePerformances: {
      type: [surprisePerformanceSchema],
      default: []
    },
    image: {
      type: imageSchema,
      default: null
    },
    sources: {
      type: [sourceSchema],
      default: []
    },
    notes: {
      type: String,
      trim: true,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Concert = mongoose.model('Concert', concertSchema)

export default Concert
