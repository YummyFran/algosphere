import React, { useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'
import { signIn } from '../utils/authentication'
import '../styles/login.css'

const Login = () => {
    const [user, loading] = useUser()
    const [error, setError] = useState("")

    const handleSubmit = async e => {
        e.preventDefault()

        const email = e.target[0].value
        const password = e.target[1].value

        const [user, err] = await signIn(email, password)

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
            <input type="text" placeholder='Email' autoComplete='on'/>
            <input type="password" placeholder='Password' autoComplete='on'/>
            <button>Log in</button>
            {error && <div className='error-message'>{error}</div>}
            <p>Don't have an account? <Link to="/signup" className='sign'>Sign up</Link></p>
        </form>
    </div>
  )
}

export default Login