import multer from 'multer'

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
}

export const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: 'The image must not exceed 5 MB',
      LIMIT_FILE_COUNT: 'Only one image can be uploaded',
      LIMIT_UNEXPECTED_FILE:
        'The file field must be named image and use JPEG, PNG or WebP format'
    }

    return res.status(400).json({
      message: messages[error.code] || 'Invalid file upload'
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(error.errors).map((item) => item.message)
    })
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: 'A resource with the same unique value already exists',
      fields: Object.keys(error.keyPattern || {})
    })
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message
    })
  }

  console.error('Unexpected error:', error.message)

  res.status(500).json({
    message: 'Internal server error'
  })
}
