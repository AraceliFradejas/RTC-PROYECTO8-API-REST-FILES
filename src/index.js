import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { configureCloudinary } from './config/cloudinary.js'
import { connectDatabase } from './config/database.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import concertRouter from './routes/concertRoutes.js'
import songRouter from './routes/songRoutes.js'

const app = express()
const PORT = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'The Eras Tour API REST Files is running'
  })
})

app.use('/api/songs', songRouter)
app.use('/api/concerts', concertRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const startServer = async () => {
  try {
    configureCloudinary()
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to start the server:', error.message)
    process.exit(1)
  }
}

startServer()
