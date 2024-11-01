import React, { useState } from 'react'
import { signInWithGoogle } from '../utils/authentication'
import { addUser, hasPhotoUrl, updatePhotoUrl } from '../utils/firestore'
import { useNavigate } from 'react-router'
import { FcGoogle } from "react-icons/fc"

const LoginButtons = () => {
    const nav = useNavigate()
    const [hasDP, setHasDP] = useState(false)

    const handleGoogleSignIn = async () => {
        const [userExists, user] = await signInWithGoogle()

        if(!userExists) {
            await addUser(user, '')
            nav('newuser')
            return
        }

        setHasDP(await hasPhotoUrl(user.uid))

        if(!hasDP) {
            await updatePhotoUrl(user.uid, user.photoURL)
        }
    }

  return (
    <div className='login-btns'>
        <button onClick={handleGoogleSignIn} className='google'>
            <FcGoogle />
            Sign in with Google
        </button>
    </div>
  )
}

export default LoginButtons