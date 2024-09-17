import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase';

export const addDocument = async (collectionName, docId, data) => {
    try {
        await setDoc(doc(db, collectionName, docId), data, { merge: true });
    } catch (error) {
        throw error;
    }
};

export const getDocument = async (collectionName, docId) => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        return docSnap.data();
        } else {
        throw new Error("Document not found");
        }
    } catch (error) {
        throw error;
    }
};

export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        throw error;
    }
};

export const deleteDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
        throw error;
    }
};

// Users

export const addUser = async (user) => {

    await addDocument("users", user.uid, {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        bio: "Hello, I'm a new user",
        createdAt: serverTimestamp()
    })
}