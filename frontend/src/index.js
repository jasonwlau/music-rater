import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import Leaderboard from './leaderboard.js'
import Song from './song.js'

const Button = ({handleClick, text}) => {
  return (
    <button onClick = {handleClick}>
      {text}
    </button>
  )
}

const App = () => {
  const [songs, setSongs] = useState([])
  const [isLoaded, setIsLoaded] = useState(false);
  const [newSong, setNewSong] = useState('')
  const [song1, setSong1] = useState(0)
  const [song2, setSong2] = useState(0)

  const getRandomInt = (max) => {return Math.floor(Math.random() * Math.floor(max))}

  useEffect(() => {
    fetch("http://localhost:3001/songs")
    .then(res => res.json())
    .then((result) => {
      setSongs(result)
      setIsLoaded(true)
      const n1 = getRandomInt(result.length)
      setSong1(n1)
      let n2 = getRandomInt(result.length)
      while (n2 === n1 & result.length > 2) {
        n2 = getRandomInt(result.length)
      }
      setSong2(n2)
    })
  }, [])
  
  const probability = (a, b) => {
    return 1/(1+Math.pow(10, (a-b)/400))
  }

  const updateElo = (a, b) => {
    const s1 = songs[a]
    const s2 = songs[b]
    const a_old = s1.rating
    const b_old = s2.rating
    const a_new = a_old + 20 * (1-probability(b_old, a_old))
    const b_new = b_old + 20 * (0-probability(a_old, b_old))
    const url1 = `http://localhost:3001/songs/${s1.id}`
    const url2 = `http://localhost:3001/songs/${s2.id}`
    const updated_s1 = {...s1, rating: a_new}
    const updated_s2 = {...s2, rating: b_new}

    Promise.all([
      fetch(url1, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated_s1)
      }),
      fetch(url2, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated_s2)
      })
    ]).then(res => Promise.all(res.map(n => n.json())))
    .then(data => {
      let new_songs = songs.slice()
      new_songs[a] = data[0]
      new_songs[b] = data[1]
      setSongs(new_songs)
    })
  }

  const updateSongs = () => {
    const n1 = getRandomInt(songs.length)
    setSong1(n1)
    let n2 = getRandomInt(songs.length)
    while (n2 === n1 & songs.length > 2) {
      n2 = getRandomInt(songs.length)
    }
    setSong2(n2)
  }

  const song1_win = () => {
    updateElo(song1, song2)
    updateSongs()
  }

  const song2_win = () => {
    updateElo(song2, song1)
    updateSongs()
  }

  const addSong = (event) => {
    event.preventDefault()
    const n = newSong.indexOf('/track/')
    const songLink = newSong.substr(0, n) + '/embed' + newSong.substr(n)
    const songObject = {
      link: songLink
    }
    fetch("http://localhost:3001/songs", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(songObject)
    }).then(response => {
      console.log(response)
      setSongs(songs.concat(response.data))
      setNewSong('')
    })
  }

  const handleSongChange = (event) => {
    setNewSong(event.target.value)
  }

  const padding = {
    padding: 5
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  } else {
    return (
      <Router>
        <div>
          <Link style={padding} to="/">Home</Link>
          <Link style={padding} to="/leaderboards">Leaderboards</Link>
        </div>

        <Switch>
          <Route path="/leaderboards">
            <Leaderboard songs={songs}/>
          </Route>
          <Route path="/">
            <div>
              <h1>
                This or That
              </h1>
              <div class="container">
                <div class="fixed">
                  <h2>
                    Song 1
                  </h2>
                  <Song link={songs[song1].link}/>
                  <Button handleClick={song1_win} text='Song 1'/>
                </div>
                <div class="grow">
                  <h2>
                    Song 2
                  </h2>
                  <Song link={songs[song2].link}/>
                  <Button handleClick={song2_win} text='Song 2'/>
                </div>
              </div>
              <form onSubmit={addSong}>
                <input 
                  value={newSong}
                  onChange={handleSongChange}
                />
                <button type="submit">Add</button>
              </form>
            </div>
          </Route>
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))