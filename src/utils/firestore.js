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
    increment, 
    arrayUnion,
    Timestamp
} from 'firebase/firestore'
import { db } from './firebase';
import { uploadProfilePicture } from './bucket';

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
    try {
        const userData = await getDocument("users", userId)
    
        return userData
    } catch (err) {
        console.log(err)
        return false
    }
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

export const updateUserDetails = async (user, details) => {
    const photo = details.file
    let url = details.photoURL

    if(photo) {
        url = await uploadProfilePicture(photo, user)
    }

    await updateDocument('users', user.uid, {
        displayName: details.name,
        photoURL: url,
        bio: details.bio
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
    try {
        let q;

        if(param?.pageParam) {
            q = query(collection(db, "posts"), where("userId", "==", userId), where("isRepost", "==", false), orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10))
        } else {
            q = query(collection(db, "posts"), where("userId", "==", userId), where("isRepost", "==", false), orderBy('createdAt', 'desc'), limit(10))
        }

        const snapshot = await getDocs(q)
        const posts = [];
        let lastDoc = null;

        snapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
            lastDoc = doc;
        });

        return { posts, lastDoc }
    } catch(err) {
        console.log(err)
    }
}

export const getUserReposts = async (param, userId) => {
    try {
        let q;

        if(param?.pageParam) {
            q = query(collection(db, "posts"), where("userId", "==", userId), where("isRepost", "==", true), orderBy('createdAt', 'desc'), startAfter(param.pageParam), limit(10))
        } else {
            q = query(collection(db, "posts"), where("userId", "==", userId), where("isRepost", "==", true), orderBy('createdAt', 'desc'), limit(10))
        }

        const snapshot = await getDocs(q)
        const posts = [];
        let lastDoc = null;

        snapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
            lastDoc = doc;
        });

        return { posts, lastDoc }
    } catch(err) {
        console.log(err)
    }
}

export const getUserSavedPosts = async (param, userId) => {
    try {
        let q

        if(param?.pageParam) {
            q = query(collection(doc(db, "users", userId), "saved-posts"), orderBy("timestamp", "desc"), startAfter(param.pageParam), limit(10))
        } else {
            q = query(collection(doc(db, "users", userId), "saved-posts"), orderBy('timestamp', 'desc'), limit(10))
        }

        const snapshot = await getDocs(q)
        let lastDoc = null;

        const postPromises = snapshot.docs.map(async (savedPostDoc) => {
            const savedPostData = savedPostDoc.data();
            const postId = savedPostData.postId;

            return await getPost(postId)
        })
    
        const savedPosts = (await Promise.all(postPromises)).filter((post) => post !== null);

        console.log("done getting posts", savedPosts)
    
        if (snapshot.docs.length > 0) {
            lastDoc = snapshot.docs[snapshot.docs.length - 1];
        }
    
        return { posts: savedPosts, lastDoc };
    } catch(err) {
        console.log(err)
    }
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
        commentsCount: 0,
        repostCount: 0,
        isRepost: false
    })

    return docRef.id
}

export const addRepost = async (user, originalPostId) => {
    const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        repostCount: 0,
        isRepost: true,
        repostOf: originalPostId,
        quoted: false
    })

    await updateDoc(doc(db, "posts", originalPostId), {
        repostCount: increment(1)
    })

    return docRef.id
}

