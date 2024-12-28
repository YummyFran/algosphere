import React from 'react'
import { BounceLoader  } from 'react-spinners'
import { useTheme } from '../provider/ThemeProvider'

const Loading = () => {
    const [theme] = useTheme()
  return (
    <div className={`loading primary-${theme}-bg`}>
        <BounceLoader  color="#76ABAE" />
    </div>
  )
}

export default Loading