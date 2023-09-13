import { Injectable, inject } from "@angular/core"
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  user,
  User,
} from "@angular/fire/auth"
import { Firestore, setDoc, doc, getDoc } from "@angular/fire/firestore"
import { RxState } from "@rx-angular/state"
import { firstValueFrom, from, map, of, switchMap } from "rxjs"
import { MyLocation, Profile } from "../shared/interfaces/app.interface"

interface UserRegisterDTO {
  email: string
  password: string
  name: string
  cpf: string
  location: string
}

export type CompleteUser = User & {
  cpf: string
  location: MyLocation
}

export interface AuthState {
  user: CompleteUser | null
}

@Injectable({
  providedIn: "root",
})
export class AuthService extends RxState<AuthState> {
  private _auth: Auth = inject(Auth)
  private _firestore = inject(Firestore)
  private _user$ = user(this._auth)

  constructor() {
    super()
    this.set({ user: null })
    this.connect(
      "user",
      this._user$.pipe(
        switchMap((user) => {
          if (!user) {
            return of(null)
          }
          return from(this.getProfile(user.uid)).pipe(
            map(({ cpf, location }) => ({
              ...user,
              cpf,
              location,
            })),
          )
        }),
      ),
    )
  }

  getUser() {
    return this.select("user")
  }

  getCurrentUserSnapshot() {
    return firstValueFrom(this.getUser())
  }
  async getCurrentUserOrThrow() {
    const currentUser = await firstValueFrom(this.getUser())
    if (!currentUser) throw new Error("User not logged in")
    return currentUser
  }

  async getProfile(userId: string) {
    const profileDocRef = doc(this._firestore, `profiles/${userId}`)
    const profileSnap = await getDoc(profileDocRef)
    const data = profileSnap.data() as Profile
    const { cpf, name } = data

    const locationRef = doc(this._firestore, `locations/${data.location}`)
    const locationSnap = await getDoc(locationRef)
    const location = locationSnap.data() as MyLocation
    return { cpf, location, name }
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this._auth, email, password)
  }

  async register(userData: UserRegisterDTO) {
    // TODO handle errors
    const { user } = await createUserWithEmailAndPassword(
      this._auth,
      userData.email,
      userData.password,
    )

    await updateProfile(user, {
      displayName: userData.name,
    })

    await setDoc(doc(this._firestore, "profiles", user.uid), {
      name: userData.name,
      cpf: userData.cpf,
      location: userData.location,
    })
  }

  async logout() {
    await this._auth.signOut()
  }
}