export const addQuotedRepost = async (user, originalPostId, content) => {
    console.log(content)
    const docRef = await addDoc(collection(db, "posts"), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
        repostCount: 0,
        isRepost: true,
        repostOf: originalPostId,
        quoted: true,
        content: content
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

export const savePost = async (postId, userId) => {
    try {
        const userDocRef = doc(db, "users", userId)
        const savedPostDocRef = doc(userDocRef, "saved-posts", postId)

        const savedPost = await getDoc(savedPostDocRef)

        if(savedPost.exists()) {
            await deleteDoc(savedPostDocRef)
            return true
        }

        await setDoc(savedPostDocRef, {
            postId: postId,
            timestamp: serverTimestamp()
        })
    } catch (err) {
        console.log(err)
    }
}

export const isPostSaved = async (postId, userId) => {
    try {
        const userDocRef = doc(db, "users", userId)
        const savedPostDocRef = doc(userDocRef, "saved-posts", postId)

        const savedPost = await getDoc(savedPostDocRef)

        return savedPost.exists()
    } catch (err) {
        console.log(err)
    }
}

export const pinPost = async (postId, userId) => {
    try {
        const userDocRef = doc(db, "users", userId)

        const userDoc = await getDoc(userDocRef)

        if(userDoc.data().pinnedPost === postId) {
            await updateDoc(userDocRef, {
                pinnedPost: null
            })
            return true
        }

        await updateDoc(userDocRef, {
            pinnedPost: postId
        })
    } catch (err) {
        console.log(err)
    }
}

export const isPostPinned = async (postId, userId) => {
    try {
        const userDocRef = doc(db, "users", userId)

        const userDoc = await getDoc(userDocRef)

        return userDoc.data().pinnedPost === postId
    } catch (err) {
        console.log(err)
    }
}

export const toggleMetrics = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId)

        const postDoc = await getDoc(postRef)

        if(postDoc.data().isMetricsHidden) {
            await updateDoc(postRef, {
                isMetricsHidden: false
            })
            return true
        }

        await updateDoc(postRef, {
            isMetricsHidden: true
        })
    } catch (err) {
        console.log(err)
    }
}

