import React, { useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'
import { signUp } from '../utils/authentication'
import { updateProfile } from 'firebase/auth'
import { addUser } from '../utils/firestore'
import '../styles/login.css'

const Signup = () => {
    const [user, loading] = useUser()
    const [error, setError] = useState("")

    const handleSubmit = async e => {
        e.preventDefault()

        const username = e.target[0].value.slice(0,1).toUpperCase() + e.target[0].value.slice(1).toLowerCase()
        const email = e.target[1].value
        const password = e.target[2].value

        const [user, err] = await signUp(email, password)

        await updateProfile(user, {
            displayName: username
        })

        await addUser(user)

        if(err) {
            setError(err.code)
        }
    }

    if (!loading && user) return <Navigate to='/'/>
    if (loading) return "loading..."

  return (
    <div className='login'>
        <div className="header">
            <h1>AlgoSphere</h1>
            <p>Crack the Code, Sharpen Your Skills.</p>
        </div>
        <form className='form' onSubmit={handleSubmit}>
            <input type="text" placeholder='Username' autoComplete='on'/>
            <input type="text" placeholder='Email' autoComplete='on'/>
            <input type="password" placeholder='Password' autoComplete='on'/>
            <button>Sign up</button>
            {error && <div className='error-message'>{error}</div>}
            <p>Already have an account? <Link to="/login" className='sign'>Sign in</Link></p>
        </form>
    </div>
  )
}

export default Signup