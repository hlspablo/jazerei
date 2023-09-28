import { Injectable, inject } from "@angular/core"
import { Firestore, collection, doc, getDoc, getDocs, setDoc } from "@angular/fire/firestore"
import { Rating } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class RatingRepository {
  private _firestore = inject(Firestore)

  async getRatingsItems(profileId: string): Promise<Rating[]> {
    try {
      const ratingsCollectionRef = collection(
        doc(this._firestore, "profiles", profileId),
        "ratings",
      )
      const querySnapshot = await getDocs(ratingsCollectionRef)
      return querySnapshot.docs.map((doc) => doc.data()) as Rating[]
    } catch (error) {
      console.error("Error getting ratings data: ", error)
      throw error
    }
  }

  async setRating(rateReceiver: string, userId: string, rating: number): Promise<void> {
    try {
      const ratingDocRef = doc(
        collection(doc(this._firestore, "profiles", rateReceiver), "ratings"),
        userId,
      )
      await setDoc(ratingDocRef, { rating }, { merge: true })
    } catch (error) {
      console.error("Error setting rating: ", error)
      throw error
    }
  }

  async getRating(profileId: string, userId: string): Promise<Rating | null> {
    try {
      const ratingDocRef = doc(
        collection(doc(this._firestore, "profiles", profileId), "ratings"),
        userId,
      )
      const docSnapshot = await getDoc(ratingDocRef)
      if (docSnapshot.exists()) {
        console.log("Exists")
        return docSnapshot.data() as Rating
      } else {
        return null
      }
    } catch (error) {
      console.error("Error getting rating: ", error)
      throw error
    }
  }
}
