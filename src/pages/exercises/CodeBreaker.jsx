import React, { useCallback, useEffect, useState } from 'react'
import { problemMapper, allTags } from '../../data/problems/problemMapper'
import { useTheme } from '../../provider/ThemeProvider'
import { useNavigate } from 'react-router'
import { generateRandomNumber } from '../../utils/helper'
import { formatCodeStringToJSX } from '../../utils/helper'
import '../../styles/codebreaker.css'


const CodeBreaker = () => {
  const [prevChallenge, setPrevChallenge] = useState({})
  const [suggestedChallenge, setSuggestedChallenge] = useState({})
  const [languageValue, setLanguageValue] = useState("JavaScript")
  const [tagValue, setTagValue] = useState("Random")
  const [theme] = useTheme()
  const nav = useNavigate()

  const generateRandomProblem = useCallback(() => {
    const problems = Object.values(problemMapper).filter(({tags}) => tagValue === "Random" ? true : tags.includes(tagValue))
    const randomIndex = generateRandomNumber(0, problems.length - 1)
    setSuggestedChallenge(problems[randomIndex])
    return problems[randomIndex]
  }, [tagValue])

  useEffect(() => {
    let rand;
    do {
      rand = generateRandomProblem()
    } while(rand === prevChallenge)

    setPrevChallenge(rand)
  }, [tagValue, generateRandomProblem])

  return (
    <div className={`code-breaker primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h4 className="sub" onClick={() => nav(-1)}>AlgoSphere's</h4>
        <h2 className="title">Code Breaker</h2>
      </div>
      <div className="suggested" style={{background: `${suggestedChallenge?.rank?.color}5f`}}>
        <div className={`options`} style={{background: `${suggestedChallenge?.rank?.color}`}}>
          <p className="title">Suggested Challenge</p>
          <div className="dropdowns">
            <div className="language">
              <select name="language" id="language" value={languageValue} onChange={e => setLanguageValue(e.target.value)}>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <div className="focus">
              <select name="focus" id="focus" value={tagValue} onChange={e => setTagValue(e.target.value)}>
                <option value="Random">Random</option>
                {allTags.map((tag, i) => {
                  return <option key={i} value={tag}>{tag}</option>
                })}
              </select>
            </div>
          </div>
          <div className="buttons">
            <button className="train" onClick={() => nav(suggestedChallenge?.slug)}>Train</button>
            <button className="skip" onClick={generateRandomProblem}>Skip</button>
          </div>
        </div>
        <div className="problem">
          <div className="title">
            <div className="rank" style={{color: `${suggestedChallenge?.rank?.color}`}}>{suggestedChallenge?.rank?.name}</div>
            <div className="name">{suggestedChallenge?.name}</div>
          </div>
          <div className="statement">{formatCodeStringToJSX(suggestedChallenge?.problemStatement, theme)}</div>
          <div className="tags">{suggestedChallenge?.tags?.map((tag, i) => <span className='tag' key={i}>{tag}</span>)}</div>
        </div>
      </div>
    </div>
  )
}

export default CodeBreaker