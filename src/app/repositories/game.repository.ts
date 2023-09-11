import { Injectable, inject } from "@angular/core"
import { Firestore, QueryFieldFilterConstraint, QueryFilterConstraint, addDoc, collection, collectionData, query } from "@angular/fire/firestore"
import { AuthService } from "../services/auth.service"
import { Storage, getDownloadURL, uploadBytesResumable, ref } from "@angular/fire/storage"
import { Observable } from "rxjs"
import { GameFirebaseRow } from "../shared/interfaces/app.interface"

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
  private _firestore = inject(Firestore)
  private _authService = inject(AuthService)
  private _gamesCollection = collection(this._firestore, "games")



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
        description,
        ownerId: user.uid,
        owner: user.displayName,
        location: user.location.id,
        consoleModel,
        usedTime,
        imagesUrls,
        approved: false,
      })
      console.log("Game document added successfully")
    } catch (error) {
      // TODO handle errors
      console.error("Error adding game document:", error)
    }
  }

  getGames(queryConstraints: QueryFieldFilterConstraint[]) {
    const gamesQuery = query(this._gamesCollection, ...queryConstraints)
    return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
  }
}
