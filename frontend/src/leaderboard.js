import React from 'react'
import Song from './song.js'
const Leaderboard = (props) => {
    let copy = props.songs.slice()
    copy.sort((a,b) => parseFloat(a.rating)-parseFloat(b.rating))
    return (
        <ol>
            {copy.map(song =>
                <li>
                    <Song link = {song.link} />
                </li>
            )}
        </ol>
    )
}

export default Leaderboard