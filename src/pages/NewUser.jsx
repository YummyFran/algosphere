import React, { useEffect, useState } from 'react'
import { getUser, updateUsername, usernameExisted } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'

import '../styles/login.css'
import { validateUsername } from '../utils/helper'
import Loading from '../components/Loading'

const NewUser = () => {
    const [user] = useUser()
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [username, setUsername] = useState('')
    const [error, setError] = useState("")
    const [currentUserName, setCurrentUserName] = useState()

    const handleChange = e => {
        setUsername(e.target.value)
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if(await usernameExisted(username)) {
            setError(`${username} already exist`)
            return
        }

        if(!validateUsername(username)[0]) {
            setError(validateUsername(username)[1])
            return
        }

        await updateUsername(user, username)
        setCurrentUserName(username)
    }

    useEffect(() => {
        if(!user) return
        const checkUser = async () => {
            setLoading(true)
            const userData = await getUser(user?.uid)

            setCurrentUserName(userData?.username)
            setLoading(false)
        }

        checkUser()
    }, [user])

    useEffect(() => {
        if(!username) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [username])

    if(loading) return <Loading />
    if(currentUserName) return <Navigate to={'/'} />
  return (
    <div className='new-user'>
        <div className="header">
            <h1>AlgoSphere</h1>
            <p>Crack the Code, Sharpen Your Skills.</p>
        </div>
        <form className='form' onSubmit={handleSubmit}>
            <input type="text" placeholder='Username' name='username' autoComplete='on' required onChange={handleChange} value={username}/>
            <button disabled={disabled}>Get Started</button>
            {error && <div className='error-message'>{error}</div>}
        </form>
    </div>
  )
}

export default NewUser