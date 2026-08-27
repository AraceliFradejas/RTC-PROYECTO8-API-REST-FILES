import cors from 'cors'
import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 5050

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'The Eras Tour API REST Files is running'
  })
})

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
