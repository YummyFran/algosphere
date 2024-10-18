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

// Generic Error Handler
const handleError = (error) => {
    console.error('Firebase Error:', error);
    return { error: error.message || 'An unexpected error occurred.' };
};

// Generic Add Document
export const addDocument = async (collectionName, docId, data) => {
    try {
        await setDoc(doc(db, collectionName, docId), data, { merge: true });
    } catch (error) {
        return handleError(error);
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
        return handleError(error);
    }
};

export const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        return handleError(error);
    }
};

export const deleteDocument = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
        return handleError(error);
    }
};

// Users

export const addUser = async (user, username) => {
    try {
        await addDocument("users", user.uid, {
            uid: user.uid,
            displayName: user.displayName,
            username: username,
            photoURL: user.photoURL,
            email: user.email,
            bio: "Hello, I'm a new user",
            theme: 'light',
            createdAt: serverTimestamp()
        });
    } catch (error) {
        return handleError(error);
    }
};

export const getUser = async (userId) => {
    return await getDocument("users", userId);
};

export const usernameExisted = async (username) => {
    try {
        const q = query(collection(db, "users"), where("username", '==', username));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        return handleError(error);
    }
};

// Posts

export const getPosts = async (param, lastVisible = null) => {
    try {
        let q;
        if (param.pageParam) {
            q = query(
                collection(db, "posts"), 
                orderBy('createdAt', 'desc'), 
                startAfter(param.pageParam), 
                limit(10)
            );
        } else {
            q = query(collection(db, "posts"), orderBy('createdAt', 'desc'), limit(10));
        }

        const snapshot = await getDocs(q);
        const posts = [];
        let lastDoc = null;

        snapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
            lastDoc = doc;
        });

        return { posts, lastDoc };
    } catch (error) {
        return handleError(error);
    }
};

export const getPost = async (postId) => {
    const postData = await getDocument("posts", postId);
    return { id: postId, ...postData };
};

export const addPost = async (user, content) => {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            userId: user.uid,
            content: content.context,
            attachments: [],
            createdAt: serverTimestamp(),
            likesCount: 0,
            commentsCount: 0
        });
        return docRef.id;
    } catch (error) {
        return handleError(error);
    }
};

export const listenToPosts = (callback) => {
    try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
            const posts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(posts);
        });
        return unsubscribe;
    } catch (error) {
        console.error('Error in listening to posts:', error);
    }
};

export const updatePost = async (postId, data) => {
    return await updateDocument('posts', postId, data);
};

// Likes

export const incrementLikes = async (postId, data, userId, parents) => {
    try {
        let parentRef = getParentRef(parents);
        const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId);

        await updateDoc(postRef, { [data]: increment(1) });

        await setDoc(doc(postRef, "likes", userId), {
            userId: userId,
            likedAt: serverTimestamp()
        });
    } catch (error) {
        return handleError(error);
    }
};

export const decrementLikes = async (postId, data, userId, parents) => {
    try {
        let parentRef = getParentRef(parents);
        const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId);

        await updateDoc(postRef, { [data]: increment(-1) });
        await deleteDoc(doc(postRef, "likes", userId));
    } catch (error) {
        return handleError(error);
    }
};

// Helper to get parent reference
const getParentRef = (parents) => {
    let parentRef = db;
    if (parents) {
        parentRef = doc(db, "posts", parents[0]);
        parents.forEach((id, i) => {
            if (i > 0) {
                parentRef = doc(parentRef, "comments", id);
            }
        });
    }
    return parentRef;
};

export const getCountData = async (postId) => {
    const data = await getDocument("posts", postId);
    return data.likesCount;
};

export const isUserAlreadyLiked = async (postId, userId, parents) => {
    try {
        let parentRef = getParentRef(parents);
        const likeDoc = await getDoc(doc(parentRef, "likes", userId));
        return likeDoc.exists();
    } catch (error) {
        return handleError(error);
    }
};

// Comments

export const getComments = async (param = null, userId, postId, parents) => {
    try {
        let parentRef = getParentRef(parents);
        const postRef = doc(parentRef, `${parents ? "comments" : "posts"}`, postId);
        const col = collection(postRef, "comments");

        let q;
        if (param?.pageParam) {
            q = query(col, orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10));
        } else {
            q = query(col, orderBy('createdAt', 'desc'), limit(10));
        }

        const snapshot = await getDocs(q);
        const comments = [];
        let lastDoc = null;

        snapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
            lastDoc = doc;
        });

        return { comments, lastDoc };
    } catch (error) {
        return handleError(error);
    }
};

export const addComment = async (userId, postId, content, parents) => {
    try {
        let parentRef = getParentRef(parents);
        const col = collection(doc(parentRef, `${parents ? "comments" : "posts"}`, postId), "comments");

        await addDoc(col, {
            userId: userId,
            content: content.context,
            attachments: content.attachments,
            createdAt: serverTimestamp(),
            likesCount: 0,
            commentsCount: 0
        });

        await updateCommentCountRecursively(parents, postId);
    } catch (error) {
        return handleError(error);
    }
};

const updateCommentCountRecursively = async (parents, postId) => {
    let currentRef = doc(db, "posts", parents[0]);
    for (let i = 1; i < parents.length; i++) {
        currentRef = doc(currentRef, "comments", parents[i]);
    }
    await updateDoc(currentRef, { commentsCount: increment(1) });
};

// Theme

export const setTheme = async (user, theme) => {
    return await addDocument('users', user.uid, { theme });
};

export const getTheme = async (user) => {
    const userData = await getDocument('users', user.uid);
    return userData.theme;
};
