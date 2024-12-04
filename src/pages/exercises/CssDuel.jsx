import React from 'react'
import { duels } from '../../data/duels/duelMapper'
import { useNavigate } from 'react-router'
import '../../styles/cssduel.css'
import { useTheme } from '../../provider/ThemeProvider'
import { Link } from 'react-router-dom'

const CssDuel = () => {
  const [theme] = useTheme()
  const nav = useNavigate()
  return (
    <div className={`css-duel primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h4 className="sub" onClick={() => nav('/exercises')}>AlgoSphere's</h4>
        <h2 className="title">CSS Duel</h2>
      </div>
      <div className="duels">
        {duels.flat().map((duel, index) => {
          return (
            <Link to={`${duel.id}`} className={`duel-container ${theme}-shadow midtone-${theme}`} key={index}>
              <img src={duel.img} alt={duel.title} />
              <div className="detail">
                <div className="text">
                  {duel.id}. {duel.title}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CssDuel