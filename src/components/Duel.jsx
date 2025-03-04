import React, { useEffect, useRef, useState } from 'react'
import Split from 'react-split'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { useTheme } from '../provider/ThemeProvider'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { html } from '@codemirror/lang-html'
import '../styles/duel.css'
import { redirect, useLocation, useNavigate, useParams } from 'react-router'
import { compareImages, generateIframeCode } from '../utils/helper'
import { duels, starter } from '../data/duels/duelMapper'
import { GrNext, GrPrevious } from "react-icons/gr";
import html2canvas from 'html2canvas'
import { useToast } from '../provider/ToastProvider'
import { getUserDuelData, submitDuel } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Loading from './Loading'

const Duel = () => {
  const [cssCode, setCssCode] = useState()
  const [duel, setDuel] = useState()
  const [userOutputImg, setUserOutputImg] = useState()
  const [stats, setStats] = useState({ score: 0, accuracy: 0})
  const [onMobile, setOnMobile] = useState()
  const [theme] = useTheme()
  const [addToast] = useToast()
  const [user] = useUser()
  const [isShiftPressed, setIsShiftPressed] = useState(false); 
  const { duelSlug } = useParams()
  const location = useLocation()
  const nav = useNavigate()
  const outputRef = useRef()
  const areaRef = useRef()
  const overlayRef = useRef()
  const outputContainerRef = useRef()
  const sliderRef = useRef()
  const queryClient = useQueryClient()

  const {data: userDuelData, isLoading: isUserDuelDataLoading} = useQuery({
    queryKey: ['user-duel-data', duelSlug],
    queryFn: async () => await getUserDuelData(`duel-${duelSlug}`, user.uid)
  }) 

  const {mutate: mutateDuel} = useMutation({
    mutationFn: async ([accuracy, score]) => await submitDuel(`duel-${duelSlug}`, user.uid, {
      code: cssCode,
      accuracy: accuracy,
      score: score
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-duel-data', duelSlug])
      addToast("Code Evaluated", "Stats are recorded to our database")
    }
  })

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    addToast("Success", "Linked Copied", "success")
  }

  const codeOutputToImage = async () => {
    const outputDoc = outputRef.current.contentDocument || outputRef.current.contentWindow.document
     
    if(!outputDoc) return

    try {   

      const originalStyle = outputDoc.body.getAttribute('style');
      outputDoc.body.style.cssText = 'width: 400px; height: 300px; margin: 0; overflow: hidden; transform: scale(1);';
      
      const canvas = await html2canvas(outputDoc.body, {
        width: 400,
        height: 300,
        scale: 1,
        useCORS: true
      })

      if (originalStyle) {
        outputDoc.body.setAttribute('style', originalStyle);
      } else {
        outputDoc.body.removeAttribute('style');
      }
  
      const croppedImageData = canvas.toDataURL('image/png');
  
      setUserOutputImg(croppedImageData)

      calculateScore(croppedImageData)
    } catch(err) {
      console.log(err)
    }
  }

  const calculateScore =  async (imageData) => { 
    const accuracy = await compareImages(imageData, duel.img)
    const score =  Math.pow(accuracy, 5) * (5000 / cssCode.length);

    const fixAccuracy = (accuracy * 100).toFixed(2)
    const fixScore = (score * 10).toFixed(2)

    mutateDuel([fixAccuracy, fixScore])

    setStats(prev => ({...prev, accuracy: fixAccuracy, score: fixScore}))
  }

  useEffect(() => {
    setCssCode(starter)
  }, [starter])

  useEffect(() => {
    if(!outputRef.current) return

    const outputDoc = outputRef.current.contentDocument || outputRef.current.contentWindow.document

    outputDoc.open()
    outputDoc.write(generateIframeCode(cssCode))
    outputDoc.close()

  }, [cssCode, outputRef])

  useEffect(() => {
    if(!duelSlug) return
    
    setDuel(duels.flat()[duelSlug - 1])
  }, [duelSlug, duels])

  useEffect(() => {
    if (!outputContainerRef.current) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };

    const handleCompare = (e) => {
      overlayRef.current.style.display = "block";
      sliderRef.current.style.display = "block";

      const { left, top, width, height } = outputContainerRef.current.getBoundingClientRect();
      const { clientX, clientY } = e;

      if (isShiftPressed) {
        sliderRef.current.style.top = `${clientY - top}px`;
        sliderRef.current.style.left = '0';
        sliderRef.current.style.width = '100%';
        sliderRef.current.style.height = '2px';
        overlayRef.current.style.clipPath = `inset(${clientY - top}px 0 0 0)`;
      } else {
        sliderRef.current.style.left = `${clientX - left}px`;
        sliderRef.current.style.top = '0';
        sliderRef.current.style.width = '2px';
        sliderRef.current.style.height = '100%';
        overlayRef.current.style.clipPath = `inset(0 0 0 ${clientX - left}px)`;
      }
    };

    const handleCompareLeave = () => {
      overlayRef.current.style.display = "none";
      sliderRef.current.style.display = "none";
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    outputContainerRef.current.addEventListener('mousemove', handleCompare);
    outputContainerRef.current.addEventListener('mouseleave', handleCompareLeave);

    return () => {
      if(!outputContainerRef.current) return

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      outputContainerRef.current.removeEventListener('mousemove', handleCompare);
      outputContainerRef.current.removeEventListener('mouseleave', handleCompareLeave);
    };
  }, [isShiftPressed, outputContainerRef.current, overlayRef.current, sliderRef.current]);

  useEffect(() => {
    setCssCode(starter)
    setStats({ score: 0, accuracy: 0})
  }, [location.pathname])

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

  useEffect(() => {
    if(!userDuelData) return
    console.log('fetching', duelSlug, userDuelData)

    setCssCode(userDuelData?.code)
    setStats({ score: userDuelData.score, accuracy: userDuelData.accuracy})
  }, [userDuelData])

  if(isNaN(duelSlug) || duelSlug <= 0 || duelSlug > duels.flat().length) return "Invalid duel"
  if(!duel) return <Loading />

  return (
    <div className={`duel primary-${theme}-bg midtone-${theme}`}>
      <nav>
        <div className="back" onClick={() => nav('/exercises/css-duel')}>CSS Duel</div>
        <div className="title">
          <button 
            className={`prev btn secondary-${theme}-bg midtone-${theme}`} 
            disabled={duel.id <= 1}
            onClick={() => nav(`/exercises/css-duel/${duel.id - 1}`)}
          >
            <GrPrevious />
          </button>
          {duel.title}
          <button 
            className={`prev btn secondary-${theme}-bg midtone-${theme}`} 
            disabled={duel.id >= duels.flat().length}
            onClick={() => nav(`/exercises/css-duel/${duel.id + 1}`)}
          >
            <GrNext />
          </button>
        </div>
      </nav>
      <Split className={`split primary-${theme}-bg`} direction={onMobile ? 'vertical' : 'horizontal'} gutterSize={15}>
        <div className="code-area">
          <CodeMirror 
            className={`code primary-${theme}-bg ${theme}`}
            value={cssCode}
            extensions={[html({selfClosingTags: true}), EditorView.lineWrapping]}
            theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
            onChange={val => setCssCode(val)}
          />
        </div>
        <div className="output-area" ref={areaRef}>
          <div className="data">
            <div className="output-container" ref={outputContainerRef}>
              <img src={duel.img} ref={overlayRef}/>
              <iframe className='output' ref={outputRef}></iframe>
              <div className="slider" ref={sliderRef}></div>
            </div>
            <div className={`separator mono-${theme}-border`}>
              Stats
            </div>
            <div className="stats">
              <div className={`score mono-${theme}-border`}>
                <div className="metric">{stats.score > 0 ? stats.score : '-'}</div>
                <div className="label">Score</div>
              </div>
              <div className={`accuracy mono-${theme}-border`}>
                <div className="metric">{stats.accuracy > 0 ? stats.accuracy : '-'}</div>
                <div className="label">Accuracy</div>
              </div>
            </div>
            <button className={`submit secondary-${theme}-bg midtone-${theme}`} onClick={codeOutputToImage}>Submit</button>
          </div>
          <div className="reference">
            <img src={duel.img} />
            <div className={`separator mono-${theme}-border`}>
              Colors
            </div>
            <div className="colors">
              {duel.colors.map((color, index) => {
                return <div className={`color secondary-${theme}-bg`} key={index} onClick={() => handleCopy(color)}>
                  <div className="circle" style={{background: color}}></div>
                  <div className="name">{color}</div>
                </div>
              })}
            </div>
          </div>
        </div>
      </Split>
    </div>
  )
}

export default Duel