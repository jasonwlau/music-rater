const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { response } = require('express')
const url =
  `mongodb+srv://root:jasonwj305@cluster0-yoykf.mongodb.net/song-app?retryWrites=true&w=majority`

mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const songSchema = new mongoose.Schema({
  link: String,
  rating: Number,
  genre: String,
})

const Song = mongoose.model('Song', songSchema)

songSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1></h1>')
})

app.get('/songs', (req, res) => {
  Song.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/songs/:id', (req, res) => {
  Song.findById(req.params.id).then(song => {
    if (song) {
      res.json(song)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

app.put('/songs/:id', (req, res, next) => {
  const body = req.body
  const song = {
    rating: body.rating
  }
  Song.findByIdAndUpdate(req.params.id, song, {new: true})
    .then(updatedNote => {
      res.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

app.post('/songs', (req, res) => {
  const body = req.body
  if (body.link === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const song = new Song({
    link: body.link,
    rating: 1000,
    genre: 'Pop'
  })

  song.save().then(savedSong => {
    res.json(savedSong.toJSON())
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})