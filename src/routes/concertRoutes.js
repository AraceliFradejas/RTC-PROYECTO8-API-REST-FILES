import { Router } from 'express'
import {
  createConcert,
  deleteConcert,
  getCancelledConcerts,
  getConcertById,
  getConcerts,
  updateConcert
} from '../controllers/concertController.js'
import { uploadImage } from '../middleware/uploadImage.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const concertRouter = Router()

concertRouter.get('/', getConcerts)
concertRouter.get('/history/cancellations', getCancelledConcerts)
concertRouter.get('/:id', validateObjectId, getConcertById)
concertRouter.post('/', uploadImage.single('image'), createConcert)
concertRouter.put(
  '/:id',
  validateObjectId,
  uploadImage.single('image'),
  updateConcert
)
concertRouter.delete('/:id', validateObjectId, deleteConcert)

export default concertRouter
