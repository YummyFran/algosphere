import React from 'react'
import { useTheme } from '../provider/ThemeProvider'
import '../styles/playground.css'

const PlayGround = () => {
  const [theme] = useTheme()
  return (
    <div className={`playground primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h1>Playground</h1>
      </div>
    </div>
  )
}

export default PlayGround