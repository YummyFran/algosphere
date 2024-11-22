import React, { useEffect, useState } from 'react'
import { useUser } from '../provider/UserProvider'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'
import { signIn } from '../utils/authentication'
import '../styles/login.css'
import LoginButtons from '../components/LoginButtons'

const Login = () => {
    const [user, loading] = useUser()
    const [error, setError] = useState("")
    
    const [credentials, setCredentials] = useState({ email: '', password: ''})
    const [disabled, setDisabled] = useState(true)

    const handleSubmit = async e => {
        e.preventDefault()

        const [, err] = await signIn(credentials.email, credentials.password)

        if(err) {
            setError(err.code)
        }
    }

    const handleChange = e => {
        setCredentials(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    useEffect(() => {
        if(credentials.email && credentials.password) {
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
            <input type="text" placeholder='Email' name='email' value={credentials.email} autoComplete='on' required onChange={handleChange}/>
            <input type="password" placeholder='Password' name='password' value={credentials.password} autoComplete='on' required onChange={handleChange}/>
            <button disabled={disabled}>Log in</button>
            {error && <div className='error-message'>{error}</div>}
            <p>Don't have an account? <Link to="/signup" className='sign'>Sign up</Link></p>
            <LoginButtons />
        </form>
    </div>
  )
}

export default Login