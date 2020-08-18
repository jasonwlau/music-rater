const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://root:${password}@cluster0-yoykf.mongodb.net/song-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const songSchema = new mongoose.Schema({
  link: String,
  rating: Number,
  genre: String,
})

const Song = mongoose.model('Song', songSchema)

const song = new Song({
  link: 'https://open.spotify.com/embed/track/60zxdAqWtdDu0vYsbXViA7',
  rating: 1000,
  genre: 'Pop',
})

song.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})