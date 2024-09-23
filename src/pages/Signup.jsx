import React, { useEffect, useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'
import { signUp } from '../utils/authentication'
import { updateProfile } from 'firebase/auth'
import { addUser, usernameExisted } from '../utils/firestore'
import '../styles/login.css'

const Signup = () => {
    const [user, loading] = useUser()
    const [error, setError] = useState("")

    const [credentials, setCredentials] = useState({username: '', email: '', password: '', displayName: ''})
    const [disabled, setDisabled] = useState(true)

    const handleSubmit = async e => {
        e.preventDefault()

        if(await usernameExisted(credentials.username)) {
            setError(`${credentials.username} already exist`)
            return
        }

        const [user, err] = await signUp(credentials.email, credentials.password)

        if(err) {
            setError(err.code)
            return
        }

        await updateProfile(user, {
            displayName: credentials.displayName
        })

        await addUser(user, credentials.username)
    }

    const handleChange = e => {
        setCredentials(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    useEffect(() => {
        if(credentials.email && 
            credentials.password && 
            credentials.username &&
            credentials.displayName) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [credentials])

    if (!loading && user) return <Navigate to='/'/>
    if (loading) return "loading..."

  return (
    <div className='login'>
        <div className="header">
            <h1>AlgoSphere</h1>
            <p>Crack the Code, Sharpen Your Skills.</p>
        </div>
        <form className='form' onSubmit={handleSubmit}>
                <input type="text" placeholder='Display Name' name='displayName' required onChange={handleChange} />
            <input type="text" placeholder='Username' name='username' autoComplete='on' required onChange={handleChange}/>
            <input type="text" placeholder='Email' name='email' autoComplete='on' required onChange={handleChange}/>
            <input type="password" placeholder='Password' name='password' autoComplete='on'required onChange={handleChange}/>
            <button disabled={disabled}>Sign up</button>
            {error && <div className='error-message'>{error}</div>}
            <p>Already have an account? <Link to="/login" className='sign'>Sign in</Link></p>
        </form>
    </div>
  )
}

export default Signup