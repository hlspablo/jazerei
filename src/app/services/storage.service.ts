import { Injectable, inject } from "@angular/core"
import { Storage, getDownloadURL, uploadBytesResumable, ref } from "@angular/fire/storage"

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private _storage = inject(Storage)

  async uploadGameImages(selectedFiles: File[]): Promise<string[]> {
    const downloadURLs: string[] = []

    for (const [index, file] of selectedFiles.entries()) {
      const originalFilePath = `${file.name}_${new Date().getTime()}_${index}`
      const storageRef = ref(this._storage, originalFilePath)
      const uploadTask = uploadBytesResumable(storageRef, file)

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              console.log(`Upload of ${file.name} is ${progress}% done`)
            },
            (error) => {
              reject(error)
            },
            () => {
              resolve(null)
            },
          )
        })

        const resizedFilePath = `${originalFilePath}_950x600`
        const resizedRef = ref(this._storage, resizedFilePath)

        // Poll until the resized image becomes available
        let resizedURL = ""
        for (let i = 0; i < 3; i++) {
          // Only 3 attempts
          try {
            resizedURL = await getDownloadURL(resizedRef)
            if (resizedURL) {
              break
            }
          } catch (error) {
            console.log(`Resized image not yet available. Retrying in 2s. Attempt ${i + 1}`)
            await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
          }
        }

        if (!resizedURL) {
          throw new Error(`Resized image could not be found after 3 attempts`)
        }

        downloadURLs.push(resizedURL)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    return downloadURLs
  }
}
