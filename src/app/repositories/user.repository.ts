import { Injectable, inject } from "@angular/core"
import { Firestore, doc, getDoc, setDoc } from "@angular/fire/firestore"
import { Profile } from "../shared/interfaces/app.interface"

@Injectable({
  providedIn: "root",
})
export class UserRepository {
  private _firestore = inject(Firestore)

  async createProfile(userId: string, { cpf, locationId, locationName, name }: Profile) {
    await setDoc(doc(this._firestore, "profiles", userId), {
      name,
      cpf,
      locationId,
      locationName,
    })
  }

  async getProfile(userId: string) {
    try {
      const profileDocRef = doc(this._firestore, `profiles/${userId}`)
      const profileSnap = await getDoc(profileDocRef)
      return profileSnap.data() as Profile
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
