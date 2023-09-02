import { Injectable, OnDestroy, inject } from "@angular/core"
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, user, User } from "@angular/fire/auth"
import * as fire from "@angular/fire/firestore"
import { Subscription } from "rxjs"

interface UserData {
  email: string
  password: string
  name: string
  cpf: string
  location: string
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
    const { user } = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password)

    await updateProfile(user, {
      displayName: userData.name,
    })

    await fire.setDoc(fire.doc(this.firestore, "profiles", user.uid), {
      name: userData.name,
      cpf: userData.cpf,
      location: userData.location,
    })
  }

  async logout() {
    await this.auth.signOut()
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe()
  }
}
