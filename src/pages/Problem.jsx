import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { problemMapper } from '../data/problems/problemMapper'
import Split from 'react-split'
import CodeMirror from '@uiw/react-codemirror'
import '../styles/problem.css'
import { useTheme } from '../provider/ThemeProvider'
import { formatCodeStringToJSX } from '../utils/helper'
import { javascript } from '@codemirror/lang-javascript'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { FaPlay } from "react-icons/fa"
import { AiOutlineCloudUpload } from "react-icons/ai"

const Problem = () => {
    const [problem, setProblem] = useState({})
    const [activeTab, setActiveTab] = useState("problem")
    const [solution, setSolution] = useState(problem?.starterCode)
    const { problemSlug } = useParams()
    const [theme] = useTheme()
    const nav = useNavigate()

    const handleSolutionChange = (code) => {
      setSolution(code)
    }

    const handleRunCode = () => {
      try {
        const callbackFunction = new Function(`return ${solution}`)()
        const success = problem.handlerFunction(callbackFunction)

        if(success) {
          alert("Yes")
        } else {
          alert("No")
        }
      } catch (err) {
        console.error(err)
        alert("no")
      }
    }

    useEffect(() => {
        setProblem(problemMapper[problemSlug])
    }, [problemSlug])

  return (
    <div className={`problem-page primary-${theme}-bg midtone-${theme}`}>
      <nav>
        <div className="back" onClick={() => nav('/exercises/code-breaker')}>Code Breaker</div>
        <div className="submission">
          <button className={`run-code secondary-${theme}-bg midtone-${theme}`} onClick={handleRunCode}>
            <FaPlay />
            Run Code
          </button>
          <button className={`submit secondary-${theme}-bg accent-color`} onClick={handleRunCode}>
            <AiOutlineCloudUpload />
            Submit
          </button>
        </div>
      </nav>
      <Split className={`split primary-${theme}-bg midtone-${theme}`} minSize={0} gutterSize={15}>
          <div className="problem-section">
            <div className="title">
              <div className="rank" style={{color: problem?.rank?.color}}>{problem?.rank?.name}</div>
              <div className="name">{problem?.name}</div>
            </div>
            <div className="tabs">
              <div className={`tab secondary-${theme}-bg ${activeTab === "problem" ? "active" : ""}`} onClick={() => setActiveTab("problem")}>Problem</div>
              <div className={`tab secondary-${theme}-bg ${activeTab === "output" ? "active" : ""}`} onClick={() => setActiveTab("output")}>Output</div>
            </div>
            <div className={`renderer secondary-${theme}-bg`}>
              {activeTab === "problem" ? 
                <div className={`problem`}>
                  <div className={`statement mono-${theme}-border`}>
                    {formatCodeStringToJSX(problem?.problemStatement, theme)}
                  </div> 
                  <div className="tags">
                    {problem?.tags?.map((tag, i) => <span className='tag' key={i}>{tag}</span>)}
                  </div>
                </div>
                :
                <div className="output">
                  // Your Results will be shown here
                </div>
              }
            </div>
          </div>
          <div className="code-section">
            <Split className={`split-v primary-${theme}-bg midtone-${theme}`} direction='vertical' sizes={[70,30]} gutterSize={15} minSize={100}>
              <div className="solution">
                <div className="options">
                  <div className={`language secondary-${theme}-bg`}>JavaScript</div>
                </div>
                <div className={`tab secondary-${theme}-bg`}>Solution</div>
                <CodeMirror 
                  className={`code-area primary-${theme}-bg`}
                  value={problem?.starterCode}
                  extensions={[javascript({jsx: true})]} 
                  theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                  onChange={handleSolutionChange}
                />
              </div>
              <div className="test-cases">
                <div className={`tab secondary-${theme}-bg`}>Test Cases</div>
                <CodeMirror 
                  className={`code-area primary-${theme}-bg`}
                  value={problem?.handlerFunction?.toString().replaceAll("__WEBPACK_IMPORTED_MODULE_0___default()", "")}
                  extensions={[javascript({jsx: true})]} 
                  theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                />
              </div>
            </Split>
          </div>
      </Split>
    </div>
  )
}

export default Problem