import {
    useEffect,
    useState
} from 'react'

import randomWords from 'random-words'


const App = () => {
    const nbrWords = 100

    const [ userInput, setUserInput       ] = useState( []                                              )
    const [ words, setWords               ] = useState( randomWords( nbrWords ).join( ' ' ).split( '' ) )
    const [ initialTimer, setInitialTimer ] = useState( 30                                              )
    const [ timer, setTimer               ] = useState( initialTimer                                    )
    const [ start, setStart               ] = useState( false                                           )
    const [ wpm, setWpm                   ] = useState( undefined                                       )

    const allowedKey = [ 8, 9, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 186, 187, 188, 189, 219, 220, 221, 222 ]
    const timerButtons = [
        15,
        30,
        45,
        60
    ]


    const handleUserInput = ( event ) => {
        if( allowedKey.includes( event.which ) ) {
            if( event.which === 8 ) {
                const newTab = [ ...userInput ]
                newTab.splice( userInput.length - 1, 1 )
                setUserInput( [ ...newTab ] )
            }
            else if( event.which === 9 ) {
                event.preventDefault()
                setWords( randomWords( nbrWords ).join( ' ' ).split( '' ) )
                setUserInput( [] )
                setStart( false )
                setInitialTimer( 10 )
                setTimer( initialTimer )
                setWpm( undefined )
            }
            else {
                setStart( true )
                if( event.key === words[ userInput.length ] ) {
                    setUserInput( [ ...userInput, {
                        letter: event.key,
                        valid: true
                    } ] )
                }
                else{
                    setUserInput( [ ...userInput, {
                        letter: event.key,
                        valid: false
                    } ] )
                }
            }
        }
        else return
    }


    useEffect( () => {
        document.addEventListener( 'keydown', handleUserInput )
        return () => { document.removeEventListener( 'keydown', handleUserInput ) }
    }, [ userInput ] )

    useEffect( () => {
        if( !start || !timer ) return

        const interval = setInterval( () => {
            setTimer( timer - 1 )
        }, 1000 )

        return () => clearInterval( interval )
    }, [ start, timer ] )

    useEffect( () => {
        if( timer === 0 ) {
            const filtered = userInput.filter( el => el.letter.trim() && el.valid )
            setWpm( ( filtered.length / 4 ) * ( 60 / initialTimer ) )
        }
    }, [ timer ] )

    useEffect( () => {
        setTimer( initialTimer )
    }, [ initialTimer ] )


    return(
        <div style={{ padding: '50px' }}>
            { words.map( ( el, index ) => {
                return(
                    <span
                        key={ index }
                        style={{
                            color: !userInput[ index ]
                                ? 'gray'
                                : userInput[ index ] && userInput[ index ].valid
                                    ? 'green'
                                    : 'red',
                            display: 'inline-block',
                            fontSize: '22px'
                        }}
                    >
                        { el === ' ' ? '\u00a0' : el }
                    </span>
                )
            } ) }
            <p>
                { timer }
                { wpm && wpm }
            </p>
            { timerButtons.map( ( el, index ) => <button
                onClick={ () => setInitialTimer( el ) }
                key={ index }
            >
                { el }
            </button> ) }
        </div>
    )
}

export default App

// Split letter into words to break at end of width
// Add cursor to help vizualise where we are in the application
// Add only more words if needed
// Do style app