export const isPostMetricsHidden = async (postId) => {
    try {
        const postRef = doc(db, "posts", postId)

        const postDoc = await getDoc(postRef)

        return !!postDoc.data().isMetricsHidden && postDoc.data().isMetricsHidden
    } catch (err) {
        console.log(err)
    }
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

// Code Bits

export const createCodeBit = async (name, language, user) => {
    let codeObj = {}

    switch(language) {
        case "Web":
            codeObj = {
                html: '<h1>Hello World</h1>',
                css: '',
                js: ''
            }
            break;
        case "JavaScript":
            codeObj = 'console.log("Hello World")'
            break;
        case "Python":
            codeObj = `def greet(name):\n\tprint("Hello," + name + "!")\n\ngreet("Alex")\n`
            break;
        case "Java":
            codeObj = `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\tSystem.out.println("Hello World");\n\t}\n}`
            break;
        case "PHP":
            codeObj = `<?php\n\n$name = "Alex";\necho $name;\n`
            break;
        case "C#":
            codeObj = `using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n`
            break;
    }

    const docRef = await addDoc(collection(db, "codebits"), {
        title: name,
        language: language,
        author: user.uid,
        code: codeObj,
        createdAt: serverTimestamp(),
        public: false,
        likes: 0
    })

    return docRef.id
}

export const getCodeBit = async (codebitId) => {
    const codebitData = await getDocument("codebits", codebitId)
    const userData = await getUser(codebitData.author)

    return {...codebitData, author: {...userData}}
}

export const getCodeBits = async (filterBy, userId) => {
    let q

    switch(filterBy) {
        case 'mycodebits':
            q = query(collection(db, "codebits"), where('author', '==', userId), orderBy("createdAt", "desc"))
            break;
        case 'popular':
            q = query(collection(db, "codebits"), where('public', '==', true), orderBy("likes", "desc"))
            break;
        default:
            q = query(collection(db, "codebits"), where('public', '==', true), orderBy("createdAt", "desc"))
            break;
    }

    try {
        const snapshot = await getDocs(q)
    
        const docsPromises = snapshot.docs.map(async (doc) => {
            const data = doc.data()
            const author = await getUser(data.author)
            return { ...data, author: { ...author }, id: doc.id } 
        })
    
        const docs = await Promise.all(docsPromises);
        return docs; 
    } catch (err) {
        console.log(err)
    }
}

export const updateCodeBit = async (codebitId, updates) => {
    try {
        await updateDocument("codebits", codebitId, updates)
    } catch(err) {
        console.log(err)
    }
}

export const likeCodeBit = async(codebitId, userId) => {
    try {
        const codeBitRef = doc(db, "codebits", codebitId)
        const likesDocRef = doc(codeBitRef, "likes", userId)

        const likeDoc = await getDoc(likesDocRef)

        if(likeDoc.exists()) {
            await updateDoc(codeBitRef, { likes: increment(-1) })
            await deleteDoc(likesDocRef)
            return true
        }

        await updateDoc(codeBitRef, { likes: increment(1) })
        await setDoc(likesDocRef, {
            userId: userId,
            likedAt: serverTimestamp()
        })
    } catch(err) {
        console.log(err)
    }
}

export const hasLikedCodeBit = async (codebitId, userId) => {
    try {
        const codeBitRef = doc(db, "codebits", codebitId)
        const likesDocRef = doc(codeBitRef, "likes", userId)

        const likeDoc = await getDoc(likesDocRef)

        return likeDoc.exists()
    } catch(err) {
        console.log(err)
    }
}

export const deleteCodeBit = async (codebitId) => {
    await deleteDocument("codebits", codebitId)
}

// Code Breaker

export const addProblem = async (slug) => {
    await setDoc(doc(db, "codeproblems", slug), {
        slug: slug,
        likes: 0,
        submissions: 0,
        successSubmissions: 0
    })
}

export const getProblemData = async (slug) => {
    const problemData = await getDocument("codeproblems", slug)

    return problemData
}

export const getProblemUserData = async (slug, userId) => {
    try {
        const problemRef = doc(db, "codeproblems", slug)
        const userDocRef = doc(problemRef, "users", userId)

        const userDoc = await getDoc(userDocRef)

        return userDoc.exists() && userDoc.data()
    } catch(err) {
        console.log(err)
    }
}

export const likeProblem = async (slug, userId) => {
    try {
        const problemRef = doc(db, "codeproblems", slug)
        const userDocRef = doc(problemRef, "users", userId)

        const userDoc = await getDoc(userDocRef)
        const data = userDoc.exists() ? userDoc.data() : { liked: false }

        if(data.liked) {
            await updateDoc(problemRef, { likes: increment(-1) })
            await updateDoc(userDocRef, { liked: false })
            return true
        }

        await updateDoc(problemRef, { likes: increment(1) })
        await setDoc(userDocRef, {
            liked: true
        }, { merge: true })
    } catch(err) {
        console.log(err)
    }
}

export const submitProblem = async (slug, userId, data) => {
    try {
        const problemRef = doc(db, "codeproblems", slug)
        const userDocRef = doc(problemRef, "users", userId)

        const userDoc = await getDoc(userDocRef)
        if (!userDoc.exists()) {
            await setDoc(userDocRef, { submissions: [] }, { merge: true });
        } else if (!userDoc.data().submissions) {
            await updateDoc(userDocRef, { submissions: [] });
        }

        if(data.status === "accepted") {
            await updateDoc(problemRef, { successSubmissions: increment(1) })
            await updateDoc(userDocRef, { status: "accepted" })
        }

        await updateDoc(problemRef, { submissions: increment(1) })
        await updateDoc(userDocRef, {
            submissions: arrayUnion({
                ...data,
                timestamp: Timestamp.now()
            })
        })
    } catch(err) {
        console.log(err)
    }
}

// Duels

export const addDuel = async (slug, name) => {
    try {
        await setDoc(doc(db, "duels", slug), {
            slug: slug,
            submissions: 0,
            name: name
        })
    } catch(err) {
        console.log(err)
    }
}

export const submitDuel = async (slug, userId, data) => {
    try {
        const duelRef = doc(db, "duels", slug)
        const userDocRef = doc(duelRef, "users", userId)

        await setDoc(userDocRef, {
            ...data
        })
    } catch(err) {
        console.log(err)
    }
}

export const getUserDuelData = async (slug, userId) => {
    try {
        const duelRef = doc(db, "duels", slug)
        const userDocRef = doc(duelRef, "users", userId)

        const userDoc = await getDoc(userDocRef)

        return userDoc.exists() && userDoc.data()
    } catch(err) {
        console.log(err)
    }
}