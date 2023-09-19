import { Injectable, inject } from "@angular/core"
import {
  Firestore,
  QueryFieldFilterConstraint,
  Timestamp,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  limit,
  orderBy,
  query,
  startAfter,
} from "@angular/fire/firestore"
import { AuthService } from "../services/auth.service"
import { Storage, getDownloadURL, uploadBytesResumable, ref } from "@angular/fire/storage"
import { Observable } from "rxjs"
import { GameFirebaseRow } from "../shared/interfaces/app.interface"
import { DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore"

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

  async createGame(gameData: CreateGameDTO): Promise<void> {
    const user = this._authService.getCurrentUserOrThrow()
    const { consoleModel, description, imagesUrls, name, usedTime } = gameData

    try {
      await addDoc(collection(this._firestore, "games"), {
        name,
        description,
        createdAt: Timestamp.now(),
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

  getGamesFilter(queryConstraints: QueryFieldFilterConstraint[]) {
    const gamesQuery = query(this._gamesCollection, ...queryConstraints, limit(12))
    return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
  }

  getGamesStartAfter(
    queryConstraints: QueryFieldFilterConstraint[],
    latestDocSnapshot: DocumentSnapshot<DocumentData> | null,
  ): Observable<GameFirebaseRow[]> {
    let gamesQuery = query(
      this._gamesCollection,
      ...queryConstraints,
      orderBy("createdAt", "desc"),
      limit(2),
    )
    if (latestDocSnapshot) {
      gamesQuery = query(gamesQuery, startAfter(latestDocSnapshot))
    }
    return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
  }

  async getGameSnapshot(gameId: string) {
    const gameDoc = doc(this._gamesCollection, gameId)
    const gameDocSnapshot = await getDoc(gameDoc)
    return gameDocSnapshot
  }

  getGameById(gameId: string) {
    const gameDoc = doc(this._gamesCollection, gameId)
    return docData(gameDoc, {
      idField: "id",
    }) as Observable<GameFirebaseRow>
  }

  async deleteGameById(gameId: string): Promise<void> {
    try {
      const gameDoc = doc(this._gamesCollection, gameId)
      await deleteDoc(gameDoc)
      console.log("Game document deleted successfully")
    } catch (error) {
      // TODO handle errors
      console.error("Error deleting game document:", error)
    }
  }
}
