import multer from 'multer'

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

const fileFilter = (req, file, callback) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)
    )
  }

  callback(null, true)
}

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter
})
