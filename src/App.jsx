import {
    useEffect,
    useState
} from 'react'

import randomWords from 'random-words'


const App = () => {
    const nbrWords = 70

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
    const [ viewPort, setViewPort         ] = useState( window.innerWidth        )

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
        10,
        15,
        20,
        30
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
        setViewPort    ( window.innerWidth        )
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

    const changeTimer = ( el ) => {
        if( !start ) setInitialTimer( el )
        else return false
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
            if( filtered.length === 0 ) {
                setWpm( 1 )
            }
            else setWpm( ( filtered.length / 4 ) * ( 60 / initialTimer ) )
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
            ?
                <>
                    <div
                        style={ {
                            padding  : viewPort / 4,
                            paddingBottom: '0',
                            paddingTop: '0',
                            display: 'flex',
                            alignContent: 'center',
                            flexWrap: 'wrap',
                            position : 'relative',
                            height: '100vh',
                            width: '100%'
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
                                                style={ {
                                                    display      : 'inline-block',
                                                    fontSize     : '1.6rem',
                                                    letterSpacing: '1px',
                                                    wordSpacing  : '4px',
                                                    position     : 'relative',
                                                    color        : !userInput.find( el => el.key === ( i.toString() + j.toString() ) )
                                                        ? '#585c5c'
                                                        : userInput.find( el => el.key === ( i.toString() + j.toString() ) ) &&
                                                        userInput.find( el => el.key === ( i.toString() + j.toString() ) ).valid
                                                            ? 'white'
                                                            : '#ff392b'
                                                } }
                                            >
                                                { letter === ' ' ? '\u00a0' : letter }
                                                <div
                                                    style={ {
                                                        position       : 'absolute',
                                                        height         : '80%',
                                                        width          : '3px',
                                                        borderRadius   : '4px',
                                                        backgroundColor: '#17b8bd',
                                                        top            : '50%',
                                                        transform      : 'translateY( -50% )',
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
                                                    } }
                                                    className="letter-cursor"
                                                >
                                                </div>
                                            </span>
                                        )
                                    } ) }
                                </span>
                            )
                        } ) }
                    </div>
                    <div
                        style={ {
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translateX( -50% )'
                        } }
                    >
                        <p style={ {
                            color: '#17b8bd',
                            fontSize: '24px',
                            fontWeight: '500'
                        } }>
                            { timer }
                        </p>
                    </div>
                    <button
                        onClick={ () => restart() }
                        style={ {
                            position    : 'absolute',
                            bottom      : '25%',
                            color       : '#17b8bd',
                            left        : '50%',
                            transform   : 'translateX( -50% )',
                            border      : '1px solid #17b8bd',
                            padding     : '8px 16px',
                            borderRadius: '12px'
                        } }
                    >
                        Restart
                    </button>
                    <div
                        style={ {
                            position      : 'absolute',
                            top           : '20px',
                            display       : 'flex',
                            justifyContent: 'space-between',
                            width         : '15%',
                            left          : '50%',
                            transform     : 'translateX( -50% )',
                            fontSize      : '18px',
                            color         : 'white',
                        } }
                    >
                        Select time :
                        { timerButtons.map( ( el, index ) => (
                            <button
                                onClick={ () => changeTimer( el ) }
                                key    ={ index                       }
                                style={ { color: '#17b8bd' } }
                            >
                                { el }
                            </button>
                        ) ) }
                    </div>
                    <p
                        style={ {
                            color: 'white',
                            position: 'absolute',
                            bottom: '20px',
                            left: '50%',
                            transform: 'translateX( -50% )',
                        } }
                    >
                        Press tab to restart
                    </p>
                </>
            : <div
                style={ {
                    padding       : viewPort / 4,
                    paddingBottom : '0',
                    paddingTop    : '0',
                    display       : 'flex',
                    alignContent  : 'center',
                    flexWrap      : 'wrap',
                    position      : 'relative',
                    height        : '100vh',
                    width         : '100%',
                    justifyContent: 'center'
                } }
            >
                <p
                    style={ {
                        color: '#17b8bd',
                        fontSize: '42px',
                        fontWeight: '500'
                    } }
                >
                    Your score:
                    <span
                        style={ {
                            fontSize: '62px'
                        } }
                    >
                        &nbsp;
                        { wpm }
                        &nbsp;
                    </span>
                    words per minute.
                </p>
                <p
                    style={ {
                        color: 'white',
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX( -50% )',
                    } }
                >
                    Press tab to restart
                </p>
            </div>
        }
        </>
    )
}

export default App
