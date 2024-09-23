import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp, query, collection, getDocs, where, orderBy, limit, startAfter, addDoc, onSnapshot, increment, arrayUnion, arrayRemove } from 'firebase/firestore'
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

export const addUser = async (user, username) => {

    await addDocument("users", user.uid, {
        uid: user.uid,
        displayName: user.displayName,
        username: username,
        photoURL: user.photoURL,
        email: user.email,
        bio: "Hello, I'm a new user",
        createdAt: serverTimestamp()
    })
}

export const getUser = async (user) => {
    const userData = await getDocument("users", user)

    return userData
}

export const usernameExisted = async (username) => {
    const q = query(collection(db, "users"), where("username", '==', username))
    const snapshot = await getDocs(q)

    return !snapshot.empty
}

// Posts

export const getPosts = async (param, lastVisible = null) => {
    let q;

    if(param.pageParam) {
        q = query(collection(db, "posts"), orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10))
    } else {
        q = query(collection(db, "posts"), orderBy('createdAt', 'desc'), limit(10))
    }

    const snapshot = await getDocs(q)
    const posts = [];
    let lastDoc = null;

    snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
        lastDoc = doc;
    });

    return { posts, lastDoc }
}

export const addPost = async (user, content) => {
    await addDoc(collection(db, "posts"), {
        postId: '', 
        userId: user.uid,  
        content: content.context,
        attachments: content.attachments,  
        createdAt: serverTimestamp(), 
        likesCount: 0,  
        commentsCount: 0,
        likes: []
    })
}

export const listenToPosts = (callback) => {
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        callback(posts);
    });

    return unsubscribe;
};

export const incrementData = async (postId, data, userId) => {
    const postRef = doc(db, "posts", postId)
    
    await updateDoc(postRef, {
        [data] : increment(1),
        likes: arrayUnion(userId)
    })
}

export const decrementData = async (postId, data, userId) => {
    const postRef = doc(db, "posts", postId)

    await updateDoc(postRef, {
        [data] : increment(-1),
        likes: arrayRemove(userId)
    })

}

export const getCountData = async (postId) => {
    const data = await getDocument("posts", postId)
 
    return data.likesCount
}

export const isUserAlreadyLiked = async (postId, userId) => {
    const likeDoc = await getDocument("posts", postId)
    const likes = likeDoc.likes

    return likes.includes(userId)
}