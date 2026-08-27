import mongoose from 'mongoose'

export const imageSchema = new mongoose.Schema(
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

export const sourceSchema = new mongoose.Schema(
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
