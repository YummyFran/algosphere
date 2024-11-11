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

export const userExists = async (uid) => {
    const res = await getDoc(doc(db, "users", uid))
    console.log(res.exists())
    return res.exists()
}

export const usernameExisted = async (username) => {
    const q = query(collection(db, "users"), where("username", '==', username))
    const snapshot = await getDocs(q)

    return !snapshot.empty
}

export const updateUsername = async (user, username) => {
    await updateDocument('users', user.uid, {
        username: username
    })
}

export const hasPhotoUrl = async (uid) => {
    const userData = await getUser(uid)

    return !!userData.photoURL
}

export const updatePhotoUrl = async (uid, url) => {
    await updateDocument('users', uid, {
        photoURL: url
    })
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

export const getLikedUsers = async (postId) => {
    const ref = collection(doc(db, "posts", postId), "likes")
    const snapshot = await getDocs(query(ref, orderBy("likedAt")))

    const likes = []

    snapshot.forEach(doc => {
        likes.push(doc.data().userId)
    })

    return likes
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

// Follows

export const followUser = async (currentUserId, userId) => {
    const currentUserRef = doc(db, "users", currentUserId)
    const userRef = doc(db, "users", userId)

    const followingCol = doc(currentUserRef, "following", userId)
    const followersCol = doc(userRef, "followers", currentUserId)

    await setDoc(followingCol, {
        userId: userId,
        followedAt: serverTimestamp()
    })

    await setDoc(followersCol, {
        userId: currentUserId,
        followedAt: serverTimestamp()
    })

    await updateDoc(currentUserRef, {
        followingCount: increment(1)
    })

    await updateDoc(userRef, {
        followersCount: increment(1)
    })
}

export const unFollowUser = async (currentUserId, userId) => {
    const currentUserRef = doc(db, "users", currentUserId)
    const userRef = doc(db, "users", userId)

    await deleteDoc(doc(currentUserRef, "following", userId))
    await deleteDoc(doc(userRef, "followers", currentUserId))

    await updateDoc(currentUserRef, {
        followingCount: increment(-1)
    })

    await updateDoc(userRef, {
        followersCount: increment(-1)
    })
}

export const checkIfFollowing = async (currentUserId, followedUserId) => {
    const docRef = doc(doc(db, "users", currentUserId), "following", followedUserId)
    const docSnap = await getDoc(docRef)
  
    return docSnap.exists()
}

export const getFollowing = async (userId) => {
    const snapshot = await getDocs(query(collection(doc(db, "users", userId), "following"), orderBy("followedAt", "desc")))

    const following = []

    snapshot.forEach(doc => {
        following.push(doc.data().userId)
    })

    return following
}

export const getFollowers = async (userId) => {
    const snapshot = await getDocs(query(collection(doc(db, "users", userId), "followers"), orderBy("followedAt", "desc")))

    const followers = []

    snapshot.forEach(doc => {
        followers.push(doc.data().userId)
    })

    return followers
}