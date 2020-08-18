import React from 'react'

const Song = ({link}) => {
    return (
      <>
        <iframe title = "Song" src={link} width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        <br/>
      </>
    )
}

export default Song