import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../provider/ThemeProvider'
import '../styles/playground.css'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Select from '../components/Select'
import { languagesOptions } from '../utils/helper'
import { createCodeBit } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../provider/ToastProvider'

const PlayGround = () => {
  const [newCodeBit, setNewCodeBit] = useState({name: '', language: ''})
  const [theme] = useTheme()
  const [user] = useUser()
  const nav = useNavigate()
  const [addToast] = useToast()
  const createRef = useRef()

  const selectSetter = (option) => {
    setNewCodeBit(prev => ({...prev, language: option.name}))
  }

  const {isPending, mutate: mutateCodeBit} = useMutation({
    mutationFn: async () => {
      const codeBitId = await createCodeBit(newCodeBit.name, newCodeBit.language, user)

      nav(`/codebit/${codeBitId}`)
    },
    onSuccess: () => {
      setNewCodeBit({name: '', language: ''})
      addToast("Code Bit Created!", "Happy Coding", "success")
    }
  })

  const handleCreate = async () => {
    mutateCodeBit()
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth'})
}, [])

  return (
    <div className={`playground primary-${theme}-bg midtone-${theme}`}>
      <div className="header">
        <h1>Playground</h1>
      </div>
      <div className="content">
        <div className="code-bits">
          <h2 className={`sub-header midtone-${theme}`}>Code Bits</h2>
          <div className={`tabs midton-${theme}`}>
            <NavLink to={'/playground'} className={({isActive}) => isActive ? 'active' : ''} end replace>Recents</NavLink>
            <NavLink to={'popular'} className={({isActive}) => isActive ? 'active' : ''} replace>Popular</NavLink>
            {/* <NavLink to={'followed'} className={({isActive}) => isActive ? 'active' : ''} replace>Followed</NavLink> */}
            <NavLink to={'mycodebits'} className={({isActive}) => isActive ? 'active' : ''} replace>My Code Bits</NavLink>
          </div>
          <div className="tab">
            <Outlet context={createRef}/>
          </div>
        </div>
        <div className="create">
          <h2 className={`sub-header midtone-${theme}`}>Create</h2>
          <div className="form">
            <label htmlFor="codebitname">Name</label>
            <input 
              id='codebitname'
              className={`secondary-${theme}-bg midtone-${theme}`} type="text" 
              placeholder="Enter code bit name" 
              value={newCodeBit.name} 
              onChange={e => setNewCodeBit(prev => ({...prev, name: e.target.value}))}
              ref={createRef}
            />
            <label htmlFor="language">Language</label>
            <Select id="language" className={`select secondary-${theme}-bg midtone-${theme}`} options={languagesOptions} setter={selectSetter}/>
            <button className='create-btn' disabled={newCodeBit.name === '' || newCodeBit.language === '' || isPending} onClick={() => handleCreate()}>{isPending ? "Creating" : "Create"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayGround