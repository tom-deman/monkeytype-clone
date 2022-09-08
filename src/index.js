import React    from 'react'
import ReactDOM from 'react-dom/client'
import App      from './App'

import './assets/css/tailwind.css'
import './assets/sass/style.sass'

ReactDOM.createRoot( document.getElementById( 'root' ) ).render(
    <App />
)

// const myPromise = new Promise( resolve => {
//     const data = fetch( 'https://random-words-api.vercel.app/word' ).then( res => res.json() )
//     resolve( data )
// } )

// const myPromise2 = new Promise( resolve => {
//     const data = fetch( 'https://random-words-api.vercel.app/word' ).then( res => res.json() )
//     resolve( data )
// } )

// Promise.all( [ myPromise, myPromise2 ] ).then( el => console.log( el ) )
