import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { problemMapper } from '../data/problems/problemMapper'
import Split from 'react-split'
import CodeMirror from '@uiw/react-codemirror'
import '../styles/problem.css'
import { useTheme } from '../provider/ThemeProvider'
import { formatCodeStringToJSX, timeAgo } from '../utils/helper'
import { javascript } from '@codemirror/lang-javascript'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { FaPlay } from "react-icons/fa"
import { AiOutlineCloudUpload } from "react-icons/ai"
import Result from '../components/Result'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { PiSpeedometer } from "react-icons/pi";
import { getProblemData, getProblemUserData, likeProblem, submitProblem } from '../utils/firestore'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '../provider/UserProvider'
import { useToast } from '../provider/ToastProvider'

const Problem = () => {
    const [originalProblem, setOriginalProblem] = useState()
    const [problem, setProblem] = useState()
    const [activeTab, setActiveTab] = useState("problem")
    const [solution, setSolution] = useState(problem?.starterCode)
    const [testCode, setTestCode] = useState(problem?.handlerFunction?.toString().replaceAll("__WEBPACK_IMPORTED_MODULE_0___default()", ""))
    const [results, setResults] = useState()
    const [onMobile, setOnMobile] = useState(false)
    const { problemSlug } = useParams()
    const [theme] = useTheme()
    const [user] = useUser()
    const [addToast] = useToast()
    const nav = useNavigate()
    const queryClient = useQueryClient()

    const {data: problemData, isLoading: isProblemDataLoading} = useQuery({
      queryKey: ['problem', problemSlug],
      queryFn: async () => await getProblemData(problemSlug)
    })

    const {data: problemuserData} = useQuery({
      queryKey: ['problemUser', problemSlug, user?.uid],
      queryFn: async () => await getProblemUserData(problemSlug, user.uid)
    })

    const {mutate: mutateLikeProblem} = useMutation({
      mutationFn: async () => await likeProblem(problemSlug, user.uid),
      onSuccess: () => {
        queryClient.invalidateQueries(['problem', problemSlug])
      },
      onError: (err) => {
        console.log(err)
      }
    })

    const {mutate: mutateSubmitProblem} = useMutation({
      mutationFn: async (status) => await submitProblem(problemSlug, user.uid, {
        code: solution,
        status: status
      }),
      onSuccess: () => {
        queryClient.invalidateQueries(['problemUser', problemSlug, user?.uid])
      }
    })

    const handleLike = () => {
      mutateLikeProblem()
    }

    const handleSolutionChange = (code) => {
      setSolution(code)
    }

    const handleRunCode = () => {
      try {
        const blob = new Blob([problem?.handlerFunction], { type: 'application/javascript' })
        const worker = new Worker(URL.createObjectURL(blob))

        worker.postMessage(solution)

        worker.onmessage = e => {
          const res = e.data
          
          setResults(res)
        }

        setActiveTab("output")
      } catch (err) {
        console.error(err)
      }
    }

    const handleSubmitCode = () => {
      try {
        const blob = new Blob([originalProblem.handlerFunction], { type: 'application/javascript' })
        const worker = new Worker(URL.createObjectURL(blob))

        worker.postMessage(solution)

        worker.onmessage = e => {
          const res = e.data
          
          if(!Array.isArray(res)) {
            setResults(res)
            setActiveTab("output")
            return
          }

          let passed;

          for(let i = 0; i < res.length; i++) {
            if(res[i].status === "failed") {
              passed = false
              break
            }

            passed = true
          }

          if(passed) {
            setActiveTab("submissions")
            mutateSubmitProblem("accepted")
            addToast("Code Accepted!", "Congratulations for passing all the test cases")
          } else {
            setResults(res)
            setActiveTab("output")
            mutateSubmitProblem("wrong-answer")
            addToast("Code rejected", "You have to pass all test cases", "error")
          }
        }
      } catch (err) {
        console.error(err)
      }
    }

    const handleTestCaseChange = (code) => {
      if(!problem) return

      const test = code || problem?.handlerFunction?.toString().replaceAll("__WEBPACK_IMPORTED_MODULE_0___default()", "")
      const start = test.indexOf("self.onmessage")
      const end = test.lastIndexOf("}") + 1

      setTestCode(test.slice(start, end))
    }

    useEffect(() => {
        setProblem(problemMapper[problemSlug])
        setOriginalProblem(problemMapper[problemSlug])
    }, [problemSlug])

    useEffect(() => {
      handleTestCaseChange()
      setSolution(problem?.starterCode)
    }, [problem])

    useEffect(() => {
      if(!problem) return

      const test = problem?.handlerFunction?.toString().replaceAll("__WEBPACK_IMPORTED_MODULE_0___default()", "")
      const end = test.indexOf("self.onmessage")

      setProblem(prev => ({ ...prev, handlerFunction: test.slice(0, end) + testCode }))
    }, [testCode])

    useEffect(() => {
      const resize = () => {
        const media = window.matchMedia('(max-width: 35em)')

        setOnMobile(media.matches)
      }

      resize()

      window.addEventListener('resize', resize)

      return () => {
        window.removeEventListener('resize', resize)
      }
    }, [])

  return (
    <div className={`problem-page primary-${theme}-bg midtone-${theme}`}>
      <nav>
        <div className="back" onClick={() => nav('/exercises/code-breaker')}>Code Breaker</div>
        <div className="submission">
          <button className={`run-code secondary-${theme}-bg midtone-${theme}`} onClick={handleRunCode}>
            <FaPlay />
            Run Code
          </button>
          <button className={`submit secondary-${theme}-bg accent-color`} onClick={handleSubmitCode}>
            <AiOutlineCloudUpload />
            Submit
          </button>
        </div>
      </nav>
      {!onMobile && <Split className={`split primary-${theme}-bg midtone-${theme}`} minSize={0} gutterSize={15}>
          <div className="problem-section">
            <div className="title">
              <div className="rank" style={{color: problem?.rank?.color}}>{problem?.rank?.name}</div>
              <div className="name">{problem?.name}</div>
              <div className="submissions">
                <PiSpeedometer />
                {isProblemDataLoading ? "..." : `${((problemData.successSubmissions * 100 / problemData.submissions) || 0).toFixed()}% of ${problemData.submissions}`}
              </div>
              <div className={`likes ${theme}-hover`} style={{color: problemuserData?.liked && `var(--error-color)`}} onClick={handleLike}>
                {problemuserData?.liked ? <IoMdHeart /> :<IoMdHeartEmpty />}
                {isProblemDataLoading ? "..." : `${problemData.likes > 0 ? problemData.likes : 'Like'}`}
              </div>
            </div>
            <div className="tabs">
              <div className={`tab secondary-${theme}-bg ${activeTab === "problem" ? "active" : ""}`} onClick={() => setActiveTab("problem")}>Problem</div>
              <div className={`tab secondary-${theme}-bg ${activeTab === "output" ? "active" : ""}`} onClick={() => setActiveTab("output")}>Output</div>
              <div className={`tab secondary-${theme}-bg ${activeTab === "submissions" ? "active" : ""}`} onClick={() => setActiveTab("submissions")}>Submissions</div>
            </div>
            <div className={`renderer ${activeTab !== "submissions" && "secondary-" + theme + "-bg"}`}>
              {activeTab === "problem" &&
                <div className={`problem`}>
                  <div className={`statement mono-${theme}-border`}>
                    {formatCodeStringToJSX(problem?.problemStatement, theme)}
                  </div> 
                  <div className="tags">
                    {problem?.tags?.map((tag, i) => <span className='tag' key={i}>{tag}</span>)}
                  </div>
                </div>
              }
              {activeTab === "output" && (
                <div className="output">
                  {results ? (
                    Array.isArray(results) ? (
                      <>
                        <div className="metrics">
                          <span className={`${results.filter(val => val.status === "passed").length > 0 ? 'passed' : ''}`}>Passed: {results.filter(val => val.status === "passed").length}</span>
                          <span className={`${results.filter(val => val.status === "failed").length > 0 ? 'failed' : ''}`}>Failed: {results.filter(val => val.status === "failed").length}</span>
                        </div>
                        <div className={`title ${results.filter(val => val.status === "failed").length > 0 ? "failed" : "passed"}`}>Test Results</div>
                        {results.map((result, i) => {
                          return <Result key={i} result={result} index={i}/>
                        })}
                      </>
                    ) : (
                      <div className="error">
                        {results.stack.startsWith("TypeError") ? "You must return something" : results.message  }
                      </div>
                    )
                  ) : (
                    <div className="empty">Your results will be shown here</div>
                  )}
                </div>
              )}
              {activeTab === "submissions" && (
                <div className="submissions">
                  {problemuserData?.submissions?.length > 0 ? 
                    (problemuserData?.submissions?.slice().reverse().map((val, i) => {
                      return <div className={`sub`} key={i}>
                        <div className={`status ${val.status}`}>{val.status === "accepted" ? "Accepted" : "Wrong Answer"}</div>
                        <div className="timestamp">{timeAgo(val.timestamp)}</div>
                        <button className={`view-code secondary-${theme}-bg midtone-${theme}`} onClick={() => setSolution(val.code)}>View Code</button>
                      </div>
                    })) :
                    (
                      <div className="empty">No submissions yet</div>
                    )
                  }
                </div>
              )}
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
                  value={solution}
                  extensions={[javascript({jsx: true})]} 
                  theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                  onChange={handleSolutionChange}
                />
              </div>
              <div className="test-cases">
                <div className={`tab secondary-${theme}-bg`}>Test Cases</div>
                <CodeMirror 
                  className={`code-area primary-${theme}-bg`}
                  value={testCode}
                  extensions={[javascript({jsx: true})]} 
                  theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                  onChange={handleTestCaseChange}
                />
              </div>
            </Split>
          </div>
      </Split>}
      {onMobile && <>
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
              {activeTab === "problem" &&
                <div className={`problem`}>
                  <div className={`statement mono-${theme}-border`}>
                    {formatCodeStringToJSX(problem?.problemStatement, theme)}
                  </div> 
                  <div className="tags">
                    {problem?.tags?.map((tag, i) => <span className='tag' key={i}>{tag}</span>)}
                  </div>
                </div>
              }
              {activeTab === "output" && (
                <div className="output">
                  {results ? (
                    Array.isArray(results) ? (
                      <>
                        <div className="metrics">
                          <span className={`${results.filter(val => val.status === "passed").length > 0 ? 'passed' : ''}`}>Passed: {results.filter(val => val.status === "passed").length}</span>
                          <span className={`${results.filter(val => val.status === "failed").length > 0 ? 'failed' : ''}`}>Failed: {results.filter(val => val.status === "failed").length}</span>
                        </div>
                        <div className={`title ${results.filter(val => val.status === "failed").length > 0 ? "failed" : "passed"}`}>Test Results</div>
                        {results.map((result, i) => {
                          return <Result key={i} result={result} index={i}/>
                        })}
                      </>
                    ) : (
                      <div className="error">
                        {results.stack.startsWith("TypeError") ? "You must return something" : results.message  }
                      </div>
                    )
                  ) : (
                    <div className="empty">Your results will be shown here</div>
                  )}
                </div>
              )}
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
                value={testCode}
                extensions={[javascript({jsx: true})]} 
                theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                onChange={handleTestCaseChange}
              />
            </div>
          </Split>
        </div>
      </>}
    </div>
  )
}

export default Problem