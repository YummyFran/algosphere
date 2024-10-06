import { getDownloadURL, getMetadata, listAll, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { storage } from './firebase'
import { v4 } from 'uuid'

const uploadFile = async (file, path) => {
    if(!file) return

    const fileRef = ref(storage, path)

    await uploadBytes(fileRef, file)
}

const uploadFiles = async (files, path, setProgress) => {
    if(files.length === 0) return

    const promises = []

    files.forEach((file, i) => {
        const fileRef = ref(storage, `${path}/${v4()}.${file.name.split('.').pop()}`)

        const uploadTask = uploadBytesResumable(fileRef, file, { contentType: file.type })

        const promise = new Promise((res, reject) => {

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                setProgress(prev => {
                    const newProgress = [...prev]
                    newProgress[i] = progress

                    return newProgress
                })
            }, error => {
                console.error("Upload failed:", error)
                reject(error)
            }, () => {
                res()
            })
        })

        promises.push(promise)
    })

    await Promise.all(promises)
}

// Upload Medias from posts

export const uploadPostMedias = async (files, user, postId, setProgress) => {
    const path = `users/${user.uid}/posts/${postId}`

    await uploadFiles(files, `${path}`, setProgress)

    const res = await listAll(ref(storage, path))

    const urlsAndMetadata = await Promise.all(
        res.items.map(async item => {
            const metaData = await getMetadata(item)
            const url = await getDownloadURL(item)
            return { url, metaData }
        })
    )

    urlsAndMetadata.sort((a, b) => Date.parse(a.metaData.timeCreated) - Date.parse(b.metaData.timeCreated))

    const urls = urlsAndMetadata.map(item => item.url)

    return urls
}