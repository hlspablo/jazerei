import { Injectable, inject } from "@angular/core"
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  user,
  User,
} from "@angular/fire/auth"
import { Firestore, setDoc, doc } from "@angular/fire/firestore"
import { RxState } from "@rx-angular/state"
import { from, map, of, switchMap } from "rxjs"
import { MyLocation } from "../shared/interfaces/app.interface"
import { Router } from "@angular/router"
import { UserRepository } from "../repositories/user.repository"

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
  private _routerService = inject(Router)
  private _userRepository = inject(UserRepository)

  constructor() {
    super()
    this.connect(
      "user",
      this._user$.pipe(
        switchMap((user) => {
          if (!user) {
            return of(null)
          }
          return from(this._userRepository.getProfile(user.uid)).pipe(
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
    return this.get("user")
  }
  getCurrentUserOrThrow() {
    const currentUser = this.getCurrentUserSnapshot()
    if (!currentUser) throw new Error("User not logged in")
    return currentUser
  }
  isAuthenticated() {
    return this._user$.pipe(map((user) => !!user))
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this._auth, email, password)
  }

  async register(userData: UserRegisterDTO) {
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
    this._routerService.navigate(["/"])
  }
}
