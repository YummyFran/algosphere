import React, { useEffect, useRef, useState } from 'react'
import Split from 'react-split'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { useTheme } from '../provider/ThemeProvider'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { html } from '@codemirror/lang-html'
import '../styles/duel.css'
import { redirect, useNavigate, useParams } from 'react-router'
import { compareImages, generateIframeCode } from '../utils/helper'
import { duels, starter } from '../data/duels/duelMapper'
import { GrNext, GrPrevious } from "react-icons/gr";
import html2canvas from 'html2canvas'
import { useToast } from '../provider/ToastProvider'

const Duel = () => {
  const [cssCode, setCssCode] = useState()
  const [duel, setDuel] = useState()
  const [userOutputImg, setUserOutputImg] = useState()
  const [stats, setStats] = useState({ score: 0, accuracy: 0})
  const [theme] = useTheme()
  const [addToast] = useToast()
  const [isShiftPressed, setIsShiftPressed] = useState(false); 
  const { duelSlug } = useParams()
  const nav = useNavigate()
  const outputRef = useRef()
  const areaRef = useRef()
  const overlayRef = useRef()
  const outputContainerRef = useRef()
  const sliderRef = useRef()

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    addToast("Success", "Linked Copied", "success")
  }

  const codeOutputToImage = async () => {
    const outputDoc = outputRef.current.contentDocument || outputRef.current.contentWindow.document
     
    if(!outputDoc) return

    try {
      console.log(outputDoc.defaultView.innerWidth)

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

    setStats(prev => ({...prev, accuracy: (accuracy * 100).toFixed(2), score: (score * 10).toFixed(2)}))
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
    
    setDuel(duels[duelSlug - 1])
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
      console.log("hello")
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
  }, duelSlug)

  if(isNaN(duelSlug) || duelSlug <= 0 || duelSlug > duels?.length) return "Invalid duel"
  if(!duel) return "Loading..."

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
            disabled={duel.id >= duels.length}
            onClick={() => nav(`/exercises/css-duel/${duel.id + 1}`)}
          >
            <GrNext />
          </button>
        </div>
      </nav>
      <Split className={`split primary-${theme}-bg`} gutterSize={15}>
        <div className="code-area">
          <CodeMirror 
            className={`code primary-${theme}-bg`}
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