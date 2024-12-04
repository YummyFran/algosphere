import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTheme } from '../provider/ThemeProvider'
import { useToast } from '../provider/ToastProvider'

import { getCodeBit, updateCodeBit } from '../utils/firestore'

import Web from '../components/Compilers/Web'
import CodeEditor from '../components/Compilers/CodeEditor'
import Split from 'react-split'
import { FaPlay } from "react-icons/fa"
import { Switch } from '@mui/material'
import { AiOutlineCloudUpload } from "react-icons/ai"
import { generateWebIframCode } from '../utils/helper'

import '../styles/codebit.css'
import { useUser } from '../provider/UserProvider'

const CodeBit = () => {
    const [webCode, setWebCode] = useState({html: '', css: '', js: ''})
    const [theme] = useTheme()
    const [addToast] = useToast()
    const [user] = useUser()
    const { codebitId } = useParams()
    const nav = useNavigate()
    const outputRef = useRef()
    const queryClient = useQueryClient()

    const {data: codebitData, isLoading} = useQuery({
        queryKey: ['codebit', codebitId],
        queryFn: async () => await getCodeBit(codebitId)
    })

    const {mutate: mutateCodeBit} = useMutation({
        mutationFn: async () => {
            if(codebitData.language === "Web") {
                await updateCodeBit(codebitId, {code: webCode})
            }
        },
        onSuccess: () => {
            addToast("Code Saved", "We've saved your latest masterpiece. Happy coding!")
        }
    })

    const {mutate: mutatePublic} = useMutation({
        mutationFn: async () => {
            if(codebitData.language === "Web") {
                await updateCodeBit(codebitId, {public: !codebitData.public})
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['codebit', codebitId]})
            addToast("Visibility Changed!", `Your code bit is now ${!codebitData.public ? "public" : "private"}`)
        }
    })

    const handlePublicChange = () => {
        mutatePublic()
    }

    const saveCode = () => {
        mutateCodeBit()
    }

    const executeCode = () => {
        if(!outputRef) return

        if(codebitData.language === "Web") {
            const outputDoc = outputRef.current.contentDocument || outputRef.current.contentWindow.document

            outputDoc.open()
            outputDoc.write(generateWebIframCode(webCode))
            outputDoc.close()

            return
        }
    }

    useEffect(() => {
        if(!codebitData) return

        if(codebitData.language === "Web") {
            setWebCode(codebitData.code)
        }
    }, [codebitData])

    useEffect(() => {

        const handleMessage = (event) => {
            if (event.data.type === 'iframe-error') {
              console.log('User Error: ', event.data.message)
              addToast("Code Error", event.data.message, "error")
            }
          }
        
        window.addEventListener('message', handleMessage)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    })

    if(!codebitData?.public && codebitData?.author.uid !== user?.uid) return "403 Forbidden"

    if(isLoading) return "Loading..."

  return (
    <div className={`code-bit-page primary-${theme}-bg midtone-${theme}`}>
        <div className="header">
            <div className="logo" onClick={() => nav(-1)}>
                <img src={`${process.env.PUBLIC_URL}/assets/logo.svg`} alt="algosphere logo" />
            </div>
            <div className="details">
                <div className="title">{codebitData.title}</div>
                <div className={`author mono-${theme}`}>@{codebitData.author.username}</div>
            </div>
            {codebitData?.author.uid === user?.uid && <div className="switch">
                <Switch size='small' checked={codebitData.public} onChange={() => handlePublicChange()}/>
                Public
            </div>}

            <div className="buttons">
                <button className={`run secondary-${theme}-bg midtone-${theme}`} onClick={() => executeCode()}>
                    <FaPlay />
                    Run Code
                </button>
                {codebitData?.author.uid === user?.uid && <button className={`save secondary-${theme}-bg accent-color`} onClick={() => saveCode()}>
                    <AiOutlineCloudUpload />
                    Save
                </button>}
            </div>
        </div>
        <div className="content">
            <Split className='split' gutterSize={15}>
                <div className="code-area">
                    {codebitData.language === "Web" ? 
                        <Web codebit={codebitData} code={webCode} setCode={setWebCode}/> :
                        <CodeEditor codebit={codebitData}/>
                    }
                </div>
                <div className="output">
                    <iframe className='output-frame' ref={outputRef}></iframe>
                </div>
            </Split>
        </div>
    </div>
  )
}

export default CodeBit