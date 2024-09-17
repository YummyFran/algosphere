import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from "./firebase";

export const signUp = async (email, password) => {
    let user, err
  
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        user = userCredential.user
    } catch (error) {
        err = error
    }
  
    return [user, err]
}

export const signIn = async (email, password) => {
    let user, err
  
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        user = userCredential.user
    } catch (error) {
        err = error
    }
  
    return [user, err]
}
  
export const logOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        throw error
    }
}