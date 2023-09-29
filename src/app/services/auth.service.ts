import { Injectable, inject } from "@angular/core"
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  user,
  User,
} from "@angular/fire/auth"
import { RxState } from "@rx-angular/state"
import { from, map, of, switchMap } from "rxjs"
import { Router } from "@angular/router"
import { UserRepository } from "../repositories/user.repository"
import { Profile } from "../shared/interfaces/app.interface"

interface UserRegisterDTO {
  email: string
  password: string
  name: string
  cpf: string
  locationId: string
  locationName: string
}

export type CompleteUser = User & Profile

export interface AuthState {
  user: CompleteUser | null
}

@Injectable({
  providedIn: "root",
})
export class AuthService extends RxState<AuthState> {
  private _auth: Auth = inject(Auth)
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
            map((profile) => ({
              ...user,
              ...profile,
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

  async register({ cpf, email, locationId, locationName, name, password }: UserRegisterDTO) {
    try {
      const { user } = await createUserWithEmailAndPassword(this._auth, email, password)
      await updateProfile(user, {
        displayName: name,
      })

      this._userRepository.createProfile(user.uid, {
        cpf,
        locationId,
        locationName,
        name,
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async logout() {
    await this._auth.signOut()
    this._routerService.navigate(["/"])
  }
}
