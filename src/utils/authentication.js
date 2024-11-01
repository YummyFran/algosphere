import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth'
import { auth, google } from "./firebase";
import { userExists } from './firestore';

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

export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, google)
        const isExisting = await userExists(res.user.uid)

        return [isExisting, res.user]
    } catch (error) {
        console.error("An error occurred:", error)
    }
}
  
export const logOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        throw error
    }
}