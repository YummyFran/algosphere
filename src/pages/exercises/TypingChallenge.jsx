import React, { useCallback, useEffect, useRef, useState } from 'react'
import { VscDebugRestart } from "react-icons/vsc";
import { faker } from '@faker-js/faker';
import { useTheme } from '../../provider/ThemeProvider'
import '../../styles/typingchallenge.css'
import { useNavigate } from 'react-router';
import { generateResultData } from '../../utils/helper';
import { formatSeconds } from '../../utils/helper';

const NUMBER_OF_WORDS = 100
const COUNTDOWN_TIME = 60

const TypingChallenge = () => {
    const [words, setWords] = useState('')
    const [userTyped, setUserTyped] = useState('')
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME)
    const [results, setResults] = useState({})
    const [theme] = useTheme()
    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 })
    const wordsRef = useRef(null)
    const intervalRef = useRef(null)
    const inputRef = useRef(null)
    const secondLine = useRef(0)
    const initialScroll = useRef(0)
    const nav = useNavigate()

    const hasTimerEnded = timeLeft <= 0;
    const isRunning = intervalRef.current != null;
    const hasTyped = userTyped.length > 0

    const generateWords = (size) => {
        const randomWords = faker.word.words(size)
        setWords(randomWords)
    }

    const clearUserTyped = () => {
        setUserTyped('')
    }

    const restart = () => {
        generateWords(NUMBER_OF_WORDS)
        clearUserTyped()
        resetCountdown()
        resetScrollWords()
    }

    const handleKeyDown = useCallback(({key, code}) => {
        if(!(code.startsWith("Key") ||
            code.startsWith("Digit") ||
            code.startsWith("Minus") ||
            code === "Backspace" ||
            code === "Space")) return

        switch(key) {
            case 'Backspace':
                setUserTyped(prev => prev.slice(0, -1))
                break
            default:
                setUserTyped((prev) => prev.concat(key))
                break
        }
    }, [setUserTyped])

    const scrollWords = () => {
        const lineHeight = 2 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        wordsRef.current.scrollTop += lineHeight;
    };

    const resetScrollWords = () => {
        if(wordsRef.current) {
            wordsRef.current.scrollTop = 0;
            secondLine.current = null
        }
    }

    const calculateResults = () => {
        const correctCharsCount = userTyped.split('').filter((char, i) => char === words[i]).length;
        const totalCharsTyped = userTyped.length;
        const correctWordsCount = userTyped.trim().split(' ').filter((word, i) => word === words.split(' ')[i]).length;
        const wpm = Math.floor((correctWordsCount / COUNTDOWN_TIME) * 60);
        const accuracy = totalCharsTyped > 0 ? Math.floor((correctCharsCount / totalCharsTyped) * 100) : 0;
        const mistypedCharsCount = totalCharsTyped - correctCharsCount;

        const res = generateResultData(wpm, accuracy, totalCharsTyped, correctCharsCount, mistypedCharsCount)

        setResults({...res})
    }

    const startCountdown = useCallback(() => {
        if (!hasTimerEnded && !isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
            }, 1000)
        }
    }, [setTimeLeft, hasTimerEnded, isRunning])

    const resetCountdown = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimeLeft(COUNTDOWN_TIME);
    }, []);

    useEffect(() => {
        if (hasTyped && !isRunning) {
            startCountdown()
        }
    }, [hasTyped])

    useEffect(() => {
        if (hasTimerEnded) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            calculateResults()
        }
        resetScrollWords()
    }, [hasTimerEnded])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    useEffect(() => {
        if (wordsRef.current) {
            const chars = wordsRef.current.querySelectorAll('.char');
            const totalTypedLength = userTyped.length
            
            if (totalTypedLength > 0) {
                const targetChar = chars[totalTypedLength - 1]
                const { offsetTop, offsetLeft, offsetWidth } = targetChar
                
                if(!initialScroll.current) {
                    initialScroll.current = offsetTop
                }

                setCaretPos(prev => {
                    if(prev.top !== initialScroll.current && prev.top != offsetTop) {
                        if(!secondLine.current) {
                            secondLine.current = offsetTop
                        }

                        if(offsetTop != secondLine.current) {
                            scrollWords()
                        }
                    }
                    return {
                        top: offsetTop,
                        left: offsetLeft + offsetWidth,
                    }
                });
            } else {
                const firstChar = chars[0]
                if (firstChar) {
                    const { offsetTop, offsetLeft } = firstChar
                
                    setCaretPos({
                        top: offsetTop,
                        left: offsetLeft,
                    });
                }
            }
        }
    }, [userTyped])
    
    useEffect(() => {
        return () => clearInterval(intervalRef.current)
    }, [])
    
    useEffect(() => {
        generateWords(NUMBER_OF_WORDS)
        clearUserTyped()
    }, [])
    
  return (
    <div className={`typing-test primary-${theme}-bg midtone-${theme}`}>
        <div className="header">
            <h4 className="sub" onClick={() => nav(-1)}>AlgoSphere's</h4>
            <h2 className="title">Typing Challenge</h2>
        </div>
        <div className="options">
            <div className="timer">
                {formatSeconds(timeLeft)}
            </div>
        </div>
        {!hasTimerEnded ? <div className={`typing-area mono-${theme}`} ref={wordsRef}>
            <div className="caret" style={{ top: `${caretPos.top}px`, left: `${caretPos.left}px` }}></div>
            <input type="text" className='hidden' ref={inputRef} autoFocus />
            {words.split('').map((char, i) => {
                let className = ''
                let notSpace = ''
                if (i < userTyped.length) {
                    notSpace = char === ' ' && userTyped[i] !== char ? 'not-space' : ''
                    className = userTyped[i] === char ? 'correct' : 'incorrect'
                }

                return <span key={i} className={`char ${className} ${notSpace}`}>{char}</span>
            })}
        </div> :
        <div className="results">
            <div className="illustration">
                <img src={results.illustration} alt="" />
            </div>
            <div className="metrics">
                <div className="title">{results.title}</div>
                <div className="description">{results.description}</div>
                <div className="data">
                    <div className="wpm">
                        <div className="value">{results.wpm}</div>
                        <div className="label">WPM</div>
                    </div>
                    <div className="accuracy">
                        <div className="value">{results.accuracy}%</div>
                        <div className="label">Accuracy</div>
                    </div>
                    <div className="total">
                        <div className="value">{results.totalCharsTyped}</div>
                        <div className="label">Total Characters Typed</div>
                    </div>
                    <div className="correct">
                        <div className="value">{results.correctCharsCount}</div>
                        <div className="label">Correct Characters</div>
                    </div>
                    <div className="incorrect">
                        <div className="value">{results.mistypedCharsCount}</div>
                        <div className="label">Mistyped Characters</div>
                    </div>
                </div>
            </div>
        </div>
        }
        <div className="restart">
            <VscDebugRestart className={`${theme}-hover`} onClick={() => restart()}/>
        </div>
    </div>
  )
}

export default TypingChallenge