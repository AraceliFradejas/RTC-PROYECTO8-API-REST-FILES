import mongoose from 'mongoose'
import AppError from '../utils/AppError.js'

export const validateObjectId = (req, res, next) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return next(new AppError('Invalid resource identifier', 400))
  }

  next()
}
