import AppError from './AppError.js'

export const parseJsonField = (value, fieldName, fallback) => {
  if (value === undefined) {
    return fallback
  }

  if (typeof value !== 'string') {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    throw new AppError(`${fieldName} must contain valid JSON`, 400)
  }
}

export const buildImageMetadata = (body, uploadedImage) => ({
  ...uploadedImage,
  sourceUrl: body.imageSourceUrl || null,
  author: body.imageAuthor || null,
  license: body.imageLicense || null,
  licenseUrl: body.imageLicenseUrl || null,
  alt: body.imageAlt
})
