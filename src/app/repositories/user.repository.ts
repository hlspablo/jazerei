import { Injectable, inject } from "@angular/core"
import { Firestore, doc, getDoc } from "@angular/fire/firestore"
import { MyLocation, Profile } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class UserRepository {
  private _firestore = inject(Firestore)

  async getProfile(userId: string) {
    try {
      const profileDocRef = doc(this._firestore, `profiles/${userId}`)
      const profileSnap = await getDoc(profileDocRef)
      const data = profileSnap.data() as Profile
      const { cpf, name } = data

      const locationRef = doc(this._firestore, `locations/${data.location}`)
      const locationSnap = await getDoc(locationRef)
      const location = locationSnap.data() as MyLocation
      return {
        cpf,
        location: {
          ...location,
          id: locationSnap.id,
        },
        name,
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
