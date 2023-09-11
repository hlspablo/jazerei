import { Injectable, inject } from "@angular/core"
import { Firestore, addDoc, collection } from "@angular/fire/firestore"
import { AuthService } from "../services/auth.service"
import { Storage, getDownloadURL, uploadBytesResumable, ref } from "@angular/fire/storage"

interface CreateGameDTO {
  name: string
  description: string
  consoleModel: string
  usedTime: string
  imagesUrls: string[]
}
@Injectable({
  providedIn: "root",
})
export class GameRepository {
  private _storage = inject(Storage)

  constructor(
    private _firestore: Firestore,
    private _authService: AuthService,
  ) {}

  uploadGameImages(selectedFiles: File[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      let uploadCount = 0
      const downloadURLs: string[] = []

      selectedFiles.forEach((file, index) => {
        const filePath = `${file.name}_${new Date().getTime()}_${index}`
        const storageRef = ref(this._storage, filePath)
        const uploadTask = uploadBytesResumable(storageRef, file)

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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              downloadURLs.push(downloadURL)
              uploadCount++

              if (uploadCount === selectedFiles.length) {
                resolve(downloadURLs)
              }
            })
          },
        )
      })
    })
  }

  async createGame(gameDTO: CreateGameDTO): Promise<void> {
    const user = await this._authService.getCurrentUserSnapshot()
    const { consoleModel, description, imagesUrls, name, usedTime } = gameDTO

    if (!user) {
      console.error("User is not authenticated")
      return
    }

    try {
      await addDoc(collection(this._firestore, "games"), {
        name,
        ownerName: user.displayName,
        ownerId: user.uid,
        description,
        consoleModel,
        usedTime,
        imagesUrls,
        approved: false,
      })
      console.log("Game document added successfully")
    } catch (error) {
      console.error("Error adding game document:", error)
    }
  }
}
