import React from 'react'
import { useTheme } from '../provider/ThemeProvider'
import { Link } from 'react-router-dom'

const Problem = ({problem}) => {
    const [theme] = useTheme()
  return (
    <tr className={`secondary-${theme}-bg`}>
        <td></td>
        <td><Link to={`${problem.slug}`} className={`problem midtone-${theme}`}>{problem.name}</Link></td>
        <td style={{color: problem.rank.color}}>{problem.rank.name}</td>
    </tr>
  )
}

export default Problem