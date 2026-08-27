import { Router } from 'express'
import {
  createSong,
  deleteSong,
  getSongById,
  getSongs,
  updateSong
} from '../controllers/songController.js'
import { uploadImage } from '../middleware/uploadImage.js'
import { validateObjectId } from '../middleware/validateObjectId.js'

const songRouter = Router()

songRouter.get('/', getSongs)
songRouter.get('/:id', validateObjectId, getSongById)
songRouter.post('/', uploadImage.single('image'), createSong)
songRouter.put('/:id', validateObjectId, uploadImage.single('image'), updateSong)
songRouter.delete('/:id', validateObjectId, deleteSong)

export default songRouter
