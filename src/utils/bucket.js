import { getDownloadURL, getMetadata, listAll, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebase'
import { v4 } from 'uuid'

const uploadFile = async (file, path) => {
    if(!file) return

    const fileRef = ref(storage, path)

    await uploadBytes(fileRef, file)
}

const uploadFiles = async (files, path) => {
    if(files.length === 0) return

    const promises = []

    files.forEach(file => {
        const fileRef = ref(storage, `${path}/${v4()}.${file.name.split('.').pop()}`)

        promises.push(uploadBytes(fileRef, file, { contentType: file.type }))
    })

    await Promise.all(promises)
}

// Upload Medias from posts

export const uploadPostMedias = async (files, user, postId) => {
    const path = `users/${user.uid}/posts/${postId}`

    console.log("uploading files")
    await uploadFiles(files, `${path}`)
    console.log("files uploaded")

    const res = await listAll(ref(storage, path))

    const urlsAndMetadata = await Promise.all(
        res.items.map(async item => {
            const metaData = await getMetadata(item)
            const url = await getDownloadURL(item)
            return { url, metaData }
        })
    )

    console.log(urlsAndMetadata)

    urlsAndMetadata.sort((a, b) => Date.parse(a.metaData.timeCreated) - Date.parse(b.metaData.timeCreated))

    const urls = urlsAndMetadata.map(item => item.url)

    console.log(urls)

    return urls
}