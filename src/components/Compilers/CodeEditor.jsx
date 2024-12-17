import React, { useEffect, useState } from 'react'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { useTheme } from '../../provider/ThemeProvider'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { php } from '@codemirror/lang-php'
import { csharp } from '@replit/codemirror-lang-csharp'

const CodeEditor = ({codebit, code, setCode}) => {
  const [theme] = useTheme()
  const [extension, setExtension] = useState()

  useEffect(() => {
    switch(codebit.language.toLowerCase()) {
      case 'javascript':
        setExtension([javascript({jsx: true})])
        break
      case 'python':
        setExtension([python()])
      case 'java':
        setExtension([java()])
      case 'php':
        setExtension([php()])
      case 'c#':
        setExtension([csharp()])
    }
  }, [])

  return (
    <div className='code-editor'>
      <CodeMirror
          className={`code primary-${theme}-bg ${theme}`}
          value={code}
          extensions={extension}
          theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
          onChange={val => setCode(val)}
      />
    </div>
  )
}

export default CodeEditor