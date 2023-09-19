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
  private _firestore = inject(Firestore)
  private _authService = inject(AuthService)
  private _gamesCollection = collection(this._firestore, "games")

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
      console.error("Error adding game document:", error)
    }
  }

  getGamesSearch(queryConstraints: QueryFieldFilterConstraint[]) {
    const gamesQuery = query(this._gamesCollection, ...queryConstraints, limit(12))
    return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
  }

  getGamesOrderBy(queryConstraints: QueryFieldFilterConstraint[]) {
    const gamesQuery = query(
      this._gamesCollection,
      ...queryConstraints,
      orderBy("createdAt", "desc"),
      limit(12),
    )
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
      limit(12),
    )
    if (latestDocSnapshot) {
      gamesQuery = query(gamesQuery, startAfter(latestDocSnapshot))
    }
    return collectionData(gamesQuery, { idField: "id" }) as Observable<GameFirebaseRow[]>
  }

  async getGameSnapshot(gameId: string) {
    const gameDoc = doc(this._gamesCollection, gameId)
    return getDoc(gameDoc)
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
      console.error("Error deleting game document:", error)
    }
  }
}
