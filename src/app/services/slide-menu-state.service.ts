import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class SlideMenuStateService {
  private menuSubject = new BehaviorSubject<boolean>(false)
  menuSubject$ = this.menuSubject.asObservable()

  setMenu(open: boolean) {
    return this.menuSubject.next(open)
  }

  getMenuStatus() {
    return this.menuSubject.value
  }
  closeMenu() {
    return this.menuSubject.next(false)
  }

  toggleMenu() {
    return this.menuSubject.next(!this.menuSubject.value)
  }
}
