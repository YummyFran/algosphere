import React from 'react'
import TypingChallenge from './exercises/TypingChallenge'
import CodeBreaker from './exercises/CodeBreaker'
import CssDuel from './exercises/CssDuel'
import QuizWhiz from './exercises/QuizWhiz'
import SqlSprint from './exercises/SqlSprint'
import ReactRace from './exercises/ReactRace'
import PythonProwess from './exercises/PythonProwess'
import DebuggingDash from './exercises/DebugginDash'
import HtmlMastery from './exercises/HtmlMastery'
import CreativeCssClash from './exercises/CreativeCssClash'
import { useParams } from 'react-router'

const components = {
    "typing-challenge": TypingChallenge,
    "code-breaker": CodeBreaker,
    "css-duel": CssDuel,
    "quiz-whiz": QuizWhiz,
    "sql-sprint": SqlSprint,
    "react-race": ReactRace,
    "python-prowess": PythonProwess,
    "debugging-dash": DebuggingDash,
    "html-mastery": HtmlMastery,
    "creative-css-clash": CreativeCssClash,
}

const ExerciseRenderer = () => {
    const { exerciseSlug } = useParams();
    const ExerciseComponent = components[exerciseSlug]

    if(!ExerciseComponent) return '404 not found'
  return <ExerciseComponent />
}

export default ExerciseRenderer