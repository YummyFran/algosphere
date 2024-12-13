import React, { useCallback, useEffect, useRef, useState } from 'react'
import { problemMapper, allTags } from '../../data/problems/problemMapper'
import { useTheme } from '../../provider/ThemeProvider'
import { useNavigate } from 'react-router'
import { generateRandomNumber } from '../../utils/helper'
import { formatCodeStringToJSX } from '../../utils/helper'
import '../../styles/codebreaker.css'
import Problem from '../../components/Problem'


const CodeBreaker = () => {
  const [prevChallenge, setPrevChallenge] = useState({})
  const [suggestedChallenge, setSuggestedChallenge] = useState({})
  const [allProblems, setAllProblems] = useState([])
  const [problemOrders, setProblemOrders] = useState({status: 'normal', title: 'normal', rank: 'normal'})
  const [languageValue, setLanguageValue] = useState("JavaScript")
  const [tagValue, setTagValue] = useState("Random")
  const [theme] = useTheme()
  const nav = useNavigate()
  const optionsRef = useRef(null)
  const suggestedRef = useRef(null)

  const generateRandomProblem = useCallback(() => {
    const problems = Object.values(problemMapper).filter(({tags}) => tagValue === "Random" ? true : tags.includes(tagValue))
    const randomIndex = generateRandomNumber(0, problems.length - 1)
    setSuggestedChallenge(problems[randomIndex])
    return problems[randomIndex]
  }, [tagValue])

  const handleSkip = () => {
    let rand;
    do {
      rand = generateRandomProblem()
    } while(JSON.stringify(rand) === JSON.stringify(prevChallenge))

    setPrevChallenge(rand)
  }

  const orderProblems = (orderBy, key) => {
    let sortedProblems

    setAllProblems(() => {
      switch(problemOrders[orderBy]) {
        case 'normal':
          sortedProblems = [...allProblems].sort((a,b) => key ? b[key].slug.localeCompare(a[key].slug) : a.name.localeCompare(b.name))
          setProblemOrders(prev => ({...prev, [orderBy]: 'ascending'}))
          break

        case 'ascending':
          sortedProblems = [...allProblems].sort((a,b) => key ? a[key].slug.localeCompare(b[key].slug) : b.name.localeCompare(a.name))
          setProblemOrders(prev => ({...prev, [orderBy]: 'descending'}))
          break

        default:
          sortedProblems = Object.values(problemMapper)
          setProblemOrders(prev => ({...prev, [orderBy]: 'normal'}))
          break;
      }

      return sortedProblems
    })
  }

  useEffect(() => {
    generateRandomProblem()
  }, [tagValue, generateRandomProblem])
  
  useEffect(() => {
    setAllProblems(Object.values(problemMapper))
  }, [problemMapper])

  useEffect(() => {
    const origHeight = getComputedStyle(suggestedRef.current).height
    const resize = () => {
      const media = window.matchMedia('(max-width: 35em)')

      if(media.matches) {
        return
      } 

      const ht = optionsRef.current.offsetHeight
      suggestedRef.current.style.height = `${ht}px`
    }
    
    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [suggestedChallenge])

  return (
    <div className={`code-breaker primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h4 className="sub" onClick={() => nav('/exercises')}>AlgoSphere's</h4>
        <h2 className="title">Code Breaker</h2>
      </div>
      <div className="suggested" style={{background: `${suggestedChallenge?.rank?.color}5f`}} ref={suggestedRef}>
        <div className={`options`} style={{background: `${suggestedChallenge?.rank?.color}`}} ref={optionsRef}>
          <p className="title">Suggested Challenge</p>
          <div className="dropdowns midtone-dark">
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
            <button className="skip" onClick={handleSkip}>Skip</button>
          </div>
        </div>
        <div className="problem">
          <div className="title">
            <div className="rank" style={{color: `${suggestedChallenge?.rank?.color}`}}>{suggestedChallenge?.rank?.name}</div>
            <div className="name">{suggestedChallenge?.name}</div>
          </div>
          <div className="statement">{formatCodeStringToJSX(suggestedChallenge?.problemStatement, theme)}</div>
          <div className="tags">{suggestedChallenge?.tags?.map((tag, i) => <span className={`tag secondary-${theme}-bg`} key={i}>{tag}</span>)}</div>
        </div>
      </div>
      <div className="problems">
        <div className="title">Problems</div>
        <table>
          <thead className={`mono-${theme}-border`}>
            <tr>
              <th>Status</th>
              <th onClick={() => orderProblems("title")}>Title</th>
              <th className='rank' onClick={() => orderProblems("rank", "rank")}>Rank</th>
            </tr>
          </thead>
          <tbody>
            {allProblems.map((problem, i) => {
              return <Problem problem={problem} key={i}/>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CodeBreaker