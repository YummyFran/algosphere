import React from 'react'
import { IoMdPlay } from 'react-icons/io'
import { useTheme } from '../provider/ThemeProvider'
import { skillColor } from '../utils/helper'
import TypingSVG from '../assets/typing.svg'
import { Link } from 'react-router-dom'

const svgs = {
    typing: TypingSVG
}

const Exercise = ({exercise}) => {
    const [theme] = useTheme()
  return (
    <Link to={exercise.slug} className={`exercise midtone-${theme}`}>
        <div className="thumbnail" style={{backgroundImage: `linear-gradient(135deg, ${exercise.gradientColor[0]}, ${exercise.gradientColor[1]})`}}>
            {/* <img src={svgs[exercise.thumbnail]} alt={exercise.thumbnail} />  */}
        </div>
        <div className="details">
            <div className="title">
                <div className="name">{exercise.name}</div>
                <div className="category">{exercise.category}</div>
            </div>
            <div className="description">{exercise.description}</div>
            <div className="pre-requisites">
                {exercise.requiredSkills.map((skill, i) => {
                    return(
                        <div key={i} className={`skill ${skill}`} style={{color: `${skillColor[skill]}`}}>{skill}</div>
                    )
                })}
            </div>
        </div>
        <div className={`play ${theme}-hover`}>
            <IoMdPlay />
        </div>
    </Link>
  )
}

export default Exercise