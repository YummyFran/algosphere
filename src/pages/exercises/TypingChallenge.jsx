import React, { useCallback, useEffect, useRef, useState } from 'react'
import { VscDebugRestart } from "react-icons/vsc";
import { faker } from '@faker-js/faker';
import { useTheme } from '../../provider/ThemeProvider'
import Turtle from '../../assets/turtle.svg'
import Walker from '../../assets/walker.svg'
import Sprinter from '../../assets/sprinter.svg'
import Master from '../../assets/master.svg'
import '../../styles/typingchallenge.css'

const NUMBER_OF_WORDS = 100
const COUNTDOWN_TIME = 60

const formatSeconds = seconds => {
    const minutes = Math.floor(seconds / 60)
    const sec = seconds % 60
    
    return `${minutes}:${sec.toString().padStart(2, '0')}`
}

const generateResultData = (wpm, accuracy, totalCharsTyped, correctCharsCount, mistypedCharsCount) => {
    const format = {
        slow: {
            illustration: Turtle,
            title: "You're a Turtle",
            description: `Well... You type with the speed of ${wpm} WPM. Your accuracy was ${accuracy}%. It could be better! Practice regularly to pick up the pace and surprise yourself with progress.`,
            wpm_range: [0, 20],
            accuracy_range: [0, 100]
        },
        moderate: {
            illustration: Walker,
            title: "Casual Walker",
            description: `You type at ${wpm} WPM, comfortably walking along. Your accuracy of ${accuracy}% shows potential! Just keep at it and you'll be sprinting in no time.`,
            wpm_range: [21, 40],
            accuracy_range: [90, 100]
        },
        fast: {
            illustration: Sprinter,
            title: "Sprinter",
            description: `At ${wpm} WPM, you're sprinting ahead! With an accuracy of ${accuracy}%, you're nearly unstoppable. Push for the next milestone to reach elite speed!`,
            wpm_range: [41, 60],
            accuracy_range: [95, 100]
        },
        master: {
            illustration: Master,
            title: "Typing Master",
            description: `Incredible! You type at a blazing ${wpm} WPM with ${accuracy}% accuracy. You're a keyboard ninja. Keep up the amazing work!`,
            wpm_range: [61, 100],
            accuracy_range: [98, 100]
        }
    }

    for (let category in format) {
        const { wpm_range, accuracy_range, title, description, illustration } = format[category]
        if (wpm >= wpm_range[0] && wpm <= wpm_range[1] && accuracy >= accuracy_range[0] && accuracy <= accuracy_range[1]) {
            return {title, description, totalCharsTyped, correctCharsCount, mistypedCharsCount, wpm, accuracy, illustration}
        }
    }

    return {
        title: "Keep Going!",
        description: `Your speed was ${wpm} WPM with an accuracy of ${accuracy}%. You're on the right track! Keep practicing to improve further.`,
        totalCharsTyped,
        correctCharsCount,
        mistypedCharsCount,
        wpm,
        accuracy
    }
}


const TypingChallenge = () => {
    const [words, setWords] = useState('')
    const [userTyped, setUserTyped] = useState('')
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TIME)
    const [results, setResults] = useState({})
    const [theme] = useTheme()

    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 })
    const wordsRef = useRef(null)
    const intervalRef = useRef(null)
    const secondLine = useRef(0)

    const hasTimerEnded = timeLeft <= 0;
    const isRunning = intervalRef.current != null;
    const hasTyped = userTyped.length > 0

    console.log(results)

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
        console.log("scroll");
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
        
                setCaretPos(prev => {
                    if(prev.top !== 0 && prev.top != offsetTop) {
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
            <h4 className="sub">AlgoSphere's</h4>
            <h2 className="title">Typing Challenge</h2>
        </div>
        <div className="options">
            <div className="timer">
                {formatSeconds(timeLeft)}
            </div>
        </div>
        {!hasTimerEnded ? <div className={`typing-area mono-${theme}`} ref={wordsRef}>
            <div className="caret" style={{ top: `${caretPos.top}px`, left: `${caretPos.left}px` }}></div>
            {words.split('').map((char, i) => {
                let className = ''
                let content = char
                if (i < userTyped.length) {
                  className = userTyped[i] === char ? 'correct' : 'incorrect'
                  content = char === ' ' && userTyped[i] !== char ? userTyped[i] : char
                }

                return <span key={i} className={`char ${className}`}>{content}</span>
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
            <VscDebugRestart onClick={restart}/>
        </div>
    </div>
  )
}

export default TypingChallenge