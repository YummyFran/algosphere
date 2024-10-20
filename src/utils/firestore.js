import { 
    doc, 
    setDoc, 
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    collection,
    getDocs,
    where,
    orderBy,
    limit,
    startAfter,
    addDoc,
    onSnapshot,
    increment 
} from 'firebase/firestore'
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
        theme: 'light',
        createdAt: serverTimestamp()
    })
}

export const getUser = async (userId) => {
    const userData = await getDocument("users", userId)

    return userData
}

export const getUserByUsername = async (username) => {
    const q = query(collection(db, "users"), where("username", "==", username))
    const user = await getDocs(q)
    
    let data
    user.forEach(doc => {
        data = doc.data()
    })

    return data
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

export const getUserPosts = async (param, userId) => {
    let q;

    if(param?.pageParam) {
        q = query(collection(db, "posts"), where("userId", "==", userId), orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10))
    } else {
        q = query(collection(db, "posts"), where("userId", "==", userId), orderBy('createdAt', 'desc'), limit(10))
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

export const getPost = async (postId) => {
    const postData = await getDocument("posts", postId)

    return {id: postId, ...postData}
}

export const addPost = async (user, content) => {
    const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,  
        content: content.context,
        attachments: [],
        createdAt: serverTimestamp(), 
        likesCount: 0,  
        commentsCount: 0
    })

    return docRef.id
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
}

export const updatePost = async (postId, data) => {
    await updateDocument('posts', postId, data)
}

export const deletePost = async (postId) => {
    await deleteDocument('posts', postId)
}

// Likes

export const incrementLikes = async (postId, data, userId, parents) => {
    let parentRef;
    
    if(parents) {
        parentRef = doc(db, "posts", parents[0])
        parents.forEach((id, i) => {
            if(i === 0) return

            parentRef = doc(parentRef, "comments", id);
        })
    } else {
        parentRef = db
    }

    const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId)
    
    await updateDoc(postRef, {
        [data] : increment(1)
    })
    
    const col = doc(postRef, "likes", userId)

    await setDoc(col, {
        userId: userId,
        likedAt: serverTimestamp()
    })
}

export const decrementLikes = async (postId, data, userId, parents) => {
    let parentRef;
    
    if(parents) {
        parentRef = doc(db, "posts", parents[0])
        parents.forEach((id, i) => {
            if(i === 0) return

            parentRef = doc(parentRef, "comments", id);
        })
    } else {
        parentRef = db
    }

    const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId)
    
    await updateDoc(postRef, {
        [data] : increment(-1)
    })
    
    const col = doc(postRef, "likes", userId)

    await deleteDoc(col)
}

export const getCountData = async (postId) => {
    const data = await getDocument("posts", postId)
 
    return data.likesCount
}

export const isUserAlreadyLiked = async (postId, userId, parents) => {
    let parentRef;
    
    if(parents) {
        parentRef = doc(db, "posts", parents[0])
        parents.forEach((id, i) => {
            if(i === 0) return

            parentRef = doc(parentRef, "comments", id);
        })
    } else {
        parentRef = db
    }

    const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId)
    const col = doc(postRef, "likes", userId)

    const likeDoc = await getDoc(col)


    return likeDoc.exists()
}

// Comments

export const getComments = async (param = null, userId, postId, parents) => {
    let parentRef;
    if(parents) {
        parentRef = doc(db, "posts", parents[0])
        parents.forEach((id, i) => {
            if(i === 0) return

            parentRef = doc(parentRef, "comments", id);
        })
    } else {
        parentRef = db
    }

    const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId)
    const col = collection(postRef, "comments")

    let q;

    if(param?.pageParam) {
        q = query(col, orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10))
    } else {
        q = query(col, orderBy('createdAt', 'desc'), limit(10))
    }

    const snapshot = await getDocs(q)
    const comments = [];
    let lastDoc = null;

    snapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() });
        lastDoc = doc;
    });

    return { comments, lastDoc }
}

export const addComment = async (userId, postId, content, parents) => {
    let parentRef;
    
    if(parents) {
        parentRef = doc(db, "posts", parents[0])
        parents.forEach((id, i) => {
            if(i === 0) return

            parentRef = doc(parentRef, "comments", id);
        })
    } else {
        parentRef = db
    }

    const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId)
    const col = collection(postRef, "comments")
    
    await addDoc(col, {
        userId: userId,  
        content: content.context,
        attachments: content.attachments,  
        createdAt: serverTimestamp(), 
        likesCount: 0,  
        commentsCount: 0
    })
    
    const updateCommentCountRecursively = async (parents) => {
        if (parents && parents.length > 0) {
            let currentRef = doc(db, "posts", parents[0]);

            for (let i = 0; i < parents.length; i++) {
                if (i > 0) {
                    currentRef = doc(currentRef, "comments", parents[i]);
                }

                await updateDoc(currentRef, {
                    commentsCount: increment(1)
                });
            }

            await updateDoc(postRef, {
                commentsCount: increment(1)
            });
        } else {
            await updateDoc(doc(db, "posts", postId), {
                commentsCount: increment(1)
            });
        }
    };

    await updateCommentCountRecursively(parents);
}


// Theme

export const setTheme = async (user, theme) => {
    await addDocument('users', user.uid, { theme })
}

export const getTheme = async (user) => {
    const userData = await getDocument('users', user.uid)

    return userData.theme
}