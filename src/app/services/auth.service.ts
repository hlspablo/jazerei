import { Injectable, inject } from "@angular/core"
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, user, User } from "@angular/fire/auth"
import { Firestore, setDoc, doc } from "@angular/fire/firestore"
import { RxState } from "@rx-angular/state"
import { firstValueFrom, map } from "rxjs"

interface UserData {
  email: string
  password: string
  name: string
  cpf: string
  location: string
}

interface AuthState {
  user: User | null
}

@Injectable({
  providedIn: "root",
})
export class AuthService extends RxState<AuthState>{
  private _auth: Auth = inject(Auth)
  private _firestore = inject(Firestore)
  private _user$ = user(this._auth)
  currentUser: User | null


  constructor() {
    super()
    this.set({ user: null })
    this.connect("user", this._user$)
  }

  getUser() {
    return this.select("user")
  }

  getCurrentUserSnapshot() {
    return firstValueFrom(this._user$)
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this._auth, email, password)
  }

  async register(userData: UserData) {
    const { user } = await createUserWithEmailAndPassword(this._auth, userData.email, userData.password)

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
