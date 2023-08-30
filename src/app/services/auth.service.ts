import { Injectable, OnDestroy, inject } from "@angular/core"
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  user,
  User,
} from "@angular/fire/auth"
import * as fire from "@angular/fire/firestore"
import { Subject, Subscription } from "rxjs"

interface UserData {
  email: string
  password: string
  name: string
  cpf: string
}

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private auth: Auth = inject(Auth)
  private firestore: fire.Firestore = inject(fire.Firestore)
  user$ = user(this.auth)
  userSubscription: Subscription
  currentUser: User | null

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      this.currentUser = aUser
    })
  }

  getCachedUser(): User | null {
    return this.currentUser
  }

  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password)
  }

  async register(userData: UserData) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password,
      )

      await updateProfile(user, {
        displayName: userData.name,
      })

      try {
        fire.setDoc(fire.doc(this.firestore, "profiles", user.uid), {
          name: userData.name,
          cpf: userData.cpf,
        })
      } catch (error) {
        console.error("failed firestore", error)
      }
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  async logout() {
    try {
      await this.auth.signOut()
      console.log("Logout successful")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }
}
