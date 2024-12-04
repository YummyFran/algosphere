import React, {useState } from 'react'
import CodeMirror, { EditorView } from '@uiw/react-codemirror'
import { useTheme } from '../../provider/ThemeProvider'
import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day'
import { html } from '@codemirror/lang-html'
import { less } from '@codemirror/lang-less'
import { javascript } from '@codemirror/lang-javascript'

const Web = ({codebit, code, setCode}) => {
    const [currentTab, setCurrentTab] = useState("html")
    const [theme] = useTheme()

  return (
    <div className={`web`}>
        <div className="tabs">
            <div className={`tab ${currentTab === "html" ? 'active': ''} secondary-${theme}-bg`} onClick={() => setCurrentTab("html")}>index.html</div>
            <div className={`tab ${currentTab === "css" ? 'active': ''} secondary-${theme}-bg`} onClick={() => setCurrentTab("css")}>styles.css</div>
            <div className={`tab ${currentTab === "js" ? 'active': ''} secondary-${theme}-bg`} onClick={() => setCurrentTab("js")}>script.js</div>
        </div>
        <div className="code-renderer">
            {currentTab === "html" &&
                <CodeMirror
                    className={`code primary-${theme}-bg`}
                    value={code.html}
                    extensions={[html({selfClosingTags: true}), EditorView.lineWrapping]}
                    theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                    onChange={val => setCode(prev => ({...prev, html: val}))}
                />
            }
            {currentTab === "css" &&
                <CodeMirror
                    className={`code primary-${theme}-bg`}
                    value={code.css}
                    extensions={[less(), EditorView.lineWrapping]}
                    theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                    onChange={val => setCode(prev => ({...prev, css: val}))}
                />
            }
            {currentTab === "js" &&
                <CodeMirror
                    className={`code primary-${theme}-bg`}
                    value={code.js}
                    extensions={[javascript(), EditorView.lineWrapping]}
                    theme={theme === "dark" ? tokyoNightStorm : tokyoNightDay}
                    onChange={val => setCode(prev => ({...prev, js: val}))}
                />
            }
        </div>
    </div>
  )
}

export default Web