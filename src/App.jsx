import {
    useEffect,
    useState
} from 'react'

import randomWords from 'random-words'


const App = () => {
    const nbrWords = 55

    const [ userInput, setUserInput       ] = useState( []                       )
    const [ initialWords, setInitialWords ] = useState( randomWords( nbrWords )  )
    const [ initialTimer, setInitialTimer ] = useState( 30                       )
    const [ timer, setTimer               ] = useState( initialTimer             )
    const [ start, setStart               ] = useState( false                    )
    const [ wpm, setWpm                   ] = useState( undefined                )
    const [ wordIndex, setWordIndex       ] = useState( 0                        )
    const [ letterIndex, setLetterIndex   ] = useState( 0                        )
    const [ length, setLength             ] = useState( initialWords[ 0 ].length )
    const [ counter, setCounter           ] = useState( 0                        )
    const [ fullCounter, setFullCounter   ] = useState( 0                        )

    const allowedKey = [
        8,
        9,
        32,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57,
        65,
        66,
        67,
        68,
        69,
        70,
        71,
        72,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        82,
        83,
        84,
        85,
        86,
        87,
        88,
        89,
        90,
        186,
        187,
        188,
        189,
        219,
        220,
        221,
        222
    ]

    const timerButtons = [
        15,
        30,
        45,
        60
    ]


    const restart = () => {
        setInitialWords( randomWords( nbrWords )  )
        setInitialTimer( initialTimer             )
        setUserInput   ( []                       )
        setStart       ( false                    )
        setTimer       ( initialTimer             )
        setWpm         ( undefined                )
        setLength      ( initialWords[ 0 ].length )
        setWordIndex   ( 0                        )
        setLetterIndex ( 0                        )
        setCounter     ( 0                        )
        setFullCounter ( 0                        )
    }

    const handleUserInput = ( event ) => {
        if( allowedKey.includes( event.which ) ) {
            if( event.which === 8 ) {
                if( letterIndex === 0 ) return

                else {
                    const newTab = [ ...userInput ]

                    newTab.splice ( userInput.length - 1, 1    )
                    setUserInput  ( [ ...newTab ]              )
                    setLetterIndex( prevState => prevState - 1 )
                    setCounter    ( counter - 1                )
                    setFullCounter( fullCounter - 1            )
                }
            }

            else if( event.which === 9 ) {
                event.preventDefault()
                restart()
            }

            else {
                setStart      ( true            )
                setCounter    ( counter + 1     )
                setFullCounter( fullCounter + 1 )
                setLetterIndex( letterIndex + 1 )

                if( counter > 135 ) {
                    setCounter     ( 0                                                  )
                    setInitialWords( [ ...initialWords, randomWords( 20 ).join( ' ' ) ] )
                }

                if( event.key === initialWords.join( ' ' ).split( '' )[ userInput.length ] ) {
                    setUserInput( [ ...userInput, {
                        letter: event.key,
                        valid : true,
                        key   : wordIndex.toString() + letterIndex.toString()
                    } ] )
                }

                else{
                    setUserInput( [ ...userInput, {
                        letter: event.key,
                        valid : false,
                        key   : wordIndex.toString() + letterIndex.toString()
                    } ] )
                }

                if( letterIndex === length ) {
                    setLetterIndex( 0             )
                    setWordIndex  ( wordIndex + 1 )
                }
            }
        }
        else return
    }


    useEffect( () => {
        document.addEventListener( 'keydown', handleUserInput )
        return () => document.removeEventListener( 'keydown', handleUserInput )
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

    useEffect( () => {
        const myLength = initialWords[ wordIndex ].length
        setLength( myLength )
    }, [ wordIndex ] )


    return(
        <>
        { !wpm
            ? <div
                style={ {
                    padding  : '50px',
                    textAlign: 'center',
                    position : 'relative'
                } }
            >
                { initialWords.map( ( el, i ) => {
                    return(
                        <span
                            key={ i }
                            style={ {
                                whiteSpace: 'nowrap',
                                display   : 'inline-block'
                            } }
                        >
                            { el.split( '' ).concat( ' ' ).map( ( letter, j ) => {
                                return(
                                    <span
                                        key={ j }
                                        style={{
                                            display : 'inline-block',
                                            fontSize: '22px',
                                            position: 'relative',
                                            color   : !userInput.find( el => el.key === ( i.toString() + j.toString() ) )
                                                ? 'gray'
                                                : userInput.find( el => el.key === ( i.toString() + j.toString() ) ) &&
                                                userInput.find( el => el.key === ( i.toString() + j.toString() ) ).valid
                                                    ? 'green'
                                                    : 'red'
                                        }}
                                    >
                                        { letter === ' ' ? '\u00a0' : letter }
                                        <div
                                            style={{
                                                position       : 'absolute',
                                                height         : '100%',
                                                width          : '1px',
                                                backgroundColor: 'blue',
                                                top            : '0',
                                                right          : '0',
                                                display        :
                                                    userInput.find(
                                                        el => el.key === ( i.toString() + j.toString()
                                                    ) ) &&
                                                    userInput.find(
                                                        el => el.key === ( i.toString() + j.toString()
                                                    ) ).key === userInput[ fullCounter - 1 ].key
                                                        ? 'block'
                                                        : 'none'
                                            }}
                                        >
                                        </div>
                                    </span>
                                )
                            } ) }
                        </span>
                    )
                } ) }
                <p>
                    { timer }
                </p>
                { timerButtons.map( ( el, index ) => (
                    <button
                        onClick={ () => setInitialTimer( el ) }
                        key    ={ index                       }
                    >
                        { el }
                    </button>
                ) ) }
                <button onClick={ () => restart() }>
                    Restart
                </button>
            </div>
            : <div>
                { wpm }
            </div>
        }
        </>
    )
}

export default App
